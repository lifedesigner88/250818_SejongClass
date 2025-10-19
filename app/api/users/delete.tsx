import { getUserIdForServer } from "~/feature/auth/useAuthUtil";
import type { Route } from "./+types/delete";
import { makeSSRClient } from "~/supa-clents";
import { deleteProfile, deleteUserInfo } from "~/api/users/mutation";


export const action = async ({ request }: Route.ActionArgs) => {
    const method = request.method;
    if (method !== "DELETE") return
    const userId = await getUserIdForServer(request)

    const formData = await request.formData()
    const requestUserId = formData.get("loginUserId") as string

    if (userId === requestUserId) {
        const { client } = makeSSRClient(request);
        await client.auth.admin.deleteUser(userId)
        await deleteUserInfo(requestUserId)
        await deleteProfile(request, userId)
    }
}