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

  //? Design: Dele inn i måneder? Obs; kanskje noen innklemte grupper strekker seg over flere måneder? Obs. 1. mai

  return (
    <div className="flex flex-col justify-between pt-3 pb-5 px-3  min-h-screen max-w-md sm:max-w-4xl m-auto">
      <Head>
        <title>Inneklemt</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="author" content="Jon Lunde" />
        <meta name="description" content="Få oversikt over inneklemte dager" />
        <meta
          name="keywords"
          content="inneklemt, inneklemte, dager, ferie, fri, langhelg, helg, ovalweekend, oval, weekend"
        />
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
      <Footer />
    </div>
  );
}
