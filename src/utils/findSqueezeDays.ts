import { Holiday } from '../types';
import { Dayjs, default as dayjs } from 'dayjs';
import { default as isoWeekday } from 'dayjs/plugin/isoWeek'; // import plugin
import { default as dayOfYear } from 'dayjs/plugin/dayOfYear'; // import plugin
import 'dayjs/locale/nb'; // import locale
dayjs.extend(isoWeekday); // use plugin
dayjs.extend(dayOfYear); // use plugin
dayjs.locale('nb'); // use locale

const weekends = [6, 7];

const findSqueezeDays = (holidays: Holiday[], SqueezeDaysRange: number) => {
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

      if (daysToPreviousWeekend <= SqueezeDaysRange) {
        for (let i = 1; i <= daysToPreviousWeekend; i++) {
          squeezeDaysList.push(momentDate.subtract(i, 'day'));
        }
      }
    }
    if (!proceedesAnotherHoliday) {
      const daysToNextWeekend = 5 - weekday;

      if (daysToNextWeekend <= SqueezeDaysRange) {
        for (let i = 1; i <= daysToNextWeekend; i++) {
          squeezeDaysList.push(momentDate.add(i, 'day'));
        }
      }
    }
  });

  // squeezeDaysList.push(dayjs(new Date()));
  // squeezeDaysList.push(dayjs(new Date()));
  // squeezeDaysList.push(dayjs(new Date()));
  // squeezeDaysList.push(dayjs(new Date()));

  //! Legg på hvilken helligdag som forårsaker inneklemte
  return squeezeDaysList.sort((a, b) => a.dayOfYear() - b.dayOfYear());
};

export default findSqueezeDays;
