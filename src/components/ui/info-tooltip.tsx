'use client';

import { Info } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface InfoTooltipProps {
    content: string;
}

export function InfoTooltip({ content }: InfoTooltipProps) {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help hover:text-primary transition-colors inline-block ml-2 align-middle" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs bg-slate-900 text-white border-slate-800 z-50">
                    <p className="text-sm font-normal">{content}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
