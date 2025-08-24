import { boolean, check, integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { majorsTable } from "~/feature/majors/schema";
import { sql } from "drizzle-orm";

export const middlesTable = pgTable("middles", {
    middle_id: serial().primaryKey(),
    title: varchar({ length: 200 }).notNull(),
    sort_order: integer().default(1).notNull(),
    is_published: boolean().default(false).notNull(),

    // foreign key
    major_id: integer().references(() => majorsTable.major_id, {
        onDelete: "cascade"
    }).notNull(),

}, () => [
    check("sort_order_positive", sql`sort_order >= 0`),
]);

