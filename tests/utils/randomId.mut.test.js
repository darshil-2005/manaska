import { describe, it, expect, vi } from "vitest";
import { randomId } from "../../src/utils/randomId.js";

const allowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

describe("randomId", () => {
  // Clean up after each test
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // --------------------------
  // 1. Length tests
  // --------------------------
  it("should generate an ID of default length 15", () => {
    const id = randomId();
    expect(id).toHaveLength(15);
  });

  it("should generate an ID of custom length", () => {
    expect(randomId(1)).toHaveLength(1);
    expect(randomId(5)).toHaveLength(5);
    expect(randomId(25)).toHaveLength(25);
  });

  it("should generate an empty string when length is 0", () => {
    const id = randomId(0);
    expect(id).toBe("");
  });

  // --------------------------
  // 2. Character validation
  // --------------------------
  it("should only contain allowed characters", () => {
    const id = randomId(100); // Large sample for better coverage
    for (const char of id) {
      expect(allowedChars.includes(char)).toBe(true);
    }
  });

  // --------------------------
  // 3. Randomness & uniqueness
  // --------------------------
  it("should generate different values on multiple calls", () => {
    const id1 = randomId();
    const id2 = randomId();
    expect(id1).not.toBe(id2);
  });

  // --------------------------
  // 4. Deterministic behavior with mocked random
  // --------------------------
  it("should pick first character when Math.random returns 0", () => {
    const mock = vi.spyOn(Math, "random").mockReturnValue(0);
    const id = randomId(5);
    expect(id).toBe("AAAAA"); // First char 'A' repeated
    mock.mockRestore();
  });

  it("should pick last character when Math.random approaches 1", () => {
    const mock = vi.spyOn(Math, "random").mockReturnValue(0.999);
    const lastChar = allowedChars[allowedChars.length - 1]; // '9'
    const id = randomId(3);
    expect(id).toBe("999");
    mock.mockRestore();
  });

  it("should pick middle character for specific random value", () => {
    // Mock to return value that picks exactly the middle character
    const mock = vi.spyOn(Math, "random").mockReturnValue(0.5);
    const middleIndex = Math.floor(0.5 * allowedChars.length);
    const expectedChar = allowedChars[middleIndex];
    const id = randomId(4);
    expect(id).toBe(expectedChar.repeat(4));
    mock.mockRestore();
  });

  // --------------------------
  // 5. Implementation verification
  // --------------------------
  it("should call Math.random correct number of times", () => {
    const spy = vi.spyOn(Math, "random");
    randomId(10);
    expect(spy).toHaveBeenCalledTimes(10);
    spy.mockRestore();
  });

  // --------------------------
  // 6. Edge cases
  // --------------------------
  it("should handle negative length by treating as 0", () => {
    const id = randomId(-5);
    expect(id).toBe("");
  });

  it("should handle very large lengths", () => {
    const id = randomId(1000);
    expect(id).toHaveLength(1000);
    
    // Verify all characters are valid
    for (const char of id) {
      expect(allowedChars.includes(char)).toBe(true);
    }
  });
});