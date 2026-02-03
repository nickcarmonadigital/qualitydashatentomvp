'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Plus } from 'lucide-react';

interface IssueRow {
    id: number;
    description: string;
    impactedKpi: string;
    category: string;
}

export function CorrelatedIssuesSection() {
    const [rows, setRows] = useState<IssueRow[]>([
        { id: 1, description: '', impactedKpi: '', category: 'Process' }
    ]);

    const addRow = () => {
        setRows([...rows, { id: Date.now(), description: '', impactedKpi: '', category: 'Process' }]);
    };

    const removeRow = (id: number) => {
        setRows(rows.filter(r => r.id !== id));
    };

    return (
        <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-md border border-blue-100 text-sm text-blue-800 mb-4">
                <strong>Guidance:</strong> Focus on patterns, not anecdotes. Link specific bugs or process gaps to measurable KPI dips.
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50%]">Issue Description (What/Why)</TableHead>
                        <TableHead>Impacted KPI</TableHead>
                        <TableHead>Root Cause Category</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell>
                                <Input placeholder="e.g. 'Payment API Timeout causing high AHT'" />
                            </TableCell>
                            <TableCell>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select KPI" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pass_rate">Quality Pass Rate</SelectItem>
                                        <SelectItem value="csat">CSAT</SelectItem>
                                        <SelectItem value="aht">AHT</SelectItem>
                                    </SelectContent>
                                </Select>
                            </TableCell>
                            <TableCell>
                                <Select defaultValue={row.category}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="People">People (Training)</SelectItem>
                                        <SelectItem value="Process">Process (SOP)</SelectItem>
                                        <SelectItem value="Technology">Technology (Bug)</SelectItem>
                                        <SelectItem value="Environment">Environment</SelectItem>
                                    </SelectContent>
                                </Select>
                            </TableCell>
                            <TableCell>
                                {rows.length > 1 && (
                                    <Button variant="ghost" size="icon" onClick={() => removeRow(row.id)}>
                                        <Trash2 className="h-4 w-4 text-slate-500 hover:text-red-500" />
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Button variant="outline" size="sm" onClick={addRow} className="mt-2">
                <Plus className="mr-2 h-4 w-4" />
                Add Linked Issue
            </Button>
        </div>
    );
}
