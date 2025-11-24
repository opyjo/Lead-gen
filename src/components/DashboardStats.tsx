import { Users, BookmarkCheck, Search } from 'lucide-react';

interface DashboardStatsProps {
    totalSearches: number;
    totalLeadsFound: number;
    savedLeadsCount: number;
}

export function DashboardStats({ totalSearches, totalLeadsFound, savedLeadsCount }: DashboardStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
                <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                    <Search className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500">Total Searches</p>
                    <p className="text-2xl font-bold text-gray-900">{totalSearches}</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
                <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
                    <Users className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500">Leads Found</p>
                    <p className="text-2xl font-bold text-gray-900">{totalLeadsFound}</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
                <div className="p-3 bg-green-50 rounded-lg text-green-600">
                    <BookmarkCheck className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500">Saved Leads</p>
                    <p className="text-2xl font-bold text-gray-900">{savedLeadsCount}</p>
                </div>
            </div>
        </div>
    );
}
