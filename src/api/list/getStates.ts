// "use server";

export interface StateDto {
  state_id: number;
  state_name: string;
  country_id: number;
  country_name: string;
}

export const getStates = async (): Promise<StateDto[]> => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  if (!API_URL) {
    throw new Error("Missing API configuration (API_URL)");
  }

  try {
    // According to docs: GET /states
    const response = await fetch(`${API_URL}/states`, {
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
    throw new Error("Failed to fetch states data.");
  }
};
