import { CourseDTO } from "../@types/course-type";

interface GetCoursesParams {
  page?: number;
  limit?: number;
  search?: string;
  course_name?: string;
  spec_id?: number;
  stream_id?: number;
  specialization_id?: number;
  course_group_id?: number;
  level?: string;
  course_type?: string;
  course_mode?: string;
  course_level?: string;
  duration_type?: string;
  min_duration?: number;
  max_duration?: number;
  min_kap_score?: number;
  max_kap_score?: number;
  is_online?: boolean;
  online_only?: boolean;
  is_integrated_course?: boolean;
  is_approved?: boolean;
  is_active?: boolean;
  degree_type?: string;
  course_format?: string;
  specialization_ids?: number[];
  course_group_ids?: number[];
  sort_by?: string;
  sort_order?: "ASC" | "DESC";
}

export const getCourses = async (
  params: GetCoursesParams = {}
): Promise<{
  courses: CourseDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const BEARER_TOKEN = process.env.NEXT_PUBLIC_BEARER_TOKEN;

  if (!API_URL) {
    throw new Error("API URL is missing from environment variables.");
  }

  if (!BEARER_TOKEN) {
    throw new Error("Bearer token is missing from environment variables.");
  }

  try {
    // Build query parameters for the public API
    const queryParams = new URLSearchParams();

    // Add all parameters to query string
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((v) => queryParams.append(`${key}[]`, v.toString()));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });

    const queryString = queryParams.toString();
    const endpoint = `/courses/list${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${BEARER_TOKEN}`,
      },
      // Ensure client-side requests don't hang forever
      signal: AbortSignal.timeout(12000),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Return data in the expected format
    return {
      courses: data.data || data.courses || data,
      total: data.total || 0,
      page: data.currentPage || data.page || 1,
      limit: data.limit || 24,
      totalPages:
        data.totalPages || Math.ceil((data.total || 0) / (data.limit || 24)),
    };
  } catch (error) {
    // Handle rate limiting errors
    if (error instanceof Error && error.message.includes("Rate limit")) {
      throw new Error("Too many requests. Please wait before trying again.");
    }

    // Handle other API errors
    throw new Error("Failed to fetch courses. Please try again later.");
  }
};

// Helper function for getting course groups
export const getCourseGroups = async (): Promise<any[]> => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const BEARER_TOKEN = process.env.NEXT_PUBLIC_BEARER_TOKEN;

  if (!API_URL) {
    throw new Error("API URL is missing from environment variables.");
  }

  if (!BEARER_TOKEN) {
    throw new Error("Bearer token is missing from environment variables.");
  }

  try {
    const response = await fetch(`${API_URL}/course_group`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${BEARER_TOKEN}`,
      },
      // Ensure client-side requests don't hang forever
      signal: AbortSignal.timeout(12000),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    // Return empty array on error
    return [];
  }
};
