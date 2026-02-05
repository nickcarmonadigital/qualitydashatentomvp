'use client';

import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { SidebarContent } from './Sidebar';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export const MobileSidebar = () => {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-slate-500 hover:text-slate-900">
                    <Menu className="h-6 w-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 border-r-[#0A1734] w-72 bg-[#0A1734] text-white sidebar-gradient">
                <div className="sr-only">
                    <SheetTitle>Navigation Menu</SheetTitle>
                    <SheetDescription>Main navigation for the application</SheetDescription>
                </div>
                <SidebarContent onNavigate={() => setOpen(false)} />
            </SheetContent>
        </Sheet>
    );
};
