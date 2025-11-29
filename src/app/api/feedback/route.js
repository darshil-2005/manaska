import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

import { db } from "../../../../db/db";
import { feedback } from "../../../../db/schema";
import { verifyAuth } from "../../../../src/utils/verifyAuth";

export async function POST(req) {
  try {
    const auth = await verifyAuth(req);
    if (!auth.valid || !auth.user) {
      return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const response = typeof body.response === "string" ? body.response.trim() : "";

    if (!response) {
      return NextResponse.json({ error: "response is required" }, { status: 400 });
    }

    await db.insert(feedback).values({
      id: randomUUID(),
      userId: auth.user.id,
      response,
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("POST /api/feedback error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
