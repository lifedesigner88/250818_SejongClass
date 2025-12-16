import { useOutletContext } from "react-router"
import type { AdminOutletContext } from "../layout/admin-layout"




export default function AdminHome() {

    const {
        userRole
    } = useOutletContext<AdminOutletContext>()
    if (userRole != "admin") return "관리자만 접속 가능합니다."


    return (
        <div>
            Home
        </div>
    )
}