import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { db } from "../../../../../db/db";
import { map } from "../../../../../db/schema";
import { eq } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function DELETE(_request, { params }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

    let userData;
    try {
      userData = jwt.verify(token.value, JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid token" },
        { status: 401 }
      );
    }

    const rawMapId = Array.isArray(params?.mapId)
      ? params?.mapId[0]
      : params?.mapId;
    const mapId = rawMapId ? decodeURIComponent(rawMapId).trim() : "";

    if (!mapId) {
      return NextResponse.json(
        { error: "Map ID is required" },
        { status: 400 }
      );
    }

    const [existingMap] = await db
      .select({ id: map.id, userId: map.userId })
      .from(map)
      .where(eq(map.id, mapId));

    if (!existingMap) {
      return NextResponse.json(
        { error: "Mind map not found" },
        { status: 404 }
      );
    }

    if (existingMap.userId !== userData.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    await db.delete(map).where(eq(map.id, mapId));

    return NextResponse.json({ success: true, message: "Mind map deleted" });
  } catch (error) {
    console.error("Error deleting mind map:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
