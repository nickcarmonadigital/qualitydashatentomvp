'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Settings, ShieldAlert, Activity, Database, Lock } from 'lucide-react';
import { PageGuide } from '@/components/ui/page-guide';

export default function AdminDashboardPage() {
    const adminCards = [
        {
            title: "User Management",
            description: "Manage users, roles, and permissions.",
            icon: Users,
            href: "/admin/users",
            color: "text-blue-500",
            bg: "bg-blue-50"
        },
        {
            title: "Global Settings",
            description: "Configure system-wide parameters and SLAs.",
            icon: Settings,
            href: "/admin/settings",
            color: "text-slate-500",
            bg: "bg-slate-50"
        },
        {
            title: "System Audit",
            description: "View security logs and access history.",
            icon: ShieldAlert,
            href: "/admin/audit",
            color: "text-red-500",
            bg: "bg-red-50"
        }
    ];

    const stats = [
        { label: "Active Users", value: "24", icon: Users, color: "text-green-500" },
        { label: "System Health", value: "98.9%", icon: Activity, color: "text-blue-500" },
        { label: "Storage Used", value: "45%", icon: Database, color: "text-purple-500" },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        Administration
                        <PageGuide
                            title="Admin Console"
                            description="Central hub for system management, user access control, and platform configuration."
                            items={['User Role Management', 'Global SLA Logic', 'Audit Logs']}
                        />
                    </h1>
                    <p className="text-muted-foreground">System-wide controls and configuration.</p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                {stats.map((stat, idx) => (
                    <Card key={idx}>
                        <CardContent className="flex items-center p-6 space-x-4">
                            <div className={`p-4 rounded-full bg-slate-100 ${stat.color}`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <div className="text-sm text-muted-foreground">{stat.label}</div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Admin Modules */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Management Modules</h2>
                <div className="grid gap-6 md:grid-cols-3">
                    {adminCards.map((card, idx) => (
                        <Link key={idx} href={card.href} className="block group">
                            <Card className="h-full transition-all duration-200 hover:shadow-lg hover:border-blue-200 cursor-pointer">
                                <CardHeader>
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${card.bg}`}>
                                        <card.icon className={`h-6 w-6 ${card.color}`} />
                                    </div>
                                    <CardTitle className="group-hover:text-blue-600 transition-colors">{card.title}</CardTitle>
                                    <CardDescription>{card.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button variant="ghost" className="w-full justify-between px-0 group-hover:text-blue-600">
                                        Access Module
                                        <Lock className="h-4 w-4 opacity-50" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
