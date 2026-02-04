'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getAgents, getInterventionCandidates } from '@/lib/mock-service';
import { PageGuide } from '@/components/ui/page-guide';
import { Agent } from '@/types/domain';
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
import { Badge } from '@/components/ui/badge';
import { Search, ChevronLeft, ChevronRight, User, AlertOctagon, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { exportToCSV } from '@/lib/export';
import { Download } from 'lucide-react';

import { toast } from 'sonner';

const ITEMS_PER_PAGE = 10;

export default function AgentsPage() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [filteredAgents, setFilteredAgents] = useState<Agent[]>([]);
    const [atRiskCount, setAtRiskCount] = useState(0);

    // Filters
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showOnlyAtRisk, setShowOnlyAtRisk] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [interventionCandidates, setInterventionCandidates] = useState<any[]>([]);

    useEffect(() => {
        const data = getAgents();
        setAgents(data);
        setFilteredAgents(data);

        const candidates = getInterventionCandidates();
        setInterventionCandidates(candidates);
        setAtRiskCount(candidates.length);
    }, []);

    useEffect(() => {
        let result = agents;

        if (search) {
            const lowerSearch = search.toLowerCase();
            result = result.filter(a =>
                a.name.toLowerCase().includes(lowerSearch) ||
                a.team.toLowerCase().includes(lowerSearch)
            );
        }

        if (roleFilter !== 'all') {
            result = result.filter(a => a.role === roleFilter);
        }

        if (statusFilter !== 'all') {
            result = result.filter(a => a.status === statusFilter);
        }

        if (showOnlyAtRisk) {
            const riskIds = interventionCandidates.map(c => c.agent.id);
            result = result.filter(a => riskIds.includes(a.id));
        }

        setFilteredAgents(result);
        setCurrentPage(1); // Reset to first page on filter change
    }, [search, roleFilter, statusFilter, showOnlyAtRisk, agents, interventionCandidates]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredAgents.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedAgents = filteredAgents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handleExport = () => {
        const data = filteredAgents.map(a => ({
            ID: a.id,
            Name: a.name,
            Role: a.role,
            Team: a.team,
            Status: a.status
        }));
        exportToCSV(data, 'agents_export');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        Agent Performance
                        <PageGuide
                            title="Agent Roster"
                            description="Complete directory of your team. Drill down for detailed performance history and coaching logs."
                            items={['Performance Tiers', 'Risk Calculations', 'Direct Coaching Access']}
                        />
                    </h2>
                    <p className="text-muted-foreground">Manage your team and monitor individual progress.</p>
                </div>
                <Button onClick={() => {
                    toast.info("Mock Feature", { description: "Agent creation is disabled in this demo. Agents are seed data." });
                }}>Add Agent (Mock)</Button>
            </div>

            {/* At Risk Summary Card */}
            {atRiskCount > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-100 rounded-full">
                            <AlertOctagon className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-red-900">Intervention Needed</h3>
                            <p className="text-red-700">There are {atRiskCount} agents falling below the 80% performance threshold.</p>
                        </div>
                    </div>
                    <Button
                        variant={showOnlyAtRisk ? "secondary" : "destructive"}
                        onClick={() => setShowOnlyAtRisk(!showOnlyAtRisk)}
                    >
                        {showOnlyAtRisk ? "Show All Agents" : "View At-Risk Only"}
                    </Button>
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Agent Directory</CardTitle>
                    <CardDescription>View performance metrics, tenure, and status for all agents.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-end">
                        <div className="flex gap-2 w-full md:w-auto">
                            <div className="relative w-full">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name or team..."
                                    className="pl-8"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto items-center">
                            <Button variant="outline" size="sm" onClick={handleExport}>
                                <Download className="h-4 w-4 mr-2" />
                                Export CSV
                            </Button>

                            <div className="flex items-center space-x-2 mr-4">
                                <Switch
                                    id="risk-mode"
                                    checked={showOnlyAtRisk}
                                    onCheckedChange={setShowOnlyAtRisk}
                                />
                                <Label htmlFor="risk-mode">At Risk Only</Label>
                            </div>

                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Roles</SelectItem>
                                    <SelectItem value="Agent">Agent</SelectItem>
                                    <SelectItem value="Team Lead">Team Lead</SelectItem>
                                    <SelectItem value="QA Specialist">QA Specialist</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Team</TableHead>
                                    <TableHead>Avg Score</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedAgents.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center">
                                            No agents found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginatedAgents.map((agent) => {
                                        const riskInfo = interventionCandidates.find(c => c.agent.id === agent.id);
                                        const isRisk = !!riskInfo;

                                        return (
                                            <TableRow key={agent.id} className={isRisk ? "bg-red-50 hover:bg-red-100" : ""}>
                                                <TableCell className="font-medium flex items-center gap-2">
                                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${isRisk ? 'bg-red-200' : 'bg-slate-100'}`}>
                                                        <User className={`h-4 w-4 ${isRisk ? 'text-red-700' : 'text-slate-500'}`} />
                                                    </div>
                                                    <div>
                                                        {agent.name}
                                                        {isRisk && <span className="block text-[10px] text-red-600 font-bold">INTERVENTION NEEDED</span>}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{agent.role}</TableCell>
                                                <TableCell>{agent.team}</TableCell>
                                                <TableCell>
                                                    {riskInfo ? (
                                                        <div className="flex items-center text-red-600 font-bold">
                                                            <TrendingDown className="h-4 w-4 mr-1" />
                                                            {riskInfo.averageScore}%
                                                        </div>
                                                    ) : (
                                                        <span className="text-green-600 font-medium">Good</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                                                        {agent.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link href={`/agents/${agent.id}`}>
                                                            View
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex items-center justify-end space-x-2 py-4">
                        <div className="flex-1 text-sm text-muted-foreground">
                            Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredAgents.length)} of {filteredAgents.length} agents
                        </div>
                        <div className="space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
