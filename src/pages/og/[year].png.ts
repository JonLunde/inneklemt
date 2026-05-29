import type { APIRoute } from 'astro';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'fs';
import { join } from 'path';
// @ts-ignore
import holidaysNorwayModule from 'holidays-norway';
const holidaysNorway = (holidaysNorwayModule as any).default ?? holidaysNorwayModule;
import findSqueezeDays from '../../utils/findSqueezeDays';

export function getStaticPaths() {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
  return years.map((year) => ({ params: { year: String(year) } }));
}

export const GET: APIRoute = async ({ params }) => {
  const year = Number(params.year);
  const holidays = holidaysNorway(year);
  const groups = findSqueezeDays(holidays, 4);

  const inneklemtCount = groups.reduce(
    (acc, group) => acc + group.filter((d) => d.description === 'inneklemt').length,
    0
  );

  const fontData = readFileSync(
    join(process.cwd(), 'src/assets/fonts/Inter.ttf')
  );
  const fontDataBold = readFileSync(
    join(process.cwd(), 'src/assets/fonts/Inter-Bold.ttf')
  );

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          backgroundColor: '#F8F9FA',
          padding: '80px',
          fontFamily: 'Inter',
        },
        children: [
          {
            type: 'p',
            props: {
              style: { fontSize: '28px', color: '#6B7280', margin: '0 0 20px 0' },
              children: 'inneklemt.no',
            },
          },
          {
            type: 'h1',
            props: {
              style: {
                fontSize: '72px',
                fontWeight: '700',
                color: '#113E74',
                margin: '0 0 32px 0',
                lineHeight: '1.1',
              },
              children: `Inneklemte dager ${year}`,
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#FFD340',
                borderRadius: '12px',
                padding: '14px 28px',
              },
              children: {
                type: 'span',
                props: {
                  style: { fontSize: '36px', fontWeight: '700', color: '#111827' },
                  children: `${inneklemtCount} inneklemte dager`,
                },
              },
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: fontData,
          weight: 400,
          style: 'normal',
        },
        {
          name: 'Inter',
          data: fontDataBold,
          weight: 700,
          style: 'normal',
        },
      ],
    }
  );

  const resvg = new Resvg(svg);
  const png = resvg.render().asPng();

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
