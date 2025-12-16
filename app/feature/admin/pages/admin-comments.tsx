import { useOutletContext } from "react-router"
import type { AdminOutletContext } from "../layout/admin-layout"
import type { Route } from "./+types/admin-comments"
import { getCommentsToAdmin } from "../queries"




export const loader = async ({ request }: Route.LoaderArgs) => {

    const comments = await getCommentsToAdmin()
    console.log(comments)

    return { comments }

}


export default function AdminComments({ loaderData }: Route.ComponentProps) {

    const {comments} = loaderData
    console.log(comments)

    const {
        userRole
    } = useOutletContext<AdminOutletContext>()
    if (userRole != "admin") return "관리자만 접속 가능합니다. /admin/comments"

    return (
        <div>
            Comments
        </div>
    )
}