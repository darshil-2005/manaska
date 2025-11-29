import { describe, it, expect, vi, beforeEach } from "vitest";
// FIX 1: Point to the actual location of route.js in src
import { POST } from "../../../src/app/api/auth/login/route"; 
import { NextResponse } from "next/server";
// FIX 2: Correct path to db from 'tests/api/auth/' (3 levels up, not 5)
import { db } from "../../../db/db.js"; 
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ------------------------------------------------------------------
// 1. MOCKING DEPENDENCIES (WITH HOISTING)
// ------------------------------------------------------------------

const mocks = vi.hoisted(() => {
  return {
    mockFrom: vi.fn(),
    mockWhere: vi.fn(),
    mockCookieSet: vi.fn(),
    mockEq: vi.fn(),
    mockCompare: vi.fn(),
    mockSign: vi.fn(),
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

// Mock Drizzle ORM and DB Connection
// FIX 3: path must resolve to the SAME file as route.js imports.
// From 'tests/api/auth/', this is 3 levels up.
vi.mock("../../../db/db.js", () => ({
  db: {
    select: vi.fn(() => ({ 
      from: mocks.mockFrom 
    })),
  },
}));

// Mock Schema
// FIX 4: Correct path for schema mock
vi.mock("../../../db/schema", () => ({
  users: {
    email: "users.email",
    username: "users.username",
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
  },
}));

// Mock JWT
vi.mock("jsonwebtoken", () => ({
  default: {
    sign: mocks.mockSign,
  },
}));

// ------------------------------------------------------------------
// 2. TEST SUITE
// ------------------------------------------------------------------

describe("POST /api/login", () => {
  const createRequest = (body) => ({
    json: async () => body,
  });

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup Drizzle Chain: db.select().from().where()
    mocks.mockFrom.mockReturnValue({ where: mocks.mockWhere });
    
    // Default: User found
    mocks.mockWhere.mockResolvedValue([{ 
      id: 1, 
      name: "John Doe", 
      email: "test@example.com", 
      username: "johndoe", 
      hashedPassword: "hashed_secret",
      avatar: "avatar.png"
    }]);

    // Default: Password valid
    mocks.mockCompare.mockResolvedValue(true);

    // Default: Token generation
    mocks.mockSign.mockReturnValue("mock_token_123");
  });

  // ----------------------------------------------------------------
  // VALIDATION EDGE CASES (400)
  // ----------------------------------------------------------------

  it("should return 400 if email/username is missing", async () => {
    const req = createRequest({
      password: "password123",
    });

    const res = await POST(req);

    expect(res.status).toBe(400);
    expect(res._json).toEqual({ error: "Email or username and password are required" });
  });

  it("should return 400 if password is missing", async () => {
    const req = createRequest({
      email: "test@example.com",
    });

    const res = await POST(req);

    expect(res.status).toBe(400);
    expect(res._json).toEqual({ error: "Email or username and password are required" });
  });

  it("should return 400 if body is empty", async () => {
    const req = createRequest({});

    const res = await POST(req);

    expect(res.status).toBe(400);
    expect(res._json).toEqual({ error: "Email or username and password are required" });
  });

  // ----------------------------------------------------------------
  // AUTHENTICATION FAILURES (401)
  // ----------------------------------------------------------------

  it("should return 401 if user is not found", async () => {
    // Mock DB returning empty array
    mocks.mockWhere.mockResolvedValueOnce([]);

    const req = createRequest({
      email: "unknown@example.com",
      password: "password123",
    });

    const res = await POST(req);

    expect(res.status).toBe(401);
    expect(res._json).toEqual({ error: "Invalid credentials" });
  });

  it("should return 401 if password does not match", async () => {
    // Mock bcrypt returning false
    mocks.mockCompare.mockResolvedValueOnce(false);

    const req = createRequest({
      email: "test@example.com",
      password: "wrongpassword",
    });

    const res = await POST(req);

    expect(res.status).toBe(401);
    expect(res._json).toEqual({ error: "Invalid credentials" });
  });

  // ----------------------------------------------------------------
  // SUCCESS CASES (200)
  // ----------------------------------------------------------------

  it("should login successfully with Email", async () => {
    const req = createRequest({
      email: "test@example.com",
      password: "password123",
    });

    const res = await POST(req);

    // 1. Verify Response
    expect(res.status).toBe(200);
    expect(res._json).toMatchObject({
      message: "Login successful",
      user: {
        email: "test@example.com",
        username: "johndoe",
      },
    });

    // 2. Verify JWT generated
    expect(mocks.mockSign).toHaveBeenCalledWith(
      { id: 1, email: "test@example.com", username: "johndoe" },
      expect.any(String), // secret
      { expiresIn: "7d" }
    );

    // 3. Verify Cookie was set
    expect(mocks.mockCookieSet).toHaveBeenCalledWith("token", "mock_token_123", expect.objectContaining({
      httpOnly: false,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    }));
  });

  it("should login successfully with Username", async () => {
    const req = createRequest({
      email: "johndoe", // Not an email format, interpreted as username
      password: "password123",
    });

    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(res._json.user.username).toBe("johndoe");
    expect(mocks.mockWhere).toHaveBeenCalled(); 
  });

  // ----------------------------------------------------------------
  // ERROR HANDLING (500)
  // ----------------------------------------------------------------

  it("should return 500 if database throws error", async () => {
    // Mock DB throw
    mocks.mockWhere.mockRejectedValueOnce(new Error("DB Down"));

    const req = createRequest({
      email: "test@example.com",
      password: "password123",
    });

    // Suppress console error for this test
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const res = await POST(req);

    expect(res.status).toBe(500);
    expect(res._json).toEqual({ error: "Internal server error" });
    expect(consoleSpy).toHaveBeenCalled();
  });
});