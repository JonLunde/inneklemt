# Design: Migrate inneklemt.no to Astro

**Date:** 2026-05-29
**Goal:** Modernise the stack, redesign the UI (clean light design, no dark mode), and achieve top Google.no ranking for "inneklemte dager".

---

## Overview

Replace the current Next.js 12 / Pages Router app with a fresh Astro project in the same repo. No React. No dark mode toggle. One clean, well-crafted light design.

Primary wins:

1. **SEO** — every year's squeeze days land in fully pre-rendered static HTML; Google crawls complete content.
2. **Performance** — zero JavaScript shipped by default; interactivity via native HTML only.
3. **Modernisation** — current Astro stack, shadcn-inspired Tailwind design tokens, clean architecture.
4. **Redesign** — clean & minimal light design; no gradients, no dark mode complexity.

---

## Architecture

### Approach: Pure Astro SSG, zero React

Astro generates one static page per year via `getStaticPaths`. Each page is fully pre-rendered HTML. Interactivity is handled entirely by native browser features:

- **Year navigation** — `<a>` links to `/` (current year) and `/{year}` routes
- **Expand/collapse cards** — native `<details>` / `<summary>` elements
- **Value ratio tooltip** — CSS-only tooltip on hover/focus

No JavaScript bundle shipped. No hydration. No framework runtime.

```
Build time:
  getStaticPaths() → generates pages for currentYear-5 to currentYear+5
  Each page: findSqueezeDays(year) → fully rendered HTML

Runtime:
  Zero JS — all interactivity via native HTML/CSS
```

---

## Project Structure

```
src/
  pages/
    index.astro          ← redirects to /[currentYear] or renders current year
    [year].astro         ← dynamic route, generates one page per year
  layouts/
    Layout.astro         ← <html>, SEO <head>, fonts, global styles
  components/
    YearNav.astro        ← prev/next year links
    SqueezeGroup.astro   ← <details>/<summary> card
    DayCard.astro        ← single day row
    FAQ.astro            ← static FAQ section
  utils/
    findSqueezeDays.ts   ← ported unchanged
  types/
    index.ts             ← ported unchanged
  styles/
    global.css           ← Tailwind base + custom tokens
public/
  favicons/              ← kept as-is
  robots.txt             ← updated to include year routes
  sitemap.xml            ← updated to include year URLs
```

---

## Components

### `Layout.astro`
- Renders `<html lang="nb">`, full SEO `<head>`.
- No dark mode script, no theme detection.
- Accepts `title`, `description`, `year` props.
- Links to Vercel Analytics + Speed Insights scripts.

### `[year].astro`
- `getStaticPaths` generates pages for current year −5 to +5 (11 pages total).
- Runs `findSqueezeDays(year)` at build time.
- Renders `<YearNav>`, squeeze groups, `<FAQ>`.
- Each page has its own SEO title/description with the year.

### `index.astro`
- Redirects to the current year's page (e.g. `/2026`).

### `YearNav.astro`
- Displays current year prominently.
- Prev / next `<a>` links styled as subtle arrow buttons.
- Disables (visually) at the bounds of generated pages.

### `SqueezeGroup.astro`
- Native `<details>` / `<summary>` for expand/collapse — no JS needed.
- `<summary>`: month label, total days, inneklemt count.
- Value ratio badge with CSS tooltip (`:hover` + `::after` pseudo-element).
- Expanded content: list of `<DayCard>` components.

### `DayCard.astro`
- Single row: `{weekday} {date} · {description}`.
- Subtle left-border accent: amber for inneklemt, neutral for holiday/weekend.

### `FAQ.astro`
- Three static questions and answers in Norwegian Bokmål.
- Plain HTML, fully crawlable — primary SEO content depth signal.

---

## Visual Design

**Style:** Clean & minimal light design. Data-first. Generous whitespace.

**Colour palette** (Tailwind custom tokens, keep existing names):
- Background: `#F8F9FA` (off-white, not harsh white)
- Surface (cards): `#FFFFFF` with `1px` border `#E5E7EB`
- Primary accent: existing `primary` blue — used for links, year nav, focus rings
- Inneklemt highlight: existing `secondary` amber — left border + very light tint on inneklemt rows
- Text: `#111827` (near-black) for headings, `#6B7280` for secondary text

