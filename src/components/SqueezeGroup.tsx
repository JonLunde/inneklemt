import React, { useState } from "react";
import DayCard from "./DayCard";
import { SqueezeDayGroup } from "../types";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

interface SqueezeGroupProps {
  squeezeDayGroup: SqueezeDayGroup;
  squeezeDayRange: number;
}

function SqueezeGroup(props: SqueezeGroupProps) {
  const { squeezeDayGroup, squeezeDayRange } = props;
  const [expanded, setExpanded] = useState<boolean>(false);

  const totalHolidaysCounter = (
    <span className="self-center mt-2 mb-4 sm:mt-3 sm:mb-6 text-xl sm:text-2xl text-neutral-100 font-semibold">{`${squeezeDayGroup.length} fridager`}</span>
  );

  const dayCards = (
    <div
      className={`self-center mb-4 w-full transition-all ease-in duration-1000 overflow-hidden ${
        expanded ? "max-h-[300rem]" : "max-h-32"
      }`}
    >
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
            if (squeezeDay.description === "inneklemt") {
              return (
                <div
                  key={index}
                  className="text-lg text-neutral-100 font-semibold text-center"
                >
                  <span>{squeezeDay.day.format("dddd D. MMMM")}</span>{" "}
                </div>
              );
            }
          })}
    </div>
  );

  const expandButton = (
    <button
      aria-label={expanded ? "shrink" : "expand"}
      className="absolute -bottom-5 left-1/2 -translate-x-1/2 self-center rounded-md  bg-gray-400 dark:bg-secondary-700  w-12"
      onClick={() => setExpanded((prevState) => !prevState)}
    >
      {expanded ? (
        <KeyboardArrowUpIcon className={"-mb-1 text-3xl sm:text-4xl"} />
      ) : (
        <KeyboardArrowDownIcon className={"-mb-1 text-3xl sm:text-4xl"} />
      )}
    </button>
  );

  return (
    <div
      className={`relative flex flex-col opacity-95 mb-10 p-3 rounded-2xl w-72 sm:w-100 self-center bg-gradient-to-br from-primary-200 to-gray-400 dark:from-secondary-800 dark:to-secondary-800`}
    >
      {totalHolidaysCounter}
      {dayCards}
      {expandButton}
    </div>
  );
}

export default SqueezeGroup;
