'use client';
import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Patna', value: 55000 },
  { name: 'Gaya', value: 32000 },
  { name: 'Bhagalpur', value: 27000 },
  { name: 'Muzaffarpur', value: 21000 },
  { name: 'Purnia', value: 18000 },
  { name: 'Darbhanga', value: 15000 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA46BE', '#FF4444'];

export default function CityRevenuePieChart() {
  return (
    <div className="bg-white dark:bg-[#1e1e2f] p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Bihar - City-wise Revenue</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
    
