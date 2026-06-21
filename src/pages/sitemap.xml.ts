import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 4 }, (_, i) => currentYear - 1 + i);
  const buildDate = new Date().toISOString().slice(0, 10);

  const root = `  <url>
    <loc>https://inneklemt.no/</loc>
    <changefreq>monthly</changefreq>
    <lastmod>${buildDate}</lastmod>
  </url>`;

  const urls = years
    .map((year) => {
      const changefreq = year === currentYear ? 'monthly' : 'yearly';
      return `  <url>
    <loc>https://inneklemt.no/${year}</loc>
    <changefreq>${changefreq}</changefreq>
    <lastmod>${buildDate}</lastmod>
  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${root}
${urls}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
};
