import { Skeleton } from "@/components/ui/skeleton";

export const CollegeInfoSkeleton = () => (
  <div className="space-y-6">
    {/* Quick Overview Section */}
    <div>
      <Skeleton className="h-8 w-48 mb-6" />
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-24" />
          </div>
        ))}
      </div>
    </div>

    {/* Content Section */}
    <div className="space-y-4">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-2/3" />
    </div>

    {/* Popular Courses Section */}
    <div>
      <Skeleton className="h-8 w-64 mb-6" />
      <Skeleton className="h-4 w-full mb-6" />
      
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6">
            {/* Course Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-10 w-24" />
            </div>
            
            {/* Course Details */}
            <div className="border-t border-gray-200 pt-4 space-y-3">
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="flex justify-between items-center">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <Skeleton className="h-12 w-40 mx-auto rounded-full" />
      </div>
    </div>
  </div>
);

export const CollegeCourseSkeleton = () => (
  <div className="space-y-6">
    {/* Search Bar */}
    <div className="relative">
      <Skeleton className="h-10 w-full rounded-full" />
    </div>

    {/* Filter Tags */}
    <div className="flex gap-2 flex-wrap">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-24 rounded-full" />
      ))}
    </div>

    {/* Course Groups */}
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-white border border-blue-100 rounded-2xl overflow-hidden shadow-sm">
          {/* Group Header */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div className="space-y-2">
                <Skeleton className="h-6 w-64" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-10 w-24" />
            </div>
            
            {/* Group Details */}
            <div className="border-t border-dashed border-blue-200 mt-4 pt-4 space-y-3">
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="flex justify-between items-center">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          </div>
          
          {/* Course Items */}
          <div className="px-6 pb-6 space-y-3">
            {Array.from({ length: 2 }).map((_, k) => (
              <div key={k} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const CollegeNavSkeleton = () => (
  <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-4">
    <div className="flex gap-4 overflow-x-auto">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-24 flex-shrink-0" />
      ))}
    </div>
  </div>
);

export const CollegeHeadSkeleton = () => (
  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-12">
    <div className="container-body">
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Logo */}
        <Skeleton className="h-24 w-24 rounded-2xl" />
        
        {/* College Info */}
        <div className="flex-1 space-y-4 text-center md:text-left">
          <Skeleton className="h-8 w-64 mx-auto md:mx-0" />
          <Skeleton className="h-5 w-48 mx-auto md:mx-0" />
          <Skeleton className="h-5 w-32 mx-auto md:mx-0" />
          
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
        
        {/* Action Button */}
        <Skeleton className="h-12 w-32" />
      </div>
    </div>
  </div>
);

export const CollegeFeesSkeleton = () => (
  <div className="space-y-6">
    {/* Content Section */}
    <div className="space-y-4">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-5/6" />
    </div>

    {/* Fees Tables */}
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-6 w-64" />
          <div className="border border-gray-200 rounded-2xl p-6">
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const CollegePlacementSkeleton = () => (
  <div className="space-y-6">
    {/* Content Section */}
    <div className="space-y-4">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>

    {/* Placement Summary */}
    <div className="bg-[#1C252E] rounded-2xl p-6 space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex gap-2 items-center">
          <Skeleton className="h-12 w-12 rounded-lg" />
          <div className="space-y-1">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      ))}
    </div>

    {/* Placement Graph */}
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <Skeleton className="h-64 w-full" />
    </div>
  </div>
);

export const CollegeRankingSkeleton = () => (
  <div className="space-y-6">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="space-y-4">
        {/* Agency Header */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-12 w-12 rounded-lg" />
          <Skeleton className="h-5 w-32" />
        </div>
        
        {/* Ranking Table */}
        <div className="border border-gray-200 rounded-2xl overflow-hidden">
          <div className="bg-gray-100 p-4">
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, j) => (
                <Skeleton key={j} className="h-4 w-16" />
              ))}
            </div>
          </div>
          <div className="p-4 space-y-3">
            {Array.from({ length: 3 }).map((_, k) => (
              <div key={k} className="grid grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, l) => (
                  <Skeleton key={l} className="h-4 w-16" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const CollegeCutoffSkeleton = () => (
  <div className="space-y-6">
    {/* Filter Section */}
    <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
      <Skeleton className="h-6 w-32" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-lg" />
        ))}
      </div>
    </div>

    {/* Cutoff Tables */}
    <div className="space-y-6">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-6 w-48" />
          <div className="border border-gray-200 rounded-2xl overflow-hidden">
            <div className="bg-gray-100 p-4">
              <div className="grid grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Skeleton key={j} className="h-4 w-20" />
                ))}
              </div>
            </div>
            <div className="p-4 space-y-3">
              {Array.from({ length: 4 }).map((_, k) => (
                <div key={k} className="grid grid-cols-5 gap-4">
                  {Array.from({ length: 5 }).map((_, l) => (
                    <Skeleton key={l} className="h-4 w-20" />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
