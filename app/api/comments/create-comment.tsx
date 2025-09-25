import type { Route } from "./+types/create-comment";
import { getUserIdForServer } from "~/feature/auth/useAuthUtil";
import { createComment, createReply } from "~/api/comments/mutation";
import z from "zod";


export const action = async ({ request }: Route.ActionArgs) => {
    if (request.method !== "POST") {
        throw new Error('Method not allowed');
    }

    const schema = z.object({
        content: z.string().min(1),
        unit_id: z.coerce.number().int().positive(),
        parent_comment_id: z.coerce.number().int().positive().optional(),
        type: z.enum(['comment', 'reply'])
    });

    const formData = await request.formData()
    const formDataObject = Object.fromEntries(formData.entries());
    const { success, data, error } = schema.safeParse(formDataObject);
    if (!success) return { status: 400, body: { errors: error } };

    const user_id = await getUserIdForServer(request)
    if (!user_id) return { status: 401, body: { error: 'Unauthorized' } };

    if (data.type === 'comment') {
        await createComment({ user_id, ...data })
    } else if (data.type === 'reply' && data.parent_comment_id !== undefined) {
        const refineData = {
            ...data,
            parent_comment_id: data.parent_comment_id,
        }
        await createReply({user_id, ...refineData})
    }

    return new Response("ok", { status: 200 })
}