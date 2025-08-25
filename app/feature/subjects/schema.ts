import { boolean, check, integer, pgTable, serial, smallint, varchar } from "drizzle-orm/pg-core";
import { themesTable } from "~/feature/themes/schema";
import { relations, sql } from "drizzle-orm";
import { textbooksTable } from "~/feature/textbooks/schema";

export const subjectsTable = pgTable("subjects", {
        subject_id: serial().primaryKey(),

        name: varchar({ length: 100 }).notNull(),
        slug: varchar({ length: 100 }).notNull(),
        is_active: boolean().default(true).notNull(),
        sort_order: smallint().default(1).notNull(),
        icon_url: varchar({ length: 200 }),

        // foreign key
        themes_id: integer().references(() => themesTable.themes_id, {
            onDelete: "cascade"
        }).notNull(),
    },
    () => [
        check("sort_order_positive", sql`sort_order > 0`),
    ]);

export const subjectsRelations = relations(subjectsTable, ({ one, many }) => ({
    themes: one(themesTable, {
        fields: [subjectsTable.themes_id],
        references: [themesTable.themes_id],
    }),
    textbooks: many(textbooksTable),
}))