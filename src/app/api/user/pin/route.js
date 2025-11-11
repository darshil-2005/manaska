import { db } from '@/lib/db';
import { map } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Get the request body
    const body = await request.json();
    const { mapId } = body;

    // Validate required field
    if (!mapId) {
      return NextResponse.json(
        { error: 'mapId is required' },
        { status: 400 }
      );
    }

    // Get the current map to check its pinned status
    const currentMap = await db
      .select()
      .from(map)
      .where(eq(map.id, mapId))
      .limit(1);

    if (currentMap.length === 0) {
      return NextResponse.json(
        { error: 'Map not found' },
        { status: 404 }
      );
    }

    const isCurrentlyPinned = currentMap[0].pinned;

    // If the map is currently pinned, unpin it
    if (isCurrentlyPinned) {
      await db
        .update(map)
        .set({ 
          pinned: false,
          updatedAt: new Date()
        })
        .where(eq(map.id, mapId));

      return NextResponse.json(
        { 
          success: true, 
          message: 'Map unpinned successfully',
          pinned: false
        },
        { status: 200 }
      );
    } else {
      // If the map is not pinned, pin it and unpin all other maps
      // First, unpin all maps for this user
      await db
        .update(map)
        .set({ 
          pinned: false,
          updatedAt: new Date()
        })
        .where(eq(map.userId, currentMap[0].userId));

      // Then pin the current map
      await db
        .update(map)
        .set({ 
          pinned: true,
          updatedAt: new Date()
        })
        .where(eq(map.id, mapId));

      return NextResponse.json(
        { 
          success: true, 
          message: 'Map pinned successfully',
          pinned: true
        },
        { status: 200 }
      );
    }

  } catch (error) {
    console.error('Error pinning/unpinning map:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}