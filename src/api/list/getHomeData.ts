"use server";

import { HomeData } from "../@types/home-datatype";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const fetchData = async (
  url: string,
  options: RequestInit
): Promise<Response> => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Error: ${response.status} ${response.statusText}. ${errorText}`
      );
    }
    return response;
  } catch (error) {
    // Provide more specific error information
    if (error instanceof Error) {
      throw new Error(`Fetch failed: ${error.message}`);
    } else {
      throw new Error(`Fetch failed: Unknown error occurred`);
    }
  }
};

export const getHomeData = async (): Promise<HomeData> => {
  // Enhanced logging for debugging
  console.log("🔍 Environment check:", {
    NODE_ENV: process.env.NODE_ENV,
    API_URL: process.env.NEXT_PUBLIC_API_URL ? "✅ Set" : "❌ Missing",
    API_URL_LENGTH: process.env.NEXT_PUBLIC_API_URL?.length || 0
  });

  if (!API_URL) {
    console.error("❌ Environment variables check failed:", {
      API_URL: API_URL ? "✅ Set" : "❌ Missing"
    });
    throw new Error(
      "API URL is missing from environment variables."
    );
  }

  console.log("🚀 Attempting to fetch from:", `${API_URL}/home-page`);
  
  const response = await fetchData(`${API_URL}/home-page`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    next: { revalidate: 86400 },
  });

  try {
    const data: HomeData = await response.json();
    console.log("✅ Successfully fetched home data");
    return data;
  } catch (error) {
    console.error("❌ JSON parsing failed:", error);
    throw new Error("Failed to parse response as JSON.");
  }
};

export const fetchAndDestructureData = async () => {
  try {
    const homeData = await getHomeData();

    const {
      top_colleges: topCollegeData,
      top_private_colleges_sections: privateCollegeData,
      top_cities: cityData,
      upcoming_exams: examData,
      news_section: articleData,
      courses_section: courseData,
    } = homeData;

    return {
      topCollegeData,
      privateCollegeData,
      cityData,
      examData,
      articleData,
      courseData,
    };
  } catch {
    throw new Error("Failed to fetch exams");
  }
};
