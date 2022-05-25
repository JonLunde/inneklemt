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
import findSqueezeDays2 from '../utils/findSqueezeDays2';

export default function IndexPage() {
  const [selectedYear, setSelectedYear] = useState<number>(dayjs().year());
  const [squeezeDayRange, setSqueezeDayRange] = useState(3);

  const holidays = holidaysNorway(selectedYear);

  const squeezeDayGroups = findSqueezeDays2(holidays, squeezeDayRange);

  //? Design: Dele inn i måneder? Obs; kanskje noen innklemte grupper strekker seg over flere måneder? Obs. 1. mai

  return (
    <div className="flex flex-col justify-between pt-10 pb-5 px-2 sm:px-20 min-h-screen">
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
