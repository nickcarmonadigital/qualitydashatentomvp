'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getMockData } from '@/lib/mock-service';
import { pickAuditTargets, AuditAssignment } from '@/lib/lss/audit-picker';
import { RefreshCcw, AlertCircle, Ticket } from 'lucide-react';

export default function AuditRandomizerPage() {
    const [assignments, setAssignments] = useState<AuditAssignment[]>([]);

    const generateAssignments = () => {
        const { agents } = getMockData();
        const picks = pickAuditTargets(agents, 3);
        setAssignments(picks);
    };

    useEffect(() => {
        generateAssignments();
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h2 className="text-3xl font-bold tracking-tight">Audit Randomizer</h2>
                        <Badge variant="secondary" className="text-sm px-3 py-1">
                            DEMO FEATURE
                        </Badge>
                    </div>
                    <p className="text-muted-foreground">
                        Random ticket/call selector for quality audits
                    </p>
                </div>
                <Button onClick={generateAssignments}>
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    Regenerate
                </Button>
            </div>

            {/* Disclaimer */}
            <div className="border-l-4 border-amber-500 bg-amber-50 p-4 rounded-r">
                <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm text-amber-900 font-medium">Enterprise Feature</p>
                        <p className="text-sm text-amber-800">
                            This feature is available for contracts that permit client data integration.
                            Not currently enabled for TikTok contract.
                        </p>
                    </div>
                </div>
            </div>

            {/* How it Works */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">How It Works</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p>1. <strong>Identifies bottom quartile agents</strong> based on QA scores</p>
                    <p>2. <strong>Randomly selects 2-3 support tickets/calls</strong> from each agent</p>
                    <p>3. <strong>QA audits the specific tickets</strong> for quality compliance</p>
                    <p>4. <strong>Prevents bias</strong> by randomizing selection (agents can't cherry-pick)</p>
                </CardContent>
            </Card>

            {/* Audit Assignments */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Audit Assignments</h3>
                <div className="grid gap-4">
                    {assignments.map((assignment, idx) => (
                        <Card key={idx} className="border-2">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-semibold text-lg">{assignment.agent.name}</h4>
                                        <p className="text-sm text-muted-foreground">{assignment.agent.team}</p>
                                    </div>
                                    <Badge
                                        variant={assignment.reason === 'Bottom Quartile' ? 'destructive' : 'secondary'}
                                        className="text-sm"
                                    >
                                        {assignment.reason}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground mb-3">
                                        Tickets/Calls to Audit:
                                    </p>
                                    {assignment.ticketsToAudit.map((ticket, ticketIdx) => (
                                        <div
                                            key={ticketIdx}
                                            className="flex items-center justify-between bg-slate-50 p-3 rounded border hover:bg-slate-100 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Ticket className="w-4 h-4 text-muted-foreground" />
                                                <div>
                                                    <p className="font-mono text-sm font-medium">{ticket.ticketId}</p>
                                                    <p className="text-xs text-muted-foreground">{ticket.category}</p>
                                                </div>
                                            </div>
                                            <span className="text-xs text-muted-foreground">{ticket.timestamp}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Export Placeholder */}
            <Card className="bg-slate-50">
                <CardContent className="pt-6">
                    <div className="text-center text-sm text-muted-foreground">
                        <p>In production, you would export this list to your QA team or integrate with your ticketing system.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
