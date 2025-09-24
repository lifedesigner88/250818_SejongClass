
import type { Route } from "./+types/create-note"
import { getUserIdForServer } from "~/feature/auth/useAuthUtil";
import { createUserNote } from "~/api/notes/mutation";


export const action = async ({ request }: Route.ActionArgs) => {
    const formData = await request.formData();
    const unit_id = Number(formData.get("unit_id"));
    console.log(unit_id);
    const userId = await getUserIdForServer(request);
    if (userId) await createUserNote(userId, unit_id);
    return { success: true };
}