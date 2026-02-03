'use client';

import { Textarea } from '@/components/ui/textarea';

export function BottomQuartileSection() {
    return (
        <div className="space-y-4">
            <div>
                <h4 className="font-semibold mb-2">Bottom Quartile Analysis</h4>
                <p className="text-sm text-slate-500 mb-2">
                    Summarize the common themes and patterns observed in bottom quartile performers.
                </p>
                <Textarea
                    placeholder="e.g. 'Low performers struggled with the new Refund Flow. Coaching delivered on the spot. Two agents showed improvement after one-on-one sessions.'"
                    className="min-h-[200px]"
                />
            </div>

            <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r">
                <p className="text-sm text-blue-900">
                    <strong>Note:</strong> For audit randomization features, visit the{' '}
                    <a href="/lss-tools/audit-randomizer" className="underline font-medium">
                        Audit Randomizer tool
                    </a>{' '}
                    in LSS Tools (available for select contracts only).
                </p>
            </div>
        </div>
    );
}
