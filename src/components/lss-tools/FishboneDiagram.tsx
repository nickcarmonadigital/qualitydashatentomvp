'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

interface Cause {
    id: string;
    text: string;
}

interface Category {
    name: string;
    causes: Cause[];
}

const CATEGORIES = [
    'Measurements', 'Materials', 'Methods',
    'Machines', 'Manpower', 'Environment'
];

export function FishboneDiagram() {
    const [bones, setBones] = useState<Record<string, Cause[]>>({
        'Measurements': [{ id: '1', text: 'Incorrect KPIs' }],
        'Materials': [],
        'Methods': [{ id: '2', text: 'Outdated SOP' }],
        'Machines': [{ id: '3', text: 'Latency spike' }],
        'Manpower': [{ id: '4', text: 'New hire batch' }],
        'Environment': []
    });

    const [problem] = useState("High AHT in Refund Queue");

    return (
        <Card className="p-6 bg-white overflow-x-auto min-h-[600px] flex items-center justify-center">
            <div className="relative w-[1000px] h-[500px]">

                {/* Main Spine (Horizontal) */}
                <div className="absolute top-1/2 left-0 w-[85%] h-2 bg-slate-800 rounded-r-lg z-10" />

                {/* Problem Head (Right) */}
                <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[140px] h-32 border-4 border-slate-800 rounded-lg flex items-center justify-center bg-slate-100 z-20 shadow-lg">
                    <div className="text-center font-bold text-slate-800 px-2">
                        {problem}
                    </div>
                </div>

                {/* Ribs (Categories) */}
                {/* Top Ribs: Measurements, Materials, Methods */}
                {['Measurements', 'Materials', 'Methods'].map((cat, idx) => (
                    <div key={cat} className="absolute" style={{ top: '50px', left: `${10 + idx * 25}%` }}>
                        {/* Angled Line */}
                        <div className="w-[2px] h-[180px] bg-slate-400 rotate-[-45deg] origin-bottom-left" />

                        {/* Category Box */}
                        <div className="absolute -top-[10px] -left-[90px] w-32 px-2 py-1 bg-blue-100 border border-blue-300 rounded text-center text-sm font-bold text-blue-900 shadow-sm">
                            {cat}
                        </div>

                        {/* Causes List */}
                        <div className="absolute top-10 -left-[140px] flex flex-col items-end gap-2 w-48">
                            {bones[cat].map(cause => (
                                <Dialog key={cause.id}>
                                    <DialogTrigger asChild>
                                        <button className="px-2 py-1 text-xs bg-white border border-slate-200 rounded shadow-sm hover:bg-slate-50 hover:border-blue-400 text-right max-w-full truncate">
                                            {cause.text}
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>5 Whys Analysis</DialogTitle>
                                            <DialogDescription>Drill down into the root cause for: "{cause.text}"</DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <div key={i} className="flex gap-4">
                                                    <div className="font-bold text-slate-400">Why?</div>
                                                    <input className="flex-1 border-b border-slate-200 focus:outline-none focus:border-blue-500 py-1 text-sm" placeholder="Reason..." />
                                                </div>
                                            ))}
                                            <Button className="w-full mt-4">Save Root Cause</Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            ))}
                            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
                                <PlusCircle className="h-4 w-4 text-slate-400" />
                            </Button>
                        </div>
                    </div>
                ))}

                {/* Bottom Ribs: Machines, Manpower, Environment */}
                {['Machines', 'Manpower', 'Environment'].map((cat, idx) => (
                    <div key={cat} className="absolute" style={{ bottom: '50px', left: `${10 + idx * 25}%` }}>
                        {/* Angled Line */}
                        <div className="w-[2px] h-[180px] bg-slate-400 rotate-[45deg] origin-top-left" />

                        {/* Category Box */}
                        <div className="absolute -bottom-[10px] -left-[90px] w-32 px-2 py-1 bg-blue-100 border border-blue-300 rounded text-center text-sm font-bold text-blue-900 shadow-sm">
                            {cat}
                        </div>

                        {/* Causes List */}
                        <div className="absolute bottom-10 -left-[140px] flex flex-col items-end gap-2 w-48">
                            {bones[cat].map(cause => (
                                <Dialog key={cause.id}>
                                    <DialogTrigger asChild>
                                        <button className="px-2 py-1 text-xs bg-white border border-slate-200 rounded shadow-sm hover:bg-slate-50 hover:border-blue-400 text-right max-w-full truncate">
                                            {cause.text}
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>5 Whys Analysis</DialogTitle>
                                            <DialogDescription>Drill down into the root cause for: "{cause.text}"</DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <div key={i} className="flex gap-4">
                                                    <div className="font-bold text-slate-400">Why?</div>
                                                    <input className="flex-1 border-b border-slate-200 focus:outline-none focus:border-blue-500 py-1 text-sm" placeholder="Reason..." />
                                                </div>
                                            ))}
                                            <Button className="w-full mt-4">Save Root Cause</Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            ))}
                            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
                                <PlusCircle className="h-4 w-4 text-slate-400" />
                            </Button>
                        </div>
                    </div>
                ))}

            </div>
        </Card>
    );
}
