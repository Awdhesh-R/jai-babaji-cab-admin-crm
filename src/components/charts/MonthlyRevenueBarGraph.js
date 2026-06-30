'use client';
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

// Months of the year
const allMonths = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

// Current month index (0-based)
const currentMonthIndex = new Date().getMonth();

// Sample ride data for months (you should replace with your real data)
const baseData = {
  Jan: { Assigned: 20, Completed: 18, Pending: 2, Cancelled: 1, Revenue: 35000 },
  Feb: { Assigned: 30, Completed: 28, Pending: 3, Cancelled: 2, Revenue: 42000 },
  Mar: { Assigned: 25, Completed: 20, Pending: 4, Cancelled: 1, Revenue: 39000 },
  Apr: { Assigned: 35, Completed: 33, Pending: 1, Cancelled: 0, Revenue: 48000 },
  May: { Assigned: 40, Completed: 37, Pending: 2, Cancelled: 1, Revenue: 51000 },
  Jun: { Assigned: 28, Completed: 26, Pending: 1, Cancelled: 0, Revenue: 43000 },
  Jul: { Assigned: 22, Completed: 20, Pending: 2, Cancelled: 1, Revenue: 38000 },
  Aug: { Assigned: 30, Completed: 29, Pending: 0, Cancelled: 0, Revenue: 46000 },
  Sep: { Assigned: 33, Completed: 32, Pending: 1, Cancelled: 0, Revenue: 47000 },
  Oct: { Assigned: 29, Completed: 28, Pending: 1, Cancelled: 0, Revenue: 44000 },
  Nov: { Assigned: 31, Completed: 29, Pending: 2, Cancelled: 0, Revenue: 45000 },
  Dec: { Assigned: 36, Completed: 34, Pending: 1, Cancelled: 0, Revenue: 49000 },
};

// Prepare data up to current month
const data = allMonths.slice(0, currentMonthIndex + 1).map((month) => ({
  month,
  ...baseData[month],
}));

export default function MonthlyRevenueBarGraph() {
  return (
    <div className="bg-white dark:bg-[#1e1e2f] p-4 rounded-lg shadow-md mt-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Monthly Ride Status & Revenue (2025)
      </h3>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data} margin={{ top: 5, right: 40, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis dataKey="month" stroke="#888" />
          <YAxis
            yAxisId="left"
            orientation="left"
            stroke="#888"
            allowDecimals={false}
            label={{ value: 'Rides', angle: -90, position: 'insideLeft', fill: '#888' }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#888"
            tickFormatter={(value) => `₹${value / 1000}k`}
            label={{ value: 'Revenue', angle: 90, position: 'insideRight', fill: '#888' }}
          />
          <Tooltip
            formatter={(value, name) =>
              name === 'Revenue' ? `₹${value.toLocaleString()}` : value
            }
          />
          <Legend verticalAlign="top" height={36} />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="Assigned"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
            strokeWidth={2}
          />
          <Line yAxisId="left" type="monotone" dataKey="Completed" stroke="#82ca9d" strokeWidth={2} />
          <Line yAxisId="left" type="monotone" dataKey="Pending" stroke="#ffc658" strokeWidth={2} />
          <Line yAxisId="left" type="monotone" dataKey="Cancelled" stroke="#ff4444" strokeWidth={2} />
          <Line yAxisId="right" type="monotone" dataKey="Revenue" stroke="#4f46e5" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
