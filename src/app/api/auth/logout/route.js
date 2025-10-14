import { NextResponse } from "next/server";

export async function POST() {
    try {
        const response = NextResponse.json({ message: "Logged out successfully" });

        // Clear cookie
        response.cookies.set("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            expires: new Date(0),
        });

        return response;
    } catch (err) {
        console.error("Logout error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
