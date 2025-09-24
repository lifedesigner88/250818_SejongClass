import { getUserIdForSever } from "~/feature/auth/useAuthUtil";
import { deleteUserNote} from "~/api/notes/mutation";
import z from "zod";
import type { Route } from "./+types/delete-note";


export const action = async ({ request }: Route.ActionArgs) => {
    if (request.method !== "DELETE") {
        throw new Error('Method not allowed');
    }
    const formData = await request.formData();
    const schema = z.object({
        unit_id: z.coerce.number().min(1)
    });
    const { success, data } = schema.safeParse(Object.fromEntries(formData));
    if (!success) throw new Error('Invalid form data');

    // JSONContent 객체를 직접 전달
    const userId = await getUserIdForSever(request);
    if (userId) await deleteUserNote(userId, data.unit_id );

    return { success: true };
};
