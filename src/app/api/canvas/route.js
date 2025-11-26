import { NextResponse } from "next/server";
import { db } from "../../../../db/db";
import { maps } from "../../../../db/schema";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { eq, desc } from "drizzle-orm";
import {auth} from "../../../../auth.ts"
import axios from 'axios'

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function GET(request) {

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


       // Retrieve all maps for the user, ordered by most recent first
        const userMaps = await db
            .select()
            .from(maps)
            .where(eq(maps.userId, userId))
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
