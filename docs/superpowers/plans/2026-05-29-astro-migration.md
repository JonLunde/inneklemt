# Astro Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Next.js 12 app with a pure Astro SSG site — zero React, zero dark mode, clean light design, URL-bound year navigation, iCal export, OG images, and full SEO.

**Architecture:** Astro generates one static HTML page per year via `getStaticPaths` (currentYear ±5). All interactivity is native HTML (`<details>`/`<summary>` for cards, `<a>` links for year nav). Zero JavaScript shipped to the browser. iCal and OG image endpoints are also pre-rendered at build time.

**Tech Stack:** Astro 4, Tailwind CSS 3, TypeScript, dayjs, holidays-norway, satori + @resvg/resvg-js (OG images), @vercel/analytics, @vercel/speed-insights.

> **Note on testing:** This project has no automated test suite. Verification is done via `npm run build` (catches type errors and build failures) and manual browser inspection of `npm run dev`. Each task ends with a build or dev-server check.

---

## File Map

```
src/
  pages/
    index.astro              ← renders current year (canonical → /{year})
    [year].astro             ← one page per year, getStaticPaths
    [year].ics.ts            ← iCal download endpoint
    sitemap.xml.ts           ← dynamic sitemap, pre-rendered at build time
    og/
      [year].png.ts          ← OG image endpoint (satori → PNG)
  layouts/
    Layout.astro             ← <html>, SEO head, analytics
  components/
    YearNav.astro            ← prev/next year <a> links
    SqueezeGroup.astro       ← <details>/<summary> card
    DayCard.astro            ← single day row
    FAQ.astro                ← static FAQ + FAQPage JSON-LD
  utils/
    findSqueezeDays.ts       ← ported unchanged from current src/utils/
    dayjs.ts                 ← shared dayjs instance (plugins + nb locale)
  types/
    index.ts                 ← ported unchanged from current src/types/
  assets/
    fonts/
      Inter.ttf              ← downloaded once, used by OG image generator
  styles/
    global.css               ← Tailwind directives + CSS tooltip
astro.config.mjs             ← Astro config with Tailwind integration
tailwind.config.mjs          ← role-based colour tokens
public/
  favicons/                  ← kept as-is
  robots.txt                 ← kept as-is (already correct)
```

---

## Task 1: Save utils/types then tear down Next.js

**Files:**
- Delete: everything except `public/favicons/`, `public/robots.txt`, `.git/`, `.gitignore`, `CLAUDE.md`, `docs/`
- Preserve (copy contents before deleting): `src/utils/findSqueezeDays.ts`, `src/types/index.ts`

- [ ] **Step 1: Note the two files to preserve**

  Open `src/utils/findSqueezeDays.ts` and `src/types/index.ts` — you will recreate them in Task 6. Their full contents are included there verbatim.

- [ ] **Step 2: Delete all Next.js source and config**

  ```bash
  cd D:/projects/jonlunde/inneklemt
  rm -rf src .next .yarn node_modules .pnp.cjs .pnp.loader.mjs yarn-error.log
  rm -f next.config.js next-env.d.ts tsconfig.json tsconfig.tsbuildinfo .yarnrc.yml yarn.lock package.json postcss.config.js .eslintrc.json .editorconfig
  ```

- [ ] **Step 3: Verify only the right files remain**

  ```bash
  ls -la
  ```

  Expected: `.git/`, `.gitignore`, `CLAUDE.md`, `docs/`, `public/` — nothing else.

- [ ] **Step 4: Commit the clean slate**

  ```bash
  git add -A
  git commit -m "chore: remove Next.js app — beginning Astro migration"
  ```

---

## Task 2: Initialize Astro project

**Files:**
- Create: `astro.config.mjs`, `package.json`, `tsconfig.json`, `src/env.d.ts`

- [ ] **Step 1: Scaffold Astro in the current directory**

  ```bash
  npm create astro@latest . -- --template minimal --typescript strict --no-install --no-git
  ```

  When prompted, confirm overwriting any generated files.

- [ ] **Step 2: Add Tailwind integration**

  ```bash
  npx astro add tailwind --yes
  ```

  This installs `@astrojs/tailwind`, `tailwindcss`, `autoprefixer`, and creates `tailwind.config.mjs`.

- [ ] **Step 2b: Set applyBaseStyles: false in astro.config.mjs**

  The integration injects Tailwind's base styles by default. We handle this ourselves in `global.css`, so disable it to avoid duplication:

  ```js
  // astro.config.mjs
  import { defineConfig } from 'astro/config';
  import tailwind from '@astrojs/tailwind';

  export default defineConfig({
    integrations: [
      tailwind({ applyBaseStyles: false }),
    ],
  });
  ```

- [ ] **Step 3: Verify dev server starts**

  ```bash
  npm install
  npm run dev
  ```

  Expected: Astro dev server starts at `http://localhost:4321` with no errors.

- [ ] **Step 4: Commit the scaffold**

  ```bash
  git add -A
  git commit -m "chore: initialize Astro project with Tailwind"
  ```

---

## Task 3: Install dependencies

**Files:**
- Modify: `package.json` (npm install updates this)

