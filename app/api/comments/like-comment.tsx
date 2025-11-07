import type { Route } from "./+types/like-comment";
import { getUserIdForServer } from "~/feature/auth/useAuthUtil";
import z from "zod";
import { toggleCommentLike, updateCommentLike } from "~/api/comments/mutation";

export const action = async ({ request }: Route.ActionArgs) => {
    if (request.method !== "POST") {
        throw new Error('Method not allowed');
    }

    const formData = await request.formData();
    const formDataObject = Object.fromEntries(formData.entries());

    const schema = z.object({
        comment_id: z.coerce.number().int().positive(),
        writter_id: z.uuid()
    });

    const { success, data } = schema.safeParse(formDataObject);
    if (!success) throw new Error('Invalid form data');

    const userId = await getUserIdForServer(request);
    if (!userId) return { status: 401, body: { error: 'Unauthorized' } };

    await toggleCommentLike(data.comment_id, userId);
    await updateCommentLike(data.comment_id, userId, data.writter_id);


    return new Response("ok", { status: 200 });
}