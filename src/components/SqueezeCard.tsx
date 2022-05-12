import { Dayjs } from 'dayjs';
import React from 'react';
import { SqueezeDay } from '../types';

interface SqueezeCardProps {
  squeezeDay: SqueezeDay;
  index: number;
  squeezeDayRange: number;
}

//! Sammenhengende dager bør markers. Kanskje inni en sammhengende boks eller liknende?
function SqueezeCard(props: SqueezeCardProps) {
  const { squeezeDay, index, squeezeDayRange } = props;
  return (
    <div
      className={`flex justify-center border-2 rounded-lg m-10 p-10 ${
        squeezeDay.description === 'inneklemt' ? 'bg-green-500' : 'bg-red-600'
      } `}
    >
      <div className="flex flex-col">
        <p className="text-red-50 font-bold text-2xl">
          {squeezeDay.day.format('dddd D. MMMM')}
        </p>
        <span className="self-center mt-3 text-red-50 font-bold text-2xl">
          {squeezeDay.description}
        </span>
      </div>
    </div>
  );
}

export default SqueezeCard;
