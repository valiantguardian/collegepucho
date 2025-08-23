"use client";

import React, { useState } from "react";
import { FaSearch, FaBookOpen, FaGraduationCap, FaUsers, FaLaptop } from "react-icons/fa";
import { useRouter } from "next/navigation";

const CoursesHero = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Redirect to courses page with search parameter
      router.push(`/courses?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="bg-primary-darker text-white">
      <div className="container-body py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Learn Online.
              <span className="block">Anytime. Anywhere.</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-gray-100 leading-relaxed">
              From beginners to pros — we have something for everyone. 
              Flexible, affordable, and 100% online.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative max-w-2xl lg:max-w-lg">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for courses, streams, or specializations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 pl-14 text-lg text-gray-800 bg-white rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-secondary-main/30 transition-all"
                />
                <FaSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-secondary-main hover:bg-secondary-darker text-white px-6 py-2 rounded-full font-semibold transition-colors"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* Right Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="w-80 h-80 bg-gradient-to-br from-secondary-main to-secondary-light rounded-full flex items-center justify-center">
                <FaLaptop className="text-white text-8xl" />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white rounded-full p-4 shadow-lg">
                <FaBookOpen className="text-primary-main text-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesHero;
