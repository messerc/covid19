import React, { Fragment, useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import Papa from 'papaparse';
import FilterBar from './FilterBar';
import CasesPerDayContainer from './CasesPerDayContainer';
import DeathsPerDayContainer from './DeathsPerDayContainer';
import ReportedCasesByCountry from './ReportedCasesByCountry';
import { casesURL, deathsURL, recoveredURL } from './constants';
import {
  caseState,
  deathState,
  recoveredState,
} from './reducer';

function App() {

  const [loading, setLoading] = useState(true);
  const [cases, setCaseData] = useRecoilState(caseState);
  const setDeaths = useRecoilState(deathState)[1];
  const setRecovered = useRecoilState(recoveredState)[1];

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
    const fetchAll = async () => {
      const [casesData, deathsData, recoveredData] = [
        await fetchAndParse(casesURL),
        await fetchAndParse(deathsURL),
        await fetchAndParse(recoveredURL),
      ];
      setCaseData(casesData.data);
      setDeaths(deathsData.data);
      setRecovered(recoveredData.data); 
    }
    fetchAll().then(() => {
      setLoading(false)
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h1>State of COVID-19</h1>
      {loading && <div>Loading...</div>}
      {!loading && (
        <Fragment>
          <ReportedCasesByCountry />
          <FilterBar cases={cases} />
          <CasesPerDayContainer />
          <DeathsPerDayContainer />
        </Fragment>
      )}
    </div>
  );
}

export default App;
