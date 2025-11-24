'use server';

import { searchBusinesses } from '@/lib/google-places';
import { SearchResponse } from '@/lib/types';

export async function searchBusinessesAction(query: string, location: string, pageToken?: string): Promise<SearchResponse> {
    return await searchBusinesses(query, location, pageToken);
}
