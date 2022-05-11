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
import { Holiday } from '../types';
import findSqueezeDays from '../utils/findSqueezeDays';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Container from '../components/Container';

export default function IndexPage() {
  const [selectedYear, setSelectedYear] = useState<Dayjs>(dayjs());
  const [squeezeDayRange, setSqueezeDayRange] = useState(1);

  const holidays = (holidaysNorway(selectedYear.year()) as Holiday[])
    .map((holiday) => {
      return {
        ...holiday,
        dayOfWeek: dayjs(holiday.date).isoWeekday(),
      };
    })
    .sort(
      (holidayA: Holiday, holidayB: Holiday) =>
        new Date(holidayA.date).getMilliseconds() -
        new Date(holidayB.date).getMilliseconds()
    );

  const squeezeDays = findSqueezeDays(holidays, squeezeDayRange);

  return (
    <div className="flex flex-col justify-between h-screen pt-10 pb-5 px-20">
      <Header selectedYear={selectedYear} setSelectedYear={setSelectedYear} />
      <Container
        squeezeDays={squeezeDays}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        squeezeDayRange={squeezeDayRange}
        setSqueezeDayRange={setSqueezeDayRange}
      />
      <Footer />
    </div>
  );
}
