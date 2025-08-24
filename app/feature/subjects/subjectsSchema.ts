import { boolean, integer, pgTable, serial, smallint, varchar } from "drizzle-orm/pg-core";
import { themesTable } from "~/feature/themes/themesSchema";

export const subjectsTable = pgTable("subjects", {
    subjects: serial().primaryKey(),
    name: varchar({ length: 100 }).notNull(),
    slug: varchar({ length: 100 }).notNull(),
    is_active: boolean().default(true).notNull(),
    sort_order: smallint().notNull(),
    icon_url: varchar({ length: 200 }),

    // 외래키
    themes_id: integer().references(() => themesTable.themes_id,{
        onDelete: "cascade",
        onUpdate: "cascade",
    }).notNull(),
});