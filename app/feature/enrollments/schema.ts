import {
    boolean,
    pgTable,
    primaryKey,
    smallint,
    timestamp,
    uuid,
    integer,
    check,
    varchar,
    pgPolicy,
} from "drizzle-orm/pg-core";
import { usersTable } from "~/feature/users/schema";
import { textbooksTable } from "~/feature/textbooks/schema";
import { relations, sql } from "drizzle-orm";

export const enrollmentsTable = pgTable("enrollments", {
        user_id: uuid().references(() => usersTable.user_id,{
            onDelete: "cascade",
        }).notNull(),
        textbook_id: integer().references(() => textbooksTable.textbook_id,{
            onDelete: "cascade"
        }).notNull(),

        progress_rate: smallint().default(0).notNull(),
        payment_status: boolean().default(false).notNull(),
        review: varchar({ length: 500 }),
        rating: smallint(),

        last_study_date: timestamp().defaultNow().notNull(),
        created_at: timestamp().defaultNow().notNull(),
        updated_at: timestamp().defaultNow().$onUpdate(() => new Date()),
    },
    (table) => [
        primaryKey({
            name: 'pk_enrollment_user_textbook',
            columns: [table.user_id, table.textbook_id]
        }),
        check("completion_percentage_range", sql`progress_rate BETWEEN 0 AND 100`),
        check("rating_range", sql`rating >= 1 and rating <= 10`),


        // pgPolicy(`policy-public`, {
        //     for: 'select',
        //     to: 'anon',  // 익명 사용자도 가능
        // }),
        pgPolicy(`policy-select`, {
            for: 'select',
            to: 'authenticated',
            using: sql`auth.uid() = user_id`,
        }),
        // pgPolicy(`policy-insert`, {
        //     for: 'insert',
        //     to: 'authenticated',
        //     withCheck: sql`auth.uid() = user_id`,
        // }),
        // pgPolicy(`policy-update`, {
        //     for: 'update',
        //     to: 'authenticated',
        //     using: sql`auth.uid() = user_id`,
        //     withCheck: sql`auth.uid() = user_id`,
        // }),
        // pgPolicy(`policy-delete`, {
        //     for: 'delete',
        //     to: 'authenticated',
        //     using: sql`auth.uid() = user_id`,
        // }),
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
    ]
);

export const enrollmentsRelations = relations(enrollmentsTable, ({ one }) => ({
    // 수강한 사용자
    user: one(usersTable, {
        fields: [enrollmentsTable.user_id],
        references: [usersTable.user_id],
    }),

    // 수강한 교재
    textbook: one(textbooksTable, {
        fields: [enrollmentsTable.textbook_id],
        references: [textbooksTable.textbook_id],
    }),
}));
