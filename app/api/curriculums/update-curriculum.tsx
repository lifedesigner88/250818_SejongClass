import { getUserIdForServer } from "#app/feature/auth/useAuthUtil.js";
import type { CurriculumListType } from "#app/feature/units/pages/unit-page.js";
import { getPublicUserData } from "#app/feature/users/quries.js";
import type { Route } from "./+types/update-curriculum";
import { createNewCurriculum, deleteCurriculum, updateCurriculum, upsertCurriculums } from "./mutation";




export const action = async ({ request }: Route.ActionArgs) => {

    const method = request.method
    if (method !== "POST") return { "fail": "need To Post method" }

    const userId = await getUserIdForServer(request)
    if (!userId) return { "fail": "no login" }

    const getUserRole = await getPublicUserData(userId)
    const isAdmin = getUserRole?.role == "admin"

    if (isAdmin) {
        const fromData = await request.formData()
        const type = fromData.get("type") as string

        if (type === "newRow") {
            const unit_id = Number(fromData.get("unit_id") as string)
            await createNewCurriculum(unit_id)
        }
        else if (type === "deleteRow") {
            const curriculum_id = Number(fromData.get("curriculum_id") as string)
            await deleteCurriculum(curriculum_id)
        }
        else if (type === "saveRow") {
            const curriculum_id = Number(fromData.get("curriculum_id") as string)
            const sort_order = Number(fromData.get("sort_order") as string)
            const code = fromData.get("code") as string
            const achievement_text = fromData.get("achievement_text") as string

            await updateCurriculum(curriculum_id, sort_order, code, achievement_text)
        }
        else if (type === "saveAll") {
            const curriculumsRaw = fromData.get("curriculums") as string;
            const curriculums = JSON.parse(curriculumsRaw) as CurriculumListType;
                await upsertCurriculums(curriculums);
        }
    }

    return { success: true }
}