import type { Route } from "./+types/update-readme";
import { getUserIdForServer } from "~/feature/auth/useAuthUtil";
import { updateUnitReadmeContent } from "~/api/units/mutation";
import type { JSONContent } from "@tiptap/react";
import z from "zod";
import { getPublicUserData } from "~/feature/users/quries";


export const action = async ({ request }: Route.ActionArgs) => {
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
    const userId = await getUserIdForServer(request);
    if (!userId) return

    const getUserRole = await getPublicUserData(userId)
    const isAdmin = getUserRole?.role === "admin"
    if (isAdmin) await updateUnitReadmeContent(data.unit_id, data.content);

    return { success: true };
};
