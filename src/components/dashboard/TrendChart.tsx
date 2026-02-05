'use client';

import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import { calculateRSquared, identifyTrend } from '@/lib/lss/statistics';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DataPoint {
    date: string;
    value: number;
    target?: number;
}

interface TrendChartProps {
    title: string;
    data: DataPoint[];
    color?: string;
    height?: number;
    showTrendAnalysis?: boolean;
}

export function TrendChart({ title, data, color = "#2563eb", height = 300, showTrendAnalysis = false }: TrendChartProps) {
    // Calculate stats if enabled
    const values = data.map(d => d.value);
    const r2 = showTrendAnalysis ? calculateRSquared(values) : 0;
    const trend = showTrendAnalysis ? identifyTrend(values) : 'NONE';

    const chartId = `chart-${title.replace(/[^a-zA-Z0-9]/g, '-')}`;

    return (
        <Card className="min-w-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-normal">{title}</CardTitle>
                {showTrendAnalysis && trend !== 'NONE' && (
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs">
                            R²: {r2.toFixed(2)}
                        </Badge>
                        <Badge variant={trend === 'UP' ? 'default' : trend === 'DOWN' ? 'destructive' : 'secondary'}>
                            {trend}
                        </Badge>
                    </div>
                )}
            </CardHeader>
            <CardContent>
                <div style={{ height: height, width: '100%' }} className="min-w-0 overflow-hidden">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id={chartId} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="date"
                                tick={{ fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                                domain={['auto', 'auto']}
                            />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            {/* <Tooltip
                                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                itemStyle={{ color: '#1e293b' }}
                            /> */}
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke={color}
                                fillOpacity={1}
                                fill={`url(#${chartId})`}
                            />
                            {/* Optional: Add Target Reference Line here if needed */}
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
