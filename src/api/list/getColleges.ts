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
  const BEARER_TOKEN = process.env.NEXT_PUBLIC_BEARER_TOKEN;

  if (!API_URL) {
    throw new Error("API URL is missing.");
  }

  if (!BEARER_TOKEN) {
    throw new Error("Bearer token is missing.");
  }

  const queryParams: Record<string, string | number> = { limit, page };
  if (filters.city_id) queryParams.city_id = filters.city_id;
  if (filters.state_id) queryParams.state_id = filters.state_id;
  if (filters.stream_id) queryParams.stream_id = filters.stream_id;

  // According to docs: GET /college-info?page=1&limit=100
  const requestUrl = `${API_URL}/college-info?${createQueryString(queryParams)}`;

  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(requestUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${BEARER_TOKEN}`,
        },
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(15000), // 15 second timeout for college data
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      // Validate that we received the expected data structure
      if (!data || typeof data !== 'object') {
        throw new Error(`Expected object but received: ${typeof data}`);
      }

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
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // If this is the last attempt, throw the error
      if (attempt === maxRetries) {
        console.error(`getColleges failed after ${maxRetries} attempts:`, lastError);
        throw new Error(`Failed to fetch colleges data after ${maxRetries} attempts: ${lastError.message}`);
      }
      
      // Wait before retrying (exponential backoff)
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  // This should never be reached, but TypeScript requires it
  throw lastError || new Error("Failed to fetch colleges data");
};
