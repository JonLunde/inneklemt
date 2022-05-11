import { Dayjs } from 'dayjs';
import React from 'react';

interface SqueezeCardProps {
  squeezeDay: Dayjs;
}

//! Sammenhengende dager bør markers. Kanskje inni en sammhengende boks eller liknende?
function SqueezeCard(props: SqueezeCardProps) {
  const { squeezeDay } = props;
  return (
    <div className="flex justify-center border-2 rounded-lg m-10 p-10 bg-red-600 ">
      <p className="text-red-50 font-bold text-2xl">
        {' '}
        {squeezeDay.format('dddd D. MMMM')}
      </p>
    </div>
  );
}

export default SqueezeCard;
