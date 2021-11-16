const { jestConfig } = require('@salesforce/sfdx-lwc-jest/config');

const setupFilesAfterEnv = jestConfig.setupFilesAfterEnv || [];
setupFilesAfterEnv.push('./jest.setup.js');

module.exports = {
  ...jestConfig,
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
  ],
  clearMocks: true,
  testMatch: ['**/__tests__/**/?(*.)+(test).js']
}