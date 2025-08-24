import { boolean, pgTable, primaryKey, smallint, timestamp, uuid, integer, check, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "~/feature/users/schema";
import { textbooksTable } from "~/feature/textbooks/schema";
import { sql } from "drizzle-orm";

export const enrollments = pgTable("enrollments", {
        user_id: uuid().references(() => usersTable.user_id,{
            onDelete: "cascade",
        }).notNull(),
        textbook_id: integer().references(() => textbooksTable.textbook_id,{
            onDelete: "cascade"
        }).notNull(),

        progress_rate: smallint().default(0).notNull(),
        payment_status: boolean().default(false).notNull(),
        review: varchar({ length: 500 }),
        rating: smallint().default(10),

        created_at: timestamp().defaultNow(),
        updated_at: timestamp().defaultNow().$onUpdate(() => new Date()),
    },
    (table) => [
        primaryKey({
            name: 'pk_enrollment_user_textbook',
            columns: [table.user_id, table.textbook_id]
        }),
        check("completion_percentage_range", sql`progress_rate BETWEEN 0 AND 100`),
        check("rating_range", sql`rating >= 1 and rating <= 10`)
    ]
);
