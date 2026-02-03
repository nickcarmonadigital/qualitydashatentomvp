'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getActionPlans, getAgents } from '@/lib/mock-service';
import { ActionPlan, Agent } from '@/types/domain';
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Search, ChevronLeft, ChevronRight, FileText, Calendar, UserCircle } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

export default function ActionPlansPage() {
    const [actionPlans, setActionPlans] = useState<ActionPlan[]>([]);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [filteredPlans, setFilteredPlans] = useState<ActionPlan[]>([]);

    // Filters
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const plans = getActionPlans();
        const agentList = getAgents();
        setActionPlans(plans);
        setAgents(agentList);
        setFilteredPlans(plans);
    }, []);

    useEffect(() => {
        let result = actionPlans;

        if (search) {
            const lowerSearch = search.toLowerCase();
            result = result.filter(p =>
                p.title.toLowerCase().includes(lowerSearch) ||
                p.id.toLowerCase().includes(lowerSearch)
            );
        }

        if (statusFilter !== 'all') {
            result = result.filter(p => p.status === statusFilter);
        }

        setFilteredPlans(result);
        setCurrentPage(1);
    }, [search, statusFilter, actionPlans]);

    // Helper to get owner name
    const getOwnerName = (id: string) => {
        return agents.find(a => a.id === id)?.name || 'Unknown';
    };

    // Pagination Logic
    const totalPages = Math.ceil(filteredPlans.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedPlans = filteredPlans.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Action Plans</h2>
                    <p className="text-muted-foreground">Manage strategic initiatives and corrective actions.</p>
                </div>
                <Button asChild>
                    <Link href="/action-plans/new">
                        <FileText className="mr-2 h-4 w-4" />
                        New Action Plan
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Plan Registry</CardTitle>
                    <CardDescription>All active and closed action plans.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
                        <div className="flex gap-2 w-full md:w-1/2">
                            <div className="relative w-full">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by title..."
                                    className="pl-8"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="open">Open</SelectItem>
                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                    <SelectItem value="closed">Closed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[300px]">Title</TableHead>
                                    <TableHead>Owner</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Due Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedPlans.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center">
                                            No action plans found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginatedPlans.map((plan) => (
                                        <TableRow key={plan.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex flex-col">
                                                    <span>{plan.title}</span>
                                                    <span className="text-xs text-muted-foreground font-mono truncate max-w-[200px]">{plan.id}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <UserCircle className="h-4 w-4 text-slate-400" />
                                                    {getOwnerName(plan.owner_id)}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{plan.causal_category}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    <Calendar className="h-3 w-3" />
                                                    {plan.due_date}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={
                                                    plan.status === 'closed' ? 'secondary' :
                                                        plan.status === 'in_progress' ? 'default' : 'outline'
                                                }>
                                                    {plan.status.replace('_', ' ').toUpperCase()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/action-plans/${plan.id}`}>
                                                        Details
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex items-center justify-end space-x-2 py-4">
                        <div className="flex-1 text-sm text-muted-foreground">
                            Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredPlans.length)} of {filteredPlans.length} plans
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
