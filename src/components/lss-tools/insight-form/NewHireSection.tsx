'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function NewHireSection() {
    return (
        <div className="space-y-6">
            <div className="bg-orange-50 p-4 rounded-md border border-orange-100 text-sm text-orange-800">
                <strong>Focus:</strong> Are new waves ramping up effectively? Identify "Nesting" issues vs "Production" issues.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-t-4 border-t-blue-500">
                    <CardContent className="pt-6">
                        <Label className="mb-2 block font-bold">30 Days (Nesting)</Label>
                        <div className="space-y-3">
                            <Input placeholder="Avg Score (e.g. 88%)" />
                            <Textarea placeholder="Key obs: e.g. 'Struggling with tool navigation'" rows={3} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-t-4 border-t-purple-500">
                    <CardContent className="pt-6">
                        <Label className="mb-2 block font-bold">60 Days (Ramping)</Label>
                        <div className="space-y-3">
                            <Input placeholder="Avg Score (e.g. 92%)" />
                            <Textarea placeholder="Key obs: e.g. 'Speed improving, quality stable'" rows={3} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-t-4 border-t-green-500">
                    <CardContent className="pt-6">
                        <Label className="mb-2 block font-bold">90 Days (Production)</Label>
                        <div className="space-y-3">
                            <Input placeholder="Avg Score (e.g. 95%)" />
                            <Textarea placeholder="Key obs: e.g. 'Fully proficient, 1 outlier agent'" rows={3} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
