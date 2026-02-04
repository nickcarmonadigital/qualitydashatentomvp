'use client';

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { HelpCircle, Info } from "lucide-react";

interface PageGuideProps {
    title: string;
    description: string;
    items?: string[];
}

export function PageGuide({ title, description, items }: PageGuideProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-blue-500 transition-colors">
                    <HelpCircle className="h-5 w-5" />
                    <span className="sr-only">Page Info</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 md:w-96 p-0" align="end">
                <div className="bg-slate-50 p-4 border-b border-slate-100 rounded-t-md">
                    <h4 className="font-semibold text-sm flex items-center gap-2 text-slate-800">
                        <Info className="h-4 w-4 text-blue-500" />
                        {title}
                    </h4>
                </div>
                <div className="p-4 space-y-3">
                    <p className="text-sm text-slate-600 leading-relaxed">
                        {description}
                    </p>
                    {items && items.length > 0 && (
                        <div className="pt-2">
                            <h5 className="text-xs font-semibold text-slate-900 mb-2 uppercase tracking-wide">Key Features</h5>
                            <ul className="space-y-1.5">
                                {items.map((item, idx) => (
                                    <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                                        <span className="block w-1 h-1 mt-1.5 rounded-full bg-blue-400 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <div className="bg-slate-50 p-3 text-xs text-center text-muted-foreground border-t border-slate-100 rounded-b-md">
                    Need more help? Contact Quality Ops.
                </div>
            </PopoverContent>
        </Popover>
    );
}
