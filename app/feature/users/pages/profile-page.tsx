import GitHubGrass, { type GitGressDay } from "~/feature/users/pages/git-hub-grass";
import type { Route } from "./+types/profile-page";
import { getActiveStamps } from "~/feature/users/quries";
import { DateTime } from "luxon";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProfileEdit from "~/feature/users/pages/profile-edit";
import { useAuthOutletData } from "~/feature/auth/useAuthUtil";
import { CompletedCoursesGrid } from "~/feature/users/pages/completed-course-card";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import {
    AlertDialog, AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useFetcher } from "react-router";


export const loader = async ({ params }: Route.LoaderArgs) => {
    const { username } = params
    const activeStamps = await getActiveStamps(username)
    return { activeStamps }
}

type ActiveStampType = Awaited<ReturnType<typeof getActiveStamps>>;
export type myPageEnrollmentsType = NonNullable<ActiveStampType>['enrollments'];

export default function ProfilePage({ loaderData }: Route.ComponentProps) {
    const { activeStamps } = loaderData
    if (!activeStamps) {
        return <h1 className={"p-5"}>존재하지 않는 유저 입니다. </h1>
    }
    const auth = useAuthOutletData()
    const canEdit = auth.isLoggedIn && auth.publicUserData.username === activeStamps.username
    const loginUserId = auth.publicUserData?.user_id || "public";

    const { username, profile_url, created_at, updated_at, nickname } = activeStamps
    const userPofile = { username, profile_url, created_at, updated_at, nickname }
    const createUserDay = activeStamps.created_at
    const profileUpdateDay = activeStamps.updated_at


    const totalUnitConut = activeStamps.progress.length;
    const totalUnitSceond = activeStamps.progress.reduce((acc, cur) => cur.unit.estimated_seconds + acc, 0)

    const totalCheckListCount = activeStamps.checklists.length;
    const totalCommentsCount = activeStamps.comments.length;

    const countMap = new Map<string, number>();
    const yearSet = new Set<number>();

    const allStampItems = [
        ...activeStamps.checklists,
        ...activeStamps.progress,
        ...activeStamps.comments,
        { updated_at: created_at }, // 가입일 하나 추가.
    ];

    allStampItems.forEach((item) => {
        const temp = DateTime.fromJSDate(item.updated_at!).setZone('Asia/Seoul');
        yearSet.add(Number(temp.year.toString()));

        const key = temp.toISODate()!;
        countMap.set(key, (countMap.get(key) || 0) + 1);
    });


    const dayMap: Map<string, GitGressDay> = new Map(
        [...countMap].map(([key, value]) => [key, { date: key, count: value, }])
    );

    const sortedSetYear = [...yearSet].sort()
    const [yearStemp, setYearStemp] = useState<number>(sortedSetYear[sortedSetYear.length - 1]);


    // 회원탈퇴
    const [deleteUser, setDeleteUser] = useState<string>("")
    const fetcher = useFetcher()
    const deleteUserAllData = () => {
        void fetcher.submit({
            loginUserId
        },{
            method: "DELETE",
            action: "/api/users/delete",
        })
        alert("영구 삭제 되었습니다.")
    }
    return (
        <div className={"flex flex-col items-center h-[calc(100vh-64px)] max-w-screen overflow-y-auto"}>

            <ProfileEdit
                userProfile={userPofile}
                createUserDay={createUserDay!}
                profileUpdateDay={profileUpdateDay!}
                totalUnitCount={totalUnitConut}
                totalUnitSecond={totalUnitSceond}
                totalCheckListCount={totalCheckListCount}
                totalCommentsCount={totalCommentsCount}
                canEdit={canEdit}
                loginUserId={loginUserId}
            />

            <div className={"mt-3 flex gap-1"}>
                {sortedSetYear.map((year) => (
                    <Button
                        key={year}
                        variant={"outline"}
                        className={yearStemp === year ? "bg-emerald-600 text-white" : ""}
                        onClick={() => setYearStemp(year)}>
                        {year}
                    </Button>

                ))}
            </div>
            <GitHubGrass
                dayMap={dayMap}
                showYear={yearStemp}
            />
            <div className={"w-full p-0 my-20"}>
                {activeStamps.enrollments.length > 0 && (
                    <Card className={"max-w-[1080px] mx-auto"}>
                        <CardContent>

                            <CompletedCoursesGrid courses={activeStamps.enrollments}/>

                        </CardContent>

                    </Card>
                )}
            </div>
            {canEdit ?
                <div className={"w-full"}>
                    <AlertDialog>
                        <Card className={"w-full max-w-[1080px] mx-auto"}>
                            <CardContent>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="w-full py-5 justify-center text-gray-600 hover:text-red-600 hover:bg-red-50"
                                    >
                                        <Trash2/> 회원 탈퇴
                                    </Button>
                                </AlertDialogTrigger>
                            </CardContent>
                        </Card>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>❌ 회원 삭제 (복구 불가)</AlertDialogTitle>
                                <AlertDialogDescription>
                                    "{userPofile.username}" 을 입력해 주세요.
                                </AlertDialogDescription>
                                <Input value={deleteUser} onChange={(e) => setDeleteUser(e.target.value)}/>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>
                                    취소
                                </AlertDialogCancel>
                                {deleteUser === userPofile.username ?
                                    <AlertDialogAction
                                        className=" hover:text-red-600 hover:bg-red-50" asChild>
                                        <Button onClick={deleteUserAllData}>
                                            탈퇴
                                        </Button>
                                    </AlertDialogAction>
                                    : null}
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
                : null
            }
        </div>
    )
}




















