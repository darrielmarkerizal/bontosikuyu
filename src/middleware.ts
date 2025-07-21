import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log(" Middleware running for:", pathname);

  // Check if the path starts with /dashboard
  if (pathname.startsWith("/dashboard")) {
    // Check for both token types
    const token =
      request.cookies.get("token") || request.cookies.get("auth_token");

    console.log("🔐 Token found:", !!token);

    // If no token exists, redirect to login
    if (!token) {
      console.log(" No token, redirecting to login");
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // If accessing login page with valid token, redirect to dashboard
  if (pathname === "/login") {
    // Check for both token types
    const token =
      request.cookies.get("token") || request.cookies.get("auth_token");

    console.log("🔐 Token on login page:", !!token);

    if (token) {
      console.log("✅ Token found, redirecting to dashboard");
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  console.log("✅ Middleware passed");
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
