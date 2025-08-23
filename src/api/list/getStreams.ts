"use server";

import { HomeStream } from "../@types/header-footer";

export const getStreams = async (): Promise<HomeStream[]> => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  if (!API_URL) {
    throw new Error("Missing API configuration (API_URL)");
  }

  try {
    // According to docs: GET /streams
    const response = await fetch(`${API_URL}/streams`, {
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
    throw new Error("Failed to fetch streams data.");
  }
};