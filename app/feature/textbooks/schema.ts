import { boolean, integer, pgTable, serial, varchar, check, smallint, pgPolicy, decimal } from "drizzle-orm/pg-core";
import { subjectsTable } from "~/feature/subjects/schema";
import { relations, sql } from "drizzle-orm";
import { majorsTable } from "~/feature/majors/schema";
import { enrollmentsTable } from "~/feature/enrollments/schema";

export const textbooksTable = pgTable("textbooks", {
    textbook_id: serial().primaryKey(),


    title: varchar({ length: 100 }).notNull().unique(),
    slug: varchar({ length: 100 }).notNull().unique(),
    price: integer().default(0).notNull(),
    is_published: boolean().default(false).notNull(),
    can_enroll: boolean().default(false).notNull(),
    sort_order: integer().default(1).notNull(),
    cover_image_url: varchar({ length: 500 }),
    youtube_video_id: varchar({ length: 20 }),
    enrolled_students: smallint().default(0).notNull(),
    estimated_hours: decimal({ precision: 2, scale: 1 }).default('0.0').notNull(),
    average_rating: decimal({ precision: 2, scale: 1 }).default('0.0').notNull(),

    // foreign key
    subjects_id: integer().references(() => subjectsTable.subject_id).notNull(),

}, () => [
    check("sort_order_positive", sql`sort_order > 0`),
    check("price_positive", sql`price >= 0`),

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
]);


export const textbooksRelations = relations(textbooksTable, ({ one, many }) => ({
    subject: one(subjectsTable, {
        fields: [textbooksTable.subjects_id],
        references: [subjectsTable.subject_id],
    }),
    majors: many(majorsTable),
    enrollments: many(enrollmentsTable),
}))