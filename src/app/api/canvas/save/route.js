import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "../../../../../db/db";
import { map } from "../../../../../db/schema";
import { verifyAuth } from "@/utils/verifyAuth";

export async function POST(request) {
  try {
    const auth = await verifyAuth(request);
    if (!auth.valid) {
      return NextResponse.json(
        { error: auth.error || "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const mapCode = typeof body?.map_code === "string" ? body.map_code : "";
    const mapId = typeof body?.mapId === "string" ? body.mapId.trim() : "";

    if (!mapCode || !mapId) {
      return NextResponse.json(
        { error: "map_code and mapId are required" },
        { status: 400 }
      );
    }

    const [existing] = await db
      .select({ id: map.id, userId: map.userId })
      .from(map)
      .where(eq(map.id, mapId));

    if (!existing) {
      return NextResponse.json(
        { error: "Mind map not found" },
        { status: 404 }
      );
    }

    if (existing.userId !== auth.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const [updated] = await db
      .update(map)
      .set({
        url: mapCode,
        updatedAt: new Date(),
      })
      .where(eq(map.id, mapId))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: "Map not found or update failed" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Map saved successfully", map: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving map:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
