import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "../../../../../db/db";
import { map } from "../../../../../db/schema";
import { verifyAuth } from "../../../../utils/verifyAuth";

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
    const { mapId } = body;

    if (!mapId) {
      return NextResponse.json(
        { error: "mapId is required" },
        { status: 400 }
      );
    }

    const [currentMap] = await db
      .select()
      .from(map)
      .where(eq(map.id, mapId));

    if (!currentMap) {
      return NextResponse.json(
        { error: "Map not found" },
        { status: 404 }
      );
    }

    if (currentMap.userId !== auth.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const now = new Date();

    if (currentMap.pinned) {
      const [updated] = await db
        .update(map)
        .set({ pinned: false, updatedAt: now })
        .where(eq(map.id, mapId))
        .returning();

      return NextResponse.json(
        {
          success: true,
          message: "Map unpinned successfully",
          map: updated,
        },
        { status: 200 }
      );
    }

    await db
      .update(map)
      .set({ pinned: false, updatedAt: now })
      .where(eq(map.userId, auth.user.id));

    const [updated] = await db
      .update(map)
      .set({ pinned: true, updatedAt: new Date() })
      .where(eq(map.id, mapId))
      .returning();

    return NextResponse.json(
      {
        success: true,
        message: "Map pinned successfully",
        map: updated,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error pinning/unpinning map:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}