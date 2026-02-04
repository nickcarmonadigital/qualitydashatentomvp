'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    FileText,
    Users,
    Target,
    Settings,
    LogOut,
    ShieldAlert,
    PenTool,
    ClipboardList,
    MessageSquare,
    ShieldCheck,
    GraduationCap,
    BookOpen,
    ChevronDown,
    ChevronRight,
    PlayCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';

const menuItems = {
    performance: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Weekly Insights', href: '/weekly-insight', icon: FileText },
        { name: 'Agent Performance', href: '/agents', icon: Users },
        { name: '50/75 Analysis', href: '/fifty-seventy-five', icon: Target },
    ],
    coaching: [
        { name: 'Coaching Sessions', href: '/coaching', icon: MessageSquare },
        { name: 'SMART Goals', href: '/coaching/goals', icon: Target },
        { name: 'Action Plans', href: '/action-plans', icon: ClipboardList },
    ],
    lss: [
        { name: 'QA Calibration', href: '/sessions', icon: GraduationCap },
        { name: 'Six Sigma Tools', href: '/lss-tools', icon: PenTool },
        { name: 'Resources', href: '/resources', icon: BookOpen },
    ],
    admin: [
        { name: 'Admin Overview', href: '/admin', icon: LayoutDashboard },
        { name: 'User Management', href: '/admin/users', icon: Users },
        { name: 'Global Settings', href: '/admin/settings', icon: Settings },
        { name: 'System Audit', href: '/admin/audit', icon: ShieldAlert },
    ],
    support: [
        { name: 'User Manual', href: '/manual', icon: BookOpen },
        { name: 'Resources', href: '/resources', icon: FileText },
    ]
};

const SidebarGroup = ({ title, items, isOpen, onToggle, scenario }: { title: string, items: any[], isOpen: boolean, onToggle: () => void, scenario?: string }) => {
    return (
        <div className="space-y-1">
            <div
                className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider hover:text-slate-200 cursor-pointer group"
                onClick={onToggle}
            >
                <div className="flex items-center gap-2">
                    {isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                    {title}
                </div>
                {scenario && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-500/20 hover:text-blue-400"
                        onClick={(e) => {
                            e.stopPropagation();
                            window.dispatchEvent(new CustomEvent('start-tour', { detail: { scenario } }));
                        }}
                        title={`Start ${title} Tour`}
                    >
                        <PlayCircle className="h-3 w-3" />
                    </Button>
                )}
            </div>

            {isOpen && (
                <div className="space-y-1 animate-in slide-in-from-left-2 duration-200">
                    {items.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-white group relative",
                                "text-slate-400 hover:bg-slate-800"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.name}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export function Sidebar() {
    const isAdmin = true;
    const groupLabels: Record<string, string> = {
        performance: 'Performance',
        coaching: 'Coaching',
        lss: 'LSS Tools',
        admin: 'Admin',
        support: 'Help & Support'
    };
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
        performance: true,
        coaching: true,
        lss: false,
        admin: true,
        support: true
    });

    const toggleGroup = (key: string) => {
        setOpenGroups(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="flex sidebar-gradient text-white h-screen w-64 flex-col fixed left-0 top-0 border-r border-slate-800 z-50 transition-all duration-300">
            <div className="p-6 flex items-center space-x-3 border-b border-slate-800/50">
                <div className="relative w-10 h-10 rounded-lg overflow-hidden glow-accent flex-shrink-0">
                    <Image
                        src="/atento-logo.png"
                        alt="Atento Logo"
                        fill
                        className="object-contain"
                    />
                </div>
                <div className="flex flex-col overflow-hidden">
                    <span className="text-lg font-bold text-white truncate">Atento LSS</span>
                    <span className="text-xs text-[#88D2F8] truncate">Quality Operations</span>
                </div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-4 overflow-y-auto no-scrollbar">
                <SidebarGroup
                    title="Performance Engine"
                    items={menuItems.performance}
                    isOpen={openGroups.performance}
                    onToggle={() => toggleGroup('performance')}
                    scenario="PERFORMANCE"
                />

                <SidebarGroup
                    title="Coaching & Development"
                    items={menuItems.coaching}
                    isOpen={openGroups.coaching}
                    onToggle={() => toggleGroup('coaching')}
                    scenario="COACHING"
                />

                <SidebarGroup
                    title="Quality Operations"
                    items={menuItems.lss}
                    isOpen={openGroups.lss}
                    onToggle={() => toggleGroup('lss')}
                    scenario="LSS"
                />

                <SidebarGroup
                    title="Administration"
                    items={menuItems.admin}
                    isOpen={openGroups.admin}
                    onToggle={() => toggleGroup('admin')}
                />

                <SidebarGroup
                    title="Help & Support"
                    items={menuItems.support}
                    isOpen={openGroups.support}
                    onToggle={() => toggleGroup('support')}
                />
            </nav>

            <div className="p-4 border-t border-slate-800 space-y-2">
                <Button
                    variant="outline"
                    className="w-full justify-start border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 bg-slate-900/50"
                    onClick={() => window.dispatchEvent(new CustomEvent('start-tour', { detail: { scenario: 'GLOBAL' } }))}
                >
                    <span className="mr-3 text-lg">🚀</span>
                    Full Tour
                </Button>

                <Button
                    variant="ghost"
                    className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-slate-800"
                    onClick={() => signOut({ callbackUrl: '/login' })}
                >
                    <LogOut className="mr-3 h-5 w-5" />
                    Sign Out
                </Button>
            </div>
        </div>
    );
}
