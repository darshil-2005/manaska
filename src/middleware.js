import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Get JWT token from cookies (for credentials login and OAuth callback)
  const jwtToken = request.cookies.get("token")?.value;
  
  // Get NextAuth session token (for direct OAuth flow)
  const nextAuthToken = await getToken({
    req: request, 
    secret: process.env.AUTH_SECRET
  });

  // Function to verify JWT token
  const verifyJWT = (token) => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  };

  // Check if user is authenticated (either via JWT or NextAuth)
  const isAuthenticated = () => {
    if (jwtToken && verifyJWT(jwtToken)) {
      return true;
    }
    if (nextAuthToken) {
      return true;
    }
    return false;
  };

  // Block all /api/* routes except /api/auth/*
  if (pathname.startsWith("/api/") && !pathname.startsWith("/api/auth")) {
    if (!isAuthenticated()) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized: No token provided" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    return NextResponse.next();
  }

  // Block protected pages if not authenticated
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/canvas") || 
    pathname.startsWith("/settings") 
  ) {
    if (!isAuthenticated()) {
      // Redirect to login page
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
    "/settings/:path*",
  ],
};
