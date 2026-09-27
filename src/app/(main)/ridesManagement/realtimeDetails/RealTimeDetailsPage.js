'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import InfoUser from '@/components/realtimeDetail/realtimeInfoUser';
// import InfoUser from '@/components/customerDetail/InfoUser';
// import UpdateUserDetails from '@/components/customerDetail/UpdateUserDetails';
import UpdateUserDetails from '@/components/realtimeDetail/realtimeUpdateUserDetails';
// import PreviousRides from '@/components/customerDetail/PreviousRides';
import PreviousRides from '@/components/realtimeDetail/realtimePreviousRides';
// import RideRental from '@/components/customerDetail/RideRental';
import RideRental from '@/components/realtimeDetail/realtimeRideRental';  
// import RideDetailsPage from '@/components/customerDetail/RideDetailsPage';
// import RideDetailsPage from '@/components/customerDetail/RideDetailsPage';
import RideDetailsPage from '@/components/realtimeDetail/realtimeRideDetailPage';
import CustomLoader from '@/components/common/CustomLoader';
import { apiClient } from '@/app/lib/apiClient';
import { ACTIVE_RIDE_STATUSES } from '@/helpers/constant';

const RealTimeDetailsPage = () => {
  const searchParams = useSearchParams();
  const urid = searchParams.get('urid'); 

  const [rideDetails, setRideDetails] = useState(null);
  const RideStatus = rideDetails?.status;
  // const serviceType =
  // String(rideDetails?.service_type || "").toLowerCase();
  // const serviceType =
  // String(
  //   rideDetails?.service_type || rideDetails?.booking_type || ""
  // ).toLowerCase();


  const serviceType =
  (rideDetails?.service_type || rideDetails?.booking_type || "")
    ?.toLowerCase?.() || "";



  const [activityData, setActivityData] = useState([]);
  const [cancelTemplates, setCancelTemplates] = useState([]);
  const [generalTemplates, setGeneralTemplates] = useState([]);

  const [checkUpdate, setCheckUpdate] = useState(false);
  const [storeStatus, setStoreStatus] = useState(null);
  const [showStatus, setShowStatus] = useState('');
  const [loading, setLoading] = useState(true);




// const fetchActiveRideDetails = async (urid) => {
//   try {
//     const res = await apiClient(
//       "GET",
//       `/ride_management/rideDetails/${urid}`
//     );
//     setRideDetails(res?.data);
//   } catch (err) {
//     console.error(err);
//   }
// };


// const fetchOtherRideDetails = async (urid) => {
//   try {
//     const res = await apiClient(
//       "GET",
//       `/ride_management/fetch-other-ride-details/${urid}`
//     );
//     setRideDetails(res?.data);
//   } catch (err) {
//     console.error(err);
//   }
// };

  useEffect(() => {
    if (!urid) return;

    const fetchDetails = async () => {
      try {
        setLoading(true);

        // const response = await apiClient(
        //   'GET',
        //   `/ride_management/fetch-real-time-ride-details/${urid}`
        // );
        

// if (Number(urid)) {
//   // If URID is actually an ID (number)
//   await fetchActiveRideDetails(urid); 
// } else {
//   // If real URID (string)
//   await fetchOtherRideDetails(urid);
// }


// 👉 Step 1: pehle active API try karo
const firstRes = await apiClient(
  "GET",
  `/ride_management/rideDetails/${urid}`
);

if (firstRes?.data) {
  setRideDetails(firstRes.data);
} else {
  // 👉 Step 2: agar data nahi mila, tab second API
  const secondRes = await apiClient(
    "GET",
    `/ride_management/fetch-real-time-ride-details/${urid}`
  );

  if (secondRes?.data) {
    setRideDetails(secondRes.data);
  }
}



        // setRideDetails(response?.data);
         
        // if (response?.status || response?.success) {
        //   rideActivityHistory(urid);
        // }
        rideActivityHistory(urid);

      } catch (error) {
        console.error('Failed to fetch ride details', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [urid, checkUpdate, showStatus]);

  useEffect(() => {
    if (RideStatus != null) {
      setStoreStatus(
        ACTIVE_RIDE_STATUSES?.includes(RideStatus)
          ? 'unique_detail'
          : 'ride_detail'
      );
      setLoading(false);
    }
  }, [RideStatus]);

  const rideActivityHistory = async (ride_urid) => {
    try {
      const response = await apiClient(
        'POST',
        `/ride_management/rideActivityHistory`,
        JSON.stringify({ urid: ride_urid.toString() }),
        true
      );
      if (response?.status || response?.success) {
        setActivityData(response?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };





  useEffect(() => {
    const fetchCancelTemplates = async () => {
      try {
        const response = await apiClient(
          'GET',
          '/rbWaTemplate/cancelTemplateList',
          '',
          true
        );
        if (response?.success) {
          setCancelTemplates(response?.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchCancelTemplates();
  }, []);

  useEffect(() => {
    const fetchGeneralTemplates = async () => {
      try {
        const response = await apiClient(
          'GET',
          '/rbWaTemplate/InGeneralTemplateList',
          '',
          true
        );
        if (response?.success) {
          setGeneralTemplates(response?.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchGeneralTemplates();
  }, []);

  if (loading || !storeStatus) {
    return <CustomLoader />;
  }

  return (
    <div className="w-full">
      {storeStatus === 'ride_detail' && (
        <>
          <div className="bg-white dark:bg-gray-900 shadow">
            {rideDetails && (
              <InfoUser
                rideDetails={rideDetails}
                showStatus={showStatus}
                setShowStatus={setShowStatus}
                setCheckUpdate={setCheckUpdate}
                storeStatus={storeStatus}
                setStoreStatus={setStoreStatus}
              />
            )}
          </div>

          <div className="space-y-4">
            {rideDetails && (
              <>
                <UpdateUserDetails
                  rideDetails={rideDetails}
                  actData={activityData}
                  genTemplates={generalTemplates}
                  canTemplates={cancelTemplates}
                  checkUpdate={checkUpdate}
                  setCheckUpdate={setCheckUpdate}
                  showStatus={showStatus}
                  setShowStatus={setShowStatus}
                />

                {/* {rideDetails?.service_type?.toLowerCase() === 'rental' && ( */}
                {/* {(rideDetails?.service_type || "")
  .toLowerCase() === "rental" && ( */}
  {serviceType === "rental" && (

                  <RideRental
                    rideDetails={rideDetails}
                    setCheckUpdate={setCheckUpdate}
                  />
                )}

                <PreviousRides userID={rideDetails?.user_id} />
              </>
            )}
          </div>
        </>
      )}

      {/* {storeStatus === 'unique_detail' && (
        <div className="space-y-6 mb-4">
          <RideDetailsPage
            rideDetails={rideDetails}
            activityData={activityData}
            setCheckUpdate={setCheckUpdate}
            setStoreStatus={setStoreStatus}
          />
        </div>
      )} */}
      {/* {storeStatus === 'unique_detail' && rideDetails && (
  <div className="space-y-6 mb-4">
    <RideDetailsPage
      rideDetails={rideDetails}
      activityData={activityData}
      setCheckUpdate={setCheckUpdate}
      setStoreStatus={setStoreStatus}
    />
  </div>
)} */}

{storeStatus === 'unique_detail' && rideDetails && (
  <div className="space-y-6 mb-4">
    <RideDetailsPage
      rideDetails={rideDetails}
      activityData={activityData}
      setCheckUpdate={setCheckUpdate}
      setStoreStatus={setStoreStatus}
    />
  </div>
)}


    </div>
  );
};

export default RealTimeDetailsPage;