import { Dayjs } from 'dayjs';
import React from 'react';
import { SqueezeDay } from '../types';

interface DayCardProps {
  squeezeDay: SqueezeDay;
  index: number;
  squeezeDayRange: number;
}

function DayCard(props: DayCardProps) {
  const { squeezeDay, index, squeezeDayRange } = props;
  return (
    <div
      className={`flex justify-center border-2 rounded-lg my-1 py-3 px-2  ${
        squeezeDay.description === 'inneklemt'
          ? 'bg-purple-800'
          : 'bg-purple-500'
      } `}
    >
      <div className="flex flex-col">
        <p className="text-lg text-neutral-100  font-semibold whitespace-nowrap">
          {`${squeezeDay.day.format('dddd D. MMMM')} - ${
            squeezeDay.description
          }`}
        </p>
      </div>
    </div>
  );
}

export default DayCard;
