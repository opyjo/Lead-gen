'use client';

import { useState } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { Business } from '@/lib/types';
import { Star, Phone, Globe } from 'lucide-react';

interface MapViewProps {
    businesses: Business[];
    apiKey: string;
}

export function MapView({ businesses, apiKey }: MapViewProps) {
    const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
    const defaultCenter = { lat: 40.7128, lng: -74.0060 }; // New York default

    // Calculate center based on results if available
    const center = businesses.length > 0 && businesses[0].location
        ? businesses[0].location
        : defaultCenter;

    return (
        <div className="h-[400px] md:h-[600px] w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <APIProvider apiKey={apiKey}>
                <Map
                    defaultCenter={center}
                    defaultZoom={12}
                    mapId="DEMO_MAP_ID" // Required for AdvancedMarker
                    gestureHandling={'greedy'}
                    disableDefaultUI={false}
                >
                    {businesses.map((business) => (
                        business.location && (
                            <AdvancedMarker
                                key={business.id}
                                position={business.location}
                                title={business.name}
                                onClick={() => setSelectedBusiness(business)}
                            >
                                <Pin background={'#475569'} glyphColor={'white'} borderColor={'#334155'} />
                            </AdvancedMarker>
                        )
                    ))}

                    {selectedBusiness && selectedBusiness.location && (
                        <InfoWindow
                            position={selectedBusiness.location}
                            onCloseClick={() => setSelectedBusiness(null)}
                        >
                            <div className="p-2 max-w-xs">
                                <h3 className="font-semibold text-gray-900 mb-2">{selectedBusiness.name}</h3>
                                {selectedBusiness.rating && (
                                    <div className="flex items-center gap-1 text-yellow-500 mb-2">
                                        <Star className="w-4 h-4 fill-current" />
                                        <span className="text-sm font-medium text-gray-900">{selectedBusiness.rating}</span>
                                        <span className="text-xs text-gray-500">({selectedBusiness.userRatingCount || 0})</span>
                                    </div>
                                )}
                                <p className="text-sm text-gray-600 mb-2">{selectedBusiness.address}</p>
                                <div className="flex flex-col gap-1">
                                    {selectedBusiness.phoneNumber && (
                                        <a href={`tel:${selectedBusiness.phoneNumber}`} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                                            <Phone className="w-3 h-3" />
                                            {selectedBusiness.phoneNumber}
                                        </a>
                                    )}
                                    {selectedBusiness.websiteUri && (
                                        <a href={selectedBusiness.websiteUri} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                                            <Globe className="w-3 h-3" />
                                            Visit Website
                                        </a>
                                    )}
                                </div>
                            </div>
                        </InfoWindow>
                    )}
                </Map>
            </APIProvider>
        </div>
    );
}
