import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // Block all /api/* routes except /api/auth/*
  // This part is fine to keep
  if (pathname.startsWith("/api/") && !pathname.startsWith("/api/auth")) {
    if (!token) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized: No token provided" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    return NextResponse.next();
  }

  // This logic will no longer run on /dashboard or /canvas
  // because they are commented out in the matcher config below.
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
    "/dashboard/:path*", // <-- COMMENTED OUT
    "/canvas/:path*",   // <-- COMMENTED OUT
  ],
};