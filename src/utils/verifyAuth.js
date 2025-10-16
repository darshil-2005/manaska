import jwt from "jose";
import { users } from "../../db/schema";
import { db } from "../../db/db";
import { eq } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function verifyAuth(request) {
    try {
        const token = request.cookies.get("token")?.value;

        if (!token) {
            return { valid: false, error: "No token found" };
        }

        // Verify JWT signature and expiration
        const decoded = jwt.verify(token, JWT_SECRET);

        // Optional: verify that the user still exists in the DB
        const [user] = await db.select().from(users).where(eq(users.id, decoded.id));
        if (!user) {
            return { valid: false, error: "User no longer exists" };
        }

        // If everything checks out
        return { valid: true, user };
    } catch (err) {
        // Handle JWT errors like expired or invalid signature
        if (err.name === "TokenExpiredError") {
            return { valid: false, error: "Token expired" };
        }
        if (err.name === "JsonWebTokenError") {
            return { valid: false, error: "Invalid token" };
        }
        console.error("JWT verification error:", err);
        return { valid: false, error: "Server error" };
    }
}