import {
    boolean,
    index,
    integer,
    pgTable,
    serial,
    text,
    timestamp,
    uuid,
    smallint,
    primaryKey,
    type AnyPgColumn,
    pgPolicy
} from "drizzle-orm/pg-core";
import { usersTable } from "~/feature/users/schema";
import { unitsTable } from "~/feature/units/schema";
import { relations, sql } from "drizzle-orm";


export const commentsTable = pgTable("comments", {
    comment_id: serial().primaryKey(),
    content: text().notNull(),

    // 2단계 댓글을 위한 parent_comment_id (null이면 최상위 댓글)
    parent_comment_id: integer().references((): AnyPgColumn => commentsTable.comment_id, {
        onDelete: "cascade",
    }),

    // 좋아요 수
    likes_count: smallint().default(0).notNull(),

    // 상태 관리
    is_deleted: boolean().default(false).notNull(),
    is_edited: boolean().default(false).notNull(),

    created_at: timestamp().defaultNow().notNull(),
    updated_at: timestamp().defaultNow().$onUpdate(() => new Date()),

    // Foreign Keys
    user_id: uuid().references(() => usersTable.user_id, {
        onDelete: "cascade"
    }).notNull(),

    unit_id: integer().references(() => unitsTable.unit_id, {
        onDelete: "cascade"
    }).notNull(),

}, (table) => [

    index("comments_unit_id_idx").on(table.unit_id),
    index("comments_user_id_idx").on(table.user_id),
    index("comments_parent_comment_id_idx").on(table.parent_comment_id),
    index("comments_created_at_idx").on(table.created_at),

    pgPolicy(`policy-select`, {
        for: 'select',
        to: 'authenticated',
        using: sql`auth.uid() = user_id`,
    }),

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

export const commentsRelations = relations(commentsTable, ({ one, many }) => ({

    unit: one(unitsTable, {
        fields: [commentsTable.unit_id],
        references: [unitsTable.unit_id],
    }),
    user: one(usersTable, {
        fields: [commentsTable.user_id],
        references: [usersTable.user_id],
    }),

    comment: one(commentsTable, {
        fields: [commentsTable.parent_comment_id],
        references: [commentsTable.comment_id],
        relationName: "ParentChild",
    }),

    comments: many(commentsTable, {
        relationName: "ParentChild",
    }),

    likes: many(commentLikesTable)

}));


// 댓글 좋아요 테이블 (중복 좋아요 방지)
export const commentLikesTable = pgTable("comment_likes", {
        user_id: uuid().references(() => usersTable.user_id, {
            onDelete: "cascade"
        }).notNull(),

        comment_id: integer().references(() => commentsTable.comment_id, {
            onDelete: "cascade"
        }).notNull(),
    },
    (table) => [primaryKey({
        name: 'pk_comment_likes_user_comment',
        columns: [table.user_id, table.comment_id]
    }),
        pgPolicy(`policy-select`, {
            for: 'select',
            to: 'authenticated',
            using: sql`auth.uid() = user_id`,
        }),

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

export const commentLikesRelations = relations(commentLikesTable, ({ one }) => ({

    comment: one(commentsTable, {
        fields: [commentLikesTable.comment_id],
        references: [commentsTable.comment_id],
    }),

    user: one(usersTable, {
        fields: [commentLikesTable.user_id],
        references: [usersTable.user_id],
    })

}))