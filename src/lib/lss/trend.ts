import { TrendDirection } from '@/types/domain';

// Simple Statistics Helper using 'simple-statistics' (installed in deps)
// For now, implementing manual logic to be dependency-lite if needed, 
// but we'll stick to the "3 Point Rule" focus.

export const determineTrend = (values: number[]): TrendDirection => {
    if (values.length < 3) return TrendDirection.UNDEFINED;

    const last3 = values.slice(-3);

    // 3-Point Rule: 3 consecutive points strictly increasing
    if (last3[0] < last3[1] && last3[1] < last3[2]) {
        return TrendDirection.UP;
    }

    // 3-Point Rule: 3 consecutive points strictly decreasing
    if (last3[0] > last3[1] && last3[1] > last3[2]) {
        return TrendDirection.DOWN;
    }

    return TrendDirection.FLAT;
};


export const calculateR2 = (x: number[], y: number[]): number => {
    // Placeholder R2 calc for now
    // In Phase 4 we will use simple-statistics for robust math
    return 0.6; // Mock "Correlated"
};
