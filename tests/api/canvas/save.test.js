import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
// 1. IMPORT THE ROUTE
// Assuming this route is located at src/app/api/canvas/save/route.js based on logic
import { POST } from "../../../src/app/api/canvas/save/route";

// 2. IMPORT DEPENDENCIES
import { NextResponse } from "next/server";
import axios from "axios";
import * as headers from "next/headers"; // specific import for mocking cookies
import { db } from "../../../db/db";
import { maps } from "../../../db/schema"; // Ensure this import path matches your project structure

// ------------------------------------------------------------------
// 3. MOCKING DEPENDENCIES
// ------------------------------------------------------------------

const mocks = vi.hoisted(() => {
  return {
    mockFrom: vi.fn(),
    mockWhere: vi.fn(),
    mockSelect: vi.fn(),
    mockUpdate: vi.fn(),
    mockSet: vi.fn(),
    mockReturning: vi.fn(),
    mockEq: vi.fn(),
    mockCookieStore: {
      toString: vi.fn(() => "mock-cookie=value"),
    },
  };
});

// Mock Next.js Server Response
vi.mock("next/server", () => ({
  NextResponse: {
    json: vi.fn((body, options) => ({
      _json: body,
      status: options?.status || 200,
    })),
  },
}));

// Mock Next Headers (Cookies)
vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

// Mock Axios for Auth Check
vi.mock("axios");

// Mock Database
vi.mock("../../../db/db", () => ({
  db: {
    select: vi.fn(() => ({ from: mocks.mockFrom })),
    update: vi.fn(() => ({ set: mocks.mockSet })),
  },
}));

// Mock Schema
vi.mock("../../../db/schema", () => ({
  maps: {
    id: "maps.id",
    userId: "maps.userId",
  },
}));

// Mock Drizzle Operators
vi.mock("drizzle-orm", () => ({
  eq: mocks.mockEq,
}));

// ------------------------------------------------------------------
// 4. TEST SUITE
// ------------------------------------------------------------------

describe("POST /api/canvas/save", () => {
  const mockUserId = "user_123";
  const mockMapId = "map_abc";

  // Helper to create request
  const createRequest = (body) => ({
    json: async () => body,
  });

  beforeEach(() => {
    vi.clearAllMocks();

    // 1. Setup Cookie Mock
    vi.mocked(headers.cookies).mockResolvedValue(mocks.mockCookieStore);

    // 2. Setup Axios Auth Mock (Success by default)
    vi.mocked(axios.get).mockResolvedValue({
      data: { ok: true, userId: mockUserId },
    });

    // 3. Setup DB Select Chain (Map exists by default)
    // select -> from -> where
    mocks.mockFrom.mockReturnValue({ where: mocks.mockWhere });
    mocks.mockWhere.mockResolvedValue([{ id: mockMapId, userId: mockUserId }]);

    // 4. Setup DB Update Chain (Update successful by default)
    // update -> set -> where -> returning
    mocks.mockSet.mockReturnValue({ where: mocks.mockWhere });
    // Note: Reusing mockWhere here because the structure matches (chained after set)
    // chained after where is returning
    mocks.mockWhere.mockReturnValue({ returning: mocks.mockReturning });
    mocks.mockReturning.mockResolvedValue([
      { id: mockMapId, script: "new code", updatedAt: new Date() },
    ]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ----------------------------------------------------------------
  // AUTHENTICATION CASES
  // ----------------------------------------------------------------



  it("should return 500 if axios throws error", async () => {
    vi.mocked(axios.get).mockRejectedValue(new Error("Auth Service Down"));

    const req = createRequest({});
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await POST(req);

    expect(res.status).toBe(500);
    expect(res._json).toEqual({ error: "Internal server error" });
    expect(consoleSpy).toHaveBeenCalled();
  });

  // ----------------------------------------------------------------
  // VALIDATION CASES (400)
  // ----------------------------------------------------------------

  it("should return 400 if map_code is missing", async () => {
    const req = createRequest({
      // map_code missing
      mapId: mockMapId,
    });

    const res = await POST(req);

    expect(res.status).toBe(400);
    expect(res._json).toEqual({ error: "map_code and mapId are required" });
  });

  it("should return 400 if mapId is missing", async () => {
    const req = createRequest({
      map_code: "some code",
      // mapId missing
    });

    const res = await POST(req);

    expect(res.status).toBe(400);
    expect(res._json).toEqual({ error: "map_code and mapId are required" });
  });

  it("should handle malformed JSON body gracefully", async () => {
    const req = {
      json: async () => { throw new Error("Bad JSON"); }
    };

    // Code catches json error and returns {} 
    // Then it checks validation logic on empty object -> returns 400
    const res = await POST(req);

    expect(res.status).toBe(400);
    expect(res._json).toEqual({ error: "map_code and mapId are required" });
  });

  // ----------------------------------------------------------------
  // DB EXISTENCE & PERMISSION CASES (404, 403)
  // ----------------------------------------------------------------

  it("should return 404 if mind map does not exist", async () => {
    // Mock Select returning empty array
    mocks.mockWhere.mockResolvedValueOnce([]); 

    const req = createRequest({
      map_code: "code",
      mapId: "non_existent_id",
    });

    const res = await POST(req);

    expect(res.status).toBe(404);
    expect(res._json).toEqual({ error: "Mind map not found" });
  });

  it("should return 403 if user does not own the map", async () => {
    // Mock Select returning map belonging to DIFFERENT user
    mocks.mockWhere.mockResolvedValueOnce([
      { id: mockMapId, userId: "different_user_id" }
    ]);

    const req = createRequest({
      map_code: "code",
      mapId: mockMapId,
    });

    const res = await POST(req);

    expect(res.status).toBe(403);
    expect(res._json).toEqual({ error: "Forbidden" });
  });

  // ----------------------------------------------------------------
  // UPDATE SUCCESS & FAILURE CASES
  // ----------------------------------------------------------------

  it("should return 404 if update returns no result (concurrency edge case)", async () => {
    // Select passes (User owns map)
    mocks.mockWhere.mockResolvedValueOnce([{ id: mockMapId, userId: mockUserId }]);
    
    // Update chain: returns empty array (maybe deleted in between)
    // We need to target the *second* call to mockWhere (the one in the update chain)
    // However, chain logic in beforeEach sets mocks.mockWhere to return { returning: ... }
    // We need mockReturning to resolve to []
    mocks.mockReturning.mockResolvedValueOnce([]);

    const req = createRequest({
      map_code: "new code",
      mapId: mockMapId,
      messages: ["msg1"],
    });

    const res = await POST(req);

    expect(res.status).toBe(404);
    expect(res._json).toEqual({ error: "Map not found or update failed" });
  });

  

  // ----------------------------------------------------------------
  // GENERAL ERROR HANDLING
  // ----------------------------------------------------------------

  it("should return 500 if database select throws error", async () => {
    mocks.mockWhere.mockRejectedValueOnce(new Error("DB Connection Failed"));
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const req = createRequest({
      map_code: "code",
      mapId: mockMapId,
    });

    const res = await POST(req);

    expect(res.status).toBe(500);
    expect(res._json).toEqual({ error: "Internal server error" });
    expect(consoleSpy).toHaveBeenCalled();
  });
});