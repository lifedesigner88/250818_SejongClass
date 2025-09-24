import type { Route } from "./+types/toggle-unit"
import { getUserIdForServer } from "~/feature/auth/useAuthUtil";
import { toggleUnit } from "~/api/units/mutation";


export const action = async ({ request }: Route.ActionArgs) => {
    const userId = await getUserIdForServer(request)
    if (!userId) return { error: "userId_required" }
    const formData = await request.formData();
    const unitId = formData.get('unit_id') as string;
    if (!unitId) return { error: "curriculum_required" };
    await toggleUnit(Number(unitId), userId!)
    return new Response("ok", { status: 200 })
}
