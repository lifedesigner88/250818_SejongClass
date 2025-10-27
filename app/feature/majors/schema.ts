import { boolean, check, integer, pgPolicy, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { textbooksTable } from "~/feature/textbooks/schema";
import { relations, sql } from "drizzle-orm";
import { middlesTable } from "~/feature/middles/schema";

export const majorsTable = pgTable("majors", {
    major_id: serial().primaryKey(),
    title: varchar({ length: 200 }).notNull(),
    sort_order: integer().default(1).notNull(),
    is_published: boolean().default(false).notNull(),

    // foreign key
    textbook_id: integer().references(() => textbooksTable.textbook_id, {
        onDelete: "cascade",
    }).notNull(),

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

export const majorsRelations = relations(majorsTable, ({ one, many }) => ({
    textbook: one(textbooksTable, {
        fields: [majorsTable.textbook_id],
        references: [textbooksTable.textbook_id],
    }),
    middles: many(middlesTable),
}));
