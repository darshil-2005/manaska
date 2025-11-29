import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

// We remove the static import of POST here because we need to load it dynamically
// after setting the environment variables.

// 3. IMPORT DEPENDENCIES TO MOCK
import { db } from "../../../../db/db";
import { validateEmail } from "../../../../src/utils/validators";

// ------------------------------------------------------------------
// 4. MOCKING DEPENDENCIES
// ------------------------------------------------------------------

const mocks = vi.hoisted(() => {
  return {
    mockFrom: vi.fn(),
    mockWhere: vi.fn(),
    mockLimit: vi.fn(),
    mockDelete: vi.fn(),
    mockInsert: vi.fn(),
    mockValues: vi.fn(),
    mockSendMail: vi.fn(),
    mockEq: vi.fn(),
    mockAnd: vi.fn(),
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
    delete: mocks.mockDelete,
    insert: mocks.mockInsert,
  },
}));

// Mock Schema
vi.mock("../../../../db/schema", () => ({
  users: { email: "users.email", name: "users.name" },
  verificationTokens: {
    identifier: "verificationTokens.identifier",
    typeOfToken: "verificationTokens.typeOfToken",
  },
}));

// Mock Drizzle Operators
vi.mock("drizzle-orm", () => ({
  eq: mocks.mockEq,
  and: mocks.mockAnd,
}));

// Mock Validator
vi.mock("../../../../src/utils/validators", () => ({
  validateEmail: vi.fn(),
}));

// Mock Nodemailer
vi.mock("nodemailer", () => ({
  default: {
    createTransport: vi.fn(() => ({
      sendMail: mocks.mockSendMail,
    })),
  },
}));

// Mock Bcrypt
vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn(),
  },
}));

// ------------------------------------------------------------------
// 5. TEST SUITE
// ------------------------------------------------------------------

describe("POST /api/auth/forgot-password/request", () => {
  let POST;

  // Helper to create request
  const createRequest = (body) => ({
    json: async () => body,
  });

  beforeEach(async () => {
    // 1. Reset Modules to ensure we get a fresh import of the route
    vi.resetModules();
    vi.clearAllMocks();

    // 2. Setup Environment Variables BEFORE importing the route
    vi.stubEnv("SMTP_HOST", "smtp.example.com");
    vi.stubEnv("SMTP_PORT", "587");
    vi.stubEnv("SMTP_USER", "user");
    vi.stubEnv("SMTP_PASS", "pass");
    vi.stubEnv("SMTP_FROM", "no-reply@example.com");

    // 3. Dynamically import the route
    // This triggers the top-level code in route.js to run with the env vars we just set
    const routeModule = await import("../../../../src/app/api/auth/forgot-password/request/route");
    POST = routeModule.POST;

    // 4. Setup Default DB Selection Chain (User Found)
    mocks.mockFrom.mockReturnValue({ where: mocks.mockWhere });
    mocks.mockWhere.mockReturnValue({ limit: mocks.mockLimit });
    mocks.mockLimit.mockResolvedValue([{ id: 1, email: "test@example.com", name: "Test User" }]);

    // 5. Setup Default DB Delete Chain
    mocks.mockDelete.mockReturnValue({ where: vi.fn() });

    // 6. Setup Default DB Insert Chain
    mocks.mockInsert.mockReturnValue({ values: mocks.mockValues });
    mocks.mockValues.mockResolvedValue(true);

    // 7. Setup Default Validator (Valid Email)
    validateEmail.mockReturnValue(true);

    // 8. Setup Default Bcrypt
    bcrypt.hash.mockResolvedValue("hashed_otp_secret");

    // 9. Setup Default Nodemailer
    mocks.mockSendMail.mockResolvedValue(true);
  });

  afterEach(() => {
    // FIX: Correct method name is unstubAllEnvs
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  // ----------------------------------------------------------------
  // VALIDATION CASES (400)
  // ----------------------------------------------------------------

  it("should return 400 if email is missing", async () => {
    const req = createRequest({}); // No email
    const res = await POST(req);

    expect(res.status).toBe(400);
    expect(res._json).toEqual({ error: "Please provide a valid email address." });
  });

  it("should return 400 if email is invalid", async () => {
    validateEmail.mockReturnValue(false); // Force invalid

    const req = createRequest({ email: "invalid-email" });
    const res = await POST(req);

    expect(res.status).toBe(400);
    expect(res._json).toEqual({ error: "Please provide a valid email address." });
  });

  // ----------------------------------------------------------------
  // USER NOT FOUND (404)
  // ----------------------------------------------------------------

  it("should return 404 if user does not exist", async () => {
    // Mock Limit returning empty array
    mocks.mockLimit.mockResolvedValueOnce([]);

    const req = createRequest({ email: "unknown@example.com" });
    const res = await POST(req);

    expect(res.status).toBe(404);
    expect(res._json).toEqual({ error: "No account found for the provided email." });
  });

  // ----------------------------------------------------------------
  // SUCCESS CASE (200)
  // ----------------------------------------------------------------

  it("should generate OTP, save to DB, and send email", async () => {
    const req = createRequest({ email: "test@example.com" });
    const res = await POST(req);

    // 1. Verify Response
    expect(res._json).toEqual({ ok: true, message: "OTP sent to email." });

    // 2. Verify User Lookup
    expect(mocks.mockEq).toHaveBeenCalledWith("users.email", "test@example.com");

    // 3. Verify Old Token Deletion
    expect(mocks.mockDelete).toHaveBeenCalled();
    expect(mocks.mockAnd).toHaveBeenCalled();

    // 4. Verify New Token Insertion
    expect(mocks.mockInsert).toHaveBeenCalled();
    expect(mocks.mockValues).toHaveBeenCalledWith(expect.objectContaining({
      identifier: "test@example.com",
      token: "hashed_otp_secret", // From bcrypt mock
      typeOfToken: "FORGOT_PASSWORD",
      expires: expect.any(Date),
    }));

    // 5. Verify Email Sent
    expect(mocks.mockSendMail).toHaveBeenCalledWith(expect.objectContaining({
      from: "no-reply@example.com",
      to: "test@example.com",
      subject: "Your password reset OTP",
      // Verify OTP is numeric (generated by generateOtp)
      text: expect.stringMatching(/Your One Time Password \(OTP\) for resetting your password is \d{6}\./),
    }));
  });

  it("should include user name in email if available", async () => {
    const req = createRequest({ email: "test@example.com" });
    await POST(req);

    // Verify HTML content contains "Hi Test User"
    const sendMailCalls = mocks.mockSendMail.mock.calls;
    const emailOptions = sendMailCalls[0][0];
    expect(emailOptions.html).toContain("Hi Test User");
  });

  // ----------------------------------------------------------------
  // ERROR HANDLING (500)
  // ----------------------------------------------------------------

  it("should return 500 if database fails", async () => {
    // Mock user lookup failing
    mocks.mockLimit.mockRejectedValue(new Error("DB Connection Error"));

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const req = createRequest({ email: "test@example.com" });
    const res = await POST(req);

    expect(res.status).toBe(500);
    expect(res._json).toEqual({ error: "Failed to send password reset OTP." });
    expect(consoleSpy).toHaveBeenCalled();
  });

  it("should return 500 if email sending fails", async () => {
    // User found, but sending mail fails
    mocks.mockSendMail.mockRejectedValue(new Error("SMTP Error"));

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const req = createRequest({ email: "test@example.com" });
    const res = await POST(req);

    expect(res.status).toBe(500);
    expect(res._json).toEqual({ error: "Failed to send password reset OTP." });
    expect(consoleSpy).toHaveBeenCalled();
  });
});