import { pgTable, serial, varchar, text, integer, index, pgPolicy } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { unitsTable } from "~/feature/units/schema";
import { checklistsTable } from "~/feature/checklists/schema";


export const curriculumsTable = pgTable("curriculums", {
    curriculum_id: serial().primaryKey(),

    // 성취기준 코드 (예: "2수01-01", "9수02-14")
    code: varchar({ length: 20 }).notNull().unique(),

    sort_order: integer().default(1).notNull(),
    achievement_text: text().notNull(), // 성취기준 전체 내용
    unit_id: integer().references(() => unitsTable.unit_id, {
        onDelete: "cascade"
    }),

}, (table) => [

    index("idx_curriculum_code").on(table.code),
    index("idx_curriculum_sort_order").on(table.sort_order),

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

export const curriculumsRelations = relations(curriculumsTable, ({ one, many }) => ({
    units: one(unitsTable, {
        fields: [curriculumsTable.unit_id],
        references: [unitsTable.unit_id],
    }),
    checklists: many(checklistsTable)
}));