- [ ] **Step 1: Install runtime dependencies**

  ```bash
  npm install dayjs holidays-norway @vercel/analytics @vercel/speed-insights satori @resvg/resvg-js
  ```

- [ ] **Step 2: Install type declarations**

  ```bash
  npm install -D @types/node
  ```

- [ ] **Step 3: Verify no install errors**

  ```bash
  npm run build
  ```

  Expected: Build succeeds (the default Astro scaffold builds cleanly).

- [ ] **Step 4: Commit**

  ```bash
  git add package.json package-lock.json
  git commit -m "chore: add project dependencies"
  ```

---

## Task 4: Tailwind config with role-based colour tokens

**Files:**
- Modify: `tailwind.config.mjs`

- [ ] **Step 1: Replace the generated Tailwind config**

  ```js
  // tailwind.config.mjs
  /** @type {import('tailwindcss').Config} */
  export default {
    content: ['./src/**/*.{astro,html,js,ts}'],
    theme: {
      colors: {
        bg: '#F8F9FA',
        surface: '#FFFFFF',
        border: '#E5E7EB',
        text: '#111827',
        'text-muted': '#6B7280',
        accent: '#113E74',
        highlight: '#FFD340',
        'highlight-tint': '#FFFBEB',
        transparent: 'transparent',
        inherit: 'inherit',
        white: '#FFFFFF',
        black: '#000000',
      },
      extend: {
        screens: { sm: '600px' },
        fontFamily: {
          sans: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            'sans-serif',
          ],
        },
      },
    },
    plugins: [],
  };
  ```

