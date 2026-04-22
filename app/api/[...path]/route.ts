import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

async function handler(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:33333";
  const { path } = await context.params;
  const url = `${BACKEND_URL}/${path.join("/")}${request.nextUrl.search}`;
  console.log("[proxy] BACKEND_URL:", BACKEND_URL, "url:", url);

  const requestHeaders = new Headers();
  const cookie = request.headers.get("cookie");
  if (cookie) requestHeaders.set("cookie", cookie);
  const contentType = request.headers.get("content-type");
  if (contentType) requestHeaders.set("content-type", contentType);
  const authorization = request.headers.get("authorization");
  if (authorization) requestHeaders.set("authorization", authorization);
  const accept = request.headers.get("accept");
  if (accept) requestHeaders.set("accept", accept);

  let body: ArrayBuffer | undefined;
  if (request.method !== "GET" && request.method !== "HEAD") {
    body = await request.arrayBuffer();
  }

  let backendResponse: Response;
  try {
    backendResponse = await fetch(url, {
      method: request.method,
      headers: requestHeaders,
      body: body,
      redirect: "manual",
    });
  } catch (err) {
    const cause = err instanceof Error ? err.cause : err;
    console.error("[proxy] fetch failed", { url, method: request.method, err, cause });
    return new NextResponse(
      JSON.stringify({ error: "fetch failed", url, message: String(err), cause: String(cause) }),
      { status: 502, headers: { "content-type": "application/json" } }
    );
  }

  // 리다이렉트 응답은 내부 도메인인 경우에만 브라우저에 전달
  if (backendResponse.status >= 300 && backendResponse.status < 400) {
    const location = backendResponse.headers.get("location");
    if (location) {
      try {
        const backendOrigin = new URL(BACKEND_URL).origin;
        const locationOrigin = new URL(location).origin;
        if (locationOrigin !== backendOrigin) {
          console.warn("[proxy] 외부 도메인 리다이렉트 차단:", location);
          return new NextResponse(
            JSON.stringify({ error: "외부 도메인으로의 리다이렉트는 허용되지 않습니다." }),
            { status: 403, headers: { "content-type": "application/json" } }
          );
        }
      } catch {
        console.warn("[proxy] location URL 파싱 실패, 리다이렉트 차단:", location);
        return new NextResponse(
          JSON.stringify({ error: "유효하지 않은 리다이렉트 URL입니다." }),
          { status: 403, headers: { "content-type": "application/json" } }
        );
      }
      const redirectHeaders = new Headers();
      const setCookies = backendResponse.headers.getSetCookie();
      for (const c of setCookies) {
        redirectHeaders.append("set-cookie", c);
      }
      return NextResponse.redirect(location, {
        status: backendResponse.status,
        headers: redirectHeaders,
      });
    }
  }

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

export const maxDuration = 60;

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
