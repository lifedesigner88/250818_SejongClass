
import { getUserIdForServer } from "#app/feature/auth/useAuthUtil.js";
import type { Route } from "./+types/update-review";
import { updateReviewRating } from "./mutation";



export const action = async ({ request }: Route.ActionArgs) => {

    const method = request.method
    if (method !== "POST") return

    const userId = await getUserIdForServer(request)
    if (!userId) return

    const formData = await request.formData()
    const textbook_id = Number(formData.get("textbook_id") as string)
    const rating = Number(formData.get("rating") as string)
    const review = formData.get("review") as string
    
    await updateReviewRating(textbook_id, userId, rating, review)
    return { "ok": true }

}