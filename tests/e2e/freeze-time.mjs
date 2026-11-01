// Preloaded with `node --import` during the e2e build so the generated site is deterministic.
// The pages read `new Date()` / `dayjs()` at build time to pick the current year, the ±5 year
// range and which month card starts open. Freezing the clock keeps screenshots stable no matter
// when CI runs. Override with FROZEN_NOW if a test ever needs another date.
const FROZEN = new Date(process.env.FROZEN_NOW ?? '2026-05-10T12:00:00+02:00').getTime();
const RealDate = globalThis.Date;

class FrozenDate extends RealDate {
  constructor(...args) {
    super(...(args.length ? args : [FROZEN]));
  }
  static now() {
    return FROZEN;
  }
}

globalThis.Date = FrozenDate;
