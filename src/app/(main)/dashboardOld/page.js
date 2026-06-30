'use client';
import React, { useEffect } from 'react';
import MonthlyRideStatusChart from '@/components/charts/MonthlyRideStatusChart';
import CityRevenuePieChart from '@/components/charts/CityRevenuePieChart';
import RideStatusRevenueHistogram from '@/components/charts/RideStatusRevenueHistogram';
import MonthlyRevenueBarGraph from '@/components/charts/MonthlyRevenueBarGraph';
import PageFive from '@/components/modals/loginPageform/PageFive';

export default function DashboardPage() {

  useEffect(() => {
    const adminData = localStorage.getItem('user');
    console.log(adminData);
    // return false;
  }, []);

  return (
    <div className="p-2">
      <MonthlyRideStatusChart />
      <MonthlyRevenueBarGraph />
      <CityRevenuePieChart />
      <RideStatusRevenueHistogram />
      {/* <PageFive/> */}
    </div>
  );
}
