import { boolean, pgTable, serial, smallint, varchar } from "drizzle-orm/pg-core";
export const themesTable = pgTable("themes", {
    themes_id: serial().primaryKey(),
    name: varchar({ length: 100 }).notNull(),
    slug: varchar({ length: 100 }).notNull(),
    is_active: boolean().default(true).notNull(),
    sort_order: smallint().notNull(),
    icon_url: varchar({ length: 200 }),
});