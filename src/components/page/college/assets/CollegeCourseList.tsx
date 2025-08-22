"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LuStar as Star, LuSearch as Search } from "react-icons/lu";
import { FaClock } from "react-icons/fa";
import { TiStarFullOutline } from "react-icons/ti";
import { PopularCourse } from "@/api/@types/college-info";
import { formatDuration, formatFeeRange } from "@/components/utils/utils";
import CourseCard from "@/components/cards/CourseCard";
import CourseFilter from "@/components/filters/CourseFIlter";
import { HiOutlineDocumentText, HiOutlineClock, HiOutlineStar } from "react-icons/hi";

interface CollegeCourseListProps {
  courseData: {
    groups: PopularCourse[];
  };
  courseFilter?: any;
  clgName?: string;
}

const CollegeCourseList: React.FC<CollegeCourseListProps> = ({
  courseData,
  courseFilter,
}) => {
  const [filteredData, setFilteredData] = useState<PopularCourse[]>(
    courseData.groups || []
  );
  const [selectedStream, setSelectedStream] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const defaultOpenGroup = courseData.groups[0]?.course_group_id
    ? `group-${courseData.groups[0].course_group_id}`
    : "";

  const getStreamNameById = (streamId: string | null) => {
    if (!streamId || !courseFilter?.stream_section) return "No Stream Selected";
    const stream = courseFilter.stream_section.find(
      (s: { stream_id: string }) => String(s.stream_id) === String(streamId)
    );
    return stream ? stream.stream_name : "Unknown Stream";
  };

  const filterCourses = useCallback(
    (
      streamId: string | null,
      duration: string | null,
      level: string | null
    ) => {
      let filtered = courseData.groups || [];

      if (streamId)
        filtered = filtered.filter(
          (group) => String(group.stream_id) === String(streamId)
        );

      if (duration)
        filtered = filtered.filter((group) => {
          const months = group.duration_in_months;
          return duration === "below 1 year"
            ? months < 12
            : duration === "1-2 years"
            ? months >= 12 && months < 24
            : duration === "2-3 years"
            ? months >= 24 && months < 36
            : duration === "3-4 years"
            ? months >= 36 && months < 48
            : duration === "4+ years"
            ? months >= 48
            : true;
        });

      if (level) filtered = filtered.filter((group) => group.level === level);

      setFilteredData(filtered);
    },
    [courseData.groups]
  );

  const handleFilterChange = useCallback(
    (stream: number | null, duration: string | null, level: string | null) => {
      setSelectedStream(stream !== null ? String(stream) : null);
      setSelectedDuration(duration);
      setSelectedLevel(level);
      filterCourses(stream !== null ? String(stream) : null, duration, level);
    },
    [filterCourses]
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleClear = () => setSearchTerm("");

  const filteredCourses = useMemo(
    () =>
      filteredData.flatMap((group) =>
        group.courses.filter(
          (course) =>
            course.course_name &&
            course.course_name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      ),
    [filteredData, searchTerm]
  );

  const handleRemoveFilter = (type: "stream" | "duration" | "level") => {
    if (type === "stream") setSelectedStream(null);
    if (type === "duration") setSelectedDuration(null);
    if (type === "level") setSelectedLevel(null);
    filterCourses(
      type === "stream" ? null : selectedStream,
      type === "duration" ? null : selectedDuration,
      type === "level" ? null : selectedLevel
    );
  };

  return (
    <div className="article-content-body">
      <div className="relative mb-4">
        <input
          type="text"
          className="pl-12 w-full h-10 border border-gray-3 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-3 focus:border-primary-3"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Search
          color="#828282"
          className="h-5 w-5 absolute top-[18px] left-4 transform -translate-y-1/3"
        />
        {searchTerm && (
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
            onClick={handleClear}
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex gap-2 flex-wrap mt-2">
        {selectedStream && (
          <span className="px-3 py-1 bg-gray-200 rounded-full text-sm flex items-center">
            {getStreamNameById(selectedStream)}
            <button
              className="ml-2 text-red-500"
              onClick={() => handleRemoveFilter("stream")}
            >
              ✕
            </button>
          </span>
        )}
        {selectedDuration && (
          <span className="px-3 py-1 bg-gray-200 rounded-full text-sm flex items-center">
            {selectedDuration}
            <button
              className="ml-2 text-red-500"
              onClick={() => handleRemoveFilter("duration")}
            >
              ✕
            </button>
          </span>
        )}
        {selectedLevel && (
          <span className="px-3 py-1 bg-gray-200 rounded-full text-sm flex items-center">
            {selectedLevel}
            <button
              className="ml-2 text-red-500"
              onClick={() => handleRemoveFilter("level")}
            >
              ✕
            </button>
          </span>
        )}
      </div>

      {searchTerm === "" && filteredData.length > 0 ? (
        <Accordion
          type="single"
          defaultValue={defaultOpenGroup}
          collapsible
          className="w-full"
        >
          {filteredData.map((group) => {
            const courseDetails = [
              {
                label: "No of specialisations",
                value: `${group.course_count || 0}+`,
                className: "text-[#00B8D9]",
              },
              {
                label: "Median Salary",
                value: `${formatFeeRange(group.min_salary, group.max_salary)}`,
              },
              {
                label: "Tuition Fees",
                value: `${formatFeeRange(group.min_fees, group.max_fees)}`,
              },
              {
                label: "Exam Accepted",
                value: Array.isArray(group.exam_accepted)
                  ? group.exam_accepted[0] || "-"
                  : group.exam_accepted || "-",
                className:
                  Array.isArray(group.exam_accepted) && group.exam_accepted[0]
                    ? "text-[#00B8D9]"
                    : "",
              },
              {
                label: "Rating",
                value: `${group.rating || "3.2"}`,
                icon: group.rating && (
                  <HiOutlineStar className="inline-block text-primary-3 mr-1" />
                ),
                className: group.rating
                  ? "text-primary-3 px-3 py-0.5 rounded-2xl"
                  : "text-gray-500",
              },
            ];

            return (
              <AccordionItem
                key={group.course_group_id}
                value={`group-${group.course_group_id}`}
                className="bg-white border border-blue-100 rounded-2xl overflow-hidden mb-6 shadow-sm"
              >
                <AccordionTrigger className="w-full py-0 rounded-t-2xl hover:no-underline px-0">
                  <div className="w-full flex flex-col gap-0">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center px-6 pt-6 pb-2 gap-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-8 mb-1">
                          {group.course_group_full_name}
                          <span className="text-gray-5 font-medium ml-1">
                            ({group.course_group_name})
                          </span>
                        </h3>
                        <div className="text-primary-main text-sm font-medium flex items-center gap-1">
                          <HiOutlineClock className="inline-block text-sm" />
                          <span>{formatDuration(group.duration_in_months)}</span>
                        </div>
                      </div>
                      <button className="flex items-center gap-2 px-4 py-2 bg-primary-1 border border-primary-light text-primary-main font-semibold rounded-lg text-base shadow-none hover:bg-primary-light/20 transition mt-2 md:mt-0">
                        <HiOutlineDocumentText className="text-lg" />
                        Compare
                      </button>
                    </div>
                    <div className="border-t border-dashed border-primary-light mb-2 mx-6"></div>
                    {/* Single Column Layout for Course Details */}
                    <div className="space-y-4 px-6 pb-4">
                      {courseDetails.map(({ label, value, className, icon }) => (
                        <div key={label} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                          <div className="text-gray-500 text-sm">{label}</div>
                          <div className={`font-bold text-base ${className}`}>
                            {icon} {value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-0">
                  {group.courses.length > 0 ? (
                    <div className="flex flex-col gap-3 mt-2 px-2 md:px-6 pb-6">
                      {group.courses.map((course, index) => (
                        <CourseCard
                          key={index}
                          course={course}
                          courseGroupName={group.course_group_full_name}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="p-4 text-gray-5">
                      No courses available in this group.
                    </p>
                  )}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      ) : filteredCourses.length > 0 ? (
        <div className="flex flex-col gap-3 mt-2">
          {filteredCourses.map((course, index) => (
            <CourseCard key={index} course={course} />
          ))}
        </div>
      ) : (
        <p className="mt-4 text-gray-5">
          No courses found matching your search.
        </p>
      )}
    </div>
  );
};

export default CollegeCourseList;
