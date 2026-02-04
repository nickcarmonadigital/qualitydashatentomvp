import { calculateQuartiles } from './statistics';

export type Rule5075Result = 'CAPABLE' | 'INCAPABLE' | 'INCONSISTENT';

// Legacy/Standard Six Sigma Analysis
interface AnalysisResult {
    result: Rule5075Result;
    median: number;
    target: number;
    gap: number; // Difference between Median and Target
    quartiles: { q1: number, q3: number };
}

// New Annual Trend Analysis (User Defined)
export interface AnnualTrendResult {
    compliance: {
        pass: boolean;
        monthsMet: number; // e.g. 5 out of 6
        totalMonths: number;
    };
    improvement: {
        pass: boolean;
        firstHalfAvg: number;
        secondHalfAvg: number;
        trend: number; // positive or negative diff
    };
    monthlyValues: { month: string, value: number, metTarget: boolean }[];
}

export interface WeeklyMonitorResult {
    weeks: { week: string, value: number, metTarget: boolean }[];
    mtdAverage: number;
    status: 'On Track' | 'At Risk' | 'Intervention Required';
}

/**
 * Analyzes performance data against the 50/75 Rule.
 * Standard Six Sigma Quartile Analysis.
 */
export const analyze5075 = (values: number[], target: number, higherIsBetter: boolean = true): AnalysisResult => {
    const q = calculateQuartiles(values);

    if (higherIsBetter) {
        // Median < Target = Incapable
        if (q.median < target) return { result: 'INCAPABLE', median: q.median, target, gap: target - q.median, quartiles: { q1: q.q1, q3: q.q3 } };
        // Q1 < Target = Inconsistent
        if (q.q1 < target) return { result: 'INCONSISTENT', median: q.median, target, gap: 0, quartiles: { q1: q.q1, q3: q.q3 } };
        return { result: 'CAPABLE', median: q.median, target, gap: 0, quartiles: { q1: q.q1, q3: q.q3 } };
    } else {
        // Lower is Better
        if (q.median > target) return { result: 'INCAPABLE', median: q.median, target, gap: q.median - target, quartiles: { q1: q.q1, q3: q.q3 } };
        if (q.q3 > target) return { result: 'INCONSISTENT', median: q.median, target, gap: 0, quartiles: { q1: q.q1, q3: q.q3 } };
        return { result: 'CAPABLE', median: q.median, target, gap: 0, quartiles: { q1: q.q1, q3: q.q3 } };
    }
};

/**
 * Analyzes 6-month historical trend.
 * Rule 1: 75% Compliance (Met target in >= 75% of months)
 * Rule 2: Consistent Improvement (Avg of last 3 months > Avg of first 3 months)
 */
export const analyzeAnnualTrend = (
    monthlyData: { month: string, value: number }[], // Expects sorted chronological (oldest to newest)
    target: number,
    higherIsBetter: boolean = true
): AnnualTrendResult => {
    // Take last 6 months
    const data = monthlyData.slice(-6);

    // 1. Compliance Rule
    let monthsMet = 0;
    const details = data.map(d => {
        const met = higherIsBetter ? d.value >= target : d.value <= target;
        if (met) monthsMet++;
        return { ...d, metTarget: met };
    });

    const compliancePass = (monthsMet / Math.max(data.length, 1)) >= 0.75; // >= 75%

    // 2. Improvement Rule
    // Split into halves
    const half = Math.floor(data.length / 2);
    const firstHalf = data.slice(0, half);
    const secondHalf = data.slice(half);

    const avg = (arr: any[]) => arr.reduce((a, b) => a + b.value, 0) / Math.max(arr.length, 1);

    const firstHalfAvg = avg(firstHalf);
    const secondHalfAvg = avg(secondHalf);

    let improvementPass = false;
    // Improvement means getting BETTER.
    if (higherIsBetter) {
        improvementPass = secondHalfAvg > firstHalfAvg;
    } else {
        improvementPass = secondHalfAvg < firstHalfAvg; // Lower is better
    }

    return {
        compliance: {
            pass: compliancePass,
            monthsMet,
            totalMonths: data.length
        },
        improvement: {
            pass: improvementPass,
            firstHalfAvg,
            secondHalfAvg,
            trend: secondHalfAvg - firstHalfAvg
        },
        monthlyValues: details
    };
};

/**
 * Analyzes current month weekly performance.
 */
export const analyzeWeeklyMonitor = (
    weeklyData: { week: string, value: number }[], // Chronological
    target: number,
    higherIsBetter: boolean = true
): WeeklyMonitorResult => {
    const details = weeklyData.map(d => ({
        ...d,
        metTarget: higherIsBetter ? d.value >= target : d.value <= target
    }));

    const mtdAverage = weeklyData.reduce((a, b) => a + b.value, 0) / Math.max(weeklyData.length, 1);

    // Status Logic
    // If MTD Average is failing -> At Risk
    // If last 2 weeks failed -> Intervention Required
    let status: WeeklyMonitorResult['status'] = 'On Track';

    const mtdFailing = higherIsBetter ? mtdAverage < target : mtdAverage > target;

    if (mtdFailing) {
        status = 'At Risk';
    }

    // Check last 2 weeks
    if (weeklyData.length >= 2) {
        const last2 = weeklyData.slice(-2);
        const bothFailed = last2.every(w => higherIsBetter ? w.value < target : w.value > target);
        if (bothFailed) {
            status = 'Intervention Required';
        }
    }

    return {
        weeks: details,
        mtdAverage,
        status
    };
}
