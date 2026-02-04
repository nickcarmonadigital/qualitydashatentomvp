'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lock, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import Cookies from 'js-cookie';

export default function LoginPage() {
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Hardcoded check for MVP - In production, verify on server API
        if (code === 'Atento2025' || code === '1234') {
            // Set cookie manually for client-side immediate feedback, middleware checks it on next request
            // ideally middleware would check a server-set httpOnly cookie, but for this demo:
            Cookies.set('access_token', 'valid_session', { expires: 1 }); // 1 day

            toast.success("Access Granted", { description: "Welcome to Quality Operations Dashboard." });

            setTimeout(() => {
                router.push('/dashboard');
            }, 1000);
        } else {
            toast.error("Invalid Access Code", { description: "Please try again." });
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <ShieldCheck className="h-6 w-6 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">LSS Dashboard Access</CardTitle>
                    <CardDescription>
                        Enter your access code to view the workspace
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="password"
                                    placeholder="Enter access code"
                                    className="pl-9"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                        <Button className="w-full" type="submit" disabled={isLoading}>
                            {isLoading ? "Verifying..." : "Enter Workspace"}
                        </Button>
                    </form>
                </CardContent>
                <div className="p-6 pt-0 flex justify-center">
                    <p className="text-xs text-slate-500">Secure LSS Workspace v1.0</p>
                </div>
            </Card>
        </div>
    );
}
