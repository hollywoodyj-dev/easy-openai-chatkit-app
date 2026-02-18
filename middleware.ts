import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * For /embed-mobile, set only frame-ancestors so no script-src blocks ChatKit eval.
 * This runs before the response is sent so our CSP is present; next.config headers
 * are also applied (same value), so the effective CSP should have no script-src.
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (pathname !== "/embed-mobile") {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  response.headers.set(
    "Content-Security-Policy",
    "frame-ancestors *"
  );
  return response;
}

export const config = {
  matcher: "/embed-mobile",
};
