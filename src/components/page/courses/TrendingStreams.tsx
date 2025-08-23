// Trending streams component for courses page
import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { OverStreamSectionProps } from "@/api/@types/header-footer";

interface TrendingStreamsProps {
  streams: OverStreamSectionProps[];
}

const TrendingStreams: React.FC<TrendingStreamsProps> = ({ streams }) => {
  // Use real stream data from API
  const trendingStreams = streams.length > 0 
    ? streams.slice(0, 8).map((stream, index) => ({
        name: stream.stream_name,
        count: `${stream.colleges?.length || 0}+`,
        color: `bg-${['blue', 'green', 'purple', 'orange', 'red', 'pink', 'indigo', 'teal'][index % 8]}-500`,
        streamId: stream.stream_id,
        slug: stream.stream_name.toLowerCase().replace(/\s+/g, '-')
      }))
    : [];

  if (trendingStreams.length === 0) {
    return null; // Don't render if no streams available
  }

  return (
    <div className="bg-secondary-main text-white py-12">
      <div className="container-body">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trending Streams
          </h2>
          <p className="text-lg text-gray-100">
            Explore the most popular course categories
          </p>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar">
          {trendingStreams.map((stream, index) => (
            <div
              key={stream.streamId}
              className="flex-shrink-0 bg-white rounded-xl p-6 min-w-48 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              <div className={`w-16 h-16 ${stream.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                <span className="text-white text-2xl font-bold">
                  {stream.name.charAt(0)}
                </span>
              </div>
              <h3 className="text-gray-800 font-semibold text-lg mb-2">
                {stream.name}
              </h3>
              <p className="text-gray-600 text-sm">
                {stream.count} Courses
              </p>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-6">
          <button className="inline-flex items-center gap-2 bg-white text-secondary-main px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors">
            View All Streams
            <FaArrowRight className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrendingStreams;
