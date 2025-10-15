// app/api/register/route.js
import { NextResponse } from "next/server";
import { db } from "@/../db/db.js";
import { eq } from "drizzle-orm";
import { users } from "@/../db/schema.ts";
import bcrypt from "bcryptjs"
import { validateEmail, validatePasswordRules } from "@/utils/validators";

export async function POST(request) {
  try {
    const body = await request.json();

    const email = (body.email || "").trim().toLowerCase();
    const username = (body.username || "").trim();
    const name = (body.name || "").trim();
    const password = body.password || "";
    const confirmPassword = body.confirmPassword || "";
    const acceptTerms = !!body.acceptTerms;

    // Basic validation
    if (!email || !validateEmail(email)) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    if (!username || username.length < 6) {
      return NextResponse.json({ error: "Username must be at least 6 characters." }, { status: 400 });
    }

    if (!password) {
      return NextResponse.json({ error: "Password is required." }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
    }

    const pwdRuleError = validatePasswordRules(password);
    if (pwdRuleError) {
      return NextResponse.json({ error: pwdRuleError }, { status: 400 });
    }

    if (!acceptTerms) {
      return NextResponse.json({ error: "You must accept the Terms of Service and Privacy Policy." }, { status: 400 });
    }

    // Check if email or username exists
    const existingByEmail = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingByEmail.length > 0) {
      return NextResponse.json({ error: "This email is already registered. Please login instead." }, { status: 409 });
    }

    const existingByUsername = await db.select().from(users).where(eq(users.username, username)).limit(1);
    if (existingByUsername.length > 0) {
      return NextResponse.json({ error: "This username is already taken. Please choose another." }, { status: 409 });
    }

    const salt = 10;
    const passwordHash = await bcrypt.hash(password, salt);

    const insertResult = await db.insert(users).values({
      name,
      username,
      email,
      hashedPassword: passwordHash,
      emailVerified: false,
    }).returning();

    return NextResponse.json({ ok: true, user: { id: insertResult[0].id, email } }, { status: 201 });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
