import { describe, expect, it } from 'vitest';
import findSqueezeDays from '../../src/utils/findSqueezeDays';
import {
  holidaysNorway,
  inneklemtDates,
  monthGroupsFor,
  serializeGroup,
  squeezeGroupsFor,
} from './helpers';

const GOLDEN_YEARS = Array.from({ length: 15 }, (_, i) => 2021 + i); // 2021–2035

describe('golden output (locks today’s behaviour, incl. known //! limitations)', () => {
  // Any change here — from our code OR from a dependency update (holidays-norway, dayjs) —
  // must be reviewed deliberately and the golden file regenerated with `npm test -- -u`.
  it('holiday data from holidays-norway is unchanged', async () => {
    const data = Object.fromEntries(
      GOLDEN_YEARS.map((y) => [y, holidaysNorway(y).map((h: any) => `${h.date} ${h.name}`)]),
    );
    await expect(JSON.stringify(data, null, 2)).toMatchFileSnapshot('__golden__/holidays.json');
  });

  it('squeeze-day groups for every year are unchanged', async () => {
    const data = Object.fromEntries(GOLDEN_YEARS.map((y) => [y, squeezeGroupsFor(y).map(serializeGroup)]));
    await expect(JSON.stringify(data, null, 2)).toMatchFileSnapshot('__golden__/squeeze-days.json');
  });

  it('month grouping for every year is unchanged', async () => {
    const data = Object.fromEntries(
      GOLDEN_YEARS.map((y) => [
        y,
        monthGroupsFor(y).map((m) => ({ monthKey: m.monthKey, monthName: m.monthName, groups: m.groups.map(serializeGroup) })),
      ]),
    );
    await expect(JSON.stringify(data, null, 2)).toMatchFileSnapshot('__golden__/month-groups.json');
  });
});

describe('hand-verified cases, 2026', () => {
  const dates = inneklemtDates(2026);

  it('Friday after Nyttårsdag (Thu 1 Jan) is inneklemt', () => {
    expect(dates).toContain('2026-01-02');
  });

  it('Easter: Mon–Wed before Skjærtorsdag and Tue–Fri after 2. påskedag', () => {
    expect(dates).toEqual(expect.arrayContaining(['2026-03-30', '2026-03-31', '2026-04-01']));
    expect(dates).toEqual(expect.arrayContaining(['2026-04-07', '2026-04-08', '2026-04-09', '2026-04-10']));
  });

  it('Kristi himmelfartsdag (Thu 14 May): Friday after is inneklemt, holiday name is corrected', () => {
    expect(dates).toContain('2026-05-15');
    const group = squeezeGroupsFor(2026).find((g) => g.some((d) => d.day.format('YYYY-MM-DD') === '2026-05-15'))!;
    expect(group.map((d) => d.description)).toEqual(['Kristi himmelfartsdag', 'inneklemt', 'helg', '17. mai']);
  });

  it('17. mai on a Sunday produces no extra squeeze days', () => {
    expect(dates.filter((d) => d >= '2026-05-16' && d <= '2026-05-22')).toEqual([]);
  });

  it('romjul: 28–31 Dec are inneklemt; Nyttårsaften is never a holiday label', () => {
    expect(dates).toEqual(expect.arrayContaining(['2026-12-28', '2026-12-29', '2026-12-30', '2026-12-31']));
    const all = squeezeGroupsFor(2026).flat();
    expect(all.some((d) => d.description === 'Nyttårsaften')).toBe(false);
  });

  it('every inneklemt day is a weekday that is not a public holiday', () => {
    // Nyttårsaften is in holidays-norway's list but is not a public holiday, so it can be inneklemt.
    const holidayDates = new Set(
      holidaysNorway(2026).filter((h: any) => h.name !== 'Nyttårsaften').map((h: any) => h.date),
    );
    for (const day of squeezeGroupsFor(2026).flat().filter((d) => d.description === 'inneklemt')) {
      expect(day.day.isoWeekday()).toBeLessThan(6);
      expect(holidayDates.has(day.day.format('YYYY-MM-DD'))).toBe(false);
    }
  });

  it('every group is a contiguous run of days', () => {
    for (const group of squeezeGroupsFor(2026)) {
      for (let i = 1; i < group.length; i++) {
        expect(group[i].day.diff(group[i - 1].day, 'day')).toBe(1);
      }
    }
  });
});

describe('squeezeDayRange', () => {
  it('a smaller range never yields more squeeze days', () => {
    const h = holidaysNorway(2026);
    const count = (r: number) => findSqueezeDays(h, r).flat().filter((d) => d.description === 'inneklemt').length;
    expect(count(1)).toBeLessThanOrEqual(count(4));
  });
});
