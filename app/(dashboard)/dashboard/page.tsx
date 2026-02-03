'use client';

import { useEffect, useState } from 'react';
import { KPICard } from '@/components/dashboard/KPICard';
import { TrendChart } from '@/components/dashboard/TrendChart';
import { getDashboardMetrics } from '@/lib/mock-service';

import { calculateVSF, identifyTrend } from '@/lib/lss/statistics';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<any[]>([]);

  useEffect(() => {
    const data = getDashboardMetrics();
    setMetrics(data);
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h2>
        <p className="text-muted-foreground">High-level overview of Quality Operations Performance.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const historyValues = metric.history.map((h: any) => h.value);
          const vsf = calculateVSF(historyValues);
          const trend = identifyTrend(historyValues);
          const trendProp = trend === 'UP' ? 'up' : trend === 'DOWN' ? 'down' : 'flat';

          return (
            <KPICard
              key={metric.id}
              title={metric.name}
              value={metric.currentValue}
              target={metric.target}
              unit={metric.unit}
              voiceType={metric.voice_type}
              trend={trendProp}
              vsf={vsf}
            />
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          {metrics.length > 0 && (
            <TrendChart
              title="Primary Metric Trend (Pass Rate)"
              data={metrics[0].history}
              color="#10b981" // Green
            />
          )}
        </div>
        <div className="col-span-3">
          {metrics.length > 1 && (
            <TrendChart
              title="Secondary Metric Trend (CSAT)"
              data={metrics[1].history}
              color="#3b82f6" // Blue
            />
          )}
        </div>
      </div>
    </div>
  );
}
