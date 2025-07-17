"use client";
import {
  FooterCollege,
  HeaderCollege,
  HeaderCourse,
  HeaderExam,
} from "@/api/@types/header-footer";
import { getNavData } from "@/api/list/getNavData";
import Link from "next/link";
import React, { useEffect, useState, useMemo } from "react";

// Memoize the FooterSection component since it's used multiple times
const FooterSection = React.memo(({
  title,
  data,
  keyExtractor,
  getUrl,
}: {
  title: string;
  data: any[];
  keyExtractor: (item: any) => string;
  getUrl: (item: any) => string;
}) => (
  <div className="space-y-4">
    <h3 className="font-medium text-white text-base">{title}</h3>
    <div className="text-[#637381] space-y-3 text-md flex flex-col">
      {data.map((item) => (
        <Link
          href={getUrl(item)}
          key={keyExtractor(item)}
          className="line-clamp-1 hover:text-primary-1 transition-colors"
        >
          {item.name || item.college_name || item.exam_shortname}
        </Link>
      ))}
    </div>
  </div>
));

FooterSection.displayName = 'FooterSection';

// Constants
const ITEMS_PER_SECTION = 7;

const FooterList = () => {
  const [footerData, setFooterData] = useState<{
    footerColleges: FooterCollege[];
    universityData: HeaderCollege[];
    examSection: HeaderExam[];
    courseData: HeaderCourse[];
  }>({
    footerColleges: [],
    universityData: [],
    examSection: [],
    courseData: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const data = await getNavData();
        setFooterData({
          footerColleges: data.footer_colleges?.slice(0, ITEMS_PER_SECTION) || [],
          universityData: data.university_section?.slice(0, ITEMS_PER_SECTION) || [],
          examSection: data.exams_section?.slice(0, ITEMS_PER_SECTION) || [],
          courseData: data.course_section?.slice(0, ITEMS_PER_SECTION) || [],
        });
      } catch (error) {
        console.error("Error loading footer data", error);
        setError("Failed to load footer data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFooterData();
  }, []);

  // Calculate the number of sections that will be rendered
  const sectionCount = useMemo(() => {
    const { footerColleges, courseData, universityData, examSection } = footerData;
    let count = 1; // Navigation section is always rendered
    if (footerColleges.length > 0) count++;
    if (courseData.length > 0) count++;
    if (universityData.length > 0) count++;
    if (examSection.length > 0) count++;
    return count;
  }, [footerData]);

  // Generate dynamic grid classes based on section count
  const responsiveGridClasses = useMemo(() => {
    const baseClasses = "grid gap-8 py-6";
    type GridColsType = {
      [key: number]: string;
    };
    
    const gridCols: GridColsType = {
      1: "grid-cols-1",
      2: "grid-cols-1 sm:grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
      5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
    };
    
    return `${baseClasses} ${gridCols[sectionCount] || gridCols[5]}`;
  }, [sectionCount]);

  const SkeletonLoader = () => (
    <div className={responsiveGridClasses}>
      {[...Array(sectionCount)].map((_, index) => (
        <div key={index} className="space-y-2">
          <div className="h-6 bg-gray-700 rounded-md w-full animate-pulse"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-700 rounded-md w-3/4 animate-pulse"></div>
          ))}
        </div>
      ))}
    </div>
  );

  if (loading) {
    return <SkeletonLoader />;
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-6">
        {error}
      </div>
    );
  }

  const { footerColleges, courseData, examSection, universityData } = footerData;

  return (
    <div className={responsiveGridClasses}>
      {footerColleges.length > 0 && (
        <FooterSection
          title="Top Colleges"
          data={footerColleges}
          keyExtractor={(item) => item.college_id}
          getUrl={(item) => `/colleges/${item.slug}-${item.college_id}`}
        />
      )}
      {courseData.length > 0 && (
        <FooterSection
          title="Popular Courses"
          data={courseData}
          keyExtractor={(item) => item.course_group_id}
          getUrl={(item) => `/`}
        />
      )}
      {examSection.length > 0 && (
        <FooterSection
          title="Upcoming Exams"
          data={examSection}
          keyExtractor={(item) => item.exam_id}
          getUrl={(item) => `/exams/${item.slug}-${item.exam_id}`}
        />
      )}
      {universityData.length > 0 && (
        <FooterSection
          title="Top Universities"
          data={universityData}
          keyExtractor={(item) => item.college_id}
          getUrl={(item) => `/colleges/${item.slug}-${item.college_id}`}
        />
      )}

      <div className="col-span-1">
        <h3 className="font-medium text-white text-base">Navigation</h3>
        <div className="text-[#637381] space-y-3 text-md flex flex-col">
          <Link href="/contact-us" className="hover:text-primary-1 transition-colors">Contact Us</Link>
          <Link href="/about-us" className="hover:text-primary-1 transition-colors">About Us</Link>
          <Link href="/privacy-policy" className="hover:text-primary-1 transition-colors">Privacy Policy</Link>
          <Link href="/terms-and-conditions" className="hover:text-primary-1 transition-colors">Terms & Conditions</Link>
        </div>
      </div>
    </div>
  );
};

export default FooterList;
