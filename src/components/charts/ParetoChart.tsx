'use client';

import {
    ComposedChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface ParetoDataPoint {
    name: string;
    count: number;
}

interface ParetoChartProps {
    title: string;
    description?: string;
    data: ParetoDataPoint[];
    height?: number;
}

export function ParetoChart({ title, description, data, height = 400 }: ParetoChartProps) {
    // 1. Sort data descending
    const sortedData = [...data].sort((a, b) => b.count - a.count);

    // 2. Calculate cumulative percentage
    const total = sortedData.reduce((sum, item) => sum + item.count, 0);
    let cumulativeCount = 0;

    const chartData = sortedData.map(item => {
        cumulativeCount += item.count;
        return {
            ...item,
            cumulativePercentage: Number(((cumulativeCount / total) * 100).toFixed(1))
        };
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
            <CardContent>
                <div style={{ height: height, width: '100%' }} className="min-w-0 overflow-hidden">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                            data={chartData}
                            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                        >
                            <CartesianGrid stroke="#f5f5f5" vertical={false} />
                            <XAxis
                                dataKey="name"
                                scale="band"
                                tick={{ fontSize: 12 }}
                            />
                            {/* Left Axis: Count */}
                            <YAxis
                                yAxisId="left"
                                orientation="left"
                                stroke="#8884d8"
                                label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }}
                            />
                            {/* Right Axis: Percentage */}
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                stroke="#ff7300"
                                domain={[0, 100]}
                                unit="%"
                            />
                            <Tooltip />
                            <Legend />
                            <Bar yAxisId="left" dataKey="count" barSize={40} fill="#413ea0" name="Frequency">
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill="#3b82f6" fillOpacity={0.8} />
                                ))}
                            </Bar>
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="cumulativePercentage"
                                stroke="#ff7300"
                                name="Cumulative %"
                                strokeWidth={2}
                                dot={{ r: 4 }}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
