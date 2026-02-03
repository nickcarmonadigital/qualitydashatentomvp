'use client';

import { useEffect, useState } from 'react';
import { getAgents, getScores, getKPIs } from '@/lib/mock-service';
import { Agent, Score, KPI } from '@/types/domain';
import { analyze5075, Rule5075Result } from '@/lib/lss/fifty-seventy-five';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertCircle, CheckCircle, HelpCircle, Download } from 'lucide-react';
import { exportToCSV } from '@/lib/export';
import { Button } from '@/components/ui/button';

interface AnalysisRow {
    agentName: string;
    agentTeam: string;
    median: number;
    result: Rule5075Result;
    q1: number;
    q3: number;
}

export default function FiftySeventyFivePage() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [scores, setScores] = useState<Score[]>([]);
    const [kpis, setKPIs] = useState<KPI[]>([]);
    const [selectedKpiId, setSelectedKpiId] = useState<string>('');
    const [analysis, setAnalysis] = useState<AnalysisRow[]>([]);

    useEffect(() => {
        setAgents(getAgents());
        setScores(getScores());
        const allKpis = getKPIs();
        setKPIs(allKpis);
        if (allKpis.length > 0) setSelectedKpiId(allKpis[0].id);
    }, []);

    useEffect(() => {
        if (!selectedKpiId || agents.length === 0) return;

        const currentKpi = kpis.find(k => k.id === selectedKpiId);
        if (!currentKpi) return;

        // Perform Analysis for each agent
        const results: AnalysisRow[] = agents.map(agent => {
            // Get last 20 scores for this KPI
            const agentScores = scores
                .filter(s => s.agent_id === agent.id && s.kpi_id === selectedKpiId)
                .map(s => s.value);

            if (agentScores.length < 5) {
                return {
                    agentName: agent.name,
                    agentTeam: agent.team,
                    median: 0,
                    result: 'INCONSISTENT', // Default/Fallback
                    q1: 0,
                    q3: 0
                };
            }

            const isHigherBetter = currentKpi.name !== 'AHT'; // Rough logic for demo
            const analysis = analyze5075(agentScores, currentKpi.target, isHigherBetter);

            return {
                agentName: agent.name,
                agentTeam: agent.team,
                median: analysis.median,
                result: analysis.result,
                q1: analysis.quartiles.q1,
                q3: analysis.quartiles.q3
            };
        });

        // Sort by result (Incapable first)
        setAnalysis(results.sort((a, b) => a.median - b.median));
    }, [selectedKpiId, agents, scores, kpis]);

    const [showFocusOnly, setShowFocusOnly] = useState(true);

    const filteredAnalysis = (showFocusOnly
        ? analysis.filter(a => a.result !== 'CAPABLE')
        : analysis).sort((a, b) => {
            const p: Record<string, number> = { 'INCAPABLE': 0, 'INCONSISTENT': 1, 'CAPABLE': 2 };
            return (p[a.result] ?? 2) - (p[b.result] ?? 2);
        });

    const getStatusBadge = (status: Rule5075Result) => {
        switch (status) {
            case 'CAPABLE':
                return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle className="w-3 h-3 mr-1" /> Capable</Badge>;
            case 'INCAPABLE':
                return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" /> Incapable</Badge>;
            case 'INCONSISTENT':
                return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200"><HelpCircle className="w-3 h-3 mr-1" /> Inconsistent</Badge>;
        }
    };

    const handleExport = () => {
        const data = analysis.map(row => ({
            Agent: row.agentName,
            Team: row.agentTeam,
            Status: row.result,
            Median: row.median,
            Q1: row.q1,
            Q3: row.q3
        }));
        exportToCSV(data, '50_75_analysis_export');
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">50/75 Rule Analysis (Q3 & Q4 Focus)</h2>
                    <p className="text-muted-foreground">Diagnostic tool to identify and support agents in the 3rd and 4th Quartiles (Below Median).</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 mr-4">
                        <Button
                            variant={showFocusOnly ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => setShowFocusOnly(!showFocusOnly)}
                        >
                            {showFocusOnly ? "Showing Q3/Q4 Only" : "Showing All Agents"}
                        </Button>
                    </div>
                    <Button variant="outline" onClick={handleExport} disabled={analysis.length === 0}>
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
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
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Process Capable</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {analysis.filter(r => r.result === 'CAPABLE').length} Agents
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Consistency Issues (VSF/Gap)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">
                            {analysis.filter(r => r.result === 'INCONSISTENT').length} Agents
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Process Incapable (Shift Mean)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                            {analysis.filter(r => r.result === 'INCAPABLE').length} Agents
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Detailed Agent Analysis</CardTitle>
                    <CardDescription>
                        Breakdown of Median (50th) and Q1/Q3 performance against target.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Agent</TableHead>
                                <TableHead>Team</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Median (50th)</TableHead>
                                <TableHead className="text-right">Q1 (25th)</TableHead>
                                <TableHead className="text-right">Q3 (75th)</TableHead>
                                <TableHead>Recommendation</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAnalysis.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                                        No agents found matching criteria.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredAnalysis.map((row, i) => (
                                    <TableRow key={i}>
                                        <TableCell className="font-medium">{row.agentName}</TableCell>
                                        <TableCell>{row.agentTeam}</TableCell>
                                        <TableCell>{getStatusBadge(row.result)}</TableCell>
                                        <TableCell className="text-right font-mono">{row.median.toFixed(1)}</TableCell>
                                        <TableCell className="text-right text-muted-foreground">{row.q1.toFixed(1)}</TableCell>
                                        <TableCell className="text-right text-muted-foreground">{row.q3.toFixed(1)}</TableCell>
                                        <TableCell className="text-sm">
                                            {row.result === 'INCAPABLE' ? 'Coaching on Basics / Knowledge' :
                                                row.result === 'INCONSISTENT' ? 'Focus on Workflow / Standardization' :
                                                    'Maintain / Reward'}
                                        </TableCell>
                                    </TableRow>
                                )))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
