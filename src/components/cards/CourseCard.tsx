import React from "react";
import { HiOutlineDocumentText, HiOutlineDocumentDownload } from "react-icons/hi";
import { AiFillStar } from "react-icons/ai";
import { formatTuitionFee, getTrueRating } from "../utils/utils";
import { CourseVal } from "@/api/@types/college-info";
import Link from "next/link";

interface CourseCardProps {
  course: CourseVal;
  courseGroupName?: string;
}

const CourseCard = React.memo(
  ({
    course,
    courseGroupName,
  }: {
    course: CourseVal;
    courseGroupName?: string;
  }) => {
    const courseSlug = course?.course_name
      ? course.course_name
          .replace(/[^a-zA-Z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .toLowerCase()
      : courseGroupName
          ?.replace(/[^a-zA-Z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .toLowerCase() || "";

    const courseDetails = [
      {
        label: "Median Salary",
        value: `${formatTuitionFee(course.direct_salary)}`,
        valueClass: "text-gray-8 font-bold text-base md:text-lg",
      },
      {
        label: "Tuition Fees",
        value: `${formatTuitionFee(course.direct_fees)}`,
        valueClass: "text-gray-8 font-bold text-base md:text-lg",
      },
      {
        label: "Exam Excepted",
        value: course.exam_accepted?.[0]?.exam_name || "-",
        valueClass: course.exam_accepted?.[0]?.exam_name ? "text-primary-main font-bold text-base md:text-lg" : "text-gray-8 font-bold text-base md:text-lg",
      },
      {
        label: "Rating",
        value: (
          <span className="flex items-center justify-center gap-1 text-base md:text-lg font-bold text-gray-4">
            <AiFillStar className="text-gray-4 text-lg" />
            {getTrueRating(course.kapp_rating)}
          </span>
        ),
        valueClass: "",
      },
    ];

    return (
      <div className="bg-gray-1 rounded-2xl px-6 py-5 mb-3">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-3 gap-2">
          <div>
            <Link
              href={`course-${courseSlug}-${course.college_wise_course_id}`}
              className="text-base md:text-lg font-bold leading-5 text-gray-8 hover:underline"
            >
              {course?.course_name || courseGroupName || "Unnamed Course"}
            </Link>
            <div className="text-primary-main text-xs md:text-sm font-medium mt-1 mb-1 flex items-center gap-1">
              6months - 1year
            </div>
          </div>
          <div className="flex gap-2 mt-2 md:mt-0">
            <button className="flex items-center gap-2 px-4 py-2 bg-primary-1 border border-primary-light text-primary-main font-bold rounded-full text-sm shadow-none hover:bg-primary-light/20 transition">
              <HiOutlineDocumentText className="text-primary-main text-lg" />
              Compare
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-3 text-gray-7 font-bold rounded-full text-sm shadow-none hover:bg-gray-3/20 transition">
              <HiOutlineDocumentDownload className="text-gray-7 text-lg" />
              Brochure
            </button>
          </div>
        </div>
        {/* Details Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 pb-1">
          {courseDetails.map(({ label, value, valueClass }) => (
            <div key={label} className="text-center">
              <div className="text-gray-4 text-xs md:text-sm mb-1">{label}</div>
              <div className={valueClass}>{value}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

export default CourseCard;
