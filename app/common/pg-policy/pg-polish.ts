import { sql } from "drizzle-orm";
import { pgPolicy } from "drizzle-orm/pg-core";

export const defaultPgPolicy = [
    pgPolicy(`policy-select`, {
        for: 'select',
        to: 'authenticated',
        using: sql`auth.uid() = user_id`,
    }),
    pgPolicy(`policy-insert`, {
        for: 'insert',
        to: 'authenticated',
        withCheck: sql`auth.uid() = user_id`,
    }),
    pgPolicy(`policy-update`, {
        for: 'update',
        to: 'authenticated',
        using: sql`auth.uid() = user_id`,
        withCheck: sql`auth.uid() = user_id`,
    }),
    pgPolicy(`policy-delete`, {
        for: 'delete',
        to: 'authenticated',
        using: sql`auth.uid() = user_id`,
    }),
]