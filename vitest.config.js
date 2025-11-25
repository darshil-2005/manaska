import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,                     // allow describe, it, expect globally
    environment: 'node',               // server-side environment
    include: ['tests/**/*.test.js'],   // test folder pattern
    coverage: {
      provider: 'v8',                  // use @vitest/coverage-v8
      reportsDirectory: './coverage',  // where coverage files go
      reporter: ['text', 'html'],      // text + html reports
      all: true,                       // include untested files
    },
  },
});
