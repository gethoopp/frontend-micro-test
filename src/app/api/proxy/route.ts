import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

function buildProxyUrl(baseUrl: string, path: string): string {
  const separator = path.startsWith("/") ? "" : "/";
  return `${baseUrl}${separator}${path}`;
}

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path") || "";
  const targetUrl = buildProxyUrl(API_BASE_URL, path);
  
  console.log("[Proxy GET]", targetUrl);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  
  request.headers.forEach((value, key) => {
    const lowerKey = key.toLowerCase();
    if (lowerKey !== "host" && lowerKey !== "content-length") {
      headers[key] = value;
    }
  });

  console.log("[Proxy GET] headers:", JSON.stringify(headers));

  try {
    const response = await fetch(targetUrl, {
      method: "GET",
      headers,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("[Proxy GET] error:", error);
    return NextResponse.json(
      { error: "Failed to connect to backend" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path") || "";
  const targetUrl = buildProxyUrl(API_BASE_URL, path);
  
  console.log("[Proxy POST]", targetUrl);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  
  request.headers.forEach((value, key) => {
    const lowerKey = key.toLowerCase();
    if (lowerKey !== "host" && lowerKey !== "content-length") {
      headers[key] = value;
    }
  });

  console.log("[Proxy POST] headers:", JSON.stringify(headers));

  const body = await request.json();

  try {
    const response = await fetch(targetUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("[Proxy POST] error:", error);
    return NextResponse.json(
      { error: "Failed to connect to backend" },
      { status: 500 }
    );
  }
}
