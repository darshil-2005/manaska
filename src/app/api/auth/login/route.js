import { NextResponse } from "next/server";
import { db } from "@/../db/db.js"; // your drizzle db instance
import { users } from "@/../db/schema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret"; // use env var in prod

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        // Find user by email
        const [user] = await db.select().from(users).where(eq(users.email, email));

        if (!user) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // Compare password
        const isValid = await bcrypt.compare(password, user.hashedPassword);
        if (!isValid) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email, username: user.username },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Set cookie
        const response = NextResponse.json({
            message: "Login successful",
            user: {
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
            },
        });

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return response;
    } catch (err) {
        console.error("Login error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
