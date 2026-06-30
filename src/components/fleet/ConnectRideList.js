'use client';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FaCheckCircle, FaChild } from 'react-icons/fa';
import { BsArrowRight, BsFillLuggageFill } from 'react-icons/bs';
import { MdOutlineElderly } from "react-icons/md";
import { useRouter } from 'next/navigation';
import { apiClient } from '@/app/lib/apiClient';
import { Loader } from 'lucide-react';
import debounce from 'lodash.debounce';
import moment from 'moment';
const statusColors = {
  pending: 'text-[#FFC107]',
  taxiPool: 'text-[#03A9F4]',
  confirmed: 'text-[#009688]',
  assigned: 'text-[#3F51B5]',
  arrived: 'text-[#673AB7]',
  started: 'text-[#1B59F8]',
  completed: 'text-[#16A34A]',
  cancelled: 'text-[#F44336]',
  cabFound: 'text-[#8BC34A]',
  needCab: 'text-[#FF9800]',
  cancellation: 'text-[#E57373]',
  linkSent: 'text-[#00BCD4]',
  all: 'text-[#9E9E9E]',
  notVerified: 'text-[#FFB300]',
  activeRides: 'text-[#1E88E5]',
};


const ConnectRideList = () => {
  const [ridesData, setRidesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connectedRideList, setConnectedRideList] = useState([]);
  const [selectedRide, setselectedRide] = useState(null);
  const [querry, setQuerry] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const observerRef = useRef();
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const lastCardRef = useCallback(
    (node) => {
      if (!hasMore) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [hasMore]
  );
  const fetchRideDetails = useCallback(async (pageNo) => {
    try {
      const response = await apiClient("GET",'/ride_management/connected-booking-list', {
        page: pageNo,
        search: searchTerm,
        limit: 100
      });
      if(!response?.status || !response.success) {
        setRidesData([]);
        return;
      }
      let tempArr = response.data;
      if(tempArr.length > 0) {
        if(pageNo> 1) {
          setRidesData(prev => [...prev, ...tempArr])
        } else {
          setRidesData(prev => [...tempArr]);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching ride details:', error);
    }
  },[searchTerm]);

  React.useEffect(() => {
    if(!hasMore && page > 1) return;
    setLoading(true);
    // Fetch or set your rides data here
    fetchRideDetails(page).then(()=>setLoading(false));
  },[hasMore, page, fetchRideDetails]);
  const router = useRouter();

  const fetchConnectedRides = async (ride) => {
    try {
      setLoading(true);
      setselectedRide(ride?.urid);
      const response = await apiClient("GET",`/rideConnectionManagement/connectedRideListByurid/${ride?.urid}`); // Replace with your API endpoint
      if(!response?.status || !response.success) {
        setLoading(false);
        setConnectedRideList([]);
        return;
      }
      setConnectedRideList(response.data);
      setLoading(false);
      console.log('Fetched connected ride details:', response.data, connectedRideList);
    } catch (error) {
      console.error('Error fetching connected ride details:', error);
    }
  }
  const debouncedSearch = useMemo(() => debounce(async (querry) => {
    // if(!querry.trim()) return;
    setSearchTerm(prev=> querry);
  }, 100), [])

  const searchRide = useCallback(
      (querry) => debouncedSearch(querry),
      [debouncedSearch]
  );
  useEffect(()=>{
    searchRide(querry);
  }, [querry, searchRide]);

  const formatTime = (timeinMin) => {
    if (isNaN(timeinMin)) return timeinMin;
    if (!Number.isFinite(timeinMin) || timeinMin <= 0) return "00:00:00";
    const totalSeconds = Math.floor(timeinMin * 60);
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(hours)}:${pad(mins)}:${pad(secs)}`;

  }

  const goToSecondPage = (ride) => {
    window.open(`/ridesManagement/details?urid=${ride?.urid}`, "_blank"); // path to the next page
  };

  return (
    <div className="bg-white min-h-screen flex flex-col justify-center items-start overflow-auto scrollbar-hide ">
      <div className='flex justify-between w-full'>
        <div className="flex items-center">
          <div className="w-1 h-3 sm:h-6 rounded-md bg-green-700 mr-2 sm:mr-3"></div>
          <h2 className=" text-[16px] md:text-2xl font-bold font-nunito bg-gradient-to-r from-[#15803D] to-[#81CA18] bg-clip-text text-transparent">
            Connected Ride List
          </h2>
        </div>
        <div className='w-1/3'>
              <input type="text" placeholder='Search' className='bg-white text-black focus:outline-none border px-4 py-2 rounded-md w-full' value={querry} onChange={(e)=>setQuerry(e.target.value)} />
        </div>
      </div>
      <div className="bg-white rounded-xl  shadow-lg overflow-auto  w-full">
        {/* TABLE HEADER */}
        <div className="flex items-center gap-2 justify-between p-4 border-b">
          <div className='w-full'>Ride ID</div>
          <div className='w-full'>Name</div>
          <div className='w-full'>Location</div>
          <div className='w-full'>Type</div>
          <div className='w-full'>Gap</div>
          <div className='w-full'>Fare</div>
          <div className='w-full'>Published</div>
          <div className='w-full'>Highlights</div>
          {/* <div className='w-full'>Payout Details</div> */}
          <div className='w-full'></div>
        </div>
        {/* TABLE ROWS */}
        <div className="flex flex-col gap-2 shadow-lg ">
        {ridesData.length > 0 && ridesData.map((ride, idx) => {
          const isLastCard = idx === ridesData?.length -1;
          return (
          <>
          <div 
            key={idx+moment().milliseconds()}
            ref={isLastCard? lastCardRef: null}
            className="flex items-center gap-2 border-b hover:bg-gray-50"
          >
            

            {/* 1st cell: Ride ID */}
            <div className="w-full">
              <div className="font-semibold text-gray-900">{ride?.urid}</div>
              {/* <div className="text-xs text-gray-500">{ride?.number}</div> */}
              <div className="text-xs text-gray-500">{ride?.booking_travel_date}</div>
              <div className={`font-semibold ${statusColors[ride?.status]} capitalize w-[90%] flex rounded-md`}>{ride?.status}</div>

            </div>

            {/* Name */}
            <div className='w-full'>
              <div className="font-semibold text-gray-900">{ride?.user_details_json?.name}</div>
              <div className="text-xs text-gray-500">{ride?.user_details_json?.mobile}</div>
              {/* <div className="text-xs text-gray-500">Rating {ride?.rating}</div> */}
            </div>

            {/* Location */}
            <div className='w-full'>
              <div className="font-semibold text-gray-800" >{ride?.price_details_json?.estimated_km} Km</div>
              <div className="flex flex-col items-start">
                <div className="flex items-center">
                  <span className={`w-4 h-4 rounded-full border mr-5 bg-green-600 border-green-200`}></span>
                  <span className="text-gray-700 text-sm ">{ride?.source_city_name}</span>
                </div>
                <div className="flex items-center">
                  <span className={`w-4 h-4 rounded-full border mr-5 bg-red-600 border-red-200`}></span>
                  <span className="text-gray-700 text-sm ">{ride?.destination_city_name}</span>
                </div>
              </div>
            </div>

            <div className='w-full capitalize'>
              { ride?.cab_details_json? ride?.cab_details_json?.cab_type: ride?.op_cab_details_json ? ride?.op_cab_details_json?.cab_type : ride?.booing_type}
            </div>
            {/* Date and Time */}
            <div className='w-full'>
              {/* <div className="font-medium text-gray-800 text-sm">{ride?.booking_travel_date}</div> */}
              <div className="flex items-center gap-1 text-gray-600 text-sm">
                <span>Gap : <span className="font-bold text-gray-900">{ride?.gap || ride?.gap_km || 0}</span></span> 
                {/* {ride?.connectivity && <FaCheckCircle className="text-green-700 ml-1" size={16} />} */}
              </div>
              <div className="flex items-center gap-1 text-gray-600 text-sm"> Gap Time: <span className="font-bold text-gray-900"> {formatTime(ride?.gap_time || 0)}</span></div>
            </div>

            {/* Fare */}
            <div className='w-full'>
              <div className="font-semibold text-gray-900 text-base ">₹{ride?.price_details_json?.estimated_fare}/-</div>
              <div className="text-sm text-gray-500">{ride?.service_type}</div>
            </div>

            {/* Published */}

            <div className='w-full'>
              <div className="flex flex-col gap-2">
                {/* <span className="bg-gray-200 text-gray-800 text-sm px-3 py-2 rounded-md font-medium">{ride?.cab_details_json?.cab_reg || "N/A "}</span> */}
                <div className="text-sm text-black capitalize">{ride?.assigned_to_fleet}</div>
                
              </div>
            </div>
            {/* Highlights */}

            <div className='w-full'>
              <div className="flex flex-col gap-2">
                <span className="bg-gray-200 text-gray-800 text-sm px-3 py-2 rounded-md font-medium">{ride?.cab_details_json?.cab_reg || "N/A "}</span>
                <div className="text-sm text-gray-500">{ride?.cab_details_json?.cab_source}</div>
                
              </div>
            </div>
            {/* Payout Details*/}

            {/* <div className='w-full'>
              <div className=" text-gray-700">
                <div className='text-sm text-gray-900'>Operator Payout: ₹{ride?.price_details_json?.operator_payout || "-"}</div>
                </div>
              <div className="text-sm text-gray-500">Rodbez: ₹ <span className='text-green-500'>{ride?.price_details_json?.rodbez_fee || "-"}</span></div>
            </div> */}

            {/* Action Buttons */}
            <div className='w-full'>
              <div className="">
                <button onClick={() => goToSecondPage(ride)} className="text-blue-600 flex items-center gap-1 hover:underline">
                  Get Details <BsArrowRight />
                </button>
              </div>
              <div className="flex items-center">
                <button
                  onClick={()=>{
                    if(selectedRide == ride?.urid) { 
                      setselectedRide(null);
                      setConnectedRideList([]);
                    }else
                       fetchConnectedRides(ride);
                  }}
                  className="bg-blue-800 hover:bg-blue-900 text-white font-semibold rounded shadow transition px-2 py-2"
                >
                  {selectedRide == ride?.urid? "Hide Rides "+ connectedRideList.filter((nr)=> nr?.urid !== selectedRide).length: "Show Rides"}
                </button>
              </div>
            </div>
          </div>
            {connectedRideList.length > 0 && selectedRide === ride?.urid && (
              <div className="w-full bg-gray-300 border p-4 shadow-lg z-10">
                {loading ? (
                  <div className="text-center text-gray-500">Loading connected rides...</div>
                ) : (
                      <>
                        <div className="flex items-center gap-2 justify-between p-4 border-b">
                          <div className='w-full'>Ride ID</div>
                          <div className='w-full'>Name</div>
                          <div className='w-full'>Location</div>
                          <div className='w-full'>Type</div>
                          <div className='w-full'>Gap</div>
                          <div className='w-full'>Fare</div>
                          <div className='w-full'>Published</div>
                          <div className='w-full'>Highlights</div>
                          {/* <div className='w-full'>Payout Details</div> */}
                          <div className='w-full'></div>
                        </div>
                    {connectedRideList.filter((nr)=> nr?.urid !== selectedRide).map((ride, cIdx) => (
                      <>
                      <div
                        key={cIdx}
                        className="flex items-center gap-2 border-b hover:bg-gray-50 p-2"
                        >
                          <div
                            className="absolute right-[25px] top-08 transform -translate-y-1/2 flex items-center"
                            style={{ zIndex: 10 }}
                          >
                            <span className="flex items-center justify-center rounded-full border border-gray-400 w-8 h-8 bg-white text-base font-semibold text-gray-900 shadow-sm">
                              {cIdx + 1}
                            </span>
                          </div>
                        {/* 1st cell: Ride ID */}
                        <div className="w-full">
                          <div className="font-semibold text-gray-900">{ride?.urid}</div>
                          {/* <div className="text-xs text-gray-500">{ride?.number}</div> */}
                          <div className="text-xs text-gray-500">{ride?.booking_travel_date}</div>
                          <div className={`font-semibold ${statusColors[ride?.status]} capitalize w-[90%] flex rounded-md`}>{ride?.status}</div>
                        </div>

                        {/* Name */}
                        <div className='w-full'>
                          <div className="font-semibold text-gray-900">{ride?.user_details_json?.name}</div>
                          <div className="text-xs text-gray-500">{ride?.user_details_json?.mobile}</div>
                          {/* <div className="text-xs text-gray-500">Rating {ride?.rating}</div> */}
                        </div>

                        {/* Location */}
                        <div className='w-full'>
                          <div className="font-semibold text-gray-800" >{ride?.price_details_json?.estimated_km} Km</div>
                          <div className="flex flex-col items-start">
                            <div className="flex items-center">
                              <span className={`w-4 h-4 rounded-full border mr-5 bg-green-600 border-green-200`}></span>
                              <span className="text-gray-700 text-sm ">{ride?.source_city_name}</span>
                            </div>
                            <div className="flex items-center">
                              <span className={`w-4 h-4 rounded-full border mr-5 bg-red-600 border-red-200`}></span>
                              <span className="text-gray-700 text-sm ">{ride?.destination_city_name}</span>
                            </div>
                          </div>
                        </div>

                        <div className='w-full capitalize'>
                          { ride?.cab_details_json? ride?.cab_details_json?.cab_type: ride?.op_cab_details_json ? ride?.op_cab_details_json?.cab_type : ride?.booing_type}
                        </div>
                        {/* Date and Time */}
                        <div className='w-full'>
                          {/* <div className="font-medium text-gray-800 text-sm">{ride?.booking_travel_date}</div> */}
                          <div className="flex items-center gap-1 text-gray-600 text-sm">
                            <span>Gap : <span className="font-bold text-gray-900">{ride?.gap || ride?.gap_km || 0}</span></span>
                            {/* {ride?.connectivity && <FaCheckCircle className="text-green-700 ml-1" size={16} />} */}
                          </div>
                          <div className="flex items-center gap-1 text-gray-600 text-sm"> Gap Time: <span className="font-bold text-gray-900"> {formatTime(ride?.gap_time || 0)}</span></div>
                        </div>

                        {/* Fare */}
                        <div className='w-full'>
                          <div className="font-semibold text-gray-900 text-base ">₹{ride?.price_details_json?.estimated_fare}/-</div>
                          <div className="text-sm text-gray-500">{ride?.service_type}</div>
                        </div>
                        {/* Published */}
                        <div className='w-full'>
                          <div className="flex flex-col gap-2">
                            {/* <span className="bg-gray-200 text-gray-800 text-sm px-3 py-2 rounded-md font-medium">{ride?.cab_details_json?.cab_reg || "N/A "}</span> */}
                            <div className="text-sm text-black capitalize">{ride?.assigned_to_fleet}</div>
                          </div>
                        </div>

                        {/* Highlights */}

                        <div className='w-full'>
                          <div className="flex flex-col gap-2">
                            <span className="bg-gray-200 text-gray-800 text-sm px-3 py-2 rounded-md font-medium">{ride?.cab_details_json?.cab_reg || "N/A "}</span>
                            <div className="text-sm text-gray-500">{ride?.cab_details_json?.cab_source}</div>
                            
                          </div>
                        </div>
                        {/* Payout Details*/}
{/* 
                        <div className='w-full'>
                          <div className=" text-gray-700">
                            <div className='text-sm text-gray-900'>Operator Payout: ₹{ride?.price_details_json?.operator_payout || "-"}</div>
                          </div>
                          <div className="text-sm text-gray-500">Rodbez: ₹ <span className='text-green-500'>{ride?.price_details_json?.rodbez_fee || "-"}</span></div>
                        </div> */}

                        {/* Action Buttons */}
                        <div className='w-full'>
                          <div className="flex items-center ">
                            <button onClick={() => goToSecondPage(ride)} className="text-blue-600 flex items-center gap-1 hover:underline">
                              Get Details <BsArrowRight />
                            </button>
                          </div>
                        </div>
                      </div>
                      </>
                  )
                  
              )}</>)}
              {connectedRideList.length === 0 && (
                <div className="p-4 text-center text-gray-500">No rides available.</div>
              )}
              </div>
            )}
            </>
        )})}
          {ridesData.length === 0 && !loading &&  (
            <div className="p-4 text-center text-gray-500">No rides available.</div>
          )}
          {ridesData.length > 0 && !hasMore &&  (
            <div className="p-4 text-center text-gray-500 w-full">No more rides available.</div>
          )}
          {loading &&  (
            <div className="p-4 text-center text-gray-500 flex items-center justify-center w-full">
              <Loader className='animate-spin' size={24}/>
            </div>
          )}
        </div>
      </div>
    </div>
    
  );
};

export default ConnectRideList