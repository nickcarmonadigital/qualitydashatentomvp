'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';

import { MobileSidebar } from './MobileSidebar';

export function TopNav() {
    return (
        <header className="h-16 border-b bg-white flex items-center justify-between px-4 md:px-6 fixed top-0 right-0 left-0 md:left-64 z-10 transition-all duration-300">
            <div className="flex items-center space-x-4">
                <MobileSidebar />
                <div className="bg-[#0A1734] text-white text-xs px-3 py-1 rounded-full font-bold flex items-center hidden md:flex">
                    <span className="mr-1">📊</span> Atento Quality Operations
                </div>
            </div>

            <div className="ml-auto flex items-center space-x-4">
                {/* <NotificationCenter /> */}

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                <AvatarFallback>DM</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">Demo Manager</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    demo@atento.com
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-500">
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
