import { Dayjs } from 'dayjs';

export interface Holiday {
  name: string;
  date: Date;
}

export interface SqueezeDay {
  day: Dayjs;
  description: string;
}

export type SqueezeDayGroup = SqueezeDay[];
