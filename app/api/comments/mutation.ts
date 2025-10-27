import { and, eq, sql } from "drizzle-orm";
import db from "~/db";
import { commentLikesTable, commentsTable } from "~/feature/comments/schema";


export const createComment = ({ user_id, content, unit_id }: {
    user_id: string,
    content: string,
    unit_id: number
}) => {
    return db.insert(commentsTable).values({
        user_id,
        content,
        unit_id
    })
}

export const createReply = ({ user_id, content, unit_id, parent_comment_id }: {
    user_id: string,
    content: string,
    unit_id: number,
    parent_comment_id: number
}) => {
    return db.insert(commentsTable).values({
        user_id,
        content,
        parent_comment_id,
        unit_id
    })
}


export const toggleCommentLike = async (comment_id: number, userId: string) => {
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

export const updateCommentLike = async (comment_id: number, userId: string) => {
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
    }
    else {
        await db.execute(sql`
        UPDATE comments
        SET likes_count = likes_count + 1
        WHERE comment_id = ${comment_id} 
    `)
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
        .where(eq(commentsTable.comment_id, comment_id));
}