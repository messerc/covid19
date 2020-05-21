import React, { useEffect, useState } from 'react';
import {
  casesURL,
  deathsURL,
  recoveredURL,
} from './constants';
import Papa from 'papaparse';
import FilterBar from './FilterBar';
import LineChart from './LineChart';
import ReportedCasesByCountry from './ReportedCasesByCountry';

function App() {

  useEffect(() => {
    Papa.parse(casesURL, {
      download: true,
      header: true,
      complete: results => console.log(results),
    });
  }, [])

  return (
    <div>
      <h1>Covid 19 site</h1>
      <FilterBar />
      <LineChart title="Cases per day" data={{}} />
      <LineChart title="Deaths per day" data={{}} />
      <ReportedCasesByCountry data={{}} /> 
    </div>
  );
}

export default App;
