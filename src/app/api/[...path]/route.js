import { NextResponse } from "next/server";

const apiBaseUrl =
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000/api/";

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

function buildTargetUrl(pathSegments, search) {
  const base = apiBaseUrl.endsWith("/") ? apiBaseUrl : `${apiBaseUrl}/`;
  const target = new URL(pathSegments.join("/"), base);
  target.search = search;
  return target;
}

async function proxyRequest(request, context) {
  const { path } = await context.params;
  const targetUrl = buildTargetUrl(path, new URL(request.url).search);
  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  const cookie = request.headers.get("cookie");
  const authorization = request.headers.get("authorization");

  if (contentType) headers.set("content-type", contentType);
  if (cookie) headers.set("cookie", cookie);
  if (authorization) headers.set("authorization", authorization);

  const hasBody = !["GET", "HEAD"].includes(request.method);
  const upstreamResponse = await fetch(targetUrl, {
    method: request.method,
    headers,
    body: hasBody ? await request.arrayBuffer() : undefined,
    cache: "no-store",
  });

  const responseHeaders = new Headers();
  const upstreamContentType = upstreamResponse.headers.get("content-type");
  if (upstreamContentType) {
    responseHeaders.set("content-type", upstreamContentType);
  }

  const response = new NextResponse(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers: responseHeaders,
  });

  for (const setCookie of getSetCookieHeaders(upstreamResponse.headers)) {
    response.headers.append("Set-Cookie", setCookie);
  }

  return response;
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
