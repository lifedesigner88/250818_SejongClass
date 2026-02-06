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
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
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
import { StarRating } from "./star-rating";
import { EditCurriculumDialog } from "./edit-curriculum-dialog";

type UnitDataType = Awaited<ReturnType<typeof getUnitAndConceptsByUnitId>>;
export type UnitCommentsType = NonNullable<UnitDataType>['comments'];

export type CurriculumListType = {
    code: string;
    achievement_text: string;
    unit_id: number;
    curriculum_id: number;
    isChecked: boolean;
    sort_order: number;
}[];

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
        textbookInfo,
        setOpenEnrollWindow,
        setAfterEnrollNaviUrl,
        setNotPubAlert,
        progressRate,
        openedSet,
        setOpenedSet,
    } = useOutletContext<OutletContextType>();

    if (!textbookInfo) return (<div> TextbookInfo 가 없습니다. </div>)

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

    // 열어본 과목들
    const openedSetFetcher = useFetcher();

    useEffect(() => {
        if (!isEnrolled) return;
        if (openedSet.has(unitData.unit_id)) return;

        const nextSet = new Set(openedSet);
        nextSet.add(unitData.unit_id);

        setOpenedSet(nextSet);

        void openedSetFetcher.submit(
            {
                textbook_id: String(unitData.middle.major.textbook.textbook_id),
                opened_chapter_ids: JSON.stringify(Array.from(nextSet)),
            },
            { method: "POST", action: "/api/enrollments/update-opened" }
        );
    }, [isEnrolled, unitData.unit_id, unitData.middle.major.textbook.textbook_id]);

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


    // 리뷰 시트
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const star_value = unitData.middle.major.textbook.enrollments[0]?.rating ?? 0
    const review_text = unitData.middle.major.textbook.enrollments[0]?.review ?? ""
    const [stars, setStarts] = useState<number>(star_value)
    const [review, setReview] = useState<string>(review_text)

    const reviewFetcher = useFetcher()
    const saveReview = () => {
        setIsSheetOpen(false)
        void reviewFetcher.submit({
            textbook_id: unitData.middle.major.textbook.textbook_id,
            rating: stars,
            review: review
        },
            {
                method: "POST",
                action: "/api/enrollments/update-review"
            }
        )
    }

    const reviewSheetOpen = () => {
        if (!isEnrolled) {
            setAfterEnrollNaviUrl(location.pathname);
            setOpenEnrollWindow(true);
            return
        }
        setStarts(star_value)
        setReview(review_text)
        setIsSheetOpen(true)
    }




    // 영상 정보 수정
    const [openEditVideo, setOpenEditVideo] = useState<boolean>(false)

    const [isClient, setIsClient] = useState(false);
    useEffect(() => { setIsClient(true); }, []);

    const completeFetcher = useFetcher()
    const completeUnit = () => {
        if (unitData.progress.length === 0) {
            void completeFetcher.submit({
                unit_id: unitData.unit_id
            }, {
                method: "POST",
                action: "/api/units/complete-unit"
            })

            if (stars == 0 && ((progressRate >= 40 && progressRate <= 51) || progressRate == 100)) {
                setIsSheetOpen(true)
            }
        }
    }


    // 영상 커리큘럼 수정
    const [oepnEditCurriculum, setOepnEditCurriculum] = useState<boolean>(false)
    const [curriculumList, setCurriculumList] = useState<CurriculumListType>([])

    const getCurriculumList = () => {
        const cur_list: CurriculumListType = []
        textbookInfo?.majors.forEach(major => {
            major.middles.forEach(middle => {
                middle.units.forEach(unit => {
                    if (unit.unit_id === unitData.unit_id && unit.curriculums && unit.curriculums.length > 0) {
                        unit.curriculums.forEach(curriculum => {
                            cur_list.push({
                                code: curriculum.code,
                                achievement_text: curriculum.achievement_text,
                                unit_id: unit.unit_id,
                                curriculum_id: curriculum.curriculum_id,
                                isChecked: curriculum.checklists.length > 0,
                                sort_order: curriculum.sort_order
                            });
                        });
                    }
                });
            });
        });
        setCurriculumList(cur_list)
    }


    return (
        <ScrollArea className="p-0 w-full h-[calc(100vh-64px)] overflow-hidden">

            <div className={"max-w-[1280px] mx-auto mb-200 relative"}>
                {isAdmin ? <>
                    <Button className={"absolute right-0 top-30"} onClick={() => setOpenEditVideo(true)}> 수정 </Button>
                    <EditVideoDialog
                        key={unitData.unit_id}
                        unit_id={unitData.unit_id}
                        youtube_video_id={unitData.youtube_video_id}
                        estimated_seconds={unitData.estimated_seconds}
                        open={openEditVideo}
                        onOpenChange={setOpenEditVideo}
                    />
                </>
                    : null
                }
                {isAdmin ? <>
                    <Button className={"absolute left-0 top-30 bg-red-500"} onClick={() => {
                        getCurriculumList()
                        setOepnEditCurriculum(true)
                    }}> 성취 </Button>

                    <EditCurriculumDialog
                        unit_id={unitData.unit_id}
                        open={oepnEditCurriculum}
                        onOpenChange={setOepnEditCurriculum}
                        curriculumList={curriculumList}
                        getCurriculumList={getCurriculumList}
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
                    <CollapsibleContent className="mt-4 ">
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

                {/* 강의평가 시트 Sheet */}
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <button
                        onClick={reviewSheetOpen}
                        className="fixed bottom-4 right-4 w-14 h-14 bg-blue-600 hover:bg-blue-700
                        text-white rounded-full shadow-lg transition-colors duration-200 flex items-center justify-center"
                        aria-label="개념 보기">
                        <Brain className="h-6 w-6" />
                    </button>
                    <SheetContent side="right"
                        className="max-h-screen overflow-y-auto"
                        onInteractOutside={(e) => e.preventDefault()}>
                        <SheetHeader>
                            <SheetTitle> 강의평가 </SheetTitle>
                            <SheetDescription >{`${unitData.middle.major.textbook.title}`} 강의 전반의 후기를 적어주세요. 다른 예비수강생들에게 공유 됩니다. </SheetDescription>
                        </SheetHeader>
                        <a
                            href={`https://doc.sejongclass.kr/${location.pathname}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button
                                variant={"secondary"}
                                className="w-full cursor-pointer bg-red-100 mb-3">
                                {`${unitData.title}`}
                            </Button>
                        </a>
                        <StarRating
                            value={stars}
                            onChange={setStarts}
                            review={review}
                            setReview={setReview}
                        />
                        {unitData.middle.major.textbook.ppt_url &&
                            <a
                                href={`${unitData.middle.major.textbook.ppt_url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button
                                    variant={"secondary"}
                                    className="w-full cursor-pointer mt-8 bg-blue-100 mb-3">
                                    강의자료
                                </Button>
                            </a>
                        }
                        <SheetFooter>
                            <Button onClick={saveReview} className="cursor-pointer">저장</Button>
                            <SheetClose asChild>
                                <Button variant="outline">취소</Button>
                            </SheetClose>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </div>
        </ScrollArea>
    );
}

