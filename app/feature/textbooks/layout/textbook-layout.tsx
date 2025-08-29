import { Link, Outlet, redirect, useNavigate } from "react-router";
import type { Route } from "./+types/textbook-layout";
import { getTextbookInfobyTextBookId } from "~/feature/textbooks/queries";
import { z } from "zod";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronRight, Menu } from "lucide-react";
import colors from "~/feature/textbooks/major-color";

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

export default function TextbookLayout({ loaderData }: Route.ComponentProps) {
    const { themeSlug, subjectSlug, textbookId, textbookInfo } = loaderData;
    const [openMajors, setOpenMajors] = useState<Set<number>>(new Set()); // 첫 번째 대단원은 기본 열림
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

    const handleUnitClick = (unitId: number) => {
        // 모바일에서 단원 클릭 시 메뉴 닫기
        if (window.innerWidth < 768) setIsMobileMenuOpen(false);
        navigate(`${unitId}`);
        console.log(unitId)
    };

    // 사이드바 콘텐츠 컴포넌트
    const SidebarContent = () => (
        <>
            <Link to={`/${themeSlug}/${subjectSlug}/${textbookId}`} >
                <div className="p-4 border-b">
                    <h2 className="font-semibold text-lg flex items-center justify-center gap-2">
                        <span className="truncate">{textbookInfo?.title}</span>
                    </h2>
                </div>
            </Link>

            <ScrollArea className="h-[calc(100vh-80px)]">
                <div className="p-2">
                    {textbookInfo?.majors.map((major, majorIndex) => {
                        const colorSet = colors[majorIndex + 1 % colors.length];
                        
                        return (
                            <Collapsible
                                key={majorIndex}
                                open={!openMajors.has(majorIndex)}
                                onOpenChange={() => toggleMajor(majorIndex)}>
                                <CollapsibleTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className={`w-full justify-start p-2 h-auto text-left`}>
                                        {!openMajors.has(majorIndex) ? (
                                            <ChevronDown className={`h-4 w-4 mr-2 flex-shrink-0 ${colorSet.badge}`}/>
                                        ) : (
                                            <ChevronRight className={`h-4 w-4 mr-2 flex-shrink-0 ${colorSet.badge}`}/>
                                        )}
                                        <span className={`font-medium truncate ${colorSet.badge} py-1 px-3 rounded-4xl`}>{major.title}</span>
                                    </Button>
                                </CollapsibleTrigger>

                                <CollapsibleContent className="ml-6">
                                    {major.middles.map((middle, middleIndex) => (
                                        <Collapsible
                                            key={`${majorIndex}-${middleIndex}`}
                                            open={!openMiddles.has(`${majorIndex}-${middleIndex}`)}
                                            onOpenChange={() => toggleMiddle(majorIndex, middleIndex)}>
                                            <CollapsibleTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="w-full justify-start p-2 h-auto text-left text-sm">
                                                    {!openMiddles.has(`${majorIndex}-${middleIndex}`) ? (
                                                        <ChevronDown className="h-3 w-3 mr-2 flex-shrink-0"/>
                                                    ) : (
                                                        <ChevronRight className="h-3 w-3 mr-2 flex-shrink-0"/>
                                                    )}
                                                    <span
                                                        className="text-muted-foreground truncate">{middle.title}</span>
                                                </Button>
                                            </CollapsibleTrigger>

                                            <CollapsibleContent className="ml-4">
                                                {middle.units.map((unit) => (
                                                    <div className="flex items-center relative" key={unit.unit_id}>
                                                        <Checkbox
                                                            // checked={isChecked}
                                                            className={"absolute left-4"}
                                                            // onClick={() => handleUnitClick(unit.unit_id)}
                                                        />
                                                        <Button
                                                            variant="ghost"
                                                            className="w-full justify-start p-2 h-auto text-left text-sm"
                                                            onClick={() => handleUnitClick(unit.unit_id)}>
                                                            <div className="truncate w-full pl-10">{unit.title}</div>
                                                            <div
                                                                className="text-xs text-muted-foreground flex-shrink-0 pr-2 opacity-35">
                                                                {Math.ceil(unit.estimated_seconds / 60)}분
                                                            </div>
                                                        </Button>
                                                    </div>

                                                ))}
                                            </CollapsibleContent>
                                        </Collapsible>
                                    ))}
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
                            context={textbookInfo}/>
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
                        <SheetContent side="left" className="w-80 p-0">
                            <SidebarContent/>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* 메인 콘텐츠가 전체 화면 사용 */}
                <div className="flex-1 w-full">
                    <Outlet
                        context={textbookInfo}/>
                </div>
            </div>
        </div>
    );
}