'use client';

import Link from 'next/link';
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
    PenTool
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';

const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Weekly Insights', href: '/weekly-insight', icon: FileText },
    { name: 'Agent Performance', href: '/agents', icon: Users },
    { name: 'Six Sigma Tools', href: '/lss-tools', icon: Target },
    { name: '50/75 Analysis', href: '/fifty-seventy-five', icon: Target },
    { name: 'Action Plans', href: '/action-plans', icon: Target },
];

const adminItems = [
    { name: 'User Management', href: '/admin/users', icon: Users },
    { name: 'Global Settings', href: '/admin/settings', icon: Settings },
    { name: 'System Audit', href: '/admin/audit', icon: ShieldAlert },
];

export function Sidebar() {
    const pathname = usePathname();
    // In a real app, we would check the role here using the Session
    const isAdmin = true; // Mocked for MVP to show UI

    return (
        <div className="flex bg-slate-900 text-white h-screen w-64 flex-col fixed left-0 top-0 border-r border-slate-800">
            <div className="p-6 flex items-center space-x-2 border-b border-slate-800">
                <ShieldAlert className="h-6 w-6 text-blue-500" />
                <span className="text-xl font-bold">Atento LSS</span>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
                {navItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800",
                                pathname === item.href && "bg-slate-800 text-white"
                            )}
                        >
                            <item.icon className="mr-3 h-5 w-5" />
                            {item.name}
                        </Button>
                    </Link>
                ))}

                {isAdmin && (
                    <>
                        <div className="my-4 border-t border-slate-800 pt-4 px-2 text-xs text-slate-500 uppercase font-semibold">
                            Administration
                        </div>
                        {adminItems.map((item) => (
                            <Link key={item.href} href={item.href}>
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800",
                                        pathname === item.href && "bg-slate-800 text-white"
                                    )}
                                >
                                    <item.icon className="mr-3 h-5 w-5" />
                                    {item.name}
                                </Button>
                            </Link>
                        ))}
                    </>
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
