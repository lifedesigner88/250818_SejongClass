import {
    pgTable,
    primaryKey,
    smallint,
    timestamp,
    uuid,
    integer,
    check,
    varchar,
    pgPolicy, index,
} from "drizzle-orm/pg-core";
import { usersTable } from "~/feature/users/schema";
import { textbooksTable } from "~/feature/textbooks/schema";
import { relations, sql } from "drizzle-orm";
import { paymentsTable } from "~/feature/payments/schema";

export const enrollmentsTable = pgTable("enrollments", {
        user_id: uuid().references(() => usersTable.user_id,{
            onDelete: "cascade",
        }).notNull(),
        textbook_id: integer().references(() => textbooksTable.textbook_id,{
            onDelete: "cascade"
        }).notNull(),

        enrollment_type: varchar({ length: 20 }).default('FREE').notNull(), // PAID, FREE, TRIAL, PROMOTION
        payment_status: varchar({ length: 20 }).default('PENDING').notNull(), // PENDING, COMPLETED, FAILED

        progress_rate: smallint().default(0).notNull(),
        review: varchar({ length: 500 }),
        rating: smallint().default(0).notNull(),

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
        check("rating_range", sql`rating >= 0 and rating <=10`),
        check("enrollment_type_valid", sql`enrollment_type IN ('PAID', 'FREE', 'TRIAL', 'PROMOTION')`),
        check("payment_status_valid", sql`payment_status IN ('PENDING', 'COMPLETED', 'FAILED')`),

        index("idx_enrollments_user_id").on(table.user_id), // 사용자별 수강 목록 조회용


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

    payment: one(paymentsTable, {
        fields: [enrollmentsTable.user_id, enrollmentsTable.textbook_id],
        references: [paymentsTable.user_id, paymentsTable.textbook_id],
    })

}));
