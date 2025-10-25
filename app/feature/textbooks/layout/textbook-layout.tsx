import type { Route } from "./+types/textbook-layout";
import React, { useEffect, useMemo, useState, useRef } from "react";
import {
    Outlet,
    redirect,
    useFetcher,
    useLocation,
    useNavigate
} from "react-router";
import { Menu } from "lucide-react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { z } from "zod";

import { getTextbookInfobyTextBookId } from "~/feature/textbooks/queries";
import { getUserIdForServer, useAuthOutletData } from "~/feature/auth/useAuthUtil";
import { calculateTotalProgressOptimized } from "~/feature/textbooks/total-progress";
import { loadTossPayments, type TossPaymentsWidgets } from "@tosspayments/tosspayments-sdk";
import EditUnitDialog from "../component/EditUnitDialog";
import NotPublishedAlert from "../component/NotPublishedAlert";
import EnrollAlertDialog from "../component/EnrollAlertDialog";
import SidebarContent from "../component/SidebarContent";
import { useMediaQuery } from "~/lib/utils";

type BasicStructureOfTitle = {
    sort_order: number,
    title: string,
    id: number,
}
export type UnitInfoType = {
    major: BasicStructureOfTitle
    middle: BasicStructureOfTitle
    unit: BasicStructureOfTitle
    is_free: boolean
    is_published: boolean
}

