import { db } from '@/lib/db';
import { map } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Get the request body
    const body = await request.json();
    const { map_code, mapId } = body;

    // Validate required fields
    if (!map_code || !mapId) {
      return NextResponse.json(
        { error: 'map_code and mapId are required' },
        { status: 400 }
      );
    }

    // Update the map in the database
    const result = await db
      .update(map)
      .set({
        url: map_code,
        updatedAt: new Date()
      })
      .where(eq(map.id, mapId));

    // Check if the update was successful
    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: 'Map not found or update failed' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Map saved successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error saving map:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
