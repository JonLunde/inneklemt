# Design: Migrate inneklemt.no to Astro

**Date:** 2026-05-29
**Goal:** Modernise the stack, redesign the UI (clean & minimal), and achieve top Google.no ranking for "inneklemte dager".

---

## Overview

Replace the current Next.js 12 / Pages Router app with a fresh Astro project in the same repo. The primary wins are:

1. **SEO** — current year's squeeze days land in static HTML; Google crawls full content instead of an empty shell.
2. **Performance** — zero framework JS for static content; React only ships for the interactive island.
3. **Modernisation** — current stack, shadcn/ui components, Tailwind v3, clean architecture.
4. **Redesign** — clean & minimal visual style replacing the current heavy gradient cards.

---

## Architecture

### Approach: Astro SSG + single React island

Astro pre-renders the current year's squeeze days at build time. One React island (`App.tsx`) owns all interactivity. Astro server-renders the island's initial output into static HTML — Google sees the full squeeze day list. React hydrates on the client and the year picker becomes interactive.

```
index.astro
  → runs findSqueezeDays(currentYear) at build time
  → <App client:load initialYear={currentYear} initialData={squeezeDayGroups} />
      → Astro SSR output: full squeeze day list in static HTML ✓
      → React hydrates: year picker interactive, recalculates on year change
```

### Why not a pure Astro (no React) approach?

The dark mode toggle (`react-toggle-dark-mode`) and the stateful year picker + expand/collapse cards make React the pragmatic choice. The app is small enough that one island is clean and justified.

---

## Project Structure

```
src/
  pages/
    index.astro          ← static page entry point
  layouts/
    Layout.astro         ← <html>, SEO <head>, dark mode init script
  components/
    App.tsx              ← React island (client:load); owns year state
    YearPicker.tsx       ← React; inline ↑↓ year navigation in H1
    SqueezeGroup.tsx     ← React; card with expand/collapse + value tooltip
    DayCard.tsx          ← React; single day row
    DarkModeToggle.tsx   ← React; animated toggle + localStorage
    ui/                  ← shadcn/ui generated components (Tooltip, etc.)
  utils/
    findSqueezeDays.ts   ← ported unchanged from current codebase
  types/
    index.ts             ← ported unchanged from current codebase
public/
  favicons/              ← kept as-is
  robots.txt             ← kept as-is
  sitemap.xml            ← updated
```

---

## Components

### `Layout.astro`
- Renders `<html lang="nb">`, full SEO `<head>`, Vercel analytics scripts.
- Contains an inline `<script>` that reads `localStorage.getItem('theme')` and sets the `dark` class on `<html>` **before first paint** — eliminates flash of wrong theme.
- Accepts `title`, `description`, `year` props for per-page SEO values.

### `index.astro`
- Imports `findSqueezeDays` and `holidays-norway`, runs them at build time with `new Date().getFullYear()`.
- Renders `<App client:load initialYear={year} initialData={groups} />`.
- Renders a static FAQ section below the island (pure HTML, fully crawlable).

### `App.tsx` (React island)
- Holds `selectedYear` and `squeezeDayRange` state (default range: 4).
- On year change: recalculates squeeze days client-side.
- Renders: `<YearPicker>`, `<DarkModeToggle>`, squeeze day cards, `<Description>`.
- Accepts `initialYear` and `initialData` props for the SSR-rendered first paint.

### `YearPicker.tsx`
- Inline component sitting beside the year digits in the H1.
- Lucide `ChevronUp` / `ChevronDown` buttons with `aria-label`.
- Disables buttons at ±100 years from current year.

### `SqueezeGroup.tsx`
- shadcn `Tooltip` on the value ratio badge (replaces MUI Tooltip).
- Lucide `Info` icon inside the badge.
- Collapsed state: shows only inneklemt day names.
- Expanded state: shows all days via `DayCard`.
- Expand trigger: plain text link `"Se alle X dager ↓"` — no floating circle.

### `DayCard.tsx`
- Single row: `{weekday} {date} · {description}`.
- Subtle left-border accent: amber for inneklemt, neutral for holiday/weekend.

### `DarkModeToggle.tsx`
- Uses `react-toggle-dark-mode` for the animated sun/moon.
- On toggle: flips `dark` class on `<html>`, updates `localStorage`.
- Reads initial state from `document.documentElement.classList` (set by Layout script).

---

## Visual Design

**Style:** Clean & minimal. Data-first. Lots of whitespace.

