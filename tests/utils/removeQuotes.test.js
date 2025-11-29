import { describe, it, expect } from 'vitest'
import { unquote } from '../../src/utils/removeQuotes'

describe('unquote', () => {
  describe('basic functionality', () => {
    it('should remove double quotes from a quoted string', () => {
      expect(unquote('"hello"')).toBe('hello')
    })

    it('should remove quotes from a single character string', () => {
      expect(unquote('"a"')).toBe('a')
    })

    it('should handle empty quoted string', () => {
      expect(unquote('""')).toBe('')
    })

    it('should return unquoted string as-is', () => {
      expect(unquote('hello')).toBe('hello')
    })
  })

  describe('edge cases', () => {
    it('should only remove quotes if both start and end with quotes', () => {
      expect(unquote('"hello')).toBe('"hello')
      expect(unquote('hello"')).toBe('hello"')
    })

    it('should handle strings with quotes in the middle', () => {
      expect(unquote('"hello"world"')).toBe('hello"world')
    })

    it('should handle strings with multiple internal quotes', () => {
      expect(unquote('"say "hello" to "world""')).toBe('say "hello" to "world"')
    })

    it('should handle nested quotes', () => {
      expect(unquote('"""')).toBe('"')
      expect(unquote('""""')).toBe('""')
    })

    it('should handle strings with only opening quote', () => {
      expect(unquote('"')).toBe('"')
    })

    it('should handle strings with whitespace', () => {
      expect(unquote('" hello "')).toBe(' hello ')
      expect(unquote('"  "')).toBe('  ')
    })

    it('should handle strings with special characters', () => {
      expect(unquote('"hello\nworld"')).toBe('hello\nworld')
      expect(unquote('"hello\tworld"')).toBe('hello\tworld')
      expect(unquote('"hello\\world"')).toBe('hello\\world')
    })

    it('should handle unicode characters', () => {
      expect(unquote('"Hello 世界"')).toBe('Hello 世界')
      expect(unquote('"🎉"')).toBe('🎉')
    })
  })

  describe('boundary values', () => {
    it('should handle empty string', () => {
      expect(unquote('')).toBe('')
    })

    it('should handle single character string', () => {
      expect(unquote('a')).toBe('a')
    })

    it('should handle two character non-quoted string', () => {
      expect(unquote('ab')).toBe('ab')
    })

    it('should handle very long quoted strings', () => {
      const longString = 'a'.repeat(10000)
      expect(unquote(`"${longString}"`)).toBe(longString)
    })
  })

  describe('invalid inputs', () => {
    it('should return non-string inputs as-is', () => {
      expect(unquote(null)).toBe(null)
      expect(unquote(undefined)).toBe(undefined)
      expect(unquote(123)).toBe(123)
      expect(unquote(true)).toBe(true)
      expect(unquote(false)).toBe(false)
    })

    it('should handle object inputs', () => {
      const obj = { key: 'value' }
      expect(unquote(obj)).toBe(obj)
    })

    it('should handle array inputs', () => {
      const arr = [1, 2, 3]
      expect(unquote(arr)).toBe(arr)
    })

    it('should handle NaN', () => {
      expect(unquote(NaN)).toBe(NaN)
    })

    it('should handle zero', () => {
      expect(unquote(0)).toBe(0)
    })
  })

  describe('single quotes (should not be removed)', () => {
    it('should not remove single quotes', () => {
      expect(unquote("'hello'")).toBe("'hello'")
    })

    it('should not remove mixed quotes', () => {
      expect(unquote("'hello\"")).toBe("'hello\"")
      expect(unquote("\"hello'")).toBe("\"hello'")
    })
  })
})