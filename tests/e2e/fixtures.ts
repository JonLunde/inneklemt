import { test as base, expect } from '@playwright/test';

/** Years the frozen build (2026-05-10) generates: currentYear ±5. */
export const FROZEN_YEAR = 2026;
export const YEARS = Array.from({ length: 11 }, (_, i) => FROZEN_YEAR - 5 + i);

/**
 * Every test fails if the page logs a console error, throws, or gets a 4xx/5xx on any request.
 * Vercel Analytics/Speed Insights only exist on Vercel, so their requests are stubbed out.
 */
export const test = base.extend<{ pageErrors: string[] }>({
  pageErrors: [
    async ({ page }, use) => {
      const errors: string[] = [];
      await page.route('**/_vercel/**', (route) => route.fulfill({ status: 200, contentType: 'text/javascript', body: '' }));
      page.on('console', (msg) => msg.type() === 'error' && errors.push(`console: ${msg.text()}`));
      page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
      page.on('response', (res) => {
        if (res.status() >= 400 && !res.url().includes('/_vercel/')) errors.push(`${res.status()} ${res.url()}`);
      });
      await use(errors);
      expect(errors, 'console errors / failed requests').toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };

/** The month cards on a year page. */
export const monthCards = (page: import('@playwright/test').Page) => page.locator('main details');
