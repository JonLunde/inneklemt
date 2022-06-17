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
    <h2 className="self-center mt-2 mb-4 sm:mt-3 sm:mb-6 text-xl sm:text-3xl font-semibold">{`${squeezeDayGroup.length} fridager`}</h2>
  );

  const dayCards = (
    <div
      className={`self-center mb-4 w-full transition-[max-height] ease-in duration-1000 overflow-hidden ${
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
                  className="text-lg sm:text-2xl font-semibold text-center dark:opacity-95"
                >
                  <h3>{squeezeDay.day.format("dddd D. MMMM")}</h3>
                </div>
              );
            }
          })}
    </div>
  );

  const expandButton = (
    <button
      aria-label={expanded ? "shrink" : "expand"}
      className="absolute -bottom-4 sm:-bottom-6 left-1/2 flex content-center justify-center -translate-x-1/2 self-center rounded-md  bg-gray-600 dark:bg-secondary-800 w-12 sm:w-16 shadow-lg border-2 border-gray-500 dark:border-secondary-700"
      onClick={() => setExpanded((prevState) => !prevState)}
    >
      <div>
        {expanded ? (
          <KeyboardArrowUpIcon
            sx={{
              fontSize: { xs: "1.875rem", sm: "2.25rem" },
            }}
          />
        ) : (
          <KeyboardArrowDownIcon
            sx={{
              fontSize: { xs: "1.875rem", sm: "2.25rem" },
            }}
          />
        )}
      </div>
    </button>
  );

  return (
    <div
      className={`relative flex flex-col opacity-90 mb-20 sm:mb-28 p-3 rounded-2xl w-72 sm:w-100 self-center bg-gradient-to-br from-primary-200 to-gray-400 dark:from-secondary-800 dark:to-secondary-800 shadow-lg`}
    >
      {totalHolidaysCounter}
      {dayCards}
      {expandButton}
    </div>
  );
}

export default SqueezeGroup;
