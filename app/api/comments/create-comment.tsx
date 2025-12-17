import type { Route } from "./+types/create-comment";
import { getUserIdForServer } from "~/feature/auth/useAuthUtil";
import { createComment, createReply } from "~/api/comments/mutation";
import z from "zod";
import { insertNotification } from "../notifications/mutations";


export const action = async ({ request }: Route.ActionArgs) => {
    if (request.method !== "POST") {
        throw new Error('Method not allowed');
    }

    const schema = z.object({
        content: z.string().min(1),
        unit_id: z.coerce.number().int().positive(),
        parent_comment_id: z.coerce.number().int().positive().optional(),
        mentioned_user_id: z.uuid().optional(),
        to_unit_url: z.string().min(1).optional(),
        type: z.enum(['comment', 'reply']),
        isAdmin: z.string()
    });
    const formData = await request.formData()
    const formDataObject = Object.fromEntries(formData.entries());


    const { success, data, error } = schema.safeParse(formDataObject);
    if (!success) {
        console.log(error)
        return { status: 400, body: { errors: error } };
    }


    const user_id = await getUserIdForServer(request)
    if (!user_id) return { status: 401, body: { error: 'Unauthorized' } };

    if (data.type === 'comment') {
        await createComment({ user_id, ...data, isAdmin: data.isAdmin! === "true" })

    } else if (data.type === 'reply' && data.parent_comment_id !== undefined) {
        const refineData = {
            ...data,
            parent_comment_id: data.parent_comment_id,
            mentioned_user_id: data.mentioned_user_id!,
            isAdmin: data.isAdmin! === "true"
        }
        const [{ reply_id }] = await createReply({ user_id, ...refineData })

        await insertNotification({
            type: "reply",
            comment_id: reply_id,
            from_user_id: user_id,
            to_user_id: data.mentioned_user_id!,
            to_unit_url: data.to_unit_url
        })


    }

    return new Response("ok", { status: 200 })
}