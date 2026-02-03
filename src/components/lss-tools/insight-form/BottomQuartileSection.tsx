'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Agent } from '@/types/domain';
import { getMockData } from '@/lib/mock-service';
import { pickAuditTargets, AuditPickResult } from '@/lib/lss/audit-picker';
import { RefreshCcw, CheckCircle } from 'lucide-react';

export function BottomQuartileSection() {
    const [suggestions, setSuggestions] = useState<AuditPickResult[]>([]);

    const generateSuggestions = () => {
        const { agents } = getMockData();
        const picks = pickAuditTargets(agents, 3);
        setSuggestions(picks);
    };

    useEffect(() => {
        generateSuggestions();
    }, []);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Audit Picker Tool */}
                <Card className="bg-slate-50 border-slate-200">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold flex justify-between items-center">
                            <span>Audit Picker (Randomizer)</span>
                            <Button variant="ghost" size="sm" onClick={generateSuggestions}>
                                <RefreshCcw className="h-4 w-4 mr-2" />
                                Reroll
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {suggestions.map((pick, idx) => (
                                <div key={idx} className="flex items-center justify-between bg-white p-3 rounded border">
                                    <div>
                                        <div className="font-medium">{pick.agent.name}</div>
                                        <div className="text-xs text-muted-foreground">{pick.agent.team}</div>
                                    </div>
                                    <Badge variant={pick.reason === 'Low Performance' ? 'destructive' : 'secondary'}>
                                        {pick.reason}
                                    </Badge>
                                </div>
                            ))}
                            <div className="pt-2 text-xs text-slate-500 text-center">
                                * These agents have been flagged for unofficial monitoring.
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Right: Analysis Input */}
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold mb-2">Bottom Quartile Analysis</h4>
                        <p className="text-sm text-slate-500 mb-2">Summarize the common themes found in the audits above.</p>
                        <Textarea
                            placeholder="e.g. 'Both low performers struggled with the new Refund Flow. Coaching delivered on the spot.'"
                            className="h-48"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
