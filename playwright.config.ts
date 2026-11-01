import { defineConfig, devices } from '@playwright/test';

const PORT = 4321;

export default defineConfig({
  testDir: 'tests/e2e',
  snapshotPathTemplate: '{testDir}/__screenshots__/{projectName}/{testFilePath}/{arg}{ext}',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  expect: {
    // Baselines are generated in the official Playwright Docker image (see .github/workflows).
    // Rendering in the same image is deterministic, so the tolerance is near zero: a handful of
    // pixels for anti-aliasing, and a strict per-pixel colour threshold so that even a thin
    // coloured border changing shade fails the test.
    toHaveScreenshot: { maxDiffPixels: 10, threshold: 0.05, animations: 'disabled', caret: 'hide' },
  },
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    locale: 'nb-NO',
    timezoneId: 'Europe/Oslo',
    // Local runs without the bundled browser can use system Chrome: PW_CHANNEL=chrome
    ...(process.env.PW_CHANNEL ? { channel: process.env.PW_CHANNEL } : {}),
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    // build:e2e builds with a frozen clock (tests/e2e/freeze-time.mjs).
    command: `npm run build:e2e && npx astro preview --host 127.0.0.1 --port ${PORT}`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
