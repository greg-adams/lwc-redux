const { jestConfig } = require('@salesforce/sfdx-lwc-jest/config');

module.exports = {
  ...jestConfig,
  "preset": "@lwc/jest-preset",
  "moduleNameMapper": {
    "^(c)/(.+)$": "<rootDir>/force-app/main/default/lwc/$2/$2"
  },
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
  ],
  clearMocks: true
}