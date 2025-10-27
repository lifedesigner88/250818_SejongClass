import type { Route } from "./+types/update-title";
import { getUserIdForServer } from "~/feature/auth/useAuthUtil";
import { getPublicUserData } from "~/feature/users/quries";
import { updateMajor, updateMiddle, updateUnit } from "~/api/units/mutation";
import type { UnitInfoType } from "~/feature/textbooks/component/EditUnitDialog";

export const action = async ({ request }: Route.ActionArgs) => {
    const method = request.method;
    if (method !== "POST") return

    const userId = await getUserIdForServer(request);
    if (!userId) return
    const getUserRole = await getPublicUserData(userId)
    const isAdmin = getUserRole?.role === "admin";

    if (isAdmin) {
        const formData = await request.formData()
        const unitInfo: UnitInfoType = JSON.parse(formData.get('unit_info') as string);
        await updateMajor(
            unitInfo.major.id,
            unitInfo.major.title,
            unitInfo.major.sort_order,
            unitInfo.major.parent_id

        );
        await updateMiddle(
            unitInfo.middle.id,
            unitInfo.middle.title,
            unitInfo.middle.sort_order,
            unitInfo.middle.parent_id
        );
        await updateUnit(
            unitInfo.unit.id,
            unitInfo.unit.title,
            unitInfo.unit.sort_order,
            unitInfo.is_free,
            unitInfo.is_published,
            unitInfo.unit.parent_id
        );
    }
    return { "ok": true }
}