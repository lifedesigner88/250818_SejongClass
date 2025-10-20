import { pgTable, uuid, varchar, timestamp, pgEnum, pgPolicy } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { mastersTable } from "~/feature/masters/schema";
import { enrollmentsTable } from "~/feature/enrollments/schema";
import { progressTable } from "~/feature/progress/schema";
import { commentsTable } from "~/feature/comments/schema";
import { checklistsTable } from "~/feature/checklists/schema";
import { visitlogsTable } from "~/feature/visitlogs/schema";

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
}, () => [


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
]);


export const usersRelations = relations(usersTable, ({ many }) => ({
    // 사용자가 등록한 교재들
    enrollments: many(enrollmentsTable),

    // 사용자가 마스터한 개념들
    masters: many(mastersTable),

    // 사용자의 단원별 학습 진도
    progress: many(progressTable),

    comments: many(commentsTable),

    checklists: many(checklistsTable),

    visitlogs: many(visitlogsTable),

}));
