import findSqueezeDays from '../../src/utils/findSqueezeDays';
import { groupByMonth } from '../../src/utils/groupByMonth';
import type { SqueezeDayGroup } from '../../src/types';
// @ts-ignore — holidays-norway has no types (see CLAUDE.md)
import holidaysNorwayModule from 'holidays-norway';

export const holidaysNorway = (holidaysNorwayModule as any).default ?? holidaysNorwayModule;

/** Same call the pages make. */
export const squeezeGroupsFor = (year: number) => findSqueezeDays(holidaysNorway(year), 4);
export const monthGroupsFor = (year: number) => groupByMonth(squeezeGroupsFor(year));

/** Human-readable, diff-friendly form of a group: "2026-05-15 inneklemt". */
export const serializeGroup = (group: SqueezeDayGroup) =>
  group.map((d) => `${d.day.format('YYYY-MM-DD ddd')} ${d.description}`);

export const inneklemtDates = (year: number) =>
  squeezeGroupsFor(year)
    .flat()
    .filter((d) => d.description === 'inneklemt')
    .map((d) => d.day.format('YYYY-MM-DD'));

/** Headline count shown on the page (same reduction as [year].astro). */
export const headlineCount = (year: number) =>
  monthGroupsFor(year).reduce(
    (acc, { groups }) =>
      acc + groups.reduce((sum, g) => sum + g.filter((d) => d.description === 'inneklemt').length, 0),
    0,
  );
