'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getCoachingSessionById } from '@/lib/mock-service';
import { CoachingSession } from '@/types/domain';
import {
    ArrowLeft,
    User,
    Calendar,
    ClipboardList,
    CheckCircle2,
    AlertCircle,
    MessageSquare
} from 'lucide-react';

interface SessionDetail extends CoachingSession {
    agentName: string;
}

export default function CoachingSessionDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [session, setSession] = useState<SessionDetail | null>(null);

    useEffect(() => {
        if (params.id) {
            const data = getCoachingSessionById(params.id as string);
            setSession(data as SessionDetail);
        }
    }, [params.id]);

    if (!session) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Loading session...</p>
            </div>
        );
    }

    const getOutcomeBadge = (outcome: string) => {
        const styles: Record<string, { variant: 'default' | 'destructive' | 'secondary', color: string }> = {
            improved: { variant: 'default', color: 'bg-green-100 text-green-800' },
            no_change: { variant: 'secondary', color: 'bg-gray-100 text-gray-800' },
            declined: { variant: 'destructive', color: 'bg-red-100 text-red-800' },
            pending: { variant: 'secondary', color: 'bg-amber-100 text-amber-800' }
        };
        const style = styles[outcome] || styles.pending;
        return <Badge className={style.color}>{outcome.replace('_', ' ').toUpperCase()}</Badge>;
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h2 className="text-2xl font-bold">Coaching Session</h2>
                    <p className="text-muted-foreground">Session with {session.agentName}</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Left Column - Session Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Session Info */}
                    <Card className="card-gradient">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquare className="h-5 w-5" />
                                Session Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Agent</p>
                                    <Link href={`/agents/${session.agent_id}`}>
                                        <p className="font-medium text-primary hover:underline">{session.agentName}</p>
                                    </Link>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Coach</p>
                                    <p className="font-medium">{session.coach_name}</p>
                                    <p className="text-xs text-muted-foreground">{session.coach_role.replace('_', ' ')}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Date</p>
                                    <p className="font-medium">{session.session_date}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Type</p>
                                    <Badge variant={session.coaching_type.includes('failure') || session.coaching_type.includes('decline') ? 'destructive' : 'secondary'}>
                                        {session.coaching_type.replace('_', ' ')}
                                    </Badge>
                                </div>
                            </div>

                            <div className="pt-4 border-t">
                                <p className="text-sm text-muted-foreground mb-2">Session Notes</p>
                                <p className="text-sm whitespace-pre-wrap">{session.notes}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Key Observations */}
                    <Card className="card-gradient">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-amber-500" />
                                Key Observations
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {session.key_observations.map((obs, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs shrink-0 mt-0.5">
                                            {i + 1}
                                        </span>
                                        <span className="text-sm">{obs}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Action Items */}
                    <Card className="card-gradient">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ClipboardList className="h-5 w-5 text-blue-500" />
                                Action Items
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {session.action_items.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No action items assigned.</p>
                            ) : (
                                <ul className="space-y-2">
                                    {session.action_items.map((item, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                                            <span className="text-sm">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Status & Outcome */}
                <div className="space-y-6">
                    {/* Status Card */}
                    <Card className="card-gradient border-l-4 border-l-primary">
                        <CardHeader>
                            <CardTitle>Status & Outcome</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Status</p>
                                <Badge variant={session.status === 'follow_up_required' ? 'destructive' : 'default'}>
                                    {session.status.replace(/_/g, ' ')}
                                </Badge>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Outcome</p>
                                {getOutcomeBadge(session.outcome)}
                            </div>
                            {session.follow_up_date && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Follow-up Date</p>
                                    <p className="font-medium flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        {session.follow_up_date}
                                    </p>
                                </div>
                            )}
                            {session.manager_notified && (
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-blue-700">✓ Manager has been notified</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <Card className="card-gradient">
                        <CardHeader>
                            <CardTitle>Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button className="w-full" variant="outline">
                                Schedule Follow-up
                            </Button>
                            <Button className="w-full" variant="outline">
                                Generate Action Plan
                            </Button>
                            <Button className="w-full" variant="outline">
                                Notify Manager
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
