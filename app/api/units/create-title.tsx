import type { Route } from "./+types/create-title";
import { getUserIdForServer } from "~/feature/auth/useAuthUtil";
import { getPublicUserData } from "~/feature/users/quries";
import { createMajor, createMiddle, createUnit } from "~/api/units/mutation";


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
            const textBookId = formData.get('textbookId') as string;
            await createMajor(Number(textBookId));
        }
        else if (type=="middle") {
            const majorId = formData.get('majorId') as string;
            await createMiddle(Number(majorId));

        }
        else if (type=="unit") {
            const unitId = formData.get('middleId') as string;
            await createUnit(Number(unitId));
        }
    }
    return { "ok": true }
}