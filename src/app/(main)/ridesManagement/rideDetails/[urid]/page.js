'use client';
import React, { useState, useEffect } from 'react';
import RideDetailsPage from '@/components/customerDetail/RideDetailsPage';
import { apiClient } from '@/app/lib/apiClient';
import { useParams } from 'next/navigation';

const Page = () => {
  const [rideDetails, setRideDetails] = useState(null);
  const [checkUpdate, setCheckUpdate] = useState(false);
  const { urid } = useParams();

  //RIDE DETAILS API
  useEffect(() => {
    if (!urid) {
      console.log("Something Wrong");
      return;
    }

    const fetchDetails = async () => {
      try {
        const response = await apiClient(
          'GET',
          `/ride_management/rideDetails/${urid}`
        );
        setRideDetails(response?.data);
        console.log('rideDetails', response?.data);
      } catch (error) {
        console.error('Failed to fetch ride details', error);
      }
    };

    fetchDetails();
  }, [urid, checkUpdate]); // ✅ Added urid to deps to fix lint warning

  return (
    <div>
      <RideDetailsPage
        rideDetails={rideDetails}
        checkUpdate={checkUpdate}
        setCheckUpdate={setCheckUpdate}
      />
    </div>
  );
};

export default Page;
