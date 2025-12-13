import { boolean, check, integer, pgPolicy, pgTable, serial, smallint, varchar } from "drizzle-orm/pg-core";
import { themesTable } from "~/feature/themes/schema";
import { relations, sql } from "drizzle-orm";
import { textbooksTable } from "~/feature/textbooks/schema";

export const subjectsTable = pgTable("subjects", {
        subject_id: serial().primaryKey(),

        name: varchar({ length: 100 }).notNull().unique(),
        slug: varchar({ length: 100 }).notNull().unique(),
        is_active: boolean().default(true).notNull(),
        sort_order: smallint().default(1).notNull(),
        emoji: varchar({ length: 100 }).notNull(),

        // foreign key
        themes_id: integer().references(() => themesTable.themes_id).notNull(),
    },
    () => [
        check("sort_order_positive", sql`sort_order > 0`),
        pgPolicy(`policy-public`, {
            for: 'select',
            to: 'anon',  // 익명 사용자도 가능
        }),
        // pgPolicy(`policy-select`, {
        //     for: 'select',
        //     to: 'authenticated',
        //     using: sql`auth.uid() = user_id`,
        // }),
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
    ]);

export const subjectsRelations = relations(subjectsTable, ({ one, many }) => ({
    theme: one(themesTable, {
        fields: [subjectsTable.themes_id],
        references: [themesTable.themes_id],
    }),
    textbooks: many(textbooksTable),
}))