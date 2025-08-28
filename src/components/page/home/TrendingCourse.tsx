import { HomeCourse } from "@/api/@types/home-datatype";
import { BookOpen, GraduationCap, Clock, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

interface TrendingCourseProps {
  data: HomeCourse[];
}

const TrendingCourse: React.FC<TrendingCourseProps> = ({ data }) => {
  const getCourseIcon = (courseId: number) => {
    const icons = [
      { icon: BookOpen, color: "bg-primary-main" },
      { icon: GraduationCap, color: "bg-secondary-main" },
      { icon: Clock, color: "bg-tertiary-main" },
      { icon: Users, color: "bg-success-main" },
      { icon: BookOpen, color: "bg-error-main" },
      { icon: GraduationCap, color: "bg-primary-5" },
    ];
    return icons[courseId % icons.length];
  };

  const formatDuration = (duration: number) => {
    if (duration <= 1) return `${duration} year`;
    return `${duration} years`;
  };

  const getCourseLevel = (level: string | null | undefined) => {
    if (!level) return "Undergraduate";
    return level.charAt(0).toUpperCase() + level.slice(1).toLowerCase();
  };

  return (
    <div className="bg-gradient-to-br from-primary-darker via-primary-7 to-primary-main container-body py-12 md:py-16">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h2 className="font-extrabold lg:text-6xl text-white mb-4">
          Trending Courses
        </h2>
        <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto">
          Discover the most popular courses that students are choosing this year. 
          Find your perfect academic path with our curated selection.
        </p>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {data.slice(0, 8).map((course) => {
          const { icon: IconComponent, color } = getCourseIcon(course.course_id);
          
          return (
            <div
              key={course.course_id}
              className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 group cursor-pointer border border-white/20"
            >
              {/* Course Icon */}
              <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <IconComponent className="w-8 h-8 text-white" />
              </div>

              {/* Course Name */}
              <h3 className="text-gray-8 font-bold text-lg mb-3 line-clamp-2 group-hover:text-primary-main transition-colors duration-300">
                {course.short_name || course.course_name}
              </h3>

              {/* Course Description */}
              <p className="text-gray-6 text-sm mb-4 line-clamp-2">
                {course.description || "Comprehensive course designed to provide in-depth knowledge and practical skills."}
              </p>

              {/* Course Stats */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-5">
                  <Clock className="w-4 h-4" />
                  <span>{formatDuration(course.duration)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-5">
                  <Users className="w-4 h-4" />
                  <span>{getCourseLevel(course.level)}</span>
                </div>
                {course.degree_type && (
                  <div className="flex items-center gap-2 text-sm text-gray-5">
                    <GraduationCap className="w-4 h-4" />
                    <span>{course.degree_type}</span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="flex items-center justify-between">
                <Link 
                  href={`/courses/${course.slug}`}
                  className="text-primary-main font-semibold text-sm hover:text-primary-dark transition-colors duration-300"
                >
                  Learn More
                </Link>
                <ArrowRight className="w-4 h-4 text-primary-main group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          );
        })}
      </div>

      {/* View All Button */}
      <div className="text-center">
        <Link 
          href="/courses"
          className="inline-flex items-center gap-2 bg-white text-primary-main font-bold px-8 py-4 rounded-full hover:bg-gray-100 transition-colors duration-300 shadow-lg hover:shadow-xl"
        >
          View All Courses
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
};

export default TrendingCourse;
