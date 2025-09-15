import { check, integer, pgPolicy, pgTable, primaryKey, varchar } from "drizzle-orm/pg-core";
import { conceptsTable } from "~/feature/concepts/schema";
import { relations, sql } from "drizzle-orm";

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
        check("concept_not_self_supportive", sql`concept_id != supportive_id`),

        // pgPolicy(`policy-public`, {
        //     for: 'select',
        //     to: 'anon',  // 익명 사용자도 가능
        // }),
        pgPolicy(`policy-select`, {
            for: 'select',
            to: 'authenticated',
            using: sql`auth.uid() = user_id`,
        }),
        // pgPolicy(`policy-insert`, {
        //     for: 'insert',
        //     to: 'authenticated',
        //     withCheck: sql`auth.uid() = user_id`,
        // }),
        // pgPolicy(`policy-update`, {
        //     for: 'update',
        //     to: 'authenticated',
        //     using: sql`auth.uid() = user_id`,
        //     withCheck: sql`auth.uid() = user_id`,
        // }),
        // pgPolicy(`policy-delete`, {
        //     for: 'delete',
        //     to: 'authenticated',
        //     using: sql`auth.uid() = user_id`,
        // }),
        pgPolicy(`policy-admin-insert`, {
            for: 'insert',
            to: 'authenticated',
            using: sql`auth.jwt() ->> 'role' = 'admin'`,
        }),
        pgPolicy(`policy-admin-update`, {
            for: 'update',
            to: 'authenticated',
            using: sql`auth.jwt() ->> 'role' = 'admin'`,
        }),
        pgPolicy(`policy-admin-delete`, {
            for: 'delete',
            to: 'authenticated',
            using: sql`auth.jwt() ->> 'role' = 'admin'`,
        })
    ]
);

export const supportivesRelations = relations(supportivesTable, ({ one }) => ({

    // 메인 개념 (concept_id) - 보조개념이 필요한 개념
    mainConcept: one(conceptsTable, {
        fields: [supportivesTable.concept_id],
        references: [conceptsTable.concept_id],
        relationName: "mainConceptSupportive"
    }),
    // 보조 개념 (supportive_id) - 실제 보조개념이 되는 개념
    supportiveConcept: one(conceptsTable, {
        fields: [supportivesTable.supportive_id],
        references: [conceptsTable.concept_id],
        relationName: "supportiveConceptRef"
    }),


}));
