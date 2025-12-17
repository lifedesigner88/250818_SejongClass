import { getUserIdForServer } from "#app/feature/auth/useAuthUtil.js"
import { getPublicUserData } from "#app/feature/users/quries.js"
import type { Route } from "./+types/check-comment"
import { adminCommentChecked, toggleCommentLike, updateCommentLike } from "./mutation"



export const action = async ({ request }: Route.ActionArgs) => {
    const method = request.method
    if (method !== "POST") return

    const formData = await request.formData()
    const commentId = Number(formData.get('comment_id') as string)
    const writter_id = formData.get('writter_id') as string
    const to_unit_url = formData.get('to_unit_url') as string
    const userId = await getUserIdForServer(request)
    if (!userId) return
    const user = await getPublicUserData(userId)
    if (user?.role === "admin") {
        await adminCommentChecked(commentId)
        await toggleCommentLike(commentId, userId);
        await updateCommentLike(commentId, userId, writter_id, to_unit_url!)
    }
    return { success: true }
}