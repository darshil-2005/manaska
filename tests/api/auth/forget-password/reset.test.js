import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { POST } from "../../../../src/app/api/auth/forgot-password/reset/route"; // Adjust path if needed based on your folder structure
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// ------------------------------------------------------------------
// 1. MOCKING DEPENDENCIES
// ------------------------------------------------------------------

const mocks = vi.hoisted(() => {
  return {
    mockFrom: vi.fn(),
    mockWhere: vi.fn(),
    mockLimit: vi.fn(),
    mockUpdate: vi.fn(),
    mockSet: vi.fn(),
    mockDelete: vi.fn(),
    mockEq: vi.fn(),
    mockAnd: vi.fn(),
    mockGt: vi.fn(),
    mockValidatePasswordRules: vi.fn(),
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
vi.mock("../../../../db/db", () => ({
  db: {
    select: vi.fn(() => ({ from: mocks.mockFrom })),
    update: mocks.mockUpdate,
    delete: mocks.mockDelete,
  },
}));

// Mock Schema
vi.mock("../../../../db/schema", () => ({
  users: { id: "users.id", email: "users.email", hashedPassword: "users.hashedPassword" },
  verificationTokens: {
    identifier: "verificationTokens.identifier",
    token: "verificationTokens.token",
    typeOfToken: "verificationTokens.typeOfToken",
    expires: "verificationTokens.expires",
  },
}));

// Mock Drizzle Operators
vi.mock("drizzle-orm", () => ({
  eq: mocks.mockEq,
  and: mocks.mockAnd,
  gt: mocks.mockGt,
}));

// Mock Validators
vi.mock("../../../../src/utils/validators", () => ({
  validatePasswordRules: mocks.mockValidatePasswordRules,
}));

// Mock Bcrypt
vi.mock("bcryptjs", () => ({
  default: {
    compare: vi.fn(),
    hash: vi.fn(),
  },
}));

// ------------------------------------------------------------------
// 2. TEST SUITE
// ------------------------------------------------------------------

describe("POST /api/auth/forgot-password/reset", () => {
  // Helper to create request
  const createRequest = (body) => ({
    json: async () => body,
  });

  const validBody = {
    email: "test@example.com",
    otp: "123456",
    newPassword: "NewSecurePassword1!",
    confirmPassword: "NewSecurePassword1!",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // 1. Setup Default DB Selection Chain
    // db.select().from().where().limit()
    mocks.mockFrom.mockReturnValue({ where: mocks.mockWhere });
    mocks.mockWhere.mockReturnValue({ limit: mocks.mockLimit });

    // Default: User found (First select)
    // Default: Token found (Second select)
    mocks.mockLimit
      .mockResolvedValueOnce([{ id: 1, email: "test@example.com" }]) // User
      .mockResolvedValueOnce([{ token: "hashed_stored_token" }]);    // Token

    // 2. Setup Default DB Update Chain
    // db.update().set().where()
    mocks.mockUpdate.mockReturnValue({ set: mocks.mockSet });
    mocks.mockSet.mockReturnValue({ where: vi.fn() });

    // 3. Setup Default DB Delete Chain
    // db.delete().where()
    mocks.mockDelete.mockReturnValue({ where: vi.fn() });

    // 4. Setup Default Validator
    mocks.mockValidatePasswordRules.mockReturnValue(null); // No errors

    // 5. Setup Default Bcrypt
    bcrypt.compare.mockResolvedValue(true); // OTP matches
    bcrypt.hash.mockResolvedValue("new_hashed_password");
  });

  // ----------------------------------------------------------------
  // INPUT VALIDATION CASES (400)
  // ----------------------------------------------------------------

  it("should return 400 if email is missing", async () => {
    const req = createRequest({ ...validBody, email: "" });
    const res = await POST(req);
    expect(res.status).toBe(400);
    expect(res._json).toEqual({ error: "Email is required." });
  });

  it("should return 400 if OTP is missing", async () => {
    const req = createRequest({ ...validBody, otp: "" });
    const res = await POST(req);
    expect(res.status).toBe(400);
    expect(res._json).toEqual({ error: "OTP is required." });
  });

  it("should return 400 if passwords are missing", async () => {
    const req = createRequest({ ...validBody, newPassword: "" });
    const res = await POST(req);
    expect(res.status).toBe(400);
    expect(res._json).toEqual({ error: "New password and confirmation are required." });
  });

  it("should return 400 if passwords do not match", async () => {
    const req = createRequest({ ...validBody, confirmPassword: "mismatch" });
    const res = await POST(req);
    expect(res.status).toBe(400);
    expect(res._json).toEqual({ error: "Passwords do not match." });
  });

  it("should return 400 if password rules validation fails", async () => {
    mocks.mockValidatePasswordRules.mockReturnValue("Password is too weak");
    // Fix: update confirmPassword to match so we pass the "match" check and hit the rule validation
    const req = createRequest({ ...validBody, newPassword: "weak", confirmPassword: "weak" });
    const res = await POST(req);
    expect(res.status).toBe(400);
    expect(res._json).toEqual({ error: "Password is too weak" });
  });

  // ----------------------------------------------------------------
  // USER & TOKEN VALIDATION CASES (404, 401)
  // ----------------------------------------------------------------

  it("should return 404 if user not found", async () => {
    // Reset mock to clear the "Happy Path" values set in beforeEach
    mocks.mockLimit.mockReset();
    // First DB select (User) returns empty
    mocks.mockLimit.mockResolvedValueOnce([]); 
    
    const req = createRequest(validBody);
    const res = await POST(req);

    expect(res.status).toBe(404);
    expect(res._json).toEqual({ error: "No account found for the provided email." });
  });

  it("should return 401 if token not found or expired", async () => {
    // Reset mock to clear the "Happy Path" values set in beforeEach
    mocks.mockLimit.mockReset();
    // First Select (User): Found
    mocks.mockLimit.mockResolvedValueOnce([{ id: 1 }]);
    // Second Select (Token): Not Found (or expired/wrong type as filtered by `where`)
    mocks.mockLimit.mockResolvedValueOnce([]); 

    const req = createRequest(validBody);
    const res = await POST(req);

    expect(res.status).toBe(401);
    expect(res._json).toEqual({ error: "Invalid or expired OTP." });
  });

  it("should return 401 if OTP does not match", async () => {
    // No need to reset mockLimit here as we want the success path for DB lookups
    // User Found, Token Found
    
    // Compare fails
    bcrypt.compare.mockResolvedValueOnce(false);

    const req = createRequest(validBody);
    const res = await POST(req);

    expect(res.status).toBe(401);
    expect(res._json).toEqual({ error: "Invalid OTP." });
  });

  // ----------------------------------------------------------------
  // SUCCESS CASE (200)
  // ----------------------------------------------------------------

  it("should reset password and delete token on success", async () => {
    const req = createRequest(validBody);
    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(res._json).toEqual({ ok: true, message: "Password reset successfully." });

    // 1. Verify Password Hashing
    expect(bcrypt.hash).toHaveBeenCalledWith(validBody.newPassword, 10);

    // 2. Verify User Update
    expect(mocks.mockUpdate).toHaveBeenCalled();
    expect(mocks.mockSet).toHaveBeenCalledWith({ hashedPassword: "new_hashed_password" });
    
    // 3. Verify Token Deletion
    expect(mocks.mockDelete).toHaveBeenCalled();
  });

  // ----------------------------------------------------------------
  // ERROR HANDLING (500)
  // ----------------------------------------------------------------

  it("should return 500 if database throws error", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    
    // Reset mock to clear "Happy Path"
    mocks.mockLimit.mockReset();
    // Mock DB failure on user lookup
    mocks.mockLimit.mockRejectedValue(new Error("DB Down"));

    const req = createRequest(validBody);
    const res = await POST(req);

    expect(res.status).toBe(500);
    expect(res._json).toEqual({ error: "Failed to reset password." });
    expect(consoleSpy).toHaveBeenCalled();
  });
});