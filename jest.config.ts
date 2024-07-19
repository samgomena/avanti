// const nextJest = require("next/jest").default;

// const createJestConfig = nextJest({
//   dir: "./",
// });

// const customJestConfig = {
//   setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
//   moduleNameMapper: {
//     // Handle module aliases (this will be automatically configured for you soon)
//     // "^@/components/(.*)$": "<rootDir>/components/$1",
//     // "^@/pages/(.*)$": "<rootDir>/pages/$1",
//     "^@/(.*)": "<rootDir>/$1",
//   },
//   testEnvironment: "jest-environment-jsdom",
// };

// // createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
// module.exports = createJestConfig(customJestConfig);

import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  // Add more setup options before each test is run
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)": "<rootDir>/$1",
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
