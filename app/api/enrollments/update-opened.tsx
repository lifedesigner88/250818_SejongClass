import { getUserIdForServer } from "#app/feature/auth/useAuthUtil.js";
import type { Route } from "./+types/update-opened";
import { updateOpenedUnits } from "./mutation";




export const action = async ({ request }: Route.ActionArgs) => {

    const method = request.method
    if (method !== "POST") return 

    const userId = await getUserIdForServer(request)
    if (!userId) return

    const formData = await request.formData()

    const textbook_id = Number(formData.get("textbook_id") as string)
    const opened_chapter_ids = JSON.parse(formData.get("opened_chapter_ids") as string) as number[];

    await updateOpenedUnits(textbook_id, userId, opened_chapter_ids)

    return {"ok" : true}
}