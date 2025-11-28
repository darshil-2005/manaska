import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,            // allows using describe, it, expect without importing them
    environment: 'node',      // server-side environment
    include: ['tests/**/*.test.js'], // folder where tests are located
  coverage: {
    provider: 'v8',
    reporter: ['text', 'html'],
  },
  },
});
