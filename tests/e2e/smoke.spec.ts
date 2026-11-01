import { FROZEN_YEAR, YEARS, expect, monthCards, test } from './fixtures';

const routes = ['/', ...YEARS.map((y) => `/${y}`)];

for (const route of routes) {
  test(`${route} renders a complete year page`, async ({ page }) => {
    const res = await page.goto(route);
    expect(res?.status()).toBe(200);

    const year = route === '/' ? FROZEN_YEAR : Number(route.slice(1));
    await expect(page.locator('h1')).toHaveText(`Inneklemte dager ${year}`);
    await expect(page).toHaveTitle(new RegExp(`^Inneklemte dager ${year} — \\d+ dager$`));

    // Headline count matches the number of inneklemt rows actually rendered.
    const subtitle = await page.locator('header p').innerText();
    const headline = Number(subtitle.match(/^(\d+) inneklemte dager/)![1]);
    const rows = page.locator('main details span', { hasText: /^inneklemt$/ });
    await expect(rows).toHaveCount(headline);
    expect(headline).toBeGreaterThan(0);

    await expect(monthCards(page).first()).toBeAttached();
    await expect(page.locator('section h2', { hasText: 'Vanlige spørsmål' })).toBeVisible();

    // Structured data stays valid JSON.
    for (const json of await page.locator('script[type="application/ld+json"]').allTextContents()) {
      expect(() => JSON.parse(json)).not.toThrow();
    }

    // Zero client-side JS: the only scripts allowed are Vercel's analytics.
    const scriptSrcs = await page.locator('script[src]').evaluateAll((els) => els.map((e) => e.getAttribute('src')));
    expect(scriptSrcs.filter((s) => !s?.includes('/_vercel/'))).toEqual([]);
  });
}

test('front page shows the current year with the expected count and canonical URL', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Inneklemte dager 2026 — 28 dager');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://inneklemt.no/');
});

test('year pages have their own canonical URL', async ({ page }) => {
  await page.goto('/2027');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://inneklemt.no/2027');
});

test('years outside ±5 are not generated', async ({ request }) => {
  expect((await request.get(`/${FROZEN_YEAR + 6}`)).status()).toBe(404);
  expect((await request.get(`/${FROZEN_YEAR - 6}`)).status()).toBe(404);
});

test('sitemap.xml lists the root and the surrounding years', async ({ request }) => {
  const res = await request.get('/sitemap.xml');
  expect(res.status()).toBe(200);
  const xml = await res.text();
  expect(xml).toContain('<urlset');
  for (const loc of ['https://inneklemt.no/', ...[2025, 2026, 2027, 2028].map((y) => `https://inneklemt.no/${y}`)]) {
    expect(xml).toContain(`<loc>${loc}</loc>`);
  }
});

test('robots.txt, favicons and manifest are served', async ({ page, request }) => {
  expect((await request.get('/robots.txt')).status()).toBe(200);
  await page.goto('/');
  const hrefs = await page.locator('link[rel~="icon"], link[rel="apple-touch-icon"], link[rel="manifest"]').evaluateAll((els) =>
    els.map((e) => e.getAttribute('href')!),
  );
  expect(hrefs.length).toBeGreaterThanOrEqual(4);
  for (const href of hrefs) expect((await request.get(href)).status(), href).toBe(200);
});
