'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, ArrowRight, Calendar } from 'lucide-react';
import { getWeeklyInsightById } from '@/lib/mock-service';

export default function WeeklyInsightDashboard() {
    // Mock History Data
    const history = [
        { id: 'week-6', week: 'Week 6 (Feb 02 - Feb 08)', status: 'draft', author: 'You', summary: 'Leadership summary pending...' },
        { id: 'week-5', week: 'Week 5 (Jan 26 - Feb 01)', status: 'submitted', author: 'You', summary: 'Strong KPI recovery in Spanish queues.' },
        { id: 'week-4', week: 'Week 4 (Jan 19 - Jan 25)', status: 'approved', author: 'You', summary: 'Q1 Training deployment successful.' },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Weekly Insights</h1>
                    <p className="text-muted-foreground">Manage and review operational reports.</p>
                </div>
                <Link href="/weekly-insight/new">
                    <Button className="btn-premium">
                        <Plus className="mr-2 h-4 w-4" />
                        New Insight Report
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {history.map((report) => (
                    <Card key={report.id} className="card-gradient hover:shadow-lg transition-all cursor-pointer">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <Badge variant={report.status === 'approved' ? 'default' : report.status === 'submitted' ? 'secondary' : 'outline'}>
                                    {report.status.toUpperCase()}
                                </Badge>
                                <span className="text-xs text-muted-foreground flex items-center">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    2026
                                </span>
                            </div>
                            <CardTitle className="mt-2 text-lg">{report.week}</CardTitle>
                            <CardDescription>By {report.author}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                {report.summary}
                            </p>
                            <Link href={`/weekly-insight/new?editId=${report.id}`}>
                                <Button variant="ghost" className="w-full text-primary hover:text-primary/80 group">
                                    {report.status === 'draft' ? 'Continue Editing' : 'View Report'}
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="rounded-lg border bg-slate-50 p-6 text-center">
                <h3 className="text-lg font-medium text-slate-900">Archive Access</h3>
                <p className="text-sm text-slate-500 mt-1 mb-4">Looking for reports from previous quarters?</p>
                <Button variant="outline">Access Archive</Button>
            </div>
        </div>
    );
}
