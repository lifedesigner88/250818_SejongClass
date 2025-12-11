import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { OutletContextType } from "~/feature/textbooks/pages/textbook-page";
import { getUnitAndConceptsByUnitId } from "../queries";
import { redirect, useFetcher, useLocation, useOutletContext } from "react-router";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Brain, Loader2 } from "lucide-react";
import type { JSONContent } from "@tiptap/react";
import type { Route } from "./+types/unit-page";
import Tiptap from "@/editor/Tiptap";
import { z } from "zod";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { getUserIdForServer } from "~/feature/auth/useAuthUtil";
import CommentsSection from "~/feature/comments/page/comment-section";
import { EditVideoDialog } from "./edit-video-dialog";
import YouTube from "react-youtube";

type UnitDataType = Awaited<ReturnType<typeof getUnitAndConceptsByUnitId>>;
export type UnitCommentsType = NonNullable<UnitDataType>['comments'];


export const loader = async ({ params, request }: Route.LoaderArgs) => {
    const paramsSchema = z.object({
        "unit-id": z.coerce.number().min(1),
        "textbook-id": z.coerce.number().min(1)
    });

    const { success, data } = paramsSchema.safeParse(params);
    if (!success) throw redirect("/404");

    const userId = await getUserIdForServer(request);
    const unitData = await getUnitAndConceptsByUnitId(data["unit-id"], userId!);
    if (!(unitData
        && data["textbook-id"] === unitData.middle.major.textbook.textbook_id))
        throw redirect("/404");
    return { unitData, userId }
}


