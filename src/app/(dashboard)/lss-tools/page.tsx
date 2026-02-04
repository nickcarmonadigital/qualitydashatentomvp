'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CTXTree } from '@/components/lss-tools/CTXTree';
import { FishboneDiagram } from '@/components/lss-tools/FishboneDiagram';
import { ParetoChart } from '@/components/charts/ParetoChart';
import { ScatterPlot } from '@/components/charts/ScatterPlot';
import { Histogram } from '@/components/charts/Histogram';
import { BoxPlot } from '@/components/charts/BoxPlot';
import { getTeamLSSData } from '@/lib/mock-service';
import { Network, GitBranch, PenTool, BarChart3, ScatterChart as ScatterIcon, Sigma, Shuffle, ArrowRight, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { PageGuide } from '@/components/ui/page-guide';

export default function LSSToolsPage() {
    const searchParams = useSearchParams();
    const [lssData, setLssData] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('ctx');
    const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

    useEffect(() => {
        setLssData(getTeamLSSData(selectedTeam));

        // Sync tab with URL
        const tabParam = searchParams.get('tab');
        if (tabParam) {
            setActiveTab(tabParam);
        }
    }, [searchParams, selectedTeam]);

    if (!lssData) {
        return <div className="p-8 text-center">Loading LSS data...</div>;
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                        Six Sigma Tools
                        <PageGuide
                            title="Six Sigma Toolkit"
                            description="Standardized problem-solving templates for root cause analysis and process improvement."
                            items={['Audit Randomizer', 'Fishbone Diagram', '5 Whys Analysis']}
                        />
                    </h2>
                    <p className="text-muted-foreground">Standardized problem solving templates</p>
                </div>
                {selectedTeam && (
                    <Button variant="ghost" onClick={() => setSelectedTeam(null)} className="text-muted-foreground hover:text-primary">
                        Clear Team Filter ({selectedTeam})
                    </Button>
                )}
            </div>

            {/* Team Stats Summary */}
            <div className="grid gap-4 md:grid-cols-4">
                {lssData.teamStats?.map((team: any) => (
                    <Card
                        key={team.team}
                        className={`cursor-pointer transition-all hover:shadow-md ${selectedTeam === team.team ? 'ml-0 border-primary bg-primary/5 shadow-md' : 'hover:bg-slate-50'}`}
                        onClick={() => setSelectedTeam(selectedTeam === team.team ? null : team.team)}
                    >
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Users className={`h-4 w-4 ${selectedTeam === team.team ? 'text-primary' : 'text-slate-500'}`} />
                                {team.team}
                                {selectedTeam === team.team && <Badge variant="default" className="ml-auto text-xs py-0 h-5">Selected</Badge>}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{team.avgScore}%</div>
                            <p className="text-xs text-muted-foreground">
                                {team.agentCount} agents · {team.coachingSessions} coaching sessions
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Audit Randomizer Link Card */}
            <div className="flex items-center justify-end">
                <Link href="/lss-tools/audit-randomizer" className="inline-block">
                    <Button variant="outline" className="gap-2 border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800">
                        <Shuffle className="h-4 w-4" />
                        Launch Audit Randomizer
                        <div className="ml-2 bg-blue-200 text-blue-800 text-[10px] px-1.5 py-0.5 rounded-full font-bold">DEMO</div>
                    </Button>
                </Link>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList>
                    <TabsTrigger value="ctx" className="flex items-center gap-2">
                        <Network className="h-4 w-4" />
                        CTX Tree
                    </TabsTrigger>
                    <TabsTrigger value="fishbone" className="flex items-center gap-2">
                        <GitBranch className="h-4 w-4" />
                        Fishbone Diagram
                    </TabsTrigger>
                    <TabsTrigger value="pareto" className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Pareto Analysis
                    </TabsTrigger>
                    <TabsTrigger value="correlation" className="flex items-center gap-2">
                        <ScatterIcon className="h-4 w-4" />
                        Correlation
                    </TabsTrigger>
                    <TabsTrigger value="distributions" className="flex items-center gap-2">
                        <Sigma className="h-4 w-4" />
                        Distributions
                    </TabsTrigger>
                    <TabsTrigger value="5whys" className="flex items-center gap-2">
                        <PenTool className="h-4 w-4" />
                        5 Whys
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="ctx">
                    <Card>
                        <CardHeader>
                            <CardTitle>CTX Tree (Critical to X)</CardTitle>
                            <CardDescription>Map Voice of Customer (VoC) to specific internal metrics (CTQ/CTX).</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CTXTree />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="fishbone">
                    <Card>
                        <CardHeader>
                            <CardTitle>Fishbone Diagram (Ishikawa)</CardTitle>
                            <CardDescription>Identify potential root causes for a specific problem statement.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FishboneDiagram />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="pareto">
                    <ParetoChart
                        title="Coaching Issues by Type (All Teams)"
                        description={`Root cause analysis based on ${lssData.paretoData?.reduce((acc: number, p: any) => acc + p.count, 0) || 0} coaching sessions across all teams.`}
                        data={lssData.paretoData || []}
                    />
                </TabsContent>

                <TabsContent value="correlation">
                    <ScatterPlot
                        title="AHT vs CSAT Correlation (All Agents)"
                        description={`Analyzing ${lssData.scatterData?.length || 0} agents to identify if handle time impacts satisfaction.`}
                        xLabel="AHT (seconds)"
                        yLabel="CSAT (%)"
                        data={lssData.scatterData?.map((d: any) => ({ x: d.x, y: d.y })) || []}
                    />
                </TabsContent>

                <TabsContent value="distributions">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Histogram
                            title="Quality Score Distribution"
                            description={`Frequency distribution of ${lssData.histogramData?.length || 0} QA scores across all agents.`}
                            data={lssData.histogramData || []}
                            binCount={8}
                        />
                        <BoxPlot
                            title="Team Performance Variance"
                            description="QA score spread across all four teams."
                            unit="%"
                            data={lssData.boxPlotData?.['Team Alpha'] || lssData.histogramData?.slice(0, 30) || []}
                        />
                    </div>
                </TabsContent>

                <TabsContent value="5whys">
                    <Card>
                        <CardHeader>
                            <CardTitle>5 Whys Analysis</CardTitle>
                            <CardDescription>Iterative interrogative technique used to explore the cause-and-effect relationships.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-4">
                                <div className="p-4 border rounded-md bg-muted/50">
                                    <h3 className="font-semibold mb-2">Problem Statement</h3>
                                    <p className="text-sm text-muted-foreground">Define the problem clearly...</p>
                                </div>
                                {/* Placeholder for interactive 5 Whys tool */}
                                <Button onClick={() => {
                                    const problem = prompt("Enter the problem statement:");
                                    if (problem) {
                                        alert(`5 Whys Analysis Started!\n\nProblem: ${problem}\n\nWhy 1: _____\nWhy 2: _____\nWhy 3: _____\nWhy 4: _____\nWhy 5: _____\n\nInteractive 5 Whys builder coming soon!`);
                                    }
                                }}>Start New 5 Whys Session</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
