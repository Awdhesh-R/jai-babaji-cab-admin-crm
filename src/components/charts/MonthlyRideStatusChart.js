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

// Full list of months
const allMonths = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

// Get current month index (e.g., May = 4)
const currentMonthIndex = new Date().getMonth();

// Generate random ride data for months up to the current month
const rideData = allMonths.slice(0, currentMonthIndex + 1).map((month) => ({
  month,
  Assigned: Math.floor(Math.random() * 50) + 10,
  Completed: Math.floor(Math.random() * 40) + 5,
  Pending: Math.floor(Math.random() * 10),
  Cancelled: Math.floor(Math.random() * 5),
}));

export default function MonthlyRideStatusChart() {
  return (
    <div className="bg-white dark:bg-[#1e1e2f] p-4 rounded-lg shadow-md mt-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Monthly Ride Status (2025)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={rideData}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Assigned" stackId="a" fill="#8884d8" />
          <Bar dataKey="Completed" stackId="a" fill="#82ca9d" />
          <Bar dataKey="Pending" stackId="a" fill="#ffc658" />
          <Bar dataKey="Cancelled" stackId="a" fill="#ff4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
