import { Dayjs } from "dayjs";
import React from "react";
import { SqueezeDay } from "../types";

interface DayCardProps {
  squeezeDay: SqueezeDay;
  index: number;
  squeezeDayRange: number;
}

function DayCard(props: DayCardProps) {
  const { squeezeDay, index, squeezeDayRange } = props;

  return (
    <div
      className={`flex justify-center  border-primary-800 border-opacity-30 rounded-lg my-1 py-3 px-2  ${
        squeezeDay.description === "inneklemt"
          ? "bg-secondary-500"
          : "bg-primary-400"
      } `}
    >
      <div className="flex flex-col">
        <p
          className={
            "text-sm sm:text-xl font-semibold whitespace-nowrap text-primary-800"
          }
        >
          {`${squeezeDay.day.format("dddd D. MMMM")} - ${
            squeezeDay.description
          }`}
        </p>
      </div>
    </div>
  );
}

export default DayCard;
