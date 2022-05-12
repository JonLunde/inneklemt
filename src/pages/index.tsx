import { Dayjs, default as dayjs } from 'dayjs';
import { default as isoWeekday } from 'dayjs/plugin/isoWeek'; // import plugin
import { default as dayOfYear } from 'dayjs/plugin/dayOfYear'; // import plugin
import 'dayjs/locale/nb'; // import locale
dayjs.extend(isoWeekday); // use plugin
dayjs.extend(dayOfYear); // use plugin
dayjs.locale('nb'); // use locale
// @ts-ignore
import holidaysNorway from 'holidays-norway';
import { useState } from 'react';
import findSqueezeDays from '../utils/findSqueezeDays';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Content from '../components/Content';

export default function IndexPage() {
  const [selectedYear, setSelectedYear] = useState<Dayjs>(dayjs());
  const [squeezeDayRange, setSqueezeDayRange] = useState(1);

  const holidays = holidaysNorway(selectedYear.year());

  const squeezeDayGroups = findSqueezeDays(holidays, squeezeDayRange);

  //? Design: Dele inn i måneder? Obs; kanskje noen innklemte grupper strekker seg over flere måneder? Obs. 1. mai

  return (
    <div className="flex flex-col justify-between h-screen pt-10 pb-5 px-5 sm:px-20 ">
      <Header selectedYear={selectedYear} setSelectedYear={setSelectedYear} />
      <Content
        squeezeDayGroups={squeezeDayGroups}
        squeezeDayRange={squeezeDayRange}
        setSqueezeDayRange={setSqueezeDayRange}
      />
      <Footer />
    </div>
  );
}
