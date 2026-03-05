import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: "./",
});

const customJestConfig: Config = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  testEnvironment: "jest-environment-jsdom",

  moduleDirectories: ["node_modules", "<rootDir>/"],

  clearMocks: true,

  coverageProvider: "v8",

  testEnvironmentOptions: {
    url: "http://localhost:3000",
  },

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },

  testMatch: [
    "<rootDir>/**/*.test.{ts,tsx}",
    "<rootDir>/tests/**/*.test.{ts,tsx}",
  ],

  collectCoverageFrom: [
    "lib/**/*.{ts,tsx}",
    "hooks/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",

    "!**/node_modules/**",
    "!**/.next/**",
    "!**/tests/**",
  ],

  coverageThreshold: {
    global: {
      branches: 30,
      functions: 30,
      lines: 30,
      statements: 30,
    },
  },

  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/.next/",
  ],

  transformIgnorePatterns: [
    "/node_modules/(?!(uuid))/",
  ],
};

export default createJestConfig(customJestConfig);