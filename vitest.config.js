import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.js'],
    coverage: {
      provider: 'v8', // 👈 CHANGE THIS from 'c8' to 'v8'
      reporter: ['text', 'html'],
    },
  },
});