import type { Route } from "./+types/visit-log";
import { getUserVisitLog, stampVisitLog } from "~/api/users/mutation";
import { getUserIdForServer } from "~/feature/auth/useAuthUtil";

export const action = async ({ request }: Route.ActionArgs) => {
    const userId = await getUserIdForServer(request)
    if (userId) {
        const result = await getUserVisitLog(userId)
        if (result) return { ok: true }
        await stampVisitLog(userId)
    }
    return { ok: true };
}