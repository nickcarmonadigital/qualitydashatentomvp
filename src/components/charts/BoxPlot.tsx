'use client';

import {
    ComposedChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    ErrorBar
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { calculateQuartiles } from '@/lib/lss/statistics';

interface BoxPlotProps {
    title: string;
    description?: string;
    data: number[]; // Raw values
    height?: number;
    unit?: string;
}

export function BoxPlot({ title, description, data, height = 200, unit = '' }: BoxPlotProps) {
    const q = calculateQuartiles(data);

    // Recharts doesn't native boxplot easily. 
    // We will visualize this using a simple specialized view for now:
    // A horizontal bar chart where we construct the "Box" and "Whiskers" visually.

    // Actually, for MVP, let's create a custom SVG visualization inside the responsive container
    // because constructing a Box Plot via Recharts composed charts is overly hacky.

    // Scale helper
    const range = q.max - q.min;
    const padding = range * 0.1; // 10% padding
    const domainMin = Math.floor(q.min - padding);
    const domainMax = Math.ceil(q.max + padding);
    const totalDomain = domainMax - domainMin;

    const toPercent = (val: number) => ((val - domainMin) / totalDomain) * 100;

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
            <CardContent>
                <div style={{ height: height, width: '100%' }} className="relative flex items-center justify-center border rounded-md bg-slate-50/50 min-w-0 overflow-hidden">
                    <div className="w-[90%] h-[100px] relative">
                        {/* Axis Label (Approximate) */}
                        <div className="absolute bottom-[-30px] w-full flex justify-between text-xs text-muted-foreground">
                            <span>{domainMin}{unit}</span>
                            <span>{Math.round(domainMin + totalDomain / 2)}{unit}</span>
                            <span>{domainMax}{unit}</span>
                        </div>

                        {/* Main Axis Line */}
                        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-slate-300"></div>

                        {/* Min Whisker */}
                        <div className="absolute top-1/2 h-[1px] bg-slate-800"
                            style={{ left: `${toPercent(q.min)}%`, width: `${toPercent(q.q1) - toPercent(q.min)}%` }} />
                        <div className="absolute top-[30%] bottom-[30%] w-[2px] bg-slate-800"
                            style={{ left: `${toPercent(q.min)}%` }} />

                        {/* Max Whisker */}
                        <div className="absolute top-1/2 h-[1px] bg-slate-800"
                            style={{ left: `${toPercent(q.q3)}%`, width: `${toPercent(q.max) - toPercent(q.q3)}%` }} />
                        <div className="absolute top-[30%] bottom-[30%] w-[2px] bg-slate-800"
                            style={{ left: `${toPercent(q.max)}%` }} />

                        {/* Box (Q1 to Q3) */}
                        <div className="absolute top-[20%] bottom-[20%] bg-blue-100 border-2 border-blue-600 rounded-sm flex items-center justify-center opacity-80"
                            style={{ left: `${toPercent(q.q1)}%`, width: `${toPercent(q.q3) - toPercent(q.q1)}%` }}>
                            {/* Median Line */}
                            <div className="h-full w-[2px] bg-blue-800 absolute"
                                style={{ left: `${((q.median - q.q1) / (q.q3 - q.q1)) * 100}%` }} />
                        </div>

                        {/* Labels */}
                        <div className="absolute top-[-25px] text-xs font-mono text-blue-600 -translate-x-1/2" style={{ left: `${toPercent(q.median)}%` }}>
                            Med: {q.median}
                        </div>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-5 gap-2 text-center text-xs">
                    <div className="p-2 bg-slate-100 rounded">Min: {q.min}</div>
                    <div className="p-2 bg-slate-100 rounded">Q1: {q.q1}</div>
                    <div className="p-2 bg-blue-100 font-bold rounded">Med: {q.median}</div>
                    <div className="p-2 bg-slate-100 rounded">Q3: {q.q3}</div>
                    <div className="p-2 bg-slate-100 rounded">Max: {q.max}</div>
                </div>
            </CardContent>
        </Card>
    );
}
