import { getKPIs, getScores, getAgents } from '@/lib/mock-service';
import { calculateVSF } from '@/lib/lss/statistics';
import { KPI, Score, Agent } from '@/types/domain';

export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO';

export interface SystemAlert {
    id: string;
    title: string;
    message: string;
    severity: AlertSeverity;
    timestamp: Date;
    type: 'PERFORMANCE' | 'VARIATION';
}

export const generateSystemAlerts = (): SystemAlert[] => {
    const alerts: SystemAlert[] = [];
    const kpis = getKPIs();
    const scores = getScores();

    // 1. Analyze KPI Performance (Global)
    kpis.forEach(kpi => {
        // Get latest scores for this KPI (Mock: assume last week's data exists)
        const kpiScores = scores.filter(s => s.kpi_id === kpi.id);
        if (kpiScores.length === 0) return;

        // Sort by date to get 'current' window
        const latestDate = kpiScores.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date;
        const currentScores = kpiScores.filter(s => s.date === latestDate);

        // Performance Check (Average vs Target)
        const sum = currentScores.reduce((acc, s) => acc + s.value, 0);
        const avg = sum / currentScores.length;
        const isFailure = kpi.name === 'AHT' ? avg > kpi.target : avg < kpi.target;

        if (isFailure) {
            alerts.push({
                id: `perf-${kpi.id}`,
                title: `${kpi.name} Target Breach`,
                message: `Current Performance (${avg.toFixed(1)}) is failing target (${kpi.target}).`,
                severity: 'CRITICAL',
                timestamp: new Date(),
                type: 'PERFORMANCE'
            });
        }

        // Variation Check (VSF)
        const values = currentScores.map(s => s.value);
        const vsf = calculateVSF(values);
        if (vsf > 1.0) {
            alerts.push({
                id: `var-${kpi.id}`,
                title: `High Variation in ${kpi.name}`,
                message: `VSF is ${vsf.toFixed(2)} (> 1.0). Process is unstable.`,
                severity: 'WARNING',
                timestamp: new Date(),
                type: 'VARIATION'
            });
        }
    });

    return alerts;
};
