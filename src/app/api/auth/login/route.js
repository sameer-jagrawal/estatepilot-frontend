import { NextResponse } from "next/server";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/";

function getSetCookieHeaders(headers) {
  if (typeof headers.getSetCookie === "function") {
    return headers.getSetCookie();
  }

  const setCookie = headers.get("set-cookie");
  if (!setCookie) {
    return [];
  }

  return setCookie.split(/,(?=\s*[^;,=]+=[^;,]+;)/);
}

export async function POST(request) {
  const body = await request.text();
  const upstreamResponse = await fetch(new URL("auth/login", apiBaseUrl), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
    cache: "no-store",
  });

  const data = await upstreamResponse.json();
  const response = NextResponse.json(data, {
    status: upstreamResponse.status,
  });

  for (const cookie of getSetCookieHeaders(upstreamResponse.headers)) {
    response.headers.append("Set-Cookie", cookie);
  }

  return response;
}
