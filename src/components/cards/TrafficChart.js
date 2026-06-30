'use client';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';

const data = [
  { name: 'Jan', Users: 2400, Sessions: 4000 },
  { name: 'Feb', Users: 1398, Sessions: 3000 },
  { name: 'Mar', Users: 9800, Sessions: 2000 },
  { name: 'Apr', Users: 3908, Sessions: 2780 },
  { name: 'May', Users: 4800, Sessions: 1890 },
  { name: 'Jun', Users: 3800, Sessions: 2390 },
  { name: 'Jul', Users: 4300, Sessions: 3490 },
];

export default function TrafficChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
        <XAxis dataKey="name" stroke="#aaa" />
        <YAxis stroke="#aaa" />
        <Tooltip />
        <Line type="monotone" dataKey="Users" stroke="#00bcd4" strokeWidth={2} />
        <Line type="monotone" dataKey="Sessions" stroke="#4caf50" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
