import { describe, it, expect } from 'vitest';
import { calculateRSquared, calculateVSF, identifyTrend, calculateCorrelation, calculateHistogram, calculateQuartiles } from './statistics';

describe('LSS Statistics Engine', () => {

    describe('calculateRSquared', () => {
        it('should return 1 for perfect linear correlation', () => {
            const values = [10, 20, 30, 40, 50]; // y = 10x + 10
            const r2 = calculateRSquared(values);
            expect(r2).toBeCloseTo(1, 4);
        });

        it('should return 0 for insufficient data', () => {
            expect(calculateRSquared([10])).toBe(0);
            expect(calculateRSquared([])).toBe(0);
        });

        it('should return low value for random noise', () => {
            const values = [10, 50, 20, 90, 10];
            const r2 = calculateRSquared(values);
            expect(r2).toBeLessThan(0.6);
        });
    });

    describe('calculateVSF (Variation Safety Factor)', () => {
        it('should calculate correctly for standard dataset', () => {
            // Mean = 5, StdDev = ~3.16
            // VSF = (6 * 3.16) / 5 = ~3.79
            const values = [1, 3, 5, 7, 9];
            const vsf = calculateVSF(values);
            expect(vsf).toBeGreaterThan(3);
        });

        it('should handle zero mean gracefully', () => {
            expect(calculateVSF([-5, 5])).toBe(0); // mean is 0
        });
    });

    describe('identifyTrend', () => {
        it('should identify UP trend via regression', () => {
            const values = [10, 12, 11, 14, 15, 18, 20];
            expect(identifyTrend(values)).toBe('UP');
        });

        it('should identify DOWN trend via regression', () => {
            const values = [90, 85, 80, 82, 75, 70];
            expect(identifyTrend(values)).toBe('DOWN');
        });

        it('should identify UP trend via 7-point rule', () => {
            const values = [10, 11, 12, 13, 14, 15, 16];
            expect(identifyTrend(values)).toBe('UP');
        });

        it('should return NONE for flat/noisy data', () => {
            const values = [10, 50, 10, 50, 10, 50];
            expect(identifyTrend(values)).toBe('NONE');
        });
    });

    describe('calculateCorrelation', () => {
        it('should return high R2 for correlated X-Y data', () => {
            const points = [
                { x: 1, y: 10 },
                { x: 2, y: 20 },
                { x: 3, y: 30 }
            ];
            expect(calculateCorrelation(points)).toBeCloseTo(1, 4);
        });

        it('should return 0 for uncorrelated/flat data', () => {
            const points = [
                { x: 1, y: 10 },
                { x: 2, y: 10 },
                { x: 3, y: 10 }
            ];
            expect(calculateCorrelation(points)).toBe(0);
        });
    });

    describe('calculateHistogram', () => {
        it('should generate correct number of bins', () => {
            const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // 10 items -> sqrt(10) = 4 bins
            const bins = calculateHistogram(values);
            expect(bins.length).toBe(4);
        });

        it('should handle single value array', () => {
            const bins = calculateHistogram([5, 5, 5]);
            expect(bins.length).toBe(1);
            expect(bins[0].count).toBe(3);
        });
    });

    describe('calculateQuartiles', () => {
        it('should calculate correct 5-number summary', () => {
            const values = [1, 2, 3, 4, 5, 6, 7]; // Median 4, Q1 2, Q3 6
            const q = calculateQuartiles(values);
            expect(q.median).toBe(4);
            expect(q.min).toBe(1);
            expect(q.max).toBe(7);
        });
    });

});
