'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Save, ArrowLeft, Loader2, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAgents, getKPIs, createCoachingSession } from '@/lib/mock-service';
import { Agent, KPI, CoachingType, CoachRole, CoachingOutcome } from '@/types/domain';
import { toast } from 'sonner';

export default function NewCoachingSessionPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Data Sources
    const [agents, setAgents] = useState<Agent[]>([]);
    const [kpis, setKpis] = useState<KPI[]>([]);

    // Form State
    const [agentId, setAgentId] = useState('');
    const [coachingType, setCoachingType] = useState<CoachingType>('routine');
    const [date, setDate] = useState<Date>(new Date());

    // Dynamic KPI Array (start with 1 slot)
    const [selectedKpiIds, setSelectedKpiIds] = useState<string[]>(['']);

    // Diagnosis
    const [relatedToQA, setRelatedToQA] = useState(false);
    const [problemIdentified, setProblemIdentified] = useState(false);
    const [issueResolved, setIssueResolved] = useState(false);

    // Text Areas
    const [interactionSummary, setInteractionSummary] = useState('');
    const [diagnosisExplain, setDiagnosisExplain] = useState('');
    const [issueResolvedExplain, setIssueResolvedExplain] = useState('');

    // Opportunities
    const [primaryOpportunity, setPrimaryOpportunity] = useState('');
    const [secondaryOpportunity, setSecondaryOpportunity] = useState('');

    // Commitments
    const [agentCommitment, setAgentCommitment] = useState('');
    const [supervisorCommitment, setSupervisorCommitment] = useState('');

    // Follow up
    const [followUpDate, setFollowUpDate] = useState<Date | undefined>(undefined);

    useEffect(() => {
        setAgents(getAgents());
        setKpis(getKPIs());
    }, []);

    const handleAddKpi = () => {
        if (selectedKpiIds.length < 3) {
            setSelectedKpiIds([...selectedKpiIds, '']);
        }
    };

    const handleRemoveKpi = (index: number) => {
        const newKpis = [...selectedKpiIds];
        newKpis.splice(index, 1);
        setSelectedKpiIds(newKpis);
    };

    const handleKpiChange = (value: string, index: number) => {
        const newKpis = [...selectedKpiIds];
        newKpis[index] = value;
        setSelectedKpiIds(newKpis);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!agentId) {
            toast.error("Please select an agent");
            return;
        }

        setIsLoading(true);

        try {
            // Map form state to domain object
            const cleanKpis = selectedKpiIds.filter(id => id !== '');

            const keyObservations = [];
            if (primaryOpportunity) keyObservations.push(`Primary: ${primaryOpportunity}`);
            if (secondaryOpportunity) keyObservations.push(`Secondary: ${secondaryOpportunity}`);
            if (diagnosisExplain) keyObservations.push(`Diagnosis: ${diagnosisExplain}`);
            if (issueResolvedExplain) keyObservations.push(`Resolution: ${issueResolvedExplain}`);

            const newSession = createCoachingSession({
                agent_id: agentId,
                coach_id: 'current-user-id', // Mock ID
                coach_name: 'Nicholas (You)', // Mock Name
                coach_role: 'team_lead',
                session_date: format(date, 'yyyy-MM-dd'),
                coaching_type: coachingType,
                trigger_kpi_ids: cleanKpis,

                // New Fields
                problem_identified: problemIdentified,
                issue_resolved: issueResolved,
                agent_commitment: agentCommitment,
                supervisor_commitment: supervisorCommitment,

                notes: interactionSummary,
                key_observations: keyObservations,
                action_items: relatedToQA ? ['Review QA Guidelines'] : ['Standard Follow-up'], // Basic default

                outcome: issueResolved ? 'improved' : 'pending',
                follow_up_date: followUpDate ? format(followUpDate, 'yyyy-MM-dd') : undefined,
                manager_notified: false,
            });

            toast.success("Coaching session created successfully");
            router.push(`/coaching/${newSession.id}`);

        } catch (error) {
            console.error(error);
            toast.error("Failed to create session");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-20">
            {/* Header / Nav */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h2 className="text-2xl font-bold">New Coaching Session</h2>
                    <p className="text-muted-foreground">Record a new coaching interaction</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* 1. Basic Info Section */}
                <Card className="card-gradient">
                    <CardContent className="pt-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                            {/* Agent Selection */}
                            <div className="space-y-2">
                                <Label>Agent</Label>
                                <Select value={agentId} onValueChange={setAgentId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Agent" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {agents.map(a => (
                                            <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Type of Coaching */}
                            <div className="space-y-2">
                                <Label>Type of Coaching</Label>
                                <Select value={coachingType} onValueChange={(val: CoachingType) => setCoachingType(val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="qa_failure">QA Evaluation</SelectItem>
                                        <SelectItem value="kpi_decline">KPI Decline</SelectItem>
                                        <SelectItem value="behavioral">Behavioral</SelectItem>
                                        <SelectItem value="skills_gap">Skills Gap</SelectItem>
                                        <SelectItem value="routine">Routine Check-in</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Date Picker */}
                            <div className="space-y-2">
                                <Label>Coaching Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={(d) => d && setDate(d)}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        {/* KPI Impacted (Dynamic) */}
                        <div className="space-y-2">
                            <Label>KPI Impacted (Optional)</Label>
                            <div className="space-y-2">
                                {selectedKpiIds.map((kpiId, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <Select value={kpiId} onValueChange={(val) => handleKpiChange(val, index)}>
                                            <SelectTrigger className="w-full md:w-1/2">
                                                <SelectValue placeholder="Select KPI" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {kpis.map(k => (
                                                    <SelectItem key={k.id} value={k.id}>{k.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        {index === selectedKpiIds.length - 1 && selectedKpiIds.length < 3 && (
                                            <Button type="button" variant="ghost" size="icon" onClick={handleAddKpi}>
                                                <Plus className="h-4 w-4 text-green-600" />
                                            </Button>
                                        )}

                                        {selectedKpiIds.length > 1 && (
                                            <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveKpi(index)}>
                                                <X className="h-4 w-4 text-red-500" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* QA Related Toggle */}
                        <div className="flex items-center space-x-2 pt-2">
                            <Switch id="qa-related" checked={relatedToQA} onCheckedChange={setRelatedToQA} />
                            <Label htmlFor="qa-related">Is this coaching related to a QA evaluation?</Label>
                        </div>

                    </CardContent>
                </Card>

                {/* 2. Interaction Details */}
                <Card className="card-gradient">
                    <CardContent className="pt-6 space-y-6">
                        <div className="space-y-2">
                            <Label>Interaction Summary</Label>
                            <Textarea
                                placeholder="Describe the coaching interaction..."
                                className="min-h-[100px]"
                                value={interactionSummary}
                                onChange={(e) => setInteractionSummary(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Problem Identified */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Was the problem identified?</Label>
                                    <Select value={problemIdentified ? 'yes' : 'no'} onValueChange={(v) => setProblemIdentified(v === 'yes')}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="yes">Yes</SelectItem>
                                            <SelectItem value="no">No</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {problemIdentified && (
                                    <div className="space-y-2 animate-fade-in">
                                        <Label>Explain</Label>
                                        <Textarea
                                            placeholder="What was the root cause?"
                                            value={diagnosisExplain}
                                            onChange={(e) => setDiagnosisExplain(e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Issue Resolved */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Was the issue resolved during the session?</Label>
                                    <Select value={issueResolved ? 'yes' : 'no'} onValueChange={(v) => setIssueResolved(v === 'yes')}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="yes">Yes</SelectItem>
                                            <SelectItem value="no">No</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {issueResolved && (
                                    <div className="space-y-2 animate-fade-in">
                                        <Label>Explain Resolution</Label>
                                        <Textarea
                                            placeholder="How was it resolved?"
                                            value={issueResolvedExplain}
                                            onChange={(e) => setIssueResolvedExplain(e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 3. Opportunities & Commitments */}
                <Card className="card-gradient">
                    <CardContent className="pt-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Primary Opportunity Identified</Label>
                                <Select value={primaryOpportunity} onValueChange={setPrimaryOpportunity}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Opportunity" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Acknowledgement">Acknowledgement</SelectItem>
                                        <SelectItem value="Empathy/Soft Skills">Empathy/Soft Skills</SelectItem>
                                        <SelectItem value="Process Adherence">Process Adherence</SelectItem>
                                        <SelectItem value="System Knowledge">System Knowledge</SelectItem>
                                        <SelectItem value="Call Control">Call Control</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Secondary Opportunity Identified</Label>
                                <Select value={secondaryOpportunity} onValueChange={setSecondaryOpportunity}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Opportunity" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Acknowledgement">Acknowledgement</SelectItem>
                                        <SelectItem value="Empathy/Soft Skills">Empathy/Soft Skills</SelectItem>
                                        <SelectItem value="Process Adherence">Process Adherence</SelectItem>
                                        <SelectItem value="System Knowledge">System Knowledge</SelectItem>
                                        <SelectItem value="Call Control">Call Control</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Agent Commitment</Label>
                                <CardDescription className="mb-2">
                                    Outline steps that the agent will take to address the behavior
                                </CardDescription>
                                <Textarea
                                    className="min-h-[120px] bg-slate-50/50"
                                    value={agentCommitment}
                                    onChange={(e) => setAgentCommitment(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Supervisor Commitment</Label>
                                <CardDescription className="mb-2">
                                    Outline steps that you will take to help the agent address the behavior
                                </CardDescription>
                                <Textarea
                                    className="min-h-[120px] bg-slate-50/50"
                                    value={supervisorCommitment}
                                    onChange={(e) => setSupervisorCommitment(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 4. Footer & Actions */}
                <Card className="card-gradient">
                    <CardContent className="pt-6 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="space-y-2 w-full md:w-auto">
                            <Label>Follow up date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full md:w-[240px] justify-start text-left font-normal",
                                            !followUpDate && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {followUpDate ? format(followUpDate, "PPP") : <span>Select date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={followUpDate}
                                        onSelect={setFollowUpDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="flex gap-4 w-full md:w-auto">
                            <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1 md:flex-none">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading} className="btn-premium flex-1 md:flex-none w-full md:w-[150px]">
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                                Save Session
                            </Button>
                        </div>
                    </CardContent>
                </Card>

            </form>
        </div>
    );
}
