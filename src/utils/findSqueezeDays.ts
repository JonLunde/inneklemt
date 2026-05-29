import type { Holiday, SqueezeDayGroup } from "../types";
import { default as dayjs } from "dayjs";
import { default as isoWeekday } from "dayjs/plugin/isoWeek";
import { default as dayOfYear } from "dayjs/plugin/dayOfYear";
import "dayjs/locale/nb";
dayjs.extend(isoWeekday);
dayjs.extend(dayOfYear);
dayjs.locale("nb");

const weekends = [6, 7];

const transformHolidays = (holidays: Holiday[]) => {
  return holidays
    .sort((a, b) => dayjs(a.date).dayOfYear() - dayjs(b.date).dayOfYear())
    .map((holiday) => ({
      ...holiday,
      dayOfWeek: dayjs(holiday.date).isoWeekday(),
      name:
        holiday.name === "Kristi Himmelsprettsdag"
          ? "Kristi himmelfartsdag"
          : holiday.name,
    }));
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
  let followingHoliday = squeezeDayGroup[squeezeDayGroup.length - 1].day.add(1, "day");
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
  const transformedHolidays = transformHolidays(holidays);
  transformedHolidays.pop();

  transformedHolidays?.forEach((holiday) => {
    const { date } = holiday;
    const holidayDate = dayjs(date);
    const holidayWeekday = holidayDate.isoWeekday();
    const holidayDayOfYear = holidayDate.dayOfYear();
    const holidayFallsOnWeekend = weekends.includes(holidayWeekday);
    const followsAnotherHoliday = transformedHolidays.some(
      (h) => dayjs(h.date).dayOfYear() === holidayDayOfYear - 1
    );
    const proceedesAnotherHoliday = transformedHolidays.some(
      (h) => dayjs(h.date).dayOfYear() === holidayDayOfYear + 1
    );

    if (holidayFallsOnWeekend) return;

    if (!followsAnotherHoliday && holidayDayOfYear !== 1) {
      const daysToPreviousWeekend = holidayWeekday - 1;
      if (daysToPreviousWeekend <= squeezeDaysRange) {
        const squeezeDayGroup: SqueezeDayGroup = [];
        for (let i = 1; i <= daysToPreviousWeekend; i++) {
          squeezeDayGroup.push({ day: holidayDate.subtract(i, "day"), description: "inneklemt" });
        }
        squeezeDayGroup.sort((a, b) => a.day.dayOfYear() - b.day.dayOfYear());
        addPreviousHolidays(squeezeDayGroup, transformedHolidays);
        addFollowingHolidays(squeezeDayGroup, transformedHolidays);
        if (squeezeDayGroup.length > 0) squeezeDayGroups.push(squeezeDayGroup);
      }
    }

    if (!proceedesAnotherHoliday) {
      const daysToNextWeekend = 5 - holidayWeekday;
      if (daysToNextWeekend <= squeezeDaysRange) {
        const squeezeDayGroup: SqueezeDayGroup = [];
        for (let i = 1; i <= daysToNextWeekend; i++) {
          squeezeDayGroup.push({ day: holidayDate.add(i, "day"), description: "inneklemt" });
        }
        squeezeDayGroup.sort((a, b) => a.day.dayOfYear() - b.day.dayOfYear());
        addPreviousHolidays(squeezeDayGroup, transformedHolidays);
        addFollowingHolidays(squeezeDayGroup, transformedHolidays);
        if (squeezeDayGroup.length > 0) squeezeDayGroups.push(squeezeDayGroup);
      }
    }
  });

  const christmasDay = transformedHolidays.find(
    (h) => dayjs(h.date).format("DD.MM") === "25.12"
  );
  if (christmasDay) {
    const lastDayOfYear = dayjs(dayjs(christmasDay.date).add(6, "day"));
    const lastDayOfYearWeekday = lastDayOfYear.isoWeekday();
    const daysToNextWeekend = lastDayOfYearWeekday - 1;
    if (daysToNextWeekend <= squeezeDaysRange) {
      const squeezeDayGroup: SqueezeDayGroup = [];
      for (let i = 0; i <= daysToNextWeekend; i++) {
        squeezeDayGroup.push({ day: lastDayOfYear.subtract(i, "day"), description: "inneklemt" });
      }
      squeezeDayGroup.sort((a, b) => a.day.dayOfYear() - b.day.dayOfYear());
      addPreviousHolidays(squeezeDayGroup, transformedHolidays);
      addFollowingHolidays(squeezeDayGroup, transformedHolidays);
      squeezeDayGroups.push(squeezeDayGroup);
    }
  }

  return squeezeDayGroups;
};

export default findSqueezeDays;
