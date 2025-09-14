import type { Route } from "./+types/textbook-layout";
import React, { useEffect, useMemo, useState, useRef } from "react";
import { Link, Outlet, redirect, useLocation, useNavigate } from "react-router";
import { ChevronDown, ChevronRight, Menu } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

import colors from "~/feature/textbooks/major-color";
import { z } from "zod";

import { getTextbookInfobyTextBookId } from "~/feature/textbooks/queries";
import { useAuthOutletData } from "~/feature/auth/useAuthUtil";
import { getUserIdFromSession } from "~/feature/auth/queries";

export const loader = async ({ params, request }: Route.LoaderArgs) => {
    const themeSlug = params["theme-slug"];
    const subjectSlug = params["subject-slug"];
    const textbookId = params["textbook-id"];

    const paramsSchema = z.object({ textbookId: z.coerce.number().min(1) });
    const { success, data } = paramsSchema.safeParse({ textbookId });
    if (!success) throw redirect("/404");

    const userId = await getUserIdFromSession(request)
    if (!userId) throw redirect("/404"); // 로그인이 필요하다는 페이지 따로 만들어야 할듯.

    const textbookInfo = await getTextbookInfobyTextBookId(data.textbookId, userId);

    // 정확한 경로 검사
    if (!(textbookInfo
        && textbookInfo.subject.slug === subjectSlug
        && textbookInfo.subject.theme.slug === themeSlug)
    ) throw redirect("/404");

    return { themeSlug, subjectSlug, textbookId, textbookInfo };
}

export default function TextbookLayout({ loaderData, params }: Route.ComponentProps) {

    const currentUnitId = params["unit-id"] ? parseInt(params["unit-id"]) : null;
    const { themeSlug, subjectSlug, textbookId, textbookInfo } = loaderData;

    // 로그인 안된 유저 로그인 유도
    const location = useLocation();
    const auth = useAuthOutletData()
    if (!(auth.isLoggedIn && auth.publicUserData)) {
        auth.setPendingUrlAfterLogin(`${location.pathname}`)
        auth.setShowLoginDialog(true)
        return <h1></h1>
    }


    // 좌측 네비게이션 토글 관련 변수
    const [openMajors, setOpenMajors] = useState<Set<number>>(new Set());
    const [openMiddles, setOpenMiddles] = useState<Set<string>>(new Set());
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const scrollAreaRef = useRef<HTMLDivElement>(null);
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

        // 현재 unit으로 스크롤하기 (약간의 지연을 주어 DOM이 업데이트된 후 실행)
        setTimeout(() => {
            const unitElement = document.querySelector(`[data-unit-id="${currentUnitId}"]`);
            if (unitElement && scrollAreaRef.current) {
                const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
                if (scrollContainer) {
                    const elementTop = unitElement.getBoundingClientRect().top;
                    const containerTop = scrollContainer.getBoundingClientRect().top;
                    const currentScrollTop = scrollContainer.scrollTop;
                    const targetScrollTop = currentScrollTop + elementTop - containerTop - 100; // 100px 여유 공간

                    scrollContainer.scrollTo({
                        top: Math.max(0, targetScrollTop),
                        behavior: 'smooth'
                    });
                }
            }
        }, 100);
    }, [currentUnitId]);


    const handleUnitClick = (unitId: number) => {
        // 로그인 되고, 과목을 등록한 유저만 오픈 가능.
        if (!auth.isLoggedIn) {
            auth.setPendingUrlAfterLogin(location.pathname); // 로그인 후 이동할 unit 저장
            auth.setShowLoginDialog(true);
        } else navigate(`${unitId}`);

        if (window.innerWidth < 768) setIsMobileMenuOpen(false);
    };


    // 사이드바 콘텐츠 컴포넌트
    const SidebarContent = () => (
        <div className={"h-screen sm:h-[calc(100vh-64px)] overflow-hidden"}>

            {/*상단 고정 버튼 */}
            <div className="flex justify-center items-center border-b h-[64px] overflow-hidden">

                <Link to={`/${themeSlug}/${subjectSlug}/${textbookId}`} className={"w-full"} onClick={() => {
                    if (window.innerWidth < 768) setIsMobileMenuOpen(false)
                }}>
                    <h2 className="font-semibold text-xl text-center w-full truncate">
                        {textbookInfo?.title}
                    </h2>
                </Link>
            </div>

            {/* 실제 네비 게이션*/}
            <ScrollArea ref={scrollAreaRef} className="h-[calc(100vh-64px)] sm:h-[calc(100vh-64px-64px)] overflow-y-auto]">
                <div className="pb-50 sm:p-2 sm:pb-80">
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
                                        className={`w-full justify-start p-2 h-auto text-left mt-4`}>
                                        {!openMajors.has(major.major_id) ? (
                                            <ChevronDown className={`h-4 w-4 mr-2 flex-shrink-0 ${colorSet.badge}`}/>
                                        ) : (
                                            <ChevronRight className={`h-4 w-4 mr-2 flex-shrink-0 ${colorSet.badge}`}/>
                                        )}
                                        <div
                                            className={`font-medium truncate ${colorSet.badge} py-1 px-3 rounded-4xl`}>{major.title}</div>
                                        <div
                                            className={`${majorActive ? "opacity-35" : ""}`}>
                                            {majorActive ? "🔥 " : null}
                                        </div>
                                    </Button>
                                </CollapsibleTrigger>

                                <CollapsibleContent className="ml-3 sm:ml-6">
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
                                                            <div
                                                                className={`${middleActive ? "opacity-35" : ""}`}>
                                                                {middleActive ? "🔥 " : null}
                                                            </div>
                                                        </Button>
                                                    </CollapsibleTrigger>

                                                    <CollapsibleContent className="ml-1 sm:ml-4">
                                                        {middle.units.map((unit) => {
                                                                const isActive = currentUnitId === unit.unit_id;
                                                                return (
                                                                    <div
                                                                        className="flex items-center relative"
                                                                        key={unit.unit_id}
                                                                        data-unit-id={unit.unit_id}>
                                                                        <Checkbox
                                                                            // checked={isChecked}
                                                                            className={"absolute left-5 size-5"}
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

            {/*하단에 로그인 관련 정보*/}
        </div>
    );

    return (
        <div className={"h-[calc(100vh-64px)] w-screen overflow-hidden"}>
            <div className={"hidden md:block h-[calc(100vh-64px)] w-screen overflow-hidden"}>
                {/* 데스크톱 - Resizable 레이아웃 */}
                <ResizablePanelGroup direction="horizontal">
                    <ResizablePanel defaultSize={20} minSize={15} maxSize={35}>
                        <SidebarContent/>
                    </ResizablePanel>
                    <ResizableHandle withHandle/>
                    <ResizablePanel defaultSize={80}>
                        <Outlet
                            context={{ textbookInfo, handleUnitClick }}/>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
            {/* 모바일 - Sheet 레이아웃 */}
            <div className="md:hidden flex flex-col relative h-[calc(100vh-64px)] w-screen overflow-hidden">
                {/* 플로팅 메뉴 버튼 */}
                <div className="fixed left-4 bottom-20 z-50">
                    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="size-12 flex-shrink-0 shadow-lg bg-background border-2 hover:bg-accent">
                                <Menu className="size-7"/>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left">
                            <SidebarContent/>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* 메인 콘텐츠가 전체 화면 사용 */}
                <div className="flex-1 w-full h-full overflow-auto">
                    <Outlet
                        context={{ textbookInfo, handleUnitClick }}/>
                </div>
            </div>
        </div>
    );
}