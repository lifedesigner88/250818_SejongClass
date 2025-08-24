import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const conceptsTable = pgTable("concepts", {
    concept_id: serial().primaryKey(),

    name: varchar({ length: 100 }).notNull(),
    slug: varchar({ length: 100 }).notNull().unique(),
    definition: varchar({ length: 100 }),
    name_eng: varchar({ length: 100 }),

    updated_at: timestamp().defaultNow().$onUpdate(() => new Date()),
});
