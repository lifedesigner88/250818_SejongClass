/*
GitHub-Grass-Component.tsx
React + Tailwind + shadcn UI component that displays a GitHub-style "contribution graph" (잔디)

This version includes mock example data so the component works without a backend.
*/

import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Day = { date: string; count: number };

function getLevel(count: number): number {
    if (count <= 0) return 0;
    if (count === 1) return 1;
    if (count <= 3) return 2;
    if (count <= 6) return 3;
    return 4;
}

// --- Example data generator ---
function generateMockDays(daysToShow: number): Day[] {
    const today = new Date();
    const days: Day[] = [];
    for (let i = daysToShow - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().slice(0, 10);
        // random counts 0-10
        const count = Math.floor(Math.random() * 10);
        days.push({ date: dateStr, count });
    }
    console.log(days)
    return days;
}

export default function GitHubGrass({
                                        daysToShow = 365,
                                        showLegend = true,
                                        useMockData = true,
                                    }: {
    daysToShow?: number;
    showLegend?: boolean;
    useMockData?: boolean;
}) {
    const [days, setDays] = useState<Day[] | null>(null);

    useEffect(() => {
        if (useMockData) {
            setDays(generateMockDays(daysToShow));
        } else {
            // placeholder: fetch real data
            setDays([]);
        }
    }, [daysToShow, useMockData]);

    const weeks = useMemo(() => {
        if (!days) return [] as Day[][];
        const dayMap = new Map(days.map((d) => [d.date, d]));

        const lastStr = days[days.length - 1]?.date;
        const last = lastStr ? new Date(lastStr + 'T00:00:00Z') : new Date();
        const end = new Date(Date.UTC(last.getUTCFullYear(), last.getUTCMonth(), last.getUTCDate()));

        const start = new Date(end);
        start.setUTCDate(end.getUTCDate() - (daysToShow - 1));

        const cols: Day[][] = [];
        let cur = new Date(start);
        while (cur.getUTCDay() !== 0) {
            cur.setUTCDate(cur.getUTCDate() - 1);
        }

        while (cur <= end) {
            const col: Day[] = [];
            for (let d = 0; d < 7; d++) {
                const key = cur.toISOString().slice(0, 10);
                const dd = dayMap.get(key) || { date: key, count: 0 };
                col.push(dd);
                cur = new Date(Date.UTC(cur.getUTCFullYear(), cur.getUTCMonth(), cur.getUTCDate() + 1));
            }
            cols.push(col);
        }
        return cols;
    }, [days, daysToShow]);

    return (
        <Card className="p-4">
            <div className="flex items-center justify-between mb-4 gap-2">
                <h3 className="text-lg font-medium">GitHub Contribution Grass (Example)</h3>
                <Button onClick={() => setDays(generateMockDays(daysToShow))}>Regenerate</Button>
            </div>

            {days && (
                <div className="flex gap-1 items-start overflow-x-auto">
                    {weeks.map((col, i) => (
                        <div key={i} className="grid grid-rows-7 gap-1">
                            {col.map((d) => {
                                const lvl = getLevel(d.count);
                                const title = `${d.date}: ${d.count} contribution${d.count === 1 ? '' : 's'}`;
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
                                        className={`w-4 h-4 rounded-sm ${bgClass} border border-white/30`}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            )}

            {showLegend && (
                <div className="mt-3 text-sm flex items-center gap-2">
                    <span className="text-xs">Less</span>
                    <div className="grid grid-cols-5 gap-1">
                        <div className="w-4 h-4 bg-gray-100 border rounded-sm" />
                        <div className="w-4 h-4 bg-green-200 border rounded-sm" />
                        <div className="w-4 h-4 bg-green-400 border rounded-sm" />
                        <div className="w-4 h-4 bg-green-600 border rounded-sm" />
                        <div className="w-4 h-4 bg-green-800 border rounded-sm" />
                    </div>
                    <span className="text-xs">More</span>
                </div>
            )}
        </Card>
    );
}
