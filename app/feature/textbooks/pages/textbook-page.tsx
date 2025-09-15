import { useFetcher, useOutletContext } from "react-router";
import type { getTextbookInfobyTextBookId } from "~/feature/textbooks/queries";
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Target, Hash, TrendingUp, BarChart } from "lucide-react";
import colors from "~/feature/textbooks/major-color";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";

type TextbookInfo = Awaited<ReturnType<typeof getTextbookInfobyTextBookId>>;
export type OutletContextType = {
    textbookInfo: TextbookInfo;
    handleUnitClick: (unitId: number) => void;
    userId: string;
};


// 통계 카드 타입 정의
interface StatCardProps {
    icon: React.ElementType;
    value: string | number;
    label: string;
    colorClass: {
        bg: string;
        text: string;
    };
    className?: string;
}

// 통계 카드 컴포넌트
function StatCard({ icon: Icon, value, label, colorClass, className }: StatCardProps) {
    return (
        <Card className={`hover:shadow-md transition-shadow duration-300 ${className || ''}`}>
            <CardContent className="flex flex-col items-center justify-center p-4 md:p-6">
                <div
                    className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 ${colorClass.bg} rounded-full mb-2 md:mb-3`}>
                    <Icon className={`w-5 h-5 md:w-6 md:h-6 ${colorClass.text}`}/>
                </div>
                <div
                    className={`text-xl md:text-2xl font-bold ${colorClass.text} mb-1 truncate max-w-full`}>{value}</div>
                <div className="text-xs md:text-sm text-gray-600 text-center truncate max-w-full">{label}</div>
            </CardContent>
        </Card>
    );
}

export default function TextbookPage() {

    const { textbookInfo, handleUnitClick } = useOutletContext<OutletContextType>();

    const [selectedFilter, setSelectedFilter] = useState<string>('all');
    if (!textbookInfo) return (<div> TextbookInfo 가 없습니다. </div>)

    // 📊 카운트 및 시간 계산
    const majorCount = textbookInfo.majors.length;
    const middleCount = textbookInfo.majors.reduce((acc, major) =>
        acc + major.middles.length, 0);

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
    }[] = [];

    textbookInfo.majors.forEach(major => {
        major.middles.forEach(middle => {
            middle.units.forEach(unit => {
                if (unit.curriculums && unit.curriculums.length > 0) {
                    unit.curriculums.forEach(curriculum => {
                        curriculumList.push({
                            code: curriculum.code,
                            achievement_text: curriculum.achievement_text,
                            unit_id: unit.unit_id,
                            major_name: major.title,
                            unit_name: unit.title,
                            curriculum_id: curriculum.curriculum_id,
                            isChecked: curriculum.checklists.length > 0
                        });
                    });
                }
            });
        });
    });

    const fetcher = useFetcher()
    const handleCurriculumClick = (curriculum_id: number) => {

        void fetcher.submit({
            curriculum_id
        }, {
            method: "post",
            action: "/api/curriculums/toggle-curriculum",
        })
    }

    // 통계 데이터 배열
    const statsData: StatCardProps[] = [
        {
            icon: BookOpen,
            value: majorCount,
            label: '대단원',
            colorClass: { bg: 'bg-blue-100', text: 'text-blue-600' }
        },
        {
            icon: Hash,
            value: middleCount,
            label: '중단원',
            colorClass: { bg: 'bg-green-100', text: 'text-green-600' }
        },
        {
            icon: Target,
            value: unitCount,
            label: '소단원',
            colorClass: { bg: 'bg-purple-100', text: 'text-purple-600' }
        },
        {
            icon: BarChart,
            value: curriculumList.length,
            label: '성취기준',
            colorClass: { bg: 'bg-yellow-100', text: 'text-yellow-600' }
        },
        {
            icon: TrendingUp,
            value: formatTime(totalEstimatedSeconds),
            label: '소요시간',
            colorClass: { bg: 'bg-orange-100', text: 'text-orange-600' },
            className: 'col-span-1 sm:col-span-2 lg:col-span-1'

        }
    ];

    // 🔍 필터링된 curriculum 목록 - 대단원명으로 필터링
    const filteredCurriculumList = selectedFilter === 'all'
        ? curriculumList
        : curriculumList.filter(curriculum => curriculum.major_name === selectedFilter);

    // 📊 대단원별 카운트 - curriculumList의 major_name을 활용
    const majorNames = [...new Set(curriculumList.map(c => c.major_name))];
    const majorCounts: Record<string, number> = {
        all: curriculumList.length,
        ...majorNames.reduce((acc, majorName) => {
            acc[majorName] = curriculumList.filter(c => c.major_name === majorName).length;
            return acc;
        }, {} as Record<string, number>)
    };


    return (
        <div className=" p-3 h-[calc(100vh-64px)] overflow-y-scroll">
            <div className={"max-w-full"}>
                {/* 📊 통계 정보 카드들 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
                    {statsData.map((stat, index) => (
                        <StatCard key={index} {...stat} />
                    ))}
                </div>

                {/* 🎯 필터링 컨트롤 */}
                <Card className="border-0 shadow-none">
                    <CardContent className={"p-0 "}>
                        <Tabs value={selectedFilter} onValueChange={setSelectedFilter}
                              className={"w-full overflow-x-auto rounded-lg bg-muted"}>
                            {/* 모바일에서 스크롤 가능한 탭 */}
                            <TabsList
                                className="flex h-14 items-center justify-between text-muted-foreground w-full p-2">
                                <TabsTrigger
                                    value="all"
                                    className="cursor-pointer"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                        <span>전체</span>
                                        <div
                                            className=" flex items-center justify-center min-w-[20px] h-5 bg-blue-100  rounded-full text-xs font-semibold p-2">
                                            {majorCounts.all}
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
                                                    {majorCounts[majorName]}
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
                                        className={`cursor-pointer z-10 size-10 sm:size-8 absolute right-5 bottom-5 opacity-75 hover:size-12 transition-all${
                                            optimism ? 'opacity-10 animate-pulse'  : ''
                                        }`}
                                        checked={optimism ? !curriculum.isChecked : curriculum.isChecked}
                                    />

                                    <Tooltip>
                                        <TooltipTrigger className={"w-full h-full"}>
                                            <Card
                                                onClick={() => handleUnitClick(curriculum.unit_id)}
                                                className="hover:shadow-lg min-h-[200px] w-full">
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
                                                            <Badge variant="outline" className="font-mono">
                                                                {String(index + 1).padStart(2, '0')}
                                                            </Badge>
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
                                <CardTitle className="mb-2">해당 대단원의 성취기준이 없습니다</CardTitle>
                                <CardDescription>
                                    다른 대단원을 선택해보세요.
                                </CardDescription>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}

