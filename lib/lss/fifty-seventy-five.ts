import { calculateQuartiles } from './statistics';

export type Rule5075Result = 'CAPABLE' | 'INCAPABLE' | 'INCONSISTENT';

interface AnalysisResult {
    result: Rule5075Result;
    median: number;
    target: number;
    gap: number; // Difference between Median and Target
    quartiles: { q1: number, q3: number };
}

/**
 * Analyzes performance data against the 50/75 Rule.
 * 
 * Logic (Assuming High is Better):
 * 1. Calculate Median (50th percentile).
 * 2. If Median < Target: INCAPABLE (The process mean is shifted; need to improve average performance).
 * 3. If Median >= Target:
 *    - Check 25th Percentile (Q1). 
 *    - If Q1 < Target: INCONSISTENT (The process is capable on average, but variance causes failures).
 *    - If Q1 >= Target: CAPABLE (Reliable).
 * 
 * @param values Array of performance values.
 * @param target The performance goal.
 * @param higherIsBetter Default true. Set false for metrics like AHT where lower is better.
 */
export const analyze5075 = (values: number[], target: number, higherIsBetter: boolean = true): AnalysisResult => {
    const q = calculateQuartiles(values);

    if (higherIsBetter) {
        // Higher is Better Logic (e.g., CSAT)

        // 1. Check Capability (Median vs Target)
        if (q.median < target) {
            return {
                result: 'INCAPABLE',
                median: q.median,
                target,
                gap: target - q.median,
                quartiles: { q1: q.q1, q3: q.q3 }
            };
        }

        // 2. Check Consistency (Q1 vs Target) -> If bottom 25% fails, it's inconsistent
        if (q.q1 < target) {
            return {
                result: 'INCONSISTENT',
                median: q.median,
                target,
                gap: 0, // No gap in median
                quartiles: { q1: q.q1, q3: q.q3 }
            };
        }

        return {
            result: 'CAPABLE',
            median: q.median,
            target,
            gap: 0,
            quartiles: { q1: q.q1, q3: q.q3 }
        };

    } else {
        // Lower is Better Logic (e.g., AHT)

        // 1. Check Capability
        if (q.median > target) {
            return {
                result: 'INCAPABLE',
                median: q.median,
                target,
                gap: q.median - target,
                quartiles: { q1: q.q1, q3: q.q3 }
            };
        }

        // 2. Check Consistency (Q3 vs Target) -> If top 25% (highest times) fails, inconsistent
        if (q.q3 > target) {
            return {
                result: 'INCONSISTENT',
                median: q.median,
                target,
                gap: 0,
                quartiles: { q1: q.q1, q3: q.q3 }
            };
        }

        return {
            result: 'CAPABLE',
            median: q.median,
            target,
            gap: 0,
            quartiles: { q1: q.q1, q3: q.q3 }
        };
    }
};
