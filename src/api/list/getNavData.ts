"use server";

import { HeaderProps } from "../@types/header-footer";

export const getNavData = async (): Promise<HeaderProps | null> => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  if (!API_URL) {
    throw new Error("API URL is missing from environment variables.");
  }

  try {
    const response = await fetch(`${API_URL}/home-page/header-footer`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { 
        revalidate: 86400, // 24 hours
        tags: ['nav-data']
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data: HeaderProps = await response.json();
    return data;
  } catch (error) {
    // Handle rate limiting errors
    if (error instanceof Error && error.message.includes("Rate limit")) {
      throw new Error("Too many requests. Please wait before trying again.");
    }

    // Handle other API errors
    return null; // Return null instead of throwing to allow graceful fallback
  }
};

export const fetchAndDestructureData = async () => {
  try {
    const navData = await getNavData();
    if (!navData) {
      throw new Error("Failed to fetch navigation data");
    }
    const {
      over_stream_section: overStreamData,
      cities_section: citiesData,
      stream_section: streamData,
      footer_colleges: footerColleges,
      university_section: universityData,
      exams_section: examSection,
      course_section: courseData,
    } = navData;
    return {
      overStreamData,
      citiesData,
      streamData,
      footerColleges,
      universityData,
      examSection,
      courseData,
    };
  } catch {
    throw new Error("Failed to fetch exams");
  }
};
