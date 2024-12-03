import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "node:path";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
dotenv.config({ path: path.resolve(__dirname, ".env.test.local") });

export default defineConfig({
  testDir: "./tests",
  testMatch: "tests/**/*.test.ts",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? "github" : "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    // We have to use localhost because nextauth redirects to localhost instead of 127.0.0.1
    // which it then stores all the cookies and stuff against the localhost domain
    baseURL: "http://localhost:3000",
    headless: !!process.env.CI || !!process.env.PLAYWRIGHT_HEADLESS,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },
  projects: [
    // Setup project, namely auth and stuff like that
    {
      name: "setup",
      testMatch: /setup\/global\.setup\.ts/,
      teardown: "teardown",
    },
    { name: "teardown", testMatch: /setup\/global\.teardown\.ts/ },
    {
      name: "auth",
      testMatch: /setup\/auth\.setup\.ts/,
      dependencies: ["setup"],
    },
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "tests/.auth/user.json",
      },
      dependencies: ["auth"],
    },
    // {
    //   name: "firefox",
    //   use: { ...devices["Desktop Firefox"] },
    // dependencies: ['setup']
    // },
    // {
    //   name: "webkit",
    //   use: { ...devices["Desktop Safari"] },
    // dependencies: ['setup']
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],
  webServer: {
    // TODO: Should we be testing against a prod build in CI?
    // If so, we should copy the build over from the build step
    // command: process.env.CI ? "pnpm start" : "pnpm dev",
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
