import { Holiday, SqueezeDayGroup } from "../types";
import { default as dayjs } from "dayjs";
import { default as isoWeekday } from "dayjs/plugin/isoWeek"; // import plugin
import { default as dayOfYear } from "dayjs/plugin/dayOfYear"; // import plugin
import "dayjs/locale/nb"; // import locale
dayjs.extend(isoWeekday); // use plugin
dayjs.extend(dayOfYear); // use plugin
dayjs.locale("nb"); // use locale

const weekends = [6, 7];

//! Dette fungerer.
//! Kan forbedres ved å finne strekker på tvers av inneklemte grupper. "SPLITTET INNEKLEMT" Feks. slutten av året kan man kombinere inneklemt mellom jul og helg, og helgen og nyttår. Feks. 2024, 3 dagers splittet inneklemt mellom 25. des - 01. jan
//! Splittet inneklemt er kun aktuelt i romjulen. Og om (kristi himmelfart eller pinsen) faller rundt 17. mai eller 01. mai.
//! Tror jeg kan håndtere dette ved å iterere over alle datoer og sjekke om de er inneklemte. Istedet for å ta utgangspunkt i helligdagene som jeg gjør her. Eventuelt skrive om denne logikken til å ikke stoppe mot helger/helligdager, men fortsette å lete etter inneklemte dager...

const transformHolidays = (holidays: Holiday[]) => {
  return holidays
    .sort((a, b) => dayjs(a.date).dayOfYear() - dayjs(b.date).dayOfYear())
    .map((holiday) => {
      return {
        ...holiday,
        dayOfWeek: dayjs(holiday.date).isoWeekday(),
        name:
          holiday.name === "Kristi Himmelsprettsdag"
            ? "Kristi himmelfartsdag"
            : holiday.name,
      };
    });
};

const addPreviousHolidays = (
  squeezeDayGroup: SqueezeDayGroup,
  holidays: Holiday[]
) => {
  if (!squeezeDayGroup.length) return squeezeDayGroup;

  let previousDay = squeezeDayGroup[0].day.subtract(1, "day");

  while (true) {
    const holiday = holidays.find(
      (holiday) => dayjs(holiday.date).dayOfYear() === previousDay.dayOfYear()
    );
    if (weekends.includes(previousDay.isoWeekday()) || holiday) {
      squeezeDayGroup.splice(0, 0, {
        day: previousDay,
        description: holiday ? holiday.name : "helg",
      });

      previousDay = previousDay.subtract(1, "day");
    } else {
      break;
    }
  }
  return squeezeDayGroup;
};

const addFollowingHolidays = (
  squeezeDayGroup: SqueezeDayGroup,
  holidays: Holiday[]
) => {
  if (!squeezeDayGroup.length) return squeezeDayGroup;

  let followingHoliday = squeezeDayGroup[squeezeDayGroup.length - 1].day.add(
    1,
    "day"
  );

  while (true) {
    const holiday = holidays.find(
      (holiday) =>
        dayjs(holiday.date).dayOfYear() === followingHoliday.dayOfYear()
    );
    if (weekends.includes(followingHoliday.isoWeekday()) || holiday) {
      squeezeDayGroup.splice(squeezeDayGroup.length, 0, {
        day: followingHoliday,
        description: holiday ? holiday.name : "helg",
      });

      followingHoliday = followingHoliday.add(1, "day");
    } else {
      break;
    }
  }
  return squeezeDayGroup;
};

const findSqueezeDays = (holidays: Holiday[], squeezeDaysRange: number) => {
  const squeezeDayGroups: SqueezeDayGroup[] = [];

  // Sort and rename
  const transformedHolidays = transformHolidays(holidays);

  // Remove new year's eve
  transformedHolidays.pop();
  transformedHolidays?.forEach((holiday, i) => {
    const { date } = holiday;
    const holidayDate = dayjs(date);
    const holidayWeekday = holidayDate.isoWeekday();
    const holidayDayOfYear = holidayDate.dayOfYear();

    const holidayFallsOnWeekend = weekends.includes(holidayWeekday);

    const followsAnotherHoliday = transformedHolidays.some(
      (holiday) => dayjs(holiday.date).dayOfYear() === holidayDayOfYear - 1
    );

    const proceedesAnotherHoliday = transformedHolidays.some(
      (holiday) => dayjs(holiday.date).dayOfYear() === holidayDayOfYear + 1
    );

    if (holidayFallsOnWeekend) return;

    if (!followsAnotherHoliday && holidayDayOfYear !== 1) {
      const daysToPreviousWeekend = holidayWeekday - 1;
      if (daysToPreviousWeekend <= squeezeDaysRange) {
        const squeezeDayGroup: SqueezeDayGroup = [];
        for (let i = 1; i <= daysToPreviousWeekend; i++) {
          squeezeDayGroup.push({
            day: holidayDate.subtract(i, "day"),
            description: "inneklemt",
          });
        }
        squeezeDayGroup.sort((a, b) => a.day.dayOfYear() - b.day.dayOfYear());

        // Add previous dayc
        addPreviousHolidays(squeezeDayGroup, transformedHolidays);

        // Add following day
        addFollowingHolidays(squeezeDayGroup, transformedHolidays);

        if (squeezeDayGroup.length > 0) {
          squeezeDayGroups.push(squeezeDayGroup);
        }
      }
    }
    if (!proceedesAnotherHoliday) {
      const daysToNextWeekend = 5 - holidayWeekday;

      if (daysToNextWeekend <= squeezeDaysRange) {
        const squeezeDayGroup = [];
        for (let i = 1; i <= daysToNextWeekend; i++) {
          squeezeDayGroup.push({
            day: holidayDate.add(i, "day"),
            description: "inneklemt",
          });
        }
        squeezeDayGroup.sort((a, b) => a.day.dayOfYear() - b.day.dayOfYear());

        // Add previous day
        addPreviousHolidays(squeezeDayGroup, transformedHolidays);

        // Add following day
        addFollowingHolidays(squeezeDayGroup, transformedHolidays);
        if (squeezeDayGroup.length > 0) {
          squeezeDayGroups.push(squeezeDayGroup);
        }
      }
    }
  });
  const lastDayOfYear = dayjs(
    dayjs(
      transformedHolidays.find((holiday) => {
        return dayjs(holiday.date).format("DD.MM") === "25.12";
      })?.date
    ).add(6, "day")
  );

  const lastDayOfYearWeekday = dayjs(
    dayjs(
      transformedHolidays.find(
        (holiday) => dayjs(holiday.date).format("DD.MM") === "25.12"
      )?.date
    ).add(6, "day")
  ).isoWeekday();
  const daysToNextWeekend = lastDayOfYearWeekday - 1;

  if (daysToNextWeekend <= squeezeDaysRange) {
    const squeezeDayGroup = [];
    for (let i = 0; i <= daysToNextWeekend; i++) {
      squeezeDayGroup.push({
        day: lastDayOfYear.subtract(i, "day"),
        description: "inneklemt",
      });
    }
    squeezeDayGroup.sort((a, b) => a.day.dayOfYear() - b.day.dayOfYear());

    // Add previous day
    addPreviousHolidays(squeezeDayGroup, transformedHolidays);

    // Add following day
    addFollowingHolidays(squeezeDayGroup, transformedHolidays);
    //! Tar vel ikke høyde for eventuell helg etter 1. jan

    squeezeDayGroups.push(squeezeDayGroup);
  }
  return squeezeDayGroups;
};

export default findSqueezeDays;
