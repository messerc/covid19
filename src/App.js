import React from 'react';
import FilterBar from './FilterBar';
import LineChart from './LineChart';
import ReportedCasesByCountry from './ReportedCasesByCountry';

function App() {
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
