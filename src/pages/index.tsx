import { default as dayjs } from "dayjs";
import { default as isoWeekday } from "dayjs/plugin/isoWeek"; // import plugin
import { default as dayOfYear } from "dayjs/plugin/dayOfYear"; // import plugin
import "dayjs/locale/nb"; // import locale
dayjs.extend(isoWeekday); // use plugin
dayjs.extend(dayOfYear); // use plugin
dayjs.locale("nb"); // use locale
// @ts-ignore
import holidaysNorway from "holidays-norway";
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Content from "../components/Content";
import findSqueezeDays from "../utils/findSqueezeDays";
import Head from "next/head";

export default function IndexPage() {
  const [selectedYear, setSelectedYear] = useState<number>(dayjs().year());
  const [squeezeDayRange, setSqueezeDayRange] = useState(3);

  const holidays = holidaysNorway(selectedYear);

  const squeezeDayGroups = findSqueezeDays(holidays, squeezeDayRange);

  //! "Loading skygger" for å bedre "First Contentful Paint"?
  return (
    <div>
      <div className="flex flex-col justify-between pt-3 min-h-screen max-w-md sm:max-w-4xl m-auto">
        <Head>
          <title>{`Inneklemte dager ${dayjs(new Date()).year()}`}</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
          <meta name="author" content="Jon Lunde" />
          <meta
            name="description"
            content={`Få oversikt over alle inneklemte dager i ${dayjs(
              new Date()
            ).year()}. Slik at du kan få mest mulig ut av feriedagene dine!`}
          />
          <meta
            name="keywords"
            content="inneklemt, inneklemte, dager, ferie, fri, langhelg, helg, ovalweekend, oval, weekend"
          />
          <link rel="canonical" href="https://www.inneklemt.no" />

          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/favicons/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicons/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicons/favicon-16x16.png"
          />
          <meta name="theme-color" content="#151515" />
          <link rel="manifest" href="/favicons/site.webmanifest" />
        </Head>
        <Header
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          squeezeDayRange={squeezeDayRange}
          setSqueezeDayRange={setSqueezeDayRange}
        />
        <Content
          squeezeDayGroups={squeezeDayGroups}
          squeezeDayRange={squeezeDayRange}
        />
      </div>
      <Footer />
    </div>
  );
}
