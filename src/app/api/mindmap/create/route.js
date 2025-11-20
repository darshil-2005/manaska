import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { and, like, eq } from "drizzle-orm";

import { db } from "../../../../../db/db";
import { map } from "../../../../../db/schema";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function POST(request) {
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

    const body = await request.json().catch(() => ({}));
    const baseTitle = "Untitled mind map";
    const rawTitle =
      typeof body?.title === "string" ? body.title.trim().slice(0, 255) : "";
    let title = rawTitle;
    const description =
      typeof body?.description === "string"
        ? body.description.trim().slice(0, 1024)
        : null;
    const initialDsl =
      typeof body?.initialDsl === "string" && body.initialDsl.trim().length > 0
        ? body.initialDsl
        : null;

    if (!title) {
      const existingUntitled = await db
        .select({ title: map.title })
        .from(map)
        .where(
          and(eq(map.userId, userData.id), like(map.title, `${baseTitle}%`))
        );

      const existingTitles = new Set(
        existingUntitled.map((entry) => entry.title || "")
      );

      if (!existingTitles.has(baseTitle)) {
        title = baseTitle;
      } else {
        let counter = 1;
        while (existingTitles.has(`${baseTitle} (${counter})`)) {
          counter += 1;
        }
        title = `${baseTitle} (${counter})`;
      }
    }

    const [newMap] = await db
      .insert(map)
      .values({
        title,
        description,
        userId: userData.id,
        url: initialDsl,
      })
      .returning();

    return NextResponse.json({ map: newMap }, { status: 201 });
  } catch (error) {
    console.error("Error creating mind map:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

