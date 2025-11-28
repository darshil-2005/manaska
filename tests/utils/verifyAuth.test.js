import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// 🔧 Mock jsonwebtoken (default export with verify)
vi.mock("jsonwebtoken", () => {
  return {
    default: {
      verify: vi.fn(),
    },
  };
});

// 🔧 Mock db and expose inner mocks to control per-test behavior
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

// 🔧 Mock users schema (we don’t care what’s inside)
vi.mock("../../db/schema", () => {
  return {
    users: { id: "id" },
  };
});

// 🔧 Mock eq from drizzle-orm
vi.mock("drizzle-orm", () => {
  return {
    eq: vi.fn((a, b) => ({ a, b })),
  };
});

// 👉 Now import after mocks
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

  it("returns invalid when no token is found", async () => {
    const request = {
      cookies: {
        get: vi.fn(() => undefined),
      },
    };

    const result = await verifyAuth(request);

    expect(request.cookies.get).toHaveBeenCalledWith("token");
    expect(result).toEqual({ valid: false, error: "No token found" });

    // jwt and db should not be touched
    expect(jwt.verify).not.toHaveBeenCalled();
    expect(db.select).not.toHaveBeenCalled();
  });

  it("returns valid and user when token is good and user exists", async () => {
    const request = {
      cookies: {
        get: vi.fn(() => ({ value: "valid-token" })),
      },
    };

    // jwt.verify returns decoded payload
    jwt.verify.mockReturnValue({ id: 123 });

    // db returns a single user
    __dbMocks.whereMock.mockResolvedValueOnce([{ id: 123, name: "Alice" }]);

    const result = await verifyAuth(request);

    expect(jwt.verify).toHaveBeenCalledWith("valid-token", expect.any(String));
    expect(db.select).toHaveBeenCalledTimes(1);
    expect(__dbMocks.fromMock).toHaveBeenCalledTimes(1);
    expect(__dbMocks.whereMock).toHaveBeenCalledTimes(1);

    expect(result.valid).toBe(true);
    expect(result.user).toEqual({ id: 123, name: "Alice" });
  });

  it("returns invalid when user no longer exists", async () => {
    const request = {
      cookies: {
        get: vi.fn(() => ({ value: "valid-token" })),
      },
    };

    jwt.verify.mockReturnValue({ id: 999 });

    // db returns empty array -> no user
    __dbMocks.whereMock.mockResolvedValueOnce([]);

    const result = await verifyAuth(request);

    expect(jwt.verify).toHaveBeenCalled();
    expect(__dbMocks.whereMock).toHaveBeenCalled();
    expect(result).toEqual({ valid: false, error: "User no longer exists" });
  });

  it("returns invalid with 'Token expired' on TokenExpiredError", async () => {
    const request = {
      cookies: {
        get: vi.fn(() => ({ value: "expired-token" })),
      },
    };

    const err = new Error("Expired");
    err.name = "TokenExpiredError";
    jwt.verify.mockImplementation(() => {
      throw err;
    });

    const result = await verifyAuth(request);

    expect(jwt.verify).toHaveBeenCalled();
    expect(result).toEqual({ valid: false, error: "Token expired" });
    expect(consoleErrorSpy).not.toHaveBeenCalled(); // this branch doesn’t log
  });

  it("returns invalid with 'Invalid token' on JsonWebTokenError", async () => {
    const request = {
      cookies: {
        get: vi.fn(() => ({ value: "bad-token" })),
      },
    };

    const err = new Error("Bad token");
    err.name = "JsonWebTokenError";
    jwt.verify.mockImplementation(() => {
      throw err;
    });

    const result = await verifyAuth(request);

    expect(jwt.verify).toHaveBeenCalled();
    expect(result).toEqual({ valid: false, error: "Invalid token" });
    expect(consoleErrorSpy).not.toHaveBeenCalled(); // this branch doesn’t log
  });

  it("returns server error and logs on generic error", async () => {
    const request = {
      cookies: {
        get: vi.fn(() => ({ value: "token" })),
      },
    };

    const err = new Error("Something went wrong");
    err.name = "SomeOtherError";
    jwt.verify.mockImplementation(() => {
      throw err;
    });

    const result = await verifyAuth(request);

    expect(jwt.verify).toHaveBeenCalled();
    expect(result).toEqual({ valid: false, error: "Server error" });
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "JWT verification error:",
      err,
    );
  });
});
