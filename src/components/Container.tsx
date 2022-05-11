import dayjs, { Dayjs } from 'dayjs';
import React, { Dispatch, SetStateAction } from 'react';
import SqueezeCard from './SqueezeCard';
import { YearPicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import DayJsAdapter from '@date-io/dayjs';
import { ThemeProvider } from '@emotion/react';
import { createTheme, makeStyles } from '@mui/material';
import SqueezeDayRange from './SqueezeDayRange';

interface ContainerProps {
  squeezeDays: Dayjs[];
  selectedYear: Dayjs;
  setSelectedYear: Dispatch<SetStateAction<Dayjs>>;
  squeezeDayRange: number;
  setSqueezeDayRange: Dispatch<SetStateAction<number>>;
}

function Container(props: ContainerProps) {
  const {
    squeezeDays,
    selectedYear,
    setSelectedYear,
    squeezeDayRange,
    setSqueezeDayRange,
  } = props;

  const yearPicker = (
    <LocalizationProvider dateAdapter={DayJsAdapter}>
      <YearPicker
        className="flex flex-nowrap justify-center w-1/2 h-20 m-auto"
        date={selectedYear}
        isDateDisabled={() => false}
        minDate={dayjs(new Date()).subtract(3, 'y')}
        maxDate={dayjs(new Date()).add(3, 'y')}
        onChange={(value) => {
          if (value) setSelectedYear(value);
        }}
      />
    </LocalizationProvider>
  );

  return (
    <main>
      {/* {yearPicker} */}
      <SqueezeDayRange
        squeezeDayRange={squeezeDayRange}
        setSqueezeDayRange={setSqueezeDayRange}
      />
      <div className="flex flex-wrap justify-center content-start h-full">
        {squeezeDays.map((squeezeDay, index) => (
          <SqueezeCard key={index} squeezeDay={squeezeDay} />
        ))}
      </div>
    </main>
  );
}

export default Container;