// ✅ loader
export const loader = async ({ params, request }: Route.LoaderArgs) => {

    const themeSlug = params["theme-slug"];
    const subjectSlug = params["subject-slug"];
    const textbookId = params["textbook-id"];

    const paramsSchema = z.object({ textbookId: z.coerce.number().min(1) });
    const { success, data } = paramsSchema.safeParse({ textbookId });
    if (!success) throw redirect("/404");

    const userId = await getUserIdForServer(request)
    if (!userId) return { themeSlug, subjectSlug, textbookId, textbookInfo: null }

    const textbookInfo = await getTextbookInfobyTextBookId(data?.textbookId, userId);

    // 정확한 경로 검사
    // Todo : 아직 공개 안한 자료의 경우 막는 로직 추가 해야함.
    if (!(textbookInfo
        && textbookInfo.subject.slug === subjectSlug
        && textbookInfo.subject.theme.slug === themeSlug)
    ) throw redirect("/404");

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


    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const scrollAreaRef = useRef<HTMLDivElement>(null);


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

        setCloseSection(prev => {
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

        if (isFree || isAdmin) {
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


    // 좌측 네비게이션 토글 관련 변수
    const [closeSection, setCloseSection] = useState<Set<string>>(new Set());
    const [isExpanded, setIsExpanded] = useState(true);

    const allSectionSet = new Set<string>()
    const toggleSection = (majorIndex: number, middleIndex: number) => {
        const key = `${majorIndex}-${middleIndex}`;
        setCloseSection(prev => {
            const newSet = new Set(prev);
            if (newSet.has(key)) newSet.delete(key);
            else newSet.add(key);
            return newSet;
        });
    };
    // 모두 펼치기.
    const onToggle = () => {
        setIsExpanded((prv) => !prv)
        if (isExpanded) setCloseSection(allSectionSet)
        else setCloseSection(new Set())
    }

    const justOpenMajor = (majorIndex: number) => {
        if (majorIndex === 0) {
            setCloseSection(new Set<string>())
            return
        }
        const willDeletedIfContain = `${majorIndex}-`;
        const filteredSet = new Set<string>();

        // 조건에 맞지 않는 것만 새 Set에 추가
        allSectionSet.forEach(value => {
            if (!value.startsWith(willDeletedIfContain)) {
                filteredSet.add(value);
            }
        });
        setCloseSection(filteredSet);
    };

    useEffect(() => {
        if (countMajorClosed('-0', closeSection) === countMajorClosed('-0', allSectionSet))
            setIsExpanded(false)
        else setIsExpanded(true)


    }, [closeSection])

    const countMajorClosed = (suffix: string, set: Set<string>) => {
        let count = 0;
        for (const item of set) if (item.endsWith(suffix)) count++;
        return count;
    };

    // 사이드바 수정 함수.
    const [unitInfo, setUnitInfo] = useState<UnitInfoType | null>(null);
    const [openUnitUpdate, setOpenUnitUpdate] = useState<boolean>(false);

    const updateUnitOnClick = (payload: UnitInfoType) => {
        setUnitInfo(payload)
        setOpenUnitUpdate(true)
    }

    const updateFetch = useFetcher()
    const updateUnitTitle = () => {
        updateFetch.submit(
            { unit_info: JSON.stringify(unitInfo) },
            {
                method: "post",
                action: "/api/units/update-title"
            }
        )
        setOpenUnitUpdate(false)
    }

    const isDesktop = useMediaQuery("(min-width: 768px)");


    return (
        <div className={"h-[calc(100vh-64px)] w-screen overflow-hidden"}>
            <EditUnitDialog
                open={openUnitUpdate}
                onOpenChange={setOpenUnitUpdate}
                unitInfo={unitInfo}
                setUnitInfo={setUnitInfo}
                onSave={updateUnitTitle}
            />
            <NotPublishedAlert open={notPublished} onOpenChange={openNotPubAlert}/>

            {/* 결제 관련 */}
            <EnrollAlertDialog
                open={openEnrollWindow}
                tosswindow={tosswindow}
                onClickStartEnroll={() => {
                    setTosswindow(true);
                    void initToss();
                }}
                price={price}
                enrollSuccess={enrollSuccess}
                enrollFail={enrollFail}
                onCancel={enrollCancel}
                onSubmit={enrollTextBooks}
                tossLoading={tossLoading}
                isSubmitting={enrollFetcher.state === "submitting"}
                isLoading={enrollFetcher.state === "loading"}
                title={textbookInfo!.title}
            />

            {isDesktop
                ? <div className={"hidden md:block h-[calc(100vh-64px)] w-screen overflow-hidden"}>
                    {/* 데스크톱 - Resizable 레이아웃 */}
                    <ResizablePanelGroup direction="horizontal">
                        <ResizablePanel defaultSize={20} minSize={15} maxSize={35}>
                            <SidebarContent
                                textbookId={textbookId}
                                textbookInfo={textbookInfo}
                                progressRate={progressRate}
                                currentUnitId={currentUnitId}
                                unitSectionMap={unitSectionMap}
                                allSectionSet={allSectionSet}
                                closeSection={closeSection}
                                toggleSection={toggleSection}
                                onToggle={onToggle}
                                isExpanded={isExpanded}
                                scrollAreaRef={scrollAreaRef}
                                isEnrolled={isEnrolled}
                                fetcher={fetcher}
                                handleUnitToggleClick={handleUnitToggleClick}
                                handleUnitClick={handleUnitClick}
                                isAdmin={isAdmin}
                                updateUnitOnClick={updateUnitOnClick}
                                setIsMobileMenuOpen={setIsMobileMenuOpen}
                            />
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
                                    setAfterEnrollNaviUrl,
                                    justOpenMajor
                                }}/>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </div>
                :
                <div className="md:hidden flex flex-col relative h-[calc(100vh-64px)] w-screen overflow-hidden">
                    {/* 모바일 - Sheet 레이아웃 */}
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
                                <SidebarContent
                                    textbookId={textbookId}
                                    textbookInfo={textbookInfo}
                                    progressRate={progressRate}
                                    currentUnitId={currentUnitId}
                                    unitSectionMap={unitSectionMap}
                                    allSectionSet={allSectionSet}
                                    closeSection={closeSection}
                                    toggleSection={toggleSection}
                                    onToggle={onToggle}
                                    isExpanded={isExpanded}
                                    scrollAreaRef={scrollAreaRef}
                                    isEnrolled={isEnrolled}
                                    fetcher={fetcher}
                                    handleUnitToggleClick={handleUnitToggleClick}
                                    handleUnitClick={handleUnitClick}
                                    isAdmin={isAdmin}
                                    updateUnitOnClick={updateUnitOnClick}
                                    setIsMobileMenuOpen={setIsMobileMenuOpen}
                                />
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
                                setAfterEnrollNaviUrl,
                                justOpenMajor
                            }}/>
                    </div>
                </div>
            }

        </div>
    );
}