- [ ] **Step 2: Create global CSS with Tailwind directives and tooltip styles**

  Create `src/styles/global.css`:

  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  /* Remove default <details> triangle */
  details > summary {
    list-style: none;
  }
  details > summary::-webkit-details-marker {
    display: none;
  }

  /* CSS-only tooltip on value ratio badge */
  .tooltip-anchor {
    position: relative;
  }

  .tooltip-content {
    display: none;
    position: absolute;
    bottom: calc(100% + 8px);
    right: 0;
    width: 220px;
    background: #111827;
    color: #f9fafb;
    font-size: 0.75rem;
    line-height: 1.5;
    padding: 8px 12px;
    border-radius: 6px;
    z-index: 10;
    pointer-events: none;
    text-align: left;
  }

  .tooltip-content::after {
    content: '';
    position: absolute;
    top: 100%;
    right: 14px;
    border: 6px solid transparent;
    border-top-color: #111827;
  }

  .tooltip-anchor:hover .tooltip-content,
  .tooltip-anchor:focus-within .tooltip-content {
    display: block;
  }
  ```

- [ ] **Step 3: Verify build still passes**

  ```bash
  npm run build
  ```

- [ ] **Step 4: Commit**

  ```bash
  git add tailwind.config.mjs src/styles/global.css
  git commit -m "style: add role-based Tailwind tokens and tooltip CSS"
  ```

---

## Task 5: Download Inter font for OG image generation

**Files:**
- Create: `src/assets/fonts/Inter.ttf`

- [ ] **Step 1: Create font directory**

  ```bash
  mkdir -p src/assets/fonts
  ```

- [ ] **Step 2: Download Inter variable font**

  ```bash
  curl -L "https://github.com/google/fonts/raw/main/ofl/inter/Inter%5Bslnt%2Cwght%5D.ttf" \
    -o src/assets/fonts/Inter.ttf
  ```

  Expected: `src/assets/fonts/Inter.ttf` is created (~500 KB).

- [ ] **Step 3: Commit the font**

  ```bash
  git add src/assets/fonts/Inter.ttf
  git commit -m "assets: add Inter variable font for OG image generation"
  ```

---

## Task 6: Port types and utils

**Files:**
- Create: `src/types/index.ts`
- Create: `src/utils/findSqueezeDays.ts`
- Create: `src/utils/dayjs.ts`

- [ ] **Step 1: Create types**

  ```typescript
  // src/types/index.ts
  import { Dayjs } from 'dayjs';

  export interface Holiday {
    name: string;
    date: Date;
  }

  export interface SqueezeDay {
    day: Dayjs;
    description: string;
  }

  export type SqueezeDayGroup = SqueezeDay[];
  ```

- [ ] **Step 2: Create shared dayjs utility**

  ```typescript
  // src/utils/dayjs.ts
  import dayjs from 'dayjs';
  import isoWeek from 'dayjs/plugin/isoWeek';
  import dayOfYear from 'dayjs/plugin/dayOfYear';
  import 'dayjs/locale/nb';

  dayjs.extend(isoWeek);
  dayjs.extend(dayOfYear);
  dayjs.locale('nb');

  export default dayjs;
  ```

- [ ] **Step 3: Create findSqueezeDays (ported unchanged)**

  Create `src/utils/findSqueezeDays.ts` with the following content — this is verbatim from the original codebase:

  ```typescript
  import { Holiday, SqueezeDayGroup } from "../types";
  import { default as dayjs } from "dayjs";
  import { default as isoWeekday } from "dayjs/plugin/isoWeek";
  import { default as dayOfYear } from "dayjs/plugin/dayOfYear";
  import "dayjs/locale/nb";
  dayjs.extend(isoWeekday);
  dayjs.extend(dayOfYear);
  dayjs.locale("nb");

  const weekends = [6, 7];

  const transformHolidays = (holidays: Holiday[]) => {
    return holidays
      .sort((a, b) => dayjs(a.date).dayOfYear() - dayjs(b.date).dayOfYear())
      .map((holiday) => ({
        ...holiday,
        dayOfWeek: dayjs(holiday.date).isoWeekday(),
        name:
          holiday.name === "Kristi Himmelsprettsdag"
            ? "Kristi himmelfartsdag"
            : holiday.name,
      }));
  };

  const addPreviousHolidays = (
    squeezeDayGroup: SqueezeDayGroup,
    holidays: Holiday[]
  ) => {
    if (!squeezeDayGroup.length) return squeezeDayGroup;
    let previousDay = squeezeDayGroup[0].day.subtract(1, "day");
    while (true) {
      const holiday = holidays.find(
        (holiday) => dayjs(holiday.date).dayOfYear() === previousDay.dayOfYear()
      );
      if (weekends.includes(previousDay.isoWeekday()) || holiday) {
        squeezeDayGroup.splice(0, 0, {
          day: previousDay,
          description: holiday ? holiday.name : "helg",
        });
        previousDay = previousDay.subtract(1, "day");
      } else {
        break;
      }
    }
    return squeezeDayGroup;
  };

  const addFollowingHolidays = (
    squeezeDayGroup: SqueezeDayGroup,
    holidays: Holiday[]
  ) => {
    if (!squeezeDayGroup.length) return squeezeDayGroup;
    let followingHoliday = squeezeDayGroup[squeezeDayGroup.length - 1].day.add(1, "day");
    while (true) {
      const holiday = holidays.find(
        (holiday) =>
          dayjs(holiday.date).dayOfYear() === followingHoliday.dayOfYear()
      );
      if (weekends.includes(followingHoliday.isoWeekday()) || holiday) {
        squeezeDayGroup.splice(squeezeDayGroup.length, 0, {
          day: followingHoliday,
          description: holiday ? holiday.name : "helg",
        });
        followingHoliday = followingHoliday.add(1, "day");
      } else {
        break;
      }
    }
    return squeezeDayGroup;
  };

  const findSqueezeDays = (holidays: Holiday[], squeezeDaysRange: number) => {
    const squeezeDayGroups: SqueezeDayGroup[] = [];
    const transformedHolidays = transformHolidays(holidays);
    transformedHolidays.pop();

    transformedHolidays?.forEach((holiday) => {
      const { date } = holiday;
      const holidayDate = dayjs(date);
      const holidayWeekday = holidayDate.isoWeekday();
      const holidayDayOfYear = holidayDate.dayOfYear();
      const holidayFallsOnWeekend = weekends.includes(holidayWeekday);
      const followsAnotherHoliday = transformedHolidays.some(
        (h) => dayjs(h.date).dayOfYear() === holidayDayOfYear - 1
      );
      const proceedesAnotherHoliday = transformedHolidays.some(
        (h) => dayjs(h.date).dayOfYear() === holidayDayOfYear + 1
      );

      if (holidayFallsOnWeekend) return;

      if (!followsAnotherHoliday && holidayDayOfYear !== 1) {
        const daysToPreviousWeekend = holidayWeekday - 1;
        if (daysToPreviousWeekend <= squeezeDaysRange) {
          const squeezeDayGroup: SqueezeDayGroup = [];
          for (let i = 1; i <= daysToPreviousWeekend; i++) {
            squeezeDayGroup.push({ day: holidayDate.subtract(i, "day"), description: "inneklemt" });
          }
          squeezeDayGroup.sort((a, b) => a.day.dayOfYear() - b.day.dayOfYear());
          addPreviousHolidays(squeezeDayGroup, transformedHolidays);
          addFollowingHolidays(squeezeDayGroup, transformedHolidays);
          if (squeezeDayGroup.length > 0) squeezeDayGroups.push(squeezeDayGroup);
        }
      }

      if (!proceedesAnotherHoliday) {
        const daysToNextWeekend = 5 - holidayWeekday;
        if (daysToNextWeekend <= squeezeDaysRange) {
          const squeezeDayGroup: SqueezeDayGroup = [];
          for (let i = 1; i <= daysToNextWeekend; i++) {
            squeezeDayGroup.push({ day: holidayDate.add(i, "day"), description: "inneklemt" });
          }
          squeezeDayGroup.sort((a, b) => a.day.dayOfYear() - b.day.dayOfYear());
          addPreviousHolidays(squeezeDayGroup, transformedHolidays);
          addFollowingHolidays(squeezeDayGroup, transformedHolidays);
          if (squeezeDayGroup.length > 0) squeezeDayGroups.push(squeezeDayGroup);
        }
      }
    });

    const christmasDay = transformedHolidays.find(
      (h) => dayjs(h.date).format("DD.MM") === "25.12"
    );
    if (christmasDay) {
      const lastDayOfYear = dayjs(dayjs(christmasDay.date).add(6, "day"));
      const lastDayOfYearWeekday = lastDayOfYear.isoWeekday();
      const daysToNextWeekend = lastDayOfYearWeekday - 1;
      if (daysToNextWeekend <= squeezeDaysRange) {
        const squeezeDayGroup: SqueezeDayGroup = [];
        for (let i = 0; i <= daysToNextWeekend; i++) {
          squeezeDayGroup.push({ day: lastDayOfYear.subtract(i, "day"), description: "inneklemt" });
        }
        squeezeDayGroup.sort((a, b) => a.day.dayOfYear() - b.day.dayOfYear());
        addPreviousHolidays(squeezeDayGroup, transformedHolidays);
        addFollowingHolidays(squeezeDayGroup, transformedHolidays);
        squeezeDayGroups.push(squeezeDayGroup);
      }
    }

    return squeezeDayGroups;
  };

  export default findSqueezeDays;
  ```

- [ ] **Step 4: Verify types compile**

  ```bash
  npm run build
  ```

  Expected: Build passes. If `holidays-norway` causes a type error, add `// @ts-ignore` above the import in files that use it.

