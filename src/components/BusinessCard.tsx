import { Business } from '@/lib/types';
import { MapPin, Phone, Globe, Star } from 'lucide-react';

interface BusinessCardProps {
    business: Business;
    onSave?: (business: Business) => void;
    isSaved?: boolean;
}

export function BusinessCard({ business, onSave, isSaved = false }: BusinessCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-200 relative group transform hover:scale-[1.02]">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{business.name}</h3>
                    <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-medium">{business.rating || 'N/A'}</span>
                        <span className="text-xs text-gray-500">({business.userRatingCount || 0})</span>
                    </div>
                </div>
                {business.types && (
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full capitalize">
                        {business.types[0].replace('_', ' ')}
                    </span>
                )}
            </div>

            <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" />
                    <span>{business.address}</span>
                </div>

                {business.phoneNumber && (
                    <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                        <a href={`tel:${business.phoneNumber}`} className="hover:text-blue-600 transition-colors">
                            {business.phoneNumber}
                        </a>
                    </div>
                )}

                {business.websiteUri && (
                    <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4 text-gray-400 shrink-0" />
                        <a
                            href={business.websiteUri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline truncate max-w-[200px]"
                        >
                            Visit Website
                        </a>
                    </div>
                )}
            </div>

            {onSave && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <button
                        onClick={() => onSave(business)}
                        className={`text-xs px-4 py-2 rounded-lg transition-all font-medium shadow-sm flex items-center gap-1.5 cursor-pointer ${isSaved
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-slate-600 text-white hover:bg-slate-700 hover:shadow-md'
                            }`}
                    >
                        {isSaved ? (
                            <>
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                Saved
                            </>
                        ) : (
                            'Save Lead'
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
