import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextResponse } from "next/server";
import axios from "axios";
import * as headers from "next/headers";

// ------------------------------------------------------------------
// 1. MOCKING DEPENDENCIES
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

// Mock Axios
vi.mock("axios");

// Mock Database
vi.mock("../../../db/db", () => ({
  db: {
    select: vi.fn(() => ({ from: mocks.mockFrom })),
    update: mocks.mockUpdate, // Connect directly to the hoisted mock
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

// 2. IMPORT THE ROUTE
import { POST } from "../../../src/app/api/user/pin/route";

// ------------------------------------------------------------------
// 3. TEST SUITE
// ------------------------------------------------------------------

describe("POST /api/canvas/pin", () => {
  const mockUserId = "user_123";
  const mockMapId = "map_abc";

  // Helper to create request
  const createRequest = (body) => ({
    json: async () => body,
  });

  // HELPER: Creates a Promise that ALSO has chainable methods like .returning()
  const createQueryMock = (resolveValue) => {
    const promise = Promise.resolve(resolveValue);
    promise.returning = mocks.mockReturning;
    return promise;
  };

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
    
    // Select Chain: select().from().where()
    mocks.mockFrom.mockReturnValue({ where: mocks.mockWhere });

    // Update Chain: update().set().where().returning()
    mocks.mockUpdate.mockReturnValue({ set: mocks.mockSet });
    mocks.mockSet.mockReturnValue({ where: mocks.mockWhere });

    // Where Implementation (The Hybrid Mock)
    // Default: Map exists, belongs to user, and is currently NOT pinned
    mocks.mockWhere.mockImplementation(() => createQueryMock([{ 
      id: mockMapId, 
      userId: mockUserId, 
      pinned: false 
    }]));

    // Returning Implementation (for update operations)
    // Returns array to simulate Drizzle, which route destructures to object
    mocks.mockReturning.mockResolvedValue([{ id: mockMapId, pinned: true }]);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  // ═══════════════════════════════════════════════════════════
  // 🔐 AUTHENTICATION TESTS
  // ═══════════════════════════════════════════════════════════

  it("should return {status: 401} if auth check fails", async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: { ok: false } });
    
    const req = createRequest({ mapId: mockMapId });
    const res = await POST(req);

    // Route returns 200 with body { status: 401 }
    expect(res.status).toBe(200); 
    expect(res._json).toEqual({ status: 401 });
  });

  // ═══════════════════════════════════════════════════════════
  // 🛡️ VALIDATION & OWNERSHIP TESTS
  // ═══════════════════════════════════════════════════════════

  it("should return 400 if mapId is missing", async () => {
    const req = createRequest({}); // No mapId
    const res = await POST(req);

    expect(res.status).toBe(400);
    expect(res._json).toEqual({ error: "mapId is required" });
  });

  it("should return 404 if map does not exist", async () => {
    // Select returns empty array
    mocks.mockWhere.mockImplementationOnce(() => createQueryMock([]));

    const req = createRequest({ mapId: mockMapId });
    const res = await POST(req);

    expect(res.status).toBe(404);
    expect(res._json).toEqual({ error: "Map not found" });
  });

  it("should return 403 if user does not own the map", async () => {
    // Select returns map owned by someone else
    mocks.mockWhere.mockImplementationOnce(() => createQueryMock([{ 
      id: mockMapId, 
      userId: "other_user", 
      pinned: false 
    }]));

    const req = createRequest({ mapId: mockMapId });
    const res = await POST(req);

    expect(res.status).toBe(403);
    expect(res._json).toEqual({ error: "Forbidden" });
  });

  // ═══════════════════════════════════════════════════════════
  // ✅ LOGIC TESTS: PINNING vs UNPINNING
  // ═══════════════════════════════════════════════════════════

  it("should PIN the map if it is currently unpinned (toggle on)", async () => {
    // 1. Setup State: Map is NOT pinned (Default mock)
    // 2. Setup Update Return
    mocks.mockReturning.mockResolvedValue([{ id: mockMapId, pinned: true }]);

    const req = createRequest({ mapId: mockMapId });
    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(res._json).toEqual({
      success: true,
      message: "Map pinned successfully",
      map: { id: mockMapId, pinned: true },
    });

    // Verify DB Update
    expect(mocks.mockUpdate).toHaveBeenCalled();
    expect(mocks.mockSet).toHaveBeenCalledWith({
      pinned: true,
      updatedAt: expect.any(Date),
    });
  });

  it("should UNPIN the map if it is currently pinned (toggle off)", async () => {
    // 1. Setup State: Map IS pinned
    // This applies to the SELECT query.
    mocks.mockWhere.mockImplementation(() => createQueryMock([{ 
      id: mockMapId, 
      userId: mockUserId, 
      pinned: true 
    }]));

    // 2. Setup Update Return
    mocks.mockReturning.mockResolvedValue([{ id: mockMapId, pinned: false }]);

    const req = createRequest({ mapId: mockMapId });
    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(res._json).toEqual({
      success: true,
      message: "Map unpinned successfully",
      map: { id: mockMapId, pinned: false },
    });

    // Verify DB Update
    expect(mocks.mockUpdate).toHaveBeenCalled();
    expect(mocks.mockSet).toHaveBeenCalledWith({
      pinned: false,
      updatedAt: expect.any(Date),
    });
  });

  // ═══════════════════════════════════════════════════════════
  // 💥 ERROR HANDLING
  // ═══════════════════════════════════════════════════════════

  it("should return 500 if database throws error", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    
    // Force DB Select to reject
    mocks.mockWhere.mockImplementationOnce(() => {
      const p = Promise.reject(new Error("DB Connection Error"));
      p.returning = mocks.mockReturning;
      return p;
    });

    const req = createRequest({ mapId: mockMapId });
    const res = await POST(req);

    expect(res.status).toBe(500);
    expect(res._json).toEqual({ error: "DB Connection Error" });
    expect(consoleSpy).toHaveBeenCalled();
  });
});