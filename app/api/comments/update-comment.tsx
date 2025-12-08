import { getUserIdForServer } from "#app/feature/auth/useAuthUtil.js";
import { getPublicUserData } from "#app/feature/users/quries.js";
import type { Route } from "./+types/update-comment";
import { adminUpdateComment, updateComment } from "./mutation";



export const action = async ({ request }: Route.ActionArgs) => {
    const formData = await request.formData()
    const commentId = Number(formData.get('comment_id'))
    const content = formData.get('content') as string
    const adminType = JSON.parse(formData.get("type") as string)
    
    const userId = await getUserIdForServer(request)
    if (!userId) return {error: "Unauthorized"}

    if (adminType) {
        const user = await getPublicUserData(userId)
        if (user?.role === "admin")
            await adminUpdateComment(commentId, content)
    } else {
        await updateComment(commentId, content, userId)
    }
    return {success:true}
}