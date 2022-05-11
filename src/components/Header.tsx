import dayjs, { Dayjs } from 'dayjs';
import React, { Dispatch, SetStateAction } from 'react';

interface HeaderProps {
  selectedYear: Dayjs;
  setSelectedYear: Dispatch<SetStateAction<Dayjs>>;
}

function Header(props: HeaderProps) {
  const { selectedYear, setSelectedYear } = props;
  return (
    <header>
      <div className="flex content-center justify-center ">
        <div className="relative">
          <button
            onClick={() =>
              setSelectedYear((prevState) =>
                prevState.year() < dayjs().year() + 3
                  ? prevState.add(1, 'y')
                  : prevState
              )
            }
            className="absolute right-2 bottom-11"
          >
            o
          </button>
          <h1 className="text-5xl font-bold self-center ">{`Inneklemte dager ${selectedYear.year()}`}</h1>
          <button
            onClick={() =>
              setSelectedYear((prevState) =>
                prevState.year() > dayjs().year() - 3
                  ? prevState.subtract(1, 'y')
                  : prevState
              )
            }
            className="absolute right-2 top-15"
          >
            o
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
