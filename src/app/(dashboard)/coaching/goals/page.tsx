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
import { Search, Target, ArrowUpRight, Calendar, User } from 'lucide-react';
import { getCoachingSessions, getAgents } from '@/lib/mock-service';
import { CoachingSession, Agent } from '@/types/domain';

// Helper interface for the table row
interface GoalRow {
    sessionId: string;
    agentName: string;
    agentId: string;
    coachName: string;
    date: string;
    smartGoal: string; // From agent_commitment or specific goal field
    targetDate: string; // From follow_up_date
    status: string; // derived
    outcome: string;
}

export default function SmartGoalsPage() {
    const [goals, setGoals] = useState<GoalRow[]>([]);
    const [filteredGoals, setFilteredGoals] = useState<GoalRow[]>([]);

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
                    outcome: s.outcome
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
                                        <TableRow key={goal.sessionId}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4 text-slate-400" />
                                                    {goal.agentName}
                                                </div>
                                            </TableCell>
                                            <TableCell className="max-w-[400px]">
                                                <div className="truncate font-medium text-slate-700" title={goal.smartGoal}>
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
                                                <Link href={`/coaching/${goal.sessionId}`}>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                        <ArrowUpRight className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
