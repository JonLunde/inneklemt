import type { APIRoute } from 'astro';
// @ts-ignore
import holidaysNorwayModule from 'holidays-norway';
const holidaysNorway = (holidaysNorwayModule as any).default ?? holidaysNorwayModule;
import findSqueezeDays from '../utils/findSqueezeDays';

export function getStaticPaths() {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
  return years.map((year) => ({ params: { year: String(year) } }));
}

export const GET: APIRoute = ({ params }) => {
  const year = Number(params.year);
  const holidays = holidaysNorway(year);
  const groups = findSqueezeDays(holidays, 4);

  const inneklemtDays = groups.flatMap((group) =>
    group.filter((d) => d.description === 'inneklemt')
  );

  const uid = (date: string) => `${date}-inneklemt@inneklemt.no`;

  const events = inneklemtDays.map((day) => {
    const date = day.day.format('YYYYMMDD');
    return [
      'BEGIN:VEVENT',
      `UID:${uid(date)}`,
      `DTSTART;VALUE=DATE:${date}`,
      `DTEND;VALUE=DATE:${date}`,
      'SUMMARY:Inneklemt dag',
      'DESCRIPTION:Inneklemt dag – bruk feriedag her for å få mest mulig fri.',
      'END:VEVENT',
    ].join('\r\n');
  });

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//inneklemt.no//NO',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:Inneklemte dager ${year}`,
    'X-WR-TIMEZONE:Europe/Oslo',
    ...events,
    'END:VCALENDAR',
  ].join('\r\n');

  return new Response(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="inneklemte-dager-${year}.ics"`,
    },
  });
};
