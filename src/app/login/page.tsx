'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('demo@atento.com');
    const [password, setPassword] = useState('password123');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const res = await signIn('credentials', {
            redirect: false,
            email,
            password
        });

        if (res?.error) {
            setError('Invalid credentials');
        } else {
            router.push('/dashboard');
        }
    };

    return (
        <div className="flex bg-slate-100 h-screen w-full items-center justify-center">
            <Card className="w-[350px] shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-slate-900">Atento Quality Obs</CardTitle>
                    <CardDescription>Enter your credentials to access the LSS Workspace</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin}>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@atento.com"
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            {error && <div className="text-red-500 text-sm">{error}</div>}
                        </div>
                        <div className="mt-6">
                            <Button className="w-full bg-blue-600 hover:bg-blue-700" type="submit">Sign In</Button>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-xs text-slate-500">Secure LSS Workspace v1.0</p>
                </CardFooter>
            </Card>
        </div>
    );
}
