import { NextResponse } from "next/server";
import { db } from "../../../../../db/db";
import { users } from "../../../../../db/schema";
import { eq } from "drizzle-orm";
import { verifyAuth } from "../../../../utils/verifyAuth";
import {cookies} from "next/headers"
import axios from 'axios'

const PUBLIC_FIELDS = ["id", "name", "username", "email", "image", "coins", "createdAt"];
const ALLOWED_UPDATE_FIELDS = new Set(["name", "username", "image"]);

function pick(obj, keys) {
  const out = {};
  for (const k of keys) if (obj?.[k] !== undefined) out[k] = obj[k];
  return out;
}

export async function GET(req) {
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

    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ profile: pick(user, PUBLIC_FIELDS) });
  } catch (err) {
    console.error("GET /api/profile error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
  
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const user = await axios.get(`${process.env.BASE_URL}/api/auth/me`, {
    headers: {
      Cookie: cookieHeader,
    }
  });

  if (user.data.ok != true) {
    return NextResponse.json({status: 401})
  }

   const userId = user.data.userId;

    const body = await req.json().catch(() => ({}));
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const updates = {};
    for (const key of Object.keys(body)) {
      if (ALLOWED_UPDATE_FIELDS.has(key)) updates[key] = body[key];
    }

    if (updates.name !== undefined && typeof updates.name !== "string") {
      return NextResponse.json({ error: "'name' must be a string" }, { status: 400 });
    }
    if (updates.username !== undefined) {
      if (typeof updates.username !== "string" || updates.username.length > 255) {
        return NextResponse.json({ error: "'username' must be a string <= 255 chars" }, { status: 400 });
      }
      const [existing] = await db.select().from(users).where(eq(users.username, updates.username));
      if (existing && existing.id !== userId) {
        return NextResponse.json({ error: "Username already taken" }, { status: 409 });
      }
    }
    if (updates.image !== undefined && typeof updates.image !== "string") {
      return NextResponse.json({ error: "'image' must be a string URL" }, { status: 400 });
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No updatable fields provided" }, { status: 400 });
    }

    const [updated] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, userId))
      .returning();

    return NextResponse.json({ profile: pick(updated, PUBLIC_FIELDS) });
  } catch (err) {
    console.error("POST /api/profile error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
