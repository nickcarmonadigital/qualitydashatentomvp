'use client';

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
    BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';

const navGroups = [
    {
        title: "Performance Engine",
        items: [
            { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
            { name: 'Weekly Insights', href: '/weekly-insight', icon: FileText },
            { name: 'Agent Performance', href: '/agents', icon: Users },
            { name: '50/75 Analysis', href: '/fifty-seventy-five', icon: Target },
        ]
    },
    {
        title: "Coaching & Development",
        items: [
            { name: 'Coaching Sessions', href: '/coaching', icon: MessageSquare },
            { name: 'SMART Goals', href: '/coaching/goals', icon: Target },
            { name: 'Action Plans', href: '/action-plans', icon: ClipboardList },
        ]
    },
    {
        title: "Quality Operations",
        items: [
            { name: 'QA Calibration', href: '/sessions', icon: GraduationCap },
            { name: 'Six Sigma Tools', href: '/lss-tools', icon: PenTool },
            { name: 'Resources', href: '/resources', icon: BookOpen },
        ]
    },
    {
        title: "System",
        items: [
            { name: 'Manager View', href: '/manager', icon: ShieldCheck },
            { name: 'Settings', href: '/settings', icon: Settings },
        ]
    }
];

const adminItems = [
    { name: 'User Management', href: '/admin/users', icon: Users },
    { name: 'Global Settings', href: '/admin/settings', icon: Settings },
    { name: 'System Audit', href: '/admin/audit', icon: ShieldAlert },
];

export function Sidebar() {
    const pathname = usePathname();
    const isAdmin = true;

    return (
        <div className="flex sidebar-gradient text-white h-screen w-64 flex-col fixed left-0 top-0 border-r border-slate-800 z-50">
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

            <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto no-scrollbar">
                {navGroups.map((group, idx) => (
                    <div key={idx}>
                        <h3 className="mb-2 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            {group.title}
                        </h3>
                        <div className="space-y-1">
                            {group.items.map((item) => (
                                <Link key={item.href} href={item.href}>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className={cn(
                                            "w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800/50",
                                            pathname === item.href && "bg-slate-800 text-white shadow-inner-glow"
                                        )}
                                    >
                                        <item.icon className="mr-3 h-4 w-4" />
                                        {item.name}
                                    </Button>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}

                {isAdmin && (
                    <div>
                        <h3 className="mb-2 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Administration
                        </h3>
                        <div className="space-y-1">
                            {adminItems.map((item) => (
                                <Link key={item.href} href={item.href}>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className={cn(
                                            "w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800/50",
                                            pathname === item.href && "bg-slate-800 text-white"
                                        )}
                                    >
                                        <item.icon className="mr-3 h-4 w-4" />
                                        {item.name}
                                    </Button>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </nav>

            <div className="p-4 border-t border-slate-800">
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
