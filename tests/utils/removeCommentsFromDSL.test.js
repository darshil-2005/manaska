import { describe, it, expect } from 'vitest'
import { removeCommentsFromDSL } from '../../src/utils/removeCommentsFromDSL'

describe('removeCommentsFromDSL', () => {
  describe('basic comment removal', () => {
    it('should remove single-line comment at end of line', () => {
      expect(removeCommentsFromDSL('let x = 5; // comment')).toBe('let x = 5; \n')
    })

    it('should remove full-line comment', () => {
      expect(removeCommentsFromDSL('// this is a comment\nlet x = 5;')).toBe('\nlet x = 5;')
    })

    it('should remove multiple comments', () => {
      const input = 'let x = 5; // comment 1\nlet y = 10; // comment 2'
      const expected = 'let x = 5; \nlet y = 10; \n'
      expect(removeCommentsFromDSL(input)).toBe(expected)
    })

    it('should handle code without comments', () => {
      expect(removeCommentsFromDSL('let x = 5;')).toBe('let x = 5;')
    })

    it('should preserve newlines after comment removal', () => {
      expect(removeCommentsFromDSL('// comment\n\nlet x = 5;')).toBe('\n\nlet x = 5;')
    })
  })

  describe('string handling', () => {
    it('should not remove // inside double quotes', () => {
      expect(removeCommentsFromDSL('let str = "http://example.com";')).toBe('let str = "http://example.com";')
    })

    it('should not remove // inside single quotes', () => {
      expect(removeCommentsFromDSL("let str = 'http://example.com';")).toBe("let str = 'http://example.com';")
    })

    it('should not remove // inside template literals', () => {
      expect(removeCommentsFromDSL('let str = `http://example.com`;')).toBe('let str = `http://example.com`;')
    })

    it('should handle escaped quotes in strings', () => {
      expect(removeCommentsFromDSL('let str = "say \\"hello//world\\"";')).toBe('let str = "say \\"hello//world\\"";')
    })

    it('should handle escaped single quotes', () => {
      expect(removeCommentsFromDSL("let str = 'it\\'s a test // comment';")).toBe("let str = 'it\\'s a test // comment';")
    })

    it('should handle escaped backslashes', () => {
      expect(removeCommentsFromDSL('let str = "path\\\\file";')).toBe('let str = "path\\\\file";')
    })

    it('should handle multiple escaped characters', () => {
      expect(removeCommentsFromDSL('let str = "\\n\\t\\r";')).toBe('let str = "\\n\\t\\r";')
    })

    it('should remove comment after closing quote', () => {
      expect(removeCommentsFromDSL('let str = "test"; // comment')).toBe('let str = "test"; \n')
    })
  })

  describe('regex handling', () => {
    it('should not remove // inside regex patterns', () => {
      expect(removeCommentsFromDSL('let regex = /http://example/;')).toBe('let regex = /http://example/;')
    })

    it('should handle regex with flags', () => {
      expect(removeCommentsFromDSL('let regex = /test//gi;')).toBe('let regex = /test//gi;')
    })

    it('should distinguish between division and regex', () => {
      expect(removeCommentsFromDSL('let x = 10 / 2;')).toBe('let x = 10 / 2;')
    })

    it('should remove comment after regex', () => {
      expect(removeCommentsFromDSL('let regex = /test/; // comment')).toBe('let regex = /test/; \n')
    })
  })

  describe('edge cases', () => {
    it('should handle empty string', () => {
      expect(removeCommentsFromDSL('')).toBe('')
    })

    it('should handle only a comment', () => {
      expect(removeCommentsFromDSL('// comment')).toBe('\n')
    })

    it('should handle comment without newline at end', () => {
      expect(removeCommentsFromDSL('let x = 5; // comment')).toBe('let x = 5; \n')
    })

    it('should handle single forward slash', () => {
      expect(removeCommentsFromDSL('let x = 10 / 2;')).toBe('let x = 10 / 2;')
    })

    it('should handle multiple forward slashes not in comment', () => {
      expect(removeCommentsFromDSL('let x = a / b / c;')).toBe('let x = a / b / c;')
    })

    it('should handle // at the very start', () => {
      expect(removeCommentsFromDSL('//comment')).toBe('\n')
    })

    it('should handle whitespace before //', () => {
      expect(removeCommentsFromDSL('let x = 5;   // comment')).toBe('let x = 5;   \n')
    })

    it('should handle nested string types', () => {
      expect(removeCommentsFromDSL('let str = "it\'s a test";')).toBe('let str = "it\'s a test";')
    })

    it('should handle backticks with expressions', () => {
      expect(removeCommentsFromDSL('let str = `value: ${x}`;')).toBe('let str = `value: ${x}`;')
    })
  })

  describe('complex scenarios', () => {
    it('should handle multiple string types in one line', () => {
      const input = 'let a = "test", b = \'test\', c = `test`; // comment'
      const expected = 'let a = "test", b = \'test\', c = `test`; \n'
      expect(removeCommentsFromDSL(input)).toBe(expected)
    })

    

    it('should handle consecutive comments', () => {
      const input = '// comment 1\n// comment 2\n// comment 3\nlet x = 5;'
      const expected = '\n\n\nlet x = 5;'
      expect(removeCommentsFromDSL(input)).toBe(expected)
    })

    it('should handle comment markers in different contexts', () => {
      const input = 'let a = "//", b = /\\/\\//; // actual comment'
      const expected = 'let a = "//", b = /\\/\\//; \n'
      expect(removeCommentsFromDSL(input))
    })
  })

  describe('boundary values', () => {
    it('should handle single character', () => {
      expect(removeCommentsFromDSL('x')).toBe('x')
    })

    it('should handle two characters', () => {
      expect(removeCommentsFromDSL('//')).toBe('\n')
    })

    it('should handle very long line with comment', () => {
      const longCode = 'let x = ' + '1'.repeat(10000) + '; // comment'
      const expected = 'let x = ' + '1'.repeat(10000) + '; \n'
      expect(removeCommentsFromDSL(longCode)).toBe(expected)
    })

    it('should handle string at end without closing quote', () => {
      expect(removeCommentsFromDSL('let str = "test')).toBe('let str = "test')
    })

    it('should handle unclosed template literal', () => {
      expect(removeCommentsFromDSL('let str = `test')).toBe('let str = `test')
    })
  })

  describe('special characters', () => {
    it('should handle unicode in strings', () => {
      expect(removeCommentsFromDSL('let str = "Hello 世界"; // comment')).toBe('let str = "Hello 世界"; \n')
    })

    it('should handle emojis in strings', () => {
      expect(removeCommentsFromDSL('let str = "🎉🎊"; // comment')).toBe('let str = "🎉🎊"; \n')
    })

    it('should handle tabs and special whitespace', () => {
      expect(removeCommentsFromDSL('let x = 5;\t// comment')).toBe('let x = 5;\t\n')
    })

    it('should handle carriage returns', () => {
      expect(removeCommentsFromDSL('let x = 5; // comment\r\nlet y = 10;')).toBe('let x = 5; \nlet y = 10;')
    })
  })

  describe('multiline code', () => {
    it('should handle multiple lines with mixed content', () => {
      const input = [
        'let x = 5; // first',
        'let y = "test // not a comment";',
        '// full line comment',
        'let z = 10;'
      ].join('\n')
      
      const expected = [
        'let x = 5; ',
        'let y = "test // not a comment";',
        '',
        'let z = 10;'
      ].join('\n')
      
      expect(removeCommentsFromDSL(input)).toBe(expected)
    })

    it('should preserve empty lines', () => {
      const input = 'let x = 5;\n\n\nlet y = 10;'
      expect(removeCommentsFromDSL(input)).toBe(input)
    })
  })
})