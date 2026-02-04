import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { Clock, Target, Users, Shield } from 'lucide-react';
import { useState } from 'react';

export default function AdminSettingsPage() {
    // Merged settings state
    const [coachingSlaHours, setCoachingSlaHours] = useState('48');
    const [calibrationTarget, setCalibrationTarget] = useState('85');
    const [auditComplianceTarget, setAuditComplianceTarget] = useState('95');
    const [calibrationFrequency, setCalibrationFrequency] = useState('2');

    const handleSave = () => {
        toast.success("Settings saved successfully.");
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-5xl">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">
                    Platform Settings
                    <InfoTooltip content="Configure global application parameters, COPC targets, and system thresholds." />
                </h2>
                <p className="text-muted-foreground">Centralized controls for the entire Quality Operations platform.</p>
            </div>

            <div className="grid gap-6">

                {/* COPC Targets Section (Merged from /settings) */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader className="bg-blue-50/50 border-b">
                            <CardTitle className="flex items-center gap-2 text-blue-900">
                                <Clock className="h-5 w-5" />
                                SLAs & Thresholds
                            </CardTitle>
                            <CardDescription>Service Level Agreements and Performance Flags</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="space-y-2">
                                <Label>Coaching SLA (Hours)</Label>
                                <Input value={coachingSlaHours} onChange={e => setCoachingSlaHours(e.target.value)} type="number" />
                                <p className="text-[0.8rem] text-muted-foreground">Max time from audit to coaching.</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Intervention Needed Threshold (%)</Label>
                                <Input defaultValue="80" type="number" />
                                <p className="text-[0.8rem] text-muted-foreground">Agents below this are flagged.</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="bg-green-50/50 border-b">
                            <CardTitle className="flex items-center gap-2 text-green-900">
                                <Target className="h-5 w-5" />
                                Quality Targets
                            </CardTitle>
                            <CardDescription>COPC Compliance Goals</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="space-y-2">
                                <Label>Audit Compliance Target (%)</Label>
                                <Input value={auditComplianceTarget} onChange={e => setAuditComplianceTarget(e.target.value)} type="number" />
                            </div>
                            <div className="space-y-2">
                                <Label>Calibration Alignment Target (%)</Label>
                                <Input value={calibrationTarget} onChange={e => setCalibrationTarget(e.target.value)} type="number" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Feature Toggles */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            System Features & Security
                        </CardTitle>
                        <CardDescription>Enable or disable platform capabilities.</CardDescription>
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
                    <Button onClick={handleSave} className="w-full md:w-auto btn-premium">Save All Changes</Button>
                </div>
            </div>
        </div>
    );
}
