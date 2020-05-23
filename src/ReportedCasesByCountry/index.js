import React from 'react';
import dayjs from 'dayjs';
import styled from 'styled-components';
import { Cell, PieChart, Pie, Tooltip, ResponsiveContainer } from 'recharts';
import { useRecoilValue } from 'recoil';
import { dateState, topCasesByCountry } from '../reducer';

const Container = styled.div`
    background-color: white;
    padding: 2rem;
    border-radius: 5px;
    box-shadow: 1px 3px 3px solid rgb(225, 225, 225);
`;

const DataContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
`;

const StyledTooltip = styled.div`
    background-color: white;
    padding: 1rem;
    box-shadow: 1px 3px 3px rgb(235, 235, 235);
    display: flex;
    flex-direction: column;
    font-size: 12px;
    > p {
        margin-right: 1rem;
        margin-bottom: 1rem;
    }
`;

const List = styled.div`
    display: flex;
    flex-direction: column;
    margin: auto 0 auto 2rem;
`;

const renderTooltip = props => {
    if (props.active) {
        const { payload: { label, value } } = props.payload[0]
        return (
            <StyledTooltip>
                <p>{label}</p>
                <p>case count: <strong>{value.toLocaleString()}</strong></p>
            </StyledTooltip>
        )
    }
}

// weirdness of recharts
const COLORS = ['#67597A', '#544E61', '#6E8894', '#85BAA1', '#95C8B1'];

const renderCountry = (country, i) => {
    return (
        <p key={country.label} style={{ marginBottom: '0.6rem' }}>
            {i+1}. {country.label}: <span style={{ fontWeight: 600, color: COLORS[i] }}>{country.value.toLocaleString()}</span>
        </p>
    );
}

const ReportedCasesByCountry = () => {
    const data = useRecoilValue(topCasesByCountry);
    const date = useRecoilValue(dateState);
    return (
        <Container>
            <h5 style={{ marginTop: 0 }}>Top cases by country: {dayjs(date.end).format('MMM DD, YYYY')}</h5>
            <DataContainer>
                <List>
                    {data.map(renderCountry)}
                </List>
                <div>
                    <ResponsiveContainer width="90%" height={200}>
                        <PieChart>
                            <Pie data={data} dataKey="value" nameKey="label">
                                {data.map((_, i) => <Cell key={COLORS[i]} fill={COLORS[i]} /> )}
                            </Pie>
                            <Tooltip content={renderTooltip} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </DataContainer>
        </Container>
    )
}

export default ReportedCasesByCountry;
