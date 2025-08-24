import { boolean,  integer, pgTable, primaryKey, smallint, timestamp, uuid } from "drizzle-orm/pg-core";
import { usersTable } from "~/feature/users/schema";
import { unitsTable } from "~/feature/units/schema";

export const progressTable = pgTable("progress", {
        user_id: uuid().references(() => usersTable.user_id, {
            onDelete: "cascade",
        }).notNull(),
        unit_id: integer().references(() => unitsTable.unit_id, {
            onDelete: "cascade",
        }).notNull(),

        completion_status: boolean().default(false).notNull(),
        updated_at: timestamp().defaultNow().$onUpdate(() => new Date()),
    },
    (table) => [
        primaryKey({
            name: 'pk_progress_user_unit',
            columns: [table.user_id, table.unit_id]
        }),
    ]
);
