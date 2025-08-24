import { pgTable, uuid, varchar, timestamp, pgEnum } from "drizzle-orm/pg-core";

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
