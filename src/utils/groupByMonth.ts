import type { SqueezeDayGroup } from '../types';

export function groupByMonth(groups: SqueezeDayGroup[]): SqueezeDayGroup[] {
  const byMonth = new Map<string, SqueezeDayGroup>();

  for (const group of groups) {
    const inneklemtDays = group.filter((d) => d.description === 'inneklemt');
    if (!inneklemtDays.length) continue;

    const monthKey = inneklemtDays[0].day.format('YYYY-MM');

    if (!byMonth.has(monthKey)) {
      byMonth.set(monthKey, [...group]);
    } else {
      const existing = byMonth.get(monthKey)!;
      for (const day of group) {
        const duplicate = existing.some(
          (d) =>
            d.day.dayOfYear() === day.day.dayOfYear() &&
            d.day.year() === day.day.year()
        );
        if (!duplicate) existing.push(day);
      }
      existing.sort((a, b) => a.day.valueOf() - b.day.valueOf());
    }
  }

  return Array.from(byMonth.values());
}
