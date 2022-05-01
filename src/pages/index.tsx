import { default as dayjs } from 'dayjs';
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

export default function IndexPage() {
  const [chosenYear, setChosenYear] = useState(dayjs().year());
  const [squeezeDays, setSqueezeDays] = useState(2);

  const holidays = (holidaysNorway(chosenYear) as Holiday[])
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

  const squeezeTest = findSqueezeDays(holidays, squeezeDays);

  return (
    <div>
      <h1>{`Inneklemte dager ${chosenYear}`}</h1>
      {squeezeTest.map((squeezeDay, index) => (
        <p key={index}>{squeezeDay.format('dddd D MMMM')}</p>
      ))}
    </div>
  );
}
