'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Users,
    ClipboardCheck,
    TrendingUp,
    AlertTriangle,
    ChevronDown,
    ChevronUp,
    ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { InfoTooltip } from '@/components/ui/info-tooltip';

// Mock data for expandable details
const TEAM_MEMBERS = [
    { name: 'Alice Johnson', score: 98, status: 'High Performer' },
    { name: 'Bob Smith', score: 82, status: 'Needs Coaching' },
    { name: 'Charlie Brown', score: 94, status: 'Consistent' },
];

const RECENT_SESSIONS = [
    { date: '2024-02-01', type: 'Calibration', attendees: 4 },
    { date: '2024-02-03', type: 'Teach-back', attendees: 3 },
];

export default function ManagerDashboardPage() {
    const [expandedCard, setExpandedCard] = useState<string | null>(null);

    const toggleCard = (cardId: string) => {
        setExpandedCard(expandedCard === cardId ? null : cardId);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">
                    Manager Dashboard
                    <InfoTooltip content="Overview of team performance, coaching needs, and operational metrics." />
                </h2>
                <p className="text-muted-foreground">Track team performance and operational health.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Team Performance Card */}
                <Card
                    className={`cursor-pointer transition-all hover:shadow-md ${expandedCard === 'team' ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => toggleCard('team')}
                >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Team Performance</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">92.5%</div>
                        <p className="text-xs text-muted-foreground">+2.1% from last month</p>
                        <div className="mt-2 flex items-center text-xs text-primary font-medium">
                            {expandedCard === 'team' ? <ChevronUp className="mr-1 h-3 w-3" /> : <ChevronDown className="mr-1 h-3 w-3" />}
                            {expandedCard === 'team' ? 'Hide Details' : 'View Details'}
                        </div>
                    </CardContent>
                </Card>

                {/* Coaching Status Card */}
                <Card
                    className={`cursor-pointer transition-all hover:shadow-md ${expandedCard === 'coaching' ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => toggleCard('coaching')}
                >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Coaching</CardTitle>
                        <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3</div>
                        <p className="text-xs text-muted-foreground">Sessions due this week</p>
                        <div className="mt-2 flex items-center text-xs text-primary font-medium">
                            {expandedCard === 'coaching' ? <ChevronUp className="mr-1 h-3 w-3" /> : <ChevronDown className="mr-1 h-3 w-3" />}
                            {expandedCard === 'coaching' ? 'Hide Details' : 'View Details'}
                        </div>
                    </CardContent>
                </Card>

                {/* Critical Issues Card */}
                <Card
                    className={`cursor-pointer transition-all hover:shadow-md ${expandedCard === 'issues' ? 'ring-2 ring-destructive' : ''}`}
                    onClick={() => toggleCard('issues')}
                >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-destructive">1</div>
                        <p className="text-xs text-muted-foreground">Requires immediate attention</p>
                        <div className="mt-2 flex items-center text-xs text-destructive font-medium">
                            {expandedCard === 'issues' ? <ChevronUp className="mr-1 h-3 w-3" /> : <ChevronDown className="mr-1 h-3 w-3" />}
                            {expandedCard === 'issues' ? 'Hide Details' : 'View Details'}
                        </div>
                    </CardContent>
                </Card>

                {/* Total Sessions Card */}
                <Card
                    className={`cursor-pointer transition-all hover:shadow-md ${expandedCard === 'sessions' ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => toggleCard('sessions')}
                >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">24</div>
                        <p className="text-xs text-muted-foreground">Completed this month</p>
                        <div className="mt-2 flex items-center text-xs text-primary font-medium">
                            {expandedCard === 'sessions' ? <ChevronUp className="mr-1 h-3 w-3" /> : <ChevronDown className="mr-1 h-3 w-3" />}
                            {expandedCard === 'sessions' ? 'Hide Details' : 'View Details'}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Expanded Details Section */}
            {expandedCard && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-200">
                    <Card className="border-t-4 border-t-primary">
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>
                                    {expandedCard === 'team' && 'Team Details'}
                                    {expandedCard === 'coaching' && 'Coaching Queue'}
                                    {expandedCard === 'issues' && 'Critical Alerts'}
                                    {expandedCard === 'sessions' && 'Session Log'}
                                </span>
                                <Button variant="ghost" size="sm" onClick={() => setExpandedCard(null)}>Close</Button>
                            </CardTitle>
                            <CardDescription>
                                {expandedCard === 'team' && 'Performance breakdown by agent.'}
                                {expandedCard === 'coaching' && 'Pending items requiring your action.'}
                                {expandedCard === 'issues' && 'High-priority system or process flags.'}
                                {expandedCard === 'sessions' && 'Recent activity log.'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {expandedCard === 'team' && (
                                <div className="space-y-2">
                                    {TEAM_MEMBERS.map((member, i) => (
                                        <div key={i} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded">
                                            <span className="font-medium">{member.name}</span>
                                            <div className="flex items-center gap-4">
                                                <span className={`text-sm ${member.score < 85 ? 'text-red-500' : 'text-green-600'}`}>
                                                    {member.score}%
                                                </span>
                                                <span className="text-xs text-muted-foreground">{member.status}</span>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="mt-4 pt-4 border-t">
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href="/agents">
                                                View All Agents <ExternalLink className="ml-2 h-3 w-3" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {expandedCard === 'coaching' && (
                                <div className="text-sm text-muted-foreground">
                                    <p>You have <strong>2</strong> calibrations and <strong>1</strong> teach-back pending.</p>
                                    <div className="mt-4">
                                        <Button variant="default" size="sm" asChild>
                                            <Link href="/sessions">Go to Sessions</Link>
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {expandedCard === 'issues' && (
                                <div className="p-4 bg-red-50 text-red-800 rounded-md">
                                    <p className="font-bold">Alert: Compliance Drop</p>
                                    <p className="text-sm mt-1">Team B compliance dropped below 85% for 3 consecutive days.</p>
                                    <Button variant="destructive" size="sm" className="mt-3" asChild>
                                        <Link href="/admin/audit">Investigate</Link>
                                    </Button>
                                </div>
                            )}

                            {expandedCard === 'sessions' && (
                                <div className="space-y-2">
                                    {RECENT_SESSIONS.map((session, i) => (
                                        <div key={i} className="flex justify-between text-sm p-2 border-b last:border-0">
                                            <span>{session.type}</span>
                                            <span className="text-muted-foreground">{session.date}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
