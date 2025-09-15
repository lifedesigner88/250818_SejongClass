import { boolean, integer, pgPolicy, pgTable, primaryKey, timestamp, uuid } from "drizzle-orm/pg-core";
import { usersTable } from "~/feature/users/schema";
import { unitsTable } from "~/feature/units/schema";
import { relations, sql } from "drizzle-orm";

export const progressTable = pgTable("progress", {
        user_id: uuid().references(() => usersTable.user_id, {
            onDelete: "cascade",
        }).notNull(),
        unit_id: integer().references(() => unitsTable.unit_id, {
            onDelete: "cascade",
        }).notNull(),

        completion_status: boolean().default(true).notNull(),
        updated_at: timestamp().defaultNow().$onUpdate(() => new Date()),
    },
    (table) => [
        primaryKey({
            name: 'pk_progress_user_unit',
            columns: [table.user_id, table.unit_id]
        }),

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
