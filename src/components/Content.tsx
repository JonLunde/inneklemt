import React, { Dispatch, SetStateAction } from "react";
import SqueezeDayRange from "./SqueezeDayRange";
import SqueezeGroup from "./SqueezeGroup";
import { SqueezeDayGroup as SqueezeDayGroupType } from "../types";
import dayjs from "dayjs";

interface ContentProps {
  squeezeDayGroups: SqueezeDayGroupType[];
  squeezeDayRange: number;
}

// const mockGroups = [
//   [
//     {
//       day: dayjs("2022-04-22"),
//       description: "Kristi himmelfartsdag",
//     },
//     {
//       day: dayjs("2022-03-22"),
//       description: "helg",
//     },
//   ],
//   [
//     {
//       day: dayjs("2022-03-22"),
//       description: "helg",
//     },
//   ],
// ];

function Content(props: ContentProps) {
  const { squeezeDayGroups, squeezeDayRange } = props;
  return (
    <main className="flex-grow">
      <div className="flex flex-col flex-1 m-auto ">
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
