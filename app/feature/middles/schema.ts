import { boolean, check, integer, pgPolicy, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { majorsTable } from "~/feature/majors/schema";
import { relations, sql } from "drizzle-orm";
import { unitsTable } from "~/feature/units/schema";

export const middlesTable = pgTable("middles", {
    middle_id: serial().primaryKey(),
    title: varchar({ length: 200 }).notNull(),
    sort_order: integer().default(1).notNull(),
    is_published: boolean().default(false).notNull(),

    // foreign key
    major_id: integer().references(() => majorsTable.major_id).notNull(),

}, () => [
    check("sort_order_positive", sql`sort_order >= 0`),
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
]);

export const middlesRelations = relations(middlesTable, ({ one, many }) => ({
    major: one(majorsTable, {
        fields: [middlesTable.major_id],
        references: [majorsTable.major_id],
    }),
    units: many(unitsTable),
}));
