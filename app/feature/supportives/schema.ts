import { check, integer, pgTable, primaryKey, varchar } from "drizzle-orm/pg-core";
import { conceptsTable } from "~/feature/concepts/schema";
import { sql } from "drizzle-orm";

export const supportivesTable = pgTable("supportives", {
        concept_id: integer().references(() => conceptsTable.concept_id, {
            onDelete: "cascade",
        }).notNull(),
        supportive_id: integer().references(() => conceptsTable.concept_id, {
            onDelete: "cascade",
        }).notNull(),

        description: varchar({ length: 100 }),
        sort_order: integer().default(1).notNull(),
    },
    (table) => [
        primaryKey({
            name: 'pk_supportive_concept',
            columns: [table.concept_id, table.supportive_id]
        }),
        check("sort_order_positive", sql`sort_order > 0`),
    ]
);
