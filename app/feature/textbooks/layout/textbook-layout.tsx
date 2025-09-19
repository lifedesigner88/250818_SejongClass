import type { Route } from "./+types/textbook-layout";
import React, { useEffect, useMemo, useState, useRef } from "react";
import {
    Link,
    Outlet,
    redirect,
    useFetcher,
    useLocation,
    useNavigate
} from "react-router";
import { ChevronDown, ChevronRight, Loader2, Menu } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

import colors from "~/feature/textbooks/major-color";
import { z } from "zod";

import { getTextbookInfobyTextBookId } from "~/feature/textbooks/queries";
import { getUserIdForSever, useAuthOutletData } from "~/feature/auth/useAuthUtil";
import { calculateTotalProgressOptimized } from "~/feature/textbooks/total-progress";
import { Progress } from "@/components/ui/progress";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { loadTossPayments, type TossPaymentsWidgets } from "@tosspayments/tosspayments-sdk";
import { isNewInOneMonth } from "~/lib/utils";
import { DateTime } from "luxon";

// ✅ loader
export const loader = async ({ params, request }: Route.LoaderArgs) => {

    console.time("⏳ textbook-layout loader")
    const themeSlug = params["theme-slug"];
    const subjectSlug = params["subject-slug"];
    const textbookId = params["textbook-id"];

    const paramsSchema = z.object({ textbookId: z.coerce.number().min(1) });
    const { success, data } = paramsSchema.safeParse({ textbookId });
    if (!success) throw redirect("/404");

    const userId = await getUserIdForSever(request)
    if (!userId) return { themeSlug, subjectSlug, textbookId, textbookInfo: null }

    const textbookInfo = await getTextbookInfobyTextBookId(data?.textbookId, userId);

    // 정확한 경로 검사
    // Todo : 아직 공개 안한 자료의 경우 막는 로직 추가 해야함.
    if (!(textbookInfo
        && textbookInfo.subject.slug === subjectSlug
        && textbookInfo.subject.theme.slug === themeSlug)
    ) throw redirect("/404");
    console.timeEnd("⏳ textbook-layout loader")

    return { themeSlug, subjectSlug, textbookId, textbookInfo };
}

