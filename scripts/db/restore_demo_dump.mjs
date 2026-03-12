import "dotenv/config";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { Client } from "pg";

const dumpsRoot = path.resolve("dumps/selective");

async function resolveDumpDir(inputDir) {
  if (inputDir) return path.resolve(inputDir);

  const entries = await readdir(dumpsRoot, { withFileTypes: true });
  const candidates = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
    .reverse();

  if (candidates.length === 0) {
    throw new Error("No selective dump directory found.");
  }

  return path.join(dumpsRoot, candidates[0]);
}

async function main() {
  const databaseUrl = process.env.DEMO_DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DEMO_DATABASE_URL is required.");
  }

  const dumpDir = await resolveDumpDir(process.argv[2]);
  const schemaPath = path.join(dumpDir, "public_schema.sql");
  const dataPath = path.join(dumpDir, "demo_content_data.sql");

  const [schemaSql, dataSql] = await Promise.all([
    readFile(schemaPath, "utf8"),
    readFile(dataPath, "utf8"),
  ]);

  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();

  try {
    const { rows } = await client.query(
      "select count(*)::int as count from information_schema.tables where table_schema = 'public';",
    );
    const tableCount = rows[0]?.count ?? 0;

    console.log(`Using dump directory: ${dumpDir}`);
    console.log(`Existing public tables: ${tableCount}`);

    await client.query(`
      drop schema if exists public cascade;
      create schema public;
      grant all on schema public to postgres;
      grant all on schema public to public;
    `);

    await client.query(schemaSql);
    await client.query(dataSql);

    const result = await client.query(
      "select count(*)::int as count from public.themes;",
    );
    console.log(`Restore complete. themes rows: ${result.rows[0]?.count ?? 0}`);
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
