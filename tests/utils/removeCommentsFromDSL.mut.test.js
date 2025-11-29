import { describe, it, expect } from "vitest";
import { removeCommentsFromDSL } from "../../src/utils/removeCommentsFromDSL.js";

describe("removeCommentsFromDSL", () => {
  it("should remove full-line comments", () => {
    const input = `// this is a comment
Node "A" {}`;
    const output = removeCommentsFromDSL(input);
    expect(output).not.toContain("// this is a comment");
    expect(output).toContain("\nNode \"A\" {}");
  });

  it("should remove inline comments after code (preserve preceding whitespace)", () => {
    const input = `Node "A" {} // remove this`;
    const output = removeCommentsFromDSL(input);
    expect(output).not.toContain("// remove this");
    expect(output.trim()).toBe(`Node "A" {}`);
  });

  it("should keep double-quoted strings intact (not remove // inside them)", () => {
    const input = `Node "A // not comment" {}; // remove`;
    const output = removeCommentsFromDSL(input);
    expect(output).not.toContain("// remove");
    expect(output).toContain(`"A // not comment"`);
    expect(output).toMatch(/Node\s+"A \/\/ not comment"\s*\{\}/);
  });

  it("should keep single-quoted strings intact", () => {
    const input = `Node 'A // not comment' {}; // remove`;
    const output = removeCommentsFromDSL(input);
    expect(output).not.toContain("// remove");
    expect(output).toContain(`'A // not comment'`);
  });

  it("should keep template strings intact", () => {
    const input = "Node `template // not comment` {}; // remove";
    const output = removeCommentsFromDSL(input);
    expect(output).not.toContain("// remove");
    expect(output).toContain("`template // not comment`");
  });

  it("should handle escaped characters inside strings", () => {
    const input = `Node "A \\" // not comment" {}; // remove`;
    const output = removeCommentsFromDSL(input);
    expect(output).not.toContain("// remove");
    expect(output).toContain(`"A \\\" // not comment"`);
  });

  it("should detect and preserve regex literals", () => {
    const input = `let r = /abc\\/\\/def/; // comment`;
    const output = removeCommentsFromDSL(input);
    expect(output).not.toContain("// comment");
    expect(output).toContain("/abc\\/\\/def/");
  });

  it("should not treat division operator as regex (still removes trailing comments)", () => {
    const input = `let x = a / b; // comment`;
    const output = removeCommentsFromDSL(input);
    expect(output).toContain("let x = a / b;");
  });

  it("should handle multiple lines with mixed comments", () => {
    const input = `
Node "A" {}; // inline
// full
Node "B" {};`;
    const output = removeCommentsFromDSL(input);
    expect(output).not.toContain("// inline");
    expect(output).not.toContain("// full");
    expect(output).toContain('\nNode "A" {}');
    expect(output).toContain('\nNode "B" {}');
  });

  it("should handle file with no comments (return unchanged)", () => {
    const input = `Node "A" {}; Node "B" {};`;
    const output = removeCommentsFromDSL(input);
    expect(output).toBe(input);
  });

  it("should handle empty input", () => {
    expect(removeCommentsFromDSL("")).toBe("");
  });

  it("should handle comment-only lines (preserve newlines)", () => {
    const input = `//////\n//// test\nNode "A" {}`;
    const output = removeCommentsFromDSL(input);
    expect(output).not.toContain("//// test");
    expect(output.split("\n").length).toBeGreaterThanOrEqual(2);
    expect(output).toContain('Node "A" {}');
  });

  it("should preserve nested string comment markers", () => {
    const input = `Node "A /* not comment */ // not comment" {}; // remove`;
    const output = removeCommentsFromDSL(input);
    expect(output).not.toContain("// remove");
    expect(output).toContain("/* not comment */ // not comment");
    expect(output).toMatch(/Node\s+"A \/\* not comment \*\/ \/\/ not comment"\s*\{\}/);
  });

  it("should handle regex with character classes", () => {
    const input = `let r = /test[\\s\\S]*regex/; // comment`;
    const output = removeCommentsFromDSL(input);
    expect(output).not.toContain("// comment");
    expect(output).toContain('/test[\\s\\S]*regex/');
  });

  it("should handle complex regex patterns", () => {
    const input = `let r = /a[b-c]d\\/\\/test/; // comment`;
    const output = removeCommentsFromDSL(input);
    expect(output).not.toContain("// comment");
    expect(output).toContain('/a[b-c]d\\/\\/test/');
  });

  it("should handle division operators correctly", () => {
    const input = `const result = a / b; // division comment`;
    const output = removeCommentsFromDSL(input);
    expect(output).toContain('a / b');
  });

  it("should handle regex at start of file", () => {
    const input = `/^test/ // comment`;
    const output = removeCommentsFromDSL(input);
    expect(output).not.toContain("// comment");
    expect(output).toContain("/^test/");
  });

  it("should handle regex after operators", () => {
    const input = `let a = /test/; // comment`;
    const output = removeCommentsFromDSL(input);
    expect(output).not.toContain("// comment");
    expect(output).toContain("let a = /test/;");
  });

  it("should handle multiple regex patterns", () => {
    const input = `let a=/x/; let b=/y[z]/; // comment`;
    const output = removeCommentsFromDSL(input);
    expect(output).not.toContain("// comment");
    expect(output).toContain("let a=/x/; let b=/y[z]/;");
  });

  it("should not mis-detect // inside regex character classes", () => {
    const input = `let r = /a[//]b/; // comment`;
    const output = removeCommentsFromDSL(input);
    expect(output).toContain("/a[//]b/");
  });

  it("should support escaped slash inside regex", () => {
    const input = `let r = /a\\/b/; // remove`;
    const output = removeCommentsFromDSL(input);
    expect(output).toContain("/a\\/b/");
  });

  it("should ignore comment markers inside template strings", () => {
    const input = "let t = `hello // not comment`; // comment";
    const output = removeCommentsFromDSL(input);
    expect(output).not.toContain("// comment");
    expect(output).toContain("`hello // not comment`");
  });

  it("should correctly handle switching between quoting modes", () => {
    const input = `"/" '//' \`//\` // real comment`;
    const output = removeCommentsFromDSL(input);
    expect(output).not.toContain("// real comment");
    expect(output).toContain(`"/" '//' \`//\``);
  });

  it("should handle regex after parentheses and brackets", () => {
    const input = `if (x) /test/.exec(str); // comment`;
    const output = removeCommentsFromDSL(input);
    expect(output).not.toContain("// comment");
    expect(output).toContain("if (x) /test/.exec(str);");
  });

  it("should handle regex with complex character classes", () => {
    const input = `let r = /[a-z0-9_$]/i; // comment`;
    const output = removeCommentsFromDSL(input);
    expect(output).not.toContain("// comment");
    expect(output).toContain("/[a-z0-9_$]/i");
  });

  it("should handle regex flags correctly", () => {
    const input = `let r = /test/gi; // comment`;
    const output = removeCommentsFromDSL(input);
    expect(output).not.toContain("// comment");
    expect(output).toContain("/test/gi");
  });

  // Mutation Killer Tests
  it("should handle escape sequences at boundary conditions", () => {
    const input = `"test\\\\" // comment`;
    const output = removeCommentsFromDSL(input);
    expect(output).not.toContain("// comment");
    expect(output).toContain('"test\\\\"');
  });

  it("should handle single quotes when in other contexts", () => {
    const input = `"string" 'nested' // comment`;
    const output = removeCommentsFromDSL(input);
    expect(output).not.toContain("// comment");
    expect(output).toContain('"string"');
    expect(output).toContain("'nested'");
  });

  it("should handle double quotes when in single quote context", () => {
    const input = `'string' "nested" // comment`;
    const output = removeCommentsFromDSL(input);
    expect(output).not.toContain("// comment");
    expect(output).toContain("'string'");
    expect(output).toContain('"nested"');
  });

  it("should handle template literals when in other string contexts", () => {
    const input = `"string" \`template\` // comment`;
    const output = removeCommentsFromDSL(input);
    expect(output).not.toContain("// comment");
    expect(output).toContain('"string"');
    expect(output).toContain('`template`');
  });

  it("should handle slash followed by asterisk (not comment start)", () => {
    const input = `let x = a / * b; // comment`;
    const output = removeCommentsFromDSL(input);
    expect(output).toContain("a / * b");
  });

  it("should handle slash at end of file", () => {
    const input = `let x = a /`;
    const output = removeCommentsFromDSL(input);
    expect(output).toBe(input);
  });

  it("should handle multiple consecutive slashes that are not comments", () => {
    const input = `let path = "a//b"; // real comment`;
    const output = removeCommentsFromDSL(input);
    expect(output).not.toContain("// real comment");
    expect(output).toContain('"a//b"');
  });

  it("should handle comment at very end of file without newline", () => {
    const input = `Node "A" {}//comment`;
    const output = removeCommentsFromDSL(input);
    expect(output.trim()).toBe(`Node "A" {}`);
  });

  it("should handle mixed string types with escapes", () => {
    const input = `'s1' "s2" \`s3\` 's4' // comment`;
    const output = removeCommentsFromDSL(input);
    expect(output).not.toContain("// comment");
    expect(output).toContain("'s1'");
    expect(output).toContain('"s2"');
    expect(output).toContain('`s3`');
    expect(output).toContain("'s4'");
  });

  it("should handle regex immediately after string", () => {
    const input = `"str" /regex/ // comment`;
    const output = removeCommentsFromDSL(input);
    expect(output).not.toContain("// comment");
    expect(output).toContain('"str"');
    expect(output).toContain('/regex/');
  });

  it("should handle escape sequences in all string types", () => {
    const input = `'a\\'b' "c\\"d" \`e\\\`f\` // comment`;
    const output = removeCommentsFromDSL(input);
    expect(output).not.toContain("// comment");
    expect(output).toContain("'a\\'b'");
    expect(output).toContain('"c\\"d"');
    expect(output).toContain('`e\\`f`');
  });

  it("should handle nested string-like contexts", () => {
    const input = `"'\\\`" '\`"' "\`'" // comment`;
    const output = removeCommentsFromDSL(input);
    expect(output).not.toContain("// comment");
    expect(output).toContain(`"'\\\`"`);
    expect(output).toContain(`'\`"'`);
    expect(output).toContain(`"\`'"`);
  });

  it("should handle comment at exact end of file boundary", () => {
    const input = "//";
    const output = removeCommentsFromDSL(input);
    expect(output.trim()).toBe("");
  });

  it("should handle escape at end of single quoted string", () => {
    const input = `'test\\'' // comment`;
    const output = removeCommentsFromDSL(input);
    expect(output).not.toContain("// comment");
    expect(output).toContain("'test\\''");
  });

  it("should handle escape at end of double quoted string", () => {
    const input = `"test\\"" // comment`;
    const output = removeCommentsFromDSL(input);
    expect(output).not.toContain("// comment");
    expect(output).toContain('"test\\""');
  });

  it("should handle escape at end of template literal", () => {
    const input = "`test\\`` // comment";
    const output = removeCommentsFromDSL(input);
    expect(output).not.toContain("// comment");
    expect(output).toContain("`test\\``");
  });

  it("should not treat slash-asterisk as regex", () => {
    const input = `a / * b // comment`;
    const output = removeCommentsFromDSL(input);
    expect(output).toContain("a / * b");
  });

  it("should handle isolated slash character", () => {
    const input = `a /`;
    const output = removeCommentsFromDSL(input);
    expect(output).toBe("a /");
  });

  it("should remove comment when i equals code.length", () => {
    const input = "test //";
    const output = removeCommentsFromDSL(input);
    expect(output.trim()).toBe("test");
  });

  it("should handle consecutive escape sequences", () => {
    const input = `"\\\\" // comment`;
    const output = removeCommentsFromDSL(input);
    expect(output).not.toContain("// comment");
    expect(output).toContain('"\\\\"');
  });


  describe("removeCommentsFromDSL - TIMEOUT MUTANT KILLERS", () => {
  it("should kill infinite loop mutant by testing boundary conditions", () => {
    // This kills the i <= code.length mutant
    const input = "test // comment";
    const output = removeCommentsFromDSL(input);
    expect(output).toBe("test \n");
    // If mutant creates infinite loop, test would timeout
  });

  it("should handle very long lines with comments efficiently", () => {
    // Kills performance-related timeout mutants
    const longLine = "x".repeat(10000) + " // comment";
    const output = removeCommentsFromDSL(longLine);
    expect(output).not.toContain("// comment");
    expect(output).toContain("x".repeat(10000));
  });

  it("should kill regex detection mutants with edge cases", () => {
    // Kills complex regex condition mutants
    const input = "a / b / c // comment";
    const output = removeCommentsFromDSL(input);
    expect(output).toContain("a / b / c");
    expect(output).not.toContain("// comment");
  });

  it("should handle escape sequence boundary efficiently", () => {
    // Kills escape sequence infinite loop mutants
    const input = '"test\\\\" // comment';
    const output = removeCommentsFromDSL(input);
    expect(output).toContain('"test\\\\"');
    expect(output).not.toContain("// comment");
  });
});
});