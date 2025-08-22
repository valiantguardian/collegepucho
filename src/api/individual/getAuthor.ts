"use server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const BEARER_TOKEN = process.env.NEXT_PUBLIC_BEARER_TOKEN;

if (!API_URL || !BEARER_TOKEN) {
  throw new Error(
    "API URL or Bearer token is missing from environment variables."
  );
}

export const getAuthor = async (author_id: number) => {
  const response = await fetch(`${API_URL}/authors/author-data/${author_id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${BEARER_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    return null;
  }

  try {
    const data = await response.json();
    return data;
  } catch {
    return null;
  }
};