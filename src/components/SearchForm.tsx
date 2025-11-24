'use client';

import { useState } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { Combobox } from './Combobox';

interface SearchFormProps {
    onSearch: (query: string, location: string) => Promise<void>;
    isLoading: boolean;
}

export function SearchForm({ onSearch, isLoading }: SearchFormProps) {
    const [query, setQuery] = useState('');
    const [location, setLocation] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query, location);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto relative z-20">
            <div className="flex flex-col md:flex-row gap-3 p-2 bg-white rounded-2xl shadow-lg border border-gray-100">
                <div className="flex-1 flex items-center px-4 h-12 bg-gray-50 rounded-xl focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500 transition-all relative z-30">
                    <Search className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
                    <Combobox
                        value={query}
                        onChange={setQuery}
                        placeholder="Find leads (e.g. Plumbers)"
                        required
                    />
                </div>

                <div className="flex-1 flex items-center px-4 h-12 bg-gray-50 rounded-xl focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500 transition-all relative z-20">
                    <MapPin className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
                    <input
                        type="text"
                        placeholder="Location (e.g. New York, NY)"
                        className="flex-1 bg-transparent border-none focus:outline-none text-gray-900 placeholder-gray-500"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors flex items-center justify-center min-w-[120px] relative z-10"
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        'Search'
                    )}
                </button>
            </div>
        </form>
    );
}
