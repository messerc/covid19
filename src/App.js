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

  const [loading, setLoading] = useState(false);
  const [cases, setCaseData] = useRecoilState(caseState);
  // eslint-disable-next-line no-unused-vars
  const [deaths, setDeathsData] = useRecoilState(deathState);
  // eslint-disable-next-line no-unused-vars
  const [recovered, setRecoveredData] = useRecoilState(recoveredState);

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
    setLoading(true);
    const fetchAll = async () => {
      const [casesData, deathsData, recoveredData] = [
        await fetchAndParse(casesURL),
        await fetchAndParse(deathsURL),
        await fetchAndParse(recoveredURL),
      ];
      setCaseData(casesData.data);
      setDeathsData(deathsData.data);
      setRecoveredData(recoveredData.data); 
    }
    fetchAll().then(() => {
      setLoading(false)
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <h1>Covid 19 site</h1>
      {loading && <div>Loading...</div>}
      {!loading && (
        <Fragment>
          <FilterBar cases={cases} />
          <CasesPerDayContainer />
          <DeathsPerDayContainer />
          <ReportedCasesByCountry data={{}} /> 
        </Fragment>
      )}
    </div>
  );
}

export default App;
