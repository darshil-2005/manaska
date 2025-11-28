import { describe, it, expect } from 'vitest'
import { validateEmail, validatePasswordRules } from'../../src/utils/validators';

describe('validateEmail', () => {
  describe('valid email addresses', () => {
    it('should return true for a standard email', () => {
      expect(validateEmail('user@example.com')).toBe(true)
    })

    it('should return true for email with subdomain', () => {
      expect(validateEmail('user@mail.example.com')).toBe(true)
    })

    it('should return true for email with numbers', () => {
      expect(validateEmail('user123@example.com')).toBe(true)
    })

    it('should return true for email with dots in username', () => {
      expect(validateEmail('first.last@example.com')).toBe(true)
    })

    it('should return true for email with hyphens', () => {
      expect(validateEmail('user-name@example-domain.com')).toBe(true)
    })

    it('should return true for email with plus sign', () => {
      expect(validateEmail('user+tag@example.com')).toBe(true)
    })

    it('should return true for email with underscores', () => {
      expect(validateEmail('user_name@example.com')).toBe(true)
    })
  })

  describe('invalid email addresses', () => {
    it('should return false for email without @', () => {
      expect(validateEmail('userexample.com')).toBe(false)
    })

    it('should return false for email without domain', () => {
      expect(validateEmail('user@')).toBe(false)
    })

    it('should return false for email without username', () => {
      expect(validateEmail('@example.com')).toBe(false)
    })

    it('should return false for email without TLD', () => {
      expect(validateEmail('user@example')).toBe(false)
    })

    it('should return false for email with spaces', () => {
      expect(validateEmail('user name@example.com')).toBe(false)
    })

    it('should return false for email with multiple @', () => {
      expect(validateEmail('user@@example.com')).toBe(false)
    })

    it('should return false for empty string', () => {
      expect(validateEmail('')).toBe(false)
    })

    it('should return false for email with only whitespace', () => {
      expect(validateEmail('   ')).toBe(false)
    })

    it('should return false for email starting with @', () => {
      expect(validateEmail('@user.com')).toBe(false)
    })

    it('should return false for email ending with @', () => {
      expect(validateEmail('user@domain@')).toBe(false)
    })
  })

  describe('edge cases', () => {
    it('should return false for null', () => {
      expect(validateEmail(null)).toBe(false)
    })

    it('should return false for undefined', () => {
      expect(validateEmail(undefined)).toBe(false)
    })

    it('should return false for number input', () => {
      expect(validateEmail(123)).toBe(false)
    })

    it('should return false for object input', () => {
      expect(validateEmail({})).toBe(false)
    })

    it('should return false for array input', () => {
      expect(validateEmail([])).toBe(false)
    })
  })
})

describe('validatePasswordRules', () => {
  describe('valid passwords', () => {
    it('should return null for password meeting all requirements', () => {
      expect(validatePasswordRules('Password1!')).toBe(null)
    })

    it('should return null for password with multiple digits and special chars', () => {
      expect(validatePasswordRules('MyP@ssw0rd123!')).toBe(null)
    })

    it('should return null for exactly 8 characters with all requirements', () => {
      expect(validatePasswordRules('Pass123!')).toBe(null)
    })

    it('should return null for long password with all requirements', () => {
      expect(validatePasswordRules('ThisIsAVeryLongPassword123!')).toBe(null)
    })
  })

  describe('length validation', () => {
    it('should return error for empty password', () => {
      expect(validatePasswordRules('')).toBe('Password must be at least 8 characters.')
    })

    it('should return error for password with 7 characters', () => {
      expect(validatePasswordRules('Pass12!')).toBe('Password must be at least 8 characters.')
    })

    it('should return error for password with 1 character', () => {
      expect(validatePasswordRules('P')).toBe('Password must be at least 8 characters.')
    })

    it('should accept password with exactly 8 characters (boundary)', () => {
      const result = validatePasswordRules('Abcdef1!')
      expect(result).not.toBe('Password must be at least 8 characters.')
    })
  })

  describe('digit validation', () => {
    it('should return error for password without digits', () => {
      expect(validatePasswordRules('Password!')).toBe('Password must contain at least one digit.')
    })

    it('should return error for long password without digits', () => {
      expect(validatePasswordRules('VeryLongPassword!')).toBe('Password must contain at least one digit.')
    })

    it('should accept password with digit at start', () => {
      const result = validatePasswordRules('1Password!')
      expect(result).not.toBe('Password must contain at least one digit.')
    })

    it('should accept password with digit at end', () => {
      const result = validatePasswordRules('Password!1')
      expect(result).not.toBe('Password must contain at least one digit.')
    })

    it('should accept password with digit in middle', () => {
      const result = validatePasswordRules('Pass1word!')
      expect(result).not.toBe('Password must contain at least one digit.')
    })
  })

  describe('special character validation', () => {
    it('should return error for password without special characters', () => {
      expect(validatePasswordRules('Password123')).toBe('Password must contain at least one special character.')
    })

    it('should accept password with exclamation mark', () => {
      expect(validatePasswordRules('Password1!')).toBe(null)
    })

    it('should accept password with at symbol', () => {
      expect(validatePasswordRules('Password1@')).toBe(null)
    })

    it('should accept password with hash symbol', () => {
      expect(validatePasswordRules('Password1#')).toBe(null)
    })

    it('should accept password with dollar sign', () => {
      expect(validatePasswordRules('Password1$')).toBe(null)
    })

    it('should accept password with percent', () => {
      expect(validatePasswordRules('Password1%')).toBe(null)
    })

    it('should accept password with caret', () => {
      expect(validatePasswordRules('Password1^')).toBe(null)
    })

    it('should accept password with ampersand', () => {
      expect(validatePasswordRules('Password1&')).toBe(null)
    })

    it('should accept password with asterisk', () => {
      expect(validatePasswordRules('Password1*')).toBe(null)
    })

    it('should accept password with parentheses', () => {
      expect(validatePasswordRules('Password1(')).toBe(null)
    })

    it('should accept password with question mark', () => {
      expect(validatePasswordRules('Password1?')).toBe(null)
    })

    it('should accept password with comma', () => {
      expect(validatePasswordRules('Password1,')).toBe(null)
    })

    it('should accept password with colon', () => {
      expect(validatePasswordRules('Password1:')).toBe(null)
    })
  })

  describe('combined validation errors', () => {
    it('should return length error first when length is too short', () => {
      expect(validatePasswordRules('Pass1')).toBe('Password must be at least 8 characters.')
    })

    it('should return digit error when length is ok but no digit', () => {
      expect(validatePasswordRules('Password!')).toBe('Password must contain at least one digit.')
    })

    it('should return special char error when length and digit are ok', () => {
      expect(validatePasswordRules('Password123')).toBe('Password must contain at least one special character.')
    })
  })

  describe('edge cases', () => {
    it('should handle password with only special characters and digits', () => {
      expect(validatePasswordRules('!@#$1234')).toBe(null)
    })

    it('should handle password with unicode characters', () => {
      expect(validatePasswordRules('Pässwörd1!')).toBe(null)
    })

    it('should handle password with spaces (8+ chars, digit, special)', () => {
      expect(validatePasswordRules('Pass word1!')).toBe(null)
    })

    it('should handle password with only numbers and special chars (8+ chars)', () => {
      expect(validatePasswordRules('12345678!')).toBe(null)
    })
  })
})