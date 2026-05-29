# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

[Inneklemt.no](https://www.inneklemt.no) is a Norwegian single-page web app that calculates and displays *inneklemte dager* ("squeeze days") — workdays sandwiched between Norwegian public holidays and weekends where taking vacation maximises time off.

## Commands

```bash
yarn dev          # Start development server
yarn build        # Production build
yarn start        # Run production server
yarn lint         # ESLint via Next.js
yarn type-check   # TypeScript type checking (tsc --noEmit)
```

There are no automated tests in this project. The package manager is **Yarn 3 with PnP** (`.pnp.cjs`). Never use `npm` or plain `node_modules` installs.

## Architecture

This is a **Next.js 12 / React 18 / TypeScript** app with a single route (`src/pages/index.tsx`). All application state lives in `index.tsx` and is passed down as props — there is no global state manager.

### Data flow

```
holidays-norway (external package)
    │ returns Holiday[]
    ▼
findSqueezeDays(holidays, squeezeDayRange)   ← src/utils/findSqueezeDays.ts
    │ returns SqueezeDayGroup[]
    ▼
Content → SqueezeGroup → DayCard
```

1. `holidays-norway` is called with the `selectedYear` to get Norwegian public holidays.
2. `findSqueezeDays` processes those holidays and returns groups of consecutive days (each group contains the actual squeeze days plus their surrounding weekends/holidays for context).
3. The result is rendered as a list of `SqueezeGroup` cards, each of which can be expanded to show individual `DayCard` rows.

### Core algorithm (`src/utils/findSqueezeDays.ts`)

For each non-weekend holiday, the algorithm checks:
- Days between the holiday and the **previous** weekend (if ≤ `squeezeDayRange`)
- Days between the holiday and the **next** weekend (if ≤ `squeezeDayRange`)

Each matching set of squeeze days becomes a `SqueezeDayGroup`, padded with the adjacent weekends and holidays via `addPreviousHolidays` / `addFollowingHolidays`. There is special-case logic at the end for the romjul period (Dec 25 → Jan 1). The algorithm currently does **not** handle cross-group "split squeeze days" (noted with `//!` comments as a known limitation).

### Key types (`src/types/index.ts`)

| Type | Shape |
|------|-------|
| `Holiday` | `{ name: string; date: Date }` from `holidays-norway` |
| `SqueezeDay` | `{ day: Dayjs; description: string }` — description is `"inneklemt"`, a holiday name, or `"helg"` |
| `SqueezeDayGroup` | `SqueezeDay[]` — one contiguous free-day block |

### Theming

Dark mode uses **`next-themes`** with Tailwind's `darkMode: "class"` strategy. The `DarkMode` component delays rendering until after mount to avoid hydration mismatch. Tailwind colours are fully custom (no default palette) — the two palettes are `primary` (blues, dark blues) and `secondary` (ambers/oranges).

### Localisation

All UI text is Norwegian Bokmål. `dayjs` is configured globally with the `nb` locale and the `isoWeek` + `dayOfYear` plugins — this setup is repeated in both `index.tsx` and `findSqueezeDays.ts`.

### Analytics

Google Analytics is wired via `src/lib/gtag.js`. The GA measurement ID is read from `NEXT_PUBLIC_GOOGLE_ANALYTICS` (must be set in `.env.local` for local GA tracking; the app runs fine without it).

## Git workflow

- **Never push directly to `main`.** All changes go to the `staging` branch first.
- The `staging` branch deploys to a Vercel preview URL for review before going live.
- Only merge `staging` → `main` when the user has confirmed the change looks correct in the preview.
- For larger features, create a feature branch off `staging`, then PR into `staging`.

## Conventions

- The `Filter` / `SqueezeDayRange` components exist in the tree but the filter UI was removed from `Header` (see commit history). `squeezeDayRange` defaults to `4` and is no longer exposed in the UI — keep this in mind if re-adding filter controls.
- `holidays-norway` types lack a declaration file; the import uses `// @ts-ignore`.
- `//!` comments mark known bugs or planned improvements — treat them as TODO items.
