import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "./lib/supabase/middleware";

const reservedPaths = ['/login', '/read', '/shorturl', '/pomodoro', '/snippet', '/downloader', '/mangadex']
export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const pathname = url.pathname;

  // Root
  if(pathname === '/') {
    return await updateSession(request);
  }

  // Exclude requests for `next_static` files
  if (url.pathname.startsWith('/_next/static')|| url.pathname.startsWith('/avatar.jpg')) {
    return NextResponse.next(); // Allow static files to pass through
  }

  console.log("Incoming Request:", pathname);
  // Check if the pathname matches any reserved path (including `/read/*` dynamically)
  let isReserved = reservedPaths.some(path => pathname === path || pathname.startsWith(`${path}`));

  if (isReserved) {
    return await updateSession(request);
  }

  return NextResponse.rewrite(new URL(`/api/shorturl`, request.url));
}

export const config = {
  matcher: '/((?!next_static).*)', // Ensure it applies globally
};