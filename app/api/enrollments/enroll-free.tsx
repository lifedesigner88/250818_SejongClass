import type { Route } from "./+types/enroll-free";
import { getUserIdForSever } from "~/feature/auth/useAuthUtil";
import { enrollFreeTextbook, getTextbookPrice, incrementEnrolledStudents } from "~/api/enrollments/mutation";


export const action = async ({ request }: Route.ActionArgs) => {
//Todo 리다이렉트 로직 구현
    try {
        const formData = await request.formData();
        const textbooksId = formData.get('textbook_id') as string;
        const requestPrice = formData.get('price') as string;
        const textbook_id = Number(textbooksId);

        // 무료인지 체크
        const { price: DBPrice }: any = await getTextbookPrice(textbook_id);
        const userId = await getUserIdForSever(request)

        if (Number(requestPrice) === DBPrice && userId !== null) {
            await enrollFreeTextbook(textbook_id, userId!);
            await incrementEnrolledStudents(textbook_id)
        } else {
            return "fail"
        }
    } catch (e) {
        console.log(e);
        return "fail"
    }
    return "success"
}