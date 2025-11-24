'use client';

import { useState, useEffect } from 'react';
import { SearchForm } from '@/components/SearchForm';
import { BusinessList } from '@/components/BusinessList';
import { ExportButton } from '@/components/ExportButton';
import { searchBusinessesAction } from './actions';
import { Business } from '@/lib/types';
import { Building2, TrendingUp, Users, BookmarkCheck } from 'lucide-react';

export default function Home() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [savedLeads, setSavedLeads] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeTab, setActiveTab] = useState<'search' | 'saved'>('search');

  // Load saved leads from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('savedLeads');
    if (saved) {
      try {
        setSavedLeads(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved leads', e);
      }
    }
  }, []);

  // Save to localStorage whenever savedLeads changes
  useEffect(() => {
    localStorage.setItem('savedLeads', JSON.stringify(savedLeads));
  }, [savedLeads]);

  const [nextPageToken, setNextPageToken] = useState<string | undefined>(undefined);
  const [currentQuery, setCurrentQuery] = useState<{ query: string; location: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string, location: string) => {
    setIsLoading(true);
    setError(null);
    setActiveTab('search');
    setCurrentQuery({ query, location });
    try {
      const response = await searchBusinessesAction(query, location);
      setBusinesses(response.places);
      setNextPageToken(response.nextPageToken);
      setHasSearched(true);
    } catch (error) {
      console.error('Search failed:', error);
      setError('Failed to fetch results. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (!currentQuery || !nextPageToken) return;

    setIsLoading(true);
    try {
      const response = await searchBusinessesAction(currentQuery.query, currentQuery.location, nextPageToken);
      setBusinesses(prev => [...prev, ...response.places]);
      setNextPageToken(response.nextPageToken);
    } catch (error) {
      console.error('Load more failed:', error);
      // Optionally show a toast or error message
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSaveLead = (business: Business) => {
    setSavedLeads(prev => {
      const isAlreadySaved = prev.some(lead => lead.id === business.id);
      if (isAlreadySaved) {
        return prev.filter(lead => lead.id !== business.id);
      } else {
        return [...prev, business];
      }
    });
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-6">
              Find Your Next <span className="text-blue-600">Big Lead</span>
            </h1>
            <p className="text-lg text-gray-600 mb-10">
              Instantly discover local businesses, get contact details, and build your prospect list with our powerful lead generation tool.
            </p>

            <SearchForm onSearch={handleSearch} isLoading={isLoading && !nextPageToken} />

            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900">Local Business Data</h3>
                <p className="text-sm text-gray-500 mt-1">Access comprehensive details for businesses in any area.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900">Verified Contacts</h3>
                <p className="text-sm text-gray-500 mt-1">Get phone numbers and websites to reach out directly.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4 text-purple-600">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900">Lead Management</h3>
                <p className="text-sm text-gray-500 mt-1">Organize and export your leads efficiently.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('search')}
              className={`pb-4 -mb-4 px-2 font-medium transition-colors ${activeTab === 'search'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Search Results
              {hasSearched && <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">{businesses.length}</span>}
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`pb-4 -mb-4 px-2 font-medium transition-colors ${activeTab === 'saved'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Saved Leads
              <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">{savedLeads.length}</span>
            </button>
          </div>

          {activeTab === 'saved' && savedLeads.length > 0 && (
            <ExportButton leads={savedLeads} />
          )}
        </div>

        {activeTab === 'search' ? (
          hasSearched ? (
            <>
              <BusinessList
                businesses={businesses}
                onSave={toggleSaveLead}
                savedLeads={savedLeads}
              />
              {nextPageToken && (
                <div className="mt-8 text-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoading}
                    className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Loading...' : 'Load More Results'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 opacity-50">
              <p className="text-xl text-gray-400">Enter a search term and location to get started</p>
            </div>
          )
        ) : (
          <div className="space-y-6">
            {savedLeads.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
                <BookmarkCheck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No saved leads yet</h3>
                <p className="text-gray-500 mt-1">Search for businesses and click "Save Lead" to add them here.</p>
              </div>
            ) : (
              <BusinessList
                businesses={savedLeads}
                onSave={toggleSaveLead}
                savedLeads={savedLeads}
              />
            )}
          </div>
        )}
      </div>
    </main>
  );
}
