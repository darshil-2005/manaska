import { describe, it, expect } from "vitest";
import { unquote } from "../../src/utils/removeQuotes.js";

describe("unquote", () => {
  it("should return the inside of double-quoted string", () => {
    expect(unquote('"hello"')).toBe("hello");
    expect(unquote('"a"')).toBe("a");
    expect(unquote('"123"')).toBe("123");
  });

  it("should return original string if not wrapped in double quotes", () => {
    expect(unquote("hello")).toBe("hello");
    expect(unquote("'hello'")).toBe("'hello'");
    expect(unquote("\"hello'")).toBe("\"hello'");
    expect(unquote("'hello\"")).toBe("'hello\"");
  });

  it("should return original if string length < 2", () => {
    expect(unquote("")).toBe("");
    expect(unquote("a")).toBe("a");
  });

  it("should handle string with exactly 2 characters that are quotes", () => {
    expect(unquote('""')).toBe('');
  });


  it("should return original value if input is not a string", () => {
    expect(unquote(123)).toBe(123);
    expect(unquote(null)).toBe(null);
    expect(unquote(undefined)).toBe(undefined);
    expect(unquote({})).toEqual({});
  });

  it("should not unquote if only one double quote exists", () => {
    expect(unquote('"hello')).toBe('"hello');
    expect(unquote('hello"')).toBe('hello"');
  });

  it("should not unquote single quote character", () => {
    expect(unquote('"')).toBe('"');
  });


  it("should unquote properly for nested quotes", () => {
    expect(unquote('"he said \\"ok\\""')).toBe('he said \\"ok\\"');
  });

  it("should handle spaces inside quotes", () => {
    expect(unquote('"hello world"')).toBe("hello world");
  });

  it("should not strip quotes if they are mismatched", () => {
    expect(unquote('"hello\'')).toBe('"hello\'');
    expect(unquote('\'hello"')).toBe('\'hello"');
  });
});
