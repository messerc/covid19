import React from 'react';
import styled from 'styled-components';
import LineChart from '../LineChart';
import { useRecoilValue } from 'recoil';
import { deathsValue } from '../reducer';

const Container = styled.div`
    background-color: white;
    padding: 2rem;
    border-radius: 5px;
    box-shadow: 1px 3px 3px solid rgb(225, 225, 225);
    margin-top: 1rem;
`;

const DeathsPerDayContainer = () => {
  const deathsData = useRecoilValue(deathsValue);
  return (
    <Container>
      <LineChart
          title="Deaths per day"
          data={deathsData}
          fields={[
              {
                name: 'deaths',
                color: '#67597A',
              },
          ]}
      />
    </Container>
  );
}

export default DeathsPerDayContainer;
