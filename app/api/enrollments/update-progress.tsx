import { getUserIdForSever } from "~/feature/auth/useAuthUtil";
import type { Route } from "./+types/update-progress";
import { updateEnrolledProgress } from "~/api/enrollments/mutation";


export const action = async ({ request }: Route.ActionArgs) => {

    const userId = await getUserIdForSever(request)
    // JSON 데이터 파싱
    const data = await request.json();
    const progress = data.progress_rate;
    const textbook_id = data.textbook_id;

    // 과목 진행상황
    void updateEnrolledProgress(Number(textbook_id), userId, progress);

    return new Response("ok", { status: 200 })
}