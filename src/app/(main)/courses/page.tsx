import React from "react";
import Script from "next/script";
import { getCourses } from "@/api/list/getCourses";
import { getNavData } from "@/api/list/getNavData";

import { Metadata } from "next";
import {
  CoursesHero,
  CoursesListing,
  PopularSpecializations,
  TrendingStreams,
} from "@/components/page/courses";

export const metadata: Metadata = {
  title: "Courses - College Pucho",
  description:
    "Explore thousands of courses across various streams and specializations. Find the perfect course for your career goals.",
  keywords:
    "courses, distance learning, graduation courses, post graduation, certificate courses, diploma programs",
  openGraph: {
    title: "Courses - College Pucho",
    description:
      "Explore thousands of courses across various streams and specializations.",
    type: "website",
    url: "https://collegepucho.com/courses",
  },
};

// Generate JSON-LD structured data
const generateJSONLD = () => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Courses",
  description:
    "Comprehensive collection of courses across various streams and specializations",
  url: "https://collegepucho.com/courses",
  numberOfItems: "1000+",
  itemListElement: [
    {
      "@type": "Course",
      name: "Courses",
      description: "Explore our wide range of courses",
      provider: {
        "@type": "Organization",
        name: "College Pucho",
      },
    },
  ],
});

interface CoursesPageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
    stream?: string;
    level?: string;
  }>;
}

const CoursesPage = async ({ searchParams }: CoursesPageProps) => {
  try {
    const params = await searchParams;
    const search = params.search || "";
    const page = parseInt(params.page || "1");
    const stream = params.stream || "";
    const level = params.level || "";

    const [coursesData, navData] = await Promise.all([
      getCourses({
        page,
        limit: 12,
        search: search.trim(), // Ensure search is trimmed
        stream_id: stream ? parseInt(stream) : undefined,
        level: level || undefined,
      }),
      getNavData(),
    ]);

    const jsonLD = generateJSONLD();

    return (
      <>
        <Script
          id="courses-ld-json"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLD) }}
        />

        <CoursesHero />

        <TrendingStreams streams={navData?.over_stream_section || []} />

        <PopularSpecializations
          specializations={navData?.over_stream_section?.map((s) => ({
            id: s.stream_id,
            name: s.stream_name,
            count: s.colleges?.length || 0,
          }))}
        />

        <section className="container-body py-8">
          <CoursesListing
            initialCoursesData={coursesData}
            filterData={navData}
            initialSearch={search}
            initialStream={stream}
            initialLevel={level}
          />
        </section>
      </>
    );
  } catch (error) {
    let errorMessage = "Unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return (
      <div className="container-body py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Courses</h1>
          <p className="text-gray-600 mb-4">
            Unable to load courses at the moment. Please try again later.
          </p>
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="font-semibold text-red-800 mb-2">Error Details:</h3>
            <p className="text-red-700 text-sm">{errorMessage}</p>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            <p>Please check:</p>
            <ul className="list-disc list-inside mt-2">
              <li>Backend server is running</li>
              <li>API endpoint is accessible</li>
              <li>Network connection is stable</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
};

export default CoursesPage;
