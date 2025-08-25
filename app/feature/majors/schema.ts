import { boolean, check, integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { textbooksTable } from "~/feature/textbooks/schema";
import { relations, sql } from "drizzle-orm";
import { middlesTable } from "~/feature/middles/schema";

export const majorsTable = pgTable("majors", {
    major_id: serial().primaryKey(),
    title: varchar({ length: 200 }).notNull().unique(),
    sort_order: integer().default(1).notNull(),
    is_published: boolean().default(false).notNull(),

    // foreign key
    textbook_id: integer().references(() => textbooksTable.textbook_id, {
        onDelete: "cascade",
    }).notNull(),

}, () => [
    check("sort_order_positive", sql`sort_order > 0`),
]);

export const majorsRelations = relations(majorsTable, ({ one, many }) => ({
    textbook: one(textbooksTable, {
        fields: [majorsTable.textbook_id],
        references: [textbooksTable.textbook_id],
    }),
    middles: many(middlesTable),
}));
