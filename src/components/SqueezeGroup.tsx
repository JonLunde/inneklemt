import { useState } from "react";
import DayCard from "./DayCard";
import { SqueezeDayGroup } from "../types";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import InfoIcon from "@mui/icons-material/InfoSharp";
import { Tooltip, styled, TooltipProps, tooltipClasses } from "@mui/material";
import { useTheme } from "next-themes";

interface SqueezeGroupProps {
  squeezeDayGroup: SqueezeDayGroup;
  squeezeDayRange: number;
}

function SqueezeGroup(props: SqueezeGroupProps) {
  const { squeezeDayGroup, squeezeDayRange } = props;

  const { theme } = useTheme();
  const [expanded, setExpanded] = useState<boolean>(false);
  const [openTooltip, setOpenTooltip] = useState(false);

  const handleTooltipClose = () => {
    setOpenTooltip(false);
  };

  const handleTooltipOpen = () => {
    setOpenTooltip(true);
  };

  const totalHolidaysCounter = (
    <h3 className="self-center mt-2 mb-4 sm:mt-3 sm:mb-6 text-xl sm:text-3xl font-semibold">{`${squeezeDayGroup.length} fridager`}</h3>
  );

  const inneklemtCounter = squeezeDayGroup.filter(
    (group) => group.description === "inneklemt"
  ).length;

  const holidaysCounter = squeezeDayGroup.filter(
    (group) => group.description !== "inneklemt"
  ).length;

  const StyledTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme: muiTheme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme === "light" ? "#ffc229" : "#2A1000",
      color: theme === "light" ? "#000312" : "#F2F2F2",
      boxShadow: muiTheme.shadows[6],
      fontSize: 12,
    },
  }));

  const holidayValue = (
    <StyledTooltip
      open={openTooltip}
      onClose={handleTooltipClose}
      onOpen={handleTooltipOpen}
      title={
        <p className="text-lg p-2 ">
          Antall ekstra fridager du får per arbeidsdag du tar fri. Høyere tall
          betyr at du får mer fri ut av feriedagene dine!
        </p>
      }
      placement="top"
      arrow
      enterTouchDelay={0}
      leaveTouchDelay={10000}
    >
      <div className="absolute top-0 right-0 p-2 rounded-tr-xl rounded-sm bg-secondary-600 dark:bg-secondary-900 ">
        <span className=" flex text-md sm:text-xl font-semibold cursor-default items-center">
          {(holidaysCounter / inneklemtCounter).toFixed(1)}
          <InfoIcon sx={{ marginLeft: "0.2rem" }} />
        </span>
      </div>
    </StyledTooltip>
  );

  const dayCards = (
    <div
      className={`self-center mb-7 w-full transition-[max-height] ease-in duration-1000 overflow-hidden ${
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
                  className="text-lg sm:text-2xl font-semibold text-center"
                >
                  <h4>{squeezeDay.day.format("dddd D. MMMM")}</h4>
                </div>
              );
            }
          })}
    </div>
  );

  const expandButton = (
    <button
      aria-label={
        expanded ? "lukke detaljert visning" : "åpne detaljert visning"
      }
      className={`absolute -bottom-4 sm:-bottom-6 left-1/2 flex content-center justify-center -translate-x-1/2 self-center rounded-md  bg-gray-600 dark:bg-secondary-800 w-12 sm:w-16 shadow-lg border-2 border-gray-500 dark:border-secondary-700 hover:scale-105 hover:shadow-xl transition-[transform]`}
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
      className={`relative flex flex-col  px-3 mb-20 sm:mb-28 rounded-2xl w-72 sm:w-100 self-center bg-gradient-to-br from-primary-200 to-gray-400 dark:from-secondary-800 dark:to-secondary-800 shadow-lg`}
    >
      {totalHolidaysCounter}
      {holidayValue}
      {dayCards}
      {expandButton}
    </div>
  );
}

export default SqueezeGroup;
