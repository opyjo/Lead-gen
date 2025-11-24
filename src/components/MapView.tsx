'use client';

import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { Business } from '@/lib/types';

interface MapViewProps {
    businesses: Business[];
    apiKey: string;
}

export function MapView({ businesses, apiKey }: MapViewProps) {
    const defaultCenter = { lat: 40.7128, lng: -74.0060 }; // New York default

    // Calculate center based on results if available
    const center = businesses.length > 0 && businesses[0].location
        ? businesses[0].location
        : defaultCenter;

    return (
        <div className="h-[600px] w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm">
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
                            >
                                <Pin background={'#2563eb'} glyphColor={'white'} borderColor={'#1e40af'} />
                            </AdvancedMarker>
                        )
                    ))}
                </Map>
            </APIProvider>
        </div>
    );
}
