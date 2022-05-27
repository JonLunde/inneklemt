import dayjs, { Dayjs } from "dayjs";
import React, { Dispatch, SetStateAction } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SqueezeDayRange from "./SqueezeDayRange";
import DarkMode from "./DarkMode";

interface HeaderProps {
  selectedYear: number;
  setSelectedYear: Dispatch<SetStateAction<number>>;
  squeezeDayRange: number;
  setSqueezeDayRange: Dispatch<SetStateAction<number>>;
}

interface YearButtonProps {
  children: JSX.Element;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  className?: string;
  style?: any;
}

interface TextProps {
  text: string;
  className?: string;
}

const YearButton = (props: YearButtonProps) => {
  const { children, onClick, disabled, className } = props;
  return (
    <div className="absolute left-1/2">
      <button
        onClick={onClick}
        className={`relative -left-1/2 ${className} ${
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
    <h1 className={`self-center text-2xl sm:text-5xl font-bold  ${className}`}>
      {text}
    </h1>
  );
};

function Header(props: HeaderProps) {
  const { selectedYear, setSelectedYear, squeezeDayRange, setSqueezeDayRange } =
    props;

  return (
    <header className="flex flex-col">
      <DarkMode />
      <div className="flex content-center justify-center ">
        <div className="relative">
          <div className="flex">
            <Text text="Inneklemte dager" className="flex-shrink-0 mr-2" />
            <div className="flex">
              <Text text={selectedYear.toString().substring(0, 3)} />
              <div className="flex flex-col relative">
                <YearButton
                  onClick={() => setSelectedYear((prevState) => prevState + 1)}
                  className="bottom-6 sm:bottom-9"
                  disabled={!(selectedYear < dayjs().year() + 100)}
                >
                  <KeyboardArrowUpIcon className={"text-3xl sm:text-5xl"} />
                </YearButton>
                <Text text={`${selectedYear.toString().substring(3, 4)}`} />
                <YearButton
                  onClick={() => setSelectedYear((prevState) => prevState - 1)}
                  className="top-8 sm:top-11"
                  disabled={!(selectedYear > dayjs().year() - 100)}
                >
                  <KeyboardArrowDownIcon className={"text-3xl sm:text-5xl"} />
                </YearButton>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SqueezeDayRange
        squeezeDayRange={squeezeDayRange}
        setSqueezeDayRange={setSqueezeDayRange}
      />
    </header>
  );
}

export default Header;
