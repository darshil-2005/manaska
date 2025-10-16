import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // Block all /api/* routes except /api/auth/*
  if (pathname.startsWith("/api/") && !pathname.startsWith("/api/auth")) {
    if (!token) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized: No token provided" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    return NextResponse.next();
  }

  //  Block /canvas and /dashboard pages if no token
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/canvas")
  ) {
    if (!token) {
      // Redirect to login page (or send a 401 JSON response)
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // Allow all other routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/:path*",
    "/dashboard/:path*",
    "/canvas/:path*",
  ],
};