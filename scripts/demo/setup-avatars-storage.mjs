import "dotenv/config";
import { URL } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { Client } from "pg";

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

async function ensureBucket(supabase) {
  const { data: existingBucket, error: getBucketError } = await supabase.storage.getBucket("avatars");

  if (getBucketError && getBucketError.message !== "Bucket not found") {
    throw getBucketError;
  }

  if (!existingBucket) {
    const { error } = await supabase.storage.createBucket("avatars", {
      public: true,
      allowedMimeTypes: ["image/*"],
      fileSizeLimit: "1MB",
    });
    if (error) {
      throw error;
    }
    return "created";
  }

  const { error } = await supabase.storage.updateBucket("avatars", {
    public: true,
    allowedMimeTypes: ["image/*"],
    fileSizeLimit: "1MB",
  });
  if (error) {
    throw error;
  }
  return "updated";
}

async function ensurePolicies(databaseUrl) {
  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();

  try {
    await client.query(`
      drop policy if exists "Avatar images are publicly readable" on storage.objects;
      create policy "Avatar images are publicly readable"
      on storage.objects
      for select
      to public
      using (bucket_id = 'avatars');

      drop policy if exists "Users can upload their own avatar" on storage.objects;
      create policy "Users can upload their own avatar"
      on storage.objects
      for insert
      to authenticated
      with check (
        bucket_id = 'avatars'
        and (storage.foldername(name))[1] = (select auth.uid()::text)
      );

      drop policy if exists "Users can update their own avatar" on storage.objects;
      create policy "Users can update their own avatar"
      on storage.objects
      for update
      to authenticated
      using (
        bucket_id = 'avatars'
        and (storage.foldername(name))[1] = (select auth.uid()::text)
      )
      with check (
        bucket_id = 'avatars'
        and (storage.foldername(name))[1] = (select auth.uid()::text)
      );

      drop policy if exists "Users can delete their own avatar" on storage.objects;
      create policy "Users can delete their own avatar"
      on storage.objects
      for delete
      to authenticated
      using (
        bucket_id = 'avatars'
        and (storage.foldername(name))[1] = (select auth.uid()::text)
      );
    `);
  } finally {
    await client.end();
  }
}

async function main() {
  const demoSupabaseUrl = requireEnv("DEMO_SUPABASE_ID");
  const demoSupabaseKey = requireEnv("DEMO_SUPABASE_KEY");
  const demoDatabaseUrl = requireEnv("DEMO_DATABASE_URL");

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

  const bucketAction = await ensureBucket(supabase);
  await ensurePolicies(demoDatabaseUrl);

  console.log("Demo avatars storage is ready.");
  console.log(`Project: ${demoProjectRef}`);
  console.log(`Bucket: avatars (${bucketAction})`);
  console.log("Policies: select/insert/update/delete refreshed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
