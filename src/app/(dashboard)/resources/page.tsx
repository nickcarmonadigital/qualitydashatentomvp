'use client';

import { useState } from 'react';
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

import { InfoTooltip } from '@/components/ui/info-tooltip';

// ... existing imports

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function ResourcesPage() {
    const [isRequestOpen, setIsRequestOpen] = useState(false);

    const handleDownload = (title: string) => {
        // In a real app, this would trigger a file download
        toast.info(`Downloading: ${title}`, {
            description: "File download started..."
        });
    };

    const handleRequestDoc = (e: React.FormEvent) => {
        e.preventDefault();
        setIsRequestOpen(false);
        toast.success("Request Submitted", {
            description: "Your document request has been sent to the content team."
        });
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        Resources
                        <InfoTooltip content="Access all quality SOPs, work instructions, and coaching guides." />
                    </h2>
                    <p className="text-muted-foreground">Standard Operating Procedures and Knowledge Base.</p>
                </div>
                <Dialog open={isRequestOpen} onOpenChange={setIsRequestOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <BookOpen className="mr-2 h-4 w-4" />
                            Request New Doc
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Request New Document</DialogTitle>
                            <DialogDescription>
                                Need a new SOP or Work Instruction? Describe it below.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleRequestDoc}>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="title" className="text-right">
                                        Title
                                    </Label>
                                    <Input id="title" placeholder="e.g. Handling Difficult Customers" className="col-span-3" required />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="type" className="text-right">
                                        Type
                                    </Label>
                                    <div className="col-span-3">
                                        <Select defaultValue="sop">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="sop">SOP</SelectItem>
                                                <SelectItem value="wi">Work Instruction</SelectItem>
                                                <SelectItem value="guide">Guide</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 items-start gap-4">
                                    <Label htmlFor="description" className="text-right pt-3">
                                        Details
                                    </Label>
                                    <Textarea id="description" placeholder="Describe the process or topic..." className="col-span-3" required />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit">Submit Request</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {resources.map((resource) => (
                    <Card key={resource.id} className="card-gradient group hover:shadow-lg transition-all cursor-pointer border-slate-200/60">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <div className="p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
                                    <resource.icon className="h-6 w-6 text-indigo-600" />
                                </div>
                                {getCategoryBadge(resource.category)}
                            </div>
                            <CardTitle className="mt-4 text-lg font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors">
                                {resource.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-500 mb-4 line-clamp-2 h-10">
                                {resource.description}
                            </p>
                            <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-4">
                                <span>Updated: {resource.lastUpdated}</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 hover:bg-indigo-50 hover:text-indigo-600 p-0 px-2"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDownload(resource.title);
                                    }}
                                >
                                    <Download className="h-3 w-3 mr-1.5" />
                                    {resource.type}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {/* Upload Placeholder */}
                <Card className="border-dashed border-2 bg-slate-50/50 flex flex-col items-center justify-center p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer group" onClick={() => toast.info("Upload Locked", { description: "Requires Admin Access" })}>
                    <div className="p-4 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                        <FileText className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="font-semibold text-slate-700">Upload Document</h3>
                    <p className="text-sm text-slate-500 max-w-[200px] mt-1 mb-4">
                        Drag & drop PDF files here to add to the library.
                    </p>
                    <Button variant="outline" size="sm">
                        Browse Files
                    </Button>
                </Card>
            </div>
        </div>
    );
}
