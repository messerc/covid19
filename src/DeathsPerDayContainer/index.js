import React from 'react';
import LineChart from '../LineChart';
import { useRecoilValue } from 'recoil';
import { deathsValue } from '../reducer';

const DeathsPerDayContainer = () => {
  const deathsData = useRecoilValue(deathsValue);
  return (
        <LineChart
            title="Deaths per day"
            data={deathsData}
            fields={[
                {
                  name: 'deaths',
                  color: 'red',
                },
            ]}
        />
  );
}

export default DeathsPerDayContainer;
