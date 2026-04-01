import React from 'react';

const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl shadow-md overflow-hidden h-full flex flex-col animate-pulse">
      {/* Image Skeleton */}
      <div className="relative w-full h-40 bg-gradient-to-br from-gray-200 to-gray-300">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
      </div>

      {/* Content Skeleton */}
      <div className="flex-1 flex flex-col p-5">
        {/* Title */}
        <div className="h-6 bg-gray-200 rounded-lg mb-3 w-3/4"></div>
        
        {/* Description */}
        <div className="space-y-2 mb-4 flex-1">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>

        {/* Price and Button */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-100">
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-16"></div>
            <div className="h-8 bg-gray-200 rounded w-24"></div>
          </div>
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
