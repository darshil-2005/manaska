import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { POST } from "../../../src/app/api/auth/register/route"; 
import { NextResponse } from "next/server";
import { db } from "../../../db/db";
import bcrypt from "bcryptjs";
import { validateEmail, validatePasswordRules } from "../../../src/utils/validators";

// ------------------------------------------------------------------
// 1. MOCKING DEPENDENCIES
// ------------------------------------------------------------------

// Mock Next.js Server Response
vi.mock("next/server", () => ({
  NextResponse: {
    json: vi.fn((body, options) => ({
      _json: body,
      status: options?.status || 200,
    })),
  },
}));

// Mock Drizzle ORM and DB Connection
const mockLimit = vi.fn();
const mockWhere = vi.fn();
const mockFrom = vi.fn();
const mockSelect = vi.fn();
const mockReturning = vi.fn();
const mockValues = vi.fn();
const mockInsert = vi.fn();

// FIX: Path must match the import statement: "../../../db/db"
vi.mock("../../../db/db", () => ({
  db: {
    select: () => ({ from: mockFrom }),
    insert: () => ({ values: mockValues }),
  },
}));

// Mock Schema and Operators
// FIX: Path updated to be consistent with db path: "../../../db/schema"
vi.mock("../../../db/schema", () => ({
  users: {
    email: "users.email",
    username: "users.username",
  },
}));

vi.mock("drizzle-orm", () => ({
  eq: vi.fn(),
}));

// Mock Bcrypt
vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn(),
  },
}));

// Mock Validators
// FIX: Path must match the import exactly: "../../../src/utils/validators"
vi.mock("../../../src/utils/validators", () => ({
  validateEmail: vi.fn(),
  validatePasswordRules: vi.fn(),
}));

// ------------------------------------------------------------------
// 2. TEST SUITE
// ------------------------------------------------------------------

