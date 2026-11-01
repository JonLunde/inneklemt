import { describe, expect, it } from 'vitest';
import dayjs from '../../src/utils/dayjs';
import { groupByMonth } from '../../src/utils/groupByMonth';
import type { SqueezeDayGroup } from '../../src/types';
import { headlineCount, monthGroupsFor } from './helpers';

const day = (date: string, description = 'inneklemt') => ({ day: dayjs(date), description });

describe('groupByMonth', () => {
  it('keys a group by the month of its first inneklemt day, not its first day', () => {
    const group: SqueezeDayGroup = [day('2026-04-25', 'helg'), day('2026-04-26', 'helg'), day('2026-04-27'), day('2026-05-01', '1. mai')];
    const [month] = groupByMonth([group]);
    expect(month.monthKey).toBe('2026-04');
    expect(month.monthName).toBe('april'); // nb locale
  });

  it('merges several periods in the same month into one card', () => {
    const a: SqueezeDayGroup = [day('2026-05-11'), day('2026-05-14', 'Kristi himmelfartsdag')];
    const b: SqueezeDayGroup = [day('2026-05-14', 'Kristi himmelfartsdag'), day('2026-05-15')];
    const result = groupByMonth([a, b]);
    expect(result).toHaveLength(1);
    expect(result[0].groups).toEqual([a, b]);
  });

  it('skips groups without any inneklemt day', () => {
    expect(groupByMonth([[day('2026-05-16', 'helg'), day('2026-05-17', '17. mai')]])).toEqual([]);
  });

  it('keeps months in chronological order for real data', () => {
    const keys = monthGroupsFor(2026).map((m) => m.monthKey);
    expect(keys).toEqual([...keys].sort());
  });
});

describe('headline count (shown in <title> and <h1>)', () => {
  it.each([2025, 2026, 2027])('%i is stable', (year) => {
    expect(headlineCount(year)).toMatchSnapshot();
  });
});
