import type { SqueezeDayGroup } from '../types';

export interface MonthGroup {
  monthName: string;
  groups: SqueezeDayGroup[];
}

export function groupByMonth(squeezeDayGroups: SqueezeDayGroup[]): MonthGroup[] {
  const byMonth = new Map<string, MonthGroup>();

  for (const group of squeezeDayGroups) {
    const inneklemtDays = group.filter((d) => d.description === 'inneklemt');
    if (!inneklemtDays.length) continue;

    const firstDay = inneklemtDays[0].day;
    const monthKey = firstDay.format('YYYY-MM');
    const monthName = firstDay.format('MMMM');

    if (!byMonth.has(monthKey)) {
      byMonth.set(monthKey, { monthName, groups: [] });
    }
    byMonth.get(monthKey)!.groups.push(group);
  }

  return Array.from(byMonth.values());
}
