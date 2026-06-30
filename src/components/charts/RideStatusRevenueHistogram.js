'use client';
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Months of the year
const allMonths = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

// Get current month index
const currentMonthIndex = new Date().getMonth();

// Generate data from Jan to current month
const data = allMonths.slice(0, currentMonthIndex + 1).map((month) => ({
  month,
  Assigned: Math.floor(Math.random() * 50) + 10,
  Completed: Math.floor(Math.random() * 40) + 5,
  Pending: Math.floor(Math.random() * 10),
  Cancelled: Math.floor(Math.random() * 5),
  Revenue: Math.floor(Math.random() * 50000) + 10000,
}));

export default function RideStatusRevenueHistogram() {
  return (
    <div className="bg-white dark:bg-[#1e1e2f] p-4 rounded-lg shadow-md mt-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Monthly Ride Status & Revenue (2025)
      </h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} margin={{ top: 10, right: 20, bottom: 30, left: 10 }}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value, name) => name === 'Revenue' ? `₹${value}` : value} />
          <Legend />
          <Bar dataKey="Assigned" fill="#8884d8" />
          <Bar dataKey="Completed" fill="#82ca9d" />
          <Bar dataKey="Pending" fill="#ffc658" />
          <Bar dataKey="Cancelled" fill="#ff4444" />
          <Bar dataKey="Revenue" fill="#00C49F" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
