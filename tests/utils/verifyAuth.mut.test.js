import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// --------------------
// ROBUST MOCKS (from first file)
// --------------------

// Mock jsonwebtoken (default export with verify)
vi.mock("jsonwebtoken", () => {
  return {
    default: {
      verify: vi.fn(),
    },
  };
});

// Mock db and expose inner mocks to control per-test behavior
vi.mock("../../db/db", () => {
  const whereMock = vi.fn();
  const fromMock = vi.fn(() => ({ where: whereMock }));
  const selectMock = vi.fn(() => ({ from: fromMock }));

  const db = { select: selectMock };

  return {
    db,
    __dbMocks: { whereMock, fromMock, selectMock },
  };
});

//  Mock users schema (we don't care what's inside)
vi.mock("../../db/schema", () => {
  return {
    users: { id: "id" },
  };
});

//  Mock eq from drizzle-orm
vi.mock("drizzle-orm", () => {
  return {
    eq: vi.fn((a, b) => ({ a, b })),
  };
});

//  Now import after mocks
import { verifyAuth } from "../../src/utils/verifyAuth.js";
import jwt from "jsonwebtoken";
import { db, __dbMocks } from "../../db/db.js";

describe("verifyAuth", () => {
  let consoleErrorSpy;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });


  const mockRequest = (tokenValue) => ({
    cookies: {
      get: vi.fn(() => tokenValue ? { value: tokenValue } : undefined),
    },
  });

  // --------------------------
  // 1. Missing token
  // --------------------------
  it("should return invalid when no token is provided", async () => {
    const req = mockRequest(null);
    const result = await verifyAuth(req);

    expect(req.cookies.get).toHaveBeenCalledWith("token");
    expect(result).toEqual({ valid: false, error: "No token found" });

    // jwt and db should not be touched
    expect(jwt.verify).not.toHaveBeenCalled();
    expect(db.select).not.toHaveBeenCalled();
  });

  // --------------------------
  // 2. Valid token + valid user
  // --------------------------
  it("should return valid user when JWT and DB check pass", async () => {
    const req = mockRequest("valid-token");

    // jwt.verify returns decoded payload
    jwt.verify.mockReturnValue({ id: 123 });

    // db returns a single user
    __dbMocks.whereMock.mockResolvedValueOnce([{ id: 123, name: "Alice", email: "alice@test.com" }]);

    const result = await verifyAuth(req);

    expect(jwt.verify).toHaveBeenCalledWith("valid-token", expect.any(String));
    expect(db.select).toHaveBeenCalledTimes(1);
    expect(__dbMocks.fromMock).toHaveBeenCalledTimes(1);
    expect(__dbMocks.whereMock).toHaveBeenCalledTimes(1);

    expect(result.valid).toBe(true);
    expect(result.user).toEqual({ id: 123, name: "Alice", email: "alice@test.com" });
  });

  // --------------------------
  // 3. Valid token but user not found
  // --------------------------
  it("should return invalid when user does not exist in DB", async () => {
    const req = mockRequest("valid-token");

    jwt.verify.mockReturnValue({ id: 999 });

    // db returns empty array -> no user
    __dbMocks.whereMock.mockResolvedValueOnce([]);

    const result = await verifyAuth(req);

    expect(jwt.verify).toHaveBeenCalled();
    expect(__dbMocks.whereMock).toHaveBeenCalled();
    expect(result).toEqual({ valid: false, error: "User no longer exists" });
  });

  // --------------------------
  // 4. Expired token
  // --------------------------
  it("should return token expired error", async () => {
    const req = mockRequest("expired-token");

    const err = new Error("Token expired");
    err.name = "TokenExpiredError";
    jwt.verify.mockImplementation(() => {
      throw err;
    });

    const result = await verifyAuth(req);

    expect(jwt.verify).toHaveBeenCalled();
    expect(result).toEqual({ valid: false, error: "Token expired" });
    expect(consoleErrorSpy).not.toHaveBeenCalled(); // this branch doesn't log
  });

  // --------------------------
  // 5. Invalid token
  // --------------------------
  it("should return invalid token error", async () => {
    const req = mockRequest("bad-token");

    const err = new Error("Invalid signature");
    err.name = "JsonWebTokenError";
    jwt.verify.mockImplementation(() => {
      throw err;
    });

    const result = await verifyAuth(req);

    expect(jwt.verify).toHaveBeenCalled();
    expect(result).toEqual({ valid: false, error: "Invalid token" });
    expect(consoleErrorSpy).not.toHaveBeenCalled(); // this branch doesn't log
  });

  // --------------------------
  // 6. Unexpected server error
  // --------------------------
  it("should return server error for unexpected exception", async () => {
    const req = mockRequest("token");

    const err = new Error("Random failure");
    err.name = "SomeOtherError";
    jwt.verify.mockImplementation(() => {
      throw err;
    });

    const result = await verifyAuth(req);

    expect(jwt.verify).toHaveBeenCalled();
    expect(result).toEqual({ valid: false, error: "Server error" });
    expect(consoleErrorSpy).toHaveBeenCalledWith("JWT verification error:", err);
  });
});