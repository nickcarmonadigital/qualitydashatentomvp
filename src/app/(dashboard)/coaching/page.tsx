'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getCoachingSessions, getAgents } from '@/lib/mock-service';
import { CoachingSession, Agent } from '@/types/domain';
import {
    MessageSquare,
    Users,
    AlertTriangle,
    TrendingUp,
    Calendar,
    ArrowRight,
    Filter,
    Plus
} from 'lucide-react';
import { DownloadCSVButton } from '@/components/ui/download-button';
import { PageGuide } from '@/components/ui/page-guide';

const getCoachingTypeBadge = (type: string) => {
    const styles: Record<string, { variant: 'default' | 'destructive' | 'secondary' | 'outline', label: string }> = {
        qa_failure: { variant: 'destructive', label: 'QA Failure' },
        kpi_decline: { variant: 'destructive', label: 'KPI Decline' },
        behavioral: { variant: 'secondary', label: 'Behavioral' },
        skills_gap: { variant: 'secondary', label: 'Skills Gap' },
        routine: { variant: 'outline', label: 'Routine' }
    };
    const style = styles[type] || { variant: 'outline', label: type };
    return <Badge variant={style.variant}>{style.label}</Badge>;
};

const getStatusBadge = (status: string) => {
    const styles: Record<string, { variant: 'default' | 'destructive' | 'secondary' | 'outline', label: string }> = {
        scheduled: { variant: 'secondary', label: 'Scheduled' },
        completed: { variant: 'default', label: 'Completed' },
        follow_up_required: { variant: 'destructive', label: 'Follow-up Required' },
        auto_generated: { variant: 'outline', label: 'Auto-generated' }
    };
    const style = styles[status] || { variant: 'outline', label: status };
    return <Badge variant={style.variant}>{style.label}</Badge>;
};

export default function CoachingPage() {
    const [sessions, setSessions] = useState<CoachingSession[]>([]);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [filter, setFilter] = useState<string>('all');

    useEffect(() => {
        const allSessions = getCoachingSessions();
        const allAgents = getAgents();
        setSessions(allSessions);
        setAgents(allAgents);
    }, []);

    const getAgentName = (agentId: string) => {
        return agents.find(a => a.id === agentId)?.name || 'Unknown';
    };

    const filteredSessions = filter === 'all'
        ? sessions
        : sessions.filter(s => s.coaching_type === filter || s.status === filter);

    const stats = {
        total: sessions.length,
        followUp: sessions.filter(s => s.status === 'follow_up_required').length,
        qaFailures: sessions.filter(s => s.coaching_type === 'qa_failure').length,
        improved: sessions.filter(s => s.outcome === 'improved').length
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        Coaching Sessions
                        <PageGuide
                            title="Coaching Sessions"
                            description="Manage agent development. Log new sessions, track outcomes, and monitor commitment adherence."
                            items={['Session History', 'Outcome Tracking', 'Smart Goal Integration']}
                        />
                    </h2>
                    <p className="text-muted-foreground">Track and manage agent development sessions.</p>
                </div>
                <div className="flex gap-2">
                    <DownloadCSVButton
                        data={filteredSessions.map(s => ({
                            Date: s.session_date,
                            Agent: agents.find(a => a.id === s.agent_id)?.name || s.agent_id,
                            Coach: s.coach_name,
                            Type: s.coaching_type,
                            Outcome: s.outcome,
                            Status: s.status,
                            Notes: s.notes
                        }))}
                        filename="coaching_sessions"
                    />
                    <Link href="/coaching/new">
                        <Button className="btn-premium">
                            <Plus className="h-4 w-4 mr-2" /> New Session
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="metric-card bg-gradient-to-br from-blue-50 to-blue-100/50">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <MessageSquare className="h-8 w-8 text-blue-600" />
                            <div>
                                <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
                                <p className="text-xs text-blue-600/80">Total Sessions</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="metric-card bg-gradient-to-br from-amber-50 to-amber-100/50">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <Calendar className="h-8 w-8 text-amber-600" />
                            <div>
                                <p className="text-2xl font-bold text-amber-700">{stats.followUp}</p>
                                <p className="text-xs text-amber-600/80">Need Follow-up</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="metric-card bg-gradient-to-br from-red-50 to-red-100/50">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="h-8 w-8 text-red-600" />
                            <div>
                                <p className="text-2xl font-bold text-red-700">{stats.qaFailures}</p>
                                <p className="text-xs text-red-600/80">QA Triggered</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="metric-card bg-gradient-to-br from-green-50 to-green-100/50">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <TrendingUp className="h-8 w-8 text-green-600" />
                            <div>
                                <p className="text-2xl font-bold text-green-700">{stats.improved}</p>
                                <p className="text-xs text-green-600/80">Improved</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
                <Button
                    variant={filter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('all')}
                >
                    All
                </Button>
                <Button
                    variant={filter === 'follow_up_required' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('follow_up_required')}
                >
                    Follow-up Required
                </Button>
                <Button
                    variant={filter === 'qa_failure' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('qa_failure')}
                >
                    QA Failures
                </Button>
                <Button
                    variant={filter === 'kpi_decline' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('kpi_decline')}
                >
                    KPI Declines
                </Button>
            </div>

            {/* Sessions List */}
            <Card className="card-gradient">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        Coaching Sessions ({filteredSessions.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {filteredSessions.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">No coaching sessions found.</p>
                        ) : (
                            filteredSessions.map((session) => (
                                <Link key={session.id} href={`/ coaching / ${session.id} `}>
                                    <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-slate-50 transition-colors cursor-pointer group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <Users className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium group-hover:text-primary transition-colors">
                                                    {getAgentName(session.agent_id)}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    Coached by {session.coach_name} ({session.coach_role.replace('_', ' ')})
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {getCoachingTypeBadge(session.coaching_type)}
                                            {getStatusBadge(session.status)}
                                            <span className="text-sm text-muted-foreground">{session.session_date}</span>
                                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
