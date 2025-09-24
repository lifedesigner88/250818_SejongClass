import type { Route } from "./+types/toggle-curriculum"
import { getUserIdForSever } from "~/feature/auth/useAuthUtil";
import { toggleCurriculum } from "~/api/curriculums/mutation";


export const action = async ({ request }: Route.ActionArgs) => {
    const userId = await getUserIdForSever(request)
    const formData = await request.formData();
    const curriculum_id = formData.get('curriculum_id') as string;
    if (!curriculum_id) return { error: "curriculum_id is required" };
    await toggleCurriculum(Number(curriculum_id), userId!)
    return new Response("ok", { status: 200 })
}
