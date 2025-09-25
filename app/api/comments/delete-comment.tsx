import type { Route } from "./+types/delete-comment";
import { deleteComment } from "~/api/comments/mutation";
import { getUserIdForServer } from "~/feature/auth/useAuthUtil";

export const action = async ({ request }: Route.ActionArgs) => {

    const formData = await request.formData();
    const commentId = Number(formData.get("comment_id"));

    const userId = await getUserIdForServer(request)

    if (!userId) {
        return { error: "Unauthorized" };
    }
    await deleteComment(commentId, userId!)

    return { success: true };
}