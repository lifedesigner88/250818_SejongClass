import { getUserIdForServer } from "#app/feature/auth/useAuthUtil.js"
import type { Route } from "./+types/complete-unit"
import { completeUnitCheck } from "./mutation"


export const action = async ({ request }: Route.ActionArgs) => {

    const method = request.method
    if (method !== "POST") return 

    const userId = await getUserIdForServer(request)
    if (!userId) return 

    const formData = await request.formData()
    const unitId = Number(formData.get('unit_id') as string);

    try {
        await completeUnitCheck(unitId, userId)
    } catch {
        console.log("이미 있는 정보")
    }

    return {"ok": true}
}