**Font:** System font stack — `-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.

**Colours:** Retain the existing custom Tailwind palette (`primary` blues, `secondary` ambers) but use them sparingly as accents, not fills. Light mode: white/near-white surfaces. Dark mode: dark surfaces.

**Cards (`SqueezeGroup`):**
- White (light) / dark-surface (dark) background.
- Subtle `1px` border, `rounded-xl`.
- No heavy gradients.
- Value ratio badge: top-right corner, amber accent, shadcn Tooltip on hover/tap.

**Day rows (`DayCard`):**
- Full-width rows inside the card.
- Inneklemt days: subtle amber left border + light amber background tint.
- Holidays/weekends: neutral background.

**H1:** `"Inneklemte dager"` + year with inline ↑↓ pickers. Large, bold. This is the primary keyword target.

**Description:** Single sentence below H1. Static for current year in SSR output.

**FAQ section:** Plain text, no accordion. Three questions with short answers. Placed below the squeeze day list.

---

## SEO

| Signal | Implementation |
|---|---|
| Crawlable content | Squeeze days in static HTML via Astro SSR of React island |
| H1 keyword | `<h1>Inneklemte dager {year}</h1>` in static HTML |
| Meta description | Dynamic per year, Norwegian Bokmål |
| Canonical | `https://inneklemt.no` |
| OG / Twitter | Carried over from current implementation |
| JSON-LD | `WebApplication` schema — keep existing, add `FAQPage` schema for FAQ section |
| FAQ content | 3 questions targeting "inneklemt", "inneklemte dager", "fridager norge" |
| Sitemap | Single URL, `changefreq: monthly` (data changes each new year) |
| robots.txt | Unchanged |

### FAQ questions (Norwegian Bokmål)
1. **Hva er en inneklemt dag?** — En inneklemt dag er en arbeidsdag som ligger mellom en helligdag og en helg, slik at du kan ta fri én dag og få en lang sammenhengende fritid.
2. **Hvordan fungerer kalkulatoren?** — Siden beregner automatisk alle inneklemte dager for valgt år basert på norske helligdager, og viser hvor mye fri du får per feriedag du bruker.
3. **Støtter siden andre år enn inneværende år?** — Ja, du kan bla gjennom alle år ved hjelp av pilknappene ved siden av årstallet.

---

## Dependencies

| Package | Purpose | Replaces |
|---|---|---|
| `astro` | Framework | `next` |
| `@astrojs/react` | React integration | — |
| `@astrojs/tailwind` | Tailwind integration | — |
| `react`, `react-dom` | React island | — |
| `tailwindcss` | Styling | — |
| `dayjs` | Date handling | — (kept) |
| `holidays-norway` | Holiday data | — (kept) |
| `lucide-react` | Icons | `@mui/icons-material` |
| `shadcn/ui` + `@radix-ui/react-tooltip` | Tooltip, base components | `@mui/material` |
| `react-toggle-dark-mode` | Dark mode switch animation | — (kept) |
| `@vercel/analytics` | Analytics | — (kept) |
| `@vercel/speed-insights` | Performance tracking | — (kept) |

Removed: `next`, `@mui/material`, `@mui/icons-material`, `@mui/x-date-pickers`, `next-themes`, `@sendgrid/*`, `dotenv`, `axios`.

---

## Dark Mode

No `next-themes`. Replaced with:

1. `Layout.astro` inline script (runs before paint):
   ```js
   const theme = localStorage.getItem('theme') ?? 'system';
   const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
   if (theme === 'dark' || (theme === 'system' && prefersDark)) {
     document.documentElement.classList.add('dark');
   }
   ```
2. `DarkModeToggle.tsx` toggles `document.documentElement.classList` and writes to `localStorage`.
3. Tailwind `darkMode: 'class'` strategy — unchanged from current config.

---

## Migration Steps (high level)

1. Delete all Next.js source files and config.
2. `npm create astro@latest` in the same directory (minimal template).
3. `npx shadcn@latest init` — configures Tailwind, Radix, Lucide.
4. Copy `src/utils/findSqueezeDays.ts` and `src/types/index.ts` unchanged.
5. Copy `public/favicons/`, `public/robots.txt`.
6. Build `Layout.astro` with SEO head + dark mode script.
7. Build `index.astro` with build-time data + FAQ.
8. Build React components (`App`, `YearPicker`, `SqueezeGroup`, `DayCard`, `DarkModeToggle`).
9. Update `tailwind.config.js` (keep custom palette, update content paths).
10. Update `sitemap.xml`.
11. Verify Vercel build command (should auto-detect Astro).
12. Deploy.
