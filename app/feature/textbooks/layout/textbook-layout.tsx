import { Outlet, redirect } from "react-router";
import type { Route } from "./+types/textbook-layout";
import { getTextbookInfobyTextBookId } from "~/feature/textbooks/queries";
import { z } from "zod";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Book, BookOpen, FileText } from "lucide-react";

export const loader = async ({ params }: Route.LoaderArgs) => {
    const themeSlug = params["theme-slug"];
    const subjectSlug = params["subject-slug"];
    const textbookId = params["textbook-id"];

    const paramsSchema = z.object({ textbookId: z.coerce.number().min(1) });
    const { success, data } = paramsSchema.safeParse({ textbookId });
    if (!success) throw redirect("/404");

    const textbookInfo = await getTextbookInfobyTextBookId(data.textbookId);

    console.dir(textbookInfo, { depth: null });
    // 정확한 경로인지 체크
    if (!( textbookInfo
        && textbookInfo.subject.slug === subjectSlug
        && textbookInfo.subject.theme.slug === themeSlug)
    ) throw redirect("/404");

    return { themeSlug, subjectSlug, textbookInfo };
}

export default function TextbookLayout({ loaderData }: Route.ComponentProps) {
    const { themeSlug, subjectSlug, textbookInfo } = loaderData;
    const [openMajors, setOpenMajors] = useState<Set<number>>(new Set([0])); // 첫 번째 대단원은 기본 열림
    const [openMiddles, setOpenMiddles] = useState<Set<string>>(new Set());

    const toggleMajor = (majorIndex: number) => {
        setOpenMajors(prev => {
            const newSet = new Set(prev);
            if (newSet.has(majorIndex)) {
                newSet.delete(majorIndex);
            } else {
                newSet.add(majorIndex);
            }
            return newSet;
        });
    };

    const toggleMiddle = (majorIndex: number, middleIndex: number) => {
        const key = `${majorIndex}-${middleIndex}`;
        setOpenMiddles(prev => {
            const newSet = new Set(prev);
            if (newSet.has(key)) {
                newSet.delete(key);
            } else {
                newSet.add(key);
            }
            return newSet;
        });
    };

    return (
        <div className="flex min-h-screen">
            {/* 좌측 사이드바 */}
            <div className="w-80 border-r bg-background">
                <div className="p-4 border-b">
                    <h2 className="font-semibold text-lg flex items-center gap-2">
                        <Book className="h-5 w-5" />
                        {textbookInfo?.title}
                    </h2>
                </div>

                <ScrollArea className="h-[calc(100vh-80px)]">
                    <div className="p-2">
                        {textbookInfo?.majors
                            ?.filter(major => major.is_published)
                            .sort((a, b) => a.sort_order - b.sort_order)
                            .map((major, majorIndex) => (
                                <Collapsible
                                    key={majorIndex}
                                    open={openMajors.has(majorIndex)}
                                    onOpenChange={() => toggleMajor(majorIndex)}
                                >
                                    <CollapsibleTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start p-2 h-auto text-left"
                                        >
                                            {openMajors.has(majorIndex) ? (
                                                <ChevronDown className="h-4 w-4 mr-2 flex-shrink-0" />
                                            ) : (
                                                <ChevronRight className="h-4 w-4 mr-2 flex-shrink-0" />
                                            )}
                                            <BookOpen className="h-4 w-4 mr-2 flex-shrink-0" />
                                            <span className="font-medium">{major.title}</span>
                                        </Button>
                                    </CollapsibleTrigger>

                                    <CollapsibleContent className="ml-6">
                                        {major.middles
                                            ?.filter(middle => middle.is_published)
                                            .sort((a, b) => a.sort_order - b.sort_order)
                                            .map((middle, middleIndex) => (
                                                <Collapsible
                                                    key={`${majorIndex}-${middleIndex}`}
                                                    open={openMiddles.has(`${majorIndex}-${middleIndex}`)}
                                                    onOpenChange={() => toggleMiddle(majorIndex, middleIndex)}
                                                >
                                                    <CollapsibleTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            className="w-full justify-start p-2 h-auto text-left text-sm"
                                                        >
                                                            {openMiddles.has(`${majorIndex}-${middleIndex}`) ? (
                                                                <ChevronDown className="h-3 w-3 mr-2 flex-shrink-0" />
                                                            ) : (
                                                                <ChevronRight className="h-3 w-3 mr-2 flex-shrink-0" />
                                                            )}
                                                            <span className="text-muted-foreground">{middle.title}</span>
                                                        </Button>
                                                    </CollapsibleTrigger>

                                                    <CollapsibleContent className="ml-4">
                                                        {middle.units
                                                            ?.filter(unit => unit.is_published)
                                                            .sort((a, b) => a.sort_order - b.sort_order)
                                                            .map((unit) => (
                                                                <Button
                                                                    key={unit.unit_id}
                                                                    variant="ghost"
                                                                    className="w-full justify-start p-2 h-auto text-left text-sm"
                                                                >
                                                                    <FileText className="h-3 w-3 mr-2 flex-shrink-0" />
                                                                    <div className="flex flex-col items-start">
                                                                        <span>{unit.title}</span>
                                                                        {unit.estimated_seconds > 0 && (
                                                                            <span className="text-xs text-muted-foreground">
                                                                                약 {Math.ceil(unit.estimated_seconds / 60)}분
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </Button>
                                                            ))}
                                                    </CollapsibleContent>
                                                </Collapsible>
                                            ))}
                                    </CollapsibleContent>
                                </Collapsible>
                            ))}
                    </div>
                </ScrollArea>
            </div>

            {/* 메인 콘텐츠 영역 */}
            <div className="flex-1 flex flex-col">
                <div className="p-4 border-b">
                    {`${themeSlug} / ${subjectSlug} / ${textbookInfo?.title}`}
                </div>
                <div className="flex-1">
                    <Outlet/>
                </div>
            </div>
        </div>
    );
}