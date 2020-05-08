module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/'],
  coverageReporters: ['lcov'],
  reporters: ['default', 'jest-junit'],
  roots: ['<rootDir>/src'],
  setupFiles: [],
  setupFilesAfterEnv: [],
  snapshotSerializers: [],
  testURL: 'http://localhost',
  verbose: true,
};
