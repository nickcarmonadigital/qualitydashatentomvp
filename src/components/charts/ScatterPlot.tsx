'use client';

import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ZAxis
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { calculateCorrelation } from '@/lib/lss/statistics';
import { Badge } from '@/components/ui/badge';

interface ScatterPoint {
    x: number;
    y: number;
    label?: string;
}

interface ScatterPlotProps {
    title: string;
    description?: string;
    data: ScatterPoint[];
    xLabel?: string;
    yLabel?: string;
    height?: number;
}

export function ScatterPlot({ title, description, data, xLabel, yLabel, height = 400 }: ScatterPlotProps) {
    const r2 = calculateCorrelation(data);
    const isCorrelated = r2 > 0.5;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-base font-medium">{title}</CardTitle>
                    {description && <p className="text-sm text-muted-foreground">{description}</p>}
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono">
                        R²: {r2.toFixed(2)}
                    </Badge>
                    <Badge variant={isCorrelated ? "default" : "secondary"}>
                        {isCorrelated ? "Correlated" : "Weak Signal"}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div style={{ height: height, width: '100%' }} className="min-w-0 overflow-hidden">
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                type="number"
                                dataKey="x"
                                name={xLabel || "X-Axis"}
                                unit=""
                                tickLine={false}
                                axisLine={false}
                                label={{ value: xLabel, position: 'insideBottom', offset: -10 }}
                            />
                            <YAxis
                                type="number"
                                dataKey="y"
                                name={yLabel || "Y-Axis"}
                                unit=""
                                tickLine={false}
                                axisLine={false}
                                label={{ value: yLabel, angle: -90, position: 'insideLeft' }}
                            />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                            <Scatter name={title} data={data} fill="#8884d8" />
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
