import { FROZEN_YEAR, YEARS, expect, monthCards, test } from './fixtures';

test.describe('month cards', () => {
  test('current year opens the first card from the current month (May 2026)', async ({ page }) => {
    await page.goto('/');
    const open = page.locator('main details[open]');
    await expect(open).toHaveCount(1);
    await expect(open.locator('summary')).toContainText('mai');
  });

  test('other years start with every card closed', async ({ page }) => {
    await page.goto('/2025');
    await expect(page.locator('main details[open]')).toHaveCount(0);
  });

  test('clicking a card toggles it open and closed', async ({ page }) => {
    await page.goto('/2025');
    const card = monthCards(page).first();
    const firstRow = card.locator('span', { hasText: /^inneklemt$/ }).first();
    await expect(firstRow).toBeHidden();
    await card.locator('summary').click();
    await expect(card).toHaveAttribute('open', '');
    await expect(firstRow).toBeVisible();
    await card.locator('summary').click();
    await expect(firstRow).toBeHidden();
  });
});

test.describe('year navigation', () => {
  test('prev/next links go to the neighbouring years', async ({ page }) => {
    await page.goto(`/${FROZEN_YEAR}`);
    const nav = page.getByRole('navigation', { name: 'Årsnavigasjon' });
    await nav.getByRole('link', { name: `Se inneklemte dager i ${FROZEN_YEAR + 1}` }).click();
    await expect(page).toHaveURL(new RegExp(`/${FROZEN_YEAR + 1}/?$`));
    await expect(page.locator('h1')).toHaveText(`Inneklemte dager ${FROZEN_YEAR + 1}`);
    await nav.getByRole('link', { name: `Se inneklemte dager i ${FROZEN_YEAR}` }).click();
    await expect(page.locator('h1')).toHaveText(`Inneklemte dager ${FROZEN_YEAR}`);
  });

  test('first year has no previous link, last year has no next link', async ({ page }) => {
    const first = YEARS[0];
    const last = YEARS[YEARS.length - 1];
    const nav = page.getByRole('navigation', { name: 'Årsnavigasjon' });

    await page.goto(`/${first}`);
    await expect(nav.getByRole('link')).toHaveCount(1);
    await expect(nav.getByRole('link')).toHaveAttribute('href', `/${first + 1}`);

    await page.goto(`/${last}`);
    await expect(nav.getByRole('link')).toHaveCount(1);
    await expect(nav.getByRole('link')).toHaveAttribute('href', `/${last - 1}`);
  });
});

test.describe('value badge tooltip', () => {
  const firstAnchor = (page: import('@playwright/test').Page) => page.locator('main details[open] .tooltip-anchor').first();

  test('keyboard: Enter opens it, Escape closes it', async ({ page }) => {
    await page.goto('/');
    const anchor = firstAnchor(page);
    const tooltip = anchor.locator('.tooltip-content');
    await expect(tooltip).toBeHidden();
    await anchor.locator('button').focus();
    await page.keyboard.press('Enter');
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toHaveText('Fridager du får per feriedag du tar ut. Høyere er bedre.');
    await page.keyboard.press('Escape');
    await page.locator('h1').click();
    await expect(tooltip).toBeHidden();
  });

  test('tap/click opens it; tapping/clicking outside closes it', async ({ page }, testInfo) => {
    await page.goto('/');
    const anchor = firstAnchor(page);
    const badge = anchor.locator('button');
    const tooltip = anchor.locator('.tooltip-content');
    const isMobile = testInfo.project.name === 'mobile';
    const press = (l: import('@playwright/test').Locator) => (isMobile ? l.tap() : l.click());

    await press(badge);
    await expect(tooltip).toBeVisible();

    // Plain, non-interactive text outside the badge.
    await press(page.locator('section dl dd').first());
    await expect(tooltip).toBeHidden();
  });

  test('tapping the badge again closes it', async ({ page }, testInfo) => {
    await page.goto('/');
    const anchor = firstAnchor(page);
    const badge = anchor.locator('button');
    const tooltip = anchor.locator('.tooltip-content');
    const press = () => (testInfo.project.name === 'mobile' ? badge.tap() : badge.click());
    await press();
    await expect(tooltip).toBeVisible();
    await page.mouse.move(0, 0); // leave hover on desktop
    await press();
    await page.mouse.move(0, 0);
    await expect(tooltip).toBeHidden();
  });

  test('desktop: shows on hover and hides when the pointer leaves', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'hover only applies to real pointers');
    await page.goto('/');
    const anchor = firstAnchor(page);
    const tooltip = anchor.locator('.tooltip-content');
    await anchor.locator('button').hover();
    await expect(tooltip).toBeVisible();
    await page.locator('h1').hover();
    await expect(tooltip).toBeHidden();
  });

  test('touch: hover never opens it (no sticky hover)', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'touch only');
    await page.goto('/');
    expect(await page.evaluate(() => matchMedia('(hover: hover)').matches)).toBe(false);
  });

  test('each tooltip has a unique id and is wired to its badge', async ({ page }) => {
    await page.goto('/2025');
    const ids = await page.locator('.tooltip-content').evaluateAll((els) => els.map((e) => e.id));
    expect(ids.length).toBeGreaterThan(0);
    expect(new Set(ids).size).toBe(ids.length);
    const targets = await page.locator('.tooltip-trigger').evaluateAll((els) => els.map((e) => e.getAttribute('popovertarget')));
    expect(targets).toEqual(ids);
  });

  test('badge has an accessible label with the ratio', async ({ page }) => {
    await page.goto('/');
    const badge = firstAnchor(page).locator('button');
    await expect(badge).toHaveAttribute('aria-label', /^\d+\.\d fridager per feriedag\./);
  });
});

test('FAQ lists the three questions', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('section dl dt')).toHaveText([
    'Hva er en inneklemt dag?',
    'Hva er formålet med denne siden?',
    /Hva betyr .*-indikatoren\?/,
  ]);
});
