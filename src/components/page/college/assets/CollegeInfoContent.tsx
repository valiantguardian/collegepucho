import React from "react";
import {
  CollegeInformation,
  InfoSection,
  PopularCourse,
} from "@/api/@types/college-info";
import { sanitizeHtml } from "@/components/utils/sanitizeHtml";
import "@/app/styles/tables.css";
import Image from "next/image";
import { FaAngleRight, FaClock } from "react-icons/fa";
import {
  formatDurationRange,
  formatFeeRange,
  getTrueRating,
} from "@/components/utils/utils";
import { TiStarFullOutline } from "react-icons/ti";
import Link from "next/link";
import TocGenerator from "@/components/miscellaneous/TocGenerator";
import RatingComponent from "@/components/miscellaneous/RatingComponent";

interface CollegeInfoProps {
  data: CollegeInformation;
  news: InfoSection[];
  course: PopularCourse[];
  info: InfoSection[];
}

const InfoCard: React.FC<{
  icon?: string;
  label: string;
  value?: string | number | null;
  labelClassName?: string;
  valueClassName?: string;
  iconClassName?: string;
  underline?: boolean;
  star?: boolean;
}> = ({
  icon,
  label,
  value,
  labelClassName = "",
  valueClassName = "",
  iconClassName = "",
  underline = false,
  star = false,
}) => (
  <div className="flex items-center gap-x-2 min-w-fit">
    {star ? (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="#FFC107" className="inline-block"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
    ) : (
      icon && <Image src={icon} alt={label} width={22} height={22} className={iconClassName} />
    )}
    <span className={`text-gray-500 text-base ${underline ? "border-b-4 border-primary-main pb-0.5" : ""} ${labelClassName}`}>{label}</span>
    <span className={`ml-1 text-base font-bold text-black ${valueClassName}`}>{value ? value : "-"}</span>
  </div>
);

const CourseCard: React.FC<{ course: PopularCourse }> = ({ course }) => {
  const courseDetails = [
    {
      label: "No of specialisations",
      value: `${course.count}+`,
      valueClass: "text-gray-900 font-bold text-lg",
    },
    {
      label: "Median Salary",
      value: `${formatFeeRange(course.min_salary, course.max_salary)}`,
      valueClass: "text-gray-900 font-bold text-lg",
    },
    {
      label: "Tuition Fees",
      value: `${formatFeeRange(course.min_fees, course.max_fees)}`,
      valueClass: "text-gray-900 font-bold text-lg",
    },
    {
      label: "Exam Excepted",
      value: course.exam_accepted?.[0] || "-",
      valueClass: course.exam_accepted?.length ? "text-blue-600 font-bold text-lg" : "text-gray-900 font-bold text-lg",
    },
    {
      label: "Rating",
      value: (
        <span className="flex items-center justify-center gap-1 text-lg font-bold">
          <svg width={18} height={18} viewBox="0 0 24 24" fill="#12B76A" className="inline-block"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
          {getTrueRating(course.rating)}
        </span>
      ),
      valueClass: "",
    },
  ];

  return (
    <div className="bg-white border border-blue-100 rounded-2xl px-6 py-5 mb-6 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {course.course_group_full_name}
            <span className="text-gray-500 font-medium ml-1">
              ({course.course_group_name})
            </span>
          </h3>
          <div className="text-blue-600 text-sm font-medium">
            {formatDurationRange(course.min_duration, course.max_duration)}
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 text-blue-600 font-semibold rounded-lg text-base shadow-none hover:bg-blue-100 transition">
          <svg width={20} height={20} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>
          Compare
        </button>
      </div>
      {/* Divider */}
      <div className="border-t border-dashed border-blue-200 mb-4"></div>
      {/* Details Row - Single Column Layout */}
      <div className="space-y-4">
        {courseDetails.map(({ label, value, valueClass }) => (
          <div key={label} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
            <div className="text-gray-500 text-sm">{label}</div>
            <div className={valueClass}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CollegeInfoContent: React.FC<CollegeInfoProps> = ({
  data,
  info,
  course,
}) => {
  const overviewData = [
    {
      label: "Established in",
      value: data?.founded_year,
      icon: "/svg/calander.svg",
    },
    {
      label: "Courses",
      value: data?.course_count ? `${data.course_count}+` : "-",
      icon: "/svg/course.svg",
    },
    {
      label: "Type",
      value: data?.type_of_institute,
      icon: "/svg/institute.svg",
    },
    {
      label: "Campus Size",
      value: data?.campus_size ? `${data.campus_size} acres` : "-",
      icon: "/svg/placement.svg",
    },
    {
      label: "Reviews",
      value: data?.kapp_rating,
      star: true,
    },
    {
      label: "NAAC Grade",
      value: data?.nacc_grade || "-",
      icon: "/svg/ranking.svg",
    },
  ];

  const sanitizedHtml = sanitizeHtml(info[0]?.description || "");

  return (
    <>
      <div className="article-content-body">
        <h2 className="text-2xl font-bold mb-6 text-primary-main">
          Quick Overview
        </h2>
        {/* Single Column Layout for Overview */}
        <div className="space-y-4">
          {overviewData.map((item, index) => (
            <InfoCard
              key={index}
              label={item.label}
              value={item.value}
              icon={item.icon}
              star={item.star}
            />
          ))}
        </div>
      </div>
      
      <TocGenerator content={sanitizedHtml} />
      
      {sanitizedHtml && (
        <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
      )}
      
      <RatingComponent />
      
      <div className="article-content-body">
        <h2 className="text-2xl font-semibold mb-6">
          {data.college_name.length < 60
            ? data?.college_name
            : data?.short_name}
          <span className="text-primary-main"> Popular Courses</span>
        </h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          {data?.short_name} provides campus placement to students in various
          fields. It is known for its excellent placement records throughout the
          year.
        </p>
        
        {/* Single Column Layout for Courses */}
        <div className="space-y-6">
          {course.length > 0 &&
            course
              .slice(0, 4)
              .map((course) => (
                <CourseCard key={course.course_group_id} course={course} />
              ))}
        </div>
        
        <div className="mt-8 text-center">
          <Link
            href={`/colleges/${data.slug.replace(/-\d+$/, "")}-${
              data.college_id
            }/courses`}
            className="bg-gradient-to-r from-primary-main to-blue-600 px-8 py-4 rounded-full text-white font-semibold text-base flex items-center gap-3 w-fit mx-auto shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
          >
            View All Courses <FaAngleRight className="text-sm" />
          </Link>
        </div>
      </div>
    </>
  );
};

export default CollegeInfoContent;
