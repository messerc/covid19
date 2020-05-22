import React from 'react';
import styled from 'styled-components';
import { PieChart, Pie, Tooltip } from 'recharts';
import { useRecoilValue } from 'recoil';
import { topCasesByCountry } from '../reducer';

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

const ReportedCasesByCountry = () => {
    const data = useRecoilValue(topCasesByCountry);
    return (
        <PieChart width={700} height={250}>
            <Pie data={data} dataKey="value" nameKey="label" />
            <Tooltip content={renderTooltip} />
        </PieChart>
    )
}

export default ReportedCasesByCountry;
