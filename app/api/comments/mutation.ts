import { and, eq, sql } from "drizzle-orm";
import db from "~/db";
import { commentLikesTable, commentsTable } from "~/feature/comments/schema";
import { deleteLikeNotification, insertNotification } from "../notifications/mutations";


export const createComment = ({ user_id, content, unit_id, isAdmin }: {
    user_id: string,
    content: string,
    unit_id: number,
    isAdmin: boolean
}) => {
    return db.insert(commentsTable).values({
        user_id,
        content,
        unit_id,
        is_admin_checked: isAdmin
    })
}

export const createReply = ({ user_id, content, unit_id, parent_comment_id, mentioned_user_id, isAdmin }: {
    user_id: string,
    content: string,
    unit_id: number,
    parent_comment_id: number,
    mentioned_user_id: string,
    isAdmin: boolean
}) => {
    return db.insert(commentsTable).values({
        user_id,
        content,
        parent_comment_id,
        unit_id,
        mentioned_user_id,
        is_admin_checked: isAdmin
    }).returning({ reply_id: commentsTable.comment_id })
}


export const toggleCommentLike = async (comment_id: number, userId: string,) => {
    await db.execute(sql`
        WITH deleted AS (
            DELETE FROM comment_likes
                WHERE comment_id = ${comment_id} AND user_id = ${userId}
                RETURNING 1 as deleted)
        INSERT
        INTO comment_likes (comment_id, user_id)
        SELECT ${comment_id}, ${userId}     
        WHERE NOT EXISTS (SELECT 1 FROM deleted)
    `)
}

export const updateCommentLike = async (comment_id: number, userId: string, writter_id: string, to_unit_url: string) => {
    const result = await db.query.commentLikesTable.findFirst({
        where: and(
            eq(commentLikesTable.comment_id, comment_id),
            eq(commentLikesTable.user_id, userId)
        )
    })
    if (!result) {
        await db.execute(sql`
        UPDATE comments
        SET likes_count = likes_count - 1
        WHERE comment_id = ${comment_id} 
    `)
        deleteLikeNotification(
            comment_id,
            writter_id
        )
    }
    else {
        await db.execute(sql`
        UPDATE comments
        SET likes_count = likes_count + 1
        WHERE comment_id = ${comment_id} 
    `)
        insertNotification({
            type: "like",
            comment_id: comment_id,
            from_user_id: userId,
            to_user_id: writter_id,
            to_unit_url
        })
    }
}

export const deleteComment = async (comment_id: number, userId: string) => {
    await db.delete(commentsTable)
        .where(and(
            eq(commentsTable.comment_id, comment_id),
            eq(commentsTable.user_id, userId)
        ));
}

export const adminDeleteComment = async (comment_id: number) => {
    await db.delete(commentsTable)
        .where(eq(commentsTable.comment_id, comment_id))
}


export const adminUpdateComment = async (comment_id: number, content: string) => {
    await db.update(commentsTable)
        .set({ content, is_edited: true, is_admin_checked: true })
        .where(eq(commentsTable.comment_id, comment_id))
}

export const adminCommentChecked = async (comment_id: number) => {
    await db.update(commentsTable)
        .set({ is_admin_checked: true })
        .where(eq(commentsTable.comment_id, comment_id))
}

export const updateComment = async (comment_id: number, content: string, userId: string) => {
    await db.update(commentsTable)
        .set({ content, is_edited: true, is_admin_checked: false })
        .where(and(
            eq(commentsTable.comment_id, comment_id),
            eq(commentsTable.user_id, userId)
        ));
}

