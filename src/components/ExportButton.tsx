'use client';

import { Download } from 'lucide-react';
import { Business } from '@/lib/types';

interface ExportButtonProps {
    leads: Business[];
    filename?: string;
}

export function ExportButton({ leads, filename = 'leads.csv' }: ExportButtonProps) {
    const handleExport = () => {
        if (leads.length === 0) return;

        const headers = ['Name', 'Address', 'Phone', 'Website', 'Rating', 'Review Count', 'Type', 'Google Maps URL'];
        const csvContent = [
            headers.join(','),
            ...leads.map(lead => [
                `"${lead.name.replace(/"/g, '""')}"`,
                `"${lead.address.replace(/"/g, '""')}"`,
                `"${lead.phoneNumber || ''}"`,
                `"${lead.websiteUri || ''}"`,
                lead.rating || '',
                lead.userRatingCount || '',
                `"${(lead.types?.[0] || '').replace('_', ' ')}"`,
                `"${lead.googleMapsUri || ''}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <button
            onClick={handleExport}
            disabled={leads.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <Download className="w-4 h-4" />
            Export CSV
        </button>
    );
}
