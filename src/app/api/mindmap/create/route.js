import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { and, like, eq } from "drizzle-orm";
import axios from 'axios'
import { db } from "../../../../../db/db";
import { maps } from "../../../../../db/schema";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

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
        .select({ title: maps.title })
        .from(maps)
        .where(
          and(eq(maps.userId, userId), like(maps.title, `${baseTitle}%`))
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
      .insert(maps)
      .values({
        title,
        description,
        userId: userId,
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

