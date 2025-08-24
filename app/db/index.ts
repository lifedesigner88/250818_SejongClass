import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { themesTable } from "~/feature/themes/themesSchema";
import { subjectsTable } from "~/feature/subjects/subjectsSchema";

import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
    ssl: {
        rejectUnauthorized: false,
        ca: undefined,
        cert: undefined,
        key: undefined,
    }
});

const db = drizzle({ client: pool });

export {
    db,
    themesTable,
    subjectsTable,
};