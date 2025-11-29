import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextResponse } from "next/server";

// ------------------------------------------------------------------
// 1. MOCKING DEPENDENCIES
// ------------------------------------------------------------------

const mocks = vi.hoisted(() => {
  return {
    mockFrom: vi.fn(),
    mockWhere: vi.fn(),
    mockSelect: vi.fn(),
    mockInsert: vi.fn(),
    mockValues: vi.fn(),
    mockUpdate: vi.fn(),
    mockSet: vi.fn(),
    mockDelete: vi.fn(),
    mockEq: vi.fn(),
    mockVerifyAuth: vi.fn(),
    mockRandomUUID: vi.fn(() => "new-uuid-123"),
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

// Mock Database
vi.mock("../../../db/db", () => ({
  db: {
    select: vi.fn(() => ({ from: mocks.mockFrom })),
    insert: vi.fn(() => ({ values: mocks.mockValues })),
    update: vi.fn(() => ({ set: mocks.mockSet })),
    delete: vi.fn(() => ({ where: mocks.mockWhere })),
  },
}));

// Mock Schema
vi.mock("../../../db/schema", () => ({
  userAPIKeys: {
    id: "userAPIKeys.id",
    userId: "userAPIKeys.userId",
    apiKey: "userAPIKeys.apiKey",
  },
}));

// Mock Drizzle Operators
vi.mock("drizzle-orm", () => ({
  eq: mocks.mockEq,
}));

// Mock Utils
vi.mock("../../../src/utils/verifyAuth", () => ({
  verifyAuth: mocks.mockVerifyAuth,
}));

// Mock Crypto
vi.mock("crypto", () => ({
  randomUUID: mocks.mockRandomUUID,
}));

// 2. IMPORT THE ROUTE
import { GET, POST, DELETE } from "../../../src/app/api/user/api-key/route";

// ------------------------------------------------------------------
// 3. TEST SUITE
// ------------------------------------------------------------------

describe("/api/user/api-key", () => {
  const mockUserId = "user_123";
  
  // Helper to create request
  const createRequest = (body) => ({
    json: async () => body,
  });

  // Helper for DB Chaining (Promise + properties)
  const createQueryMock = (resolveValue) => {
    return Promise.resolve(resolveValue);
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // 1. Setup Auth (Success by default)
    mocks.mockVerifyAuth.mockResolvedValue({
      valid: true,
      user: { id: mockUserId },
    });

    // 2. Setup DB Chains
    
    // Select Chain: select().from().where()
    mocks.mockFrom.mockReturnValue({ where: mocks.mockWhere });

    // Update Chain: update().set().where()
    mocks.mockSet.mockReturnValue({ where: mocks.mockWhere });

    // Where Implementation (Default: Empty result)
    mocks.mockWhere.mockImplementation(() => createQueryMock([]));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ═══════════════════════════════════════════════════════════
  // 🔐 SHARED AUTH TESTS
  // ═══════════════════════════════════════════════════════════

  it("GET should return 401 if auth check fails", async () => {
    mocks.mockVerifyAuth.mockResolvedValue({ valid: false, error: "Token expired" });
    const res = await GET({});
    expect(res.status).toBe(401);
    expect(res._json).toEqual({ error: "Token expired" });
  });

  it("POST should return 401 if auth check fails", async () => {
    mocks.mockVerifyAuth.mockResolvedValue({ valid: false });
    const res = await POST(createRequest({}));
    expect(res.status).toBe(401);
  });

  it("DELETE should return 401 if auth check fails", async () => {
    mocks.mockVerifyAuth.mockResolvedValue({ valid: false });
    const res = await DELETE({});
    expect(res.status).toBe(401);
  });

  // ═══════════════════════════════════════════════════════════
  // 📖 GET METHOD TESTS
  // ═══════════════════════════════════════════════════════════

  describe("GET", () => {
    it("should return { hasKey: false } if no key exists", async () => {
      // Mock DB empty return
      mocks.mockWhere.mockImplementationOnce(() => createQueryMock([]));

      const res = await GET({});

      expect(res.status).toBe(200);
      expect(res._json).toEqual({ hasKey: false });
    });

    it("should return { hasKey: true, maskedKey } if key exists", async () => {
      const realKey = "sk-1234567890abcdef";
      // Expected mask: all stars except last 4 chars
      // "sk-1234567890ab" (15 chars) masked + "cdef"
      
      mocks.mockWhere.mockImplementationOnce(() => createQueryMock([{ 
        id: "key_id", 
        apiKey: realKey 
      }]));

      const res = await GET({});

      expect(res.status).toBe(200);
      expect(res._json.hasKey).toBe(true);
      expect(res._json.maskedKey).toMatch(/\*+cdef$/); // Ends with visible chars
      expect(res._json.maskedKey).not.toBe(realKey);   // Not the full key
    });

    it("should return 500 on DB error", async () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      mocks.mockWhere.mockRejectedValueOnce(new Error("DB Down"));

      const res = await GET({});

      expect(res.status).toBe(500);
      expect(res._json).toEqual({ error: "Internal server error" });
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  // ═══════════════════════════════════════════════════════════
  // 🗑️ DELETE METHOD TESTS
  // ═══════════════════════════════════════════════════════════

  describe("DELETE", () => {
    it("should delete key and return 200", async () => {
      // db.delete().where()
      // We rely on the mock setup in the factory
      
      const res = await DELETE({});

      expect(res.status).toBe(200);
      expect(res._json).toEqual({ ok: true });
      expect(mocks.mockWhere).toHaveBeenCalled(); // Ensure where clause applied
    });

    it("should return 500 on DB error", async () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      mocks.mockWhere.mockRejectedValueOnce(new Error("Delete Failed"));

      const res = await DELETE({});

      expect(res.status).toBe(500);
      expect(res._json).toEqual({ error: "Internal server error" });
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  // ═══════════════════════════════════════════════════════════
  // ✏️ POST METHOD TESTS
  // ═══════════════════════════════════════════════════════════

  describe("POST", () => {
    it("should return 400 if apiKey is missing", async () => {
      const req = createRequest({});
      const res = await POST(req);
      expect(res.status).toBe(400);
      expect(res._json).toEqual({ error: "apiKey is required" });
    });

    it("should return 400 if apiKey is empty string", async () => {
      const req = createRequest({ apiKey: "   " });
      const res = await POST(req);
      expect(res.status).toBe(400);
      expect(res._json).toEqual({ error: "apiKey is required" });
    });



    it("should return 500 on DB error", async () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      // Fail on the check query
      mocks.mockWhere.mockRejectedValueOnce(new Error("DB Error"));

      const req = createRequest({ apiKey: "key" });
      const res = await POST(req);

      expect(res.status).toBe(500);
      expect(res._json).toEqual({ error: "Internal server error" });
      expect(consoleSpy).toHaveBeenCalled();
    });
  });
});