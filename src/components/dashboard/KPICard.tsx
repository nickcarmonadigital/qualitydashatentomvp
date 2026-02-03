'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';

interface KPICardProps {
    title: string;
    value: number;
    target: number;
    unit: '%' | '#' | 'Currency';
    trend?: 'up' | 'down' | 'flat';
    delta?: number; // Change from previous period
    voiceType?: string; // VoC, VoP, etc.
    vsf?: number; // Variation Safety Factor (LSS)
}

export function KPICard({ title, value, target, unit, trend, delta, voiceType, vsf }: KPICardProps) {
    // Determine status color based on target
    // Assuming higher is better for %, lower better for AHT (need logic flag in real app)
    // For MVP default: Higher is Green
    const isPositive = value >= target;
    const statusColor = isPositive ? 'text-green-600' : 'text-red-600';

    return (
        <Card className="metric-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {title}
                    {voiceType && (
                        <span className="ml-2 text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                            {voiceType}
                        </span>
                    )}
                </CardTitle>
                {trend === 'up' && <ArrowUp className="h-4 w-4 text-green-500" />}
                {trend === 'down' && <ArrowDown className="h-4 w-4 text-red-500" />}
                {trend === 'flat' && <Minus className="h-4 w-4 text-slate-500" />}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {unit === 'Currency' ? '$' : ''}{value}{unit === '%' ? '%' : ''}
                </div>
                <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted-foreground">
                        Target: {target}{unit}
                        <span className={cn("ml-2 font-medium", statusColor)}>
                            ({(value - target).toFixed(1)} {unit})
                        </span>
                    </p>
                    {vsf !== undefined && (
                        <div className={cn(
                            "text-xs font-mono px-1.5 py-0.5 rounded border",
                            vsf > 1.0 ? "bg-red-50 text-red-700 border-red-200" : "bg-green-50 text-green-700 border-green-200"
                        )} title="Variation Safety Factor (Goal: < 1.0)">
                            VSF: {vsf.toFixed(2)}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
