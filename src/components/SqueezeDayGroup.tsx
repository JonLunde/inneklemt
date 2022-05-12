import { Dayjs } from 'dayjs';
import React from 'react';
import SqueezeCard from './SqueezeCard';
import { SqueezeDayGroup } from '../types';

interface SqueezeGroupProps {
  squeezeDayGroup: SqueezeDayGroup;
  squeezeDayRange: number;
}

function SqueezeDayGroup(props: SqueezeGroupProps) {
  const { squeezeDayGroup, squeezeDayRange } = props;
  return (
    <div className="flex flex-wrap justify-center content-start bg-red-300 mb-10 rounded-3xl">
      {squeezeDayGroup.map((squeezeDay, index) => (
        <SqueezeCard
          key={index}
          squeezeDay={squeezeDay}
          index={index}
          squeezeDayRange={squeezeDayRange}
        />
      ))}
    </div>
  );
}

export default SqueezeDayGroup;
