import { Dayjs } from 'dayjs';
import React, { useState } from 'react';
import DayCard from './DayCard';
import { SqueezeDayGroup } from '../types';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface SqueezeGroupProps {
  squeezeDayGroup: SqueezeDayGroup;
  squeezeDayRange: number;
}

function SqueezeGroup(props: SqueezeGroupProps) {
  const { squeezeDayGroup, squeezeDayRange } = props;
  const [expanded, setExpanded] = useState<boolean>(false);

  const totalHolidaysCounter = (
    <span className="self-center mb-3 text-xl text-neutral-100  font-semibold">{`${squeezeDayGroup.length} fridager`}</span>
  );

  const dayCards = (
    <div className="self-center mb-4 w-full">
      {expanded
        ? squeezeDayGroup.map((squeezeDay, index) => (
            <DayCard
              key={index}
              squeezeDay={squeezeDay}
              index={index}
              squeezeDayRange={squeezeDayRange}
            />
          ))
        : squeezeDayGroup.map((squeezeDay, index) => {
            if (squeezeDay.description === 'inneklemt') {
              return (
                <div
                  key={index}
                  className=" text-lg text-neutral-100 font-semibold text-center"
                >
                  <span>{squeezeDay.day.format('dddd D. MMMM')}</span>{' '}
                </div>
              );
            }
          })}
    </div>
  );

  const expandButton = (
    <button
      className="absolute -bottom-3 left-1/2 -translate-x-1/2 self-center rounded-md bg-purple-300 w-10 "
      onClick={() => setExpanded((prevState) => !prevState)}
    >
      {expanded ? (
        <KeyboardArrowUpIcon className={'-mb-1 text-3xl sm:text-4xl'} />
      ) : (
        <KeyboardArrowDownIcon className={'-mb-1 text-3xl sm:text-4xl'} />
      )}
    </button>
  );

  return (
    <div className="relative flex flex-col bg-purple-300 mb-10 p-2 rounded-3xl">
      {totalHolidaysCounter}
      {dayCards}
      {expandButton}
    </div>
  );
}

export default SqueezeGroup;
