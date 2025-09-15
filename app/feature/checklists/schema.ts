import { boolean, integer, pgTable, primaryKey, timestamp, uuid } from "drizzle-orm/pg-core";
import { usersTable } from "~/feature/users/schema";
import { relations } from "drizzle-orm";
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
