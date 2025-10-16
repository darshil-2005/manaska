import { NextResponse } from "next/server";
import { verifyAuth } from "./utils/verifyAuth";

export async function middleware(request) {
    const { pathname } = request.nextUrl;

    // Skip auth for /api/auth routes
    if (pathname.startsWith("/api/auth")) return NextResponse.next();

    // Protect other /api/* routes
    if (pathname.startsWith("/api/")) {
        const { valid, error } = await verifyAuth(request);

        if (!valid) {
            return new NextResponse(
                JSON.stringify({ error: error || "Unauthorized" }),
                { status: 401, headers: { "Content-Type": "application/json" } }
            );
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/api/:path*"],
};