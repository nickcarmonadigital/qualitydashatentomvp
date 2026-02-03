'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuditLogViewer } from '@/components/audit/AuditLogViewer';
import { useParams, useRouter } from 'next/navigation'; // Correct hook for Next.js App Router params
import { getAgentById } from '@/lib/mock-service';
import { Agent, Score, KPI } from '@/types/domain';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, TrendingUp, AlertTriangle } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { TrendChart } from '@/components/dashboard/TrendChart';

export default function AgentDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [data, setData] = useState<{ agent: Agent, scores: Score[], kpis: KPI[] } | null>(null);

    useEffect(() => {
        if (params.id) {
            const result = getAgentById(params.id as string);
            if (result) {
                setData(result);
            }
        }
    }, [params.id]);

    if (!data) {
        return <div className="p-8">Loading agent data...</div>;
    }

    const { agent, scores, kpis } = data;

    // Helper to get formatted chart data (last 8 weeks of QA Score for example)
    // For now, let's just plot all available scores for the first KPI found
    const targetKpi = kpis[0]; // Usually "QA Score" or similar
    const chartData = scores
        .filter(s => s.kpi_id === targetKpi.id)
        .slice(0, 10)
        .reverse()
        .map(s => ({
            date: s.date,
            value: s.value
        }));

    return (
        <div className="space-y-6">
            <div>
                <Button variant="ghost" onClick={() => router.back()} className="mb-4 pl-0 hover:bg-transparent hover:underline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Agents
                </Button>
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-slate-200 flex items-center justify-center">
                            <User className="h-8 w-8 text-slate-500" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">{agent.name}</h2>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <span>{agent.role}</span>
                                <span>•</span>
                                <span>{agent.team} Team</span>
                                <span>•</span>
                                <span>{agent.tenure_days} days tenure</span>
                            </div>
                        </div>
                    </div>
                    <Badge variant={agent.status === 'active' ? 'default' : 'secondary'} className="text-lg px-4 py-1">
                        {agent.status.toUpperCase()}
                    </Badge>
                </div>
            </div>

            <Tabs defaultValue="overview" className="w-full">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="history">History & Audit Log</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 mt-4">
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Current Performance</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">92.5%</div>
                                <p className="text-xs text-muted-foreground">+2.1% from last month</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Compliance Risk</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">Low</div>
                                <p className="text-xs text-muted-foreground">0 Critical Errors this month</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Coaching Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-orange-600">Active</div>
                                <p className="text-xs text-muted-foreground">Due for follow-up on Feb 10</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <div className="col-span-4">
                            <TrendChart
                                title={`Performance Trend (${targetKpi.name})`}
                                data={chartData}
                                showTrendAnalysis={true}
                                height={350}
                            />
                        </div>

                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Recent Evaluations</CardTitle>
                                <CardDescription>Latest scored interactions.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>KPI</TableHead>
                                            <TableHead>Score</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {scores.slice(0, 5).map((score) => {
                                            const kpi = kpis.find(k => k.id === score.kpi_id);
                                            return (
                                                <TableRow key={score.id}>
                                                    <TableCell className="font-medium">{score.date}</TableCell>
                                                    <TableCell>{kpi?.name || 'Unknown KPI'}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={score.value < 85 ? "destructive" : "outline"}>
                                                            {score.value}%
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="history" className="mt-4">
                    <AuditLogViewer />
                </TabsContent>
            </Tabs>
        </div>
    );
}
