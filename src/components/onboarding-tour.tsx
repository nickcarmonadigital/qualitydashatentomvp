'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { X, ChevronRight, ChevronLeft, PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const TOUR_STEPS = [
    {
        title: "The Quality Lifecycle",
        content: "Welcome to the Continuous Improvement loop. This guided tour will walk you through the standard operating procedure for handling quality insights, from detection to resolution.",
        route: "/dashboard"
    },
    {
        title: "1. Sample Adherence",
        content: "The process begins here. We monitor the 'Audit Compliance' card (Target: 95%). This ensures we have a statistically significant sample size before drawing conclusions.",
        route: "/dashboard"
    },
    {
        title: "2. Input: Weekly Insights",
        content: "Managers submit qualitative data here. We aggregate KPI movements, new hire performance, and knowledge gaps into a single weekly report.",
        route: "/weekly-insight/new"
    },
    {
        title: "3. Tool: Audit Randomizer",
        content: "To generate our sample, we use the LSS Audit Randomizer. This ensures we are targeting the right mix of Random vs Targeted (NPS Detractor) audits.",
        route: "/lss-tools"
    },
    {
        title: "4. Analysis: Fishbone",
        content: "When KPI trends dip, we use the Fishbone (Ishikawa) diagram to map root causes across People, Process, and Technology.",
        route: "/lss-tools"
    },
    {
        title: "5. Identification: 50/75 Rule",
        content: "We then identify WHO needs help. The 50/75 Rule highlights agents in the bottom quartile who are dragging down team performance.",
        route: "/fifty-seventy-five"
    },
    {
        title: "6. Remediation: Coaching",
        content: "Once identified, we conduct a Coaching Session. This documents the specific behavior gap and the agreed commitment. It creates the 'Paper Trail'.",
        route: "/coaching"
    },
    {
        title: "7. Systemic Fix: Action Plans",
        content: "For issues affecting the whole team (Process/Policy gaps), we create an Action Plan. This tracks 'Meeting Minutes' and ensures long-term process correction.",
        route: "/action-plans"
    },
    {
        title: "8. Configuration",
        content: "Finally, Administrators configure the SLAs and Audit Targets here to keep the system aligned with COPC standards.",
        route: "/admin/settings"
    },
    {
        title: "Cycle Complete",
        content: "You have completed the Continuous Improvement loop. The dashboard will now reflect the impact of your actions.",
        route: "/dashboard"
    }
];

export function OnboardingTour() {
    const router = useRouter();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const handleStart = () => {
            setIsOpen(true);
            setCurrentStep(0);
            router.push('/dashboard');
        };

        window.addEventListener('start-tour', handleStart);
        return () => window.removeEventListener('start-tour', handleStart);
    }, [router]);

    // Auto-navigate when step changes
    useEffect(() => {
        if (isOpen) {
            const step = TOUR_STEPS[currentStep];
            if (pathname !== step.route) {
                router.push(step.route);
            }
        }
    }, [currentStep, isOpen, router, pathname]);

    if (!isOpen) return null;

    const step = TOUR_STEPS[currentStep];
    const isLast = currentStep === TOUR_STEPS.length - 1;

    return (
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:justify-end sm:p-8 pointer-events-none">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 pointer-events-auto" onClick={() => setIsOpen(false)} />

            {/* Card */}
            <Card className="z-[101] w-full max-w-md pointer-events-auto shadow-2xl border-blue-500/50 animate-in slide-in-from-right-10 duration-300 relative">
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
                    onClick={() => setIsOpen(false)}
                >
                    <X className="h-4 w-4" />
                </Button>

                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-600">
                        <PlayCircle className="h-5 w-5" />
                        {step.title}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-slate-600 leading-relaxed">
                        {step.content}
                    </p>
                    <div className="mt-4 flex gap-1">
                        {TOUR_STEPS.map((_, idx) => (
                            <div
                                key={idx}
                                className={cn(
                                    "h-1.5 rounded-full transition-all duration-300",
                                    idx === currentStep ? "w-8 bg-blue-600" : "w-2 bg-slate-200"
                                )}
                            />
                        ))}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t bg-slate-50/50 p-4">
                    <Button
                        variant="ghost"
                        onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                        disabled={currentStep === 0}
                    >
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                    <Button
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => {
                            if (isLast) {
                                setIsOpen(false);
                            } else {
                                setCurrentStep(currentStep + 1);
                            }
                        }}
                    >
                        {isLast ? 'Finish Tour' : 'Next Step'}
                        {!isLast && <ChevronRight className="ml-2 h-4 w-4" />}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
