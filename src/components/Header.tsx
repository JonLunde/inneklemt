import React, { Dispatch, SetStateAction } from "react";
import DarkMode from "./DarkMode";
import Title from "./Title";

interface HeaderProps {
  selectedYear: number;
  setSelectedYear: Dispatch<SetStateAction<number>>;
  squeezeDayRange: number;
  setSqueezeDayRange: Dispatch<SetStateAction<number>>;
}

function Header(props: HeaderProps) {
  const { selectedYear, setSelectedYear, squeezeDayRange, setSqueezeDayRange } =
    props;

  return (
    <header className="flex flex-col mb-16 sm:mb-24">
      <div className="flex justify-end">
        <DarkMode />
      </div>
      <div className="flex content-center justify-center">
        <Title selectedYear={selectedYear} setSelectedYear={setSelectedYear} />
      </div>
      {/* <div>
        <SqueezeDayRange
          squeezeDayRange={squeezeDayRange}
          setSqueezeDayRange={setSqueezeDayRange}
        />
      </div> */}
    </header>
  );
}

export default Header;
