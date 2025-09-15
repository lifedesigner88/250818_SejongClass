import { check, integer, pgPolicy, pgTable, primaryKey, smallint, uuid } from "drizzle-orm/pg-core";
import { usersTable } from "~/feature/users/schema";
import { conceptsTable } from "~/feature/concepts/schema";
import { relations, sql } from "drizzle-orm";

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

export const mastersRelations = relations(mastersTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [mastersTable.user_id],
        references: [usersTable.user_id],
    }),
    concept: one(conceptsTable, {
        fields: [mastersTable.concept_id],
        references: [conceptsTable.concept_id],
    }),
}));
