import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

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
    mockVerifyAuth: vi.fn(),
    mockGetToken: vi.fn(),
    mockValidatePasswordRules: vi.fn(),
    mockCompare: vi.fn(),
    mockHash: vi.fn(),
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
    update: vi.fn(() => ({ set: mocks.mockSet })),
  },
}));

// Mock Schema
vi.mock("../../../db/schema", () => ({
  users: {
    id: "users.id",
    hashedPassword: "users.hashedPassword",
  },
}));

// Mock Drizzle Operators
vi.mock("drizzle-orm", () => ({
  eq: mocks.mockEq,
}));

// Mock Bcrypt
vi.mock("bcryptjs", () => ({
  default: {
    compare: mocks.mockCompare,
    hash: mocks.mockHash,
  },
}));

// Mock Utils
vi.mock("../../../src/utils/verifyAuth", () => ({
  verifyAuth: mocks.mockVerifyAuth,
}));

vi.mock("../../../src/utils/validators", () => ({
  validatePasswordRules: mocks.mockValidatePasswordRules,
}));

// Mock NextAuth
vi.mock("next-auth/jwt", () => ({
  getToken: mocks.mockGetToken,
}));

// 2. IMPORT THE ROUTE
import { POST } from "../../../src/app/api/user/change-password/route";

// ------------------------------------------------------------------
// 3. TEST SUITE
// ------------------------------------------------------------------

