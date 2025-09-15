import { getUserIdForSever } from "~/feature/auth/useAuthUtil";
import type { Route } from "./+types/update-progress";


export const action = async ({ request }: Route.ActionArgs) => {

    const userId = await getUserIdForSever(request)
    // JSON 데이터 파싱
    const data = await request.json();
    const progress = data.progress_rate;

    console.log(progress);
    console.log(userId);

    // update 쿼리 날리기.

    return new Response("ok", { status: 200 })

}