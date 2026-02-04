'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getManagerDashboardData } from '@/lib/mock-service';
import { CoachingSession, Agent } from '@/types/domain';
import {
    ShieldCheck,
    AlertTriangle,
    TrendingUp,
    TrendingDown,
    Users,
    Clock,
    Bell,
    ArrowRight,
    CheckCircle2,
    XCircle
} from 'lucide-react';

interface ManagerDashboard {
    stats: {
        totalSessions: number;
        pendingReview: number;
        autoTriggered: number;
        improved: number;
        declined: number;
    };
    pendingSessions: CoachingSession[];
    recentSessions: CoachingSession[];
    agents: Agent[];
}

export default function ManagerDashboardPage() {
    const [data, setData] = useState<ManagerDashboard | null>(null);

    useEffect(() => {
        const dashboardData = getManagerDashboardData();
        setData(dashboardData as ManagerDashboard);
    }, []);

    if (!data) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Loading manager dashboard...</p>
            </div>
        );
    }

    const getAgentName = (agentId: string) => {
        return data.agents.find(a => a.id === agentId)?.name || 'Unknown';
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                        <ShieldCheck className="h-8 w-8 text-primary" />
                        Manager Dashboard
                    </h2>
                    <p className="text-muted-foreground">Monitor coaching activities and agent performance</p>
                </div>
                <Link href="/coaching">
                    <Button variant="outline">View All Sessions</Button>
                </Link>
            </div>

            {/* Alert Banner for Pending Reviews */}
            {data.stats.pendingReview > 0 && (
                <div className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Bell className="h-6 w-6 text-amber-600 animate-pulse" />
                        <div>
                            <p className="font-semibold text-amber-800">
                                {data.stats.pendingReview} session{data.stats.pendingReview > 1 ? 's' : ''} require your attention
                            </p>
                            <p className="text-sm text-amber-600">Auto-triggered coaching sessions pending review</p>
                        </div>
                    </div>
                    <Link href="/coaching?filter=follow_up_required">
                        <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                            Review Now <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <Link href="/coaching" className="block">
                    <Card className="metric-card bg-gradient-to-br from-slate-50 to-slate-100 cursor-pointer hover:shadow-md transition-all">
                        <CardContent className="p-4">
                            <div className="flex flex-col items-center gap-2 text-center">
                                <Users className="h-8 w-8 text-slate-600" />
                                <p className="text-3xl font-bold text-slate-700">{data.stats.totalSessions}</p>
                                <p className="text-xs text-slate-500">Total Sessions</p>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/coaching?filter=follow_up_required" className="block">
                    <Card className="metric-card bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 cursor-pointer hover:shadow-md transition-all">
                        <CardContent className="p-4">
                            <div className="flex flex-col items-center gap-2 text-center">
                                <Clock className="h-8 w-8 text-amber-600" />
                                <p className="text-3xl font-bold text-amber-700">{data.stats.pendingReview}</p>
                                <p className="text-xs text-amber-600">Pending Review</p>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/coaching?filter=auto_generated" className="block">
                    <Card className="metric-card bg-gradient-to-br from-red-50 to-red-100 border-red-200 cursor-pointer hover:shadow-md transition-all">
                        <CardContent className="p-4">
                            <div className="flex flex-col items-center gap-2 text-center">
                                <AlertTriangle className="h-8 w-8 text-red-600" />
                                <p className="text-3xl font-bold text-red-700">{data.stats.autoTriggered}</p>
                                <p className="text-xs text-red-600">Auto-Triggered</p>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/coaching?filter=improved" className="block">
                    <Card className="metric-card bg-gradient-to-br from-green-50 to-green-100 border-green-200 cursor-pointer hover:shadow-md transition-all">
                        <CardContent className="p-4">
                            <div className="flex flex-col items-center gap-2 text-center">
                                <TrendingUp className="h-8 w-8 text-green-600" />
                                <p className="text-3xl font-bold text-green-700">{data.stats.improved}</p>
                                <p className="text-xs text-green-600">Improved</p>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/coaching?filter=declined" className="block">
                    <Card className="metric-card bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200 cursor-pointer hover:shadow-md transition-all">
                        <CardContent className="p-4">
                            <div className="flex flex-col items-center gap-2 text-center">
                                <TrendingDown className="h-8 w-8 text-rose-600" />
                                <p className="text-3xl font-bold text-rose-700">{data.stats.declined}</p>
                                <p className="text-xs text-rose-600">Declined</p>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Sessions Requiring Attention */}
                <Card className="card-gradient border-l-4 border-l-amber-500">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                            Requires Attention
                        </CardTitle>
                        <CardDescription>Sessions with follow-up required or pending outcomes</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {data.pendingSessions.length === 0 ? (
                                <div className="text-center py-8">
                                    <CheckCircle2 className="h-12 w-12 text-green-400 mx-auto mb-2" />
                                    <p className="text-muted-foreground">All caught up! No sessions require attention.</p>
                                </div>
                            ) : (
                                data.pendingSessions.map((session) => (
                                    <Link key={session.id} href={`/coaching/${session.id}`}>
                                        <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-slate-50 transition-colors cursor-pointer group">
                                            <div className="flex-1">
                                                <p className="font-medium text-sm group-hover:text-primary transition-colors">
                                                    {getAgentName(session.agent_id)}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {session.coaching_type.replace('_', ' ')} • {session.session_date}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant={session.status === 'follow_up_required' ? 'destructive' : 'secondary'} className="text-xs">
                                                    {session.status === 'follow_up_required' ? 'Follow-up' : 'Pending'}
                                                </Badge>
                                                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Coaching Activity */}
                <Card className="card-gradient">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-blue-500" />
                            Recent Activity
                        </CardTitle>
                        <CardDescription>Latest coaching sessions across all teams</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {data.recentSessions.map((session) => (
                                <Link key={session.id} href={`/coaching/${session.id}`}>
                                    <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-slate-50 transition-colors cursor-pointer group">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${session.outcome === 'improved' ? 'bg-green-100' :
                                                session.outcome === 'declined' ? 'bg-red-100' : 'bg-slate-100'
                                                }`}>
                                                {session.outcome === 'improved' ? (
                                                    <TrendingUp className="h-4 w-4 text-green-600" />
                                                ) : session.outcome === 'declined' ? (
                                                    <TrendingDown className="h-4 w-4 text-red-600" />
                                                ) : (
                                                    <Clock className="h-4 w-4 text-slate-500" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm group-hover:text-primary transition-colors">
                                                    {getAgentName(session.agent_id)}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    by {session.coach_name}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-muted-foreground">{session.session_date}</p>
                                            <Badge variant="outline" className="text-xs mt-1">
                                                {session.coaching_type.replace('_', ' ')}
                                            </Badge>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Performance Overview */}
            <Card className="card-gradient">
                <CardHeader>
                    <CardTitle>Coaching Effectiveness Overview</CardTitle>
                    <CardDescription>Track the impact of coaching interventions</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-green-50 rounded-xl">
                            <p className="text-4xl font-bold text-green-600">
                                {data.stats.totalSessions > 0
                                    ? Math.round((data.stats.improved / data.stats.totalSessions) * 100)
                                    : 0}%
                            </p>
                            <p className="text-sm text-green-700">Improvement Rate</p>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-xl">
                            <p className="text-4xl font-bold text-blue-600">
                                {data.stats.autoTriggered}
                            </p>
                            <p className="text-sm text-blue-700">Auto-Triggered Sessions</p>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-xl">
                            <p className="text-4xl font-bold text-purple-600">
                                {data.stats.totalSessions - data.stats.pendingReview}
                            </p>
                            <p className="text-sm text-purple-700">Completed Sessions</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
