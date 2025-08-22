"use client";

import React, { useState, useEffect, useMemo } from "react";
import { HomeCollege, HomeStream } from "@/api/@types/home-datatype";
import Link from "next/link";
import Image from "next/image";
import { StreamFilter } from "@/components/filters/StreamFilter";
import { formatName } from "@/components/utils/utils";
import { FaCalendarAlt, FaStar } from "react-icons/fa";
import { FaRankingStar } from "react-icons/fa6";
import { GiBookshelf } from "react-icons/gi";

interface PrivateCollegeProps {
  data: HomeStream[];
}

const DEFAULT_LOGO = "https://d28xcrw70jd98d.cloudfront.net/allCollegeLogo/defaultLogo1.webp";

const BookmarkIcon = () => (
  <svg className="w-5 h-5" color="#007a66" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
  </svg>
);



const RightArrowIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const CollegeCard: React.FC<{ college: HomeCollege }> = ({ college }) => {
  const {
    college_name,
    course_count,
    NIRF_ranking,
    city_name,
    state_name,
    logo_img,
    nacc_grade,
    kapp_rating,
    slug,
    college_id,
    founded_year,
  } = college;

  const placement_percentage = (college as { placement_percentage?: number })?.placement_percentage;
  const location = [city_name, state_name].filter(Boolean).join(", ");

  return (
    <div className="bg-white rounded-2xl shadow-card1 p-5 relative flex flex-col gap-3">
      <button className="absolute top-4 right-4 text-[#919EAB] hover:text-primary-main" aria-label="Bookmark college">
        <BookmarkIcon />
      </button>

      <div className="flex items-center gap-4">
        <Image
          src={logo_img || DEFAULT_LOGO}
          alt={`${college_name} Logo`}
          width={60}
          height={60}
          className="rounded-xl object-cover bg-white p-1.5 border border-[#F4F6F8]"
        />
        <div className="flex gap-2">
          {nacc_grade && (
            <span className="px-2.5 py-0.5 bg-black text-white text-xs font-semibold rounded-xl">{nacc_grade}</span>
          )}
          <span className="px-2.5 py-0.5 bg-black text-white text-xs font-semibold rounded-xl">UGC</span>
        </div>
      </div>

      <div className="mt-1">
        <Link
          href={`/colleges/${slug.replace(/-\d+$/, "")}-${college_id}`}
       className="font-semibold text-md mt-2"
        >
          {college_name}
        </Link>
        <p className="text-sm text-[#919EAB] mt-0.5">{location}</p>
      </div>

      <div className="border-t border-dashed border-[#DFE3E8] my-3" />

      <div className="flex items-center justify-between gap-2 text-primary-main text-sm font-medium">
        <div className="flex items-center gap-1 text-text-secondary">
          <FaStar className="w-5 h-5" color="#007a66" />
          <span>{kapp_rating || "-"}</span>
        </div>
        <div className="flex items-center gap-1 text-text-secondary">
          <GiBookshelf className="w-5 h-5" color="#007a66" />
          <span>{course_count ? `${course_count}+ Courses` : "-"}</span>
        </div>
        <div className="flex items-center gap-1 text-text-secondary">
          <FaRankingStar className="w-5 h-5" color="#007a66" />
          <span>{NIRF_ranking ? `#${NIRF_ranking} NIRF` : "-"}</span>
        </div>
        <div className="flex items-center gap-1 text-text-secondary">
          <FaCalendarAlt className="w-5 h-5" color="#007a66" />
          <span>{placement_percentage ? `${placement_percentage}% Placed` : founded_year || "—"}</span>
        </div>
      </div>
    </div>
  );
};

const PrivateCollege: React.FC<PrivateCollegeProps> = ({ data }) => {
  const [selectedStreamId, setSelectedStreamId] = useState<string | null>(null);

  const availableStreams = useMemo(() => data.filter((s) => s.colleges?.length), [data]);

  const currentStream = useMemo(() => {
    return availableStreams.find((s) => s.stream_id.toString() === selectedStreamId) || availableStreams[0];
  }, [selectedStreamId, availableStreams]);

  const filteredColleges = useMemo(() => {
    return currentStream?.colleges?.slice(0, 4) || [];
  }, [currentStream]);

  useEffect(() => {
    if (!selectedStreamId && availableStreams.length > 0) {
      setSelectedStreamId(availableStreams[0].stream_id.toString());
    }
  }, [selectedStreamId, availableStreams]);

  if (!data?.length) {
    return <div className="container-body pb-6 md:pb-12">No data available</div>;
  }

  return (
    <div className="container-body py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Popular Private Colleges</h2>
        <Link
          href={
            currentStream?.stream_name !== "Top Private Colleges Without Filter"
              ? `/college/${formatName(currentStream?.stream_name ?? "")}-colleges`
              : "/colleges"
          }
          className="text-primary-main font-semibold flex items-center gap-2"
        >
          View All
          <RightArrowIcon />
        </Link>
      </div>

      <StreamFilter
        streams={availableStreams.map((s) => ({
          stream_id: s.stream_id.toString(),
          stream_name: s.stream_name,
        }))}
        onStreamSelect={setSelectedStreamId}
        currentFilter={selectedStreamId}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
        {filteredColleges.map((college) => (
          <CollegeCard key={college.college_id} college={college} />
        ))}
      </div>
    </div>
  );
};

export default PrivateCollege;
