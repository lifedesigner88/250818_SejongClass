import { boolean, integer, pgTable, serial, varchar, check } from "drizzle-orm/pg-core";
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
    sort_order: integer().default(1).notNull(),
    cover_image_url: varchar({ length: 500 }),

    // foreign key
    subjects_id: integer().references(() => subjectsTable.subject_id, {
        onDelete: "cascade"
    }).notNull(),

}, () => [
    check("sort_order_positive", sql`sort_order > 0`),
    check("price_positive", sql`price >= 0`),
]);


export const textbooksRelations = relations(textbooksTable, ({ one, many }) => ({
    subjects: one(subjectsTable, {
        fields: [textbooksTable.subjects_id],
        references: [subjectsTable.subject_id],
    }),
    majors: many(majorsTable),
    enrollments: many(enrollmentsTable),
}))