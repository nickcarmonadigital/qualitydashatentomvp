'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import { getAgentById, updateAgent } from '@/lib/mock-service';
import { Agent } from '@/types/domain';

export default function EditAgentPage() {
    const router = useRouter();
    const params = useParams();
    const [agent, setAgent] = useState<Agent | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (params.id) {
            const data = getAgentById(params.id as string);
            if (data && data.agent) {
                setAgent(data.agent);
            }
        }
    }, [params.id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (agent) {
            const updated = updateAgent(agent.id, agent);
            if (updated) {
                setTimeout(() => {
                    setIsSubmitting(false);
                    toast.success("Agent Updated", {
                        description: "Agent profile has been updated."
                    });
                    router.push(`/agents/${agent.id}`);
                }, 800);
            } else {
                setIsSubmitting(false);
                toast.error("Error", { description: "Failed to update agent." });
            }
        }
    };

    if (!agent) return <div className="p-8">Loading...</div>;

    return (
        <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
            <div>
                <Button variant="ghost" onClick={() => router.back()} className="mb-4 pl-0 hover:bg-transparent hover:underline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Agent
                </Button>
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Edit Agent Profile</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Details</CardTitle>
                        <CardDescription>Update employee information.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    value={agent.name}
                                    onChange={(e) => setAgent({ ...agent, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={agent.email}
                                    onChange={(e) => setAgent({ ...agent, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="team">Team</Label>
                                <Select
                                    value={agent.team}
                                    onValueChange={(val) => setAgent({ ...agent, team: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Alpha">Alpha Team</SelectItem>
                                        <SelectItem value="Beta">Beta Team</SelectItem>
                                        <SelectItem value="Gamma">Gamma Team</SelectItem>
                                        <SelectItem value="Delta">Delta Team</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Select
                                    value={agent.role}
                                    onValueChange={(val) => setAgent({ ...agent, role: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Agent">Agent</SelectItem>
                                        <SelectItem value="Senior Agent">Senior Agent</SelectItem>
                                        <SelectItem value="Team Lead">Team Lead</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={agent.status}
                                    onValueChange={(val) => setAgent({ ...agent, status: val as any })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                        <SelectItem value="on_leave">On Leave</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={isSubmitting}>
                                <Save className="mr-2 h-4 w-4" />
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}
