import * as ss from 'simple-statistics';

/**
 * Calculates the R-Squared (Coefficient of Determination) for a linear trend.
 * Assumes x-values are sequential integers (0, 1, 2...) representing time/weeks.
 * 
 * @param values Array of numerical values (y-axis) ordered by time.
 * @returns R-Squared value (0 to 1). Returns 0 if not enough data.
 */
export const calculateRSquared = (values: number[]): number => {
    if (values.length < 2) return 0;

    const data = values.map((y, x) => [x, y]);
    const regressionLine = ss.linearRegression(data);
    const regressionrLineFunc = ss.linearRegressionLine(regressionLine);

    return ss.rSquared(data, regressionrLineFunc);
};

/**
 * Calculates the Variation Safety Factor (VSF).
 * Formula: (6 * Standard Deviation) / Average
 * 
 * @param values Array of numerical values.
 * @returns VSF value. Returns 0 if average is 0 or empty.
 */
export const calculateVSF = (values: number[]): number => {
    if (values.length < 2) return 0;

    const mean = ss.mean(values);
    if (mean === 0) return 0;

    const stdDev = ss.standardDeviation(values);

    // (6 * sigma) / mu
    return (6 * stdDev) / Math.abs(mean);
};

export type TrendResult = 'UP' | 'DOWN' | 'FLAT' | 'NONE';

/**
 * Identifies the direction of a trend if it is significant.
 * Uses slope of regression and checks if R2 is significant (> 0.5)
 * Also checks for 7-point run rule.
 */
export const identifyTrend = (values: number[]): TrendResult => {
    if (values.length < 3) return 'NONE';

    // 1. R-Squared Check for general direction
    const r2 = calculateRSquared(values);
    const data = values.map((y, x) => [x, y]);
    const { m } = ss.linearRegression(data); // m is slope

    if (r2 > 0.6) {
        if (Math.abs(m) < 0.05) return 'FLAT'; // Negligible slope
        return m > 0 ? 'UP' : 'DOWN';
    }

    // 2. 7 Points in a row rule (Strict LSS/Nelson Rule)
    if (values.length >= 7) {
        const last7 = values.slice(-7);
        const isUp = last7.every((val, i, arr) => i === 0 || val > arr[i - 1]);
        const isDown = last7.every((val, i, arr) => i === 0 || val < arr[i - 1]);

        if (isUp) return 'UP';
        if (isDown) return 'DOWN';
    }

    return 'NONE';
};

/**
 * Calculates R-Squared for arbitrary X-Y pairs (Correlation).
 * @param points Array of {x, y} objects.
 * @returns R-Squared value.
 */
export const calculateCorrelation = (points: { x: number, y: number }[]): number => {
    if (points.length < 2) return 0;

    const data = points.map(p => [p.x, p.y]);

    // Check for zero variance to avoid NaN
    const distinctX = new Set(points.map(p => p.x));
    const distinctY = new Set(points.map(p => p.y));
    if (distinctX.size < 2 || distinctY.size < 2) return 0;

    const regressionLine = ss.linearRegression(data);
    const regressionrLineFunc = ss.linearRegressionLine(regressionLine);

    return ss.rSquared(data, regressionrLineFunc);
};

export interface HistogramBin {
    range: string;
    min: number;
    max: number;
    count: number;
}

/**
 * Generates histogram data from raw values.
 * @param values Raw numerical data.
 * @param binCount Desired number of bins (default: Square root rule).
 */
export const calculateHistogram = (values: number[], binCount?: number): HistogramBin[] => {
    if (values.length === 0) return [];

    // Sort logic
    const sorted = [...values].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];

    if (min === max) {
        return [{ range: `${min}`, min, max, count: values.length }];
    }

    // Default bin count via Square Root rule if not provided
    const k = binCount || Math.ceil(Math.sqrt(values.length));
    const width = (max - min) / k;

    const bins: HistogramBin[] = [];

    for (let i = 0; i < k; i++) {
        const binMin = min + (i * width);
        const binMax = i === k - 1 ? max : binMin + width; // Ensure last bin catches max

        // Count values in this range
        const count = sorted.filter(v =>
            v >= binMin && (i === k - 1 ? v <= binMax : v < binMax)
        ).length;

        bins.push({
            range: `${Math.round(binMin)}-${Math.round(binMax)}`,
            min: binMin,
            max: binMax,
            count
        });
    }

    return bins;
};

export interface Quartiles {
    min: number;
    q1: number;
    median: number;
    q3: number;
    max: number;
}

/**
 * Calculates the Five-Number Summary for Box Plots.
 */
export const calculateQuartiles = (values: number[]): Quartiles => {
    if (values.length === 0) return { min: 0, q1: 0, median: 0, q3: 0, max: 0 };

    const min = ss.min(values);
    const max = ss.max(values);
    const median = ss.median(values);
    const q1 = ss.quantile(values, 0.25);
    const q3 = ss.quantile(values, 0.75);

    return { min, q1, median, q3, max };
};
