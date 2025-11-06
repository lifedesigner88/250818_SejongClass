import { getUserIdForServer } from "#app/feature/auth/useAuthUtil.js";
import type { Route } from "./+types/check-notifi";
import { checkNotification, deleteNotification } from "./mutations";


export const action = async ({ request }: Route.ActionArgs) => {

    const method = request.method;
    if (method !== "POST") return

    const userId = await getUserIdForServer(request)
    if (!userId) return

    const formData = await request.formData()
    
    const type = formData.get("type") as string
    const notification_id = formData.get("notification_id") as string
    
    if (type == "confirm") 
        await checkNotification(userId, Number(notification_id))
    
    else if (type == "delete") 
        await deleteNotification(userId, Number(notification_id))
    
    return { "ok": true }
}