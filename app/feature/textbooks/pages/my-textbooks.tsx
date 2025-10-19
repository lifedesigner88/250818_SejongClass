import { getUserIdForServer } from "~/feature/auth/useAuthUtil";
import type { Route } from "./+types/my-textbooks"
import { getEnrolledTextbooksByUserId } from "~/feature/textbooks/queries";
import { EnrolledCoursesGrid } from "~/feature/textbooks/pages/enrolled";

export const loader = async ({ request }: Route.LoaderArgs) => {
    const userId = await getUserIdForServer(request)
    const textbooks = await getEnrolledTextbooksByUserId(userId!)
    return { textbooks }
};

export type EnrolledTextbooksType = Awaited<ReturnType<typeof getEnrolledTextbooksByUserId>>;

export default function MyTextbooks({ loaderData }: Route.ComponentProps) {

    const { textbooks } = loaderData;
    if (!textbooks)
        return <h1 className={"p-6"}> 로그인이 필요합니다.</h1>;

    const erolledTextbooks = textbooks.enrollments;
    if (erolledTextbooks.length === 0 )
        return <h1 className={"p-6"}> 등록된 강좌가 없습니다. </h1>;

    return (
        <div className={"h-[calc(100vh-64px)] max-w-screen overflow-y-auto"}>
            <div className={"max-w-[1080px] mx-auto my-20 "}>
                <EnrolledCoursesGrid
                    courses={erolledTextbooks}
                />
            </div>
        </div>

    )
}