import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function GET(request) {
  try {
    // Get the NextAuth session
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.redirect(new URL("/login?error=oauth_failed", request.url));
    }

    const user = session.user;

    // Generate JWT token compatible with your existing system
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        username: user.name || user.email?.split('@')[0] || 'user',
        name: user.name 
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Create response and set the JWT token cookie
    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.redirect(new URL("/login?error=oauth_callback_failed", request.url));
  }
}
