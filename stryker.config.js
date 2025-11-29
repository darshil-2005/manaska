// stryker.config.js
export default {
  testRunner: 'vitest',
  coverageAnalysis: 'perTest',
  mutate: [
    'src/utils/*.js',
    '!src/utils/*.test.js',
    '!src/utils/*.spec.js'
  ],
  vitest: {
    configFile: 'vitest.config.js'
  },
  timeoutMS: 30000,
  concurrency: 2,
  reporters: ['html', 'clear-text', 'progress'],
  tempDirName: '.stryker-tmp'
}