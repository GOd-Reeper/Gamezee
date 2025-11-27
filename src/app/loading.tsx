export default function HomeLoading() {
  return (
    <div className="animate-pulse">
      {/* Hero Section Skeleton */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 py-20 md:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 opacity-10"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="h-12 w-3/4 bg-white/20 rounded mx-auto mb-6"></div>
            <div className="h-6 w-full bg-white/20 rounded mb-4 mx-auto"></div>
            <div className="h-6 w-5/6 bg-white/20 rounded mb-8 mx-auto"></div>
            <div className="max-w-xl mx-auto">
              <div className="h-12 w-full bg-white/20 rounded"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Skeleton */}
      <section className="container mx-auto px-4 py-16">
        <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-12"></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
              <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Games Skeleton */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
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
        
        <div className="mt-12 text-center">
          <div className="h-10 w-40 bg-gray-200 dark:bg-gray-700 rounded inline-block"></div>
        </div>
      </section>

      {/* CTA Skeleton */}
      <section className="bg-gray-100 dark:bg-gray-800 py-16 mt-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-4"></div>
            <div className="h-6 w-full bg-gray-200 dark:bg-gray-700 rounded mb-4 mx-auto"></div>
            <div className="h-6 w-5/6 bg-gray-200 dark:bg-gray-700 rounded mb-8 mx-auto"></div>
            <div className="h-10 w-40 bg-gray-200 dark:bg-gray-700 rounded inline-block"></div>
          </div>
        </div>
      </section>
    </div>
  );
} 