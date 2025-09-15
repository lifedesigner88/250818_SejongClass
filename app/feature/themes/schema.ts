import { boolean, pgTable, serial, smallint, varchar, check, pgPolicy } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { subjectsTable } from "~/feature/subjects/schema";

export const themesTable = pgTable("themes", {
        themes_id: serial().primaryKey(),

        name: varchar({ length: 100 }).notNull().unique(),
        slug: varchar({ length: 100 }).notNull().unique(),
        is_active: boolean().default(true).notNull(),
        sort_order: smallint().default(1).notNull(),
        class_name: varchar({ length: 200 }).notNull(),
        hover: varchar({ length: 200 }).notNull(),

    }, () => [
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
    ]
);

export const themesRelations = relations(themesTable, ({ many }) => (
    {
        subjects: many(subjectsTable),
    }
))