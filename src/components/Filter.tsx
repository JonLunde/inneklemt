import React, { Dispatch, SetStateAction, useState } from "react";
import SqueezeDayRange from "./SqueezeDayRange";
import FilterListIcon from "@mui/icons-material/FilterList";

interface FilterProps {
  squeezeDayRange: number;
  setSqueezeDayRange: Dispatch<SetStateAction<number>>;
}

function Filter(props: FilterProps) {
  const { squeezeDayRange, setSqueezeDayRange } = props;

  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`flex flex-col items-end mt-8 sm:mt-16 ${
        expanded
          ? "text-primary-200 dark:text-gray-400"
          : "text-gray-800 dark:text-gray-600"
      } `}
    >
      <button
        aria-label={expanded ? "lukke filter" : "åpne filter"}
        onClick={() => {
          setExpanded((prevState) => !prevState);
        }}
        className={`flex items-center px-5 py-1 ${
          expanded ? "bg-primary-600 dark:bg-secondary-700 rounded-t-lg" : ""
        } `}
      >
        <span
          className={`mr-1 sm:mr-2 text-sm sm:text-base  ${
            expanded ? "font-bold tracking-wide" : "font-medium"
          }`}
        >
          Filter
        </span>
        <FilterListIcon className="text-2xl sm:text-3xl" />
      </button>
      {expanded && (
        <div className="bg-primary-600 dark:bg-secondary-700 rounded-b-lg rounded-tl-lg p-4 font-medium text-sm sm:text-base">
          <SqueezeDayRange
            squeezeDayRange={squeezeDayRange}
            setSqueezeDayRange={setSqueezeDayRange}
          />
        </div>
      )}
    </div>
  );
}

export default Filter;
