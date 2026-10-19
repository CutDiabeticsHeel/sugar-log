import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: "./src/tests",
  testMatch: "**/*.spec.js",
  projects: [
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Desktop Firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'Desktop Safari',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  use: {
    baseURL: 'http://localhost:4000', 
  },
  webServer: {
    command: 'npm run client',
    url: 'http://localhost:4000',
    reuseExistingServer: true,
  },
});