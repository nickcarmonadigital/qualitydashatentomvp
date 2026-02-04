'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Target, ArrowUpRight, Calendar, User, Edit2 } from 'lucide-react';
import { getCoachingSessions, getAgents, updateCoachingSession } from '@/lib/mock-service';
import { CoachingSession, Agent, GoalRow } from '@/types/domain';
import { toast } from 'sonner';

export default function SmartGoalsPage() {
    const [goals, setGoals] = useState<GoalRow[]>([]);
    const [filteredGoals, setFilteredGoals] = useState<GoalRow[]>([]);
    const [selectedGoal, setSelectedGoal] = useState<GoalRow | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Edit Form State
    const [editStatus, setEditStatus] = useState('');
    const [editNotes, setEditNotes] = useState('');

    // Filters
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        const sessions = getCoachingSessions();
        const agents = getAgents();

        // Extract goals from sessions
        // We only care about sessions that HAVE a commitment/goal
        const extractedGoals: GoalRow[] = sessions
            .filter(s => s.agent_commitment || s.action_items.length > 0)
            .map(s => {
                const agent = agents.find(a => a.id === s.agent_id);

                // Determine status logic
                // If outcome is 'improved', goal is achieved
                // If outcome is 'declined' words, missed
                // Else in progress
                let status = 'In Progress';
                if (s.outcome === 'improved') status = 'Achieved';
                else if (s.outcome === 'declined' || s.outcome === 'no_change') status = 'Missed';

                // If audit verified it, use that
                if (s.audit?.goal_outcome_verified && s.audit.goal_outcome_verified !== 'not_started') {
                    const map = {
                        'achieved': 'Achieved',
                        'missed': 'Missed',
                        'in_progress': 'In Progress'
                    } as any;
                    status = map[s.audit.goal_outcome_verified] || status;
                }

                return {
                    sessionId: s.id,
                    agentName: agent?.name || 'Unknown',
                    agentId: s.agent_id,
                    coachName: s.coach_name,
                    date: s.session_date,
                    // Use agent commitment as the PRIMARY smart goal text for now, fall back to notes
                    smartGoal: s.agent_commitment || s.action_items[0] || "See session notes",
                    targetDate: s.follow_up_date || 'N/A',
                    status,
                    outcome: s.outcome,
                    notes: s.goal_tracking_notes || ''
                };
            });

        setGoals(extractedGoals);
        setFilteredGoals(extractedGoals);
    }, []);

    useEffect(() => {
        let result = goals;

        if (search) {
            const lower = search.toLowerCase();
            result = result.filter(g =>
                g.agentName.toLowerCase().includes(lower) ||
                g.coachName.toLowerCase().includes(lower) ||
                g.smartGoal.toLowerCase().includes(lower)
            );
        }

        if (statusFilter !== 'all') {
            result = result.filter(g => g.status === statusFilter);
        }

        setFilteredGoals(result);
    }, [search, statusFilter, goals]);

    const handleOpenDialog = (goal: GoalRow) => {
        setSelectedGoal(goal);
        setEditStatus(goal.status); // Default to current
        setEditNotes(goal.notes);
        setIsDialogOpen(true);
    };

    const handleSaveGoal = () => {
        if (!selectedGoal) return;

        // Map UI Status back to domain outcome if possible
        // This is a simplification. Ideally, we update outcome OR a specific goal status field.
        let newOutcome = selectedGoal.outcome;
        if (editStatus === 'Achieved') newOutcome = 'improved';
        if (editStatus === 'Missed') newOutcome = 'declined';

        // Update Mock Service
        updateCoachingSession(selectedGoal.sessionId, {
            outcome: newOutcome as any,
            goal_tracking_notes: editNotes
        });

        // Update Local State
        const updatedGoals = goals.map(g => {
            if (g.sessionId === selectedGoal.sessionId) {
                return { ...g, status: editStatus, outcome: newOutcome, notes: editNotes };
            }
            return g;
        });
        setGoals(updatedGoals);
        setFilteredGoals(filteredGoals.map(g => { // naive update of filtered
            if (g.sessionId === selectedGoal.sessionId) {
                return { ...g, status: editStatus, outcome: newOutcome, notes: editNotes };
            }
            return g;
        }));

        toast.success("Goal updated successfully");
        setIsDialogOpen(false);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Achieved':
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Achieved</Badge>;
            case 'Missed':
                return <Badge variant="destructive">Missed</Badge>;
            default:
                return <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">In Progress</Badge>;
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">SMART Goals Tracker</h2>
                    <p className="text-muted-foreground">Track and verify agent commitments from coaching sessions.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Active Goals Registry</CardTitle>
                    <CardDescription>
                        {filteredGoals.length} goals found
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Filters */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
                        <div className="relative w-full md:w-1/2">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by agent, coach, or goal text..."
                                className="pl-8"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Achieved">Achieved</SelectItem>
                                <SelectItem value="Missed">Missed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Table */}
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Agent</TableHead>
                                    <TableHead>SMART Goal</TableHead>
                                    <TableHead>Target Date</TableHead>
                                    <TableHead>Coach</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Link</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredGoals.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                            No goals found matching your criteria.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredGoals.map((goal) => (
                                        <TableRow
                                            key={goal.sessionId}
                                            className="cursor-pointer hover:bg-slate-50"
                                            onClick={() => handleOpenDialog(goal)}
                                        >
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4 text-slate-400" />
                                                    {goal.agentName}
                                                </div>
                                            </TableCell>
                                            <TableCell className="max-w-[400px]">
                                                <div className="truncate font-medium text-slate-700 hover:underline hover:text-blue-600" title={goal.smartGoal}>
                                                    {goal.smartGoal}
                                                </div>
                                                <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                                                    Set on {goal.date}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    <Calendar className="h-3 w-3" />
                                                    {goal.targetDate}
                                                </div>
                                            </TableCell>
                                            <TableCell>{goal.coachName}</TableCell>
                                            <TableCell>
                                                {getStatusBadge(goal.status)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm">
                                                    <Edit2 className="h-4 w-4 text-slate-400" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Evaluate SMART Goal</DialogTitle>
                        <DialogDescription>Track progress and update the outcome for this goal.</DialogDescription>
                    </DialogHeader>
                    {selectedGoal && (
                        <div className="space-y-4 py-4">
                            <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground uppercase tracking-wider">The Goal</Label>
                                <div className="p-3 bg-slate-50 border rounded-md text-sm font-medium italic">
                                    "{selectedGoal.smartGoal}"
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Agent</Label>
                                    <div className="text-sm">{selectedGoal.agentName}</div>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Target Date</Label>
                                    <div className="text-sm font-semibold">{selectedGoal.targetDate}</div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Current Status</Label>
                                <Select value={editStatus} onValueChange={setEditStatus}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="In Progress">In Progress</SelectItem>
                                        <SelectItem value="Achieved">Achieved / Improved</SelectItem>
                                        <SelectItem value="Missed">Missed / Failed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Tracking Notes / Observations</Label>
                                <Textarea
                                    placeholder="Enter your observations on progress..."
                                    value={editNotes}
                                    onChange={(e) => setEditNotes(e.target.value)}
                                    rows={4}
                                />
                            </div>

                            <div className="pt-2">
                                <Link href={`/coaching/${selectedGoal.sessionId}`} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                                    View Full Coaching Session <ArrowUpRight className="h-3 w-3" />
                                </Link>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveGoal}>Save Update</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
