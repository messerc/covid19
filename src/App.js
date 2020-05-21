import React, { useEffect, useState } from 'react';
import { atom, useRecoilState, useRecoilValue } from 'recoil';
import dayjs from 'dayjs';
import Papa from 'papaparse';
import FilterBar from './FilterBar';
import LineChart from './LineChart';
import ReportedCasesByCountry from './ReportedCasesByCountry';

import { casesURL, deathsURL, recoveredURL } from './constants';
import {
  caseState,
  deathState,
  recoveredState,
  casesAndRecoveredState,
} from './reducer';

function App() {

  const [cases, setCaseData] = useRecoilState(caseState);
  const [deaths, setDeathsData] = useRecoilState(deathState);
  const [recovered, setRecoveredData] = useRecoilState(recoveredState);

  const casesAndRecoveredData = useRecoilValue(casesAndRecoveredState);

  const fetchAndParse = (url) => {
    return new Promise((resolve, reject) => {
      Papa.parse(url, {
        download: true,
        header: true,
        complete: results => resolve(results),
        error: e => reject(e)
      })
    });
  }

  useEffect(() => {
    // console.log(dayjs('1/22/20').isBefore('1/23/20'));
    fetchAndParse(casesURL).then(results => {
      setCaseData(results.data);
    })
    fetchAndParse(deathsURL).then(results => {
      setDeathsData(results.data);
    })
    fetchAndParse(recoveredURL).then(results => {
      setRecoveredData(results.data);
    })
  }, []);

  return (
    <div>
      <h1>Covid 19 site</h1>
      <FilterBar />
      <LineChart
        title="Cases per day"
        data={casesAndRecoveredData}
        fields={[
          {
            name: 'reported',
            color: 'red',
          },
          {
            name: 'recovered',
            color: 'green',
          },
        ]}
      />
      
      <LineChart />
      <ReportedCasesByCountry data={{}} /> 
    </div>
  );
}

export default App;
