'use client';

import { AuditLogViewer } from '@/components/audit/AuditLogViewer';

import { InfoTooltip } from '@/components/ui/info-tooltip';

export default function AdminAuditPage() {
    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">
                    System Audit Log
                    <InfoTooltip content="This section is made specifically for auditors that audit the compliance of the framework." />
                </h2>
                <p className="text-muted-foreground">Track compliance, system access, and modification events across the platform.</p>
            </div>

            <AuditLogViewer />
        </div>
    );
}