**Typography:**
- Font: system font stack — `-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
- H1: large, bold — `"Inneklemte dager 2026"`
- Card headers: medium weight, slightly muted
- Day rows: regular weight

**Cards (`SqueezeGroup`):**
- White background, `rounded-xl`, subtle border
- No gradients
- Value ratio badge: top-right, amber background, CSS tooltip on hover
- `<summary>` styled as a clean header row — browser's default triangle replaced with Lucide-style chevron via CSS

**Day rows (`DayCard`):**
- Full-width inside card
- Inneklemt: `3px` amber left border + `#FFFBEB` background tint
- Holiday/weekend: no border, neutral background

**Year navigation:**
- Centered below H1
- `← 2025   2026   2027 →` — plain text links, minimal styling

**No dark mode.** One design, done well.

---

## SEO

| Signal | Implementation |
|---|---|
| Crawlable content | Full squeeze day list in static HTML for every year |
| Multiple year URLs | `/2025`, `/2026`, `/2027` etc. — each indexed separately |
| H1 keyword | `<h1>Inneklemte dager {year}</h1>` in static HTML |
| Meta description | Dynamic per year, Norwegian Bokmål |
| Canonical | `https://inneklemt.no/{year}` per page |
| OG / Twitter | Per-page title + description |
| JSON-LD | `WebApplication` schema on root + `FAQPage` schema on FAQ section |
| FAQ content | 3 questions targeting "inneklemt", "inneklemte dager", "fridager norge" |
| Sitemap | One entry per generated year page, `changefreq: yearly` per past year, `monthly` for current |
| robots.txt | Allow all, sitemap reference |

### FAQ questions (Norwegian Bokmål)
1. **Hva er en inneklemt dag?** — En inneklemt dag er en arbeidsdag som ligger mellom en helligdag og en helg, slik at du kan ta fri én dag og få en lang sammenhengende fritid.
2. **Hvordan fungerer kalkulatoren?** — Siden beregner automatisk alle inneklemte dager for valgt år basert på norske helligdager, og viser hvor mye fri du får per feriedag du bruker.
3. **Støtter siden andre år enn inneværende år?** — Ja, du kan bla gjennom alle år ved hjelp av pilknappene ved siden av årstallet.

---

## Dependencies

| Package | Purpose | Replaces |
|---|---|---|
| `astro` | Framework | `next` |
| `@astrojs/tailwind` | Tailwind integration | — |
| `tailwindcss` | Styling | — |
| `dayjs` | Date handling | — (kept) |
| `holidays-norway` | Holiday data | — (kept) |
| `@vercel/analytics` | Analytics | — (kept) |
| `@vercel/speed-insights` | Performance tracking | — (kept) |

**Removed entirely:** `react`, `react-dom`, `@astrojs/react`, `next`, `next-themes`, `@mui/material`, `@mui/icons-material`, `@mui/x-date-pickers`, `react-toggle-dark-mode`, `@sendgrid/*`, `dotenv`, `axios`, `shadcn/ui`, `lucide-react`.

Zero npm dependencies for UI components. Native HTML + Tailwind only.

---

## Migration Steps (high level)

1. Delete all Next.js source files, config, and unused dependencies.
2. `npm create astro@latest` in the same directory (minimal/empty template).
3. Add `@astrojs/tailwind` integration.
4. Copy `src/utils/findSqueezeDays.ts` and `src/types/index.ts` unchanged.
5. Copy `public/favicons/`, `public/robots.txt`.
6. Port custom Tailwind colour tokens from existing `tailwind.config.js`.
7. Build `Layout.astro` with SEO head.
8. Build `[year].astro` with `getStaticPaths` + data fetching.
9. Build Astro components (`YearNav`, `SqueezeGroup`, `DayCard`, `FAQ`).
10. Update `sitemap.xml` to include all year URLs.
11. Verify Vercel build command (auto-detects Astro).
12. Deploy and verify Google Search Console.
