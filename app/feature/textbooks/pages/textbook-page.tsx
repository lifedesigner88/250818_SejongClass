import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedCircularProgressBar } from "@/components/ui/animated-circular-progress-bar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { getTextbookInfobyTextBookId } from "~/feature/textbooks/queries";
import { Target, Hash, TrendingUp, BarChart, BanIcon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFetcher, useOutletContext } from "react-router";
import colors from "~/feature/textbooks/major-color";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";


type TextbookInfo = Awaited<ReturnType<typeof getTextbookInfobyTextBookId>>;
export type OutletContextType = {
    isAdmin: boolean;
    textbookInfo: TextbookInfo;
    handleUnitClick: (unitId: number, isFree: boolean, isPublish: boolean) => void;
    isEnrolled: boolean
    setOpenEnrollWindow: (open: boolean) => void;
    setAfterEnrollNaviUrl: (url: string) => void;
    justOpenMajor: (majorId: number) => void;
};

export default function TextbookPage() {

    const {
        textbookInfo,
        handleUnitClick,
        isEnrolled,
        setOpenEnrollWindow,
        justOpenMajor
    } = useOutletContext<OutletContextType>();

    const [selectedFilter, setSelectedFilter] = useState<string>('all');
    if (!textbookInfo) return (<div> TextbookInfo 가 없습니다. </div>)

    // 📊 카운트 및 시간 계산
    const unitCount = textbookInfo.majors.reduce((acc, major) =>
            acc + major.middles.reduce((acc2, middle) =>
                acc2 + middle.units.length, 0
            ), 0
    );

    const totalEstimatedSeconds = textbookInfo.majors.reduce((acc, major) =>
            acc + major.middles.reduce((acc2, middle) =>
                    acc2 + middle.units.reduce((acc3, unit) =>
                        acc3 + unit.estimated_seconds, 0
                    ), 0
            ), 0
    );


    // ⏰ 시간 포맷팅
    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours > 0) return `${hours}시간 ${minutes}분`;
        return `${minutes}분`;
    };

    const curriculumList: {
        code: string;
        achievement_text: string;
        unit_id: number;
        major_name: string;
        unit_name: string;
        curriculum_id: number;
        isChecked: boolean;
        isFree: boolean;
        isPublished: boolean;
    }[] = [];


    let checkedUnitsCounter = 0;
    let unCheckedUnitsEstimatedSeconds = 0;

    textbookInfo.majors.forEach(major => {
        major.middles.forEach(middle => {
            middle.units.forEach(unit => {

                if (unit.progress && unit.progress.length > 0)
                    checkedUnitsCounter++
                else unCheckedUnitsEstimatedSeconds += unit.estimated_seconds;

                if (unit.curriculums && unit.curriculums.length > 0) {
                    unit.curriculums.forEach(curriculum => {
                        curriculumList.push({
                            code: curriculum.code,
                            achievement_text: curriculum.achievement_text,
                            unit_id: unit.unit_id,
                            major_name: major.title,
                            unit_name: unit.title,
                            curriculum_id: curriculum.curriculum_id,
                            isChecked: curriculum.checklists.length > 0,
                            isFree: unit.is_free,
                            isPublished: unit.is_published,
                        });
                    });
                }
            });
        });
    });

    const checkedCurriculums = curriculumList.filter(curriculum => curriculum.isChecked);

    const fetcher = useFetcher()
    const handleCurriculumClick = (curriculum_id: number) => {

        if (!isEnrolled) {
            setOpenEnrollWindow(true)
            return
        }

        void fetcher.submit({
            curriculum_id
        }, {
            method: "post",
            action: "/api/curriculums/toggle-curriculum",
        })
    }

    // 🔍 필터링된 curriculum 목록 - 대단원명으로 필터링
    const filteredCurriculumList = selectedFilter === 'all'
        ? curriculumList.filter(curriculum => !curriculum.isChecked)
        : curriculumList.filter(curriculum => curriculum.major_name === selectedFilter);

    const unCheckedCurriculumList = curriculumList.filter(curriculum => !curriculum.isChecked);

    // 📊 대단원별 카운트 - curriculumList의 major_name을 활용
    const majorNames = [...new Set(curriculumList.map(c => c.major_name))];
    const CheckedMajorCounts: Record<string, number> = {
        all: unCheckedCurriculumList.length,
        ...majorNames.reduce((acc, majorName) => {
            acc[majorName] = curriculumList.filter(c => c.major_name === majorName && c.isChecked).length;
            return acc;
        }, {} as Record<string, number>)
    };

    const majorCounts: Record<string, number> = {
        all: curriculumList.length,
        ...majorNames.reduce((acc, majorName) => {
            acc[majorName] = curriculumList.filter(c => c.major_name === majorName).length;
            return acc;
        }, {} as Record<string, number>)
    };

    const getMajorIdFromName = (majorName: string) => {
        if (majorName === "all") return 0;
        return textbookInfo.majors.find(major => major.title === majorName)?.major_id;
    }

    const unitProgress = (checkedUnitsCounter / unitCount) * 100;
    const curriculumProgress = (checkedCurriculums.length / curriculumList.length) * 100;
    const totalProgress = Math.floor((unitProgress * 0.5) + (curriculumProgress * 0.5));
    const price = textbookInfo!.price;

    return (
        <div className=" p-3 h-[calc(100vh-64px)] overflow-y-scroll">
            <div className={"max-w-full"}>

                {/* 📊 통계 정보 카드들 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
                    {/* 대단원 카드 */}
                    <Card className="hover:shadow-md transition-shadow duration-300">
                        <CardContent className="flex flex-col items-center justify-center p-4 md:p-6">
                            {isEnrolled ? <>
                                    <AnimatedCircularProgressBar className={"size-30"} max={100} value={totalProgress}
                                                                 gaugePrimaryColor={`${totalProgress > 99 ? "red" : "#4ade80"}`}
                                                                 gaugeSecondaryColor={"#f4f4f5"}/>
                                </> :
                                <div className="flex items-center justify-center w-30 h-30 bg-red-100 rounded-full">
                                    <BanIcon className="w-20 h-20 text-red-500"/>
                                </div>}

                        </CardContent>
                    </Card>

                    {/* 남은시간 카드 */}
                    <Card
                        className={`hover:shadow-md transition-shadow duration-300 ${isEnrolled ? "" : "cursor-pointer"}`}
                        onClick={() => {
                            if (!isEnrolled) {
                                setOpenEnrollWindow(true)
                                return
                            }
                        }}>
                        <CardContent className="flex flex-col items-center justify-center p-4 md:p-6">
                            <div
                                className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-full mb-2 md:mb-3">
                                {unCheckedUnitsEstimatedSeconds === 0 ? (
                                    <div className="text-4xl">🎉</div>
                                ) : <>
                                    {isEnrolled
                                        ? <><Hash className="w-5 h-5 md:w-6 md:h-6 text-green-600"/></>
                                        : <div className="text-3xl">✏️</div>
                                    }
                                </>}
                            </div>
                            {isEnrolled ? <>
                                <div className="text-xl md:text-2xl font-bold text-green-600 mb-1 truncate max-w-full">
                                    {unCheckedUnitsEstimatedSeconds === 0 ? "완강" : formatTime(unCheckedUnitsEstimatedSeconds)}
                                </div>
                                <div className="text-xs md:text-sm text-gray-600 text-center truncate max-w-full">
                                    남은 강의
                                </div>
                            </> : <>

                                <div className="text-xs md:text-sm text-center truncate max-w-full text-green-600">
                                    {price === 0 ? "무료" : price.toLocaleString() + "원"}
                                </div>
                                <Button
                                    className={"text-xl md:text-xl mt-2 px-10  pt-4 pb-4 truncate max-w-full bg-red-600 cursor-pointer shadow-xl/10"}>
                                    {price === 0 ? "등록하기" : "결제하기"}
                                </Button>
                            </>
                            }

                        </CardContent>
                    </Card>

                    {/* 소단원 카드 */}
                    <Card className="hover:shadow-md transition-shadow duration-300">
                        <CardContent className="flex flex-col items-center justify-center p-4 md:p-6">
                            <div
                                className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-full mb-2 md:mb-3">
                                {checkedUnitsCounter === unitCount ? (
                                    <div className="text-4xl">🎉</div>
                                ) : (
                                    <Target className="w-5 h-5 md:w-6 md:h-6 text-purple-600"/>
                                )}
                            </div>
                            <div className="text-xl md:text-2xl font-bold text-purple-600 mb-1 truncate max-w-full">
                                {checkedUnitsCounter} / {unitCount}
                            </div>
                            <div className="text-xs md:text-sm text-gray-600 text-center truncate max-w-full">
                                소단원
                            </div>
                        </CardContent>
                    </Card>

                    {/* 성취기준 카드 */}
                    <Card className="hover:shadow-md transition-shadow duration-300">
                        <CardContent className="flex flex-col items-center justify-center p-4 md:p-6">
                            <div
                                className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-yellow-100 rounded-full mb-2 md:mb-3">
                                {checkedCurriculums.length === curriculumList.length ? (
                                    <div className="text-4xl">🎉</div>
                                ) : (
                                    <BarChart className="w-5 h-5 md:w-6 md:h-6 text-yellow-600"/>
                                )}
                            </div>
                            <div className="text-xl md:text-2xl font-bold text-yellow-600 mb-1 truncate max-w-full">
                                {checkedCurriculums.length} / {curriculumList.length}
                            </div>
                            <div className="text-xs md:text-sm text-gray-600 text-center truncate max-w-full">
                                성취기준
                            </div>
                        </CardContent>
                    </Card>

                    {/* 소요시간 카드 */}
                    <Card
                        className="hover:shadow-md transition-shadow duration-300 col-span-1 sm:col-span-2 lg:col-span-1">
                        <CardContent className="flex flex-col items-center justify-center p-4 md:p-6">
                            <div
                                className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-orange-100 rounded-full mb-2 md:mb-3">

                                {unCheckedUnitsEstimatedSeconds === 0 ? (
                                    <div className="text-4xl">🎉</div>
                                ) : (
                                    <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-orange-600"/>
                                )}
                            </div>
                            <div className="text-xl md:text-2xl font-bold text-orange-600 mb-1 truncate max-w-full">
                                {formatTime(totalEstimatedSeconds)}
                            </div>
                            <div className="text-xs md:text-sm text-gray-600 text-center truncate max-w-full">
                                총 강의
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* 🎯 필터링 컨트롤 */}
                <Card className="border-0 shadow-none">
                    <CardContent className={"p-0 "}>
                        <Tabs value={selectedFilter} onValueChange={setSelectedFilter}
                              className={"w-full overflow-x-auto rounded-lg bg-muted"}
                              onClick={() => justOpenMajor(getMajorIdFromName(selectedFilter)!)}>
                            {/* 모바일에서 스크롤 가능한 탭 */}
                            <TabsList
                                className="flex h-14 items-center justify-between text-muted-foreground w-full p-2">
                                <TabsTrigger
                                    value="all"
                                    className="cursor-pointer"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                        <span>진행중</span>
                                        <div
                                            className=" flex items-center justify-center min-w-[20px] h-5 bg-blue-100  rounded-full text-xs font-semibold p-2">
                                            {CheckedMajorCounts.all}
                                        </div>
                                    </div>
                                </TabsTrigger>
                                {majorNames.map((majorName, index) => {
                                    const colorSet = colors[index + 1 % colors.length];
                                    return (
                                        <TabsTrigger
                                            key={majorName}
                                            value={majorName}
                                            className="cursor-pointer">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 ${colorSet.bg} rounded-full`}></div>
                                                <div
                                                    className="truncate">{majorName}</div>
                                                <div
                                                    className={`flex items-center justify-center min-w-[20px] h-5 rounded-full text-xs font-semibold p-2 ${colorSet.badge}`}>
                                                    {CheckedMajorCounts[majorName]} / {majorCounts[majorName]}
                                                </div>
                                            </div>
                                        </TabsTrigger>
                                    );
                                })}
                            </TabsList>
                        </Tabs>
                    </CardContent>
                </Card>
                {/* 📋 Curriculum 카드 목록 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                    {filteredCurriculumList.length > 0 ? (
                        filteredCurriculumList.map((curriculum, index) => {
                            // 대단원 이름을 기반으로 색상 인덱스 계산
                            const majorIndex = majorNames.findIndex(name => name === curriculum.major_name);
                            const colorIndex = majorIndex !== -1 ? majorIndex : 0;
                            const colorSet = colors[colorIndex + 1 % colors.length];

                            const isSubmitting = fetcher.state === "submitting";
                            const isLoading = fetcher.state === "loading";
                            const submittingId = fetcher.formData?.get("curriculum_id");
                            const optimism = Number(submittingId) === curriculum.curriculum_id && (isSubmitting || isLoading)

                            return (
                                <div key={`${index}`} className={"relative "}>
                                    <Checkbox
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleCurriculumClick(curriculum.curriculum_id)
                                        }}
                                        className={`cursor-pointer z-10 size-10 lg:size-8 absolute right-5 bottom-5`}
                                        checked={optimism ? !curriculum.isChecked : curriculum.isChecked}
                                        disabled={(isSubmitting || isLoading)}
                                    />

                                    <Tooltip>
                                        <TooltipTrigger className={"w-full h-full"}>
                                            <Card
                                                onClick={() => handleUnitClick(curriculum.unit_id, curriculum.isFree, curriculum.isPublished)}
                                                className="hover:shadow-lg min-h-[200px] w-full cursor-zoom-in">

                                                <CardHeader className="space-y-3">
                                                    {/* 상단 메타 정보 */}
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="space-y-1">
                                                                <Badge
                                                                    className={`font-mono text-xs ${colorSet.badge}`}>
                                                                    {curriculum.code}
                                                                </Badge>
                                                            </div>

                                                        </div>
                                                        <div className="flex flex-col items-end gap-1">
                                                            {curriculum.isPublished
                                                                ? isEnrolled
                                                                    ? ""
                                                                    : curriculum.isFree
                                                                        ? <Badge className={"ml-2 bg-sky-200"}
                                                                                 variant={"outline"}>free</Badge>
                                                                        : " 🔒"
                                                                : " 🚫"
                                                            }
                                                        </div>
                                                    </div>
                                                </CardHeader>

                                                <CardContent className="space-y-4">
                                                    {/* 성취기준 내용 */}
                                                    <div className="flex items-start gap-2">
                                                        <CardDescription className="leading-relaxed text-left">
                                                            {curriculum.achievement_text}
                                                        </CardDescription>
                                                    </div>

                                                </CardContent>
                                            </Card>
                                        </TooltipTrigger>
                                        <TooltipContent
                                            className={`bg-background text-foreground shadow-lg rounded-lg border p-4 ${colorSet.badge} text-sm`}>
                                            {curriculum.unit_name}
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                            );
                        })
                    ) : (
                        <Card className="col-span-full">
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <CardTitle className="text-9xl"> 🎉 </CardTitle>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}

