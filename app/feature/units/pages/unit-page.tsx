import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { OutletContextType } from "~/feature/textbooks/pages/textbook-page";
import { getUnitAndConceptsByUnitId } from "../queries";
import { Form, redirect, useFetcher, useLocation, useOutletContext } from "react-router";
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

export const loader = async ({ params }: Route.LoaderArgs) => {
    const paramsSchema = z.object({
        "unit-id": z.coerce.number().min(1),
        "textbook-id": z.coerce.number().min(1)
    });

    const { success, data } = paramsSchema.safeParse(params);
    if (!success) throw redirect("/404");

    const unitData = await getUnitAndConceptsByUnitId(data["unit-id"]);
    if (!(unitData
        && data["textbook-id"] === unitData.middle.major.textbook.textbook_id))
        throw redirect("/404");

    console.log("unitData", unitData)
    return { unitData }
}


export default function UnitPage({ loaderData }: Route.ComponentProps) {

    const { isAdmin, isEnrolled, setOpenEnrollWindow, setAfterEnrollNaviUrl } = useOutletContext<OutletContextType>();
    const { unitData } = loaderData;
    const isFree = unitData.is_free;
    const isPublished = unitData.is_published;

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

    const [content, setContent] = useState<JSONContent>(
        unitData.readme_json ?? {
            type: 'doc',
            content: []
        }
    );

    const firstLodingUnitReadme = unitData.readme_json;
    const [isContentNeedSave, setContentNeedSave] = useState(false);

    useEffect(() => {
        if (unitData.readme_json) {
            setContent(unitData.readme_json);
        }
    }, [unitData.readme_json])

    useEffect(() => {
        if (JSON.stringify(content) !== JSON.stringify(firstLodingUnitReadme)) {
            setContentNeedSave(true);
        } else {
            setContentNeedSave(false);
        }
    }, [content])

    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const fetcher = useFetcher()

    return (
        <ScrollArea className="p-0 w-full h-[calc(100vh-64px)] overflow-hidden">
            {/* 영상 섹션 */}
            <div className={"max-w-[1280px] mx-auto"}>
                <div className="aspect-video">
                    <iframe
                        src={`https://www.youtube.com/embed/${unitData.youtube_video_id}`}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>

                {/* 콘텐츠 섹션 */}
                <Collapsible defaultOpen>
                    <CollapsibleTrigger
                        className={`cursor-pointer flex items-center justify-between w-full mt-3 p-4 sm:pl-6 hover:opacity-80 transition-opacity bg-orange-100 text-orange-700 rounded-b-lg`}>
                        <div className="flex items-center space-x-2 ">
                            <Breadcrumb>
                                <BreadcrumbList className={"text-md text-orange-700"}>
                                    <BreadcrumbItem>
                                        {unitData.middle.major.title}
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator/>
                                    <BreadcrumbItem>
                                        {unitData.middle.title}
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator/>
                                    <BreadcrumbItem className={"text-lg font-semibold "}>
                                        🔥 {unitData.title}
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                        <ChevronDown
                            className="h-5 w-5 transition-transform duration-200 data-[state=closed]:rotate-180"/>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4">
                        <Tiptap content={content ?? ""} editable={isAdmin} onChange={setContent}/>
                        {isContentNeedSave ?
                            <fetcher.Form method="post" className="space-y-4 flex justify-center "
                                          action={'/api/units/update-readme'}>
                                <input type="hidden" name="content" value={JSON.stringify(content)}/>
                                <input type="hidden" name="unit_id" value={unitData.unit_id}/>
                                {isAdmin &&
                                    <Button
                                        type="submit"
                                        disabled={fetcher.state !== "idle"}
                                        className="fixed bottom-0 w-full max-w-xl px-4 py-2 mb-10 mt-4">
                                        {fetcher.state !== "idle" ? (
                                            <div className="flex items-center justify-center">
                                                <Loader2 className="size-5 mr-3 animate-spin"/>
                                                저장 중...
                                            </div>
                                        ) : (
                                            "저장"
                                        )}
                                    </Button>
                                }
                            </fetcher.Form> : null
                        }
                    </CollapsibleContent>
                </Collapsible>


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

