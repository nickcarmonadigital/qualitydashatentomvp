'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Settings, Save, Clock, Target, Users } from 'lucide-react';

export default function SettingsPage() {
    // Default values aligned with COPC standards
    const [coachingSlaHours, setCoachingSlaHours] = useState('48');
    const [calibrationTarget, setCalibrationTarget] = useState('85');
    const [auditComplianceTarget, setAuditComplianceTarget] = useState('95');
    const [calibrationFrequency, setCalibrationFrequency] = useState('2');

    const handleSave = () => {
        // In a real app, this would persist to a database
        toast.success("Settings saved successfully", {
            description: "Your COPC targets have been updated."
        });
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-3xl">
            <div className="flex items-center gap-3">
                <Settings className="h-8 w-8 text-slate-600" />
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                    <p className="text-muted-foreground">Configure COPC compliance targets and SLAs</p>
                </div>
            </div>

            {/* SLA Settings */}
            <Card>
                <CardHeader className="bg-blue-50/50 border-b">
                    <CardTitle className="flex items-center gap-2 text-blue-900">
                        <Clock className="h-5 w-5" />
                        Service Level Agreements
                    </CardTitle>
                    <CardDescription>Define time-based commitments for coaching activities</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="coaching-sla">Coaching SLA (Hours)</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    id="coaching-sla"
                                    type="number"
                                    value={coachingSlaHours}
                                    onChange={(e) => setCoachingSlaHours(e.target.value)}
                                    className="w-24"
                                />
                                <span className="text-muted-foreground text-sm">hours after audit</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Maximum time allowed between audit finding and coaching session.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Quality Targets */}
            <Card>
                <CardHeader className="bg-green-50/50 border-b">
                    <CardTitle className="flex items-center gap-2 text-green-900">
                        <Target className="h-5 w-5" />
                        Quality Targets
                    </CardTitle>
                    <CardDescription>Define minimum performance thresholds</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="audit-target">Audit Compliance Target (%)</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    id="audit-target"
                                    type="number"
                                    value={auditComplianceTarget}
                                    onChange={(e) => setAuditComplianceTarget(e.target.value)}
                                    className="w-24"
                                    min="0"
                                    max="100"
                                />
                                <span className="text-muted-foreground text-sm">%</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Percentage of required audits that must be completed.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="calibration-target">Calibration Alignment Target (%)</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    id="calibration-target"
                                    type="number"
                                    value={calibrationTarget}
                                    onChange={(e) => setCalibrationTarget(e.target.value)}
                                    className="w-24"
                                    min="0"
                                    max="100"
                                />
                                <span className="text-muted-foreground text-sm">%</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Minimum agreement threshold for calibration sessions (per SOP).
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Calibration Schedule */}
            <Card>
                <CardHeader className="bg-purple-50/50 border-b">
                    <CardTitle className="flex items-center gap-2 text-purple-900">
                        <Users className="h-5 w-5" />
                        Calibration Schedule
                    </CardTitle>
                    <CardDescription>Configure calibration frequency requirements</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="space-y-2">
                        <Label htmlFor="cal-freq">Calibrations per Month</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                id="cal-freq"
                                type="number"
                                value={calibrationFrequency}
                                onChange={(e) => setCalibrationFrequency(e.target.value)}
                                className="w-24"
                                min="1"
                                max="12"
                            />
                            <span className="text-muted-foreground text-sm">sessions / month</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Per COPC standard, at least 2 calibration sessions per month are recommended.
                        </p>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end pt-4">
                <Button onClick={handleSave} className="btn-premium w-40">
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                </Button>
            </div>
        </div>
    );
}