// 📜 page
export default function TextbookLayout({ loaderData, params }: Route.ComponentProps) {

    // 로그인 안된 유저 로그인 유도
    const location = useLocation();
    const auth = useAuthOutletData()
    if (!(auth.isLoggedIn && auth.publicUserData)) {
        auth.setPendingUrlAfterLogin(`${location.pathname}`)
        auth.setShowLoginDialog(true)
        return <h1></h1>
    }
    const isAdmin = auth.isAdmin

    const currentUnitId = params["unit-id"] ? parseInt(params["unit-id"]) : null;
    const { themeSlug, subjectSlug, textbookId, textbookInfo } = loaderData;

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
        textbookInfo!.majors.forEach((major) => {
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


    // 강의 등록 여부 체크
    const isEnrolled = textbookInfo!.enrollments.length > 0;
    const price = textbookInfo!.price;

    const [openEnrollWindow, setOpenEnrollWindow] = useState(false);
    const [afterEnrollNaviUrl, setAfterEnrollNaviUrl] = useState<string>(location.pathname);

    const handleUnitClick = (unitId: number, isFree: boolean, isPublished: boolean) => {

        if (isFree) {
            navigate(`${unitId}`);
            if (window.innerWidth < 768) setIsMobileMenuOpen(false);
            return
        }

        if (!isPublished) {
            openNotPubAlert(true)
            return
        }

        if (!isAdmin && !isEnrolled && !isFree) {
            setOpenEnrollWindow(true)
            return
        }

        navigate(`${unitId}`);
        if (window.innerWidth < 768) setIsMobileMenuOpen(false);
    };

    const fetcher = useFetcher()
    const handleUnitToggleClick = (unit_id: number, isPublished: boolean) => {
        if (!isPublished) {
            openNotPubAlert(true)
            return
        }

        if (!isEnrolled) {
            setOpenEnrollWindow(true)
            return
        }

        void fetcher.submit({
            unit_id
        }, {
            method: "post",
            action: "/api/units/toggle-unit",
        })
    }

    // 과먹 진행상황 계산.
    const progressRate = Math.floor(calculateTotalProgressOptimized(textbookInfo!))
    useEffect(() => {
        if (progressRate >= 0) {
            fetch('/api/enrollments/update-progress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    progress_rate: progressRate,
                    textbook_id: textbookId,
                })
            }).catch(console.error);
        }
    }, [progressRate]);


    const [tosswindow, setTosswindow] = useState(false);
    const [enrollSuccess, setEnrollSuccess] = useState(false);
    const [enrollFail, setEnrollFail] = useState(false);
    const [tossLoading, setTossLoading] = useState(false);


    const widgets = useRef<TossPaymentsWidgets>(null);


    // 토스창 렌더링
    const initToss = async () => {
        setTossLoading(true);
        const toss = await loadTossPayments("test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm")
        widgets.current = toss.widgets({ customerKey: auth.publicUserData.user_id })

        await widgets.current?.setAmount({
            value: price,
            currency: "KRW"
        })

        await widgets.current?.renderPaymentMethods({
            selector: "#toss-payment-methods",
        })

        await widgets.current?.renderAgreement({
            selector: "#toss-payment-agreement",
        })
        setTossLoading(false);
    };

    const enrollFetcher = useFetcher()
    // 강의 등록
    const enrollTextBooks = async () => {
        if (price === 0) {
            await enrollFetcher.submit({
                    textbook_id: textbookId,
                    price
                },
                {
                    method: "post",
                    action: "/api/enrollments/enroll-free",
                })
        } else {
            await widgets.current?.requestPayment({
                    orderId: crypto.randomUUID(),
                    orderName: `SejongClass-${textbookInfo!.title}`,
                    customerEmail: auth.publicUserData.email,
                    customerName: auth.publicUserData.username,
                    metadata: {
                        textbook_id: textbookId,
                        user_id: auth.publicUserData.user_id,
                        redirect_url: afterEnrollNaviUrl,
                        customerEmail: auth.publicUserData.email,
                    },
                    successUrl: `${window.location.origin}/api/enrollments/enroll`,
                    failUrl: `${window.location.href}/fail`,
                }
            )
        }

    }

    useEffect(() => {

        if (enrollFetcher.data === "success") {
            setEnrollSuccess(true)
            setTimeout(() => {
                enrollCancel()
            }, 3000)

        } else if (enrollFetcher.data === "fail") {
            setEnrollFail(true)
            setTimeout(() => {
                enrollCancel()
            }, 3000)
        }

    }, [enrollFetcher.data])

    // 등록창 닫기.
    const enrollCancel = () => {
        const currentPath = location.pathname;
        const wilNavigatePath = `/${themeSlug}/${subjectSlug}/${textbookId}`;

        // unit 창에서 들어온  요청 검증
        if (currentPath !== wilNavigatePath) {
            navigate(wilNavigatePath);
        }
        setOpenEnrollWindow(false)
        setTimeout(() => {
            setTossLoading(false)
            setTosswindow(false)
        }, 1000)
    }

    const [notPublished, openNotPubAlert] = useState(false)

    // 사이드바 콘텐츠 컴포넌트
    const SidebarContent = () => (
        <div className={"h-screen sm:h-[calc(100vh-64px)] overflow-hidden"}>

            {/*상단 고정 버튼 */}
            <div className="flex justify-center items-center h-[64px] relative">

                <Link to={`/${themeSlug}/${subjectSlug}/${textbookId}`} className={"w-full"} onClick={() => {
                    if (window.innerWidth < 768) setIsMobileMenuOpen(false)
                }}>
                    <h2 className="font-semibold text-xl text-center w-full truncate">
                        {textbookInfo?.title}
                    </h2>
                    <Progress value={progressRate} className="absolute -bottom-1 w-full z-30"/>
                </Link>
            </div>

            {/* 실제 네비 게이션*/}
            <ScrollArea ref={scrollAreaRef}
                        className="h-[calc(100vh-64px)] sm:h-[calc(100vh-64px-64px)]">
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
                                                            className="w-full justify-start p-2 h-auto text-left text-sm my-1">
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
                                                                const isSubmitting = fetcher.state === "submitting";
                                                                const isLoading = fetcher.state === "loading";
                                                                const submittingId = fetcher.formData?.get("unit_id");
                                                                const optimism = Number(submittingId) === unit.unit_id && (isSubmitting || isLoading)
                                                                const isChecked = unit.progress.length > 0;
                                                                const updated = isNewInOneMonth(unit.updated_at!)


                                                                return (
                                                                    <div
                                                                        className="flex items-center relative"
                                                                        key={unit.unit_id}
                                                                        data-unit-id={unit.unit_id}>
                                                                        <Checkbox
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleUnitToggleClick(unit.unit_id, unit.is_published)
                                                                            }}
                                                                            className={"absolute left-2 size-6 cursor-pointer"}
                                                                            checked={optimism ? !isChecked : isChecked}
                                                                            disabled={(isSubmitting || isLoading)}
                                                                        />
                                                                        <Button
                                                                            variant="ghost"
                                                                            className={`w-full justify-start p-2 h-auto text-left text-sm group ${
                                                                                isActive ? 'bg-accent text-accent-foreground' : ''
                                                                            }`}
                                                                            onClick={() => handleUnitClick(unit.unit_id, unit.is_free, unit.is_published)}
                                                                        >
                                                                            <div
                                                                                className="truncate w-full pl-10">
                                                                                {unit.title}
                                                                                {unit.is_published
                                                                                    ? isEnrolled
                                                                                        ? ""
                                                                                        : unit.is_free
                                                                                            ? " 🟢 free"
                                                                                            : " 🔒"
                                                                                    : " 🚫"
                                                                                }
                                                                                {unit.is_published
                                                                                    ? updated
                                                                                        ? <span
                                                                                            className="text-xs   opacity-0 group-hover:opacity-50"> &nbsp;&nbsp;&nbsp;
                                                                                            {` ${DateTime.fromJSDate(unit.updated_at!).toRelative()}`}</span>
                                                                                        : ""
                                                                                    : ""
                                                                                }
                                                                            </div>
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
        </div>
    );
    return (
        <div className={"h-[calc(100vh-64px)] w-screen overflow-hidden"}>

            <AlertDialog open={notPublished} onOpenChange={openNotPubAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            🚫 강의 준비 중 🚫
                        </AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction>
                            둘러보기
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>

            </AlertDialog>


            {/* 결제 관련 */}
            <AlertDialog open={openEnrollWindow}>
                <AlertDialogContent className={"max-w-full px-1 sm:px-6 max-h-screen overflow-y-auto"}>

                    {/* 강의 등록 의사 물어보기 */}
                    <div className={tosswindow ? "hidden" : "block"}>
                        <AlertDialogHeader>
                            <AlertDialogTitle>✏️ 강의등록 ✏️</AlertDialogTitle>
                            <AlertDialogDescription className={"pb-3"}>
                                {price === 0 ? "무료" : `${price.toLocaleString()}원`} 입니다.
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => enrollCancel()}>둘러보기</AlertDialogCancel>
                            <AlertDialogAction onClick={() => {
                                setTosswindow(true)
                                void initToss()
                            }}>강의등록</AlertDialogAction>
                        </AlertDialogFooter>
                    </div>


                    {/* 결제창 띄우기 */}
                    <div className={tosswindow ? "block" : "hidden"}>

                        {/* 결제 성공 */}
                        <AlertDialogHeader className={enrollSuccess ? "block" : "hidden"}>
                            <AlertDialogTitle>등록 완료</AlertDialogTitle>
                            <AlertDialogDescription className={"text-center text-9xl pb-15 pt-8 animate-bounce"}>
                                🎉
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        {/* 결제 실패 */}
                        <AlertDialogHeader className={enrollFail ? "block" : "hidden"}>
                            <AlertDialogTitle>등록 오류</AlertDialogTitle>
                            <AlertDialogDescription>
                                새로고침후 다시 시도해 주세요.
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogHeader className={enrollSuccess || enrollFail ? "hidden" : "block"}>
                            <AlertDialogHeader>
                                <AlertDialogTitle>{textbookInfo!.title}</AlertDialogTitle>
                                <div id={"toss-payment-methods"} className={"w-full"}></div>
                                <div id={"toss-payment-agreement"} className={"w-full"}></div>
                            </AlertDialogHeader>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                            <AlertDialogCancel
                                onClick={() => enrollCancel()}>{enrollSuccess || enrollFail ? "수강하기" : "돌아가기"}</AlertDialogCancel>
                            <AlertDialogAction onClick={() => enrollTextBooks()}
                                               className={enrollSuccess || enrollFail ? "hidden" : "block"}
                                               disabled={tossLoading || enrollFetcher.state === "submitting" || enrollFetcher.state === "loading"}>
                                {tossLoading ?
                                    <div className={"flex items-center gap-1"}>
                                        <Loader2 className="size-5 mr-3 animate-spin"/>
                                        <div> 로딩중 ...</div>
                                    </div>
                                    : <>
                                        {enrollFetcher.state === "submitting" || enrollFetcher.state === "loading" ? (
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                                                처리중...
                                            </div>
                                        ) : (
                                            price === 0 ? "결제없이 수강신청" : `${price.toLocaleString()}원 결제`
                                        )}
                                    </>}
                            </AlertDialogAction>

                        </AlertDialogFooter>
                    </div>
                </AlertDialogContent>
            </AlertDialog>


            <div className={"hidden md:block h-[calc(100vh-64px)] w-screen overflow-hidden"}>
                {/* 데스크톱 - Resizable 레이아웃 */}
                <ResizablePanelGroup direction="horizontal">
                    <ResizablePanel defaultSize={20} minSize={15} maxSize={35}>
                        <SidebarContent/>
                    </ResizablePanel>
                    <ResizableHandle withHandle/>
                    <ResizablePanel defaultSize={80}>
                        <Outlet
                            context={{
                                isAdmin,
                                textbookInfo,
                                handleUnitClick,
                                isEnrolled,
                                setOpenEnrollWindow,
                                setAfterEnrollNaviUrl
                            }}/>
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
                        context={{
                            isAdmin,
                            textbookInfo,
                            handleUnitClick,
                            isEnrolled,
                            setOpenEnrollWindow,
                            setAfterEnrollNaviUrl
                        }}/>
                </div>
            </div>

        </div>
    );
}