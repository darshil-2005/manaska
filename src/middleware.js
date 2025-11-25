// middleware.ts
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Helper: ask /api/auth/me if the user is authenticated
  async function isAuthenticated() {
    try {
      const origin = request.nextUrl.origin;

      const res = await fetch(`${origin}/api/auth/me`, {
        method: "GET",
        headers: {
          // forward cookies for:
          // - credentials: cookie "token"
          // - oauth: Auth.js cookies
          cookie: request.headers.get("cookie") ?? "",
        },
      });

      if (!res.ok) return false;

      const data = await res.json();
      return Boolean(data?.ok);
    } catch (err) {
      console.error("Auth check failed in middleware:", err);
      return false;
    }
  }

  // 1) Protect all /api/* routes EXCEPT /api/auth/*
  if (pathname.startsWith("/api/") && !pathname.startsWith("/api/auth")) {
    const ok = await isAuthenticated();
    if (!ok) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    return NextResponse.next();
  }

  // 2) Protect pages: /dashboard , /canvas , /settings
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/canvas") ||
    pathname.startsWith("/settings")
  ) {
    const ok = await isAuthenticated();
    if (!ok) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // 3) Allow everything else
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
