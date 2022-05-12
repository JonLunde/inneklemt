import { Holiday, SqueezeDayGroup } from '../types';
import { default as dayjs } from 'dayjs';
import { default as isoWeekday } from 'dayjs/plugin/isoWeek'; // import plugin
import { default as dayOfYear } from 'dayjs/plugin/dayOfYear'; // import plugin
import 'dayjs/locale/nb'; // import locale
dayjs.extend(isoWeekday); // use plugin
dayjs.extend(dayOfYear); // use plugin
dayjs.locale('nb'); // use locale

const weekends = [6, 7];

//! Er ikke alltid bare én helligdag på hver side. Skal jeg highlighte hele fri-strekket?
//! Kanskje markere ut alle mulige fristrekker de neste årene og se om appen matcher? Har skummer gjennom og den dekker alle jeg kan se... (hverfall for 3 dagers range)
//! Noe rart skjer på 1.jan i 2025...

const findSqueezeDays = (holidays: Holiday[], SqueezeDaysRange: number) => {
  const squeezeDayGroups: SqueezeDayGroup[] = [];

  // Sort and rename
  const transformedHolidays = holidays
    .sort((a, b) => dayjs(a.date).dayOfYear() - dayjs(b.date).dayOfYear())
    .map((holiday) => {
      console.log(' holiday.date.toString()', holiday.date.toString());
      return {
        ...holiday,
        dayOfWeek: dayjs(holiday.date).isoWeekday(),
        name:
          holiday.name === 'Kristi Himmelsprettsdag'
            ? 'Kristi himmelfartsdag'
            : holiday.name,
      };
    });

  // Remove new year's eve
  transformedHolidays.pop();

  console.log(transformedHolidays);

  transformedHolidays?.forEach((holiday, i) => {
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
        const squeezeDayGroup = [];
        for (let i = 1; i <= daysToPreviousWeekend; i++) {
          squeezeDayGroup.push({
            day: momentDate.subtract(i, 'day'),
            description: 'inneklemt',
          });
        }
        squeezeDayGroup.sort((a, b) => a.day.dayOfYear() - b.day.dayOfYear());

        // Add previous day
        if (squeezeDayGroup.length > 0) {
          squeezeDayGroup.splice(0, 0, {
            day: squeezeDayGroup[0].day.subtract(1, 'day'),
            description: 'helg',
          });
        }
        // Add following day
        if (squeezeDayGroup.length > 0) {
          squeezeDayGroup.splice(squeezeDayGroup.length, 0, {
            day: squeezeDayGroup[squeezeDayGroup.length - 1].day.add(1, 'day'),
            description: holiday.name,
          });
        }

        squeezeDayGroups.push(
          squeezeDayGroup.sort((a, b) => a.day.dayOfYear() - b.day.dayOfYear())
        );
      }
    }
    if (!proceedesAnotherHoliday) {
      const daysToNextWeekend = 5 - weekday;

      if (daysToNextWeekend <= SqueezeDaysRange) {
        const squeezeDayGroup = [];
        for (let i = 1; i <= daysToNextWeekend; i++) {
          squeezeDayGroup.push({
            day: momentDate.add(i, 'day'),
            description: 'inneklemt',
          });
        }
        squeezeDayGroup.sort((a, b) => a.day.dayOfYear() - b.day.dayOfYear());

        // Add previous day
        if (squeezeDayGroup.length > 0) {
          squeezeDayGroup.splice(0, 0, {
            day: squeezeDayGroup[0].day.subtract(1, 'day'),
            description: holiday.name,
          });
        }
        // Add following day
        if (squeezeDayGroup.length > 0) {
          squeezeDayGroup.splice(squeezeDayGroup.length, 0, {
            day: squeezeDayGroup[squeezeDayGroup.length - 1].day.add(1, 'day'),
            description: 'helg',
          });
        }

        squeezeDayGroups.push(squeezeDayGroup);
      }
    }
  });

  //! Legg på hvilken helligdag som forårsaker inneklemte
  // return squeezeDayGroups.sort((a, b) => a.dayOfYear() - b.dayOfYear());
  return squeezeDayGroups;
};

export default findSqueezeDays;
