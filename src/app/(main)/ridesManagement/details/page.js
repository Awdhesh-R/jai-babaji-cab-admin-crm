'use client';
import React, { useEffect, useState } from 'react';
import InfoUser from '@/components/customerDetail/InfoUser';
import { useParams } from 'next/navigation';
import { apiClient } from '@/app/lib/apiClient';
import UpdateUserDetails from '@/components/customerDetail/UpdateUserDetails';
import PreviousRides from '@/components/customerDetail/PreviousRides';
import RideRental from '@/components/customerDetail/RideRental';
import RideDetailsPage from '@/components/customerDetail/RideDetailsPage';
import CustomLoader from '@/components/common/CustomLoader';
import { ACTIVE_RIDE_STATUSES } from '@/helpers/constant';

const DetailsPage = () => {
  // const { urid } = useParams();
  const [rideDetails, setRideDetails] = useState(null);
  const RideStatus = rideDetails?.status;
  const [activityData, setActivityData] = useState([]);
  const [cancelTemplates, setCancelTemplates] = useState([]);
  const [generalTemplates, setGeneralTemplates] = useState([]);
  const [checkUpdate, setCheckUpdate] = useState(false);
  const [storeStatus, setStoreStatus] = useState(null);
  const [showStatus, setShowStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const [urid, setUrid] = useState(null);
  // const { urid } = useParams();

  useEffect(() =>{
    const SearchParams = new URLSearchParams(window.location.search);
    const id = SearchParams.get('urid');
    if (id) {
      setUrid(id);
    }
  }, []);

  useEffect(() => {
    if (urid) {
      const fetchDetails = async () => {
        try {
          setLoading(true);
          const response = await apiClient('GET', `/ride_management/rideDetails/${urid}`);
          setRideDetails(response?.data);
          if (response?.status || response?.success) {
            rideActivityHistory(urid);
          }
        } catch (error) {
          console.error('Failed to fetch ride details', error);
        } finally {
          setLoading(false)
        }
      };
      fetchDetails();
    }
  }, [urid, checkUpdate, showStatus]);

  useEffect(() => {
    if (RideStatus != null) {
      setStoreStatus(
        ACTIVE_RIDE_STATUSES?.includes(RideStatus)
          ? "unique_detail"
          : "ride_detail"
      );
      setLoading(false);
    }
  }, [RideStatus]);


  const rideActivityHistory = async (ride_urid) => {
    try {
      const response = await apiClient(
        'POST',
        '/ride_management/rideActivityHistory',
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
        const response = await apiClient('GET', '/rbWaTemplate/cancelTemplateList', '', true);
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
        const response = await apiClient('GET', '/rbWaTemplate/InGeneralTemplateList', '', true);
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

                {rideDetails?.service_type?.toLowerCase() === 'rental' && (
                  <RideRental rideDetails={rideDetails} setCheckUpdate={setCheckUpdate} />
                )}
                <PreviousRides userID={rideDetails?.user_id} />
              </>
            )}
          </div>
        </>
      )}

      {storeStatus === 'unique_detail' && (
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

export default DetailsPage;
