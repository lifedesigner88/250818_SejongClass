import type { Route } from "./+types/delete-profile";
import { deleteProfile } from "~/api/users/mutation";
import { getUserIdForServer } from "~/feature/auth/useAuthUtil";

export const action = async ({ request }: Route.ActionArgs) => {
    const method = request.method;
    if (method !== "DELETE") return
    const userId = await getUserIdForServer(request)
    if (userId) await deleteProfile(request, userId)
}