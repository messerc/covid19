import React from 'react';
import styled from 'styled-components';
import LineChart from '../LineChart';
import { useRecoilValue } from 'recoil';
import { casesAndRecoveredValue } from '../reducer';

const Container = styled.div`
    background-color: white;
    padding: 2rem;
    border-radius: 5px;
    box-shadow: 1px 3px 3px solid rgb(225, 225, 225);
`;

const CasesPerDayContainer = () => {
  const casesAndRecoveredData = useRecoilValue(casesAndRecoveredValue);
  return (
    <Container>
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
    </Container>
  )
}

export default CasesPerDayContainer;
