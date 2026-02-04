'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { X, ChevronRight, ChevronLeft, PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type TourStep = {
    title: string;
    content: string;
    route: string;
};

const SCENARIOS: Record<string, TourStep[]> = {
    GLOBAL: [
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
            route: "/lss-tools/audit-randomizer"
        },
        {
            title: "4. Analysis: Fishbone",
            content: "When KPI trends dip, we use the Fishbone (Ishikawa) diagram to map root causes across People, Process, and Technology.",
            route: "/lss-tools?tab=fishbone"
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
    ],
    PERFORMANCE: [
        {
            title: "Performance Engine",
            content: "This module tracks the heartbeat of your operation: KPI trends and Agent Performance.",
            route: "/dashboard"
        },
        {
            title: "Agent Analysis",
            content: "Drill down into individual agent performance to identify trends.",
            route: "/agents"
        },
        {
            title: "Weekly Insights",
            content: "Review qualitative feedback from team leads.",
            route: "/weekly-insight/new"
        }
    ],
    LSS: [
        {
            title: "Six Sigma Tools",
            content: "Use these tools to identify root causes and ensure statistical validity.",
            route: "/lss-tools"
        },
        {
            title: "Audit Randomizer",
            content: "Generate unbiased audit samples.",
            route: "/lss-tools/audit-randomizer"
        },
        {
            title: "Fishbone Analysis",
            content: "Map causes to effects.",
            route: "/lss-tools?tab=fishbone"
        },
        {
            title: "50/75 Analysis",
            content: "Identify bottom quartile performers for targeted intervention.",
            route: "/fifty-seventy-five"
        }
    ],
    COACHING: [
        {
            title: "Coaching Loop",
            content: "The goal of measurement is improvement. Here we manage the coaching lifecycle.",
            route: "/coaching"
        },
        {
            title: "Active Sessions",
            content: "Track ongoing coaching sessions and commitments.",
            route: "/coaching/sessions"
        },
        {
            title: "Action Plans",
            content: "Manage long-term systemic improvement initiatives.",
            route: "/action-plans"
        }
    ]
};

export function OnboardingTour() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [activeScenario, setActiveScenario] = useState<TourStep[]>(SCENARIOS.GLOBAL);

    // Listen for custom start event
    useEffect(() => {
        const handleStart = (e: CustomEvent) => {
            const scenarioName = e.detail?.scenario || 'GLOBAL';
            const scenarioSteps = SCENARIOS[scenarioName] || SCENARIOS.GLOBAL;

            setActiveScenario(scenarioSteps);
            setIsOpen(true);
            setCurrentStep(0);

            // Navigate to first step
            router.push(scenarioSteps[0].route);
        };

        window.addEventListener('start-tour' as any, handleStart);
        return () => window.removeEventListener('start-tour' as any, handleStart);
    }, [router]);

    // Auto-navigate when step changes
    useEffect(() => {
        if (isOpen) {
            const step = activeScenario[currentStep];
            // Only push if route is different (ignoring query params if we are already there to avoid reload loops?)
            // Actually, we want to push query params too.
            // Check if current path + query matches target.

            // Simple check: if pathname doesn't match, push.
            // If query params are involved, we might need a stricter check, but router.push handles it well usually.
            if (pathname !== step.route.split('?')[0]) {
                router.push(step.route);
            } else if (step.route.includes('?')) {
                // Force push if query params are needed
                router.push(step.route);
            }
        }
    }, [currentStep, isOpen, router, pathname, activeScenario]);

    if (!isOpen) return null;

    const step = activeScenario[currentStep];
    const isLast = currentStep === activeScenario.length - 1;

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
                        {activeScenario.map((_, idx) => (
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

// Helper to fix the CustomEvent type error
declare global {
    interface WindowEventMap {
        'start-tour': CustomEvent;
    }
}
