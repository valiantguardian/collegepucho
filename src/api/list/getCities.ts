// "use server";

import { HomeCity } from "../@types/header-footer";

export const getCities = async (): Promise<HomeCity[]> => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  if (!API_URL) {
    throw new Error("Missing API configuration (API_URL)");
  }

  try {
    // According to docs: GET /cities
    const response = await fetch(`${API_URL}/cities`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Fetch failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Failed to fetch cities data.");
  }
};