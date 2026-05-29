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
import Description from "../components/Description";

export default function IndexPage() {
  const [selectedYear, setSelectedYear] = useState<number>(dayjs().year());
  const [squeezeDayRange, setSqueezeDayRange] = useState(4);

  const holidays = holidaysNorway(selectedYear);

  const squeezeDayGroups = findSqueezeDays(holidays, squeezeDayRange);

  //! "Loading skygger" for å bedre "First Contentful Paint"?
  return (
    <div>
      <div className="flex flex-col justify-between pt-3 px-2 min-h-screen  sm:max-w-4xl m-auto">
        <Head>
          <title>{`Inneklemte dager i ${dayjs(new Date()).year()}`}</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
          <meta name="author" content="Jon Lunde" />
          <meta
            name="description"
            content={`Få oversikt over alle inneklemte dager i ${dayjs(
              new Date()
            ).year()} i Norge. Planlegg ferien smartere og få mest mulig fri!`}
          />
          <meta
            name="keywords"
            content="inneklemt, inneklemte, dager, ferie, fri, langhelg, helg, ovalweekend, oval, weekend, norge, norsk, fridager, planlegge ferie"
          />
          <meta name="robots" content="index, follow" />
          <link rel="canonical" href="https://inneklemt.no" />

          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://inneklemt.no" />
          <meta property="og:site_name" content="Inneklemt.no" />
          <meta property="og:locale" content="nb_NO" />
          <meta
            property="og:title"
            content={`Inneklemte dager i ${dayjs(new Date()).year()}`}
          />
          <meta
            property="og:description"
            content="Få oversikt over alle inneklemte dager i Norge — planlegg ferien smartere og få mest mulig fri!"
          />
          <meta
            property="og:image"
            content="https://inneklemt.no/favicons/apple-touch-icon.png"
          />

          <meta name="twitter:card" content="summary" />
          <meta
            name="twitter:title"
            content={`Inneklemte dager i ${dayjs(new Date()).year()}`}
          />
          <meta
            name="twitter:description"
            content="Få oversikt over alle inneklemte dager i Norge — planlegg ferien smartere og få mest mulig fri!"
          />
          <meta
            name="twitter:image"
            content="https://inneklemt.no/favicons/apple-touch-icon.png"
          />

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebApplication",
                name: "Inneklemt.no",
                url: "https://inneklemt.no",
                description:
                  "Oversikt over inneklemte dager i Norge for å hjelpe deg med å planlegge ferien smartere.",
                applicationCategory: "Utility",
                inLanguage: "nb-NO",
                operatingSystem: "Web",
                offers: { "@type": "Offer", price: "0", priceCurrency: "NOK" },
              }),
            }}
          />

          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/favicons/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="48x48"
            href="/favicons/favicon.png"
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
        <main className="flex flex-col justify-center items-center ">
          <Description selectedYear={selectedYear} />
        <Content
          squeezeDayGroups={squeezeDayGroups}
          squeezeDayRange={squeezeDayRange}
        />
        </main>
      </div>
      <Footer />
    </div>
  );
}
