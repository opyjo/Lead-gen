'use client';

import { useState, useEffect } from 'react';
import { SearchForm } from '@/components/SearchForm';
import { BusinessList } from '@/components/BusinessList';
import { ExportButton } from '@/components/ExportButton';
import { DashboardStats } from '@/components/DashboardStats';
import { BusinessCardSkeleton } from '@/components/BusinessCardSkeleton';
import { Toast } from '@/components/Toast';
import { searchBusinessesAction } from './actions';
import { Business } from '@/lib/types';
import { BookmarkCheck, Search as SearchIcon } from 'lucide-react';

export default function Home() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [savedLeads, setSavedLeads] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeTab, setActiveTab] = useState<'search' | 'saved'>('search');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Stats state
  const [totalSearches, setTotalSearches] = useState(0);
  const [totalLeadsFound, setTotalLeadsFound] = useState(0);

  // Load data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('savedLeads');
    const searches = localStorage.getItem('totalSearches');
    const leadsFound = localStorage.getItem('totalLeadsFound');

    if (saved) {
      try {
        setSavedLeads(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved leads', e);
      }
    }
    if (searches) setTotalSearches(parseInt(searches));
    if (leadsFound) setTotalLeadsFound(parseInt(leadsFound));
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

    // Update stats
    const newTotalSearches = totalSearches + 1;
    setTotalSearches(newTotalSearches);
    localStorage.setItem('totalSearches', newTotalSearches.toString());

    try {
      const response = await searchBusinessesAction(query, location);
      setBusinesses(response.places);
      setNextPageToken(response.nextPageToken);
      setHasSearched(true);

      // Update leads found stats
      const newTotalLeads = totalLeadsFound + response.places.length;
      setTotalLeadsFound(newTotalLeads);
      localStorage.setItem('totalLeadsFound', newTotalLeads.toString());

    } catch (error) {
      console.error('Search failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch results. Please check your API key and try again.');
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

      // Update leads found stats
      const newTotalLeads = totalLeadsFound + response.places.length;
      setTotalLeadsFound(newTotalLeads);
      localStorage.setItem('totalLeadsFound', newTotalLeads.toString());

    } catch (error) {
      console.error('Load more failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSaveLead = (business: Business) => {
    setSavedLeads(prev => {
      const isAlreadySaved = prev.some(lead => lead.id === business.id);
      if (isAlreadySaved) {
        setToastMessage(`Removed ${business.name} from saved leads`);
        return prev.filter(lead => lead.id !== business.id);
      } else {
        setToastMessage(`Saved ${business.name} to your leads`);
        return [...prev, business];
      }
    });
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
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
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardStats
          totalSearches={totalSearches}
          totalLeadsFound={totalLeadsFound}
          savedLeadsCount={savedLeads.length}
        />

        {/* Tabs & View Toggles */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 border-b border-gray-200 pb-4 gap-4">
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

          <div className="flex items-center gap-3">
            {activeTab === 'saved' && savedLeads.length > 0 && (
              <ExportButton leads={savedLeads} />
            )}
          </div>
        </div>

        {activeTab === 'search' ? (
          hasSearched ? (
            <>
              {isLoading && businesses.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <BusinessCardSkeleton key={i} />
                  ))}
                </div>
              ) : (
                <BusinessList
                  businesses={businesses}
                  onSave={toggleSaveLead}
                  savedLeads={savedLeads}
                />
              )}
              {nextPageToken && (
                <div className="mt-8 text-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoading}
                    className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {isLoading ? 'Loading...' : 'Load More Results'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
              <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Start Your Search</h3>
              <p className="text-gray-500">Enter a business type and location to find leads</p>
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

      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}
    </main>
  );
}
