import { describe, it, expect } from "vitest";
import { validateEmail, validatePasswordRules } from "../../src/utils/validators.js";

describe("validateEmail - MUTATION TESTING", () => {
  // ========================
  // VALID EMAILS (MUTANT KILLERS)
  // ========================
  describe("valid email patterns", () => {
    it("should return true for standard email patterns", () => {
      expect(validateEmail("user@example.com")).toBe(true);
      expect(validateEmail("user123@example.com")).toBe(true);
      expect(validateEmail("first.last@example.com")).toBe(true);
      expect(validateEmail("user-name@example-domain.com")).toBe(true);
      expect(validateEmail("user+tag@example.com")).toBe(true);
      expect(validateEmail("user_name@example.com")).toBe(true);
      expect(validateEmail("user@mail.example.com")).toBe(true);
    });

    it("should return true for minimal valid emails", () => {
      expect(validateEmail("a@b.io")).toBe(true);
      expect(validateEmail("test@domain.co")).toBe(true);
      expect(validateEmail("user.name+tag@domain.co")).toBe(true);
    });
  });

  // ========================
  // INVALID EMAILS (MUTANT KILLERS)
  // ========================
  describe("invalid email patterns", () => {
    it("should return false for emails missing required parts", () => {
      expect(validateEmail("userexample.com")).toBe(false); // missing @
      expect(validateEmail("user@")).toBe(false); // missing domain
      expect(validateEmail("@example.com")).toBe(false); // missing username
      expect(validateEmail("user@example")).toBe(false); // missing TLD
    });

    it("should return false for emails with invalid characters or structure", () => {
      expect(validateEmail("user name@example.com")).toBe(false); // space in username
      expect(validateEmail("user@@example.com")).toBe(false); // multiple @
      expect(validateEmail("@user.com")).toBe(false); // starts with @
      expect(validateEmail("user@domain@")).toBe(false); // ends with @
      expect(validateEmail("test@exa mple.com")).toBe(false); // space in domain
    });

    it("should return false for empty and whitespace-only inputs", () => {
      expect(validateEmail("")).toBe(false);
      expect(validateEmail("   ")).toBe(false);
    });
  });

  // ========================
  // TYPE VALIDATION (MUTANT KILLERS)
  // ========================
  describe("type validation", () => {
    it("should return false for non-string inputs", () => {
      // KILLS: typeof check mutants
      expect(validateEmail(null)).toBe(false);
      expect(validateEmail(undefined)).toBe(false);
      expect(validateEmail(123)).toBe(false);
      expect(validateEmail(0)).toBe(false);
      expect(validateEmail(true)).toBe(false);
      expect(validateEmail(false)).toBe(false);
      expect(validateEmail({})).toBe(false);
      expect(validateEmail([])).toBe(false);
      expect(validateEmail(NaN)).toBe(false);
    });
  });

  // ========================
  // REGEX EDGE CASES (MUTANT KILLERS)
  // ========================
  describe("regex edge cases", () => {
    it("should handle emails with consecutive dots", () => {
      expect(validateEmail("user..name@example.com")).toBe(true);
    });

    it("should handle emails with numeric TLDs", () => {
      expect(validateEmail("user@example.123")).toBe(true);
    });

    it("should handle emails with long TLDs", () => {
      expect(validateEmail("user@example.toolongtld")).toBe(true);
    });
  });
});

