import React from 'react';
import LineChart from '../LineChart';
import { useRecoilValue } from 'recoil';
import { casesAndRecoveredValue } from '../reducer';

const CasesPerDayContainer = () => {
  const casesAndRecoveredData = useRecoilValue(casesAndRecoveredValue);
  return (
        <LineChart
            title="Cases per day"
            data={casesAndRecoveredData}
            fields={[
              {
                name: 'reported',
                color: '#67597A',
              },
              {
                name: 'recovered',
                color: '#85BAA1',
              },
            ]}
        />
  )
}

export default CasesPerDayContainer;
