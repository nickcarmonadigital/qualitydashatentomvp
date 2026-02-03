'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getMockData } from '@/lib/mock-service';
import { pickAuditTargets, AuditAssignment, pickFromCSVData, CSVTicketData } from '@/lib/lss/audit-picker';
import { RefreshCcw, AlertCircle, Ticket, Upload, Download, FileSpreadsheet, X, Check } from 'lucide-react';

// Sample CSV template content
const SAMPLE_CSV = `agent_name,agent_team,ticket_id,timestamp,category
John Smith,Support Team A,TKT-2024-0001,2024-02-01 10:30,Billing Inquiry
John Smith,Support Team A,TKT-2024-0002,2024-02-01 11:45,Technical Support
John Smith,Support Team A,TKT-2024-0003,2024-02-01 14:20,Account Issue
Sarah Johnson,Support Team A,TKT-2024-0004,2024-02-01 09:15,Refund Request
Sarah Johnson,Support Team A,TKT-2024-0005,2024-02-01 12:00,Password Reset
Sarah Johnson,Support Team A,TKT-2024-0006,2024-02-01 15:30,General Inquiry
Mike Williams,Support Team B,TKT-2024-0007,2024-02-02 08:45,Technical Support
Mike Williams,Support Team B,TKT-2024-0008,2024-02-02 10:00,Billing Inquiry
Mike Williams,Support Team B,TKT-2024-0009,2024-02-02 13:15,Account Issue
Emily Davis,Support Team B,TKT-2024-0010,2024-02-02 09:30,Refund Request
Emily Davis,Support Team B,TKT-2024-0011,2024-02-02 11:00,Product Question
Emily Davis,Support Team B,TKT-2024-0012,2024-02-02 14:45,Shipping Delay`;

