import db from "#app/db/index.js"
import { notificationsTable } from "#app/feature/notifications/schema.js"
import { and, eq, type InferInsertModel  } from "drizzle-orm"


export const checkNotification = async (user_id:string, notification_id:number) => {
    return db.update(notificationsTable)
    .set({ is_checked:true })
    .where(and(
        eq(notificationsTable.notification_id, notification_id),
        eq(notificationsTable.to_user_id, user_id)
     ))
}

export const deleteNotification = async (user_id:string, notification_id:number) => {
    return db.delete(notificationsTable)
            .where(and(
            eq(notificationsTable.notification_id, notification_id),
            eq(notificationsTable.to_user_id, user_id)
        ))
}


export const insertNotification = async({
    type,
    comment_id,
    from_user_id, 
    to_user_id,
    to_unit_url, 
}:InferInsertModel<typeof notificationsTable>) => {
    return db.insert(notificationsTable).values({
        type,
        comment_id,
        from_user_id,
        to_user_id,
        to_unit_url
    })
}

export const deleteLikeNotification = async(comment_id: number, writter_id: string) => {
    return db.delete(notificationsTable)
    .where(and(
        eq(notificationsTable.type, "like"),
        eq(notificationsTable.comment_id, comment_id),
        eq(notificationsTable.from_user_id, writter_id)
    ))
}