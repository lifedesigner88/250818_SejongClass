import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { OutletContextType } from "~/feature/textbooks/pages/textbook-page";
import { getUnitAndConceptsByUnitId } from "../queries";
import { redirect, useFetcher, useLocation, useOutletContext } from "react-router";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useMemo, useState } from "react";
import colors from "~/feature/textbooks/major-color";
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
import { DateTime } from "luxon";
import CommentsSection from "~/feature/comments/comment-item";

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

    const { isAdmin, isEnrolled, setOpenEnrollWindow, setAfterEnrollNaviUrl } = useOutletContext<OutletContextType>();
    const EMPTY_NOTE: JSONContent = { "type": "doc", "content": [{ "type": "paragraph" }] } as const
    const { unitData, userId } = loaderData;
    const isFree = unitData.is_free;
    const isPublished = unitData.is_published;

    const unitComments = unitData.comments
    console.dir(unitComments, { depth: null })
    console.log(typeof unitComments)

    const location = useLocation();
    const shouldHandleEnrollment = useMemo(() => {
        if (isFree || isAdmin) return false;
        if (!isPublished) return true;
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


    // Note
    const noteFetcher = useFetcher()
    const isNoteExists = unitData.notes.length > 0;

    const [noteData, setNoteData] = useState<JSONContent>(EMPTY_NOTE)
    const [isNoteNeedSave, setIsNoteNeedSave] = useState(false)
    const [noteOpen, setNoteOpen] = useState(isNoteExists);
    const firstLodingNoteData = isNoteExists ? unitData.notes[0].readme_json : EMPTY_NOTE

    useEffect(() => {
        if (JSON.stringify(noteData) !== JSON.stringify(firstLodingNoteData)) {
            setIsNoteNeedSave(true);
        } else {
            setIsNoteNeedSave(false);
        }
    }, [noteData]);

    // 노트가 없는경우 생성
    const createFirstNote = () => {
        if (unitData.notes.length == 0)
            void fetcher.submit(
                { unit_id: unitData.unit_id },
                { action: "/api/notes/create-note", method: "POST" }
            )
        else if (JSON.stringify(noteData) === JSON.stringify(EMPTY_NOTE) && !isNoteNeedSave)
            fetch("/api/notes/delete-note", {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    unit_id: unitData.unit_id
                })
            }).catch(console.error);
        setNoteOpen(pre => !pre);
    }

    // unit 페이지 이동시.
    useEffect(() => {
        if (unitData.readme_json) {
            setContent(unitData.readme_json);
        }
        if (isNoteExists) {
            setNoteData(unitData.notes[0].readme_json);
        }
        setIsNoteNeedSave(false);
        setContentNeedSave(false);
        setContentOpen(true);
        setNoteOpen(isNoteExists);
    }, [unitData])


    // 댓글 관련

    const commentFetcher = useFetcher()
    const likeFetcher = useFetcher()

    const handleNewComment = (content: string) => {
        if (!content) return;
        commentFetcher.submit({
            content,
            unit_id: unitData.unit_id,
            type: 'comment',
        }, {
            method: 'POST',
            action: '/api/comments/create-comment',
        })
    }

    const handleReply = (parent_comment_id: number, content: string) => {
        if (!content || !parent_comment_id) return;
        commentFetcher.submit({
            content,
            unit_id: unitData.unit_id,
            type: 'reply',
            parent_comment_id,
        }, {
            method: 'POST',
            action: '/api/comments/create-comment',
        })
    }

    const handleLike = (comment_id: number) => {
        likeFetcher.submit({
            comment_id,
        }, {
            method: 'POST',
            action: '/api/comments/like-comment',
        })
    }

    const deleteFetcher = useFetcher()
    const deleteComment = (comment_id: number) => {
        deleteFetcher.submit({
            comment_id,
        }, {
            method: 'POST',
            action: '/api/comments/delete-comment',
        })
        console.log("Delete")
    }


    // 개념보기 시트
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    return (
        <ScrollArea className="p-0 w-full h-[calc(100vh-64px)] overflow-hidden">
            <div className={"max-w-[1280px] mx-auto mb-200"}>

                {/* 영상 섹션 */}
                <div className="aspect-video">
                    <iframe
                        src={`https://www.youtube.com/embed/${unitData.youtube_video_id}`}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
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
                                            <BreadcrumbSeparator/>
                                            <BreadcrumbItem>
                                                {unitData.middle.title}
                                            </BreadcrumbItem>
                                        </>
                                        : null
                                    }
                                    <BreadcrumbSeparator/>
                                    <BreadcrumbItem className={"text-lg font-semibold "}>
                                        🔥 {unitData.title}
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                        <ChevronDown
                            className={`h-5 w-5 transition-transform duration-200 ${!contentOpen ? "rotate-90" : ""}`}/>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4">
                        <Tiptap content={content} editable={isAdmin} onChange={setContent}/>
                        {isContentNeedSave ?
                            <fetcher.Form method="POST" className="space-y-4 flex justify-center "
                                          action={'/api/units/update-readme'}>
                                <input type="hidden" name="content" value={JSON.stringify(content)}/>
                                <input type="hidden" name="unit_id" value={unitData.unit_id}/>
                                {isAdmin &&
                                    <Button
                                        type="submit"
                                        disabled={fetcher.state !== "idle"}
                                        className="fixed bottom-0 z-50 w-full max-w-xl px-4 py-2 mb-10 mt-4">
                                        {fetcher.state !== "idle" ? (
                                            <div className="flex items-center justify-center">
                                                <Loader2 className="size-5 mr-3 animate-spin"/>
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

                {/* Memo */}
                <Collapsible open={noteOpen} onOpenChange={createFirstNote} className={"relative"}>
                    <CollapsibleTrigger
                        className={`cursor-pointer flex items-center justify-between w-full mt-3 p-4 sm:pl-6 hover:opacity-80 transition-opacity bg-indigo-100  text-indigo-700 rounded-t-lg`}>
                        <div className="flex items-center space-x-2 ">
                            <Breadcrumb>
                                <BreadcrumbList className={"text-md text-indigo-700"}>

                                    {isNoteExists && noteOpen && isNoteNeedSave
                                        ? <BreadcrumbItem>
                                            {DateTime.fromJSDate(unitData.notes[0].updated_at!).setLocale('ko').toRelative()}
                                        </BreadcrumbItem>
                                        : null}

                                    <BreadcrumbSeparator className={noteOpen ? "rotate-90" : ""}/>
                                    <BreadcrumbItem className={"text-lg font-semibold "}>
                                        {noteOpen ? "✏️ 메모" : "✅ 메모"}
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                        <ChevronDown
                            className={`h-5 w-5 transition-transform duration-200 ${!noteOpen ? "rotate-90" : ""}`}/>
                    </CollapsibleTrigger>

                    {isNoteExists ?
                        <CollapsibleContent className="mt-4 mb-20">
                            <Tiptap content={noteData} editable={true} onChange={setNoteData}/>
                            {isNoteNeedSave ?
                                <noteFetcher.Form method="post" className="flex justify-center  "
                                                  action={'/api/notes/update-note'}>
                                    <input type="hidden" name="content" value={JSON.stringify(noteData)}/>
                                    <input type="hidden" name="unit_id" value={unitData.unit_id}/>
                                    <Button
                                        type="submit"
                                        disabled={noteFetcher.state !== "idle"}
                                        className="fixed bottom-0 z-50 w-full max-w-xl px-4 py-2 mb-10 mt-4 bg-indigo-100 font-bold text-indigo-700 hover:text-white">
                                        {noteFetcher.state !== "idle" ? (
                                            <div className="flex items-center justify-center">
                                                <Loader2 className="size-5 mr-3 animate-spin"/>
                                                저장 중...
                                            </div>
                                        ) : (
                                            "노트저장"
                                        )}
                                    </Button>
                                </noteFetcher.Form> : null
                            }
                        </CollapsibleContent> : null
                    }
                </Collapsible>

                {/* 댓글 */}
                <div className="container mx-auto py-8">
                    <CommentsSection
                        comments={unitComments}
                        onNewComment={handleNewComment}
                        onReply={handleReply}
                        onLike={handleLike}
                        deleteComment={deleteComment}
                        loginUserId={userId!}
                    />
                </div>

                {/* 개념 보기 Sheet */}
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                        <button
                            className="fixed bottom-4 right-4 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-colors duration-200 flex items-center justify-center"
                            aria-label="개념 보기">
                            <Brain className="h-6 w-6"/>
                        </button>
                    </SheetTrigger>
                    <SheetContent side="right">
                        <SheetTitle className="p-10 flex items-center gap-3 text-xl">
                            <div className="p-2 bg-purple-500/10 rounded-xl">
                                <Brain className="h-8 w-8 text-purple-600 dark:text-purple-400"/>
                            </div>
                            학습 개념
                        </SheetTitle>
                        <SheetDescription>
                            {unitData.dealings && unitData.dealings.length > 0 ? (
                                unitData.dealings.map((dealing, index) => (
                                    <div
                                        key={dealing.concept.concept_id}
                                        className="m-5 group p-4 rounded-2xl backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                                        <div className={"flex items-center space-x-4"}>
                                            <div
                                                className={`flex-shrink-0 w-10 h-10 ${colors[index % colors.length].bg} text-white rounded-xl flex items-center justify-center text-sm font-bold shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                                {index + 1}
                                            </div>
                                            <h3 className="font-bold text-xl text-gray-900 ">
                                                {dealing.concept.name}
                                            </h3>
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            {dealing.concept.definition && (
                                                <div className="mt-4 p-1 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                                    {dealing.concept.definition}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                                    <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-2xl inline-block mb-6">
                                        <Brain className="h-16 w-16 mx-auto opacity-50"/>
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">개념이 없습니다</h3>
                                    <p>이 단원에 등록된 개념이 아직 없습니다.</p>
                                </div>
                            )}
                        </SheetDescription>
                    </SheetContent>
                </Sheet>
            </div>
        </ScrollArea>
    );
}

