'use client';
import React, { useEffect } from 'react';
import PageFive from '@/components/modals/loginPageform/PageFive';
import FleetCommandCenter from '@/components/modals/loginPageform/FleetCommandCenter';

const Page = () => {
    useEffect(() => {
        const adminData = localStorage.getItem('user');
        // console.log(adminData);
    }, []);

    return (
        <div className="">
            {/* <MonthlyRideStatusChart />
        <MonthlyRevenueBarGraph />
        <CityRevenuePieChart />
        <RideStatusRevenueHistogram /> */}
            <FleetCommandCenter />
        </div>
    );
};

export default Page;