describe("POST /api/user/change-password", () => {
  const mockUserId = "user_123";
  const mockHashedPassword = "hashed_current_password";
  
  const mockUser = {
    id: mockUserId,
    hashedPassword: mockHashedPassword,
  };

  const validBody = {
    currentPassword: "CurrentPass1!",
    newPassword: "NewPass1!",
    confirmNewPassword: "NewPass1!",
  };

  // Helper to create request
  const createRequest = (body) => ({
    json: async () => body,
  });

  // Helper for DB Chaining
  const createQueryMock = (resolveValue) => {
    const promise = Promise.resolve(resolveValue);
    promise.returning = mocks.mockReturning;
    return promise;
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // 1. Setup Auth (Default: Custom Auth Valid)
    mocks.mockVerifyAuth.mockResolvedValue({
      valid: true,
      user: mockUser,
    });
    mocks.mockGetToken.mockResolvedValue(null); // Default NextAuth fail

    // 2. Setup DB Chains
    // Select
    mocks.mockFrom.mockReturnValue({ where: mocks.mockWhere });
    mocks.mockWhere.mockImplementation(() => createQueryMock([mockUser]));

    // Update
    mocks.mockSet.mockReturnValue({ where: mocks.mockWhere });
    // Note: mockWhere is reused. Update chain logic relies on .returning property on promise
    mocks.mockReturning.mockResolvedValue([{ id: mockUserId }]);

    // 3. Setup Validator
    mocks.mockValidatePasswordRules.mockReturnValue(null); // No error

    // 4. Setup Bcrypt
    mocks.mockCompare.mockResolvedValue(true); // Password matches
    mocks.mockHash.mockResolvedValue("new_hashed_secret");
  });

  // ═══════════════════════════════════════════════════════════
  // 🔐 AUTHENTICATION TESTS
  // ═══════════════════════════════════════════════════════════

  it("should return 401 if unauthorized (both strategies fail)", async () => {
    mocks.mockVerifyAuth.mockResolvedValue({ valid: false });
    mocks.mockGetToken.mockResolvedValue(null);

    const res = await POST(createRequest(validBody));

    expect(res.status).toBe(401);
    expect(res._json).toEqual({ error: "Unauthorized" });
  });

  it("should authenticate using NextAuth session if custom auth fails", async () => {
    // 1. Fail custom auth
    mocks.mockVerifyAuth.mockResolvedValue({ valid: false });
    
    // 2. Succeed NextAuth
    mocks.mockGetToken.mockResolvedValue({ sub: mockUserId });
    
    // 3. DB Lookup for NextAuth user
    mocks.mockWhere.mockImplementationOnce(() => createQueryMock([mockUser]));

    const res = await POST(createRequest(validBody));

    expect(res.status).toBe(200);
    expect(mocks.mockGetToken).toHaveBeenCalled();
  });

  it("should return 401 if NextAuth token exists but user not in DB", async () => {
    mocks.mockVerifyAuth.mockResolvedValue({ valid: false });
    mocks.mockGetToken.mockResolvedValue({ sub: "unknown_user" });
    
    // DB returns empty
    mocks.mockWhere.mockImplementationOnce(() => createQueryMock([]));

    const res = await POST(createRequest(validBody));

    expect(res.status).toBe(401);
    expect(res._json).toEqual({ error: "Unauthorized" });
  });

  // ═══════════════════════════════════════════════════════════
  // 🛡️ VALIDATION TESTS
  // ═══════════════════════════════════════════════════════════

  it("should return 400 if user has no local password (e.g. OAuth only)", async () => {
    // Mock user without hash
    mocks.mockVerifyAuth.mockResolvedValue({
      valid: true,
      user: { id: mockUserId, hashedPassword: null },
    });

    const res = await POST(createRequest(validBody));

    expect(res.status).toBe(400);
    expect(res._json).toEqual({ error: "Password change not available for this account." });
  });

  it("should return 400 if fields are missing", async () => {
    const res = await POST(createRequest({ currentPassword: "pwd" }));
    expect(res.status).toBe(400);
    expect(res._json).toEqual({ error: "All fields are required." });
  });

  it("should return 400 if passwords do not match", async () => {
    const body = { ...validBody, confirmNewPassword: "mismatch" };
    const res = await POST(createRequest(body));
    expect(res.status).toBe(400);
    expect(res._json).toEqual({ error: "New passwords do not match." });
  });

  it("should return 400 if new password violates rules", async () => {
    mocks.mockValidatePasswordRules.mockReturnValue("Password too weak");
    
    const res = await POST(createRequest(validBody));
    
    expect(res.status).toBe(400);
    expect(res._json).toEqual({ error: "Password too weak" });
  });

  it("should return 401 if current password is incorrect", async () => {
    mocks.mockCompare.mockResolvedValue(false); // Wrong password

    const res = await POST(createRequest(validBody));

    expect(res.status).toBe(401);
    expect(res._json).toEqual({ error: "Current password is incorrect." });
  });

  // ═══════════════════════════════════════════════════════════
  // ✅ SUCCESS CASE
  // ═══════════════════════════════════════════════════════════

  it("should return 200 and update password on success", async () => {
    const res = await POST(createRequest(validBody));

    expect(res.status).toBe(200);
    expect(res._json).toEqual({ ok: true, message: "Password updated successfully." });

    // Verify hashing and update
    expect(mocks.mockHash).toHaveBeenCalledWith(validBody.newPassword, 10);
    expect(mocks.mockSet).toHaveBeenCalledWith({ hashedPassword: "new_hashed_secret" });
  });

  // ═══════════════════════════════════════════════════════════
  // 💥 ERROR HANDLING
  // ═══════════════════════════════════════════════════════════

  it("should return 500 if update returns empty (failure)", async () => {
    // Mock update returning empty array
    mocks.mockReturning.mockResolvedValueOnce([]);

    const res = await POST(createRequest(validBody));

    expect(res.status).toBe(500);
    expect(res._json).toEqual({ error: "Failed to update password." });
  });

  it("should return 500 if an exception occurs", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    
    // Simulate DB error during update
    mocks.mockSet.mockImplementation(() => {
      throw new Error("DB Error");
    });

    const res = await POST(createRequest(validBody));

    expect(res.status).toBe(500);
    expect(res._json).toEqual({ error: "Internal server error" });
    expect(consoleSpy).toHaveBeenCalled();
  });
});