import type { Route } from "./+types/textbook-layout";
import { useEffect, useMemo, useState } from "react";
import { Link, Outlet, redirect, useNavigate } from "react-router";
import { Book, ChevronDown, ChevronRight, Home, Menu } from "lucide-react";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

import colors from "~/feature/textbooks/major-color";
import { z } from "zod";

import { getTextbookInfobyTextBookId } from "~/feature/textbooks/queries";

export const loader = async ({ params }: Route.LoaderArgs) => {
    const themeSlug = params["theme-slug"];
    const subjectSlug = params["subject-slug"];
    const textbookId = params["textbook-id"];

    const paramsSchema = z.object({ textbookId: z.coerce.number().min(1) });
    const { success, data } = paramsSchema.safeParse({ textbookId });
    if (!success) throw redirect("/404");

    const textbookInfo = await getTextbookInfobyTextBookId(data.textbookId);

    if (!(textbookInfo
        && textbookInfo.subject.slug === subjectSlug
        && textbookInfo.subject.theme.slug === themeSlug)
    ) throw redirect("/404");

    return { themeSlug, subjectSlug, textbookId, textbookInfo };
}

export default function TextbookLayout({ loaderData, params }: Route.ComponentProps) {

    const currentUnitId = params["unit-id"] ? parseInt(params["unit-id"]) : null;
    const { themeSlug, subjectSlug, textbookId, textbookInfo } = loaderData;
    const [openMajors, setOpenMajors] = useState<Set<number>>(new Set());
    const [openMiddles, setOpenMiddles] = useState<Set<string>>(new Set());
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();


    const toggleMajor = (majorIndex: number) => {
        setOpenMajors(prev => {
            const newSet = new Set(prev);
            if (newSet.has(majorIndex)) newSet.delete(majorIndex)
            else newSet.add(majorIndex);
            return newSet;
        });
    };

    const toggleMiddle = (majorIndex: number, middleIndex: number) => {
        const key = `${majorIndex}-${middleIndex}`;
        setOpenMiddles(prev => {
            const newSet = new Set(prev);
            if (newSet.has(key)) newSet.delete(key);
            else newSet.add(key);
            return newSet;
        });
    };

    // unit 의 대단원 중단원 정보 저장.
    const unitSectionMap = useMemo(() => {
        const map = new Map<number, { majorIndex: number; middleIndex: number }>();
        textbookInfo.majors.forEach((major) => {
            major.middles.forEach((middle) => {
                middle.units.forEach(unit => {
                    map.set(unit.unit_id, { majorIndex: major.major_id, middleIndex: middle.middle_id });
                });
            });
        });
        return map;
    }, []); // 빈 배열: 한 번만 생성

    // 현재 단원이 포함된 섹션들을 자동으로 열기
    useEffect(() => {
        if (!currentUnitId) return;

        const sectionInfo = unitSectionMap.get(currentUnitId);
        if (!sectionInfo) return;

        const { majorIndex, middleIndex } = sectionInfo;
        const middleKey = `${majorIndex}-${middleIndex}`;

        setOpenMajors(prev => {
            if (prev.has(majorIndex)) {
                const newSet = new Set(prev);
                newSet.delete(majorIndex);
                return newSet;
            }
            return prev;
        });

        setOpenMiddles(prev => {
            if (prev.has(middleKey)) {
                const newSet = new Set(prev);
                newSet.delete(middleKey);
                return newSet;
            }
            return prev;
        });
    }, [currentUnitId]);


    const handleUnitClick = (unitId: number) => {
        // 모바일에서 단원 클릭 시 메뉴 닫기
        if (window.innerWidth < 768) setIsMobileMenuOpen(false);
        navigate(`${unitId}`);
    };

    // 사이드바 콘텐츠 컴포넌트
    const SidebarContent = () => (
        <>
            <div className="p-4 border-b space-y-4">

                {/* 네비게이션 버튼들 - 카드 스타일 */}
                <div className="grid grid-cols-2 gap-2">

                    <Link to="/themes">
                        <div
                            className={`${colors[0].badge} rounded-lg p-3 text-center hover:scale-105 transition-transform cursor-pointer`}>
                            <Home className="h-4 w-4 mx-auto"/>
                        </div>
                    </Link>

                    <Tooltip>
                        <TooltipTrigger className={"w-full"}>
                            <Link to={`/${themeSlug}`}>
                                <div
                                    className={`${colors[3].badge} rounded-lg p-3 text-center hover:scale-105 transition-transform cursor-pointer`}>
                                    <Book className="h-4 w-4 mx-auto "/>
                                </div>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side={"right"}>
                            <p>다른 과목</p>
                        </TooltipContent>
                    </Tooltip>

                </div>

                {/* 제목 */}
                <Tooltip>
                    <TooltipTrigger className={"w-full"}>
                        <Link to={`/${themeSlug}/${subjectSlug}/${textbookId}`} className={"w-full"}>
                            <h2 className="font-semibold text-lg text-center w-full truncate mt-3">
                                {textbookInfo?.title}
                            </h2>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side={"right"}>
                        <p>개요</p>
                    </TooltipContent>
                </Tooltip>


            </div>


            <ScrollArea className="h-[calc(100vh-80px)]">
                <div className="p-2">
                    {textbookInfo?.majors.map((major, majorIndex) => {
                        const colorSet = colors[majorIndex + 1 % colors.length];
                        const majorActive = currentUnitId && unitSectionMap.get(currentUnitId)?.majorIndex === major.major_id;
                        return (
                            <Collapsible
                                key={major.major_id}
                                open={!openMajors.has(major.major_id)}
                                onOpenChange={() => toggleMajor(major.major_id)}>
                                <CollapsibleTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className={`w-full justify-start p-2 h-auto text-left`}>
                                        {!openMajors.has(major.major_id) ? (
                                            <ChevronDown className={`h-4 w-4 mr-2 flex-shrink-0 ${colorSet.badge}`}/>
                                        ) : (
                                            <ChevronRight className={`h-4 w-4 mr-2 flex-shrink-0 ${colorSet.badge}`}/>
                                        )}
                                        <div
                                            className={`font-medium truncate ${colorSet.badge} py-1 px-3 rounded-4xl`}>{major.title}</div>
                                        {majorActive ? "🔥 " : null}
                                    </Button>
                                </CollapsibleTrigger>

                                <CollapsibleContent className="ml-6">
                                    {major.middles.map((middle) => {
                                            const middleActive = currentUnitId && unitSectionMap.get(currentUnitId)?.middleIndex === middle.middle_id;
                                            return (
                                                <Collapsible
                                                    key={`${middle.middle_id}`}
                                                    open={!openMiddles.has(`${major.major_id}-${middle.middle_id}`)}
                                                    onOpenChange={() => toggleMiddle(major.major_id, middle.middle_id)}>
                                                    <CollapsibleTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            className="w-full justify-start p-2 h-auto text-left text-sm">
                                                            {!openMiddles.has(`${major.major_id}-${middle.middle_id}`) ? (
                                                                <ChevronDown className="h-3 w-3 mr-2 flex-shrink-0"/>
                                                            ) : (
                                                                <ChevronRight className="h-3 w-3 mr-2 flex-shrink-0"/>
                                                            )}
                                                            <div
                                                                className="text-muted-foreground truncate">{middle.title}</div>
                                                            {middleActive ? "🔥 " : null}
                                                        </Button>
                                                    </CollapsibleTrigger>

                                                    <CollapsibleContent className="ml-4">
                                                        {middle.units.map((unit) => {
                                                                const isActive = currentUnitId === unit.unit_id;
                                                                return (
                                                                    <div className="flex items-center relative"
                                                                         key={unit.unit_id}>
                                                                        <Checkbox
                                                                            // checked={isChecked}
                                                                            className={"absolute left-4"}
                                                                            // onClick={() => handleUnitClick(unit.unit_id)}
                                                                        />
                                                                        <Button
                                                                            variant="ghost"
                                                                            className={`w-full justify-start p-2 h-auto text-left text-sm ${
                                                                                isActive ? 'bg-accent text-accent-foreground' : ''
                                                                            }`}
                                                                            onClick={() => handleUnitClick(unit.unit_id)}>
                                                                            <div
                                                                                className="truncate w-full pl-10">{unit.title}</div>
                                                                            <div
                                                                                className={`text-xs text-muted-foreground flex-shrink-0 pr-2 ${isActive ? "" : "opacity-35"}`}>
                                                                                {isActive ? "🔥 " : null}
                                                                                {Math.ceil(unit.estimated_seconds / 60)}분
                                                                            </div>
                                                                        </Button>
                                                                    </div>

                                                                )
                                                            }
                                                        )}
                                                    </CollapsibleContent>
                                                </Collapsible>
                                            )
                                        }
                                    )}
                                </CollapsibleContent>
                            </Collapsible>
                        );
                    })}
                </div>
            </ScrollArea>
        </>
    );

    return (
        <div className="flex min-h-screen">
            {/* 데스크톱 - Resizable 레이아웃 */}
            <div className="hidden md:flex flex-1">
                <ResizablePanelGroup direction="horizontal" className="min-h-screen">
                    <ResizablePanel defaultSize={20} minSize={15} maxSize={35}>
                        <div className="h-full border-r bg-background">
                            <SidebarContent/>
                        </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle/>
                    <ResizablePanel defaultSize={80}>
                        <Outlet
                            context={{ textbookInfo, handleUnitClick }}/>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>

            {/* 모바일 - Sheet 레이아웃 */}
            <div className="md:hidden flex flex-col w-full relative">
                {/* 플로팅 메뉴 버튼 */}
                <div className="fixed top-4 right-4 z-50">
                    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="flex-shrink-0 shadow-lg bg-background border-2 hover:bg-accent"
                            >
                                <Menu className="h-4 w-4"/>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-100 p-0">
                            <SidebarContent/>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* 메인 콘텐츠가 전체 화면 사용 */}
                <div className="flex-1 w-full">
                    <Outlet
                        context={{ textbookInfo, handleUnitClick }}/>
                </div>
            </div>
        </div>
    );
}