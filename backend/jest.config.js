module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js', '**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/db/migrate.js',
    '!src/db/seed.js',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  // Timeout für DB/Redis Verbindungen in Tests
  testTimeout: 10000,
  // Umgebungsvariablen für Tests
  setupFiles: ['<rootDir>/src/__tests__/setup.js'],
};
