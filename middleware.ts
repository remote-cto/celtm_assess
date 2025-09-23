import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require an admin session
const adminProtectedRoutes = ["/dean-dashboard"]; 
// Routes that require a student session
const studentProtectedRoutes = ["/dashboard"]; 

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current path starts with any of the admin protected routes
  if (adminProtectedRoutes.some((route) => pathname.startsWith(route))) {
    const adminCookie = request.cookies.get("adminSession");
    if (!adminCookie) {
      // No admin session found, redirect to login
      const url = request.nextUrl.clone();
      url.pathname = "/Login";
      return NextResponse.redirect(url);
    }
  }

  // Check if the current path starts with any of the student protected routes
  if (studentProtectedRoutes.some((route) => pathname.startsWith(route))) {
    const studentCookie = request.cookies.get("studentSession");
    if (!studentCookie) {
      // No student session found, redirect to login
      const url = request.nextUrl.clone();
      url.pathname = "/Login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Apply middleware to all protected routes and their sub-paths
export const config = {
  matcher: ["/dean-dashboard/:path*", "/dashboard/:path*"],
};