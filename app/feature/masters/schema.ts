import { check, integer, pgTable, primaryKey, smallint, uuid } from "drizzle-orm/pg-core";
import { usersTable } from "~/feature/users/schema";
import { conceptsTable } from "~/feature/concepts/schema";
import { sql } from "drizzle-orm";

export const mastersTable = pgTable("masters", {
        user_id: uuid().references(() => usersTable.user_id, {
            onDelete: "cascade",
        }).notNull(),
        concept_id: integer().references(() => conceptsTable.concept_id, {
            onDelete: "cascade",
        }).notNull(),

        master_rate: smallint().default(0).notNull(),
    },
    (table) => [
        primaryKey({
            name: "pk_master_user_concept",
            columns: [table.user_id, table.concept_id]
        }),
        check("master_rate_positive", sql`master_rate BETWEEN 0 AND 5`),
    ]
);
