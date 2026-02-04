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
                <CardFooter className="flex justify-center">
                    <p className="text-xs text-slate-500">Secure LSS Workspace v1.0</p>
                </CardFooter>
            </Card >
        </div >
    );
}
