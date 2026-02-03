'use client';

import { useState, useEffect } from 'react';
import { getAuditLogs } from '@/lib/audit/logger';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { History, UserCircle, Activity } from 'lucide-react';
import { format } from 'date-fns';

export function AuditLogViewer() {
    const [logs, setLogs] = useState<any[]>([]);

    useEffect(() => {
        setLogs(getAuditLogs());
    }, []);

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center space-x-2">
                    <History className="h-5 w-5 text-gray-500" />
                    <CardTitle>System Audit Log</CardTitle>
                </div>
                <CardDescription>Recent system activities and changes.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Timestamp</TableHead>
                            <TableHead>Actor</TableHead>
                            <TableHead>Action</TableHead>
                            <TableHead>Target</TableHead>
                            <TableHead>Details</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs.map((log) => (
                            <TableRow key={log.id}>
                                <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                                    {format(new Date(log.timestamp), 'MMM dd, HH:mm')}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center space-x-2">
                                        <UserCircle className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm font-medium">{log.actor_name}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="font-mono text-xs">
                                        {log.action}
                                    </Badge>
                                </TableCell>
                                <TableCell className="font-mono text-xs text-blue-600">
                                    {log.target_resource}
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                                    {JSON.stringify(log.details)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
