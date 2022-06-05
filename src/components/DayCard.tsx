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
      className={`flex justify-center  border-testColor-900 border-opacity-30 rounded-lg my-1 py-3 px-2  ${
        squeezeDay.description === "inneklemt"
          ? "bg-testColor-900"
          : "bg-testColor-100"
      } `}
    >
      <div className="flex flex-col">
        <p
          className={`text-sm sm:text-xl font-semibold whitespace-nowrap  ${
            squeezeDay.description === "inneklemt"
              ? "text-testColor-100"
              : "text-testColor-900"
          }`}
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
