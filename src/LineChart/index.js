import React from 'react';
import {
    CartesianGrid,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
} from 'recharts';

const _LineChart = ({ title, data, fields = [] }) => {
    return (
        <div>
            <h3>{title}</h3>
            <LineChart width={700} height={250} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: '10px' }} />
                <YAxis tick={{ fontSize: '10px' }} />
                <Tooltip />
                <Legend />
                {fields.map(({ name, color }) => (
                    <Line dot={false} key={name} dataKey={name} type="monotone" stroke={color} />
                ))}
            </LineChart>
        </div>
    )
}

export default _LineChart;
