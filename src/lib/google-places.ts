import { Business, SearchResponse } from './types';

const GOOGLE_PLACES_API_URL = 'https://places.googleapis.com/v1/places:searchText';

export async function searchBusinesses(query: string, location?: string, pageToken?: string): Promise<SearchResponse> {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        throw new Error('GOOGLE_MAPS_API_KEY is not set');
    }

    const textQuery = location ? `${query} in ${location}` : query;

    try {
        const response = await fetch(GOOGLE_PLACES_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': apiKey,
                'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount,places.googleMapsUri,places.types,nextPageToken',
            },
            body: JSON.stringify({
                textQuery,
                pageToken,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Google Places API Error:', errorData);
            throw new Error(`Google Places API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.places) {
            return { places: [] };
        }

        const places = data.places.map((place: any) => ({
            id: place.id,
            name: place.displayName?.text || 'Unknown Business',
            address: place.formattedAddress,
            phoneNumber: place.nationalPhoneNumber,
            websiteUri: place.websiteUri,
            rating: place.rating,
            userRatingCount: place.userRatingCount,
            googleMapsUri: place.googleMapsUri,
            types: place.types,
        }));

        return {
            places,
            nextPageToken: data.nextPageToken,
        };
    } catch (error) {
        console.error('Error fetching places:', error);
        throw error; // Re-throw to be handled by the caller
    }
}
