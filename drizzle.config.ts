import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');

export default defineConfig({
    out: './drizzle',
    schema: './app/feature/**/*Schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL,
        ssl: true,
    },
    strict: true,
    verbose: true,
});