import { boolean,  integer, pgTable, primaryKey, timestamp, uuid } from "drizzle-orm/pg-core";
import { usersTable } from "~/feature/users/schema";
import { unitsTable } from "~/feature/units/schema";
import { relations } from "drizzle-orm";

export const progressTable = pgTable("progress", {
        user_id: uuid().references(() => usersTable.user_id, {
            onDelete: "cascade",
        }).notNull(),
        unit_id: integer().references(() => unitsTable.unit_id, {
            onDelete: "cascade",
        }).notNull(),

        completion_status: boolean().default(false).notNull(),
        updated_at: timestamp().defaultNow().$onUpdate(() => new Date()),
    },
    (table) => [
        primaryKey({
            name: 'pk_progress_user_unit',
            columns: [table.user_id, table.unit_id]
        }),
    ]
);

export const progressRelations = relations(progressTable, ({ one }) => ({
    // 진행 상태를 가진 사용자
    user: one(usersTable, {
        fields: [progressTable.user_id],
        references: [usersTable.user_id],
    }),

    // 진행 중인 단원
    unit: one(unitsTable, {
        fields: [progressTable.unit_id],
        references: [unitsTable.unit_id],
    }),
}));
