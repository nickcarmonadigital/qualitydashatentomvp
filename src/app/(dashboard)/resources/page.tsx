'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, ExternalLink, BookOpen, Scale, Users } from 'lucide-react';
import { toast } from 'sonner';

const resources = [
    {
        id: 'sop-coaching',
        title: 'SOP: Coaching Execution',
        description: 'Standard Operating Procedure for conducting effective coaching sessions using the Trilevel Model.',
        category: 'Coaching',
        icon: Users,
        lastUpdated: '2025-01-15',
        type: 'PDF'
    },
    {
        id: 'sop-calibration',
        title: 'SOP: QA Calibration & Teach-back Sessions',
        description: 'Guidelines for running calibration sessions and scoring alignment.',
        category: 'Quality',
        icon: Scale,
        lastUpdated: '2025-01-20',
        type: 'PDF'
    },
    {
        id: 'wi-calibration',
        title: 'WI: QA Calibration Dynamics',
        description: 'Work Instructions for the "Focus Method" ticket selection and weighted scoring.',
        category: 'Quality',
        icon: BookOpen,
        lastUpdated: '2025-01-20',
        type: 'PDF'
    },
    {
        id: 'quality-guide',
        title: 'Quality Definitions Guide',
        description: 'Complete definitions for all quality attributes and scoring criteria.',
        category: 'Reference',
        icon: FileText,
        lastUpdated: '2024-12-01',
        type: 'PDF'
    }
];

const getCategoryBadge = (category: string) => {
    const styles: Record<string, string> = {
        Coaching: 'bg-blue-100 text-blue-800',
        Quality: 'bg-green-100 text-green-800',
        Reference: 'bg-slate-100 text-slate-800'
    };
    return <Badge className={styles[category] || 'bg-gray-100'}>{category}</Badge>;
};

export default function ResourcesPage() {
    const handleDownload = (title: string) => {
        // In a real app, this would trigger a file download
        alert(`Download: ${title}\n\nNote: This is a demo. In production, this would download the actual PDF.`);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3">
                <BookOpen className="h-8 w-8 text-slate-600" />
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Resources</h2>
                    <p className="text-muted-foreground">SOPs, Work Instructions, and Quality Guides</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Document Library</CardTitle>
                    <CardDescription>
                        Access all quality and coaching documentation. These are the source of truth for COPC compliance.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        {resources.map((resource) => (
                            <Card key={resource.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-slate-100 rounded-lg">
                                            <resource.icon className="h-6 w-6 text-slate-600" />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-semibold text-slate-900">{resource.title}</h3>
                                                {getCategoryBadge(resource.category)}
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {resource.description}
                                            </p>
                                            <div className="flex items-center justify-between pt-2">
                                                <span className="text-xs text-muted-foreground">
                                                    Updated: {resource.lastUpdated}
                                                </span>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDownload(resource.title)}
                                                    >
                                                        <Download className="h-3 w-3 mr-1" />
                                                        {resource.type}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Upload Section (Placeholder) */}
            <Card className="border-dashed">
                <CardContent className="p-8 text-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="p-4 bg-slate-100 rounded-full">
                            <FileText className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="font-semibold text-slate-700">Upload New Document</h3>
                        <p className="text-sm text-muted-foreground max-w-md">
                            Drag and drop a PDF here, or click to browse. Documents will be available to all team members.
                        </p>
                        <Button variant="outline" className="mt-2" onClick={() => {
                            toast.info("Upload Feature Locked", {
                                description: "Document upload is restricted to Admin users in this demo environment."
                            });
                        }}>
                            Browse Files
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
