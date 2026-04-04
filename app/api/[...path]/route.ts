import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:33333";

async function handler(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const url = `${BACKEND_URL}/${path.join("/")}${request.nextUrl.search}`;

  const requestHeaders = new Headers();
  const cookie = request.headers.get("cookie");
  if (cookie) requestHeaders.set("cookie", cookie);
  const contentType = request.headers.get("content-type");
  if (contentType) requestHeaders.set("content-type", contentType);
  const authorization = request.headers.get("authorization");
  if (authorization) requestHeaders.set("authorization", authorization);

  let body: ArrayBuffer | undefined;
  if (request.method !== "GET" && request.method !== "HEAD") {
    body = await request.arrayBuffer();
  }

  const backendResponse = await fetch(url, {
    method: request.method,
    headers: requestHeaders,
    body: body,
  });

  const responseHeaders = new Headers();
  const ct = backendResponse.headers.get("content-type");
  if (ct) responseHeaders.set("content-type", ct);

  const setCookies = backendResponse.headers.getSetCookie();
  for (const c of setCookies) {
    responseHeaders.append("set-cookie", c);
  }

  return new NextResponse(backendResponse.body, {
    status: backendResponse.status,
    headers: responseHeaders,
  });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
