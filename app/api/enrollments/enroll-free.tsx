import type { Route } from "./+types/enroll-free";
import { getUserIdForSever } from "~/feature/auth/useAuthUtil";
import { enrollFreeTextbook, getTextbookPrice, incrementEnrolledStudents } from "~/api/enrollments/mutation";


export const action = async ({ request }: Route.ActionArgs) => {

    try {
        const formData = await request.formData();
        const textbooksId = formData.get('textbook_id') as string;
        const requestPrice = formData.get('price') as string;
        const textbook_id = Number(textbooksId);

        // 무료인지 체크
        const { price: DBPrice } = await getTextbookPrice(textbook_id);
        const userId = await getUserIdForSever(request)

        if (Number(requestPrice) === DBPrice) {
            const enrolledData = await enrollFreeTextbook(textbook_id, userId);
            await incrementEnrolledStudents(textbook_id)
            console.log(enrolledData);
        }

    } catch (e) {
        console.log(e);
        return "success"
    }
    return "fail"
}