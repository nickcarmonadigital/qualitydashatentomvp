export function exportToCSV(data: any[], filename: string) {
    if (!data || data.length === 0) {
        console.warn('No data to export');
        return;
    }

    // 1. Extract Headers
    const headers = Object.keys(data[0]);

    // 2. Convert Data to CSV String
    const csvContent = [
        headers.join(','), // Header Row
        ...data.map(row => headers.map(header => {
            const value = row[header];
            // Escape quotes and commas
            const stringValue = value === null || value === undefined ? '' : String(value);
            const escaped = stringValue.replace(/"/g, '""');
            return `"${escaped}"`;
        }).join(','))
    ].join('\n');

    // 3. Trigger Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
