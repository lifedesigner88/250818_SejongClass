import { boolean, pgEnum, pgTable, serial, timestamp, uuid, integer } from "drizzle-orm/pg-core";
import { usersTable } from "~/feature/users/schema";
import { defaultPgPolicy } from "@/pg-policy/pg-polish";
import { relations } from "drizzle-orm";
import { commentsTable } from "../comments/schema";

export const notificationType = pgEnum("notification_type", [
    "reply",
    "like",
]);

export const notificationsTable = pgTable("notifications", {
    notification_id: serial().primaryKey(),
    comment_id: integer().references(() => commentsTable.comment_id, {
        onDelete: "cascade"
    }).notNull(),
    from_user_id: uuid().references(() => usersTable.user_id, {
        onDelete: "cascade"
    }).notNull(),
    to_user_id: uuid().references(() => usersTable.user_id, {
        onDelete: "cascade"
    }).notNull(),
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
    }),

    comment: one(commentsTable, {
        fields: [notificationsTable.comment_id],
        references: [commentsTable.comment_id]
    })

}))