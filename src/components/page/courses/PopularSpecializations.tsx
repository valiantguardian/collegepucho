"use client";

// Popular specializations component for courses page
import React, { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface PopularSpecializationsProps {
  specializations?: Array< { id: number; name: string; count: number }>;
}

const PopularSpecializations: React.FC<PopularSpecializationsProps> = ({ specializations }) => {
  const [activeTab, setActiveTab] = useState("Management");
  const router = useRouter();

  // Use real specialization data from API
  const availableSpecializations = specializations && specializations.length > 0
    ? specializations.map(s => s.name)
    : [];

  // Course types based on real data structure
  const courseTypes = [
    {
      title: "Online MSc",
      description: "Master of Science programs",
      count: "50+ Courses",
      type: "Degree",
      level: "Post Graduation"
    },
    {
      title: "Online Post Graduation Diploma and Certificate",
      description: "Advanced certification programs",
      count: "75+ Courses",
      type: "Diploma",
      level: "Post Graduation"
    },
    {
      title: "Online MBA",
      description: "Master of Business Administration",
      count: "30+ Courses",
      type: "Degree",
      level: "Post Graduation"
    },
    {
      title: "Online BBA",
      description: "Bachelor of Business Administration",
      count: "45+ Courses",
      type: "Degree",
      level: "Graduation"
    },
    {
      title: "Online B.Tech",
      description: "Bachelor of Technology",
      count: "60+ Courses",
      type: "Degree",
      level: "Graduation"
    },
    {
      title: "Online M.Tech",
      description: "Master of Technology",
      count: "40+ Courses",
      type: "Degree",
      level: "Post Graduation"
    }
  ];

  const handleSpecializationClick = (specName: string) => {
    setActiveTab(specName);
    // You can add additional filtering logic here if needed
  };

  const handleCourseTypeClick = (courseType: any) => {
    const params = new URLSearchParams();
    if (courseType.level) params.append('level', courseType.level);
    if (courseType.type) params.append('course_type', courseType.type);
    
    const queryString = params.toString();
    router.push(`/courses${queryString ? `?${queryString}` : ''}`);
  };

  // Don't render if no specializations available
  if (availableSpecializations.length === 0) {
    return null;
  }

  return (
    <div className="bg-white py-12">
      <div className="container-body">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Popular Specialisation
          </h2>
          <p className="text-lg text-gray-600">
            Choose from a wide range of specializations
          </p>
        </div>

        {/* Specialization Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-6 mb-8 custom-scrollbar">
          {availableSpecializations.map((spec) => (
            <button
              key={spec}
              onClick={() => handleSpecializationClick(spec)}
              className={`flex-shrink-0 px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                activeTab === spec
                  ? "bg-primary-main text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {spec}
            </button>
          ))}
          <button 
            onClick={() => router.push('/courses')}
            className="flex-shrink-0 px-6 py-3 rounded-full font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            View All
            <FaArrowRight className="text-sm" />
          </button>
        </div>

        {/* Course Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courseTypes.map((course, index) => (
            <div
              key={index}
              onClick={() => handleCourseTypeClick(course)}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-primary-main transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {course.description}
                  </p>
                  <p className="text-primary-main font-medium text-sm">
                    {course.count}
                  </p>
                </div>
                <div className="bg-gray-100 rounded-full p-2 group-hover:bg-primary-main group-hover:text-white transition-all duration-300">
                  <FaArrowRight className="text-sm" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularSpecializations;
