import type { Route } from "./+types/update-profile";
import { getUserIdForServer } from "~/feature/auth/useAuthUtil";
import { updateUserProfile } from "~/api/users/mutation";


export const action = async ({ request }: Route.ActionArgs) => {

    const method = request.method;
    if (method !== "POST") {
        return
    }

    const formData = await request.formData()
    const username = formData.get("username") as string
    const nickname = formData.get("nickname") as string
    const profile_url = formData.get("profileUrl") as string
    const beforeUsername = formData.get("beforeUserName") as string

    const user_id = await getUserIdForServer(request)

    if(user_id && beforeUsername && nickname && username)
        await updateUserProfile(user_id, beforeUsername, username, nickname, profile_url)

    return new Response("Successfully updated profile", {});
}