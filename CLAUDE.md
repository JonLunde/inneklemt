# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

[Inneklemt.no](https://inneklemt.no) is a Norwegian static web app that calculates and displays *inneklemte dager* ("squeeze days") — workdays sandwiched between Norwegian public holidays and weekends where taking one day of vacation maximises total time off.

## Commands

```bash
npm run dev      # Start development server (requires Node ≥ 22)
npm run build    # Production build → dist/
npm run preview  # Preview the production build locally
npm run check    # astro check (TypeScript)
npm test         # Vitest unit tests (algorithm golden files)
npm run test:e2e # Playwright: smoke, interaction and visual regression (desktop + mobile)
```

Node ≥ 22 is required. If the default Node is too old, use:
```bash
/c/Users/Jon/AppData/Roaming/nvm/v22.12.0/node.exe node_modules/.bin/astro build
```

## Tests

CI (`.github/workflows/ci.yml`) runs on every PR to `staging`/`main`: typecheck → unit tests → build → Playwright.

- **Unit (`tests/unit/`)** — golden files in `tests/unit/__golden__/` lock the holiday data and the full squeeze-day output for 2021–2035, *including* known `//!` limitations (e.g. the duplicate May 2027 group when 17. mai and 2. pinsedag coincide). A deliberate algorithm change → review the diff, then `npm test -- -u`.
- **E2E (`tests/e2e/`)** — the site is built with a frozen clock (`tests/e2e/freeze-time.mjs`, 2026-05-10) so the current year, the ±5 range and the open month card never drift. Every test fails on console errors or 4xx/5xx requests.
- **Visual baselines (`tests/e2e/__screenshots__/`)** — only valid when generated in the Playwright Docker image CI uses (the site uses system fonts). Never regenerate them locally or as part of a dependency PR. To re-baseline deliberately: run the "Update visual baselines" workflow on the branch, or push a commit containing `[update-screenshots]`, then push again to re-run CI.
- Locally without the bundled browser: `PW_CHANNEL=chrome npm run test:e2e` (visual tests will differ from CI baselines; that's expected).

### Dependency PRs

- `deps/weekly-*` → `staging`: auto-merged by CI when all checks are green and the PR doesn't touch tests, baselines or CI config.
- `deps/major-*`: always manual.

## Stack

- **Astro 7** — pure SSG, zero React, zero client-side JavaScript
- **Tailwind CSS v4** — configured via `@theme {}` in `src/styles/global.css` (no `tailwind.config.js`)
- **TypeScript** — strict mode
- **Node 24.x** — pinned in `package.json` engines field
- **dayjs** — date handling with `nb` locale, `isoWeek` + `dayOfYear` plugins
- **holidays-norway** — Norwegian public holiday data (no TypeScript types — use `// @ts-ignore` and `module.default ?? module` CJS workaround)
- **npm** — package manager (not yarn)

## Architecture

Pure Astro SSG. One static HTML page per year, generated at build time via `getStaticPaths`. Zero JavaScript shipped to the browser — all interactivity is native HTML (`<details>`/`<summary>` for cards, `<a>` links for year navigation).

### Data flow

```
holidays-norway (CJS package)
    │ returns Holiday[]
    ▼
findSqueezeDays(holidays, 4)   ← src/utils/findSqueezeDays.ts
    │ returns SqueezeDayGroup[]
    ▼
groupByMonth(squeezeDayGroups) ← src/utils/groupByMonth.ts
    │ returns MonthGroup[]  (one entry per month, may contain multiple periods)
    ▼
[year].astro → SqueezeGroup → DayCard
```

### Pages and endpoints

| Path | File | Purpose |
|------|------|---------|
| `/` | `src/pages/index.astro` | Renders current year, canonical → `/{year}` |
| `/{year}` | `src/pages/[year].astro` | One page per year (currentYear ±5) |
| `/{year}.ics` | `src/pages/[year].ics.ts` | iCal download with inneklemt days |
| `/sitemap.xml` | `src/pages/sitemap.xml.ts` | Dynamic sitemap |

### Components

| Component | Purpose |
|-----------|---------|
| `src/layouts/Layout.astro` | HTML shell, SEO head, analytics |
| `src/components/YearNav.astro` | Prev/next year `<a>` links |
| `src/components/SqueezeGroup.astro` | `<details>`/`<summary>` month card; takes a `MonthGroup`; handles single and multi-period months |
| `src/components/DayCard.astro` | Single day row |
| `src/components/FAQ.astro` | Static FAQ + FAQPage JSON-LD |

### Key types (`src/types/index.ts`)

| Type | Shape |
|------|-------|
| `Holiday` | `{ name: string; date: Date }` |
| `SqueezeDay` | `{ day: Dayjs; description: string }` — description is `"inneklemt"`, a holiday name, or `"helg"` |
| `SqueezeDayGroup` | `SqueezeDay[]` — one contiguous free-day block |
| `MonthGroup` | `{ monthName: string; groups: SqueezeDayGroup[] }` — all periods for a given month |

### Colour tokens (Tailwind v4 — defined in `src/styles/global.css`)

| Token | Value | Use |
|-------|-------|-----|
| `bg` | `#F8F9FA` | Page background |
| `surface` | `#FFFFFF` | Card backgrounds |
| `border` | `#E5E7EB` | Borders |
| `text` | `#111827` | Primary text |
| `text-muted` | `#4B5563` | Secondary text (darkened for WCAG AA contrast) |
| `accent` | `#113E74` | Links, focus rings |
| `highlight` | `#FFD340` | Inneklemt day row left-border accent |
| `highlight-tint` | `#FFFBEB` | Inneklemt row background tint |

Value ratio badges use **inline styles** (not Tailwind tokens) with three green levels:
- `< 2×` → `#22C55E` background, white text
- `2–2.9×` → `#16A34A` background, white text
- `≥ 3×` → `#15803D` background, white text

### Core algorithm

For each non-weekend holiday, `findSqueezeDays` checks:
- Days between the holiday and the **previous** weekend (if ≤ `squeezeDayRange`)
- Days between the holiday and the **next** weekend (if ≤ `squeezeDayRange`)

Each match becomes a `SqueezeDayGroup`, padded with adjacent weekends/holidays via `addPreviousHolidays` / `addFollowingHolidays`. Special-case logic handles the romjul period (Dec 25 → Jan 1). Cross-group "split squeeze days" are a known limitation (marked with `//!` comments).

`groupByMonth` then merges groups by the month of their first inneklemt day into `MonthGroup[]`. Multiple periods in the same month appear as sub-sections within one card, each with its own value ratio badge.

### Localisation

All UI text is Norwegian Bokmål. `dayjs` is configured with the `nb` locale in both `src/utils/dayjs.ts` (shared) and `src/utils/findSqueezeDays.ts` (self-contained).

### Analytics

- **Vercel Analytics** — `<Analytics />` from `@vercel/analytics/astro` in `Layout.astro`
- **Vercel Speed Insights** — `<SpeedInsights />` from `@vercel/speed-insights/astro` in `Layout.astro`

## Git workflow

- **Never push directly to `main`.** All changes go to the `staging` branch first.
- **Always run `npm run build` locally before committing.** This catches the same errors Vercel would, including type errors and broken imports. Never push code that hasn't built successfully.
- The `staging` branch auto-deploys to a Vercel preview URL for review.
- Only merge `staging` → `main` when the user explicitly confirms the preview looks correct.
- For larger features, branch off `staging`, then PR into `staging`.

## Conventions

- `holidays-norway` has no TypeScript types — always use `// @ts-ignore` above its import and `(module as any).default ?? module` for the CJS default export.
- `//!` comments in `findSqueezeDays.ts` mark known bugs or planned improvements — treat them as TODO items.
- `squeezeDayRange` is hardcoded to `4` and not exposed in the UI.
- No dark mode — single clean light design.
- No OG image generation — removed to reduce dependency risk on yearly rebuilds.
