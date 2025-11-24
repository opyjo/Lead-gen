import { Business } from '@/lib/types';
import { BusinessCard } from './BusinessCard';

interface BusinessListProps {
    businesses: Business[];
    onSave?: (business: Business) => void;
    savedLeads?: Business[];
}

export function BusinessList({ businesses, onSave, savedLeads = [] }: BusinessListProps) {
    if (businesses.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <p className="text-gray-500">No businesses found. Try a different search.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business) => (
                <BusinessCard
                    key={business.id}
                    business={business}
                    onSave={onSave}
                    isSaved={savedLeads.some(lead => lead.id === business.id)}
                />
            ))}
        </div>
    );
}
