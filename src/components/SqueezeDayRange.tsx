import React, { Dispatch, SetStateAction } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

interface SqueezeDayRangeProps {
  squeezeDayRange: number;
  setSqueezeDayRange: Dispatch<SetStateAction<number>>;
}

interface IncrementButtonProps {
  children: JSX.Element;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  disabled: boolean;
  className?: string;
}

function SqueezeDayRange(props: SqueezeDayRangeProps) {
  const { squeezeDayRange, setSqueezeDayRange } = props;

  const IncrementButton = (props: IncrementButtonProps) => {
    const { children, onClick, disabled, className } = props;

    return (
      <button
        className={`flex rounded-md px-2 py-2 ${
          disabled
            ? "bg-secondary-800 dark:bg-gray-700 dark:border-gray-800 dark:border-[2px]"
            : "bg-secondary-700 dark:bg-secondary-800 dark:border-secondary-900 dark:border-[2px]"
        } ${className}`}
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </button>
    );
  };

  return (
    <div className="flex items-center">
      <span>Inneklemte dager:</span>
      <div className="flex flex-col justify-center">
        <IncrementButton
          disabled={!(squeezeDayRange < 4)}
          onClick={() => {
            setSqueezeDayRange((prevState) => prevState + 1);
          }}
        >
          <AddIcon className="text-sm sm:text-xl" />
        </IncrementButton>

        <span className="self-center my-2 font-bold">{squeezeDayRange}</span>

        <IncrementButton
          disabled={!(squeezeDayRange > 1)}
          onClick={() => {
            setSqueezeDayRange((prevState) => prevState - 1);
          }}
        >
          <RemoveIcon className="text-sm sm:text-xl" />
        </IncrementButton>
      </div>
    </div>
  );
}

export default SqueezeDayRange;
