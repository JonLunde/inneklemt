import dayjs from "dayjs";
import React, { Dispatch, SetStateAction } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

interface TitleProps {
  selectedYear: number;
  setSelectedYear: Dispatch<SetStateAction<number>>;
}

interface YearButtonProps {
  children: JSX.Element;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  className?: string;
  style?: any;
  ariaLabel: string;
}

interface TextProps {
  text: string;
  className?: string;
}

const YearButton = (props: YearButtonProps) => {
  const { children, onClick, disabled, className, ariaLabel } = props;
  return (
    <div className={`absolute left-1/2 mt-[2px] sm:mt-[6px] ${className}`}>
      <button
        aria-label={ariaLabel}
        onClick={onClick}
        className={`relative -left-1/2  ${
          disabled ? "text-blue-100" : "inherit"
        }`}
        disabled={disabled}
      >
        {children}
      </button>
    </div>
  );
};

const Text = (props: TextProps) => {
  const { text, className } = props;
  return (
    <span
      className={`self-center text-2xl sm:text-5xl font-bold  ${className}`}
    >
      {text}
    </span>
  );
};

function Title(props: TitleProps) {
  const { selectedYear, setSelectedYear } = props;
  return (
    <div className="relative">
      <h1 className="flex">
        <Text text="Inneklemte dager" className="flex-shrink-0 mr-2" />
        <div className="flex">
          <Text text={selectedYear.toString().substring(0, 3)} />
          <div className="flex flex-col relative">
            <YearButton
              onClick={() => setSelectedYear((prevState) => prevState + 1)}
              className="bottom-5 sm:bottom-8"
              disabled={!(selectedYear < dayjs().year() + 100)}
              ariaLabel="increment year"
            >
              <KeyboardArrowUpIcon
                sx={{ fontSize: { xs: "1.875rem", sm: "3rem" } }}
              />
            </YearButton>
            <Text text={`${selectedYear.toString().substring(3, 4)}`} />
            <YearButton
              onClick={() => setSelectedYear((prevState) => prevState - 1)}
              className="top-5 sm:top-8"
              disabled={!(selectedYear > dayjs().year() - 100)}
              ariaLabel="decrement year"
            >
              <KeyboardArrowDownIcon
                sx={{ fontSize: { xs: "1.875rem", sm: "3rem" } }}
              />
            </YearButton>
          </div>
        </div>
      </h1>
    </div>
  );
}

export default Title;
