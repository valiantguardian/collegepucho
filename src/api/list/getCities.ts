// "use server";

import { HomeCity } from "../@types/header-footer";

export const getCities = async (): Promise<HomeCity[]> => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  if (!API_URL) {
    throw new Error("Missing API configuration (API_URL)");
  }

  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // According to docs: GET /cities
      const response = await fetch(`${API_URL}/cities`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      
      // Validate that we received an array
      if (!Array.isArray(data)) {
        throw new Error(`Expected array but received: ${typeof data}`);
      }

      return data;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // If this is the last attempt, throw the error
      if (attempt === maxRetries) {
        console.error(`getCities failed after ${maxRetries} attempts:`, lastError);
        throw new Error(`Failed to fetch cities data after ${maxRetries} attempts: ${lastError.message}`);
      }
      
      // Wait before retrying (exponential backoff)
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  // This should never be reached, but TypeScript requires it
  throw lastError || new Error("Failed to fetch cities data");
};