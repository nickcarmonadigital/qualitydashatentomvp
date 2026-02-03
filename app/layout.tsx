import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'Quality Operations Dashboard',
    description: 'Six Sigma & KPI Management System',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