export default function UnitPage({ loaderData }: Route.ComponentProps) {

    const {
        isAdmin,
        isEnrolled,
        setOpenEnrollWindow,
        setAfterEnrollNaviUrl,
        setNotPubAlert,
    } = useOutletContext<OutletContextType>();

    const EMPTY_NOTE: JSONContent = { "type": "doc", "content": [{ "type": "paragraph" }] } as const
    const { unitData, userId } = loaderData;
    const isFree = unitData.is_free;
    const isPublished = unitData.is_published;

    const unitComments = unitData.comments

    const location = useLocation();
    const shouldHandleEnrollment = useMemo(() => {
        if (isFree || isAdmin) return false;
        if (!isPublished) {
            setNotPubAlert(true)
            return true;
        }
        if (!isEnrolled) {
            setAfterEnrollNaviUrl(location.pathname);
            setOpenEnrollWindow(true);
            return true;
        }
        return false;
    }, []);

    if (shouldHandleEnrollment) {
        return <h1>강의 준비중입니다.</h1>;
    }

    const [content, setContent] = useState<JSONContent>(EMPTY_NOTE);
    const [isContentNeedSave, setContentNeedSave] = useState(false);
    const firstLodingUnitReadme = unitData.readme_json;
    const [contentOpen, setContentOpen] = useState(true);


    useEffect(() => {
        if (JSON.stringify(content) !== JSON.stringify(firstLodingUnitReadme)) {
            setContentNeedSave(true);
        } else {
            setContentNeedSave(false);
        }
    }, [content])

    const fetcher = useFetcher()


    // unit 페이지 이동시.
    useEffect(() => {
        if (unitData.readme_json) {
            setContent(unitData.readme_json);
        }
        setContentNeedSave(false);
        setContentOpen(true);
    }, [unitData])


    // 영상 정보 수정
    const [openEditVideo, setOpenEditVideo] = useState<boolean>(false)

    const [isClient, setIsClient] = useState(false);
    useEffect(() => { setIsClient(true); }, []);

    const completeFetcher = useFetcher()
    const completeUnit = () => {
        console.log("complete")
        if (unitData.progress.length === 0) {
            void completeFetcher.submit({
                unit_id: unitData.unit_id
            }, {
                method: "POST",
                action: "/api/units/complete-unit"
            })
        }
    }

    // 개념보기 시트
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    return (
        <ScrollArea className="p-0 w-full h-[calc(100vh-64px)] overflow-hidden">

            <div className={"max-w-[1280px] mx-auto mb-200 relative"}>
                {isAdmin ? <>
                    <Button className={"absolute right-0 top-30"} onClick={() => setOpenEditVideo(true)}> 수정 </Button>
                    <EditVideoDialog
                        unit_id={unitData.unit_id}
                        youtube_video_id={unitData.youtube_video_id}
                        estimated_seconds={unitData.estimated_seconds}
                        open={openEditVideo}
                        onOpenChange={setOpenEditVideo}
                    />
                </>
                    : null
                }
                {/* 영상 섹션 */}
                <div className="aspect-video">
                    <div className="w-full h-full">
                        {isClient
                            ? < YouTube
                                key={unitData.youtube_video_id}
                                className="w-full h-full"
                                videoId={unitData.youtube_video_id ?? ""}
                                opts={{
                                    width: "100%",
                                    height: "100%",
                                    playerVars: {
                                        modestbranding: 1,
                                        rel: 0,
                                    },
                                }}
                                onEnd={completeUnit}
                            />
                            : <div className="w-full h-full" />
                        }
                    </div>
                </div>

                {/* 콘텐츠 섹션 */}
                <Collapsible open={contentOpen} onOpenChange={setContentOpen}>
                    <CollapsibleTrigger
                        className={`cursor-pointer flex items-center justify-between w-full mt-3 p-4 sm:pl-6 hover:opacity-80 transition-opacity bg-orange-100 text-orange-700 rounded-b-lg`}>
                        <div className="flex items-center space-x-2 ">
                            <Breadcrumb>
                                <BreadcrumbList className={"text-md text-orange-700"}>
                                    {contentOpen ? <>
                                        <BreadcrumbItem>
                                            {unitData.middle.major.title}
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator />
                                        <BreadcrumbItem>
                                            {unitData.middle.title}
                                        </BreadcrumbItem>
                                    </>
                                        : null
                                    }
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem className={"text-lg font-semibold "}>
                                        🔥 {unitData.title}
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                        <ChevronDown
                            className={`h-5 w-5 transition-transform duration-200 ${!contentOpen ? "rotate-90" : ""}`} />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4">
                        <Tiptap content={content} editable={isAdmin} onChange={setContent} />
                        {isContentNeedSave ?
                            <fetcher.Form method="POST" className="space-y-4 flex justify-center "
                                action={'/api/units/update-readme'}>
                                <input type="hidden" name="content" value={JSON.stringify(content)} />
                                <input type="hidden" name="unit_id" value={unitData.unit_id} />
                                {isAdmin &&
                                    <Button
                                        type="submit"
                                        disabled={fetcher.state !== "idle"}
                                        className="fixed bottom-0 z-50 w-full max-w-xl px-4 py-2 mb-10 mt-4">
                                        {fetcher.state !== "idle" ? (
                                            <div className="flex items-center justify-center">
                                                <Loader2 className="size-5 mr-3 animate-spin" />
                                                저장 중...
                                            </div>
                                        ) : (
                                            "교재저장"
                                        )}
                                    </Button>
                                }
                            </fetcher.Form> : null
                        }
                    </CollapsibleContent>
                </Collapsible>


                {/* 댓글 */}
                <div className="container mx-auto py-8">
                    <CommentsSection
                        comments={unitComments}
                        loginUserId={userId!}
                        isAdmin={isAdmin}
                        unitId={unitData.unit_id}
                    />
                </div>

                {/* 개념 보기 Sheet */}
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                        <button
                            className="fixed bottom-4 right-4 w-14 h-14 bg-blue-600 hover:bg-blue-700
                            text-white rounded-full shadow-lg transition-colors duration-200 flex items-center justify-center"
                            aria-label="개념 보기">
                            <Brain className="h-6 w-6" />
                        </button>
                    </SheetTrigger>
                    <SheetContent side="right">
                        <SheetTitle className="p-10 flex items-center gap-3 text-xl">
                            <div className="p-2 bg-purple-500/10 rounded-xl">
                                <Brain className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                            </div>
                            개념 문서
                        </SheetTitle>
                        <SheetDescription>
                            .
                        </SheetDescription>
                    </SheetContent>
                </Sheet>
            </div>
        </ScrollArea>
    );
}

