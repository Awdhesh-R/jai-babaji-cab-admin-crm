'use client'
import React, { useEffect, useState } from 'react';
import { IoHomeOutline } from "react-icons/io5";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { apiClient } from '@/app/lib/apiClient';
import {
  FaCar,
  FaPhone,
  FaPhoneAlt,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaBuilding,
  FaClock,
  FaUser,
} from "react-icons/fa";
import { getCabType } from '@/helpers/utils';

const statuses = ["Upcoming", "Completed", "Cancelled"];

// const cabList = [
//     { number: 'BR 12 AB 1234', status: 'Active' },
//     { number: 'BR 12 AB 1234', status: 'Active' },
//     { number: 'BR 12 AB 1234', status: 'Active' },
//     { number: 'BR 12 AB 1234', status: 'Inactive' },
//     { number: 'BR 12 AB 1234', status: 'Active' },
//     { number: 'BR 12 AB 1234', status: 'Active' },
//     { number: 'BR 12 AB 1234', status: 'Active' },
//     { number: 'BR 12 AB 1234', status: 'Active' }
// ];

const TotalCabs = ({ fleetId }) => {
    //  console.log("fleet response", fleetId)
    const router = useRouter();
    const [cabList, setCabList] = useState([])
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("Upcoming");
      const [upcomingRides, setUpcomingRides] = useState([]);
      const [completedRides, setCompletedRides] = useState([]);
      const [cancelledRides, setCancelledRides] = useState([]);
      
        const [showFull, setShowFull] = useState(null);


    useEffect (() => {
       

        if(!fleetId) return;
        const fetchCabs = async () => {
            // console.log("fleetId", fleetId)

            try {
                const res = await apiClient("GET", `/fleet/getTotalCabsList-by-fleetId/${fleetId}`);
                console.log("cabResList data show", res)
                if (res?.data) {
                   setCabList(res?.data); 
                }  else {
                    console.warn("No cabs found for this fleet.");
                    setCabList([]); // default value
    }

      if (fleetId ) {
              const upcomingRes = await apiClient(
                "GET",
                `/fleet/getOperatorRidesByStatus/${fleetId }?status=upcoming`,
                "",
                true
              );
              setUpcomingRides(upcomingRes?.data || []);
    
              const completedRes = await apiClient(
                "GET",
                `/fleet/getOperatorRidesByStatus/${fleetId }?status=completed`,
                "",
                true
              );
              setCompletedRides(completedRes?.data || []);
    
              const cancelledRes = await apiClient(
                "GET",
                `/fleet/getOperatorRidesByStatus/${fleetId }?status=cancelled`,
                "",
                true
              );
              setCancelledRides(cancelledRes?.data || []);
            } 

            } catch (error) {
                console.error('Error fetching cabs:', error);
            } finally {
                setLoading(false);
            }
        };

        

        fetchCabs();
    }, [fleetId]);


     const ridesMap = {
    Upcoming: upcomingRides,
    Completed: completedRides,
    Cancelled: cancelledRides,
  };
    

    
    return (
        <div className='space-y-2'>
            {/* <div className="border border-[#babbba] p-2 flex items-center gap-2 bg-white dark:bg-gray-900 mt-1">
                <IoHomeOutline className="text-gray-400" size={18} />
                <MdKeyboardDoubleArrowLeft className="text-gray-400 w-4 h-4" />
                <span className="text-sm text-gray-600 font-medium">Fleet Dashboard</span>
                <MdKeyboardDoubleArrowLeft className="text-gray-400 w-4 h-4" />
                <Link href="#" className="text-sm text-gray-600 font-medium hover:underline hover:text-blue-600">Active Fleets Kumar Murari</Link>
                <MdKeyboardDoubleArrowLeft className="text-gray-400 w-4 h-4" />
                <Link href="#" className="text-sm text-blue-600 font-medium hover:underline"> Total Cabs</Link>
            </div> */}
            <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <span className="text-sm text-blue-600 font-medium">{cabList.length} Total Cab </span>
                    <Link href="/fleetManagement/fleetDetails" className="text-sm text-blue-600 font-medium hover:underline">
                        ← Back to Fleet
                    </Link>
                </div>

                {/* Cab Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {cabList.map((cab, index) => (
                        cab ? (
                        <div
                            key={cab.id || index}
                            className="border rounded-xl shadow hover:shadow-md bg-white overflow-hidden transition"
                        >
                            <div className="bg-[url('/images/carbg.svg')] bg-cover bg-center p-4 rounded-lg border">
                                <Image
                                    src="/images/fleetCar.png"
                                    alt="Cab"
                                    width={150}
                                    height={150}
                                    className="mx-auto h-32 object-contain"
                                />
                            </div>

                            <div className="p-4 flex flex-col items-center text-center">
                                <h3 className="font-semibold text-lg text-gray-800 mb-4 capitalize">{cab.registration_no || "N/A"} ({getCabType(cab.cab_type || "Unknown Type")})</h3>

                                <div className="flex justify-between items-center w-full gap-2">
                                    <span className={`text-sm px-3 py-1 rounded-full font-medium ${cab.cab_status === 'Active'
                                        ? 'text-green-700 bg-green-100'
                                        : 'text-orange-500 border border-orange-300'
                                        }`}>
                                        {cab.cab_status || "Unkown"}
                                    </span>
                                   <Link href={`/fleetManagement/cabDetailsVerification/${cab?.id}`} className="text-sm text-blue-600 font-medium hover:underline">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                        ) : null
                    ))}
                </div>
                
            </div>
                  <div className="p-4 md:p-6 border rounded-xl bg-white shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                      Default Rides
                    </h2>
                    <div className="flex justify-between items-center mb-6 bg-gray-50 p-1 rounded-full shadow-inner overflow-auto w-full">
                      {statuses.map((status) => {
                        const isActive = activeTab === status;
            
                        let activeClasses = "";
                        if (status === "Completed" && isActive) {
                          activeClasses =
                            "bg-gradient-to-r from-green-400 to-green-900 text-white";
                        } else if (status === "Cancelled" && isActive) {
                          activeClasses =
                            "bg-gradient-to-r from-red-400 to-red-700 text-white";
                        } else if (isActive) {
                          activeClasses =
                            "bg-gradient-to-r from-[#005ED7] to-[#2E89FF] text-white";
                        }
            
                        return (
                          <button
                            key={status}
                            onClick={() => setActiveTab(status)}
                            className={`flex-1 text-center px-4 py-2 rounded-full font-medium text-sm transition whitespace-nowrap ${
                              isActive ? activeClasses : "text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            {status}
                            <span
                              className={`ml-2 font-semibold inline-block rounded-full px-2 py-0.5 ${
                                isActive
                                  ? "bg-[#58A1FF] text-white"
                                  : "bg-gray-200 text-gray-600"
                              }`}
                            >
                              {/* {fleetRides.filter((ride) => ride.status === status).length} */}
                              {ridesMap[status]?.length || 0}
                            </span>
                          </button>
                        );
                      })}
                    </div>
            
                    <div className="flex flex-col gap-4">
                      {/* {rides
                                    .filter((ride) => ride.status === activeTab)
                                    .map((ride, index) => ( */}
                      {(ridesMap[activeTab] || []).map((ride, index) => (
                        <div
                          key={index}
                          className="bg-white border rounded-xl p-4 shadow hover:shadow-md transition flex justify-between"
                        >
                          <div className="flex flex-col justify-between">
                            <div>
                              <span className="text-xs bg-blue-100 font-semibold text-blue-600 px-2 py-1 rounded-full capitalize mb-2 inline-block">
                                {ride.ride_status}
                              </span>
            
                              <div className="flex items-center gap-3 text-sm font-medium text-gray-800 mb-1 relative">
                                <FaMapMarkerAlt className="text-red-500" />
                                <span
                                  className="max-w-[140px] truncate cursor-pointer"
                                  onClick={() =>
                                    setShowFull(
                                      showFull === `${index}-source`
                                        ? null
                                        : `${index}-source`
                                    )
                                  }
                                >
                                  {ride.booking?.location_details?.source}
                                </span>
                                {showFull === `${index}-source` && (
                                  <div className="absolute z-10 top-full left-0 mt-1 px-2 py-1 bg-white border rounded shadow text-xs max-w-[330px] break-words whitespace-normal">
                                    <div>{ride.booking?.location_details?.source}</div>
                                    <div>
                                      <span className="font-semibold">Distance:</span>{" "}
                                      {ride.booking?.location_details?.distance || "--"}
                                    </div>
                                  </div>
                                )}
            
                                <span className="mx-2 text-gray-400">→</span>
            
                                <FaMapMarkerAlt className="text-green-600" />
                                <span
                                  className="max-w-[140px] truncate cursor-pointer"
                                  onClick={() =>
                                    setShowFull(
                                      showFull === `${index}-destination`
                                        ? null
                                        : `${index}-destination`
                                    )
                                  }
                                >
                                  {ride.booking?.location_details?.destination}
                                </span>
                                {showFull === `${index}-destination` && (
                                  <div className="absolute z-10 top-full left-0 mt-1 px-2 py-1 bg-white border rounded shadow text-xs max-w-[330px] break-words whitespace-normal">
                                    <div>{ride.booking?.location_details?.destination}</div>
                                    <div>
                                      {/* <span className="font-semibold">Distance:</span>{' '}
                                      {ride.booking?.location_details?.distance_to_destination || '--'} */}
                                    </div>
                                  </div>
                                )}
                              </div>
            
                              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                <FaClock className="text-gray-400" />
                                {/* {ride.time} */}
                                {new Date(ride.ride_accept_time).toLocaleString()}
                              </div>
            
                              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                <FaUser className="text-gray-400" />
                                <span className="font-semibold text-gray-800">
                                  {ride.booking?.driver_details_json?.drv_name || "N/A"}
                                </span>
                                <span className="text-gray-500">
                                  {ride.booking?.driver_details_json?.driver_mobile ||
                                    "N/A"}
                                </span>
                              </div>
            
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <FaCar className="text-gray-400" />
                                {ride.booking?.cab_details_json?.cab_reg || "N/A"}
                              </div>
                            </div>
                          </div>
            
                          <div className="flex flex-col justify-end">
                            <div className="text-white text-[14px] bg-gradient-to-r from-[#10B981] to-[#16A34A] px-3 py-1 rounded-md self-end mt-auto">
                              ₹{ride.booking?.price_details_json?.collected_by_driver || "0"}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
        </div>
    )
}

export default TotalCabs