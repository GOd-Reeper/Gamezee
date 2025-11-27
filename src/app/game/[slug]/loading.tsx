export default function GameLoading() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="mb-8 flex">
        <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="mx-2 h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="mx-2 h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Title skeleton */}
          <div className="h-10 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
          
          {/* Game embed skeleton */}
          <div className="aspect-video w-full bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          
          {/* Description skeleton */}
          <div className="mt-8">
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
            
            {/* Tags skeleton */}
            <div className="mt-6 flex flex-wrap gap-2">
              <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          {/* Game info card skeleton */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            
            <div className="space-y-4">
              <div>
                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              
              <div>
                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              
              <div>
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="h-6 w-36 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="flex space-x-4">
                <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Similar games skeleton */}
      <div className="mt-16">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
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
      </div>
    </div>
  );
} 