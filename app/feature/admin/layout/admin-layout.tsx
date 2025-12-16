import { Outlet, useNavigate, } from "react-router"
import type { Route } from "./+types/admin-layout"
import { getUserIdForServer } from "#app/feature/auth/useAuthUtil.js"
import { getPublicUserData } from "#app/feature/users/quries.js"
import {
    Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu,
    SidebarMenuButton, SidebarMenuItem, SidebarProvider
} from "@/components/ui/sidebar"
import { Button } from "#app/common/components/ui/button.js"


export type AdminOutletContext = {
    userRole: Route.ComponentProps["loaderData"]["userRole"];
};

export const loader = async ({ request }: Route.LoaderArgs) => {

    const userId = await getUserIdForServer(request)
    if (!userId) return { isAdmin: false, userRole: "user" }

    const userInfo = await getPublicUserData(userId)
    const isAdmin = userInfo?.role === "admin"

    return { isAdmin, userRole: userInfo?.role }
}


export default function AdminLayout({ loaderData }: Route.ComponentProps) {

    const { isAdmin, userRole } = loaderData
    if (!isAdmin || userRole != "admin") return "관리자만 접속 가능합니다. /admin"

    const navigate = useNavigate()

    return (
        <div className="flex">
            <SidebarProvider>
                <Sidebar>
                    <SidebarContent className="mt-16">
                        <SidebarGroup>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <Button
                                                onClick={() => navigate("/admin")}
                                            >홈</Button>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <Button
                                                onClick={() => navigate("/admin/comments")}
                                            >댓글들</Button>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>
                </Sidebar>
                <Outlet
                    context={{
                        userRole
                    }}
                />
            </SidebarProvider >

        </div >

    )
}