import { NextResponse } from "next/server";
import { db } from "../../../../../db/db";
import { users, maps, invoice, feedback, userAPIKeys } from "../../../../../db/schema";
import { eq } from "drizzle-orm";
import { verifyAuth } from "../../../../utils/verifyAuth";

const USER_NOT_FOUND_ERROR = "USER_NOT_FOUND";

export async function DELETE(req) {
  try {
    const auth = await verifyAuth(req);
    if (!auth.valid || !auth.user) {
      return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: 401 });
    }

    const userId = auth.user.id;

    try {
      await db.transaction(async (tx) => {
        await tx.delete(maps).where(eq(maps.userId, userId));
        await tx.delete(invoice).where(eq(invoice.userId, userId));
        await tx.delete(feedback).where(eq(feedback.userId, userId));
        await tx.delete(userAPIKeys).where(eq(userAPIKeys.userId, userId));

        const deleted = await tx
          .delete(users)
          .where(eq(users.id, userId))
          .returning({ id: users.id });

        if (!deleted?.length) {
          throw new Error(USER_NOT_FOUND_ERROR);
        }
      });
    } catch (error) {
      if (error instanceof Error && error.message === USER_NOT_FOUND_ERROR) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      throw error;
    }

    const response = NextResponse.json({ ok: true, message: "Account deleted successfully." });
    response.cookies.set("token", "", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: new Date(0),
    });

    return response;
  } catch (err) {
    console.error("DELETE /api/user/delete error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
