export function BusinessCardSkeleton() {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded-full w-20"></div>
            </div>

            <div className="space-y-3">
                <div className="flex items-start gap-3">
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded flex-1"></div>
                </div>
                <div className="flex items-start gap-3">
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="flex items-start gap-3">
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="h-8 bg-gray-200 rounded w-24"></div>
            </div>
        </div>
    );
}
