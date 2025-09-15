import type { Route } from "./+types/toggle-unit"
import { getUserIdForSever } from "~/feature/auth/useAuthUtil";
import { toggleUnit } from "~/api/units/mutation";


export const action = async ({ request }: Route.ActionArgs) => {
    const userId = await getUserIdForSever(request)
    const formData = await request.formData();
    const unitId = formData.get('unit_id') as string;
    if (!unitId) return { error: "curriculum_id is required" };
    await toggleUnit(Number(unitId), userId)
    return new Response("ok", { status: 200 })
}
