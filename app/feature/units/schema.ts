import {
    boolean,
    check,
    integer,
    pgPolicy,
    pgTable,
    serial,
    smallint,
    timestamp,
    varchar
} from "drizzle-orm/pg-core";
import { middlesTable } from "~/feature/middles/schema";
import { relations, sql } from "drizzle-orm";
import { dealingsTable } from "~/feature/dealings/schema";
import { progressTable } from "~/feature/progress/schema";
import { curriculumsTable } from "~/feature/curriculums/schema";

export const unitsTable = pgTable("units", {
    unit_id: serial().primaryKey(),

    title: varchar({ length: 100 }).notNull(),
    youtube_video_id: varchar({ length: 20 }),
    readme_content: varchar({ length: 4000 }),
    estimated_seconds: smallint().default(0).notNull(),
    sort_order: integer().default(1).notNull(),
    is_published: boolean().default(false).notNull(),
    is_free: boolean().default(false).notNull(),
    updated_at: timestamp().defaultNow().$onUpdate(() => new Date()),

    // foreign key
    middle_chapter_id: integer().references(() => middlesTable.middle_id, {
        onDelete: "cascade"
    }).notNull(),

}, () => [
    check("sort_order_positive", sql`sort_order > 0`),
    // pgPolicy(`policy-public`, {
    //     for: 'select',
    //     to: 'anon',  // 익명 사용자도 가능
    // }),
    pgPolicy(`policy-select`, {
        for: 'select',
        to: 'authenticated',
        using: sql`auth.uid() = user_id`,
    }),
    // pgPolicy(`policy-insert`, {
    //     for: 'insert',
    //     to: 'authenticated',
    //     withCheck: sql`auth.uid() = user_id`,
    // }),
    // pgPolicy(`policy-update`, {
    //     for: 'update',
    //     to: 'authenticated',
    //     using: sql`auth.uid() = user_id`,
    //     withCheck: sql`auth.uid() = user_id`,
    // }),
    // pgPolicy(`policy-delete`, {
    //     for: 'delete',
    //     to: 'authenticated',
    //     using: sql`auth.uid() = user_id`,
    // }),
    pgPolicy(`policy-admin-insert`, {
        for: 'insert',
        to: 'authenticated',
        using: sql`auth.jwt() ->> 'role' = 'admin'`,
    }),
    pgPolicy(`policy-admin-update`, {
        for: 'update',
        to: 'authenticated',
        using: sql`auth.jwt() ->> 'role' = 'admin'`,
    }),
    pgPolicy(`policy-admin-delete`, {
        for: 'delete',
        to: 'authenticated',
        using: sql`auth.jwt() ->> 'role' = 'admin'`,
    })
]);


export const unitsRelations = relations(unitsTable, ({ one, many }) => ({

    middle: one(middlesTable, {
        fields: [unitsTable.middle_chapter_id],
        references: [middlesTable.middle_id],
    }),
    dealings: many(dealingsTable),

    // 이 단원의 학습 진도를 가진 사용자들
    progress: many(progressTable),

    curriculums: many(curriculumsTable),

}));
