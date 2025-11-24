'use server';

import { searchBusinesses } from '@/lib/google-places';
import { SearchResponse } from '@/lib/types';
import { limiter } from '@/lib/rate-limit';
import { headers } from 'next/headers';

export async function searchBusinessesAction(query: string, location: string, pageToken?: string): Promise<SearchResponse> {
    // Simple IP-based rate limiting
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || 'anonymous';

    try {
        // Allow 10 requests per minute per IP
        await limiter.check(10, ip);
    } catch {
        throw new Error('Rate limit exceeded. Please try again later.');
    }

    return await searchBusinesses(query, location, pageToken);
}
