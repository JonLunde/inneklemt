import dayjs, { Dayjs } from 'dayjs';
import React, { Dispatch, SetStateAction } from 'react';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface HeaderProps {
  selectedYear: Dayjs;
  setSelectedYear: Dispatch<SetStateAction<Dayjs>>;
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
  const { children, onClick, disabled, className, style } = props;
  return (
    <div className="absolute left-1/2">
      <button
        onClick={onClick}
        className={`relative -left-1/2 ${className} ${
          disabled ? 'text-blue-100' : 'inherit'
        }`}
      >
        {children}
      </button>
    </div>
  );
};

const Text = (props: TextProps) => {
  const { text, className } = props;
  return (
    <h1 className={`self-center text-3xl sm:text-5xl font-bold  ${className}`}>
      {text}
    </h1>
  );
};

function Header(props: HeaderProps) {
  const { selectedYear, setSelectedYear } = props;
  return (
    <header>
      <div className="flex content-center justify-center ">
        <div className="relative">
          <div className="flex">
            <Text text="Inneklemte dager" className="flex-shrink-0 mr-2" />
            <Text text={selectedYear.year().toString().substring(0, 3)} />
            <div className="flex flex-col relative">
              <YearButton
                onClick={() =>
                  setSelectedYear((prevState) =>
                    prevState.year() < dayjs().year() + 3
                      ? prevState.add(1, 'y')
                      : prevState
                  )
                }
                className="bottom-6 sm:bottom-9"
                disabled={!(selectedYear.year() < dayjs().year() + 3)}
              >
                <KeyboardArrowUpIcon className={'text-3xl sm:text-5xl'} />
              </YearButton>
              <Text
                text={`${selectedYear.year().toString().substring(3, 4)}`}
              />
              <YearButton
                onClick={() =>
                  setSelectedYear((prevState) =>
                    prevState.year() > dayjs().year() - 3
                      ? prevState.subtract(1, 'y')
                      : prevState
                  )
                }
                className="top-8 sm:top-11"
                disabled={!(selectedYear.year() > dayjs().year() - 3)}
              >
                <KeyboardArrowDownIcon className={'text-3xl sm:text-5xl'} />
              </YearButton>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
