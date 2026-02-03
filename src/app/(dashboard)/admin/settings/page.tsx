'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
    const handleSave = () => {
        toast.success("Settings saved successfully.");
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">System Settings</h2>
                <p className="text-muted-foreground">Configure global application parameters and thresholds.</p>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Performance Thresholds</CardTitle>
                        <CardDescription>Define the metrics for automatic flagging and intervention.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Intervention Needed Threshold (%)</Label>
                                <Input defaultValue="80" type="number" />
                                <p className="text-[0.8rem] text-muted-foreground">Agents below this score are flagged in the dashboard.</p>
                            </div>
                            <div className="space-y-2">
                                <Label>High Performance Threshold (%)</Label>
                                <Input defaultValue="95" type="number" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Feature Toggles</CardTitle>
                        <CardDescription>Enable or disable experimental features.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="beta-features" className="flex flex-col space-y-1">
                                <span>Beta LSS Tools</span>
                                <span className="font-normal leading-snug text-muted-foreground">
                                    Enable access to experimental CTX Tree and Fishbone diagrams.
                                </span>
                            </Label>
                            <Switch id="beta-features" defaultChecked />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="audit-logging" className="flex flex-col space-y-1">
                                <span>Detailed Audit Logging</span>
                                <span className="font-normal leading-snug text-muted-foreground">
                                    Capture granular read/write events (Higher database usage).
                                </span>
                            </Label>
                            <Switch id="audit-logging" defaultChecked />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button onClick={handleSave} className="w-full md:w-auto">Save Changes</Button>
                </div>
            </div>
        </div>
    );
}
