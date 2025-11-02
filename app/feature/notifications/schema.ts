import { boolean, pgEnum, pgTable, serial, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "~/feature/users/schema";
import { defaultPgPolicy } from "@/pg-policy/pg-polish";
import { relations } from "drizzle-orm";

export const notificationType = pgEnum("notification_type", [
    "reply", // from, to 모두 있음               삭제 가능
    "notification", // from Null to Null       삭제 관리자만 삭제 가능
    "message" // from Null, to 있음.            삭제 가능.
]);

export const notificationsTable = pgTable("notifications", {
    notification_id: serial().primaryKey(),
    message: varchar({ length: 800 }).notNull(),
    where_url: varchar({ length: 500 }),
    from_user_id: uuid().references(() => usersTable.user_id),
    to_user_id: uuid().references(() => usersTable.user_id),
    type: notificationType().notNull(),
    is_checked: boolean().default(false).notNull(),
    created_at: timestamp().defaultNow(),
    updated_at: timestamp().defaultNow().$onUpdate(() => new Date()),
}, () => defaultPgPolicy);

export const notificationsRelation = relations(notificationsTable, ({ one }) => ({

    from: one(usersTable, {
        fields: [notificationsTable.from_user_id],
        references: [usersTable.user_id],
        relationName: "from_user_id"
    }),
    to: one(usersTable, {
        fields: [notificationsTable.to_user_id],
        references: [usersTable.user_id],
        relationName: "to_user_id"
    })

}))