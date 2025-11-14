import { NextResponse } from "next/server";
import { db } from "../../../../../db/db";
import { users } from "../../../../../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { validatePasswordRules } from "../../../../utils/validators";
import { verifyAuth } from "../../../../utils/verifyAuth";
import { getToken } from "next-auth/jwt";

async function getAuthenticatedUser(req) {
  // Try custom JWT cookie first
  const auth = await verifyAuth(req);
  if (auth?.valid && auth.user) return auth.user;

  // Fallback to NextAuth JWT (OAuth sessions)
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET });
  if (!session) return null;

  const userId = session.sub; // NextAuth JWT "sub" is the user id
  if (!userId) return null;

  const [user] = await db.select().from(users).where(eq(users.id, userId));
  return user || null;
}

export async function POST(req) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const currentPassword = body.currentPassword || "";
    const newPassword = body.newPassword || "";
    const confirmNewPassword = body.confirmNewPassword || "";

    // Ensure user has a local password to change
    if (!user.hashedPassword) {
      return NextResponse.json({ error: "Password change not available for this account." }, { status: 400 });
    }

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    if (newPassword !== confirmNewPassword) {
      return NextResponse.json({ error: "New passwords do not match." }, { status: 400 });
    }

    const pwdRuleError = validatePasswordRules(newPassword);
    if (pwdRuleError) {
      return NextResponse.json({ error: pwdRuleError }, { status: 400 });
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.hashedPassword);
    if (!isValid) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
    }

    // Hash and update
    const saltRounds = 10;
    const newHash = await bcrypt.hash(newPassword, saltRounds);

    const [updated] = await db
      .update(users)
      .set({ hashedPassword: newHash })
      .where(eq(users.id, user.id))
      .returning({ id: users.id });

    if (!updated) {
      return NextResponse.json({ error: "Failed to update password." }, { status: 500 });
    }

    return NextResponse.json({ ok: true, message: "Password updated successfully." });
  } catch (err) {
    console.error("POST /api/user/change-password error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
