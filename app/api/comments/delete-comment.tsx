import type { Route } from "./+types/delete-comment";
import { adminDeleteComment, deleteComment } from "~/api/comments/mutation";
import { getUserIdForServer } from "~/feature/auth/useAuthUtil";
import { getPublicUserData } from "~/feature/users/quries";

export const action = async ({ request }: Route.ActionArgs) => {

    const formData = await request.formData();
    const commentId = Number(formData.get("comment_id"));
    const type = JSON.parse(formData.get("type") as string);
    const userId = await getUserIdForServer(request)
    if (!userId) return { error: "Unauthorized" };

    if (!type) {
        await deleteComment(commentId, userId!)
    } else {
        const user = await getPublicUserData(userId)
        if (user?.role === "admin")
            await adminDeleteComment(commentId)
    }
    return { success: true };
}