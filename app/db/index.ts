import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

// 모든 스키마 import
import { themesTable, themesRelations } from "~/feature/themes/schema";
import { subjectsTable, subjectsRelations } from "~/feature/subjects/schema";
import { textbooksRelations, textbooksTable } from "~/feature/textbooks/schema";
import { majorsRelations, majorsTable } from "~/feature/majors/schema";
import { middlesRelations, middlesTable } from "~/feature/middles/schema";
import { unitsRelations, unitsTable } from "~/feature/units/schema";
import { dealingsRelations, dealingsTable } from "~/feature/dealings/schema";
import { conceptsRelations, conceptsTable } from "~/feature/concepts/schema";


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

        textbooksTable,
        textbooksRelations,

        majorsTable,
        majorsRelations,

        middlesTable,
        middlesRelations,

        unitsTable,
        unitsRelations,

        dealingsTable,
        dealingsRelations,

        conceptsTable,
        conceptsRelations,
    }
});

export default db;