- [ ] **Step 5: Commit**

  ```bash
  git add src/types/ src/utils/
  git commit -m "feat: port types and findSqueezeDays utility"
  ```

---

## Task 7: Layout.astro

**Files:**
- Create: `src/layouts/Layout.astro`
- Modify: `src/env.d.ts` (add triple-slash reference if missing)

- [ ] **Step 1: Create Layout.astro**

  ```astro
  ---
  // src/layouts/Layout.astro
  import '../styles/global.css';

  interface Props {
    title: string;
    description: string;
    year: number;
    inneklemtCount: number;
    canonicalUrl: string;
  }

  const { title, description, year, inneklemtCount, canonicalUrl } = Astro.props;
  const ogImageUrl = `https://inneklemt.no/og/${year}.png`;

  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Inneklemt.no',
    url: 'https://inneklemt.no',
    description: 'Oversikt over inneklemte dager i Norge for å hjelpe deg med å planlegge ferien smartere.',
    applicationCategory: 'Utility',
    inLanguage: 'nb-NO',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
  };
  ---

  <!doctype html>
  <html lang="nb">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="author" content="Jon Lunde" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="Inneklemt.no" />
      <meta property="og:locale" content="nb_NO" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImageUrl} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImageUrl} />

      <script type="application/ld+json" set:html={JSON.stringify(webAppSchema)} />

      <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="48x48" href="/favicons/favicon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
      <meta name="theme-color" content="#F8F9FA" />
      <link rel="manifest" href="/favicons/site.webmanifest" />
    </head>
    <body class="bg-bg text-text font-sans min-h-screen">
      <slot />
      <script>
        import { inject } from '@vercel/analytics';
        inject();
      </script>
      <script>
        import { injectSpeedInsights } from '@vercel/speed-insights';
        injectSpeedInsights();
      </script>
    </body>
  </html>
  ```

- [ ] **Step 2: Verify build**

  ```bash
  npm run build
  ```

- [ ] **Step 3: Commit**

  ```bash
  git add src/layouts/
  git commit -m "feat: add Layout.astro with SEO head and analytics"
  ```

---

## Task 8: DayCard.astro

**Files:**
- Create: `src/components/DayCard.astro`

- [ ] **Step 1: Create DayCard**

  ```astro
  ---
  // src/components/DayCard.astro
  import type { SqueezeDay } from '../types';
  import '../utils/dayjs'; // side-effect: ensures nb locale is configured

  interface Props {
    day: SqueezeDay;
  }

  const { day } = Astro.props;
  const isInneklemt = day.description === 'inneklemt';
  const formattedDate = day.day.format('dddd D. MMMM');
  ---

  <div
    class:list={[
      'flex items-center px-4 py-3 text-sm sm:text-base gap-2',
      isInneklemt
        ? 'bg-highlight-tint border-l-4 border-highlight'
        : 'bg-surface',
    ]}
  >
    <span class:list={['capitalize', isInneklemt ? 'font-semibold text-text' : 'text-text-muted']}>
      {formattedDate}
    </span>
    <span class="text-text-muted">·</span>
    <span class:list={[isInneklemt ? 'font-semibold text-text' : 'text-text-muted']}>
      {day.description}
    </span>
  </div>
  ```

- [ ] **Step 2: Verify build**

  ```bash
  npm run build
  ```

- [ ] **Step 3: Commit**

  ```bash
  git add src/components/DayCard.astro
  git commit -m "feat: add DayCard component"
  ```

---

## Task 9: SqueezeGroup.astro

**Files:**
- Create: `src/components/SqueezeGroup.astro`

- [ ] **Step 1: Create SqueezeGroup**

  ```astro
  ---
  // src/components/SqueezeGroup.astro
  import type { SqueezeDayGroup } from '../types';
  import DayCard from './DayCard.astro';

  interface Props {
    group: SqueezeDayGroup;
  }

  const { group } = Astro.props;

  const inneklemtDays = group.filter((d) => d.description === 'inneklemt');
  const inneklemtCount = inneklemtDays.length;
  const totalDays = group.length;
  const nonInneklemtDays = totalDays - inneklemtCount;
  const valueRatio = (nonInneklemtDays / inneklemtCount).toFixed(1);

  const monthName = inneklemtDays[0]?.day.format('MMMM') ?? '';
  const dayWord = inneklemtCount === 1 ? 'inneklemt dag' : 'inneklemte dager';
  const summaryText = `${inneklemtCount} ${dayWord} i ${monthName}`;
  ---

  <details class="group bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
    <summary class="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-bg transition-colors">
      <div class="flex flex-col sm:flex-row sm:items-center sm:gap-3">
        <span class="font-semibold text-text capitalize">{summaryText}</span>
        <span class="text-text-muted text-sm">{totalDays} fridager totalt</span>
      </div>
      <div class="flex items-center gap-3 flex-shrink-0">
        <div class="tooltip-anchor">
          <span class="bg-highlight text-text text-sm font-bold px-2.5 py-1 rounded cursor-help select-none">
            {valueRatio}×
          </span>
          <div class="tooltip-content">
            Fridager du får per feriedag du tar ut. Høyere er bedre.
          </div>
        </div>
        <!-- Chevron rotates when <details> is open via Tailwind group-open variant -->
        <svg
          class="w-5 h-5 text-text-muted transition-transform duration-200 group-open:rotate-180"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </summary>
    <div class="divide-y divide-border border-t border-border">
      {group.map((day) => <DayCard day={day} />)}
    </div>
  </details>
  ```

- [ ] **Step 2: Verify build**

  ```bash
  npm run build
  ```

- [ ] **Step 3: Commit**

  ```bash
  git add src/components/SqueezeGroup.astro
  git commit -m "feat: add SqueezeGroup component with details/summary expand"
  ```

---

## Task 10: YearNav.astro

**Files:**
- Create: `src/components/YearNav.astro`

- [ ] **Step 1: Create YearNav**

  ```astro
  ---
  // src/components/YearNav.astro
  interface Props {
    year: number;
    prevYear: number;
    nextYear: number;
    minYear: number;
    maxYear: number;
  }

  const { year, prevYear, nextYear, minYear, maxYear } = Astro.props;
  const hasPrev = prevYear >= minYear;
  const hasNext = nextYear <= maxYear;
  ---

  <nav class="flex items-center justify-center gap-8 py-4" aria-label="Årsnavigasjon">
    {hasPrev ? (
      <a
        href={`/${prevYear}`}
        class="text-accent hover:underline font-medium"
        aria-label={`Se inneklemte dager i ${prevYear}`}
      >
        ← {prevYear}
      </a>
    ) : (
      <span class="text-text-muted opacity-30 select-none">←</span>
    )}

    <span class="text-2xl font-bold text-text">{year}</span>

    {hasNext ? (
      <a
        href={`/${nextYear}`}
        class="text-accent hover:underline font-medium"
        aria-label={`Se inneklemte dager i ${nextYear}`}
      >
        {nextYear} →
      </a>
    ) : (
      <span class="text-text-muted opacity-30 select-none">→</span>
    )}
  </nav>
  ```

- [ ] **Step 2: Verify build**

  ```bash
  npm run build
  ```

- [ ] **Step 3: Commit**

  ```bash
  git add src/components/YearNav.astro
  git commit -m "feat: add YearNav component"
  ```

---

## Task 11: FAQ.astro

**Files:**
- Create: `src/components/FAQ.astro`

- [ ] **Step 1: Create FAQ**

  ```astro
  ---
  // src/components/FAQ.astro
  const faqs = [
    {
      question: 'Hva er en inneklemt dag?',
      answer:
        'En inneklemt dag er en arbeidsdag som ligger mellom en helligdag og en helg, slik at du kan ta fri én dag og få en lang sammenhengende fritid.',
    },
    {
      question: 'Hvordan fungerer kalkulatoren?',
      answer:
        'Siden beregner automatisk alle inneklemte dager for valgt år basert på norske helligdager, og viser hvor mye fri du får per feriedag du bruker.',
    },
    {
      question: 'Støtter siden andre år enn inneværende år?',
      answer:
        'Ja, du kan bla gjennom alle år ved hjelp av pilknappene ved siden av årstallet.',
    },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
  ---

  <section class="mt-16 pt-10 border-t border-border">
    <h2 class="text-xl font-semibold text-text mb-6">Vanlige spørsmål</h2>
    <dl class="space-y-6">
      {faqs.map((faq) => (
        <div>
          <dt class="font-medium text-text mb-1">{faq.question}</dt>
          <dd class="text-text-muted leading-relaxed">{faq.answer}</dd>
        </div>
      ))}
    </dl>
  </section>

  <script type="application/ld+json" set:html={JSON.stringify(faqSchema)} />
  ```

- [ ] **Step 2: Verify build**

  ```bash
  npm run build
  ```

- [ ] **Step 3: Commit**

  ```bash
  git add src/components/FAQ.astro
  git commit -m "feat: add FAQ component with FAQPage JSON-LD"
  ```

---

## Task 12: [year].astro — main year page

**Files:**
- Create: `src/pages/[year].astro`
- Delete: `src/pages/index.astro` (Astro scaffold default — will recreate in Task 13)

- [ ] **Step 1: Delete the scaffold index.astro**

  ```bash
  rm src/pages/index.astro
  ```

- [ ] **Step 2: Create [year].astro**

  ```astro
  ---
  // src/pages/[year].astro
  import Layout from '../layouts/Layout.astro';
  import YearNav from '../components/YearNav.astro';
  import SqueezeGroup from '../components/SqueezeGroup.astro';
  import FAQ from '../components/FAQ.astro';
  import findSqueezeDays from '../utils/findSqueezeDays';
  // @ts-ignore
  import holidaysNorway from 'holidays-norway';

  export function getStaticPaths() {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
    return years.map((year) => ({ params: { year: String(year) } }));
  }

  const { year: yearParam } = Astro.params;
  const year = Number(yearParam);
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 5;
  const maxYear = currentYear + 5;

  const holidays = holidaysNorway(year);
  const squeezeDayGroups = findSqueezeDays(holidays, 4);

  const inneklemtCount = squeezeDayGroups.reduce(
    (acc, group) => acc + group.filter((d) => d.description === 'inneklemt').length,
    0
  );

  const title = `${inneklemtCount} inneklemte dager i ${year}`;
  const description = `Få oversikt over alle ${inneklemtCount} inneklemte dager i ${year} i Norge. Planlegg ferien smartere og få mest mulig fri!`;
  const canonicalUrl = `https://inneklemt.no/${year}`;
  ---

  <Layout
    title={title}
    description={description}
    year={year}
    inneklemtCount={inneklemtCount}
    canonicalUrl={canonicalUrl}
  >
    <div class="max-w-2xl mx-auto w-full px-4 py-12">
      <header class="mb-8">
        <h1 class="text-4xl sm:text-5xl font-bold text-text mb-2">
          Inneklemte dager
        </h1>
        <p class="text-text-muted">
          {inneklemtCount} inneklemte dager i {year}
        </p>
      </header>

      <YearNav
        year={year}
        prevYear={year - 1}
        nextYear={year + 1}
        minYear={minYear}
        maxYear={maxYear}
      />

      <div class="mt-2 mb-4 text-center">
        <a
          href={`/${year}.ics`}
          download
          class="text-sm text-accent hover:underline"
        >
          Legg til i kalender (.ics)
        </a>
      </div>

      <div class="mt-8 space-y-4">
        {squeezeDayGroups.map((group) => (
          <SqueezeGroup group={group} />
        ))}
      </div>

      <FAQ />
    </div>

    <footer class="border-t border-border py-8 text-center text-text-muted text-sm">
      <div class="flex justify-center gap-8 mb-3">
        <a href="https://github.com/JonLunde/" class="hover:text-accent transition-colors">
          GitHub
        </a>
        <a href="https://lunde.dev" class="hover:text-accent transition-colors">
          Lunde.dev
        </a>
      </div>
      <p>&copy; 2022 Jon Lunde</p>
    </footer>
  </Layout>
  ```

- [ ] **Step 3: Run build and verify 11 pages are generated**

  ```bash
  npm run build
  ```

  Expected output includes lines like:
  ```
  ▶ src/pages/[year].astro
    └─ /2021/index.html
    └─ /2022/index.html
    ...
    └─ /2031/index.html
  ```

- [ ] **Step 4: Commit**

  ```bash
  git add src/pages/
  git commit -m "feat: add [year].astro with getStaticPaths, all components wired"
  ```

---

## Task 13: index.astro — root redirect to current year

**Files:**
- Create: `src/pages/index.astro`

- [ ] **Step 1: Create index.astro**

  The root URL renders the current year's content with canonical pointing to `/{year}` — this avoids duplicate-content issues and works in pure SSG without a JS redirect.

  ```astro
  ---
  // src/pages/index.astro
  import Layout from '../layouts/Layout.astro';
  import YearNav from '../components/YearNav.astro';
  import SqueezeGroup from '../components/SqueezeGroup.astro';
  import FAQ from '../components/FAQ.astro';
  import findSqueezeDays from '../utils/findSqueezeDays';
  // @ts-ignore
  import holidaysNorway from 'holidays-norway';

  const year = new Date().getFullYear();
  const currentYear = year;
  const minYear = currentYear - 5;
  const maxYear = currentYear + 5;

  const holidays = holidaysNorway(year);
  const squeezeDayGroups = findSqueezeDays(holidays, 4);

  const inneklemtCount = squeezeDayGroups.reduce(
    (acc, group) => acc + group.filter((d) => d.description === 'inneklemt').length,
    0
  );

  const title = `${inneklemtCount} inneklemte dager i ${year}`;
  const description = `Få oversikt over alle ${inneklemtCount} inneklemte dager i ${year} i Norge. Planlegg ferien smartere og få mest mulig fri!`;
  const canonicalUrl = `https://inneklemt.no/${year}`;
  ---

  <Layout
    title={title}
    description={description}
    year={year}
    inneklemtCount={inneklemtCount}
    canonicalUrl={canonicalUrl}
  >
    <div class="max-w-2xl mx-auto w-full px-4 py-12">
      <header class="mb-8">
        <h1 class="text-4xl sm:text-5xl font-bold text-text mb-2">
          Inneklemte dager
        </h1>
        <p class="text-text-muted">
          {inneklemtCount} inneklemte dager i {year}
        </p>
      </header>

      <YearNav
        year={year}
        prevYear={year - 1}
        nextYear={year + 1}
        minYear={minYear}
        maxYear={maxYear}
      />

      <div class="mt-2 mb-4 text-center">
        <a
          href={`/${year}.ics`}
          download
          class="text-sm text-accent hover:underline"
        >
          Legg til i kalender (.ics)
        </a>
      </div>

      <div class="mt-8 space-y-4">
        {squeezeDayGroups.map((group) => (
          <SqueezeGroup group={group} />
        ))}
      </div>

      <FAQ />
    </div>

    <footer class="border-t border-border py-8 text-center text-text-muted text-sm">
      <div class="flex justify-center gap-8 mb-3">
        <a href="https://github.com/JonLunde/" class="hover:text-accent transition-colors">GitHub</a>
        <a href="https://lunde.dev" class="hover:text-accent transition-colors">Lunde.dev</a>
      </div>
      <p>&copy; 2022 Jon Lunde</p>
    </footer>
  </Layout>
  ```

- [ ] **Step 2: Build and check dev server**

  ```bash
  npm run build && npm run preview
  ```

  Open `http://localhost:4321` — verify the squeeze day list renders, year nav links work, expand/collapse works.

- [ ] **Step 3: Commit**

  ```bash
  git add src/pages/index.astro
  git commit -m "feat: add index.astro rendering current year with canonical"
  ```

---

## Task 14: iCal endpoint

**Files:**
- Create: `src/pages/[year].ics.ts`

- [ ] **Step 1: Create the iCal endpoint**

  ```typescript
  // src/pages/[year].ics.ts
  import type { APIRoute } from 'astro';
  // @ts-ignore
  import holidaysNorway from 'holidays-norway';
  import findSqueezeDays from '../utils/findSqueezeDays';

  export function getStaticPaths() {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
    return years.map((year) => ({ params: { year: String(year) } }));
  }

  export const GET: APIRoute = ({ params }) => {
    const year = Number(params.year);
    const holidays = holidaysNorway(year);
    const groups = findSqueezeDays(holidays, 4);

    const inneklemtDays = groups.flatMap((group) =>
      group.filter((d) => d.description === 'inneklemt')
    );

    const uid = (date: string) => `${date}-inneklemt@inneklemt.no`;

    const events = inneklemtDays.map((day) => {
      const date = day.day.format('YYYYMMDD');
      return [
        'BEGIN:VEVENT',
        `UID:${uid(date)}`,
        `DTSTART;VALUE=DATE:${date}`,
        `DTEND;VALUE=DATE:${date}`,
        'SUMMARY:Inneklemt dag',
        'DESCRIPTION:Inneklemt dag – bruk feriedag her for å få mest mulig fri.',
        'END:VEVENT',
      ].join('\r\n');
    });

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//inneklemt.no//NO',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      `X-WR-CALNAME:Inneklemte dager ${year}`,
      'X-WR-TIMEZONE:Europe/Oslo',
      ...events,
      'END:VCALENDAR',
    ].join('\r\n');

    return new Response(ics, {
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="inneklemte-dager-${year}.ics"`,
      },
    });
  };
  ```

- [ ] **Step 2: Build and verify .ics files are generated**

  ```bash
  npm run build
  ```

  Expected: `dist/2026.ics`, `dist/2025.ics` etc. present in build output.

- [ ] **Step 3: Verify iCal content is valid**

  ```bash
  cat dist/2026.ics
  ```

  Expected: `BEGIN:VCALENDAR` at top, one or more `VEVENT` blocks, `END:VCALENDAR` at bottom.

- [ ] **Step 4: Commit**

  ```bash
  git add src/pages/\[year\].ics.ts
  git commit -m "feat: add iCal download endpoint"
  ```

---

## Task 15: OG image endpoint

**Files:**
- Create: `src/pages/og/[year].png.ts`

- [ ] **Step 1: Create the OG image endpoint**

  ```typescript
  // src/pages/og/[year].png.ts
  import type { APIRoute } from 'astro';
  import satori from 'satori';
  import { Resvg } from '@resvg/resvg-js';
  import { readFileSync } from 'fs';
  import { join } from 'path';
  // @ts-ignore
  import holidaysNorway from 'holidays-norway';
  import findSqueezeDays from '../../utils/findSqueezeDays';

  export function getStaticPaths() {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
    return years.map((year) => ({ params: { year: String(year) } }));
  }

  export const GET: APIRoute = async ({ params }) => {
    const year = Number(params.year);
    const holidays = holidaysNorway(year);
    const groups = findSqueezeDays(holidays, 4);

    const inneklemtCount = groups.reduce(
      (acc, group) => acc + group.filter((d) => d.description === 'inneklemt').length,
      0
    );

    const fontData = readFileSync(
      join(process.cwd(), 'src/assets/fonts/Inter.ttf')
    );

    const svg = await satori(
      {
        type: 'div',
        props: {
          style: {
            width: '1200px',
            height: '630px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            backgroundColor: '#F8F9FA',
            padding: '80px',
            fontFamily: 'Inter',
          },
          children: [
            {
              type: 'p',
              props: {
                style: { fontSize: '28px', color: '#6B7280', margin: '0 0 20px 0' },
                children: 'inneklemt.no',
              },
            },
            {
              type: 'h1',
              props: {
                style: {
                  fontSize: '72px',
                  fontWeight: '700',
                  color: '#113E74',
                  margin: '0 0 32px 0',
                  lineHeight: '1.1',
                },
                children: `Inneklemte dager ${year}`,
              },
            },
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#FFD340',
                  borderRadius: '12px',
                  padding: '14px 28px',
                },
                children: {
                  type: 'span',
                  props: {
                    style: { fontSize: '36px', fontWeight: '700', color: '#111827' },
                    children: `${inneklemtCount} inneklemte dager`,
                  },
                },
              },
            },
          ],
        },
      },
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Inter',
            data: fontData,
            weight: 400,
            style: 'normal',
          },
        ],
      }
    );

    const resvg = new Resvg(svg);
    const png = resvg.render().asPng();

    return new Response(png, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  };
  ```

- [ ] **Step 2: Build and verify PNG files are generated**

  ```bash
  npm run build
  ```

  Expected: `dist/og/2026.png`, `dist/og/2025.png` etc. present in build output.

- [ ] **Step 3: Open an OG image to verify it looks right**

  Open `dist/og/2026.png` in an image viewer. Expected: off-white background, dark blue heading "Inneklemte dager 2026", amber badge with inneklemt count.

- [ ] **Step 4: Commit**

  ```bash
  git add "src/pages/og/[year].png.ts"
  git commit -m "feat: add OG image generation with satori"
  ```

---

## Task 16: Dynamic sitemap

**Files:**
- Create: `src/pages/sitemap.xml.ts`
- Delete: `public/sitemap.xml` (replaced by the dynamic endpoint)

- [ ] **Step 1: Delete the static sitemap**

  ```bash
  rm public/sitemap.xml
  ```

- [ ] **Step 2: Create the dynamic sitemap endpoint**

  ```typescript
  // src/pages/sitemap.xml.ts
  import type { APIRoute } from 'astro';

  export const GET: APIRoute = () => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

    const urls = years
      .map((year) => {
        const diff = Math.abs(year - currentYear);
        const changefreq = year === currentYear ? 'monthly' : 'yearly';
        const priority =
          year === currentYear ? '1.0' : diff === 1 ? '0.8' : '0.6';
        return `  <url>
    <loc>https://inneklemt.no/${year}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
      })
      .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
  </urlset>`;

    return new Response(xml, {
      headers: { 'Content-Type': 'application/xml' },
    });
  };
  ```

- [ ] **Step 3: Build and verify sitemap**

  ```bash
  npm run build && cat dist/sitemap.xml
  ```

  Expected: 11 `<url>` entries. Current year has `<priority>1.0</priority>` and `<changefreq>monthly</changefreq>`.

- [ ] **Step 4: Commit**

  ```bash
  git add src/pages/sitemap.xml.ts
  git rm public/sitemap.xml
  git commit -m "feat: replace static sitemap with dynamic generated endpoint"
  ```

---

## Task 17: Final verification and deploy

**Files:** No new files — build and push.

- [ ] **Step 1: Full production build**

  ```bash
  npm run build
  ```

  Expected: Zero errors, zero warnings about missing files.

- [ ] **Step 2: Preview production build locally**

  ```bash
  npm run preview
  ```

  Check:
  - Root URL (`/`) shows current year squeeze days
  - Year nav links (`← 2025`, `2027 →`) navigate correctly
  - Cards expand/collapse via `<details>`
  - Value ratio tooltip appears on hover
  - "Legg til i kalender" link downloads a `.ics` file
  - Page title in browser tab matches `"{N} inneklemte dager i {year}"`

- [ ] **Step 3: Push to main**

  ```bash
  git push
  ```

  Vercel auto-deploys on push. Monitor the Vercel dashboard for build success.

- [ ] **Step 4: Verify Vercel build settings**

  In the Vercel dashboard, confirm:
  - Framework preset: **Astro** (auto-detected)
  - Build command: `astro build`
  - Output directory: `dist`

  If not auto-detected, set these manually under Project → Settings → Build & Development Settings.

- [ ] **Step 5: Submit sitemap to Google Search Console**

  1. Open [Google Search Console](https://search.google.com/search-console)
  2. Select the `inneklemt.no` property
  3. Go to **Sitemaps** in the left nav
  4. Enter `https://inneklemt.no/sitemap.xml` and click **Submit**

- [ ] **Step 6: Request indexing for current year URL**

  1. In Google Search Console, paste `https://inneklemt.no/2026` into the URL inspection bar
  2. Click **Request Indexing**

  This speeds up the initial crawl. Google will process it within hours to days.
