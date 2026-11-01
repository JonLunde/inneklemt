import { FROZEN_YEAR, YEARS, expect, monthCards, test } from './fixtures';

// Pixel comparison against baselines in tests/e2e/__screenshots__/.
// Baselines are only valid when generated in the Playwright Docker image used by CI.
// Never update them as part of a dependency PR — see README "Tester".

test('front page (current year, May card open)', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('front-page.png', { fullPage: true });
});

test('another year with every card expanded', async ({ page }) => {
  await page.goto(`/${FROZEN_YEAR - 1}`);
  await monthCards(page).evaluateAll((cards) => cards.forEach((c) => c.setAttribute('open', '')));
  await expect(page).toHaveScreenshot('year-all-open.png', { fullPage: true });
});

test('FAQ section', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('section', { hasText: 'Vanlige spørsmål' })).toHaveScreenshot('faq.png');
});

test('year navigation at both boundaries', async ({ page }) => {
  const nav = page.getByRole('navigation', { name: 'Årsnavigasjon' });
  await page.goto(`/${YEARS[0]}`);
  await expect(nav).toHaveScreenshot('nav-first-year.png');
  await page.goto(`/${YEARS[YEARS.length - 1]}`);
  await expect(nav).toHaveScreenshot('nav-last-year.png');
});

test('value badge tooltip', async ({ page }) => {
  await page.goto('/');
  const card = page.locator('main details[open]');
  await card.locator('.tooltip-anchor button').first().click();
  await page.mouse.move(0, 0);
  await expect(card.locator('.tooltip-content').first()).toBeVisible();
  await expect(card).toHaveScreenshot('tooltip.png');
});
