import { getUserIdForServer } from "#app/feature/auth/useAuthUtil.js";
import { getPublicUserData } from "#app/feature/users/quries.js";
import type { Route } from "./+types/update-video";
import { updateUnitVideo } from "./mutation";





export const action = async ({ request }: Route.ActionArgs) => {
    const method = request.method
    if (method !== "POST") return { "fail": "need To POST method" }

    const userId = await getUserIdForServer(request)
    if (!userId) return { "fail": "no login" }

    const getUserRole = await getPublicUserData(userId)
    const isAdmin = getUserRole?.role == "admin"

    if (isAdmin) {
        const fromData = await request.formData()
        const unit_id = Number(fromData.get("unit_id") as string)
        const youtube_video_id = fromData.get("youtube_video_id") as string
        const estimated_seconds = Number(fromData.get("estimated_seconds") as string)
        await updateUnitVideo(unit_id, youtube_video_id, estimated_seconds)
    }

    return { "ok": true }


}