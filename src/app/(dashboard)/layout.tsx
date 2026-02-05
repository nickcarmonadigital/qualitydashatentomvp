import { Suspense } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { TopNav } from '@/components/dashboard/TopNav';
import { OnboardingTour } from '@/components/onboarding-tour';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-50">
            <Sidebar />
            <TopNav />
            <Suspense fallback={null}>
                <OnboardingTour />
            </Suspense>
            <main className="md:pl-64 pt-16 min-h-screen overflow-x-hidden">
                <div className="p-4 md:p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
