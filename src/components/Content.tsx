import React from "react";
import SqueezeGroup from "./SqueezeGroup";
import { SqueezeDayGroup as SqueezeDayGroupType } from "../types";

interface ContentProps {
  squeezeDayGroups: SqueezeDayGroupType[];
  squeezeDayRange: number;
}

function Content(props: ContentProps) {
  const { squeezeDayGroups, squeezeDayRange } = props;
  return (
    <div className="flex-grow">
      <div className="flex flex-col flex-1 m-auto dark:text-gray-400">
        {squeezeDayGroups.map((squeezeDayGroup, index) => (
          <SqueezeGroup
            key={index}
            squeezeDayGroup={squeezeDayGroup}
            squeezeDayRange={squeezeDayRange}
          />
        ))}
      </div>
    </div>
  );
}

export default Content;
