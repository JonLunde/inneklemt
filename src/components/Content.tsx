import React, { Dispatch, SetStateAction } from 'react';
import SqueezeDayRange from './SqueezeDayRange';
import SqueezeDayGroup from './SqueezeDayGroup';
import { SqueezeDayGroup as SqueezeDayGroupType } from '../types';

interface ContentProps {
  squeezeDayGroups: SqueezeDayGroupType[];
  squeezeDayRange: number;
  setSqueezeDayRange: Dispatch<SetStateAction<number>>;
}

function Content(props: ContentProps) {
  const { squeezeDayGroups, squeezeDayRange, setSqueezeDayRange } = props;

  return (
    <main>
      <SqueezeDayRange
        squeezeDayRange={squeezeDayRange}
        setSqueezeDayRange={setSqueezeDayRange}
      />

      <div className="flex flex-col m-auto max-w-7xl">
        {squeezeDayGroups.map((squeezeDayGroup, index) => (
          <SqueezeDayGroup
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
