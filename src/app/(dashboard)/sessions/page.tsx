'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Users, GraduationCap, Calendar, CheckCircle2, AlertTriangle, Plus } from 'lucide-react';
import { getTrainingSessions } from '@/lib/mock-service';
import { TrainingSession } from '@/types/sessions';
import { cn } from '@/lib/utils';

export default function SessionsPage() {
    const [sessions, setSessions] = useState<TrainingSession[]>([]);

    useEffect(() => {
        setSessions(getTrainingSessions());
    }, []);

    const calibrations = sessions.filter(s => s.type === 'Calibration');
    const teachBacks = sessions.filter(s => s.type === 'Teach-back');

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">QA & Training Sessions</h2>
                    <p className="text-muted-foreground">Manage Calibrations and Teach-backs to ensure team alignment.</p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    New Session
                </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Alignment</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">88%</div>
                        <p className="text-xs text-muted-foreground">
                            Target: 85% (Passing)
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Calibrations (Mo)</CardTitle>
                        <Users className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{calibrations.length}</div>
                        <p className="text-xs text-muted-foreground">
                            +2 from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Teach-backs (Mo)</CardTitle>
                        <GraduationCap className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{teachBacks.length}</div>
                        <p className="text-xs text-muted-foreground">
                            3 speakers scheduled
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="calibration" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="calibration" className="gap-2">
                        <Users className="h-4 w-4" />
                        Calibration Logs
                    </TabsTrigger>
                    <TabsTrigger value="teachback" className="gap-2">
                        <GraduationCap className="h-4 w-4" />
                        Teach-back Logs
                    </TabsTrigger>
                </TabsList>

                {/* CALIBRATION TAB */}
                <TabsContent value="calibration">
                    <Card>
                        <CardHeader>
                            <CardTitle>Calibration Sessions</CardTitle>
                            <CardDescription>
                                Verify that evaluators are aligned on the "Big 3" attributes. Target: 85%.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Conductor</TableHead>
                                        <TableHead>Tickets Evaluated</TableHead>
                                        <TableHead>Participants</TableHead>
                                        <TableHead>Team Alignment</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {calibrations.map((session) => (
                                        <TableRow key={session.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                    {session.date}
                                                </div>
                                            </TableCell>
                                            <TableCell>{session.conductor}</TableCell>
                                            <TableCell>
                                                <div className="flex gap-1 flex-wrap">
                                                    {session.calibrationResults?.ticketIds.map(t => (
                                                        <Badge key={t} variant="outline" className="text-xs font-mono">
                                                            {t}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex -space-x-2 overflow-hidden">
                                                    {session.calibrationResults?.participants.map((p, i) => (
                                                        <TooltipProvider key={i}>
                                                            <Tooltip>
                                                                <TooltipTrigger>
                                                                    <div className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-medium text-muted-foreground hover:bg-muted/80">
                                                                        {p.agentName.substring(0, 2).toUpperCase()}
                                                                    </div>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>{p.agentName}: {p.alignmentScore}%</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {session.calibrationResults && (
                                                    <div className="flex items-center gap-2">
                                                        <span className={cn(
                                                            "font-bold",
                                                            session.calibrationResults.teamAlignmentScore >= 85 ? "text-green-600" : "text-red-600"
                                                        )}>
                                                            {session.calibrationResults.teamAlignmentScore}%
                                                        </span>
                                                        {session.calibrationResults.teamAlignmentScore < 85 && (
                                                            <AlertTriangle className="h-4 w-4 text-red-500" />
                                                        )}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm">View Details</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* TEACH-BACK TAB */}
                <TabsContent value="teachback">
                    <Card>
                        <CardHeader>
                            <CardTitle>Teach-back Sessions</CardTitle>
                            <CardDescription>
                                Knowledge sharing sessions led by top performers.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Topic</TableHead>
                                        <TableHead>Speaker (Agent)</TableHead>
                                        <TableHead>Ticket Example</TableHead>
                                        <TableHead>Key Learnings</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {teachBacks.map((session) => (
                                        <TableRow key={session.id}>
                                            <TableCell className="font-medium">{session.date}</TableCell>
                                            <TableCell>{session.teachBackDetails?.topic}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <GraduationCap className="h-4 w-4 text-slate-400" />
                                                    {session.teachBackDetails?.speakerName}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="font-mono">
                                                    {session.teachBackDetails?.ticketExample}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="max-w-[300px] truncate text-muted-foreground">
                                                {session.teachBackDetails?.logicWalkthrough}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm">View Notes</Button>
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