export default function AuditRandomizerPage() {
    const [assignments, setAssignments] = useState<AuditAssignment[]>([]);
    const [csvData, setCsvData] = useState<CSVTicketData[]>([]);
    const [fileName, setFileName] = useState<string>('');
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const generateAssignments = () => {
        if (csvData.length > 0) {
            // Use CSV data
            const picks = pickFromCSVData(csvData, 3);
            setAssignments(picks);
        } else {
            // Use mock data
            const { agents } = getMockData();
            const picks = pickAuditTargets(agents, 3);
            setAssignments(picks);
        }
    };

    useEffect(() => {
        generateAssignments();
    }, [csvData]);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.name.endsWith('.csv')) {
            setUploadStatus('error');
            setErrorMessage('Please upload a CSV file');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result as string;
                const parsed = parseCSV(text);

                if (parsed.length < 2) {
                    setUploadStatus('error');
                    setErrorMessage('CSV must contain at least 2 rows of data');
                    return;
                }

                setCsvData(parsed);
                setFileName(file.name);
                setUploadStatus('success');
                setErrorMessage('');
            } catch (err) {
                setUploadStatus('error');
                setErrorMessage('Failed to parse CSV file. Please check the format.');
            }
        };
        reader.readAsText(file);
    };

    const parseCSV = (text: string): CSVTicketData[] => {
        const lines = text.trim().split('\n');
        const headers = lines[0].toLowerCase().split(',').map(h => h.trim());

        // Validate required columns
        const requiredColumns = ['agent_name', 'ticket_id'];
        for (const col of requiredColumns) {
            if (!headers.includes(col)) {
                throw new Error(`Missing required column: ${col}`);
            }
        }

        const data: CSVTicketData[] = [];
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            if (values.length >= headers.length) {
                data.push({
                    agentName: values[headers.indexOf('agent_name')] || '',
                    agentTeam: values[headers.indexOf('agent_team')] || 'Unknown Team',
                    ticketId: values[headers.indexOf('ticket_id')] || '',
                    timestamp: values[headers.indexOf('timestamp')] || '',
                    category: values[headers.indexOf('category')] || 'General',
                });
            }
        }
        return data;
    };

    const downloadTemplate = () => {
        const blob = new Blob([SAMPLE_CSV], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'audit_randomizer_template.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    const clearUpload = () => {
        setCsvData([]);
        setFileName('');
        setUploadStatus('idle');
        setErrorMessage('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h2 className="text-3xl font-bold tracking-tight">Audit Randomizer</h2>
                        <Badge variant="secondary" className="text-sm px-3 py-1">
                            DEMO FEATURE
                        </Badge>
                    </div>
                    <p className="text-muted-foreground">
                        Random ticket/call selector for quality audits
                    </p>
                </div>
                <Button onClick={generateAssignments}>
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    Regenerate
                </Button>
            </div>

            {/* Disclaimer */}
            <div className="border-l-4 border-amber-500 bg-amber-50 p-4 rounded-r">
                <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm text-amber-900 font-medium">Enterprise Feature</p>
                        <p className="text-sm text-amber-800">
                            This feature is available for contracts that permit client data integration.
                            Not currently enabled for TikTok contract.
                        </p>
                    </div>
                </div>
            </div>

            {/* CSV Upload Section */}
            <Card className="border-2 border-dashed border-blue-300 bg-blue-50/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <FileSpreadsheet className="w-5 h-5" />
                        Import Data
                    </CardTitle>
                    <CardDescription>
                        Upload a CSV file with agent and ticket data to randomize from your actual support data
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-3">
                        {/* File Upload */}
                        <div className="flex-1 min-w-[200px]">
                            <Label htmlFor="csv-upload" className="sr-only">Upload CSV</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="csv-upload"
                                    type="file"
                                    accept=".csv"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    className="cursor-pointer"
                                />
                                {fileName && (
                                    <Button variant="ghost" size="icon" onClick={clearUpload}>
                                        <X className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Download Template */}
                        <Button variant="outline" onClick={downloadTemplate}>
                            <Download className="w-4 h-4 mr-2" />
                            Download Template
                        </Button>
                    </div>

                    {/* Upload Status */}
                    {uploadStatus === 'success' && (
                        <div className="flex items-center gap-2 text-green-600 text-sm">
                            <Check className="w-4 h-4" />
                            <span>Loaded <strong>{csvData.length}</strong> tickets from <strong>{fileName}</strong></span>
                        </div>
                    )}
                    {uploadStatus === 'error' && (
                        <div className="flex items-center gap-2 text-red-600 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    {/* Template Info */}
                    <div className="text-xs text-muted-foreground bg-white p-3 rounded border">
                        <p className="font-medium mb-1">Required CSV columns:</p>
                        <code className="text-blue-600">agent_name, ticket_id</code>
                        <p className="mt-1">Optional: <code className="text-slate-500">agent_team, timestamp, category</code></p>
                    </div>
                </CardContent>
            </Card>

            {/* Data Source Indicator */}
            {csvData.length > 0 ? (
                <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded border border-green-200">
                    <Upload className="w-4 h-4" />
                    <span>Using uploaded data ({csvData.length} tickets from {new Set(csvData.map(d => d.agentName)).size} agents)</span>
                </div>
            ) : (
                <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 p-3 rounded border">
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Using demo data (no CSV uploaded)</span>
                </div>
            )}

            {/* Audit Assignments */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Audit Assignments</h3>
                <div className="grid gap-4">
                    {assignments.map((assignment, idx) => (
                        <Card key={idx} className="border-2">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-semibold text-lg">{assignment.agent.name}</h4>
                                        <p className="text-sm text-muted-foreground">{assignment.agent.team}</p>
                                    </div>
                                    <Badge
                                        variant={assignment.reason === 'Bottom Quartile' ? 'destructive' : 'secondary'}
                                        className="text-sm"
                                    >
                                        {assignment.reason}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground mb-3">
                                        Tickets/Calls to Audit:
                                    </p>
                                    {assignment.ticketsToAudit.map((ticket, ticketIdx) => (
                                        <div
                                            key={ticketIdx}
                                            className="flex items-center justify-between bg-slate-50 p-3 rounded border hover:bg-slate-100 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Ticket className="w-4 h-4 text-muted-foreground" />
                                                <div>
                                                    <p className="font-mono text-sm font-medium">{ticket.ticketId}</p>
                                                    <p className="text-xs text-muted-foreground">{ticket.category}</p>
                                                </div>
                                            </div>
                                            <span className="text-xs text-muted-foreground">{ticket.timestamp}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Export Section */}
            <Card className="bg-slate-50">
                <CardContent className="pt-6">
                    <div className="text-center text-sm text-muted-foreground">
                        <p>In production, you would export this list to your QA team or integrate with your ticketing system.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
