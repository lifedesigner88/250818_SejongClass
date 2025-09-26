import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { DateTime } from 'luxon';

export type GitGressDay = { date: string; count: number };

function getLevel(count: number): number {
    if (count <= 0) return 0;
    if (count === 1) return 1;
    if (count <= 3) return 2;
    if (count <= 6) return 3;
    return 4;
}

export default function GitHubGrass({
                                        showLegend = true,
                                        showYear,
                                        dayMap
                                    }: {
    showLegend?: boolean;
    showYear: number;
    dayMap: Map<string, GitGressDay>;
}) {

    const year = DateTime.fromObject({ year: showYear })
    const startDay = DateTime.fromObject({ year: showYear, month: 1, day: 1 }).setZone('Asia/Seoul')
    const endDay = DateTime.fromObject({ year: showYear, month: 12, day: 31 }).setZone('Asia/Seoul')

    const forStartWeekDaySub = startDay.weekday === 7 ? 0 : startDay.weekday;
    const forEndWeekDayPlus = endDay.weekday === 6 ? 0 : 6 - endDay.weekday;

    const StartWeekDay = startDay.minus({ days: forStartWeekDaySub }); // 마지막 일요일
    const endWeekDay = endDay.plus({ days: forEndWeekDayPlus }); // 마지막 토요일

    const daysToShow = year.daysInYear

    // 렌더링할 데이터 weeks
    const weeks = useMemo(() => {
        if (!dayMap) return [] as GitGressDay[][];

        const cols: GitGressDay[][] = [];

        let targetDay = StartWeekDay
        while (targetDay <= endWeekDay) {
            const col: GitGressDay[] = [];
            for (let d = 0; d < 7; d++) {
                const key = targetDay.toISODate()!
                const dd = dayMap.get(key) || { date: key, count: 0 };
                col.push(dd);
                targetDay = targetDay.plus({ day: 1 });
            }
            cols.push(col);
        }
        return cols;
    }, [dayMap, daysToShow]);

    return (
        <Card className="p-4 border-0 shadow-none">
            {dayMap && (
                <div className="flex gap-1 items-start justify-center max-w-screen overflow-x-auto">
                    {weeks.map((col, i) => (
                        <div key={i} className="grid grid-rows-7 gap-1">
                            {col.map((d) => {
                                const lvl = getLevel(d.count);
                                const title = `${d.date}: ${d.count} 개 활동`;
                                const bgClass = [
                                    'bg-gray-100',
                                    'bg-green-200',
                                    'bg-green-400',
                                    'bg-green-600',
                                    'bg-green-800',
                                ][lvl];

                                return (
                                    <div
                                        key={d.date}
                                        title={title}
                                        className={`w-4 h-4 rounded-xs ${bgClass} `}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            )}

            {showLegend && (
                <div className="mt-2 text-sm flex items-center justify-center gap-2">
                    <span className="text-xs">Less</span>
                    <div className="grid grid-cols-5 gap-1">
                        <div className="w-4 h-4 bg-gray-100 rounded-xs"/>
                        <div className="w-4 h-4 bg-green-200 rounded-xs"/>
                        <div className="w-4 h-4 bg-green-400 rounded-xs"/>
                        <div className="w-4 h-4 bg-green-600 rounded-xs"/>
                        <div className="w-4 h-4 bg-green-800 rounded-xs"/>
                    </div>
                    <span className="text-xs">More</span>
                </div>
            )}
        </Card>
    );
}
