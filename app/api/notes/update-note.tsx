
import type { Route } from "./+types/update-note";
import z from "zod";
import { getUserIdForSever } from "~/feature/auth/useAuthUtil";
import type { JSONContent } from "@tiptap/react";
import { updateUserNote } from "~/api/notes/mutation";


export const action = async ({ request }: Route.ActionArgs) => {
    if (request.method !== "POST") {
        throw new Error('Method not allowed');
    }
    const formData = await request.formData();
    const schema = z.object({
        content: z.string().min(1).transform((str) => {
            try {
                return JSON.parse(str) as JSONContent;
            } catch {
                throw new Error('Invalid JSON content');
            }
        }),
        unit_id: z.coerce.number().min(1)
    });

    const { success, data } = schema.safeParse(Object.fromEntries(formData));
    if (!success) throw new Error('Invalid form data');

    // JSONContent 객체를 직접 전달
    const userId = await getUserIdForSever(request);
    if (userId) await updateUserNote(userId, data.unit_id, data.content);

    return { success: true };
};
