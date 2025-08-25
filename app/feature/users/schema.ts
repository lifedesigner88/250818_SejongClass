import { pgTable, uuid, varchar, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { mastersTable } from "~/feature/masters/schema";
import { enrollmentsTable } from "~/feature/enrollments/schema";
import { progressTable } from "~/feature/progress/schema";

export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);

export const usersTable = pgTable("users", {
    user_id: uuid().primaryKey().notNull(),

    email: varchar({ length: 255 }).notNull(),
    username: varchar({ length: 100 }).notNull(),
    role: userRoleEnum().default('user').notNull(),
    nickname: varchar({ length: 100 }),
    profile_url: varchar({ length: 500 }),

    created_at: timestamp().defaultNow(),
    updated_at: timestamp().defaultNow().$onUpdate(() => new Date()),
});


export const usersRelations = relations(usersTable, ({ many }) => ({
    // 사용자가 등록한 교재들
    enrollments: many(enrollmentsTable),

    // 사용자가 마스터한 개념들
    masters: many(mastersTable),

    // 사용자의 단원별 학습 진도
    progress: many(progressTable),

}));
