import { boolean, integer, pgPolicy, pgTable, primaryKey, timestamp, uuid } from "drizzle-orm/pg-core";
import { usersTable } from "~/feature/users/schema";
import { relations, sql } from "drizzle-orm";
import { curriculumsTable } from "~/feature/curriculums/schema";

export const checklistsTable = pgTable("checklists", {
        user_id: uuid().references(() => usersTable.user_id, {
            onDelete: "cascade",
        }).notNull(),
        curriculum_id: integer().references(() => curriculumsTable.curriculum_id, {
            onDelete: "cascade",
        }).notNull(),

        completion_status: boolean().default(true).notNull(),
        updated_at: timestamp().defaultNow().$onUpdate(() => new Date()),
    },
    (table) => [
        primaryKey({
            name: 'pk_checklist_user_curriculum',
            columns: [table.user_id, table.curriculum_id]
        }),
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
        // pgPolicy(`policy-public`, {
        //     for: 'select',
        //     to: 'anon',  // 익명 사용자도 가능
        // }),
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
    ]
);

export const checklistsRelations = relations(checklistsTable, ({ one }) => ({
    // 진행 상태를 가진 사용자
    user: one(usersTable, {
        fields: [checklistsTable.user_id],
        references: [usersTable.user_id],
    }),

    // 진행 중인 단원
    curriculum: one(curriculumsTable, {
        fields: [checklistsTable.curriculum_id],
        references: [curriculumsTable.curriculum_id],
    }),
}));
