import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * For /embed-mobile only: strip any existing CSP (from next.config, Vercel, etc.)
 * and set a single permissive policy so ChatKit's script (which uses eval/new Function)
 * can run. Multiple CSP headers are merged by the browser (strictest wins), so we
 * must avoid adding script-src elsewhere and explicitly allow unsafe-eval here.
 */
const EMBED_MOBILE_PERMISSIVE_CSP =
  "default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src *; frame-src *; frame-ancestors *; style-src * 'unsafe-inline';";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (pathname !== "/embed-mobile") {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  response.headers.delete("Content-Security-Policy");
  response.headers.delete("Content-Security-Policy-Report-Only");
  response.headers.set("Content-Security-Policy", EMBED_MOBILE_PERMISSIVE_CSP);
  return response;
}

export const config = {
  matcher: "/embed-mobile",
};
