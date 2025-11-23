import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

// Check strict relative paths. If using Next.js aliases, '@/db/db' is safer.
import { db } from "../../../../../db/db"; 
// Alias 'map' to 'mapTable' to avoid conflict with JS Map or Array.map
import { map as mapTable } from "../../../../../db/schema"; 
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

    // Fetch the map to check ownership
    const [currentMap] = await db
      .select()
      .from(mapTable)
      .where(eq(mapTable.id, mapId));

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

    // 1. If currently pinned, just unpin it.
    if (currentMap.pinned) {
      const [updated] = await db
        .update(mapTable)
        .set({ pinned: false, updatedAt: now })
        .where(eq(mapTable.id, mapId))
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

    // 2. If pinning: First, unpin ALL other maps for this user (Single Pin Mode)
    // This ensures only one map is pinned at a time.
    await db
      .update(mapTable)
      .set({ pinned: false, updatedAt: now })
      .where(eq(mapTable.userId, auth.user.id));

    // 3. Then, pin the requested map
    const [updated] = await db
      .update(mapTable)
      .set({ pinned: true, updatedAt: now })
      .where(eq(mapTable.id, mapId))
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
    // Return the actual error message for debugging (remove in production)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}