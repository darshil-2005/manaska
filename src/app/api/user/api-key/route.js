import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

import { db } from "../../../../../db/db";
import { userAPIKeys } from "../../../../../db/schema";
import { verifyAuth } from "../../../../utils/verifyAuth";

function maskKey(key) {
  if (!key) return "";
  const visible = key.slice(-4);
  const maskedLength = Math.max(0, key.length - visible.length);
  return `${"*".repeat(maskedLength)}${visible}`;
}

export async function GET(req) {
  try {
    const auth = await verifyAuth(req);
    if (!auth.valid || !auth.user) {
      return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: 401 });
    }

    const userId = auth.user.id;
    const [record] = await db
      .select({ id: userAPIKeys.id, apiKey: userAPIKeys.apiKey })
      .from(userAPIKeys)
      .where(eq(userAPIKeys.userId, userId));

    if (!record?.apiKey) {
      return NextResponse.json({ hasKey: false });
    }

    return NextResponse.json({ hasKey: true, maskedKey: maskKey(record.apiKey) });
  } catch (err) {
    console.error("GET /api/user/api-key error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const auth = await verifyAuth(req);
    if (!auth.valid || !auth.user) {
      return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: 401 });
    }

    const userId = auth.user.id;

    await db.delete(userAPIKeys).where(eq(userAPIKeys.userId, userId));

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/user/api-key error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const auth = await verifyAuth(req);
    if (!auth.valid || !auth.user) {
      return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: 401 });
    }

    const userId = auth.user.id;
    const body = await req.json().catch(() => ({}));
    const apiKey = typeof body.apiKey === "string" ? body.apiKey.trim() : "";

    if (!apiKey) {
      return NextResponse.json({ error: "apiKey is required" }, { status: 400 });
    }

    const [existing] = await db
      .select({ id: userAPIKeys.id })
      .from(userAPIKeys)
      .where(eq(userAPIKeys.userId, userId));

    if (existing?.id) {
      await db
        .update(userAPIKeys)
        .set({ apiKey })
        .where(eq(userAPIKeys.id, existing.id));
    } else {
      await db.insert(userAPIKeys).values({ id: randomUUID(), userId, apiKey });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("POST /api/user/api-key error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
