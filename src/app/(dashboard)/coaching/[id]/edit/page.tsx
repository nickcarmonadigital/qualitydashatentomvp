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
import { getCoachingSessionById, updateCoachingSession } from '@/lib/mock-service';
import { CoachingSession } from '@/types/domain';

export default function EditCoachingSessionPage() {
    const router = useRouter();
    const params = useParams();
    const [session, setSession] = useState<CoachingSession | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (params.id) {
            const data = getCoachingSessionById(params.id as string);
            if (data) {
                setSession(data);
            }
        }
    }, [params.id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (session) {
            const updated = updateCoachingSession(session.id, session);
            if (updated) {
                setTimeout(() => {
                    setIsSubmitting(false);
                    toast.success("Session Updated", {
                        description: "Changes have been saved successfully."
                    });
                    router.push(`/coaching/${session.id}`);
                }, 800);
            } else {
                setIsSubmitting(false);
                toast.error("Error", { description: "Failed to update session." });
            }
        }
    };

    if (!session) return <div className="p-8">Loading...</div>;

    return (
        <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
            <div>
                <Button variant="ghost" onClick={() => router.back()} className="mb-4 pl-0 hover:bg-transparent hover:underline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Session
                </Button>
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Edit Coaching Session</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Session Details</CardTitle>
                        <CardDescription>Update the records for this session.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="date">Session Date</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={session.session_date}
                                    onChange={(e) => setSession({ ...session, session_date: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={session.status}
                                    onValueChange={(val) => setSession({ ...session, status: val as any })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="scheduled">Scheduled</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="follow_up_required">Follow-up Required</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="outcome">Outcome</Label>
                                <Select
                                    value={session.outcome}
                                    onValueChange={(val) => setSession({ ...session, outcome: val as any })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="improved">Improved</SelectItem>
                                        <SelectItem value="no_change">No Change</SelectItem>
                                        <SelectItem value="declined">Declined</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="type">Type</Label>
                                <Select
                                    value={session.coaching_type}
                                    onValueChange={(val) => setSession({ ...session, coaching_type: val as any })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="behavioral">Behavioral</SelectItem>
                                        <SelectItem value="skills_gap">Skills Gap</SelectItem>
                                        <SelectItem value="qa_failure">QA Failure</SelectItem>
                                        <SelectItem value="kpi_decline">KPI Decline</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <textarea
                                id="notes"
                                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={session.notes}
                                onChange={(e) => setSession({ ...session, notes: e.target.value })}
                            />
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
