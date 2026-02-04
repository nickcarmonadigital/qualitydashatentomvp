'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Book, Users, Activity, Settings, Shield, FileText } from 'lucide-react';
import { InfoTooltip } from '@/components/ui/info-tooltip';

export default function ManualPage() {
    return (
        <div className="space-y-6 animate-fade-in pb-10">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Platform User Manual
                    <InfoTooltip content="Comprehensive guide for Managers and Admins on how to use the Quality Operations Dashboard." />
                </h1>
                <p className="text-muted-foreground">Master the tools and workflows of the Quality Operations Dashboard.</p>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="lss">LSS Tools</TabsTrigger>
                    <TabsTrigger value="coaching">Coaching</TabsTrigger>
                    <TabsTrigger value="admin">Admin & Config</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5 text-primary" />
                                The Quality Lifecycle
                            </CardTitle>
                            <CardDescription>Understanding the core workflow.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm text-slate-600 leading-relaxed">
                            <p>
                                The Quality Operations Dashboard is built around the <strong>Continuous Improvement Loop</strong>.
                                It integrates identification, analysis, and remediation into a single flow.
                            </p>
                            <ol className="list-decimal pl-5 space-y-2">
                                <li><strong>Input:</strong> Weekly Insights and System Data (KPIs, Quality Scores).</li>
                                <li><strong>Analysis:</strong> LSS Tools (Fishbone, 5 Whys) identify root causes.</li>
                                <li><strong>Identification:</strong> The 50/75 Rule highlights agents requiring support.</li>
                                <li><strong>Action:</strong> Coaching Sessions and Action Plans document interventions.</li>
                                <li><strong>Review:</strong> Admin dashboards track compliance and system health.</li>
                            </ol>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="lss" className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Audit Randomizer</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-slate-600">
                                <p className="mb-2"><strong>Purpose:</strong> Ensures unbiased sampling for audits.</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Upload CSV data or use system defaults.</li>
                                    <li>Generates a randomized list of tickets/calls.</li>
                                    <li>Ensures compliance with COPC sampling standards.</li>
                                </ul>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">50/75 Rule Analysis</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-slate-600">
                                <p className="mb-2"><strong>Purpose:</strong> Prioritize coaching efforts.</p>
                                <p>
                                    Identifies the bottom quartile (25%) of agents who account for 50% of the defects.
                                    Focusing on this group yields the highest ROI for coaching time.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="coaching" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-indigo-600" />
                                Coaching Management
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm text-slate-600">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="p-4 bg-slate-50 rounded-lg">
                                    <h4 className="font-semibold mb-2 text-slate-900">Logging a Session</h4>
                                    <p>
                                        Navigate to <strong>Coaching {'>'} New Session</strong>.
                                        Select the agent, coaching type (Skill vs Behavior), and document the "Commitment Statement".
                                    </p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-lg">
                                    <h4 className="font-semibold mb-2 text-slate-900">Action Plans</h4>
                                    <p>
                                        For team-wide or systemic issues, create an <strong>Action Plan</strong>.
                                        These track long-term initiatives and require leadership approval.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="admin" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-red-600" />
                                Administration
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm text-slate-600">
                            <p>
                                Admins have access to the <strong>Global Settings</strong> and <strong>User Management</strong> panels.
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>User Management:</strong> Invite new users, manage roles (Admin, QA, Agent), and deactivate accounts.</li>
                                <li><strong>System Audit:</strong> View a read-only log of all critical system actions for compliance.</li>
                                <li><strong>Configuration:</strong> Set global thresholds for KPIs and SLAs.</li>
                            </ul>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
