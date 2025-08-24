import { boolean, check, integer, pgTable, serial, smallint, varchar } from "drizzle-orm/pg-core";
import { themesTable } from "~/feature/themes/schema";
import { sql } from "drizzle-orm";

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