describe("POST /api/register", () => {
  // Helper to create a request with json body
  const createRequest = (body) => ({
    json: async () => body,
  });

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup Default Drizzle Chain for Select
    mockFrom.mockReturnValue({ where: mockWhere });
    mockWhere.mockReturnValue({ limit: mockLimit });
    // Default: No existing user found
    mockLimit.mockResolvedValue([]); 

    // Setup Default Drizzle Chain for Insert
    mockValues.mockReturnValue({ returning: mockReturning });
    // Default: Return created user
    mockReturning.mockResolvedValue([{ id: 123 }]);

    // Setup Default Validator Success
    // Use the named imports directly
    validateEmail.mockReturnValue(true);
    validatePasswordRules.mockReturnValue(null); // null means no error
    
    // Setup Bcrypt
    bcrypt.hash.mockResolvedValue("hashed_secret_123");
  });

  // ----------------------------------------------------------------
  // VALIDATION EDGE CASES (400)
  // ----------------------------------------------------------------

  it("should return 400 if email is missing", async () => {
    const req = createRequest({
      username: "john_doe",
      password: "password123",
      confirmPassword: "password123",
      acceptTerms: true,
    });

    const res = await POST(req);

    expect(res.status).toBe(400);
    expect(res._json).toEqual({ error: "Please provide a valid email address." });
  });

  it("should return 400 if email format is invalid", async () => {
    validateEmail.mockReturnValue(false); // Force invalid format

    const req = createRequest({
      email: "invalid-email",
      username: "john_doe",
      password: "password123",
      confirmPassword: "password123",
      acceptTerms: true,
    });

    const res = await POST(req);

    expect(res.status).toBe(400);
    expect(res._json).toEqual({ error: "Please provide a valid email address." });
  });

  it("should return 400 if username is missing", async () => {
    const req = createRequest({
      email: "test@example.com",
      // username missing
      password: "password123",
      confirmPassword: "password123",
      acceptTerms: true,
    });

    const res = await POST(req);

    expect(res.status).toBe(400);
    expect(res._json).toEqual({ error: "Username must be at least 6 characters." });
  });

  it("should return 400 if username is less than 6 characters", async () => {
    const req = createRequest({
      email: "test@example.com",
      username: "short", // 5 chars
      password: "password123",
      confirmPassword: "password123",
      acceptTerms: true,
    });

    const res = await POST(req);

    expect(res.status).toBe(400);
    expect(res._json).toEqual({ error: "Username must be at least 6 characters." });
  });

  it("should return 400 if password is missing", async () => {
    const req = createRequest({
      email: "test@example.com",
      username: "validUser",
      // password missing
      confirmPassword: "password123",
      acceptTerms: true,
    });

    const res = await POST(req);

    expect(res.status).toBe(400);
    expect(res._json).toEqual({ error: "Password is required." });
  });

  it("should return 400 if passwords do not match", async () => {
    const req = createRequest({
      email: "test@example.com",
      username: "validUser",
      password: "password123",
      confirmPassword: "mismatch123",
      acceptTerms: true,
    });

    const res = await POST(req);

    expect(res.status).toBe(400);
    expect(res._json).toEqual({ error: "Passwords do not match." });
  });

  it("should return 400 if password does not meet complexity rules", async () => {
    // Mock validator returning an error string
    validatePasswordRules.mockReturnValue("Password too weak");

    const req = createRequest({
      email: "test@example.com",
      username: "validUser",
      password: "weak",
      confirmPassword: "weak",
      acceptTerms: true,
    });

    const res = await POST(req);

    expect(res.status).toBe(400);
    expect(res._json).toEqual({ error: "Password too weak" });
  });

  it("should return 400 if terms are not accepted", async () => {
    const req = createRequest({
      email: "test@example.com",
      username: "validUser",
      password: "password123",
      confirmPassword: "password123",
      acceptTerms: false, // Not accepted
    });

    const res = await POST(req);

    expect(res.status).toBe(400);
    expect(res._json).toEqual({ error: "You must accept the Terms of Service and Privacy Policy." });
  });

  // ----------------------------------------------------------------
  // CONFLICT EDGE CASES (409)
  // ----------------------------------------------------------------

  it("should return 409 if email is already registered", async () => {
    // Mock DB finding an existing user by email
    // The first query in the code checks email
    mockLimit.mockResolvedValueOnce([{ id: 1, email: "test@example.com" }]);

    const req = createRequest({
      email: "test@example.com",
      username: "newUser",
      password: "password123",
      confirmPassword: "password123",
      acceptTerms: true,
    });

    const res = await POST(req);

    expect(res.status).toBe(409);
    expect(res._json).toEqual({ error: "This email is already registered. Please login instead." });
  });

  it("should return 409 if username is already taken", async () => {
    // First query (email check) returns empty
    mockLimit.mockResolvedValueOnce([]); 
    // Second query (username check) returns existing user
    mockLimit.mockResolvedValueOnce([{ id: 2, username: "existingUser" }]);

    const req = createRequest({
      email: "new@example.com",
      username: "existingUser",
      password: "password123",
      confirmPassword: "password123",
      acceptTerms: true,
    });

    const res = await POST(req);

    expect(res.status).toBe(409);
    expect(res._json).toEqual({ error: "This username is already taken. Please choose another." });
  });

  // ----------------------------------------------------------------
  // SUCCESS CASE (201)
  // ----------------------------------------------------------------

  it("should register a user successfully, trim inputs, and hash password", async () => {
    const input = {
      name: "  John Doe  ", // Needs trimming
      email: "  Test@Example.COM  ", // Needs trim + lowercase
      username: "  CoolUser  ", // Needs trimming
      password: "securePassword123",
      confirmPassword: "securePassword123",
      acceptTerms: true,
    };

    const req = createRequest(input);
    const res = await POST(req);

    // 1. Verify Response
    expect(res.status).toBe(201);
    expect(res._json).toEqual({
      ok: true,
      user: { id: 123, email: "test@example.com" },
    });

    // 2. Verify Password Hashing
    expect(bcrypt.hash).toHaveBeenCalledWith("securePassword123", 10);

    // 3. Verify Database Insertion
    // Ensure inputs were trimmed and normalized before insertion
    expect(mockValues).toHaveBeenCalledWith({
      name: "John Doe",
      username: "CoolUser",
      email: "test@example.com", // Normalized
      hashedPassword: "hashed_secret_123",
      emailVerified: null,
    });
  });

  // ----------------------------------------------------------------
  // ERROR HANDLING (500)
  // ----------------------------------------------------------------

  it("should return 500 if an internal server error occurs", async () => {
    // Mock DB select throwing an error
    mockLimit.mockRejectedValue(new Error("Database connection failed"));

    const req = createRequest({
      email: "test@example.com",
      username: "validUser",
      password: "password123",
      confirmPassword: "password123",
      acceptTerms: true,
    });

    // Prevent console.error from cluttering test output
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const res = await POST(req);

    expect(res.status).toBe(500);
    expect(res._json).toEqual({ error: "Internal server error" });
    expect(consoleSpy).toHaveBeenCalled(); // Ensure error was logged
  });
});