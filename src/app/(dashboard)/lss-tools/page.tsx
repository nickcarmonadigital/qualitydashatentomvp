'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CTXTree } from '@/components/lss-tools/CTXTree';
import { FishboneDiagram } from '@/components/lss-tools/FishboneDiagram';
import { ParetoChart } from '@/components/charts/ParetoChart';
import { ScatterPlot } from '@/components/charts/ScatterPlot';
import { Histogram } from '@/components/charts/Histogram';
import { BoxPlot } from '@/components/charts/BoxPlot';
import { Network, GitBranch, PenTool, BarChart3, ScatterChart as ScatterIcon, Sigma, Shuffle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function LSSToolsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Lean Six Sigma Tools</h2>
                <p className="text-muted-foreground">Advanced root cause analysis and metric definition workbenches.</p>
            </div>

            {/* Audit Randomizer Link Card */}
            <Link href="/lss-tools/audit-randomizer" className="block">
                <Card className="border-2 border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Shuffle className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        Audit Randomizer
                                        <Badge variant="secondary" className="text-xs">DEMO</Badge>
                                    </CardTitle>
                                    <CardDescription>
                                        Random ticket/call selector for quality audits (Enterprise feature)
                                    </CardDescription>
                                </div>
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                    </CardHeader>
                </Card>
            </Link>

            <Tabs defaultValue="ctx" className="space-y-4">
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
                        title="Top Error Categories (Last 30 Days)"
                        description="Focus on the 'Vital Few' causes that contribute to 80% of defects."
                        data={[
                            { name: 'Policy Knowledge', count: 120 },
                            { name: 'System Latency', count: 45 },
                            { name: 'Tooling Gap', count: 25 },
                            { name: 'Process Ambiguity', count: 15 },
                            { name: 'Outdated Doc', count: 10 },
                            { name: 'User Error', count: 5 }
                        ]}
                    />
                </TabsContent>

                <TabsContent value="correlation">
                    <ScatterPlot
                        title="AHT vs CSAT Correlation"
                        description="Analyzing if lower handle times are negatively impacting customer satisfaction."
                        xLabel="AHT (seconds)"
                        yLabel="CSAT (%)"
                        data={[
                            { x: 450, y: 95 },
                            { x: 480, y: 92 },
                            { x: 500, y: 88 },
                            { x: 520, y: 85 },
                            { x: 600, y: 80 },
                            { x: 650, y: 75 },
                            { x: 200, y: 60 }, // Outlier
                            { x: 550, y: 82 },
                            { x: 420, y: 98 },
                            { x: 580, y: 78 }
                        ]}
                    />
                </TabsContent>

                <TabsContent value="distributions">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Histogram
                            title="AHT Distribution"
                            description="Frequency of Handle Times (Last 100 calls)."
                            data={[
                                300, 310, 320, 315, 305, 330, 340, 325, 318,
                                400, 410, 420, 405, 390, 380, 450, 460, 470,
                                500, 510, 520, 550, 600, 610, 620, 300, 310, 320,
                                350, 360, 370, 380, 390, 400, 410, 420, 430
                            ]}
                            binCount={6}
                        />
                        <BoxPlot
                            title="Team Performance Variance"
                            description="Spread of QA Scores across the team."
                            unit="%"
                            data={[
                                85, 88, 90, 92, 95, 82, 78, 98, 99, 89, 91, 93,
                                85, 87, 88, 84, 86, 90, 92, 94, 95, 96, 97, 80
                            ]}
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
                                <Button>Start New 5 Whys Session</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