describe("validatePasswordRules - MUTATION TESTING", () => {
  // ========================
  // VALID PASSWORDS (MUTANT KILLERS)
  // ========================
  describe("valid password patterns", () => {
    it("should return null for passwords meeting all requirements", () => {
      expect(validatePasswordRules("Password1!")).toBe(null);
      expect(validatePasswordRules("MyP@ssw0rd123!")).toBe(null);
      expect(validatePasswordRules("Pass123!")).toBe(null);
      expect(validatePasswordRules("ThisIsAVeryLongPassword123!")).toBe(null);
    });

    it("should handle passwords with unicode and spaces", () => {
      expect(validatePasswordRules("Pässwörd1!")).toBe(null);
      expect(validatePasswordRules("Pass word1!")).toBe(null);
    });

    it("should handle minimal valid passwords", () => {
      expect(validatePasswordRules("Abcdef1!")).toBe(null); // exactly 8 chars
      expect(validatePasswordRules("!@#$1234")).toBe(null); // only special chars and digits
      expect(validatePasswordRules("12345678!")).toBe(null); // only numbers and special chars
    });
  });

  // ========================
  // LENGTH VALIDATION (MUTANT KILLERS)
  // ========================
  describe("length validation", () => {
    it("should return error for passwords shorter than 8 characters", () => {
      // KILLS: length check mutants
      expect(validatePasswordRules("")).toBe("Password must be at least 8 characters.");
      expect(validatePasswordRules("P")).toBe("Password must be at least 8 characters.");
      expect(validatePasswordRules("Pass12!")).toBe("Password must be at least 8 characters."); // 7 chars
      expect(validatePasswordRules("1234567")).toBe("Password must be at least 8 characters."); // 7 chars
    });

    it("should accept passwords with exactly 8 characters", () => {
      // Tests boundary condition
      expect(validatePasswordRules("Abcdef1!")).not.toBe("Password must be at least 8 characters.");
    });

    it("should handle whitespace-only passwords", () => {
      expect(validatePasswordRules("       ")).toBe("Password must be at least 8 characters."); // 7 spaces
      expect(validatePasswordRules("        ")).toBe("Password must contain at least one digit."); // 8 spaces
    });
  });

  // ========================
  // DIGIT VALIDATION (MUTANT KILLERS)
  // ========================
  describe("digit validation", () => {
    it("should return error for passwords without digits", () => {
      // KILLS: digit regex mutants
      expect(validatePasswordRules("Password!")).toBe("Password must contain at least one digit.");
      expect(validatePasswordRules("VeryLongPassword!")).toBe("Password must contain at least one digit.");
      expect(validatePasswordRules("abcdefgh")).toBe("Password must contain at least one digit.");
    });

    it("should accept passwords with digits in any position", () => {
      expect(validatePasswordRules("1Password!")).not.toBe("Password must contain at least one digit."); // start
      expect(validatePasswordRules("Password!1")).not.toBe("Password must contain at least one digit."); // end
      expect(validatePasswordRules("Pass1word!")).not.toBe("Password must contain at least one digit."); // middle
    });

    it("should handle multiple digits", () => {
      expect(validatePasswordRules("Pass123!")).not.toBe("Password must contain at least one digit.");
      expect(validatePasswordRules("12345678!")).not.toBe("Password must contain at least one digit.");
    });
  });

  // ========================
  // SPECIAL CHARACTER VALIDATION (MUTANT KILLERS)
  // ========================
  describe("special character validation", () => {
    it("should return error for passwords without special characters", () => {
      // KILLS: special char regex mutants
      expect(validatePasswordRules("Password123")).toBe("Password must contain at least one special character.");
      expect(validatePasswordRules("abcdefgh1")).toBe("Password must contain at least one special character.");
      expect(validatePasswordRules("12345678")).toBe("Password must contain at least one special character.");
    });

    it("should accept all allowed special characters individually", () => {
      const specials = "!@#$%^&*(),.?\":{}|<>";
      for (const char of specials) {
        expect(validatePasswordRules("pass1234" + char)).toBe(null);
      }
    });

    it("should accept passwords with multiple special characters", () => {
      expect(validatePasswordRules("Pass123!@#")).toBe(null);
      expect(validatePasswordRules("MyPass123$%^")).toBe(null);
    });
  });

  // ========================
  // VALIDATION ORDER (MUTANT KILLERS)
  // ========================
  describe("validation order", () => {
    it("should return length error first when multiple rules fail", () => {
      // KILLS: conditional order mutants
      expect(validatePasswordRules("Pass1")).toBe("Password must be at least 8 characters."); // short, no special
      expect(validatePasswordRules("Short1")).toBe("Password must be at least 8 characters."); // short, has digit
    });

    it("should return digit error when length is ok but no digit", () => {
      expect(validatePasswordRules("Password!")).toBe("Password must contain at least one digit."); // 8+ chars, no digit
      expect(validatePasswordRules("VeryLongPass!")).toBe("Password must contain at least one digit."); // long, no digit
    });

    it("should return special char error when length and digit are ok", () => {
      expect(validatePasswordRules("Password123")).toBe("Password must contain at least one special character."); // 8+ chars, has digit
      expect(validatePasswordRules("VeryLongPassword123")).toBe("Password must contain at least one special character."); // long, has digit
    });
  });

  // ========================
  // BOUNDARY VALUE TESTING (MUTANT KILLERS)
  // ========================
  describe("boundary value testing", () => {
    it("should test exact boundary for length validation", () => {
      // 7 characters (invalid)
      expect(validatePasswordRules("1234567")).toBe("Password must be at least 8 characters.");
      expect(validatePasswordRules("Abcdef1")).toBe("Password must be at least 8 characters.");
      
      // 8 characters (valid if other rules met)
      expect(validatePasswordRules("Abcdef1!")).toBe(null);
      expect(validatePasswordRules("1234567!")).toBe(null);
    });

    it("should test minimal valid combinations", () => {
      // Minimal valid: 8 chars, 1 digit, 1 special
      expect(validatePasswordRules("A1!bcdef")).toBe(null);
      expect(validatePasswordRules("1!abcdef")).toBe(null);
      expect(validatePasswordRules("abcdef1!")).toBe(null);
    });

    it("should test each validation rule independently", () => {
      // Only fails length
      expect(validatePasswordRules("Ab1!")).toBe("Password must be at least 8 characters.");
      
      // Only fails digit (8+ chars, has special)
      expect(validatePasswordRules("abcdefg!")).toBe("Password must contain at least one digit.");
      
      // Only fails special (8+ chars, has digit)
      expect(validatePasswordRules("abcdefg1")).toBe("Password must contain at least one special character.");
    });
  });

  // ========================
  // EDGE CASE EXTERMINATION
  // ========================
  describe("edge case extermination", () => {
    it("should handle passwords with only special characters meeting requirements", () => {
      expect(validatePasswordRules("!@#$%^&*1")).toBe(null); // 9 chars, has digit, has special
    });

    it("should handle passwords with only digits meeting requirements", () => {
      expect(validatePasswordRules("12345678!")).toBe(null); // 9 chars, has digit, has special
    });

    it("should handle very long passwords", () => {
      const longPassword = "A".repeat(1000) + "1" + "!";
      expect(validatePasswordRules(longPassword)).toBe(null);
    });

    it("should handle passwords with newlines and tabs", () => {
      expect(validatePasswordRules("Pass123!\n")).toBe(null);
      expect(validatePasswordRules("Pass123!\t")).toBe(null);
    });
  });
});