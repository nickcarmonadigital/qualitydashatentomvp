'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { getCoachingSessionById, createCoachingAudit } from '@/lib/mock-service';
import { CoachingSession } from '@/types/domain';
import { toast } from 'sonner';
import { ArrowLeft, Save, Star, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function CoachingAuditPage() {
    const params = useParams();
    const router = useRouter();
    const [session, setSession] = useState<CoachingSession | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Form State (SOP Trilevel Model)
    // Section 1: Trust & Connection
    const [trustScores, setTrustScores] = useState({
        welcoming_tone: 0,
        rapport_building: 0,
        empathy: 0,
        review_previous: 0
    });

    // Section 2: Execution
    const [execScores, setExecScores] = useState({
        agent_involvement: 0,
        probing_questions: 0,
        root_cause_id: 0,
        solution_relevance: 0,
        objection_handling: 0,
        skill_transfer: 0
    });

    // Section 3: Follow-up
    const [followUpScores, setFollowUpScores] = useState({
        expectations_set: 0,
        smart_goal_quality: 0,
        documentation: 0
    });

    // Result verification
    const [goalOutcome, setGoalOutcome] = useState<'achieved' | 'missed' | 'in_progress' | 'not_started'>('in_progress');

    // Qualitative
    const [strengths, setStrengths] = useState('');
    const [opportunities, setOpportunities] = useState('');

    // COPC Compliance Fields
    const [auditSource, setAuditSource] = useState<'random' | 'nps_detractor' | 'escalation'>('random');
    const [isCriticalError, setIsCriticalError] = useState(false);

    useEffect(() => {
        if (params.id) {
            const data = getCoachingSessionById(params.id as string);
            if (data) {
                setSession(data as CoachingSession);
            } else {
                toast.error("Session not found");
                router.push('/coaching');
            }
        }
    }, [params.id, router]);

    const handleTrustChange = (key: keyof typeof trustScores, val: number) => {
        setTrustScores(prev => ({ ...prev, [key]: val }));
    };

    const handleExecChange = (key: keyof typeof execScores, val: number) => {
        setExecScores(prev => ({ ...prev, [key]: val }));
    };

    const handleFollowUpChange = (key: keyof typeof followUpScores, val: number) => {
        setFollowUpScores(prev => ({ ...prev, [key]: val }));
    };

    const isFormValid = () => {
        const allTrust = Object.values(trustScores).every(v => v > 0);
        const allExec = Object.values(execScores).every(v => v > 0);
        const allFollow = Object.values(followUpScores).every(v => v > 0);
        return allTrust && allExec && allFollow && strengths && opportunities;
    };

    const handleSubmit = async () => {
        if (!session) return;
        if (!isFormValid()) {
            toast.error("Please complete all ratings and text fields");
            return;
        }

        setIsLoading(true);
        try {
            await createCoachingAudit({
                session_id: session.id,
                auditor_id: 'current-user-id', // Mock
                sections: {
                    trust_connection: trustScores,
                    coaching_execution: execScores,
                    follow_up: followUpScores
                },
                goal_outcome_verified: goalOutcome,
                strengths,
                opportunities,
                // COPC Compliance
                audit_source: auditSource,
                is_critical_error: isCriticalError
            });

            // COPC: Critical Error Alert
            if (isCriticalError) {
                toast.error("🚨 CRITICAL ALERT: Supervisor has been notified!", {
                    duration: 8000,
                    description: "Zero Tolerance failure flagged. Immediate follow-up required within 24 hours."
                });
            } else {
                toast.success("Audit submitted successfully");
            }

            router.push(`/coaching/${session.id}`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to submit audit");
        } finally {
            setIsLoading(false);
        }
    };

    if (!session) return <div className="p-8">Loading...</div>;

    const renderRating = (label: string, value: number, onChange: (val: number) => void, hint?: string) => (
        <div className="flex items-center justify-between py-3 border-b last:border-0 hover:bg-slate-50/50 px-2 rounded-md transition-colors">
            <div className="space-y-1">
                <p className="font-medium text-sm text-slate-700">{label}</p>
                {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
            </div>
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => onChange(star)}
                        className={cn(
                            "p-1 rounded-full transition-all text-slate-300 hover:text-amber-400 hover:scale-110 focus:outline-none",
                            value >= star && "text-amber-500"
                        )}
                    >
                        <Star className={cn("h-6 w-6", value >= star && "fill-current")} />
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in max-w-4xl mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h2 className="text-2xl font-bold">Audit Coaching Session</h2>
                    <p className="text-muted-foreground">Evaluating {session.coach_name} (Coach) with Agent</p>
                </div>
            </div>

            <div className="grid gap-6">
                {/* 1. Session Context Summary */}
                <Card className="bg-slate-50 border-slate-200">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-blue-500" />
                            Session Context
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <span className="text-muted-foreground block text-xs">Type</span>
                            <span className="font-medium">{session.coaching_type.replace(/_/g, ' ')}</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground block text-xs">Date</span>
                            <span className="font-medium">{session.session_date}</span>
                        </div>
                        <div className="col-span-2">
                            <span className="text-muted-foreground block text-xs">Original Outcome</span>
                            <Badge variant={session.outcome === 'improved' ? 'default' : 'secondary'}>
                                {session.outcome}
                            </Badge>
                        </div>
                        <div className="col-span-full border-t pt-2 mt-1">
                            <span className="text-muted-foreground block text-xs mb-1">Coach's Notes</span>
                            <p className="italic text-slate-600 line-clamp-2">{session.notes}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* COPC: Audit Source & Critical Error */}
                <Card className="border-orange-200 bg-orange-50/30">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2 text-orange-900">
                            <AlertCircle className="h-4 w-4 text-orange-500" />
                            Audit Classification (COPC)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Audit Source</Label>
                            <Select value={auditSource} onValueChange={(v: any) => setAuditSource(v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="random">Random</SelectItem>
                                    <SelectItem value="nps_detractor">NPS Detractor</SelectItem>
                                    <SelectItem value="escalation">Client Escalation</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">Tag the source for compliance tracking.</p>
                        </div>
                        <div className="space-y-2">
                            <Label>Critical Error (Zero Tolerance)</Label>
                            <div className="flex items-center gap-3 pt-1">
                                <input
                                    type="checkbox"
                                    id="critical-error"
                                    checked={isCriticalError}
                                    onChange={(e) => setIsCriticalError(e.target.checked)}
                                    className="h-5 w-5 rounded border-gray-300 text-red-600 focus:ring-red-500"
                                />
                                <label htmlFor="critical-error" className="text-sm font-medium text-slate-700">
                                    Flag as Critical Error
                                </label>
                            </div>
                            <p className="text-xs text-muted-foreground">If checked, an alert will be sent to the supervisor.</p>
                        </div>
                    </CardContent>
                </Card>

                {/* 2. Trust & Connection */}
                <Card>
                    <CardHeader className="bg-purple-50/50 border-b pb-4">
                        <CardTitle className="text-lg text-purple-900">1. Trust & Connection</CardTitle>
                        <CardDescription>Did the coach build rapport and show empathy?</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-1">
                        {renderRating("Welcoming Tone", trustScores.welcoming_tone, (v) => handleTrustChange('welcoming_tone', v), "Warm greeting, steady eye contact, uplifting voice")}
                        {renderRating("Rapport Building", trustScores.rapport_building, (v) => handleTrustChange('rapport_building', v), "Personal connection, not just a checklist")}
                        {renderRating("Empathy", trustScores.empathy, (v) => handleTrustChange('empathy', v), "Validates feelings, says 'I get that'")}
                        {renderRating("Review Previous", trustScores.review_previous, (v) => handleTrustChange('review_previous', v), "References past goals specifically")}
                    </CardContent>
                </Card>

                {/* 3. Execution */}
                <Card>
                    <CardHeader className="bg-blue-50/50 border-b pb-4">
                        <CardTitle className="text-lg text-blue-900">2. Coaching Execution</CardTitle>
                        <CardDescription>Did the coach diagnose the root cause and transfer skills?</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-1">
                        {renderRating("Agent Involvement", execScores.agent_involvement, (v) => handleExecChange('agent_involvement', v), "Agent speaks >50% of the time")}
                        {renderRating("Probing Questions", execScores.probing_questions, (v) => handleExecChange('probing_questions', v), "Curiosity? Wh- questions?")}
                        {renderRating("Root Cause ID", execScores.root_cause_id, (v) => handleExecChange('root_cause_id', v), "Identified Skill vs Will vs System")}
                        {renderRating("Solution Relevance", execScores.solution_relevance, (v) => handleExecChange('solution_relevance', v), "Actionable next steps")}
                        {renderRating("Objection Handling", execScores.objection_handling, (v) => handleExecChange('objection_handling', v), "Defused defensiveness (AIM Model)")}
                        {renderRating("Skill Transfer", execScores.skill_transfer, (v) => handleExecChange('skill_transfer', v), "Agent demo/teach-back occurred")}
                    </CardContent>
                </Card>

                {/* 4. Follow-up */}
                <Card>
                    <CardHeader className="bg-green-50/50 border-b pb-4">
                        <CardTitle className="text-lg text-green-900">3. Follow-up & Commitment</CardTitle>
                        <CardDescription>Are the next steps clear and SMART?</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-1">
                        {renderRating("Expectations Set", followUpScores.expectations_set, (v) => handleFollowUpChange('expectations_set', v), "Clear timeline and ownership")}
                        {renderRating("SMART Goal Quality", followUpScores.smart_goal_quality, (v) => handleFollowUpChange('smart_goal_quality', v), "Specific, Measurable, Time-bound?")}
                        {renderRating("Documentation", followUpScores.documentation, (v) => handleFollowUpChange('documentation', v), "Logged in Drone/Lark correctly")}

                        <div className="pt-4 mt-2 border-t">
                            <Label className="mb-2 block">Verified Goal Outcome</Label>
                            <Select value={goalOutcome} onValueChange={(v: any) => setGoalOutcome(v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                    <SelectItem value="achieved">Achieved / Improved</SelectItem>
                                    <SelectItem value="missed">Missed / Failed</SelectItem>
                                    <SelectItem value="not_started">Not Started</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground mt-1">Check the tracker to verify actual result.</p>
                        </div>
                    </CardContent>
                </Card>

                {/* 5. Qualitative Feedback */}
                <Card>
                    <CardHeader>
                        <CardTitle>Auditor Feedback</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Key Strengths</Label>
                            <Textarea
                                placeholder="What did the coach do well?"
                                value={strengths}
                                onChange={(e) => setStrengths(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Opportunities</Label>
                            <Textarea
                                placeholder="What should they improve next time?"
                                value={opportunities}
                                onChange={(e) => setOpportunities(e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4 pt-4">
                    <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={isLoading} className="btn-premium w-40">
                        {isLoading ? "Submitting..." : (
                            <>
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Submit Audit
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
