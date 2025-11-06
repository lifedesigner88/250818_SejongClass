import db from "#app/db/index.js"
import { notificationsTable } from "#app/feature/notifications/schema.js"
import { and, eq } from "drizzle-orm"


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
