import { getUserIdForServer } from "~/feature/auth/useAuthUtil";
import { getPublicUserData } from "~/feature/users/quries";
import { deleteMajor, deleteMiddle, deleteUnit } from "~/api/units/mutation";
import type { Route } from "./+types/delete-title";

export const action = async ({ request }: Route.ActionArgs) => {
    const method = request.method;
    if (method !== "POST") return
    const userId = await getUserIdForServer(request);
    if (!userId) return
    const getUserRole = await getPublicUserData(userId)
    const isAdmin = getUserRole?.role === "admin";
    if (isAdmin){
        const formData = await request.formData()
        const type = formData.get('type') as string;
        if (type=="major") {
            const majorId = formData.get('majorId') as string;
            await deleteMajor(Number(majorId));
        }
        else if (type=="middle") {
            const middleId = formData.get('middleId') as string;
            await deleteMiddle(Number(middleId));

        }
        else if (type=="unit") {
            const unitId = formData.get('unitId') as string;
            await deleteUnit(Number(unitId));
        }
    }
    return { "ok": true }
}