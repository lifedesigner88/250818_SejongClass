import { check, integer, pgPolicy, pgTable, primaryKey, varchar } from "drizzle-orm/pg-core";
import { unitsTable } from "~/feature/units/schema";
import { conceptsTable } from "~/feature/concepts/schema";
import { relations, sql } from "drizzle-orm";

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

        // pgPolicy(`policy-public`, {
        //     for: 'select',
        //     to: 'anon',  // 익명 사용자도 가능
        // }),
        pgPolicy(`policy-select`, {
            for: 'select',
            to: 'authenticated',
            using: sql`auth.uid() = user_id`,
        }),
        pgPolicy(`policy-insert`, {
            for: 'insert',
            to: 'authenticated',
            withCheck: sql`auth.uid() = user_id`,
        }),
        pgPolicy(`policy-update`, {
            for: 'update',
            to: 'authenticated',
            using: sql`auth.uid() = user_id`,
            withCheck: sql`auth.uid() = user_id`,
        }),
        pgPolicy(`policy-delete`, {
            for: 'delete',
            to: 'authenticated',
            using: sql`auth.uid() = user_id`,
        }),
        // pgPolicy(`policy-admin-insert`, {
        //     for: 'insert',
        //     to: 'authenticated',
        //     using: sql`auth.jwt() ->> 'role' = 'admin'`,
        // }),
        // pgPolicy(`policy-admin-update`, {
        //     for: 'update',
        //     to: 'authenticated',
        //     using: sql`auth.jwt() ->> 'role' = 'admin'`,
        // }),
        // pgPolicy(`policy-admin-delete`, {
        //     for: 'delete',
        //     to: 'authenticated',
        //     using: sql`auth.jwt() ->> 'role' = 'admin'`,
        // })
    ]
);

export const dealingsRelations = relations(dealingsTable, ({ one }) => ({
    unit: one(unitsTable, {
        fields: [dealingsTable.unit_id],
        references: [unitsTable.unit_id],
    }),
    concept: one(conceptsTable, {
        fields: [dealingsTable.concept_id],
        references: [conceptsTable.concept_id],
    }),
}))