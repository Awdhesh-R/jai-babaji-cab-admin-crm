const SkeletonCard = ({ length = 4, page = "allRides" }) => (
  <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 px-2 sm:px-4 lg:px-6 mb-6">
    {Array.from({ length: length }).map((_, idx) => (
      <div
        key={idx}
        className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border dark:border-gray-700 p-4 space-y-4"
      >
        {/* Car & Phone */}
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <div className="w-24 h-3 bg-gray-100 dark:bg-gray-700 rounded"></div>
          <div className="w-32 h-3 bg-gray-100 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Date & Time */}
        <div className="space-y-2">
          <div className="w-28 h-3 bg-gray-200 dark:bg-gray-600 rounded"></div>
          <div className="w-32 h-3 bg-gray-200 dark:bg-gray-600 rounded"></div>
        </div>
        {/* Fare Info */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="w-28 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="w-16 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-3">
          <div className="w-1/2 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="w-1/2 h-8 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
        </div>
      </div>
    ))}
  </div>
);

export { SkeletonCard };
