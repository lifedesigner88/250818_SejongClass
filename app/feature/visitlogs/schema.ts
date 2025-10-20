import { relations, sql } from "drizzle-orm";
import { pgPolicy, pgTable, serial, timestamp, uuid } from "drizzle-orm/pg-core";
import { usersTable } from "~/feature/users/schema";


export const visitlogsTable = pgTable("visitlogs", {
    visitlog_id: serial().primaryKey(),

    user_id: uuid().references(() => usersTable.user_id, {
        onDelete: "cascade",
    }).notNull(),

    updated_at: timestamp().defaultNow().$onUpdate(() => new Date())
}, () => [
    pgPolicy(`policy-public`, {
        for: 'select',
        to: 'anon',  // 익명 사용자도 가능
    }),
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

export const visitlogsRelations = relations(visitlogsTable, ({ one }) => ({

    user: one(usersTable, {
        fields: [visitlogsTable.user_id],
        references: [usersTable.user_id],
    }),

}))