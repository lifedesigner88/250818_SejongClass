import { boolean, pgTable, serial, smallint, varchar, check } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { subjectsTable } from "~/feature/subjects/schema";

export const themesTable = pgTable("themes", {
        themes_id: serial().primaryKey(),

        name: varchar({ length: 100 }).notNull().unique(),
        slug: varchar({ length: 100 }).notNull().unique(),
        is_active: boolean().default(true).notNull(),
        sort_order: smallint().default(1).notNull(),
        class_name: varchar({ length: 200 }).notNull(),
        hover: varchar({ length: 200 }).notNull(),

    }, () => [
        check("sort_order_positive", sql`sort_order > 0`),
    ]
);

export const themesRelations = relations(themesTable, ({ many }) => (
    {
        subjects: many(subjectsTable),
    }
))