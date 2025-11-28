import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { db } from "../../../../../db/db";
import { maps } from "../../../../../db/schema";
import axios from 'axios'

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

function normalizeMapId(params) {
  const raw = Array.isArray(params?.mapId) ? params.mapId[0] : params?.mapId;
  return raw ? decodeURIComponent(raw).trim() : "";
}

async function getUserMap(mapId, userId) {
  if (!mapId) {
    return { ok: false, response: NextResponse.json({ error: "Map ID is required" }, { status: 400 }) };
  }

  const [existingMap] = await db.select().from(maps).where(eq(maps.id, mapId));

  if (!existingMap) {
    return { ok: false, response: NextResponse.json({ error: "Mind map not found" }, { status: 404 }) };
  }

  if (existingMap.userId !== userId) {
    return { ok: false, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { ok: true, data: existingMap };
}

export async function GET(_request, { params }) {
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

    const mapId = normalizeMapId(params);
    const ownedMap = await getUserMap(mapId, userId);
    if (!ownedMap.ok) return ownedMap.response;

    return NextResponse.json({ map: ownedMap.data });
  } catch (error) {
    console.error("Error fetching mind map:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
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

    const mapId = normalizeMapId(params);
    const ownedMap = await getUserMap(mapId, userId);
    if (!ownedMap.ok) return ownedMap.response;

    const body = await request.json().catch(() => ({}));
    const updates = {};

    if (typeof body?.title === "string") {
      const trimmed = body.title.trim().slice(0, 255);
      if (!trimmed) {
        return NextResponse.json(
          { error: "Title cannot be empty" },
          { status: 400 }
        );
      }
      updates.title = trimmed;
    }

    if (typeof body?.description === "string") {
      updates.description = body.description.trim().slice(0, 1024);
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    updates.updatedAt = new Date();

    const [updatedMap] = await db
      .update(maps)
      .set(updates)
      .where(eq(map.id, mapId))
      .returning();

    return NextResponse.json({ map: updatedMap });
  } catch (error) {
    console.error("Error updating mind map:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request, { params }) {
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

    const mapId = normalizeMapId(params);
    const ownedMap = await getUserMap(mapId, userId);
    if (!ownedMap.ok) return ownedMap.response;

    await db.delete(maps).where(eq(maps.id, mapId));

    return NextResponse.json({ success: true, message: "Mind map deleted" });
  } catch (error) {
    console.error("Error deleting mind map:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
