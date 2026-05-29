# Inneklemt.no

Norwegian web app that calculates *inneklemte dager* — workdays sandwiched between public holidays and weekends where one day of vacation gives you a long stretch of free time.

**Live:** [inneklemt.no](https://inneklemt.no)

## What it does

Displays all squeeze days for a given year, grouped by period. Each card shows how many vacation days you need and how many free days you get in return (the value ratio). Year navigation is URL-bound (`/2025`, `/2026`, etc.) — each year is a separate, fully indexed page. You can also download all inneklemt days as a calendar file (`.ics`).

## Tech

- [Astro 6](https://astro.build) — pure static site generation, zero client JS
- [Tailwind CSS v4](https://tailwindcss.com) — custom role-based colour tokens
- [holidays-norway](https://www.npmjs.com/package/holidays-norway) — Norwegian public holiday data
- [dayjs](https://day.js.org) — date handling with Norwegian locale
- [satori](https://github.com/vercel/satori) + [@resvg/resvg-js](https://github.com/RazrFalcon/resvg) — OG image generation

## Development

Requires Node ≥ 22.

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
    og/[year].png.ts   # OG image per year
  layouts/
    Layout.astro       # HTML shell with SEO head and analytics
  components/
    YearNav.astro      # Prev/next year navigation links
    SqueezeGroup.astro # Expandable card for one squeeze period
    DayCard.astro      # Single day row
    FAQ.astro          # FAQ section with JSON-LD
  utils/
    findSqueezeDays.ts # Core algorithm
    dayjs.ts           # Configured dayjs instance (nb locale)
  types/
    index.ts           # Holiday, SqueezeDay, SqueezeDayGroup
```

## Deployment

Deployed on [Vercel](https://vercel.com). Pushes to `main` deploy to production. Pushes to `staging` deploy to a preview URL. A GitHub Actions workflow triggers a rebuild on January 1st each year so the default year stays current.
