'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getActionPlanById } from '@/lib/mock-service';
import { ActionPlan } from '@/types/domain';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Calendar, User, CheckCircle, AlertTriangle, HelpCircle } from 'lucide-react';

// Extended type for UI
interface ActionPlanDetail extends ActionPlan {
    ownerName: string;
}

export default function ActionPlanDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [plan, setPlan] = useState<ActionPlanDetail | null>(null);

    useEffect(() => {
        if (params.id) {
            const data = getActionPlanById(params.id as string);
            if (data) {
                setPlan(data);
            }
        }
    }, [params.id]);

    if (!plan) return <div className="p-8">Loading...</div>;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'closed': return 'secondary';
            case 'in_progress': return 'default';
            default: return 'outline';
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <Button variant="ghost" onClick={() => router.back()} className="mb-4 pl-0 hover:bg-transparent hover:underline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Action Plans
                </Button>
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Badge variant={getStatusColor(plan.status)} className="text-sm px-3 py-1">
                                {plan.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                            <span className="text-sm text-muted-foreground font-mono">ID: {plan.id}</span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight mb-2">{plan.title}</h1>
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Owner: <span className="font-medium text-foreground">{plan.ownerName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Due: <span className="font-medium text-foreground">{plan.due_date}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/action-plans/${plan.id}/edit`}>Edit Plan</Link>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2 space-y-6 border-none shadow-none bg-transparent">
                    <Card className="border-l-4 border-l-red-500">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <AlertTriangle className="h-5 w-5 text-red-500" />
                                Problem Statement
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="leading-relaxed text-slate-700">{plan.problem_statement}</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-orange-500">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <HelpCircle className="h-5 w-5 text-orange-500" />
                                Root Cause (5 Whys Analysis)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="leading-relaxed text-slate-700">{plan.root_cause}</p>
                            <div className="mt-4 pt-4 border-t">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Causal Category</span>
                                <Badge variant="secondary" className="ml-2">{plan.causal_category}</Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-green-500">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                Proposed Correction
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="leading-relaxed text-slate-700">{plan.correction}</p>
                        </CardContent>
                    </Card>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Plan Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <div className="text-sm font-medium mb-1">Assigned Owner</div>
                                <div className="flex items-center gap-2 p-2 rounded-md bg-slate-50 border">
                                    <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
                                        <User className="h-4 w-4 text-slate-500" />
                                    </div>
                                    <div className="text-sm">
                                        <div className="font-medium">{plan.ownerName}</div>
                                        <div className="text-xs text-muted-foreground">Owner</div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="ml-auto" asChild>
                                        <Link href={`/agents/${plan.owner_id}`}>View</Link>
                                    </Button>
                                </div>
                            </div>

                            <div className="pt-4 border-t">
                                <div className="text-sm font-medium mb-2">Timeline</div>
                                <div className="relative pl-4 border-l-2 border-slate-200 space-y-6">
                                    <div className="relative">
                                        <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-blue-500 ring-4 ring-white" />
                                        <div className="text-sm font-medium">Created</div>
                                        <div className="text-xs text-muted-foreground">Jan 15, 2026</div>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-slate-200 ring-4 ring-white" />
                                        <div className="text-sm font-medium text-slate-500">Target Due Date</div>
                                        <div className="text-xs text-muted-foreground">{plan.due_date}</div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
