import { NextResponse } from "next/server";
import { db } from "../../../../db/db";
import { maps } from "../../../../db/schema";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { eq, desc } from "drizzle-orm";
import {auth} from "../../../../auth.ts"

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function GET(request) {

    try {
        // Get user from cookie
        const cookieStore = await cookies();
        const token = cookieStore.get("token");

        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized - No token provided" },
                { status: 401 }
            );
        }

        // Decode JWT to get user info
        let userData;
        try {
            userData = jwt.verify(token.value, JWT_SECRET);
        } catch (error) {
            return NextResponse.json(
                { error: "Unauthorized - Invalid token" },
                { status: 401 }
            );
        }

        // Retrieve all maps for the user, ordered by most recent first
        const userMaps = await db
            .select()
            .from(maps)
            .where(eq(maps.userId, userData.id))
            .orderBy(desc(maps.createdAt));

        return NextResponse.json(
            {
                maps: userMaps,
                count: userMaps.length,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in canvas GET API:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

