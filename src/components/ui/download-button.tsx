'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

interface DownloadCSVButtonProps {
    data: Record<string, any>[];
    filename: string;
    className?: string;
}

export function DownloadCSVButton({ data, filename, className }: DownloadCSVButtonProps) {
    const handleDownload = () => {
        if (!data || data.length === 0) {
            toast.error("No data to export");
            return;
        }

        // Get headers from the first object
        const headers = Object.keys(data[0]);

        // Build CSV content
        const csvRows: string[] = [];

        // Add header row
        csvRows.push(headers.join(','));

        // Add data rows
        for (const row of data) {
            const values = headers.map(header => {
                const val = row[header];
                // Escape double quotes and wrap in quotes if contains comma
                const escaped = String(val ?? '').replace(/"/g, '""');
                return `"${escaped}"`;
            });
            csvRows.push(values.join(','));
        }

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        // Create download link
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success(`Exported ${data.length} rows to ${filename}.csv`);
    };

    return (
        <Button variant="outline" size="sm" onClick={handleDownload} className={className}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
        </Button>
    );
}
