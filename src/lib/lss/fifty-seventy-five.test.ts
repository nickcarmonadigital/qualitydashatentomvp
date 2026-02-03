import { describe, it, expect } from 'vitest';
import { analyze5075 } from './fifty-seventy-five';

describe('50/75 Rule Analysis', () => {

    describe('Higher is Better (e.g. CSAT)', () => {
        const target = 90;

        it('should identity INCAPABLE process (Median < Target)', () => {
            // Median ~85
            const values = [80, 82, 85, 87, 88];
            const result = analyze5075(values, target, true);
            expect(result.result).toBe('INCAPABLE');
            expect(result.median).toBeLessThan(target);
        });

        it('should identity INCONSISTENT process (Median > Target, but Q1 < Target)', () => {
            // Median 92 (Pass), but Q1 (85) < 90 (Fail)
            const values = [85, 86, 92, 95, 96];
            const result = analyze5075(values, target, true);
            expect(result.result).toBe('INCONSISTENT');
            expect(result.median).toBeGreaterThan(target);
        });

        it('should identity CAPABLE process (Median > Target, Q1 > Target)', () => {
            // All above 90
            const values = [91, 92, 93, 94, 95];
            const result = analyze5075(values, target, true);
            expect(result.result).toBe('CAPABLE');
        });
    });

    describe('Lower is Better (e.g. AHT)', () => {
        const target = 500;

        it('should identity INCAPABLE process (Median > Target)', () => {
            // Median 550 (Fail)
            const values = [520, 540, 550, 560, 580];
            const result = analyze5075(values, target, false);
            expect(result.result).toBe('INCAPABLE');
        });

        it('should identity INCONSISTENT process (Median < Target, but Q3 > Target)', () => {
            // Median 480 (Pass), but Q3 520 (Fail)
            const values = [400, 450, 480, 520, 530];
            const result = analyze5075(values, target, false);
            expect(result.result).toBe('INCONSISTENT');
        });

        it('should identity CAPABLE process (All < Target)', () => {
            // All below 500
            const values = [450, 460, 470, 480, 490];
            const result = analyze5075(values, target, false);
            expect(result.result).toBe('CAPABLE');
        });
    });

});
