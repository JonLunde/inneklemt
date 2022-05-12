import React, { Dispatch, SetStateAction } from 'react';

interface SqueezeDayRangeProps {
  squeezeDayRange: number;
  setSqueezeDayRange: Dispatch<SetStateAction<number>>;
}

interface IncrementButtonProps {
  children: JSX.Element;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  disabled: boolean;
}

function SqueezeDayRange(props: SqueezeDayRangeProps) {
  const { squeezeDayRange, setSqueezeDayRange } = props;

  const IncrementButton = (props: IncrementButtonProps) => {
    const { children, onClick, disabled } = props;

    return (
      <button
        className={`self-center ${
          disabled ? 'bg-orange-100' : 'bg-orange-300'
        } rounded-md w-10 h-10`}
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </button>
    );
  };

  return (
    <div className="flex justify-center content-center">
      <div className="self-center">
        <span>Dager</span>
      </div>
      <div className="flex flex-col justify-center">
        <IncrementButton
          disabled={!(squeezeDayRange < 3)}
          onClick={() => {
            if (squeezeDayRange < 3) {
              setSqueezeDayRange((prevState) => prevState + 1);
            }
          }}
        >
          <>+</>
        </IncrementButton>

        <span className="self-center my-2">{squeezeDayRange}</span>

        <IncrementButton
          disabled={!(squeezeDayRange > 1)}
          onClick={() => {
            if (squeezeDayRange > 1) {
              setSqueezeDayRange((prevState) => prevState - 1);
            }
          }}
        >
          <>-</>
        </IncrementButton>
      </div>
    </div>
  );
}

export default SqueezeDayRange;
