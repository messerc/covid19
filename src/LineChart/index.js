import React from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import {
    CartesianGrid,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

const StyledTooltip = styled.div`
    display: flex;
    font-size: 12px;
    > p {
        margin-right: 1rem;
    }
`;

const renderTooltip = props => {
    if (props.active) {
        const { payload: { date, ...rest } } = props.payload[0]
        return (
            <StyledTooltip>
                <p>date: {date}</p>
                {Object.entries(rest).map(([ key, value ]) => (
                    <p key={key}>{key}: <strong>{value.toLocaleString()}</strong></p>
                ))}
            </StyledTooltip>
        )
    }
}


const _LineChart = ({ title, data, fields = [] }) => {
    return (
        <div>
            <h5 style={{ marginTop: 0, marginBottom: '4rem' }}>{title}</h5>
            <ResponsiveContainer width="95%" height={250}>
                <LineChart data={data}>
                    <CartesianGrid 
                        vertical={false}
                        strokeDasharray="3 3"
                        stroke="rgba(56, 60, 68, 0.6)"
                    />
                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: '10px' }}
                        tickLine={false}
                        tickFormatter={date => dayjs(date).format('M/DD')}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        width={70}
                        tick={{ fontSize: '12px' }}
                        tickFormatter={count => count.toLocaleString()}
                    />
                    <Tooltip position={{ x: 80, y: -20 }} content={renderTooltip} />
                    {fields.length > 1 && (
                        <Legend verticalAlign="bottom" />
                    )}
                    {fields.map(({ name, color }) => (
                        <Line strokeWidth={3} dot={false} key={name} dataKey={name} type="monotone" stroke={color} />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default _LineChart;
