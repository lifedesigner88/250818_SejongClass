import { useNavigate, useOutletContext } from "react-router"
import type { AdminOutletContext } from "../layout/admin-layout"
import type { Route } from "./+types/admin-comments"
import { getCommentsToAdmin } from "../queries"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "#app/common/components/ui/card.js"
import { Button } from "#app/common/components/ui/button.js"
import { Avatar, AvatarFallback, AvatarImage } from "#app/common/components/ui/avatar.js"
import { Heart } from "lucide-react"
import { DateTime } from "luxon"




export const loader = async ({ request }: Route.LoaderArgs) => {
    const comments = await getCommentsToAdmin()
    return { comments }
}

export default function AdminComments({ loaderData }: Route.ComponentProps) {
    const {
        userRole
    } = useOutletContext<AdminOutletContext>()
    const isAdmin = userRole == "admin"

    if (!isAdmin) return "관리자만 접속 가능합니다. /admin/comments"
    const { comments } = loaderData

    return (
        <div className="w-full m-3 max-h-[calc(100vh-100px)] overflow-y-auto">
            {isAdmin
                ? <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(320px,1fr))] ">
                    {comments.map(comment => {
                        const unit = comment.unit
                        const user = comment.user
                        const textbook = unit.middle.major.textbook
                        const subject = textbook.subject
                        const theme = subject.theme

                        return (
                            <Card key={comment.comment_id} className="flex flex-col justify-between">
                                <CardHeader>
                                    <CardTitle>
                                        {user.nickname} {`@${user.username}`}
                                    </CardTitle>
                                    <CardDescription>{`${theme.name} > ${textbook.title} > ${unit.title}`}</CardDescription>
                                    <CardAction>
                                        <a
                                            href={`/${theme.slug}/${subject.slug}/${textbook.textbook_id}/${unit.unit_id}`}
                                            target="_blank" >
                                            <Button variant={"outline"}>➡️</Button>
                                        </a>
                                    </CardAction>
                                    <span className="text-xs text-muted-foreground">
                                        {DateTime.fromJSDate(comment.created_at!).setLocale("ko").toRelative()}
                                        {comment.is_edited ? ` / ✏️ (수정) ${DateTime.fromJSDate(comment.updated_at!).setLocale("ko").toRelative()} ` : " 작성"}
                                    </span>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                                </CardContent>
                                <CardFooter>
                                    <div className="flex items-center gap-3">
                                        <a
                                            href={`/profile/${user.username}`}
                                            target="_blank" >
                                            <Avatar className="size-9 sm:size-11 cursor-pointer">
                                                <AvatarImage src={user.profile_url || ""} />
                                                <AvatarFallback>
                                                    {comment.user.username.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </a>
                                        <Heart className={"size-4 fill-red-500  text-red-500"} />
                                        <span className="text-xs">
                                            {comment.likes_count}
                                        </span>
                                        <Button variant={"outline"}>확인✅</Button>
                                    </div>
                                </CardFooter>
                            </Card>
                        )
                    })}
                </div>
                : null
            }
        </div>
    )
}