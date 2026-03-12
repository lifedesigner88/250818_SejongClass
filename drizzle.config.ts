import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

const isDemoMode = process.env.DEMO_MODE === "true";
const databaseUrl = isDemoMode
    ? process.env.DEMO_DATABASE_URL || process.env.DATABASE_URL
    : process.env.DATABASE_URL;

if (!databaseUrl) throw new Error('DATABASE_URL is required');

export default defineConfig({
    out: './drizzle',
    schema: './app/feature/**/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: databaseUrl,
        ssl: true,
    },
    strict: true,
    verbose: true,
});
