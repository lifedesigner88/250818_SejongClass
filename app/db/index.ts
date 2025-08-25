import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

// 모든 스키마 import
import { themesTable, themesRelations } from "~/feature/themes/schema";
import { subjectsTable, subjectsRelations } from "~/feature/subjects/schema";


const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
    ssl: {
        rejectUnauthorized: false,
        ca: undefined,
        cert: undefined,
        key: undefined,
    }
});

// 스키마를 포함하여 drizzle 초기화
const db = drizzle({
    client: pool,
    schema: {

        themesTable,
        themesRelations,

        subjectsTable,
        subjectsRelations,

    }
});

export default db;