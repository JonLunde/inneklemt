# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

[Inneklemt.no](https://inneklemt.no) is a Norwegian static web app that calculates and displays *inneklemte dager* ("squeeze days") — workdays sandwiched between Norwegian public holidays and weekends where taking one day of vacation maximises total time off.

## Commands

```bash
npm run dev      # Start development server (requires Node ≥ 22)
npm run build    # Production build → dist/
npm run preview  # Preview the production build locally
```

No automated tests. Verification is done via `npm run build` and manual browser inspection.

Node ≥ 22 is required. If the default Node is too old, use:
```bash
/c/Users/Jon/AppData/Roaming/nvm/v22.12.0/node.exe node_modules/.bin/astro build
```

## Stack

- **Astro 6** — pure SSG, zero React, zero client-side JavaScript
- **Tailwind CSS v4** — configured via `@theme {}` in `src/styles/global.css` (no `tailwind.config.js`)
- **TypeScript** — strict mode
- **dayjs** — date handling with `nb` locale, `isoWeek` + `dayOfYear` plugins
- **holidays-norway** — Norwegian public holiday data (no TypeScript types — use `// @ts-ignore` and `module.default ?? module` CJS workaround)
- **satori + @resvg/resvg-js** — OG image generation at build time
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
[year].astro → SqueezeGroup → DayCard
```

### Pages and endpoints

| Path | File | Purpose |
|------|------|---------|
| `/` | `src/pages/index.astro` | Renders current year, canonical → `/{year}` |
| `/{year}` | `src/pages/[year].astro` | One page per year (currentYear ±5) |
| `/{year}.ics` | `src/pages/[year].ics.ts` | iCal download with inneklemt days |
| `/og/{year}.png` | `src/pages/og/[year].png.ts` | OG image (1200×630) |
| `/sitemap.xml` | `src/pages/sitemap.xml.ts` | Dynamic sitemap |

### Components

| Component | Purpose |
|-----------|---------|
| `src/layouts/Layout.astro` | HTML shell, SEO head, analytics |
| `src/components/YearNav.astro` | Prev/next year `<a>` links |
| `src/components/SqueezeGroup.astro` | `<details>`/`<summary>` card with value ratio tooltip |
| `src/components/DayCard.astro` | Single day row |
| `src/components/FAQ.astro` | Static FAQ + FAQPage JSON-LD |

### Key types (`src/types/index.ts`)

| Type | Shape |
|------|-------|
| `Holiday` | `{ name: string; date: Date }` |
| `SqueezeDay` | `{ day: Dayjs; description: string }` — description is `"inneklemt"`, a holiday name, or `"helg"` |
| `SqueezeDayGroup` | `SqueezeDay[]` — one contiguous free-day block |

### Colour tokens (Tailwind v4 — defined in `src/styles/global.css`)

| Token | Value | Use |
|-------|-------|-----|
| `bg` | `#F8F9FA` | Page background |
| `surface` | `#FFFFFF` | Card backgrounds |
| `border` | `#E5E7EB` | Borders |
| `text` | `#111827` | Primary text |
| `text-muted` | `#6B7280` | Secondary text |
| `accent` | `#113E74` | Links, focus rings |
| `highlight` | `#FFD340` | Inneklemt badge, value ratio |
| `highlight-tint` | `#FFFBEB` | Inneklemt row background |

### Core algorithm

For each non-weekend holiday, `findSqueezeDays` checks:
- Days between the holiday and the **previous** weekend (if ≤ `squeezeDayRange`)
- Days between the holiday and the **next** weekend (if ≤ `squeezeDayRange`)

Each match becomes a `SqueezeDayGroup`, padded with adjacent weekends/holidays via `addPreviousHolidays` / `addFollowingHolidays`. Special-case logic handles the romjul period (Dec 25 → Jan 1). Cross-group "split squeeze days" are a known limitation (marked with `//!` comments).

### Localisation

All UI text is Norwegian Bokmål. `dayjs` is configured with the `nb` locale in both `src/utils/dayjs.ts` (shared) and `src/utils/findSqueezeDays.ts` (self-contained).

### Analytics

- **Vercel Analytics** — `inject()` from `@vercel/analytics` in `Layout.astro`
- **Vercel Speed Insights** — `<SpeedInsights />` from `@vercel/speed-insights/astro` in `Layout.astro`

## Git workflow

- **Never push directly to `main`.** All changes go to the `staging` branch first.
- The `staging` branch auto-deploys to a Vercel preview URL for review.
- Only merge `staging` → `main` when the user confirms the preview looks correct.
- For larger features, branch off `staging`, then PR into `staging`.

## Conventions

- `holidays-norway` has no TypeScript types — always use `// @ts-ignore` above its import and `(module as any).default ?? module` for the CJS default export.
- `//!` comments in `findSqueezeDays.ts` mark known bugs or planned improvements — treat them as TODO items.
- `squeezeDayRange` is hardcoded to `4` and not exposed in the UI.
- No dark mode — single clean light design.
