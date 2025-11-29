import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextResponse } from "next/server";
import { DELETE } from "../../../src/app/api/user/delete/route"; // Adjust path as necessary
import { db } from "../../../db/db";
import { verifyAuth } from "../../../src/utils/verifyAuth";

// ------------------------------------------------------------------
// 1. MOCKING DEPENDENCIES
// ------------------------------------------------------------------

const mocks = vi.hoisted(() => {
  return {
    mockVerifyAuth: vi.fn(),
    mockDelete: vi.fn(),
    mockWhere: vi.fn(),
    mockReturning: vi.fn(),
    mockCookieSet: vi.fn(),
    mockEq: vi.fn(),
  };
});

// Mock Next.js Server Response
vi.mock("next/server", () => ({
  NextResponse: {
    json: vi.fn((body, options) => ({
      _json: body,
      status: options?.status || 200,
      cookies: {
        set: mocks.mockCookieSet,
      },
    })),
  },
}));

// Mock Database
vi.mock("../../../db/db", () => ({
  db: {
    // Mock transaction to immediately execute the callback with a mock transaction object
    transaction: vi.fn(async (callback) => {
      const tx = {
        delete: mocks.mockDelete,
      };
      return await callback(tx);
    }),
  },
}));

// Mock Schema
vi.mock("../../../db/schema", () => ({
  users: { id: "users.id" },
  maps: { userId: "maps.userId" },
  invoice: { userId: "invoice.userId" },
  feedback: { userId: "feedback.userId" },
  userAPIKeys: { userId: "userAPIKeys.userId" },
}));

// Mock Drizzle Operators
vi.mock("drizzle-orm", () => ({
  eq: mocks.mockEq,
}));

// Mock Verify Auth
vi.mock("../../../src/utils/verifyAuth", () => ({
  verifyAuth: mocks.mockVerifyAuth,
}));

// ------------------------------------------------------------------
// 2. TEST SUITE
// ------------------------------------------------------------------

describe("DELETE /api/user/delete", () => {
  const mockUserId = "user_123";

  // Helper to create a "Thenable" mock that works for both await and chaining .returning()
  const createQueryMock = (resolveValue) => {
    const promise = Promise.resolve(resolveValue);
    promise.returning = mocks.mockReturning;
    return promise;
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // 1. Setup Default Auth (Success)
    mocks.mockVerifyAuth.mockResolvedValue({
      valid: true,
      user: { id: mockUserId },
    });

    // 2. Setup DB Delete Chain
    // tx.delete() returns object with .where()
    mocks.mockDelete.mockReturnValue({ where: mocks.mockWhere });

    // 3. Setup Where Implementation
    // By default, where() returns a promise that resolves to valid result (for maps, invoice, etc.)
    // AND has a .returning() method attached (for the users delete call)
    mocks.mockWhere.mockImplementation(() => createQueryMock([{ id: mockUserId }]));

    // 4. Setup Returning Implementation (for users delete)
    mocks.mockReturning.mockResolvedValue([{ id: mockUserId }]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ═══════════════════════════════════════════════════════════
  // 🔐 AUTHENTICATION TESTS
  // ═══════════════════════════════════════════════════════════

  it("should return 401 if auth is invalid", async () => {
    mocks.mockVerifyAuth.mockResolvedValue({ valid: false, error: "Token expired" });

    const req = {};
    const res = await DELETE(req);

    expect(res.status).toBe(401);
    expect(res._json).toEqual({ error: "Token expired" });
    expect(db.transaction).not.toHaveBeenCalled();
  });

  it("should return 401 if auth is valid but user is missing", async () => {
    mocks.mockVerifyAuth.mockResolvedValue({ valid: true, user: null });

    const req = {};
    const res = await DELETE(req);

    expect(res.status).toBe(401);
    expect(res._json).toEqual({ error: "Unauthorized" });
  });

  // ═══════════════════════════════════════════════════════════
  // ✅ SUCCESS CASES
  // ═══════════════════════════════════════════════════════════

  it("should successfully delete user and related data", async () => {
    const req = {};
    const res = await DELETE(req);

    expect(res.status).toBe(200);
    expect(res._json).toEqual({ ok: true, message: "Account deleted successfully." });

    // Verify Transaction was called
    expect(db.transaction).toHaveBeenCalled();

    // Verify delete was called 5 times (maps, invoice, feedback, keys, users)
    expect(mocks.mockDelete).toHaveBeenCalledTimes(5);

    // Verify Cookie was cleared
    expect(mocks.mockCookieSet).toHaveBeenCalledWith(
      "token",
      "",
      expect.objectContaining({
        expires: new Date(0), // Updated to match implementation (Date(0) instead of maxAge: 0)
        path: "/",
      })
    );
  });

  // ═══════════════════════════════════════════════════════════
  // 💥 ERROR HANDLING
  // ═══════════════════════════════════════════════════════════

  it("should return 404 if user not found during deletion (concurrency edge case)", async () => {
    // Setup returning() to return empty array, simulating user not found during delete
    mocks.mockReturning.mockResolvedValueOnce([]);

    const req = {};
    const res = await DELETE(req);

    expect(res.status).toBe(404);
    expect(res._json).toEqual({ error: "User not found" });
  });

  it("should return 500 if database transaction fails with generic error", async () => {
    // Mock db.transaction to throw a generic error
    db.transaction.mockRejectedValueOnce(new Error("DB Connection Lost"));

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const req = {};
    const res = await DELETE(req);

    expect(res.status).toBe(500);
    expect(res._json).toEqual({ error: "Internal server error" });
    expect(consoleSpy).toHaveBeenCalled();
  });
});