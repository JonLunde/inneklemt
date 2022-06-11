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
    <span className="self-center mt-2 mb-4 sm:mt-3 sm:mb-6 text-xl sm:text-3xl font-semibold">{`${squeezeDayGroup.length} fridager`}</span>
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
      className="absolute flex content-center justify-center -bottom-4 sm:-bottom-5 left-1/2 -translate-x-1/2 self-center rounded-md  bg-gray-400 dark:bg-secondary-700  w-12 sm:w-16"
      onClick={() => setExpanded((prevState) => !prevState)}
    >
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
