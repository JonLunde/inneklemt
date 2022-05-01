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

interface Holiday {
  name: string;
  date: Date;
}

export default function IndexPage() {
  const [chosenYear, setChosenYear] = useState(dayjs().year());
  const [squeezeDays, setSqueezeDays] = useState(2);

  const weekends = [6, 7];

  const holidays = (holidaysNorway(2023) as Holiday[])
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
  const squeezeDaysList: Dayjs[] = [];
  holidays.forEach((holiday, i) => {
    const { date } = holiday;
    const momentDate = dayjs(date);
    const weekday = momentDate.isoWeekday();

    const holidayFallsOnWeekend = weekends.includes(momentDate.isoWeekday());
    const followsAnotherHoliday = holidays.some(
      (holiday) =>
        dayjs(holiday.date).dayOfYear() === momentDate.dayOfYear() - 1
    );

    const proceedesAnotherHoliday = holidays.some(
      (holiday) =>
        dayjs(holiday.date).dayOfYear() === momentDate.dayOfYear() + 1
    );

    if (holidayFallsOnWeekend) return;
    if (!followsAnotherHoliday) {
      const daysToPreviousWeekend = weekday - 1;

      if (daysToPreviousWeekend <= squeezeDays) {
        for (let i = 1; i <= daysToPreviousWeekend; i++) {
          squeezeDaysList.push(momentDate.subtract(i, 'day'));
        }
      }
    }
    if (!proceedesAnotherHoliday) {
      const daysToNextWeekend = 5 - weekday;

      if (daysToNextWeekend <= squeezeDays) {
        for (let i = 1; i <= daysToNextWeekend; i++) {
          squeezeDaysList.push(momentDate.add(i, 'day'));
        }
      }
    }
  });

  squeezeDaysList.sort(
    (holidayA, holidayB) => holidayA.dayOfYear() - holidayB.dayOfYear()
  );

  return (
    <div>
      <h1>HELLIGDAGER</h1>
      {holidays.map((holiday, index) => {
        const testDate = dayjs(holiday.date).format('dddd Do MMMM');
        return (
          <p
            key={index}
          >{`${holiday.name} - ${holiday.date} - ${holiday.dayOfWeek}`}</p>
        );
      })}

      <h1>SQUEEZE</h1>
      {squeezeDaysList.map((squeezeDay, index) => (
        <p key={index}>{squeezeDay.format('dddd D MMMM')}</p>
      ))}
    </div>
  );
}
