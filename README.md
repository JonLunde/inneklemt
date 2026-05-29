# Inneklemt.no

Norwegian web app that calculates *inneklemte dager* — workdays sandwiched between public holidays and weekends where one day of vacation gives you a long stretch of free time.

**Live:** [inneklemt.no](https://inneklemt.no)

## What it does

Displays all squeeze days for a given year, grouped by month. Each month card shows one or more squeeze periods, each with a colour-coded value ratio badge (how many free days you get per vacation day used). Year navigation is URL-bound (`/2025`, `/2026`, etc.) — each year is a separate, fully indexed page. You can also download all inneklemt days as a calendar file (`.ics`).

## Tech

- [Astro 6](https://astro.build) — pure static site generation, zero client JS
- [Tailwind CSS v4](https://tailwindcss.com) — custom role-based colour tokens via `@theme {}`
- [holidays-norway](https://www.npmjs.com/package/holidays-norway) — Norwegian public holiday data
- [dayjs](https://day.js.org) — date handling with Norwegian locale
- Node 24.x

## Development

Requires Node ≥ 22 (24 recommended).

```bash
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

```bash
npm run build    # Production build → dist/
npm run preview  # Preview the production build
```

## Project structure

```
src/
  pages/
    index.astro        # Root — renders current year
    [year].astro       # One static page per year (currentYear ±5)
    [year].ics.ts      # iCal download endpoint
    sitemap.xml.ts     # Dynamic sitemap
  layouts/
    Layout.astro       # HTML shell with SEO head and analytics
  components/
    YearNav.astro      # Prev/next year navigation links
    SqueezeGroup.astro # Expandable month card (handles single and multi-period months)
    DayCard.astro      # Single day row
    FAQ.astro          # FAQ section with JSON-LD
  utils/
    findSqueezeDays.ts # Core algorithm — finds squeeze periods from holiday list
    groupByMonth.ts    # Groups squeeze periods by month into MonthGroup[]
    dayjs.ts           # Configured dayjs instance (nb locale + plugins)
  types/
    index.ts           # Holiday, SqueezeDay, SqueezeDayGroup, MonthGroup
```

## Deployment

Deployed on [Vercel](https://vercel.com). Pushes to `staging` deploy to a preview URL for review. Pushes to `main` deploy to production. A GitHub Actions workflow triggers a rebuild on January 1st each year so the default year stays current.
