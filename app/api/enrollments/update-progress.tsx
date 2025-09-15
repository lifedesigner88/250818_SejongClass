import { getUserIdForSever } from "~/feature/auth/useAuthUtil";
import type { Route } from "./+types/update-progress";


export const action = async ({ request }: Route.ActionArgs) => {

    const userId = await getUserIdForSever(request)
    const formData = await request.formData();
    const progress = formData.get('progress_rate');

    console.log(progress)
    console.log(userId)

    // update 쿼리 날리기.

    return new Response("ok", { status: 200 })

}