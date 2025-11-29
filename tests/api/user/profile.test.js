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
    update: vi.fn(() => ({ set: mocks.mockSet })),
  },
}));

// Mock Schema
vi.mock("../../../db/schema", () => ({
  users: {
    id: "users.id",
    username: "users.username",
  },
}));

// Mock Drizzle Operators
vi.mock("drizzle-orm", () => ({
  eq: mocks.mockEq,
}));

// 2. IMPORT THE ROUTE
// Adjust path if necessary (e.g. src/app/api/profile/route)
import { GET, POST } from "../../../src/app/api/user/profile/route";

// ------------------------------------------------------------------
// 3. TEST SUITE
// ------------------------------------------------------------------

describe("/api/user/profile", () => {
  const mockUserId = "user_123";
  const mockUser = {
    id: mockUserId,
    name: "John Doe",
    username: "johndoe",
    email: "john@example.com",
    image: "avatar.png",
    coins: 100,
    createdAt: new Date(),
    password: "secret_hash", // Should be filtered out
  };

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
    mocks.mockSet.mockReturnValue({ where: mocks.mockWhere });

    // Where Implementation (Hybrid Mock)
    // Default: Return the user
    mocks.mockWhere.mockImplementation(() => createQueryMock([mockUser]));

    // Returning Implementation (for update)
    mocks.mockReturning.mockResolvedValue([mockUser]);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  // ═══════════════════════════════════════════════════════════
  // 🔐 SHARED AUTH TESTS
  // ═══════════════════════════════════════════════════════════

  it("GET should return {status: 401} if auth check fails", async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: { ok: false } });
    const res = await GET({});
    expect(res.status).toBe(200);
    expect(res._json).toEqual({ status: 401 });
  });

  it("POST should return {status: 401} if auth check fails", async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: { ok: false } });
    const res = await POST(createRequest({}));
    expect(res.status).toBe(200);
    expect(res._json).toEqual({ status: 401 });
  });

  // ═══════════════════════════════════════════════════════════
  // 📖 GET METHOD TESTS
  // ═══════════════════════════════════════════════════════════

  describe("GET", () => {
    it("should return 200 and filtered profile data", async () => {
      const res = await GET({});

      expect(res.status).toBe(200);
      expect(res._json.profile).toBeDefined();
      
      // Verify fields
      const p = res._json.profile;
      expect(p.id).toBe(mockUserId);
      expect(p.name).toBe("John Doe");
      expect(p.password).toBeUndefined(); // Should be filtered out by 'pick'
    });

    it("should return 404 if user not found in DB", async () => {
      // Mock DB empty return
      mocks.mockWhere.mockImplementationOnce(() => createQueryMock([]));

      const res = await GET({});

      expect(res.status).toBe(404);
      expect(res._json).toEqual({ error: "User not found" });
    });

    it("should return 500 on DB error", async () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      mocks.mockWhere.mockImplementationOnce(() => createQueryMock(new Error("Fail"), true)); // Should reject

      const res = await GET({});

      expect(res.status).toBe(500);
      expect(res._json).toEqual({ error: "Internal server error" });
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  // ═══════════════════════════════════════════════════════════
  // ✏️ POST METHOD TESTS (Update)
  // ═══════════════════════════════════════════════════════════

  describe("POST", () => {
    it("should return 400 if body is invalid or missing", async () => {
      const req = { json: async () => null }; // Simulate body catch block or null return
      const res = await POST(req);
      expect(res.status).toBe(400);
      expect(res._json).toEqual({ error: "Invalid JSON body" });
    });

    it("should return 400 if no allowed fields are provided", async () => {
      const req = createRequest({ invalidField: "test" });
      const res = await POST(req);
      expect(res.status).toBe(400);
      expect(res._json).toEqual({ error: "No updatable fields provided" });
    });

    it("should return 400 for invalid field types", async () => {
      const req = createRequest({ name: 123 }); // Name must be string
      const res = await POST(req);
      expect(res.status).toBe(400);
      expect(res._json.error).toContain("'name' must be a string");
    });

    it("should return 400 if username is too long", async () => {
      const longName = "a".repeat(256);
      const req = createRequest({ username: longName });
      const res = await POST(req);
      expect(res.status).toBe(400);
      expect(res._json.error).toContain("must be a string <= 255 chars");
    });

    it("should return 409 if username is already taken by another user", async () => {
      const req = createRequest({ username: "taken_user" });

      // Mock DB: select().from().where() logic used for username check
      // We need to differentiate between the 'username check' query and the 'update' query?
      // The code calls db.select() first inside the username block.
      // We'll mock the first call to return an existing user with DIFFERENT ID
      
      mocks.mockWhere.mockImplementationOnce(() => createQueryMock([{
        id: "other_user_id",
        username: "taken_user"
      }]));

      const res = await POST(req);

      expect(res.status).toBe(409);
      expect(res._json).toEqual({ error: "Username already taken" });
    });

    
    

    it("should return 200 and updated profile on success", async () => {
      const updates = { name: "New Name", username: "new_handle" };
      const req = createRequest(updates);

      // 1. Username check -> Returns empty (not taken)
      mocks.mockWhere.mockImplementationOnce(() => createQueryMock([]));

      // 2. Update -> Returns updated user
      const updatedUser = { ...mockUser, ...updates };
      mocks.mockReturning.mockResolvedValueOnce([updatedUser]);

      const res = await POST(req);

      expect(res.status).toBe(200);
      expect(res._json.profile).toBeDefined();
      expect(res._json.profile.name).toBe("New Name");
      expect(res._json.profile.username).toBe("new_handle");
      
      // Verify DB interactions
      expect(mocks.mockSet).toHaveBeenCalledWith(expect.objectContaining(updates));
    });

    it("should return 500 on database error during update", async () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const req = createRequest({ name: "New Name" });

      // Mock Update failure (mockReturning is called after where in the chain)
      // The chain is update -> set -> where -> returning
      // We can make returning reject
      mocks.mockReturning.mockRejectedValueOnce(new Error("DB Update Failed"));

      const res = await POST(req);

      expect(res.status).toBe(500);
      expect(res._json).toEqual({ error: "Internal server error" });
      expect(consoleSpy).toHaveBeenCalled();
    });
  });
});