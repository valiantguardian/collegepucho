import { CollegesResponseDTO } from "../@types/college-list";

const createQueryString = (params: Record<string, string | number>): string =>
  new URLSearchParams(
    Object.entries(params).reduce((acc, [key, value]) => {
      acc[key] = String(value);
      return acc;
    }, {} as Record<string, string>)
  ).toString();

export const getColleges = async ({
  limit = 10,
  page,
  filters = {},
}: {
  limit?: number;
  page: number;
  filters?: Record<string, string>;
}): Promise<CollegesResponseDTO> => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  if (!API_URL) {
    throw new Error("API URL is missing.");
  }

  const queryParams: Record<string, string | number> = { limit, page };
  if (filters.city_id) queryParams.city_id = filters.city_id;
  if (filters.state_id) queryParams.state_id = filters.state_id;
  if (filters.stream_id) queryParams.stream_id = filters.stream_id;

  // According to docs: GET /college-info?page=1&limit=100
  const requestUrl = `${API_URL}/college-info?${createQueryString(queryParams)}`;

  try {
    const response = await fetch(requestUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Fetch failed with status ${response.status}`);
    }

    const data = await response.json();

    // Map the API response to match our expected structure
    // Docs show: { colleges: [...], total: 1000, current_page: 1, total_pages: 10, limit: 100 }
    return {
      filter_section: {
        city_filter: data.filter_section?.city_filter ?? [],
        state_filter: data.filter_section?.state_filter ?? [],
        stream_filter: data.filter_section?.stream_filter ?? [],
        type_of_institute_filter:
          data.filter_section?.type_of_institute_filter ?? [],
        specialization_filter: data.filter_section?.specialization_filter ?? [],
      },
      colleges: data.colleges ?? [],
      total_colleges_count: data.total ?? data.total_colleges_count ?? 0,
    };
  } catch (error) {
    throw new Error("Failed to fetch colleges data.");
  }
};
