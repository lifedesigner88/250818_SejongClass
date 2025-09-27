import GitHubGrass, { type GitGressDay } from "~/feature/users/pages/git-hub-grass";
import type { Route } from "./+types/profile-page";
import { getActiveStamps } from "~/feature/users/quries";
import { DateTime } from "luxon";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProfileEdit from "~/feature/users/pages/profile-edit";

export const loader = async ({ params }: Route.LoaderArgs) => {
    const { username } = params
    const activeStamps = await getActiveStamps(username)
    return { activeStamps }
}


export default function ProfilePage({ loaderData }: Route.ComponentProps) {
    const { activeStamps } = loaderData
    if (!activeStamps) {
        return <h1 className={"p-5"}>존재하지 않는 유저 입니다. </h1>
    }

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
        { updated_at: created_at } // 가입일 하나 추가.
    ];

    console.log(allStampItems)
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
        </div>
    )
}




















