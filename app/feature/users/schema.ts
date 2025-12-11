import { pgTable, uuid, varchar, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { enrollmentsTable } from "~/feature/enrollments/schema";
import { progressTable } from "~/feature/progress/schema";
import { commentsTable } from "~/feature/comments/schema";
import { checklistsTable } from "~/feature/checklists/schema";
import { visitlogsTable } from "~/feature/visitlogs/schema";
import { defaultPgPolicy } from "@/pg-policy/pg-polish";
import { notificationsTable } from "~/feature/notifications/schema";

export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);

export const usersTable = pgTable("users", {
    user_id: uuid().primaryKey().notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    username: varchar({ length: 100 }).notNull().unique(),
    nickname: varchar({ length: 100 }).notNull().unique(),
    role: userRoleEnum().default('user').notNull(),
    profile_url: varchar({ length: 500 }),

    created_at: timestamp().defaultNow(),
    updated_at: timestamp().defaultNow().$onUpdate(() => new Date()),
}, () => defaultPgPolicy);


export const usersRelations = relations(usersTable, ({ many }) => ({
    // 사용자가 등록한 교재들
    enrollments: many(enrollmentsTable),

    // 사용자의 단원별 학습 진도
    progress: many(progressTable),

    comments: many(commentsTable, {relationName: "get_comments"}),

    checklists: many(checklistsTable),

    visitlogs: many(visitlogsTable),

    notifications: many(notificationsTable, {relationName: "to_user_id"}),

}));
