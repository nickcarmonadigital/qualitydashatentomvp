'use client';

import { useEffect, useState } from 'react';
import { getAgents, getKPIs, getScores } from '@/lib/mock-service'; // mock service needs to stay lightweight
import { Agent, KPI, Score } from '@/types/domain';
import { analyzeAnnualTrend, analyzeWeeklyMonitor, AnnualTrendResult, WeeklyMonitorResult } from '@/lib/lss/fifty-seventy-five';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { PageGuide } from '@/components/ui/page-guide';

export default function FiftySeventyFivePage() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [kpis, setKPIs] = useState<KPI[]>([]);
    const [selectedKpiId, setSelectedKpiId] = useState<string>('');

    // Analysis State
    const [weeklyData, setWeeklyData] = useState<{ agent: Agent, analysis: WeeklyMonitorResult }[]>([]);
    const [annualData, setAnnualData] = useState<{ agent: Agent, analysis: AnnualTrendResult }[]>([]);

    useEffect(() => {
        setAgents(getAgents());
        const allKpis = getKPIs();
        setKPIs(allKpis);
        if (allKpis.length > 0) setSelectedKpiId(allKpis[0].id);
    }, []);

    // Simulate/Aggregate Data when KPI changes
    useEffect(() => {
        if (!selectedKpiId || agents.length === 0) return;

        const currentKpi = kpis.find(k => k.id === selectedKpiId);
        if (!currentKpi) return;

        const isHigherBetter = currentKpi.name !== 'AHT';
        const allScores = getScores();

        // Generate Analysis for each agent
        const wData = [];
        const aData = [];

        for (const agent of agents) {
            // Get REAL mock scores for this agent & KPI
            const agentScores = allScores
                .filter(s => s.agent_id === agent.id && s.kpi_id === selectedKpiId)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            // 1. Weekly Data (Use last 4 mock scores, or pad if missing)
            // We need 4 data points. 
            const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'].map((w, i) => {
                // If we have data, use it. If not, generate deterministic value based on ID
                // Reverse index because scores are sorted desc (newest first)
                // We want Week 4 to be latest
                const scoreIdx = 3 - i;
                let val = 0;

                if (agentScores[i]) {
                    val = agentScores[i].value;
                } else {
                    // Fallback: Deterministic generation based on Agent ID chars
                    const seed = agent.id.charCodeAt(0) + agent.id.charCodeAt(agent.id.length - 1) + i;
                    const base = isHigherBetter ? 82 : 450;
                    val = base + (seed % 15) * (isHigherBetter ? 1 : 10);
                }

                return {
                    week: w,
                    value: Math.round(val)
                };
            });
            const wAnalysis = analyzeWeeklyMonitor(weeks, currentKpi.target, isHigherBetter);
            wData.push({ agent, analysis: wAnalysis });

            // 2. Annual Data (Last 6 months)
            const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'].map((m, i) => {
                // Deterministic trend simulation
                const seed = agent.id.charCodeAt(0) + i;
                const trend = (i % 2 === 0) ? 2 : -1; // Zig zag trend
                const base = wAnalysis.mtdAverage; // Anchor to the weekly average
                const val = base + trend + (seed % 5);

                return {
                    month: m,
                    value: Math.round(val)
                };
            });
            const aAnalysis = analyzeAnnualTrend(months, currentKpi.target, isHigherBetter);
            aData.push({ agent, analysis: aAnalysis });
        }

        setWeeklyData(wData);
        setAnnualData(aData);

    }, [selectedKpiId, agents, kpis]);

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        50/75 Rule Analysis
                        <PageGuide
                            title="50/75 Rule Analysis"
                            description="Identify structural performance issues. Compare bottom quartile agents against the team average to isolate skill vs. will gaps."
                            items={['Quartile Comparison', 'Trend Visualization', 'Intervention recommendations']}
                        />
                    </h2>
                    <p className="text-muted-foreground">Tactical weekly monitoring and strategic annual trending.</p>
                </div>
                <div className="w-[300px]">
                    <Select value={selectedKpiId} onValueChange={setSelectedKpiId}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select KPI" />
                        </SelectTrigger>
                        <SelectContent>
                            {kpis.map(k => (
                                <SelectItem key={k.id} value={k.id}>{k.name} (Target: {k.target})</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Tabs defaultValue="weekly" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="weekly">Weekly Monitor (Tactical)</TabsTrigger>
                    <TabsTrigger value="annual">Annual Trend (Strategic)</TabsTrigger>
                </TabsList>

                {/* WEEKLY VIEW */}
                <TabsContent value="weekly" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Intervention Required</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-600">
                                    {weeklyData.filter(d => d.analysis.status === 'Intervention Required').length} Agents
                                </div>
                                <p className="text-xs text-muted-foreground">High priority coaching needed</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">At Risk</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-yellow-600">
                                    {weeklyData.filter(d => d.analysis.status === 'At Risk').length} Agents
                                </div>
                                <p className="text-xs text-muted-foreground">Failing MTD Average</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">On Track</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">
                                    {weeklyData.filter(d => d.analysis.status === 'On Track').length} Agents
                                </div>
                                <p className="text-xs text-muted-foreground">Meeting weekly targets</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Weekly Performance Matrix</CardTitle>
                            <CardDescription>Performance by week for current month. Fix issues before month-end.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Agent</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Week 1</TableHead>
                                        <TableHead className="text-right">Week 2</TableHead>
                                        <TableHead className="text-right">Week 3</TableHead>
                                        <TableHead className="text-right">Week 4</TableHead>
                                        <TableHead className="text-right font-bold">MTD Avg</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {weeklyData.map((row, i) => (
                                        <TableRow key={i}>
                                            <TableCell className="font-medium">{row.agent.name}</TableCell>
                                            <TableCell>
                                                <Badge variant={
                                                    row.analysis.status === 'Intervention Required' ? 'destructive' :
                                                        row.analysis.status === 'At Risk' ? 'secondary' : 'default'
                                                } className={
                                                    row.analysis.status === 'At Risk' ? 'bg-yellow-100 text-yellow-800' :
                                                        row.analysis.status === 'On Track' ? 'bg-green-100 text-green-800' : ''
                                                }>
                                                    {row.analysis.status}
                                                </Badge>
                                            </TableCell>
                                            {row.analysis.weeks.map((w, idx) => (
                                                <TableCell key={idx} className={w.metTarget ? 'text-green-600 text-right' : 'text-red-500 font-medium text-right'}>
                                                    {w.value}
                                                </TableCell>
                                            ))}
                                            <TableCell className="text-right font-bold">{row.analysis.mtdAverage.toFixed(1)}</TableCell>
                                            <TableCell className="text-right">
                                                {row.analysis.status !== 'On Track' && (
                                                    <Link href={`/coaching/new?agentId=${row.agent.id}`}>
                                                        <Button size="sm" variant="ghost" className="h-8">
                                                            Coach <ArrowRight className="ml-2 h-3 w-3" />
                                                        </Button>
                                                    </Link>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ANNUAL VIEW */}
                <TabsContent value="annual" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Annual Strategic Trend (6-Month Lookback)</CardTitle>
                            <CardDescription>
                                Rule 1: 75% Compliance (5/6 Months). Rule 2: Consistent Improvement (2nd Half {'>'} 1st Half).
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Agent</TableHead>
                                        <TableHead>75% Rule</TableHead>
                                        <TableHead>Improvement Rule</TableHead>
                                        <TableHead className="text-right">History</TableHead>
                                        <TableHead className="text-right">Trend</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {annualData.map((row, i) => (
                                        <TableRow key={i}>
                                            <TableCell className="font-medium">{row.agent.name}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {row.analysis.compliance.pass ?
                                                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Pass</Badge> :
                                                        <Badge variant="destructive">Fail</Badge>
                                                    }
                                                    <span className="text-xs text-muted-foreground">({row.analysis.compliance.monthsMet}/6)</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {row.analysis.improvement.pass ?
                                                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Pass</Badge> :
                                                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Fail</Badge>
                                                    }
                                                    <span className="text-xs text-muted-foreground">
                                                        ({row.analysis.improvement.secondHalfAvg.toFixed(0)} vs {row.analysis.improvement.firstHalfAvg.toFixed(0)})
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    {row.analysis.monthlyValues.map((m, idx) => (
                                                        <div key={idx}
                                                            className={`w-6 h-6 flex items-center justify-center text-[10px] rounded ${m.metTarget ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                                                            title={`${m.month}: ${m.value}`}
                                                        >
                                                            {m.month[0]}
                                                        </div>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className={`flex items-center justify-end ${row.analysis.improvement.trend > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                                    {row.analysis.improvement.trend > 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                                                    {Math.abs(row.analysis.improvement.trend).toFixed(1)}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
