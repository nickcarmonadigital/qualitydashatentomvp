'use client';

import { AuditLogViewer } from '@/components/audit/AuditLogViewer';

export default function AdminAuditPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">System Audit Log</h2>
                <p className="text-muted-foreground">Global activity record for all users and resources.</p>
            </div>

            <AuditLogViewer />
        </div>
    );
}
