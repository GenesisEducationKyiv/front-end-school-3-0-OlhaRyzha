import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();
const isCI = !!process.env.CI;
const devUrl = process.env.DEV_URL;
const prodUrl = process.env.PROD_URL;

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  retries: isCI ? 2 : 0,
  reporter: 'html',
  webServer: isCI
    ? undefined
    : {
        command: 'npm run dev',
        url: devUrl,
        timeout: 30 * 1000,
        reuseExistingServer: true,
      },

  use: {
    baseURL: isCI ? prodUrl : devUrl,
    trace: 'on-first-retry',
    headless: true,
    screenshot: isCI ? 'only-on-failure' : 'on',
    video: isCI ? 'retain-on-failure' : 'on',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
