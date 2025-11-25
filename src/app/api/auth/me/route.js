import jwt from "jsonwebtoken";
import {auth} from "../../../../../auth.ts"
import {NextResponse} from "next/server"

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function GET(request) {
  try {
    //
    // ----------------------------------------------------------
    // 1. EMAIL/PASSWORD AUTH (JWT COOKIE)
    // ----------------------------------------------------------
    //
    const token = request.cookies?.get("token")?.value ?? null;

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return NextResponse.json({
          ok: true,
          authMethod: "credentials",
          userId: decoded.id,
          email: decoded.email,
          image: decoded?.image ? decoded.image : null,
        });
      } catch (err) {
        console.warn("Invalid JWT:", err.message);
      }
    }

    //
    // ----------------------------------------------------------
    // 2. OAUTH AUTH (Auth.js)
    // ----------------------------------------------------------
    //
    const oauth = await auth();

    if (oauth?.user) {
      return NextResponse.json({
        ok: true,
        authMethod: "oauth",
        userId: oauth.userId,
        email: oauth.user.email,
        image: oauth.user.image,
      });
    }

    //
    // ----------------------------------------------------------
    // 3. NO AUTH FOUND
    // ----------------------------------------------------------
    //
    return NextResponse.json(
      { ok: false, error: "Not authenticated" },
      { status: 401 }
    );
  } catch (err) {
    console.error("Unexpected error in /api/auth/me:", err);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
