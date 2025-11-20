import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { and, eq, gt } from "drizzle-orm";

import { db } from "../../../../../../db/db";
import { users, verificationTokens } from "../../../../../../db/schema";
import { validatePasswordRules } from "../../../../../utils/validators";

export async function POST(request) {
  try {
    const { email, otp, newPassword, confirmPassword } = await request.json();

    const normalizedEmail = (email || "").trim().toLowerCase();
    const trimmedOtp = String(otp || "").trim();
    const password = newPassword || "";
    const confirm = confirmPassword || "";

    if (!normalizedEmail) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    if (!trimmedOtp) {
      return NextResponse.json({ error: "OTP is required." }, { status: 400 });
    }

    if (!password || !confirm) {
      return NextResponse.json({ error: "New password and confirmation are required." }, { status: 400 });
    }

    if (password !== confirm) {
      return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
    }

    const passwordIssue = validatePasswordRules(password);
    if (passwordIssue) {
      return NextResponse.json({ error: passwordIssue }, { status: 400 });
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: "No account found for the provided email." }, { status: 404 });
    }

    const now = new Date();

    const [storedToken] = await db
      .select()
      .from(verificationTokens)
      .where(
        and(
          eq(verificationTokens.identifier, normalizedEmail),
          eq(verificationTokens.typeOfToken, "FORGOT_PASSWORD"),
          gt(verificationTokens.expires, now),
        ),
      )
      .limit(1);

    if (!storedToken) {
      return NextResponse.json({ error: "Invalid or expired OTP." }, { status: 401 });
    }

    const otpMatches = await bcrypt.compare(trimmedOtp, storedToken.token);
    if (!otpMatches) {
      return NextResponse.json({ error: "Invalid OTP." }, { status: 401 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db
      .update(users)
      .set({ hashedPassword })
      .where(eq(users.id, user.id));

    await db
      .delete(verificationTokens)
      .where(
        and(
          eq(verificationTokens.identifier, normalizedEmail),
          eq(verificationTokens.typeOfToken, "FORGOT_PASSWORD"),
        ),
      );

    return NextResponse.json({ ok: true, message: "Password reset successfully." });
  } catch (error) {
    console.error("POST /api/auth/forgot-password/reset error:", error);
    return NextResponse.json(
      { error: "Failed to reset password." },
      { status: 500 },
    );
  }
}