'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import { getAgents } from '@/lib/mock-service';
import { Agent } from '@/types/domain';

export default function NewActionPlanPage() {
    const router = useRouter();
    const [agents, setAgents] = useState<Agent[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        owner_id: '',
        causal_category: 'Process',
        problem_statement: '',
        root_cause: '',
        correction: '',
        due_date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        setAgents(getAgents());
    }, []);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Mock API call
        setTimeout(() => {
            setIsSubmitting(false);
            toast.success("Action Plan Created", {
                description: "The action plan has been successfully registered."
            });
            router.push('/action-plans');
        }, 1000);
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <Link
                    href="/action-plans"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 mb-4 pl-0 hover:bg-transparent hover:underline text-muted-foreground"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Action Plans
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-2">Create Action Plan</h1>
                        <p className="text-muted-foreground">Define a new strategic initiative or corrective action.</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Plan Details</CardTitle>
                        <CardDescription>Enter the core details of the action plan.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Plan Title</Label>
                                <Input
                                    id="title"
                                    placeholder="e.g., Improve AHT in Spanish Queue"
                                    value={formData.title}
                                    onChange={(e) => handleChange('title', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="owner">Owner</Label>
                                <Select onValueChange={(val) => handleChange('owner_id', val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Owner" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {agents.map(a => (
                                            <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Causal Category</Label>
                                <Select defaultValue="Process" onValueChange={(val) => handleChange('causal_category', val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Process">Process</SelectItem>
                                        <SelectItem value="People">People / Training</SelectItem>
                                        <SelectItem value="Technology">Technology</SelectItem>
                                        <SelectItem value="Policy">Policy</SelectItem>
                                        <SelectItem value="Environment">Environment</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dueDate">Due Date</Label>
                                <Input
                                    id="dueDate"
                                    type="date"
                                    value={formData.due_date}
                                    onChange={(e) => handleChange('due_date', e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="problem">Problem Statement</Label>
                            <textarea
                                id="problem"
                                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Describe the issue being addressed..."
                                value={formData.problem_statement}
                                onChange={(e) => handleChange('problem_statement', e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="rootcause">Root Cause (5 Whys Summary)</Label>
                            <textarea
                                id="rootcause"
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Summary of the root cause analysis..."
                                value={formData.root_cause}
                                onChange={(e) => handleChange('root_cause', e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="correction">Proposed Correction</Label>
                            <textarea
                                id="correction"
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Action to be taken..."
                                value={formData.correction}
                                onChange={(e) => handleChange('correction', e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={isSubmitting}>
                                <Save className="mr-2 h-4 w-4" />
                                {isSubmitting ? 'Creating...' : 'Create Action Plan'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}
