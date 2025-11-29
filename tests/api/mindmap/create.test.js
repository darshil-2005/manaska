import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextResponse } from "next/server";
import axios from "axios";
import * as headers from "next/headers";

// 1. IMPORT THE ROUTE
// Assuming this is the POST method in src/app/api/canvas/route.js
import { POST } from "../../../src/app/api/mindmap/create/route";
import { db } from "../../../db/db";
import { maps } from "../../../db/schema";

// ------------------------------------------------------------------
// 2. MOCKING DEPENDENCIES
// ------------------------------------------------------------------

const mocks = vi.hoisted(() => {
  return {
    mockSelect: vi.fn(),
    mockFrom: vi.fn(),
    mockWhere: vi.fn(),
    mockInsert: vi.fn(),
    mockValues: vi.fn(),
    mockReturning: vi.fn(),
    mockEq: vi.fn(),
    mockAnd: vi.fn(),
    mockLike: vi.fn(),
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

// Mock Axios
vi.mock("axios");

// Mock Database
vi.mock("../../../db/db", () => ({
  db: {
    select: vi.fn(() => ({ from: mocks.mockFrom })),
    insert: vi.fn(() => ({ values: mocks.mockValues })),
  },
}));

// Mock Schema
vi.mock("../../../db/schema", () => ({
  maps: {
    id: "maps.id",
    title: "maps.title",
    userId: "maps.userId",
  },
}));

// Mock Drizzle Operators
vi.mock("drizzle-orm", () => ({
  eq: mocks.mockEq,
  and: mocks.mockAnd,
  like: mocks.mockLike,
}));

// ------------------------------------------------------------------
// 3. TEST SUITE
// ------------------------------------------------------------------

describe("POST /api/canvas", () => {
  const mockUserId = "user_123";

  // Helper to create request
  const createRequest = (body) => ({
    json: async () => body,
  });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("BASE_URL", "http://localhost:3000");

    // 1. Setup Cookie Mock
    vi.mocked(headers.cookies).mockResolvedValue(mocks.mockCookieStore);

    // 2. Setup Axios Auth Mock (Success by default)
    vi.mocked(axios.get).mockResolvedValue({
      data: { ok: true, userId: mockUserId },
    });

    // 3. Setup DB Chains
    // Select Chain: select() -> from() -> where() -> returns Promise<Array>
    mocks.mockFrom.mockReturnValue({ where: mocks.mockWhere });
    
    // Insert Chain: insert() -> values() -> returning() -> returns Promise<Array>
    mocks.mockValues.mockReturnValue({ returning: mocks.mockReturning });
    
    // Default: Insert returns a new map
    mocks.mockReturning.mockResolvedValue([{ id: "new_map_id", title: "Untitled mind map" }]);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  // ═══════════════════════════════════════════════════════════
  // 🔐 AUTHENTICATION TESTS
  // ═══════════════════════════════════════════════════════════

  it("should return 401 (status in body) if auth check fails", async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: { ok: false } });
    
    const req = createRequest({});
    const res = await POST(req);

    // The route code returns { status: 401 } with a 200 OK code (based on NextResponse defaults)
    expect(res.status).toBe(200);
    expect(res._json).toEqual({ status: 401 });
  });

  // ═══════════════════════════════════════════════════════════
  // ✅ SUCCESS CASES: TITLE GENERATION
  // ═══════════════════════════════════════════════════════════

  it("should create map with provided title", async () => {
    const req = createRequest({ title: "My Awesome Map" });
    
    // Setup returning value
    mocks.mockReturning.mockResolvedValueOnce([
      { id: "1", title: "My Awesome Map", userId: mockUserId }
    ]);

    const res = await POST(req);

    expect(res.status).toBe(201);
    expect(res._json).toEqual({
      map: { id: "1", title: "My Awesome Map", userId: mockUserId },
    });

    // Verify DB Insert
    expect(mocks.mockValues).toHaveBeenCalledWith(expect.objectContaining({
      title: "My Awesome Map",
      userId: mockUserId,
    }));
    
    // Verify we didn't check for existing titles since title was provided
    expect(db.select).not.toHaveBeenCalled();
  });

  it("should use 'Untitled mind map' if no title provided and no duplicates exist", async () => {
    const req = createRequest({}); // No title

    // Mock DB Select to return empty list (no collisions)
    mocks.mockWhere.mockResolvedValueOnce([]);
    
    // Mock Insert Return
    mocks.mockReturning.mockResolvedValueOnce([
      { id: "1", title: "Untitled mind map" }
    ]);

    const res = await POST(req);

    expect(res.status).toBe(201);
    expect(res._json.map.title).toBe("Untitled mind map");

    // Verify DB Select was called to check for collisions
    expect(db.select).toHaveBeenCalled();
    // Verify Insert used default title
    expect(mocks.mockValues).toHaveBeenCalledWith(expect.objectContaining({
      title: "Untitled mind map",
    }));
  });

  it("should auto-increment title to '(1)' if default title exists", async () => {
    const req = createRequest({});

    // Mock DB Select to return existing "Untitled mind map"
    mocks.mockWhere.mockResolvedValueOnce([
      { title: "Untitled mind map" }
    ]);

    mocks.mockReturning.mockResolvedValueOnce([
      { id: "2", title: "Untitled mind map (1)" }
    ]);

    await POST(req);

    // Should generate "Untitled mind map (1)"
    expect(mocks.mockValues).toHaveBeenCalledWith(expect.objectContaining({
      title: "Untitled mind map (1)",
    }));
  });

  it("should find next available increment if multiple duplicates exist", async () => {
    const req = createRequest({});

    // Mock DB Select to return base, (1), and (2)
    mocks.mockWhere.mockResolvedValueOnce([
      { title: "Untitled mind map" },
      { title: "Untitled mind map (1)" },
      { title: "Untitled mind map (2)" },
    ]);

    await POST(req);

    // Should generate "Untitled mind map (3)"
    expect(mocks.mockValues).toHaveBeenCalledWith(expect.objectContaining({
      title: "Untitled mind map (3)",
    }));
  });

  // ═══════════════════════════════════════════════════════════
  // 📝 INPUT HANDLING TESTS
  // ═══════════════════════════════════════════════════════════

  it("should handle description and initialDsl fields", async () => {
    const req = createRequest({
      title: "Map",
      description: "  My Description  ",
      initialDsl: "  {json:data}  "
    });

    await POST(req);

    expect(mocks.mockValues).toHaveBeenCalledWith({
      title: "Map",
      description: "My Description", // Trimmed
      url: "  {json:data}  ", // mapped to 'url' col, passed as is (code logic: body.initialDsl)
      userId: mockUserId,
    });
  });

  it("should handle malformed JSON body", async () => {
    // Simulate JSON parse error
    const req = {
      json: async () => { throw new Error("Parse Error"); }
    };

    // The code catches the error and defaults to {}
    // Then it proceeds to generate "Untitled mind map"
    mocks.mockWhere.mockResolvedValueOnce([]); // No collisions

    const res = await POST(req);

    expect(res.status).toBe(201);
    expect(mocks.mockValues).toHaveBeenCalledWith(expect.objectContaining({
      title: "Untitled mind map"
    }));
  });

  // ═══════════════════════════════════════════════════════════
  // 💥 ERROR HANDLING
  // ═══════════════════════════════════════════════════════════

  it("should return 500 if database insert fails", async () => {
    const req = createRequest({ title: "Fail Map" });

    // Mock Insert Failure
    // mocks.mockValues returns object with .returning()
    // We make .returning() reject
    mocks.mockReturning.mockRejectedValueOnce(new Error("DB Insert Failed"));

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const res = await POST(req);

    expect(res.status).toBe(500);
    expect(res._json).toEqual({ error: "Internal server error" });
    expect(consoleSpy).toHaveBeenCalled();
  });
});