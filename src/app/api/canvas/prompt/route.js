import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { map } from "@/lib/schema";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { generate_map } from "@/lib/generate-map";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request) {
    try {
        // Get user from cookie
        const cookieStore = cookies();
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

        // Parse request body
        const body = await request.json();
        const { user_input } = body;

        if (!user_input || typeof user_input !== "string" || user_input.trim() === "") {
            return NextResponse.json(
                { error: "Invalid input - user_input is required and must be a non-empty string" },
                { status: 400 }
            );
        }

        // Generate map code using the AI prompt
        let mapAIData;
        try {
            mapAIData = await generate_map(user_input.trim());
        } catch (error) {
            console.error("Error generating map:", error);
            return NextResponse.json(
                { error: "Failed to generate map" },
                { status: 500 }
            );
        }

        if (!mapAIData) {
            return NextResponse.json(
                { error: "Map generation returned empty result" },
                { status: 500 }
            );
        }

        const title = mapAIData.title
        const mapCode = mapAIData.mapCode;

        // Create map entry in database
        const [newMap] = await db
            .insert(map)
            .values({
                id: crypto.randomUUID(),
                title: title || "Untitled Map",
                description: user_input,
                userId: userData.id,
                url: mapCode, // Storing map code in url field
                pinned: false,
            })
            .returning();

        // Return map without sensitive fields
        const { userId, createdAt, updatedAt, ...mapData } = newMap;

        return NextResponse.json(
            {
                map: mapData,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error in canvas/prompt API:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
