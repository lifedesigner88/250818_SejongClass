import { boolean, check, integer, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { middlesTable } from "~/feature/middles/schema";
import { sql } from "drizzle-orm";

export const unitsTable = pgTable("units", {
    unit_id: serial().primaryKey(),

    title: varchar({ length: 100 }).notNull(),
    youtube_video_id: varchar({ length: 20 }),
    readme_content: varchar({ length: 4000 }),
    estimated_duration: integer(),
    sort_order: integer().default(1).notNull(),
    is_published: boolean().default(false).notNull(),
    updated_at: timestamp().defaultNow().$onUpdate(() => new Date()),

    // foreign key
    middle_chapter_id: integer().references(() => middlesTable.middle_id, {
        onDelete: "cascade"
    }).notNull(),

}, () => [
    check("sort_order_positive", sql`sort_order > 0`),
]);
