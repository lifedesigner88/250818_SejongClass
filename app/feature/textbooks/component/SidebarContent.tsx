import React from "react";
import { Link } from "react-router";
import { ChevronsDown, ChevronsUp, ChevronDown, ChevronRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import colors from "~/feature/textbooks/major-color";
import { DateTime } from "luxon";
import { isNewInOneMonth } from "~/lib/utils";
import type { getTextbookInfobyTextBookId } from "~/feature/textbooks/queries";

// Local type to avoid runtime circular deps
type UnitInfoTypeLocal = {
    major: { sort_order: number; title: string; id: number };
    middle: { sort_order: number; title: string; id: number };
    unit: { sort_order: number; title: string; id: number };
    is_free: boolean;
    is_published: boolean;
};
export type TextBookInfoType = Awaited<ReturnType<typeof getTextbookInfobyTextBookId>>

export type SidebarContentProps = {
    themeSlug: string;
    subjectSlug: string;
    textbookId: string | number;
    textbookInfo: TextBookInfoType | null;
    progressRate: number;
    currentUnitId: number | null;
    unitSectionMap: Map<number, { majorIndex: number; middleIndex: number }>;
    allSectionSet: Set<string>;
    closeSection: Set<string>;
    toggleSection: (majorIndex: number, middleIndex: number) => void;
    onToggle: () => void;
    isExpanded: boolean;
    scrollAreaRef: React.RefObject<HTMLDivElement | null>;
    isEnrolled: boolean;
    fetcher: { state: "idle" | "submitting" | "loading"; formData?: FormData | null };
    handleUnitToggleClick: (unit_id: number, isPublished: boolean) => void;
    handleUnitClick: (unit_id: number, is_free: boolean, is_published: boolean) => void;
    isAdmin: boolean;
    updateUnitOnClick: (payload: UnitInfoTypeLocal) => void;
    setIsMobileMenuOpen: (open: boolean) => void;
};

export default function SidebarContent(props: SidebarContentProps) {
    const {
        themeSlug,
        subjectSlug,
        textbookId,
        textbookInfo,
        progressRate,
        currentUnitId,
        unitSectionMap,
        allSectionSet,
        closeSection,
        toggleSection,
        onToggle,
        isExpanded,
        scrollAreaRef,
        isEnrolled,
        fetcher,
        handleUnitToggleClick,
        handleUnitClick,
        isAdmin,
        updateUnitOnClick,
        setIsMobileMenuOpen,
    } = props;

    return (
        <div className={"h-screen sm:h-[calc(100vh-64px)] overflow-hidden"}>
            {/*상단 고정 버튼 */}
            <div className="flex justify-center items-center h-[64px] relative">
                {/* 모든 목차 열고 닫기 */}
                <Button variant="outline" size="sm" onClick={onToggle} className="cursor-pointer ml-5">
                    {isExpanded ? <ChevronsUp className="h-4 w-4"/> : <ChevronsDown className="h-4 w-4"/>}
                </Button>
                <Link
                    to={`/${themeSlug}/${subjectSlug}/${textbookId}`}
                    className={"w-full"}
                    onClick={() => {
                        if (window.innerWidth < 768) setIsMobileMenuOpen(false);
                    }}
                >
                    <h2 className="font-semibold text-xl text-center w-full truncate pr-8">{textbookInfo?.title}</h2>
                </Link>
                <Progress value={progressRate} className="absolute -bottom-1 w-full z-30"/>
            </div>

            {/* 실제 네비 게이션*/}
            <ScrollArea ref={scrollAreaRef} className="h-[calc(100vh-64px)] sm:h-[calc(100vh-64px-64px)]">
                <div className="pb-50 sm:p-2 sm:pb-80">
                    {textbookInfo?.majors.map((major: any, majorIndex: number) => {
                        const colorSet = colors[majorIndex + 1 % colors.length];
                        const majorActive =
                            currentUnitId && unitSectionMap.get(currentUnitId)?.majorIndex === major.major_id;
                        allSectionSet.add(`${major.major_id}-${0}`);
                        return (
                            <Collapsible
                                key={major.major_id}
                                open={!closeSection.has(`${major.major_id}-${0}`)}
                                onOpenChange={() => toggleSection(major.major_id, 0)}
                            >
                                <CollapsibleTrigger asChild>
                                    <Button variant="ghost"
                                            className={`w-full justify-start p-2 h-auto text-left mt-4`}>
                                        {!closeSection.has(`${major.major_id}-${0}`) ? (
                                            <ChevronDown className={`h-4 w-4 mr-2 flex-shrink-0 ${colorSet.badge}`}/>
                                        ) : (
                                            <ChevronRight className={`h-4 w-4 mr-2 flex-shrink-0 ${colorSet.badge}`}/>
                                        )}
                                        <div className={`font-medium truncate ${colorSet.badge} py-1 px-3 rounded-4xl`}>
                                            {`${major.sort_order}. `}
                                            {major.title}
                                        </div>
                                        <div
                                            className={`${majorActive ? "opacity-35" : ""}`}>{majorActive ? "🔥 " : null}</div>
                                    </Button>
                                </CollapsibleTrigger>

                                <CollapsibleContent className="ml-3 sm:ml-6">
                                    {major.middles.map((middle: any) => {
                                        const middleActive =
                                            currentUnitId && unitSectionMap.get(currentUnitId)?.middleIndex === middle.middle_id;
                                        allSectionSet.add(`${major.major_id}-${middle.middle_id}`);
                                        return (
                                            <Collapsible
                                                key={`${middle.middle_id}`}
                                                open={!closeSection.has(`${major.major_id}-${middle.middle_id}`)}
                                                onOpenChange={() => toggleSection(major.major_id, middle.middle_id)}
                                            >
                                                <CollapsibleTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        className="w-full justify-start p-2 h-auto text-left text-sm my-1"
                                                    >
                                                        {!closeSection.has(`${major.major_id}-${middle.middle_id}`) ? (
                                                            <ChevronDown className="h-3 w-3 mr-2 flex-shrink-0"/>
                                                        ) : (
                                                            <ChevronRight className="h-3 w-3 mr-2 flex-shrink-0"/>
                                                        )}
                                                        <div className="text-muted-foreground truncate">
                                                            {`${major.sort_order}-${middle.sort_order}. `}
                                                            {middle.title}
                                                        </div>
                                                        <div className={`${middleActive ? "opacity-35" : ""}`}>
                                                            {middleActive ? "🔥 " : null}
                                                        </div>
                                                    </Button>
                                                </CollapsibleTrigger>

                                                <CollapsibleContent className="ml-1 sm:ml-4">
                                                    {middle.units.map((unit: any) => {
                                                        const isActive = currentUnitId === unit.unit_id;
                                                        const isSubmitting = fetcher.state === "submitting";
                                                        const isLoading = fetcher.state === "loading";
                                                        const submittingId = fetcher.formData?.get("unit_id");
                                                        const optimism = Number(submittingId) === unit.unit_id && (isSubmitting || isLoading);
                                                        const isChecked = unit.progress.length > 0;
                                                        const updated = isNewInOneMonth(unit.updated_at!);

                                                        return (
                                                            <div className="flex items-center relative group"
                                                                 key={unit.unit_id} data-unit-id={unit.unit_id}>
                                                                <Checkbox
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleUnitToggleClick(unit.unit_id, unit.is_published);
                                                                    }}
                                                                    className={"absolute left-2 size-6 cursor-pointer"}
                                                                    checked={optimism ? !isChecked : isChecked}
                                                                    disabled={isSubmitting || isLoading}
                                                                />
                                                                <Button
                                                                    variant="ghost"
                                                                    className={`w-full justify-start p-2 h-auto text-left text-sm group ${
                                                                        isActive ? "bg-accent text-accent-foreground" : ""
                                                                    }`}
                                                                    onClick={() => handleUnitClick(unit.unit_id, unit.is_free, unit.is_published)}
                                                                >
                                                                    <div className="truncate w-full pl-10">
                                                                        {`${unit.sort_order.toString().padStart(2, "0")}. `}
                                                                        {unit.title}
                                                                        {unit.is_published ? (
                                                                            isEnrolled ? (
                                                                                ""
                                                                            ) : unit.is_free ? (
                                                                                <Badge className={"ml-2 bg-sky-200"}
                                                                                       variant={"outline"}>
                                                                                    free
                                                                                </Badge>
                                                                            ) : (
                                                                                " 🔒"
                                                                            )
                                                                        ) : (
                                                                            " 🚫"
                                                                        )}
                                                                        {unit.is_published ? (
                                                                            updated ? (
                                                                                <span
                                                                                    className="text-xs opacity-0 group-hover:opacity-50">
                                                                                  &nbsp;&nbsp;&nbsp;{` ${DateTime.fromJSDate(unit.updated_at!).setLocale("ko").toRelative()}`}
                                                                                </span>
                                                                            ) : (
                                                                                ""
                                                                            )
                                                                        ) : (
                                                                            ""
                                                                        )}
                                                                    </div>
                                                                    <div
                                                                        className={`text-xs text-muted-foreground flex-shrink-0 pr-2 ${
                                                                            isActive ? "" : "opacity-35"
                                                                        }`}
                                                                    >
                                                                        {isActive ? "🔥 " : null}
                                                                        {Math.ceil(unit.estimated_seconds / 60)}분
                                                                    </div>
                                                                </Button>
                                                                {isAdmin ? (
                                                                    <Button
                                                                        variant={"outline"}
                                                                        className={"absolute right-20 "}
                                                                        onClick={() =>
                                                                            updateUnitOnClick({
                                                                                major: {
                                                                                    sort_order: major.sort_order,
                                                                                    title: major.title,
                                                                                    id: major.major_id,
                                                                                },
                                                                                middle: {
                                                                                    sort_order: middle.sort_order,
                                                                                    title: middle.title,
                                                                                    id: middle.middle_id,
                                                                                },
                                                                                unit: {
                                                                                    sort_order: unit.sort_order,
                                                                                    title: unit.title,
                                                                                    id: unit.unit_id,
                                                                                },
                                                                                is_free: unit.is_free,
                                                                                is_published: unit.is_published,
                                                                            })
                                                                        }
                                                                    >
                                                                        edit
                                                                    </Button>
                                                                ) : null}
                                                            </div>
                                                        );
                                                    })}
                                                </CollapsibleContent>
                                            </Collapsible>
                                        );
                                    })}
                                </CollapsibleContent>
                            </Collapsible>
                        );
                    })}
                </div>
            </ScrollArea>
        </div>
    );
}
