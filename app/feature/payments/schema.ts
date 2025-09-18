import {
    pgTable,
    timestamp,
    uuid,
    integer,
    check,
    varchar,
    pgPolicy, index, foreignKey, json, serial
} from "drizzle-orm/pg-core";
import { usersTable } from "~/feature/users/schema";
import { textbooksTable } from "../textbooks/schema";
import { enrollmentsTable } from "~/feature/enrollments/schema";
import { relations, sql } from "drizzle-orm";

// payments 테이블이 enrollments를 참조하는 방식
export const paymentsTable = pgTable("payments", {
        // Primary key
        payment_key: varchar({ length: 200 }).primaryKey(),

        // Foreign key to enrollments (composite key 참조)
        user_id: uuid().references(() => usersTable.user_id, {
            onDelete: "cascade",
        }).notNull(),
        textbook_id: integer().references(() => textbooksTable.textbook_id, {
            onDelete: "cascade"
        }).notNull(),

        // Important payment fields
        order_id: varchar({ length: 100 }).notNull().unique(),
        order_name: varchar({ length: 300 }).notNull(),
        status: varchar({ length: 50 }).notNull(), // DONE, WAITING_FOR_DEPOSIT, CANCELED, ABORTED, etc.
        method: varchar({ length: 50 }).notNull(), // 간편결제, 카드, 계좌이체 등

        // Amount fields
        total_amount: integer().notNull(),
        balance_amount: integer().notNull(),
        supplied_amount: integer().notNull(),
        vat: integer().notNull(),
        tax_free_amount: integer().default(0).notNull(),

        // Payment provider (for easyPay)
        easy_pay_provider: varchar({ length: 50 }), // 카카오페이, 네이버페이 등

        // Timestamps
        requested_at: timestamp().notNull(),
        approved_at: timestamp(),

        // Foreign key to toss_payment_logs
        toss_log_id: integer().references(() => tossPaymentLogsTable.id, {
            onDelete: "set null", // 로그가 삭제되어도 결제 정보는 유지
        }),

        // Audit fields
        created_at: timestamp().defaultNow().notNull(),
        updated_at: timestamp().defaultNow().$onUpdate(() => new Date()),

    }, (table) => [
        // Foreign key constraint to enrollments
        foreignKey({
            name: 'fk_payment_enrollment',
            columns: [table.user_id, table.textbook_id],
            foreignColumns: [enrollmentsTable.user_id, enrollmentsTable.textbook_id]
        }),

        // Indexes for common queries
        index("idx_payments_user_id").on(table.user_id), // 사용자별 결제 내역 조회용

        // Check constraints
        check("total_amount_positive", sql`total_amount > 0`),
        check("balance_amount_positive", sql`balance_amount >= 0`),

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

export const paymentsRelations = relations(paymentsTable, ({ one }) => ({

    enrollment: one(enrollmentsTable, {
        fields: [paymentsTable.user_id, paymentsTable.textbook_id],
        references: [enrollmentsTable.user_id, enrollmentsTable.textbook_id],
    })

}))


// 토스페이먼츠 원본 응답 데이터 저장용 테이블
export const tossPaymentLogsTable = pgTable("toss_payment_logs", {
    // Primary key (serial)
    id: serial().primaryKey(),

    // 토스페이먼츠 응답 데이터 (제약 조건 없음)
    response_data: json().notNull(),

    // 생성 시간
    created_at: timestamp().defaultNow().notNull(),
}, () => [
    pgPolicy(`policy-select`, {
        for: 'select',
        to: 'authenticated',
        using: sql`auth.uid() = user_id`,
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
