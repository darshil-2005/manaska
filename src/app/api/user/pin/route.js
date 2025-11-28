import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "../../../../../db/db"; 
import { maps } from "../../../../../db/schema"; 
import { verifyAuth } from "../../../../utils/verifyAuth";
import {cookies} from "next/headers"
import axios from 'axios'

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await axios.get(`${process.env.BASE_URL}/api/auth/me`, {
      headers: {
        Cookie: cookieHeader,
      }
    });

    if (response.data.ok != true) {
      return NextResponse.json({status: 401});
    }

    const userId = response.data.userId;
 
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
      .from(maps)
      .where(eq(maps.id, mapId));

    if (!currentMap) {
      return NextResponse.json(
        { error: "Map not found" },
        { status: 404 }
      );
    }

    if (currentMap.userId !== userId) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const now = new Date();

    // 1. If currently pinned, just unpin it.
    if (currentMap.pinned) {
      const [updated] = await db
        .update(maps)
        .set({ pinned: false, updatedAt: now })
        .where(eq(maps.id, mapId))
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

    // 3. Then, pin the requested map
    const [updated] = await db
      .update(maps)
      .set({ pinned: true, updatedAt: now })
      .where(eq(maps.id, mapId))
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
