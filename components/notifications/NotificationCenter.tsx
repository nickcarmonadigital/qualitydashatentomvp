'use client';

import { useState, useEffect } from 'react';
import { Bell, AlertTriangle, XCircle, Info, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { generateSystemAlerts, SystemAlert } from '@/lib/alerts/engine';
import { Badge } from '@/components/ui/badge';

export function NotificationCenter() {
    const [alerts, setAlerts] = useState<SystemAlert[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Mock checking for alerts every time component mounts or opens
        setAlerts(generateSystemAlerts());
    }, [isOpen]);

    const criticalCount = alerts.filter(a => a.severity === 'CRITICAL').length;
    const warningCount = alerts.filter(a => a.severity === 'WARNING').length;
    const totalCount = alerts.length;

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {totalCount > 0 && (
                        <span className="absolute top-1 right-1 h-3 w-3 rounded-full bg-red-600 border-2 border-white" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="flex items-center justify-between border-b px-4 py-3">
                    <h4 className="font-semibold">Notifications</h4>
                    {totalCount > 0 && (
                        <Badge variant="secondary" className="text-xs">
                            {totalCount} New
                        </Badge>
                    )}
                </div>
                <ScrollArea className="h-[300px]">
                    {alerts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full p-4 text-center text-muted-foreground">
                            <Check className="h-8 w-8 mb-2 text-green-500" />
                            <p className="text-sm">All systems nominal.</p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {alerts.map(alert => (
                                <div key={alert.id} className="p-4 hover:bg-slate-50 transition-colors">
                                    <div className="flex items-start gap-3">
                                        {alert.severity === 'CRITICAL' ? (
                                            <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                                        ) : alert.severity === 'WARNING' ? (
                                            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                                        ) : (
                                            <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                                        )}
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">{alert.title}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {alert.message}
                                            </p>
                                            <p className="text-xs text-muted-foreground pt-1">
                                                {alert.timestamp.toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
                <div className="border-t p-2">
                    <Button variant="ghost" className="w-full text-xs" onClick={() => setAlerts([])}>
                        Clear All
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
