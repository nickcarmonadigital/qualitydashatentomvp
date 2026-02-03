'use client';

import { Textarea } from '@/components/ui/textarea';

export interface LeadershipSummaryProps {
    value: string;
    onChange: (value: string) => void;
}

export function LeadershipSummarySection({ value, onChange }: LeadershipSummaryProps) {
    return (
        <div className="space-y-6">
            <div className="bg-green-50 p-4 rounded-md border border-green-100 text-sm text-green-800">
                <strong>Executive Summary:</strong> This will be the first thing leadership reads. Keep it high-level and actionable.
            </div>

            <div className="space-y-2">
                <label className="font-semibold">Weekly Highlights & Key Actions</label>
                <Textarea
                    placeholder="e.g. 'Overall quality improved by 2% due to robust coaching on the new process. Focus next week is on AHT reduction.'"
                    className="h-64 text-base"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            </div>
        </div>
    );
}
