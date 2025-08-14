import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") ?? "1";
  const pageSize = searchParams.get("pageSize") ?? "16";

  const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
  const BEARER_TOKEN =
    process.env.API_BEARER_TOKEN || process.env.NEXT_PUBLIC_BEARER_TOKEN;

  if (!API_URL || !BEARER_TOKEN) {
    return NextResponse.json(
      { error: "Missing API configuration" },
      { status: 500 }
    );
  }

  try {
    const upstreamResponse = await fetch(
      `${API_URL}/articles?page=${page}&pageSize=${pageSize}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    const data = await upstreamResponse.json().catch(() => undefined);

    if (!upstreamResponse.ok) {
      return NextResponse.json(
        { error: data?.message ?? "Upstream error" },
        { status: upstreamResponse.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 502 }
    );
  }
}


