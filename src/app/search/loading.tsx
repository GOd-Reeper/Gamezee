export default function SearchLoading() {
  return (
    <div className="animate-pulse">
      {/* Hero Section Skeleton */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6 flex">
              <div className="h-4 w-16 bg-white/20 rounded"></div>
              <div className="mx-2 h-4 w-4 bg-white/20 rounded"></div>
              <div className="h-4 w-24 bg-white/20 rounded"></div>
            </div>
            <div className="h-10 w-3/4 bg-white/20 rounded mb-6"></div>
            <div className="h-6 w-full bg-white/20 rounded mb-8"></div>
            <div className="max-w-xl mx-auto">
              <div className="h-12 w-full bg-white/20 rounded"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Results Skeleton */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm">
              <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
              <div className="p-4">
                <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                <div className="flex justify-between">
                  <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-5 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
} 