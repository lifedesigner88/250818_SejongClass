import { check, integer, pgTable, primaryKey, varchar } from "drizzle-orm/pg-core";
import { unitsTable } from "~/feature/units/schema";
import { conceptsTable } from "~/feature/concepts/schema";
import { sql } from "drizzle-orm";

export const dealingsTable = pgTable("dealings", {
        unit_id: integer().references(() => unitsTable.unit_id, {
            onDelete: "cascade",
        }).notNull(),
        concept_id: integer().references(() => conceptsTable.concept_id, {
            onDelete: "cascade",
        }).notNull(),

        discription: varchar({ length: 100 }).notNull(),
        sort_order: integer().default(1).notNull(),
    },
    (table) => [
        primaryKey({
            name: 'pk_dealings_unit_concept',
            columns: [table.unit_id, table.concept_id]
        }),
        check("sort_order_positive", sql`sort_order > 0`),
    ]
);
