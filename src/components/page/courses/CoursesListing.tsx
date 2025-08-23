"use client";

// Course listing component with dynamic filtering and authentication
import React, { useState } from "react";
import {
  FaSearch,
  FaRedo,
  FaTimes,
  FaBookmark,
  FaArrowRight,
  FaSpinner,
} from "react-icons/fa";
import { CourseDTO } from "@/api/@types/course-type";
import { HeaderProps } from "@/api/@types/header-footer";
import DropdownFilter from "@/components/miscellaneous/DropdownFilter";
import { getCourses } from "@/api/list/getCourses";

interface CoursesListingProps {
  initialCoursesData: {
    courses: CourseDTO[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  filterData: HeaderProps | null;
  initialSearch?: string;
  initialStream?: string;
  initialLevel?: string;
}

interface FilterState {
  stream: string | null;
  level: string | null;
  duration: string | null;
  courseType: string | null;
  rating: string | null;
  feesRange: string | null;
  search: string;
}

const CoursesListing: React.FC<CoursesListingProps> = ({
  initialCoursesData,
  filterData,
  initialSearch = "",
  initialStream = "",
  initialLevel = "",
}) => {
  const [coursesData, setCoursesData] = useState(initialCoursesData);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialCoursesData.page);
  const [filters, setFilters] = useState<FilterState>({
    stream: initialStream || null,
    level: initialLevel || null,
    duration: null,
    courseType: null,
    rating: null,
    feesRange: null,
    search: initialSearch || "",
  });

  const [sortBy, setSortBy] = useState<string>("recommended");

  // Filter options from real API data
  const streamOptions =
    filterData?.stream_section?.map((s) => ({
      value: s.stream_id.toString(),
      label: s.stream_name,
    })) || [];

  const levelOptions = [
    { value: "Graduation", label: "Graduation" },
    { value: "Post Graduation", label: "Post Graduation" },
    { value: "Doctorate", label: "Doctorate" },
    { value: "Diploma", label: "Diploma" },
    { value: "Certificate", label: "Certificate" },
  ];

  const durationOptions = [
    { value: "below 1 year", label: "Below 1 Year" },
    { value: "1-2 years", label: "1-2 Years" },
    { value: "2-3 years", label: "2-3 Years" },
    { value: "3-4 years", label: "3-4 Years" },
    { value: "4+ years", label: "4+ Years" },
  ];

  const courseTypeOptions = [
    { value: "Certificate", label: "Certificate" },
    { value: "Diploma", label: "Diploma" },
    { value: "Degree", label: "Degree" },
    { value: "Post-Graduation", label: "Post-Graduation" },
  ];

  const ratingOptions = [
    { value: "4.5+", label: "4.5+ Stars" },
    { value: "4.0+", label: "4.0+ Stars" },
    { value: "3.5+", label: "3.5+ Stars" },
    { value: "3.0+", label: "3.0+ Stars" },
  ];

  const feesRangeOptions = [
    { value: "0-50k", label: "₹0 - ₹50K" },
    { value: "50k-1L", label: "₹50K - ₹1L" },
    { value: "1L-5L", label: "₹1L - ₹5L" },
    { value: "5L+", label: "₹5L+" },
  ];

  const sortOptions = [
    { value: "recommended", label: "Recommended" },
    { value: "course_name", label: "Name A-Z" },
    { value: "course_name", label: "Name Z-A" },
    { value: "duration_value", label: "Duration" },
    { value: "kap_score", label: "Rating" },
    { value: "course_type", label: "Course Type" },
    { value: "created_at", label: "Newest First" },
    { value: "updated_at", label: "Recently Updated" },
  ];

  // Fetch courses with filters
  const fetchCourses = async (page: number = 1, newFilters?: FilterState) => {
    setLoading(true);
    try {
      const currentFilters = newFilters || filters;

      const params: any = {
        page,
        limit: 12,
      };

      // Search filter
      if (currentFilters.search) params.search = currentFilters.search;

      // Stream filter
      if (currentFilters.stream)
        params.stream_id = parseInt(currentFilters.stream);

      // Level filter - maps to API 'level' parameter
      if (currentFilters.level) params.level = currentFilters.level;

      // Course type filter - maps to API 'course_type' parameter
      if (currentFilters.courseType)
        params.course_type = currentFilters.courseType;

      // Duration filter - convert to API parameters
      if (currentFilters.duration) {
        switch (currentFilters.duration) {
          case "below 1 year":
            params.max_duration = 11;
            params.duration_type = "Months";
            break;
          case "1-2 years":
            params.min_duration = 12;
            params.max_duration = 23;
            params.duration_type = "Months";
            break;
          case "2-3 years":
            params.min_duration = 24;
            params.max_duration = 35;
            params.duration_type = "Months";
            break;
          case "3-4 years":
            params.min_duration = 36;
            params.max_duration = 47;
            params.duration_type = "Months";
            break;
          case "4+ years":
            params.min_duration = 48;
            params.duration_type = "Months";
            break;
        }
      }

      // Rating filter - convert to KAP score (API parameter)
      if (currentFilters.rating) {
        const ratingValue = parseFloat(currentFilters.rating.replace("+", ""));
        params.min_kap_score = ratingValue * 20; // Convert 5-star rating to KAP score
      }

      // Fees range filter - convert to KAP score range (API parameter)
      if (currentFilters.feesRange) {
        switch (currentFilters.feesRange) {
          case "0-50k":
            params.max_kap_score = 50;
            break;
          case "50k-1L":
            params.min_kap_score = 50;
            params.max_kap_score = 100;
            break;
          case "1L-5L":
            params.min_kap_score = 100;
            params.max_kap_score = 500;
            break;
          case "5L+":
            params.min_kap_score = 500;
            break;
        }
      }

      // Add sorting based on API documentation
      if (sortBy !== "recommended") {
        params.sort_by = sortBy;
        // For course_name, we can support both ASC and DESC
        if (sortBy === "course_name") {
          params.sort_order = "ASC"; // Default to ASC for name
        } else {
          params.sort_order = "DESC"; // Default to DESC for other fields
        }
      }

      // Set default active status to true as per API documentation
      params.is_active = true;

      const data = await getCourses(params);
      setCoursesData(data);
      setCurrentPage(page);
    } catch (error) {
      // Handle error silently in production
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = async (
    type: keyof FilterState,
    value: string | null
  ) => {
    const newFilters = {
      ...filters,
      [type]: value,
    };
    setFilters(newFilters);

    // Reset to first page when filters change
    await fetchCourses(1, newFilters);
  };

  // Handle search
  const handleSearch = async (searchTerm: string) => {
    const newFilters = { ...filters, search: searchTerm };
    setFilters(newFilters);
    await fetchCourses(1, newFilters);
  };

  // Handle sorting
  const handleSort = async (sortValue: string) => {
    setSortBy(sortValue);
    // Re-fetch with current filters and new sort
    await fetchCourses(currentPage, filters);
  };

  // Handle pagination
  const handlePageChange = async (page: number) => {
    await fetchCourses(page, filters);
  };

  const clearAllFilters = async () => {
    const clearedFilters = {
      stream: null,
      level: null,
      duration: null,
      courseType: null,
      rating: null,
      feesRange: null,
      search: "",
    };
    setFilters(clearedFilters);
    await fetchCourses(1, clearedFilters);
  };

  const removeFilter = async (type: keyof FilterState) => {
    const newFilters = { ...filters, [type]: null };
    setFilters(newFilters);
    await fetchCourses(1, newFilters);
  };

  const isFilterActive = Object.values(filters).some(
    (value) => value && value !== ""
  );

  // Format course data for display using real API data
  const formatCourseData = (course: CourseDTO) => {
    return {
      id: course.course_id,
      title: course.course_name,
      fees: course.kap_score ? `₹${course.kap_score}K` : "₹N/A",
      providers: "12+", // This would come from API if available
      rating: course.kap_score
        ? (parseFloat(course.kap_score) / 20).toFixed(1)
        : "4.0",
      duration: course.duration
        ? `${course.duration} months`
        : course.duration_in_months
        ? `${course.duration_in_months} months`
        : "N/A",
      level: course.level || "N/A",
      description: course.description || "",
      isOnline: course.is_online || false,
      degreeType: course.degree_type || "N/A",
      specialization: course.specialization_id || "N/A",
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Courses</h2>
          <p className="text-gray-600 mt-2">
            {coursesData.total} courses found
            {isFilterActive && " (filtered)"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Sort Dropdown */}
          <DropdownFilter
            options={sortOptions}
            selected={sortBy}
            placeholder="Sort By"
            onSelect={(value) => handleSort(value || "recommended")}
          />
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search courses by name, specialization, or keywords..."
          value={filters.search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
        />
      </div>

      {/* Active Filters */}
      {isFilterActive && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(filters).map(([key, value]) => {
            if (value && value !== "") {
              const filterLabel =
                key === "courseType"
                  ? "Course Type"
                  : key === "feesRange"
                  ? "Fees Range"
                  : key.charAt(0).toUpperCase() + key.slice(1);
              return (
                <span
                  key={key}
                  className="inline-flex items-center gap-2 bg-primary-main text-white px-3 py-1 rounded-full text-sm"
                >
                  {filterLabel}: {value}
                  <button
                    onClick={() => removeFilter(key as keyof FilterState)}
                    className="hover:bg-white/20 rounded-full p-1"
                  >
                    <FaTimes className="text-xs" />
                  </button>
                </span>
              );
            }
            return null;
          })}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar - Filters */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 sticky top-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
              <button
                onClick={clearAllFilters}
                className="text-primary-main hover:text-primary-darker transition-colors"
              >
                <FaRedo className="text-lg" />
              </button>
            </div>

            {/* Course Type */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-3">Course Type</h4>
              <div className="space-y-2">
                {courseTypeOptions.map((option) => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.courseType === option.value}
                      onChange={(e) =>
                        handleFilterChange(
                          "courseType",
                          e.target.checked ? option.value : null
                        )
                      }
                      className="rounded border-gray-300 text-primary-main focus:ring-primary-main"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-3">Duration</h4>
              <DropdownFilter
                options={durationOptions}
                selected={filters.duration}
                placeholder="Select Duration"
                onSelect={(value) => handleFilterChange("duration", value)}
              />
            </div>

            {/* Level */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-3">Level</h4>
              <DropdownFilter
                options={levelOptions}
                selected={filters.level}
                placeholder="Select Level"
                onSelect={(value) => handleFilterChange("level", value)}
              />
            </div>

            {/* Stream-wise */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-3">Stream-wise</h4>
              <DropdownFilter
                options={streamOptions}
                selected={filters.stream}
                placeholder="Select Stream"
                searchable={true}
                onSelect={(value) => handleFilterChange("stream", value)}
              />
            </div>

            {/* Rating Wise */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-3">Rating Wise</h4>
              <DropdownFilter
                options={ratingOptions}
                selected={filters.rating}
                placeholder="Select Rating"
                onSelect={(value) => handleFilterChange("rating", value)}
              />
            </div>

            {/* Fees Range */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-3">Fees Range</h4>
              <DropdownFilter
                options={feesRangeOptions}
                selected={filters.feesRange}
                placeholder="Select Fees Range"
                onSelect={(value) => handleFilterChange("feesRange", value)}
              />
            </div>
          </div>
        </div>

        {/* Main Content - Course Cards */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <FaSpinner className="animate-spin text-4xl text-primary-main" />
            </div>
          ) : coursesData.courses.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {coursesData.courses.map((course) => {
                  const formattedCourse = formatCourseData(course);
                  return (
                    <div
                      key={course.course_id}
                      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                    >
                      {/* Header */}
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary-main transition-colors line-clamp-2">
                          {formattedCourse.title}
                        </h3>
                        <button className="text-gray-400 hover:text-primary-main transition-colors">
                          <FaBookmark className="text-lg" />
                        </button>
                      </div>

                      {/* Course Details */}
                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Fees</span>
                          <span className="font-semibold text-gray-800">
                            {formattedCourse.fees}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Providers</span>
                          <span className="font-semibold text-gray-800">
                            {formattedCourse.providers}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Rating</span>
                          <span className="font-semibold text-gray-800">
                            {formattedCourse.rating}
                          </span>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          {formattedCourse.duration}
                        </span>
                        <div className="bg-gray-100 rounded-full p-2 group-hover:bg-primary-main group-hover:text-white transition-all duration-300">
                          <FaArrowRight className="text-sm" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {coursesData.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>

                  {Array.from(
                    { length: Math.min(5, coursesData.totalPages) },
                    (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 border rounded-md ${
                            currentPage === page
                              ? "bg-primary-main text-white border-primary-main"
                              : "border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    }
                  )}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === coursesData.totalPages}
                    className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No courses found
              </h3>
              <p className="text-gray-500">
                Try adjusting your filters or search terms to find more courses.
              </p>
              {isFilterActive && (
                <button
                  onClick={clearAllFilters}
                  className="mt-4 px-6 py-2 bg-primary-main text-white rounded-lg hover:bg-primary-darker transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}

          {/* Advertisement Banner */}
          <div className="mt-8 bg-green-100 border border-green-200 rounded-xl p-6 text-center">
            <div className="text-green-800 font-semibold text-lg mb-2">
              LOGO • COMPANY NAME
            </div>
            <div className="text-green-700 mb-4">ADVERTISE YOUR BRAND HERE</div>
            <div className="text-sm text-green-600">
              Contact: 7290948417 | contact@collegepucho.com
            </div>
          </div>

          {/* Guidance Section */}
          <div className="mt-8 bg-yellow-100 border border-yellow-200 rounded-xl p-6 text-center">
            <div className="text-yellow-800 font-semibold text-lg mb-4">
              Still Confused? Need Expert Guidance!
            </div>
            <button className="bg-primary-main text-white px-6 py-2 rounded-lg hover:bg-primary-darker transition-colors font-medium">
              Enquire
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesListing;
