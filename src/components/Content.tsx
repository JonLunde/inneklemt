import React, { Dispatch, SetStateAction } from 'react';
import SqueezeDayRange from './SqueezeDayRange';
import SqueezeGroup from './SqueezeGroup';
import { SqueezeDayGroup as SqueezeDayGroupType } from '../types';

interface ContentProps {
  squeezeDayGroups: SqueezeDayGroupType[];
  squeezeDayRange: number;
}

function Content(props: ContentProps) {
  const { squeezeDayGroups, squeezeDayRange } = props;
  return (
    <main className="flex-grow">
      <div className="flex flex-col flex-1 m-auto max-w-7xl">
        {squeezeDayGroups.map((squeezeDayGroup, index) => (
          <SqueezeGroup
            key={index}
            squeezeDayGroup={squeezeDayGroup}
            squeezeDayRange={squeezeDayRange}
          />
        ))}
      </div>
    </main>
  );
}

export default Content;
