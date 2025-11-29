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
    const mapCode = typeof body?.map_code === "string" ? body.map_code : "";
    const mapId = typeof body?.mapId === "string" ? body.mapId.trim() : "";
    const messages = body?.messages;  

    if (!mapCode || !mapId) {
      return NextResponse.json(
        { error: "map_code and mapId are required" },
        { status: 400 }
      );
    }

    const [existing] = await db
      .select({ id: maps.id, userId: maps.userId })
      .from(maps)
      .where(eq(maps.id, mapId));

    if (!existing) {
      return NextResponse.json(
        { error: "Mind map not found" },
        { status: 404 }
      );
    }

    if (existing.userId !== userId) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const [updated] = await db
      .update(maps)
      .set({
        script: mapCode,
        messages: messages,
        updatedAt: new Date(),
      })
      .where(eq(maps.id, mapId))
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
