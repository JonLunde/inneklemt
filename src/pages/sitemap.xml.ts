import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  const urls = years
    .map((year) => {
      const diff = Math.abs(year - currentYear);
      const changefreq = year === currentYear ? 'monthly' : 'yearly';
      const priority =
        year === currentYear ? '1.0' : diff === 1 ? '0.8' : '0.6';
      return `  <url>
    <loc>https://inneklemt.no/${year}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
};
