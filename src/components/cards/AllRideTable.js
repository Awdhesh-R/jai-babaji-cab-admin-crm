'use client';
import React, { useEffect, useState } from 'react';
import { FaCarSide, FaCopy, FaExternalLinkAlt, FaClock, FaAndroid, FaApple, FaLaptop } from 'react-icons/fa';
import { HiUsers } from "react-icons/hi";
import { SiGitconnected } from "react-icons/si";
import Switch from '@mui/material/Switch';
import moment from 'moment';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { apiClient } from '@/app/lib/apiClient';
import CommonModal from '../common/CommonModal';
import AddRemarksSection from '../customerDetail/AddRemarksSection';
import { FaClockRotateLeft } from 'react-icons/fa6';
import RideConnectionModal from '../modals/RideConnectionModal';
import { BsArrowRightCircle } from 'react-icons/bs';
import PublishModal from '../ridesManagement/details/publishModal';

const AllRideTable = ({ rides = [], refreshList, moreData, checklastCardRef, custom=false, handleCashCollect=null}) => {
  const [openModal, setModalOpen] = useState(false);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [selectedRide, setSelectedRide] = useState();
  const [publishModalOpen, setPublishModalOpen] = useState(false);

  useEffect(()=> {
    console.log(rides)
  }, [rides])
  const handleSelectedRide = (ride) => {
    setSelectedRide(ride);
    setModalOpen(true);
  };

  const handleSelectedRideForConnectedRide = (ride) => {
    setSelectedRide(ride);
    setShowConnectionModal(true);
  };

  const handleUpdateBookingDetailsToDriver = async (val, ride) => {
    try {
      const response = await apiClient("PUT", `/ride_management/bookig-details-updated-to-driver/${ride?.urid}`, {
        status: ride?.status,
        booking_details_updated_to_driver: val
      });
      if (response.status || response.success) {
        toast.success(response.message);
        refreshList();
      } else {
        toast.error(response.message);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const formatDate = (dateString) => moment(dateString).format("DD/MM/YYYY hh:mm A");

  const rideServiceTypeEnum = {
    "local": "Local",
    "intercity": "Inter city",
    "intracity": "Intra city",
    "interstate": "Inter state",
    "rental": "Rental",
    "global": "Global"
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'processing': return 'bg-orange-100 text-orange-700';
      case 'confirmed': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getMapURL = (ride) => {
    if (ride?.route_map && ride?.route_map !== "0") return ride?.route_map;
    const src = ride?.booking_source_coordinates?.coordinates?.sort();
    const dest = ride?.booking_destination_coordinates?.coordinates?.sort();
    if (src && dest) return `https://www.google.com/maps/dir/${encodeURIComponent(src)}/${encodeURIComponent(dest)}`;
    return null;
  };

  const goToConnectRide = (urid) => window.open(`/ridesManagement/searchRideConnection/${urid}`, '_blank');

  return (
    <div className="overflow-x-auto w-full bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4">
      <table className="min-w-full text-sm text-left border-collapse">
        <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
          <tr>
            <th className="px-2 py-2">URID</th>
            <th className="px-2 py-2">Customer</th>
            <th className="px-2 py-2">Travel Date</th>
            <th className="px-2 py-2">Cab</th>
            <th className="px-2 py-2">Route</th>
            <th className="px-2 py-2">Cab & Driver</th>
            <th className="px-2 py-2">Fare</th>
            <th className="px-2 py-2">Status</th>
            <th className="px-2 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rides.map((ride, idx) => {
            const isLastCard = idx === rides.length - 1;
            return( <>
            <tr ref={isLastCard ? checklastCardRef : null}
            key={ride?.urid} className={`dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all
             ${ride.op_cab_status? "border z-10 border-green-500 dark:border-green-700 shadow-green-300 hover:bg-green-100":(ride?.route_map && ride?.route_map!= "0" && (ride?.status.toLowerCase() === 'pending' || ride?.status.toLowerCase() === 'processing')? "border z-10 border-yellow-500 dark:border-yellow-700 shadow-yellow-300 hover:bg-yellow-100":  "border border-gray-100 dark:border-gray-700 hover:bg-blue-100")}`}>
              <td className="px-2 py-2 font-medium">
                <div className='flex flex-col'>
                    <div className='flex items-center gap-2'>
                        <span className={`h-[8px] w-[8px] rounded-full ${ride?.executive_verification_lock_status? "bg-green-500": "bg-red-500"}`}></span>
                        <span className="text-slate-700 dark:text-gray-200 text-[14px] font-semibold cursor-pointer hover:underline">
                        {ride?.urid}
                        </span>
                        <FaCopy
                            size={12}
                            title="Copy URID"
                            className="cursor-pointer"
                            onClick={async () => {
                                await navigator.clipboard.writeText(ride?.urid);
                                toast.info("URID copied to clipboard");
                            }}
                        />
                        {custom && <FaExternalLinkAlt
                            size={12}
                            title="Open Details"
                            className="cursor-pointer"
                            onClick={() => window.open(`/ridesManagement/details?urid=${ride?.urid}`, '_blank')}
                        />}
                    </div>
                    <div className="flex gap-1 mt-1 items-center">
                        {ride?.via_source === "android" && <FaAndroid className="text-[#78C257]" />}
                        {ride?.via_source === "ios" && <FaApple className="text-[#A2AAAD]" />}
                        {(ride?.via_source === "web" || ride?.via_source === "website") && <FaLaptop />}
                        <div className="flex items-center text-gray-500 dark:text-gray-300 text-sm">
                        <span className='capitalize'>{ride?.cluster_details?.rideServiceType? rideServiceTypeEnum[ride?.cluster_details?.rideServiceType?.toLowerCase()] :"-"}</span>
                        </div>
                    </div>
                </div>
              </td>
              <td className="px-2 py-2">
                <div className="flex flex-col">
                  <span>{ride?.user_details_json?.name} ({ride?.user_details_json?.book_for})</span>
                  <span className="text-xs text-gray-500">{ride?.user_details_json?.mobile}</span>
                </div>
              </td>
              <td className="px-2 py-2">
                <div className="flex items-start gap-1">
                  <FaClock size={14} className="text-blue-500" />
                  <span className='text-xs'>
                    {formatDate(ride?.booking_travel_date)}
                  </span>
                </div>
              </td>
              <td className="px-2 py-2">
                <div className='flex flex-col'>
                  {(ride.op_cab_status || ride?.booking_or_type !== ride?.booking_type) &&
                    <span className={`capitalize`}>{ride?.op_cab_details_json?.cab_type ?? ride?.booking_type}</span>
                  }
                  <span className={`capitalize ${(ride.op_cab_status || ride?.booking_or_type !== ride?.booking_type) ? "line-through" : ""}`}>{ride?.booking_or_type}</span>
                </div>
              </td>
              <td className="px-2 py-2">
                <div className='flex justify-between flex-wrap gap-2'>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-[12px]">
                      <span className="h-[8px] w-[8px] bg-green-500 rounded-full"></span>
                      <span className="text-gray-700 dark:text-gray-300">{ride?.source_city_name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[12px]">
                      <span className="h-[8px] w-[8px] bg-red-500 rounded-full"></span>
                      <span className="text-gray-700 dark:text-gray-300">{ride?.destination_city_name}</span>
                    </div>
                  </div>
                  <span
                        className=""
                        onClick={e => {
                            e.stopPropagation();
                            const url = getMapURL(ride)
                            if (url) {
                                window.open(url, '_blank');
                            }
                        }}
                        style={{ display: 'flex', alignItems: 'start', cursor: 'pointer' }}
                    >
                        <Image
                            src="/icons/googlemap.svg"
                            alt="Google Maps"
                            height={25}
                            width={25}
                        />
                    </span> 
                </div>
              </td>
              <td className="px-2 py-2">
                {ride?.cab_details_json?.cab_reg ? (
                  <div className={`flex flex-col ${ride?.cab_details_json?.cab_source === "Operator"? "bg-blue-100": ""}`}>
                    <span>{ride?.cab_details_json?.cab_reg}</span>
                    <span className="text-gray-500 dark:text-gray-400 text-[12px]">{ride?.cab_details_json?.cab_model}-{ride?.cab_details_json?.cab_type}({ride?.cab_details_json?.cab_source})</span>
                    <span className='text-gray-500 text-[12px] capitalize'>{ride?.cab_details_json?.cab_service_type}</span>
                    <div className='flex items-center gap-2'>
                        <span className={`h-[8px] w-[8px] rounded-full ${ride?.booking_details_updated_to_driver? "bg-green-500": "bg-red-500"}`}></span>
                      <span className="items-center gap-2 text-slate-700 dark:text-gray-200 text-[14px] font-semibold text-ellipsis">
                        {ride?.driver_details_json?.drv_name || ""}
                      </span>
                    </div>
                  </div>
                ):"-"}
              </td>
              <td className="px-2 py-2">
                    {!custom && <div className='text-[12px] flex flex-col'>
                      <div className='flex gap-4 justify-between'>
                        <span className=''>
                          Distance
                        </span>
                        <span className='font-semibold'>
                            {ride?.price_details_json?.estimated_km} Km
                        </span>
                      </div>
                      <div className='flex gap-4 justify-between'>
                        <span className=''>
                          Estimated Fare
                        </span>
                        <span className=' text-blue-600 font-semibold'>
                            ₹{ride?.price_details_json?.estimated_fare}
                        </span>
                      </div>
                      <div className='flex gap-4 justify-between'>
                        <span className=''>
                          Collected By Driver
                        </span>
                        <span className=' text-blue-600 font-semibold'>
                            ₹{ride?.price_details_json?.collected_by_driver}
                        </span>
                      </div>
                    </div>}
                    {custom && <div className='text-[12px] flex flex-col gap-1'>
                      <div className='flex gap-4 justify-between'>
                        <span className=''>
                          Final Fare
                        </span>
                        <span className=' text-blue-600 font-semibold'>
                            ₹{ride?.price_details_json?.final_fare}
                        </span>
                      </div>
                      <div className='flex gap-4 justify-between'>
                        <span className=''>
                          Advance Amount
                        </span>
                        <span className=' text-blue-600 font-semibold'>
                            ₹{ride?.price_details_json?.advance_amount}
                        </span>
                      </div>
                      <div className='flex gap-4 justify-between'>
                        <span className=''>
                          Collected By Driver
                        </span>
                        <span className=' text-blue-600 font-semibold'>
                            ₹{ride?.price_details_json?.collected_by_driver}
                        </span>
                      </div>
                    </div>}
              </td>
              <td className="px-2 py-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusClass(ride?.status)}`}>
                  {ride?.status}
                </span>
              </td>
              <td className="px-2 py-2 text-center">
                <div className="flex flex-col">
                    <div className='flex items-center justify-between gap-2'>

                      {custom && !ride?.is_collected &&
                        <button
                          onClick={() => handleCashCollect && handleCashCollect(ride)}
                          className="flex items-center gap-1 px-3 py-1  border border-green-400 bg-green-100 text-black text-xs shadow-lg transition-all duration-200 min-w-[80px]">
                          {"Collect Cash"}
                        </button>}
                      {custom && ride?.is_collected &&
                        <button
                          className="flex items-center gap-1 px-3 py-1  border border-blue-400 bg-blue-100 text-blue-700 text-xs shadow-lg transition-all duration-200 min-w-[80px]">
                          {"Cash Collected"}
                        </button>}

                        {!custom && <FaClockRotateLeft
                            size={12}
                            title="Activity History"
                            className="cursor-pointer"
                            onClick={() => handleSelectedRide(ride)}
                        />}
                        {!custom && <FaExternalLinkAlt
                            size={12}
                            title="Open Details"
                            className="cursor-pointer"
                            onClick={() => window.open(`/ridesManagement/details?urid=${ride?.urid}`, '_blank')}
                        />}
                        {!custom && <Switch
                            title='Driver Updated'
                            color={ride?.booking_details_updated_to_driver ? "success" : "default"}
                            checked={ride?.booking_details_updated_to_driver}
                            onChange={(e) => handleUpdateBookingDetailsToDriver(e.target.checked, ride)}
                        />}
                        {!custom && <button className={`flex items-center gap-2 rounded-lg text-xs transition-all duration-200`}>
                            <FaCopy size={12} title='Copy Data' className='hover:cursor-pointer' onClick={async () => {
                                await navigator.clipboard.writeText(`Name: ${ride?.user_details_json?.name}
Mobile: ${ride?.user_details_json?.mobile}

ID: ${ride?.urid}

Type: ${ride?.op_cab_details_json?.cab_type || ride?.booking_type}

Distance: *${ride?.price_details_json?.estimated_km} KM*

Price: *${ride?.price_details_json?.collected_by_driver}*

Reporting Time: *${moment(ride?.booking_travel_date).subtract(15, 'minutes').format('hh:mm A')}*

Travel Date: *${moment(ride?.booking_travel_date).format('DD-MM-YYYY hh:mm A')}*

Passenger: ${parseInt(ride?.passenger_details_json?.adults || 0) + parseInt(ride?.passenger_details_json?.children || 0)}       Luggage: ${parseInt(ride?.passenger_details_json?.luggage_big || 0) + parseInt(ride?.passenger_details_json?.luggage_small || 0)}

Source: ${ride?.location_details?.source}
City: *${ride?.source_city_name}*

Destination: ${ride?.location_details?.destination}
City: *${ride?.destination_city_name}*

Map: ${getMapURL(ride)}
`);
                                toast.info("Data copied to clipboard")
                            }} />
                        </button>}
                    </div>
                  {!custom && <button
                    onClick={() => ride?.connected_ride_id
                      ? handleSelectedRideForConnectedRide(ride)
                      : goToConnectRide(ride?.urid)
                    }
                    className={`flex items-center gap-1 px-2 py-1 rounded text-xs border transition-all duration-200 ${
                      ride?.connected_ride_id
                        ? 'border-green-500 text-green-600'
                        : 'border-gray-400 text-gray-600'
                    }`}
                  >
                    <SiGitconnected /> {ride?.connected_ride_id ? 'Connected' : 'Connect'}
                  </button>}
                    {["pending", "processing", "confirmed"].includes(ride?.status) && <button 
                    onClick={()=> {
                        setSelectedRide(ride);
                        setPublishModalOpen(true);
                    }} className="flex items-center gap-1 px-3 py-1  text-red-500 rounded-lg text-xs shadow hover:bg-blue-700 transition-all duration-200 min-w-[80px]">
                      <BsArrowRightCircle /> {ride?.assigned_to_fleet === "published"? "Published": "Unpublished"}
                    </button>}
                </div>
              </td>
            </tr>
                {ride?.executive_remarks && !custom &&  <tr key={ride?.urid+"1"}>
                  <td colSpan={9}>
                    <div className='p-2 flex capitalize text-ellipsis bg-[#e7e9ed] w-full' title={ride?.executive_remarks}>{ride?.executive_remarks}</div>
                  </td>
                </tr>}
            </>)
          })}
        </tbody>
      </table>
      {!moreData && (
        <div className="text-center text-gray-500 dark:text-gray-400">
          🚫 No more rides data to load
        </div>
      )}
      <PublishModal open={publishModalOpen} details={selectedRide} onClose={()=>setPublishModalOpen(false)} onConfirm={()=>{refreshList();setPublishModalOpen(false);}}/>

      <CommonModal
        maxWidth="md"
        title={<span>Activity History {selectedRide?.urid && <b>({selectedRide?.urid})</b>}</span>}
        open={openModal}
        onClose={() => setModalOpen(false)}
        actions={[]}
      >
        <AddRemarksSection rideDetails={selectedRide || null} showHeader={false} isAddremarksSectionOpen />
      </CommonModal>

      <RideConnectionModal
        isOpen={showConnectionModal}
        onClose={() => setShowConnectionModal(false)}
        ridesData={selectedRide}
      />
    </div>
  );
};

export default AllRideTable;
