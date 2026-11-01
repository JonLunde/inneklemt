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
  test('shows on keyboard focus and hides again', async ({ page }) => {
    await page.goto('/');
    const anchor = page.locator('main details[open] .tooltip-anchor').first();
    const tooltip = anchor.locator('.tooltip-content');
    await expect(tooltip).toBeHidden();
    await anchor.locator('[role="img"]').focus();
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toHaveText('Fridager du får per feriedag du tar ut. Høyere er bedre.');
    await page.locator('h1').click();
    await expect(tooltip).toBeHidden();
  });

  test('badge has an accessible label with the ratio', async ({ page }) => {
    await page.goto('/');
    const badge = page.locator('main details[open] [role="img"]').first();
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
