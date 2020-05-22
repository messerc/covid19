import React from 'react';
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

const _LineChart = ({ title, data, fields = [] }) => {
    return (
        <div>
            <h3>{title}</h3>
            <ResponsiveContainer minWidth={200} minHeight={250}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: '10px' }} />
                    <YAxis tick={{ fontSize: '10px' }} />
                    <Tooltip />
                    <Legend />
                    {fields.map(({ name, color }) => (
                        <Line dot={false} key={name} dataKey={name} type="monotone" stroke={color} />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default _LineChart;
