import "dotenv/config";
import { URL } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { Client } from "pg";

const demoAccounts = [
  {
    key: "admin",
    emailEnv: "DEMO_ADMIN_EMAIL",
    passwordEnv: "DEMO_ADMIN_PASSWORD",
    role: "admin",
    provider: "admin",
    username: "demoadmin",
    nickname: "Demo Admin",
  },
  {
    key: "kakao",
    emailEnv: "DEMO_KAKAO_EMAIL",
    passwordEnv: "DEMO_KAKAO_PASSWORD",
    role: "user",
    provider: "kakao",
    username: "demokakao",
    nickname: "Demo Kakao",
  },
  {
    key: "google",
    emailEnv: "DEMO_GOOGLE_EMAIL",
    passwordEnv: "DEMO_GOOGLE_PASSWORD",
    role: "user",
    provider: "google",
    username: "demogoogle",
    nickname: "Demo Google",
  },
  {
    key: "github",
    emailEnv: "DEMO_GITHUB_EMAIL",
    passwordEnv: "DEMO_GITHUB_PASSWORD",
    role: "user",
    provider: "github",
    username: "demogithub",
    nickname: "Demo GitHub",
  },
];

function requireEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is required.`);
  }
  return value;
}

function getProjectRef(url) {
  return new URL(url).hostname.split(".")[0] || null;
}

function maskEmail(email) {
  const [localPart, domain] = email.split("@");
  if (!domain) return email;
  if (localPart.length <= 2) return `${localPart[0] ?? "*"}*@${domain}`;
  return `${localPart.slice(0, 2)}***@${domain}`;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function loadDemoAccounts() {
  return demoAccounts.map((account) => ({
    ...account,
    email: requireEnv(account.emailEnv),
    password: requireEnv(account.passwordEnv),
  }));
}

async function listAuthUsers(supabase) {
  const { data, error } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (error) {
    throw error;
  }

  return data.users;
}

async function ensureAuthUser(supabase, account, existingUsers) {
  const existingUser = existingUsers.find(
    (user) => user.email?.toLowerCase() === account.email.toLowerCase(),
  );

  const payload = {
    email: account.email,
    password: account.password,
    email_confirm: true,
    user_metadata: {
      user_name: account.username,
      full_name: account.nickname,
      name: account.nickname,
      provider: account.provider,
    },
    app_metadata: {
      role: account.role,
      demo: true,
      demoProvider: account.provider,
    },
  };

  if (existingUser) {
    const { data, error } = await supabase.auth.admin.updateUserById(existingUser.id, payload);
    if (error) {
      throw error;
    }
    return { userId: data.user.id, authAction: "updated" };
  }

  const { data, error } = await supabase.auth.admin.createUser(payload);
  if (error) {
    throw error;
  }

  if (!data.user) {
    throw new Error("Supabase did not return a user after createUser.");
  }

  return { userId: data.user.id, authAction: "created" };
}

async function ensureDatabaseUser(databaseUrl, account, userId) {
  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();

  try {
    await client.query("begin");

    const { rows: emailRows } = await client.query(
      "select user_id, email from public.users where lower(email) = lower($1);",
      [account.email],
    );
    const conflictingEmailRow = emailRows.find((row) => row.user_id !== userId);
    if (conflictingEmailRow) {
      throw new Error(
        `Demo DB already has a different user for ${account.email}. user_id=${conflictingEmailRow.user_id}`,
      );
    }

    const { rows: identityRows } = await client.query(
      "select user_id from public.users where user_id = $1;",
      [userId],
    );
    const { rows: uniqueRows } = await client.query(
      "select user_id, username, nickname from public.users where username = $1 or nickname = $2;",
      [account.username, account.nickname],
    );
    const conflictingUniqueRow = uniqueRows.find((row) => row.user_id !== userId);
    if (conflictingUniqueRow) {
      throw new Error(
        `Demo DB already has a different user using username/nickname for ${account.key}. user_id=${conflictingUniqueRow.user_id}`,
      );
    }

    if (identityRows.length > 0) {
      await client.query(
        `
          update public.users
             set email = $2,
                 username = $3,
                 nickname = $4,
                 role = $5::public.user_role,
                 profile_url = null,
                 updated_at = now()
           where user_id = $1;
        `,
        [userId, account.email, account.username, account.nickname, account.role],
      );
      await client.query("commit");
      return { dbAction: "updated", dbMode: "direct-db" };
    }

    await client.query(
      `
        insert into public.users (user_id, email, username, nickname, role, profile_url)
        values ($1, $2, $3, $4, $5::public.user_role, null);
      `,
      [userId, account.email, account.username, account.nickname, account.role],
    );
    await client.query("commit");
    return { dbAction: "created", dbMode: "direct-db" };
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    await client.end();
  }
}

async function ensureDatabaseUserViaDataApi(supabase, account, userId) {
  const { data: emailRows, error: emailError } = await supabase
    .from("users")
    .select("user_id, email")
    .eq("email", account.email);
  if (emailError) {
    throw emailError;
  }

  const conflictingEmailRow = (emailRows ?? []).find((row) => row.user_id !== userId);
  if (conflictingEmailRow) {
    throw new Error(
      `Demo DB already has a different user for ${account.email}. user_id=${conflictingEmailRow.user_id}`,
    );
  }

  const { data: identityRow, error: identityError } = await supabase
    .from("users")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();
  if (identityError) {
    throw identityError;
  }

  const { data: uniqueRows, error: uniqueError } = await supabase
    .from("users")
    .select("user_id, username, nickname")
    .or(`username.eq.${account.username},nickname.eq.${account.nickname}`);
  if (uniqueError) {
    throw uniqueError;
  }

  const conflictingUniqueRow = (uniqueRows ?? []).find((row) => row.user_id !== userId);
  if (conflictingUniqueRow) {
    throw new Error(
      `Demo DB already has a different user using username/nickname for ${account.key}. user_id=${conflictingUniqueRow.user_id}`,
    );
  }

  const payload = {
    user_id: userId,
    email: account.email,
    username: account.username,
    nickname: account.nickname,
    role: account.role,
    profile_url: null,
  };

  if (identityRow) {
    const { error } = await supabase.from("users").update(payload).eq("user_id", userId);
    if (error) {
      throw error;
    }
    return { dbAction: "updated", dbMode: "data-api-fallback" };
  }

  const { error } = await supabase.from("users").insert(payload);
  if (error) {
    throw error;
  }

  return { dbAction: "created", dbMode: "data-api-fallback" };
}

async function ensureDatabaseUserViaDataApiWithRetry(supabase, account, userId) {
  let lastError;

  for (let attempt = 1; attempt <= 5; attempt += 1) {
    try {
      return await ensureDatabaseUserViaDataApi(supabase, account, userId);
    } catch (error) {
      lastError = error;
      const code = error?.code;

      if (code !== "PGRST002" || attempt === 5) {
        throw error;
      }

      console.warn(
        `Demo Supabase Data API schema cache is not ready yet. Retry ${attempt}/5...`,
      );
      await sleep(1500 * attempt);
    }
  }

  throw lastError;
}

async function ensureDatabaseUserWithFallback(databaseUrl, supabase, account, userId) {
  try {
    return await ensureDatabaseUser(databaseUrl, account, userId);
  } catch (error) {
    console.warn(
      `Direct demo DB connection failed for ${account.key}. Falling back to the demo Supabase Data API.`,
    );
    console.warn(error instanceof Error ? error.message : String(error));
    return ensureDatabaseUserViaDataApiWithRetry(supabase, account, userId);
  }
}

async function main() {
  const demoSupabaseUrl = requireEnv("DEMO_SUPABASE_ID");
  const demoSupabaseKey = requireEnv("DEMO_SUPABASE_KEY");
  const demoDatabaseUrl = requireEnv("DEMO_DATABASE_URL");
  const accounts = loadDemoAccounts();

  const productionSupabaseUrl = process.env.SUPABASE_ID?.trim();
  const productionDatabaseUrl = process.env.DATABASE_URL?.trim();

  if (productionSupabaseUrl && productionSupabaseUrl === demoSupabaseUrl) {
    throw new Error("DEMO_SUPABASE_ID matches SUPABASE_ID. Aborting for safety.");
  }

  if (productionDatabaseUrl && productionDatabaseUrl === demoDatabaseUrl) {
    throw new Error("DEMO_DATABASE_URL matches DATABASE_URL. Aborting for safety.");
  }

  const demoProjectRef = getProjectRef(demoSupabaseUrl);
  const productionProjectRef = productionSupabaseUrl
    ? getProjectRef(productionSupabaseUrl)
    : null;

  if (demoProjectRef && productionProjectRef && demoProjectRef === productionProjectRef) {
    throw new Error("Demo Supabase project matches production project. Aborting for safety.");
  }

  const supabase = createClient(demoSupabaseUrl, demoSupabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const existingUsers = await listAuthUsers(supabase);
  const results = [];

  for (const account of accounts) {
    const { userId, authAction } = await ensureAuthUser(supabase, account, existingUsers);
    const { dbAction, dbMode } = await ensureDatabaseUserWithFallback(
      demoDatabaseUrl,
      supabase,
      account,
      userId,
    );

    results.push({
      key: account.key,
      email: account.email,
      role: account.role,
      authAction,
      dbAction,
      dbMode,
      username: account.username,
      nickname: account.nickname,
      userId,
    });

    const existingIndex = existingUsers.findIndex(
      (user) => user.email?.toLowerCase() === account.email.toLowerCase(),
    );
    if (existingIndex === -1) {
      existingUsers.push({ id: userId, email: account.email });
    }
  }

  console.log("Demo accounts are ready.");
  console.log(`Project: ${demoProjectRef}`);
  results.forEach((result) => {
    console.log(
      `[${result.key}] ${maskEmail(result.email)} role=${result.role} auth=${result.authAction} db=${result.dbAction} via=${result.dbMode} user_id=${result.userId} username=${result.username} nickname=${result.nickname}`,
    );
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
