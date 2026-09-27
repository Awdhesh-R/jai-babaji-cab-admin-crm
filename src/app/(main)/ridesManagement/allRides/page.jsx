'use client';
import BasicTable from '@/components/tables/BasicTable';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import UpdateDetailsModal from '@/components/modals/UpdateDetailsModal';
import AllRideCard from '@/components/cards/AllRideCard';
import { apiClient } from '@/app/lib/apiClient';
import { FiFastForward } from "react-icons/fi";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { FaMobileAlt, FaCalendarAlt, FaRegCopy, FaCheck, FaWhatsapp, FaArrowRight, FaLuggageCart, FaSuitcaseRolling, FaUser, FaTh, FaList, FaPlus } from "react-icons/fa";
import { FiCheckCircle } from 'react-icons/fi';
import { FaCarSide } from "react-icons/fa6";
import { BsExclamationCircle, BsAndroid2, BsArrowRightCircle } from "react-icons/bs";
import { IoIosAperture } from "react-icons/io";
import { RxCrossCircled } from "react-icons/rx";
import { TiLocationOutline } from "react-icons/ti";
import { CiUser, CiLocationOn } from "react-icons/ci";
import { HiMiniLink } from "react-icons/hi2";
import { useRouter } from 'next/navigation';
import StatusTabs from '@/components/customerDetail/StatusTabs';
import { Loader } from 'lucide-react';
import CustomLoader from '@/components/common/CustomLoader';
import SearchBar from '@/components/customerDetail/SearchBar';
import AutoCompleteSearch from '@/components/autocomplete/AutoCompleteSearch';
import moment from 'moment';
import Image from 'next/image';
import AllRideTable from '@/components/cards/AllRideTable';

const statusColors = {
  pending: 'bg-[#FFC107] text-white',
  taxiPool: 'bg-[#03A9F4] text-white',
  confirmed: 'bg-[#009688] text-white',
  assigned: 'bg-[#3F51B5] text-white',
  arrived: 'bg-[#673AB7] text-white',
  started: 'bg-[#1B59F8] text-white',
  completed: 'bg-[#16A34A] text-white',
  cancelled: 'bg-[#F44336] text-white',
  cabFound: 'bg-[#8BC34A] text-white',
  needCab: 'bg-[#FF9800] text-white',
  cancellation: 'bg-[#E57373] text-white',
  linkSent: 'bg-[#00BCD4] text-white',
  all: 'bg-[#9E9E9E] text-white',
  notVerified: 'bg-[#FFB300] text-white',
  activeRides: 'bg-[#1E88E5] text-white',
};

// const tabs = ['All', 'Pending', 'Searched', 'Processing', 'Confirmed', 'On Ride', 'Completed', 'Not Collected', 'Cancelled', 'Connected'];
const tabs = ['All', 'Pending', 'Searched', 'Processing', 'Confirmed', 'Assigned', 'Arrived', 'Started', 'Completed', 'Not Collected', 'Cancelled', 'Connected'];


const endPointMap = {
  all: "fetch-rides/all",
  searched: "fetch-rides/all",
  pending: "fetch-rides/pending",
  processing: "fetch-rides/processing",
  confirmed: "fetch-rides/confirmed",
  started: "fetch-rides/started",
  assigned: "fetch-rides/assigned",
  arrived: "fetch-rides/arrived",
  completed: "fetch-rides/completed",
  cancelled: "fetch-rides/cancelled",
  notcollected: "fetch-rides/completed",
  connectedRide: "allRide",
};


// const endPointMap = {
//   all: "all",
//   searched: "searched",
//   pending: "pending",
//   processing: "processing",
//   confirmed: "confirmed",
//   onride: "started",
//   completed: "completed",
//   cancelled: "cancelled",
//   notcollected: "completed",
//   connectedRide: "allRide",
// };

const AllRidesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCab, setSelectedCab] = useState({});
  const [modalAction, setModalAction] = useState('');
  const [modalMode, setModalMode] = useState('edit');
  const [viewType, setViewType] = useState("Card");
  const [allRides, setAllRides] = useState([]);
  const [statusTab, setStatusTab] = useState('all');
  const [rideserviceTypeData, setRideServiceTypeData] = useState();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef();
  const router = useRouter();
  const [querry, setQuerry] = useState("");
  const [searching, setSearching] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [rideSearchList, setRideSearchList] = useState([]);
  const [dateFilter, setDateFilter] = useState({startDate: null, endDate: null, rideType: "all"});
  const rideTypeOptions = [{
    label: "All",
    value: "all"
  },{
    label: "Oneway",
    value: "Oneway"
  },{
    label: "Rental",
    value: "Rental"
  },{
    label: "Offer",
    value: "Offer"
  }];

  const lastCardRef = useCallback((node) => {
    if (!hasMore) return;
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setPage(prev => prev + 1);
      }
    });
    if (node) observerRef.current.observe(node);
  }, [hasMore]);

  const goToDetail = () => {
    router.push('/ridesManagement/detailsPage');
  }

  const handleModalSubmit = () => {
    if (modalMode === 'add') {
      console.log('Adding new cab:', selectedCab);
    } else {
      console.log('Updating cab:', selectedCab);
    }
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedCab((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const getFilteredData = (arr) => {
  //   if(!arr || arr.length == 0 ) return [];
  //   let tempArr = [...arr];
  //   const filteredData = tempArr.filter((item) => {
  //     const itemDate = new Date(item.booking_travel_date); // Replace with your actual date field
  //     let passFilter = true;

  //     if (dateFilter.startDate) {
  //       passFilter = passFilter && itemDate >= dateFilter.startDate;
  //     }
  //     if (dateFilter.endDate) {
  //       passFilter = passFilter && itemDate <= dateFilter.endDate;
  //     }
  //     if(dateFilter.rideType !== "all") {
  //       passFilter = passFilter && item.service_type.toLowerCase() === dateFilter.rideType.toLowerCase()
  //     }
  //     return passFilter;
  //   });
  //   return filteredData;
  // }

  const fetchRides = useCallback(
    async (pageNo) => {
      try {
        const params = {
          serviceType: dateFilter.rideType,
          search: querry,
          startsAt: dateFilter.startDate? encodeURIComponent(moment(dateFilter.startDate).format("YYYY-MM-DD HH:mm:ss.SSS")): null,
          endsAt: dateFilter.endDate? encodeURIComponent(moment(dateFilter.endDate).add(23, "hours").add(59, "minutes").add(59,"seconds").format("YYYY-MM-DD HH:mm:ss.SSS")): null
        }
        let apiEndpoint = endPointMap[statusTab] || "allRide";
        if (querry) {
          apiEndpoint = `fetch-rides/${statusTab === 'all' ? 'all' : statusTab}`;
        }
        const response = await apiClient("GET", `/ride_management/${apiEndpoint}/${pageNo}`, params);
        let ridesArr = [];
        let hasMoreData = false;
        if (Array.isArray(response?.data)) {
          ridesArr = response.data;
          if (apiEndpoint === "allRide") {
            if (statusTab === "pending") {
              ridesArr = ridesArr.filter(ride => ride.status === "pending");
            } else if (statusTab === "processing") {
              ridesArr = ridesArr.filter(ride => ride.status === "processing");
            } else if (statusTab === "started") {
              ridesArr = ridesArr.filter(ride => ride.status === "started");
            } else if (statusTab === "assigned") {
              ridesArr = ridesArr.filter(ride => ride.status === "assigned");
            }
          }
          if (statusTab === "notcollected") {
            ridesArr = ridesArr.filter(ride => !ride.is_collected);
          }
          const total = (response?.totalRequest || 0) + (response?.totalBooking || 0) + (response?.totalConfirmed || 0) || response?.totalCount || ridesArr.length;
          setTotalCount(total);
          hasMoreData = ridesArr.length > 0;
        } else if (response?.data?.data && Array.isArray(response.data.data)) {
          ridesArr = response.data.data;
          if (statusTab === "notcollected") {
            ridesArr = ridesArr.filter(ride => !ride.is_collected);
          } else if (statusTab === "completed") {
            ridesArr = ridesArr.filter(ride => ride.is_collected);
          }
          if (response?.data?.total) {
             setRideServiceTypeData(response?.data?.total);
             setTotalCount(response?.data?.total?.total_count || response?.data?.total?.count || ridesArr.length);
          }
          hasMoreData = ridesArr.length > 0;
        } else if (response?.data?.enrichedRides && Array.isArray(response.data.enrichedRides)) {
          ridesArr = response.data.enrichedRides;
          if (statusTab === "notcollected") {
            ridesArr = response.data.enrichedRides.filter(ride=>!ride.is_collected)
          } else if (statusTab === "completed") {
            ridesArr = response.data.enrichedRides.filter(ride=>ride.is_collected)
          }
          setRideServiceTypeData(response?.data?.rideServiceTypeCounts);
          setTotalCount(response?.data?.totalCount);
          hasMoreData = response.data.enrichedRides.length > 0;
        }
        if (pageNo === 1) {
          setAllRides(ridesArr);
        } else {
          if (hasMoreData) {
            setAllRides((prev) => [...prev, ...ridesArr]);
          } else {
            setHasMore(false);
          }
        }
      } catch (error) {
        console.log("Error fetching rides:", error.message || error);
      }
    },
    [statusTab, dateFilter.startDate, dateFilter.endDate, dateFilter.rideType, querry]
  );

  const thead = (
    <tr className="bg-gray-100 dark:bg-gray-800 text-[14px] sm:text-[12px] text-gray-800 dark:text-gray-200 uppercase">
      {/* <th className="px-4 py-3 text-left font-semibold tracking-wide border-b border-gray-200 dark:border-gray-700">ID</th> */}
      <th className="px-4 py-3 text-left font-semibold tracking-wide border-b border-gray-200 dark:border-gray-700">Customer Name / URID</th>
      <th className="px-4 py-3 text-left font-semibold tracking-wide border-b border-gray-200 dark:border-gray-700">Locations</th>
      <th className="px-4 py-3 text-left font-semibold tracking-wide border-b border-gray-200 dark:border-gray-700">Distance/ Time</th>
      <th className="px-4 py-3 text-left font-semibold tracking-wide border-b border-gray-200 dark:border-gray-700">Fare</th>
      <th className="px-4 py-3 text-left font-semibold tracking-wide border-b border-gray-200 dark:border-gray-700">Driver/ Cab Details</th>
      <th className="px-4 py-3 text-left font-semibold tracking-wide border-b border-gray-200 dark:border-gray-700"></th>
    </tr>
  );

                  
  const tbody =  loading && allRides.length === 0 ? <Loader /> : allRides.length>0 ?
    allRides.map((item, index) => {
    return <tr
      key={index}
      className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
    >
      {/* <td className="px-2  text-[12px] text-gray-800 dark:text-gray-200">
        <div className="flex flex-col items-start">
          <button
            className='text-[12px] font-semibold text-[#2F6FED]'
          >
            {item?.urid.slice(0, 6)}
          </button>
        </div>
      </td> */}

      <td className="text-[12px] text-gray-800 dark:text-gray-200">
        <div className="flex flex-col pb-3 pt-3 text-sm w-full max-w-md mx-auto">
          {item?.user_details_json && 
            <div className='flex flex-col gap-1'>
              <p className='capitalize'>{item?.user_details_json?.name}</p>
              <p className='capitalize'>{item?.user_details_json?.book_for}</p>
              <p className='capitalize'>+91-{item?.user_details_json?.book_for == "self" ? item?.user_details_json?.mobile : item?.user_details_json?.book_contact}</p>
            </div>
          }
          <div className="text-gray-600 dark:text-gray-400 text-[12px]">
            URID:<span className="font-semibold">{item?.urid}</span>
          </div>
        </div>
      </td>

      <td className="px-2 text-sm text-gray-800 dark:text-gray-200">
        <div className="flex flex-col pb-3 text-sm w-full max-w-md">
          <div className="relative ml-3">
            {/* Vertical line centered on dots */}
            <div className="absolute left-[5px] top-2 bottom-2 w-[2px] bg-gray-300"></div>

            {/* Source City */}
            <div className="flex items-center gap-2 mb-4 relative">
              <span className="w-3 h-3 rounded-full bg-green-600 ring-2 ring-green-200 relative z-10"></span>
              <span className="text-gray-700 dark:text-gray-200 font-semibold">
                {item?.source_city_name}
              </span>
              <span
                className="ml-auto"
                onClick={e => {
                  e.stopPropagation();
                  const src = item?.booking_source_coordinates?.coordinates?.reverse();
                  const dest = item?.booking_destination_coordinates?.coordinates?.reverse();
                  if (src && dest) {
                    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(src)}&destination=${encodeURIComponent(dest)}`;
                    window.open(url, '_blank');
                  }
                }}
                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
              >
                <Image
                  src="/icons/googlemap.svg"
                  alt="Google Maps"
                  height={30}
                  width={30}
                />
              </span>
            </div>

            {/* Destination City */}
            <div className="flex items-center gap-2 relative">
              <span className="w-3 h-3 rounded-full bg-red-600 ring-2 ring-red-200 relative z-10"></span>
              <span className="text-gray-700 dark:text-gray-200 font-semibold">
                {item?.destination_city_name}
              </span>
            </div>
          </div>
        </div>
      </td>

      <td className="px-2 text-sm text-gray-800 dark:text-gray-200">
        <div className="flex flex-col pb-3 text-sm w-full max-w-md">

          <div className="flex flex-col gap-2">
            <p>{item?.distance_time_google_data?.distanceText}, {item?.distance_time_google_data?.durationText}, </p>
            <p>{item?.booking_travel_date} </p>
          </div>

        </div>
      </td>

      <td className="px-2 text-sm text-gray-800 dark:text-gray-200">
        <div className="flex flex-col pb-3 text-sm w-full max-w-md">
          <div className="flex flex-col gap-1">
            <p className='font-bold'>₹ {item?.price_details_json?.estimated_fare}/- </p>
            <p className='font text-xs'> {item?.service_type} </p>
            <p className='font text-xs'> {item?.booking_type} </p>
          </div>
        </div>
      </td>

      <td className="px-2 text-sm text-gray-800 dark:text-gray-200">
        <div className="flex flex-col pb-3 text-sm w-full max-w-md">
          <div className="flex flex-col gap-1 min-w-[100px]">

            {item?.cab_details_json?.cab_reg &&
              <div>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-green-600 text-white">
                  {item?.cab_details_json?.cab_reg}
                </span>
              </div>
            }
            <div className="flex items-center gap-2">
              {item?.driver_details_json && <div className='flex gap-1'>
                <p>{item?.driver_details_json?.drv_name}</p>
                <p>({item?.driver_details_json?.driver_mobile})</p>
              </div>
              }
            </div>

            <div className='flex items-center gap-2'>
              <div className="text-gray-500 text-xs flex items-center gap-2">
                <FaSuitcaseRolling/> {item?.passenger_details_json?.luggage_big}+
                {item?.passenger_details_json?.luggage_small}
              </div>

              {/* Adults & Children */}
              <div className="text-gray-500 text-xs flex items-center gap-2">
                <FaUser/> {item?.passenger_details_json?.adults},
                {item?.passenger_details_json?.children}
              </div>
            </div>
          </div>
        </div>
      </td>

      <td className="px-2 text-sm text-gray-800 dark:text-gray-200">
        <div className="flex flex-row gap-2 ">

          {item?.status?.toLowerCase() === 'confirmed' ?
            <p className='bg-green-500 text-white px-1 rounded-md text-[10px]'>
              Published
            </p> :
            <p className='bg-gray-500 text-white px-1 rounded-md text-[10px]'>Publish</p>
          }

          {item?.connected_ride_id ?
            <p className='bg-green-500 text-white px-1 rounded-md text-[10px]'>Connected</p> :
            <p className='bg-gray-500 text-white px-1 rounded-md text-[10px]'>Connect</p>
          }
        </div>
        <div onClick={() => router.push(`/ridesManagement/details?urid=${item?.urid}`)}
          className="flex flex-row my-2 items-center gap-1 hover:cursor-pointer hover:text-blue-500">
          Get Details <FaArrowRight />
        </div>
      </td>

    </tr>
  }
  ): loading && <Loader />;


  useEffect(() => {
    if (!hasMore && page > 1) return;
    setLoading(true);
    if (page === 1) {
      setAllRides([]);
    }
    console.log(dateFilter)
    fetchRides(page).finally(() => setLoading(false));
  }, [page, hasMore, fetchRides]);

  useEffect(() => {
    fetchRides(1).finally(() => setLoading(false));
  }, [dateFilter.startDate, dateFilter.endDate, dateFilter.rideType, querry, fetchRides])

  useEffect(() => {
    setHasMore(true);
    setPage(prev=> 1);
  }, [statusTab]);





  

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex justify-end w-full sticky top-[85px] z-10 gap-2'>
        <div className='w-1/3'>
              <input type="text" placeholder='Search' className='bg-white text-black focus:outline-none border px-4 py-2 rounded-md w-full' value={querry} onChange={(e)=>setQuerry(e.target.value)} />
        </div>
        <button type="button" className='border border-blue-700 shadow-md bg-blue-500 text-white rounded-xl font-semibold flex gap-2 px-4 items-center' onClick={()=>{window.open("/ridesManagement/AddNewBooking", "_blank")}}>
          <FaPlus className='' />
          Add New Booking
        </button>
      </div>
      <div className=''>
        <StatusTabs statusTab={statusTab} setStatusTab={setStatusTab} rideserviceTypeData={rideserviceTypeData} totalCount={totalCount} tabs={tabs} />
      </div>
      <div>
        <div className="w-full  flex justify-between items-end">
          <div className="border-l-4 flex flex-row gap-4 justify-between w-full border-blue-500 pl-4 border-none">
            {/* <SearchBar /> */}
            <div>
              <label htmlFor="DateRange"  className='text-xs'>Date Range</label>
              <div className='flex gap-4' id='DateRange'>
                <input
                  type="date"
                  placeholder='Start Date'
                  value={dateFilter.startDate ? dateFilter.startDate : ""}
                  className="py-2 px-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-white"

                  onChange={(e) => setDateFilter({ ...dateFilter, startDate: e.target.value ? moment(e.target.value).format("YYYY-MM-DD") : null })}
                />
                <input
                  type="date"
                  placeholder='End Date'
                  className="py-2 px-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-white"
                  value={dateFilter.endDate ? dateFilter.endDate : ""}
                  onChange={(e) => setDateFilter({ ...dateFilter, endDate: e.target.value ? moment(e.target.value).format("YYYY-MM-DD") : null })}
                />
              </div>
            </div>
            <div className='flex gap-4 items-end'>
              <div className='flex flex-col gap-2'>
                <label htmlFor="Ride_Type" className='text-xs'>Ride Type: </label>
                <select
                  id='Ride_Type'
                  className="py-2 px-3 bg-white rounded-lg dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-sm text-gray-700 dark:text-white"
                  value={dateFilter.rideType || ""}
                  onChange={(e) => setDateFilter({ ...dateFilter, rideType: e.target.value ? e.target.value : "all" })}
                >{ rideTypeOptions.map(opt => (
                  <option key={opt.label} value={opt.value}>{opt.label}</option>
                ))
                }
                </select>
              </div>
              <div>
                <div className="flex justify-end bg-gray-600 gap-0 rounded-md">
                  <button
                    className={`flex items-center gap-2 px-3 py-1 rounded-l-md border ${viewType === 'Card' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                    onClick={() => setViewType('Card')}
                  >
                    <FaTh />
                  </button>
                  <button
                    className={`flex items-center gap-2 px-3 py-1 rounded-r-md border ${viewType === 'Table' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                    onClick={() => setViewType('Table')}
                  >
                    <FaList />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        {loading && allRides?.length === 0 ? <CustomLoader />
          :
          viewType === 'Table' ? (
            <div className=" overflow-x-auto">
              {/* s<BasicTable
                title="RB Booking"
                thead={thead}
                tbody={
                  loading && allRides.length === 0 ? <Loader />

                    : tbody
                }
                getDetail={goToDetail}
              /> */}
              <AllRideTable rides={allRides}
                getDetail={goToDetail}
                moreData={hasMore}
                checklastCardRef={lastCardRef} refreshList={()=>fetchRides(1).finally(()=>setLoading(false))} />
              {loading && allRides?.length > 0 &&  <CustomLoader />}
            </div>

          ) : (
            <div>
              <AllRideCard
                rides={allRides}
                moreData={hasMore}
                checklastCardRef={lastCardRef}
                refreshList={()=>fetchRides(1).finally(()=>setLoading(false))}
                getDetail={goToDetail}
              />
              {loading && allRides?.length > 0 &&  <CustomLoader />}
            </div>
          )
        }
      </div>

      {/* UPDATE MODAL  */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <UpdateDetailsModal
          isOpen={isModalOpen}
          title={modalAction === 'confirm_ride' ? 'Confirm Ride' : modalAction === 'cancel_request' ? 'Cancel Request' : modalAction === 'add_remarks' ? 'Add Remarks' : modalAction === 'whatsapp_chat' ? 'Whatsapp Chat' : 'Edit Details'}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleModalSubmit}
          modalAction={modalAction}
        >
          {modalAction === 'confirm_ride' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  ['Distance', 'distance'],
                  ['Price(₹)', 'price'],
                  ['Advance Amount', 'advance'],
                  ['CAB (Probable)', 'cab_number'],
                  ['Required Carrier', 'carrier'],
                  ['Payment Status', 'payment_status'],
                ].map(([label, name]) => (
                  <div key={name}>
                    <label className="block text-[12px] text-gray-700">{label}</label>

                    {name === 'cab_type' ? (
                      <select
                        name={name}
                        className="w-full rounded-md border border-gray-300 bg-white px-4 py-1.5 text-[12px]"
                        value={selectedCab[name] || ''}
                        onChange={handleChange}
                      >
                        <option value="sedan">Sedan</option>
                        <option value="mini">Mini</option>
                        <option value="suv">SUV</option>
                      </select>

                    ) : name === 'carrier' ? (
                      <select
                        name={name}
                        className="w-full rounded-md border border-gray-300 bg-white px-4 py-1.5 text-[12px]"
                        value={selectedCab[name] || ''}
                        onChange={handleChange}
                      >
                        <option value="">--Please Select--</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>

                    ) : name === 'payment_status' ? (
                      <select
                        name={name}
                        className="w-full rounded-md border border-gray-300 bg-white px-4 py-1.5 text-[12px]"
                        value={selectedCab[name] || ''}
                        onChange={handleChange}
                      >
                        <option value="">--Please Select--</option>
                        <option value="not paid">Confirm--Not Paid</option>
                        <option value="paid">Confirm--Paid</option>
                      </select>

                    ) : (
                      <input
                        name={name}
                        type={name === 'date' ? 'date' : name === 'time' ? 'time' : 'text'}
                        className="w-full rounded-md border border-gray-300 bg-white px-4 py-1.5 text-[12px]"
                        placeholder={label}
                        value={selectedCab[name] || ''}
                        onChange={handleChange}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <label className="block text-[12px] text-gray-700">Additional Remarks</label>
                <textarea
                  rows={3}
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-1.5 text-[12px]"
                  placeholder="Enter any special instructions or notes…"
                  name="remarks"
                  value={selectedCab.remarks}
                  onChange={handleChange}
                ></textarea>
              </div>
            </>
          )}

          {modalAction === 'cancel_request' && (
            <>
              <div className="bg-[#F9FAFB] border border-gray-200 rounded-xl p-4 mb-6">
                <h1 className='mb-2 text-[#374151] text-[14px]'>TRIP DETAILS</h1>
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-8 h-8 rounded-md bg-[#DBEAFE] flex items-center justify-center">
                    <CiLocationOn className='text-[#3B82F6] text-xl' />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[12px] font-semibold text-gray-800">To Chhatrapati Shivaji Airport</p>
                    <p className="text-[12px] font-semibold text-gray-800">Mumbai Central Station</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-md bg-[#F3E8FF] flex items-center justify-center">
                    <CiUser className='text-[#9333EA] text-xl' />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[12px] font-semibold text-gray-800">Raj Patel</p>
                    <p className="text-[12px] text-gray-500">+91-9693189968</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-[12px] text-gray-700">Cancellation Reason</label>
                <select
                  name="rejection_reason"
                  className="w-full rounded-md outline-none border border-red-400 bg-white px-4 py-1.5 text-[12px]"
                  value={selectedCab.rejection_reason || ''}
                  onChange={handleChange}
                >
                  <option value="">Select a reason for cancellation</option>
                  <option value="driver not reachable">Driver not reachable</option>
                  <option value="cab unavailable">Cab unavailable</option>
                  <option value="duplicate booking">Duplicate booking</option>
                </select>
              </div>

              {/* Additional Remarks */}
              <div className="mb-6">
                <label className="block text-[12px] text-gray-700">Additional Remarks</label>
                <textarea
                  name="cancel_remarks"
                  rows={3}
                  placeholder="Please provide additional details the cancellation.."
                  value={selectedCab.cancel_remarks || ''}
                  onChange={handleChange}
                  className="w-full rounded-md outline-none border border-gray-300 bg-white px-4 py-1.5 text-[12px]"
                />
              </div>
            </>
          )}

          {modalAction === 'add_remarks' && (
            <div className="space-y-3">
              <div>
                <h3 className="text-[12px] font-medium text-gray-600 mb-1">RECENT ACTIVITY</h3>
                <div className="bg-gray-100 rounded-md p-3 max-h-64 overflow-y-auto">
                  <div className="mb-1">
                    <p className="text-[12px]">
                      <span className="text-blue-600 font-semibold">Abhishek</span> – 2024-01-15 at 10:00 AM
                    </p>
                    <p className="text-gray-700 text-[12px]">Customer confirmed pickup location</p>
                  </div>
                  <div>
                    <p className="text-[12px]">
                      <span className="text-blue-600 font-semibold">Abhishek</span> – 2024-01-15 at 10:00 AM
                    </p>
                    <p className="text-gray-700 text-[12px]">Some other remark...</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] text-gray-700">Remarks Type</label>
                  <select
                    name="remarks_type"
                    value={selectedCab.remarks_type || ''}
                    onChange={handleChange}
                    className="w-full text-[12px] rounded-md border border-gray-300 outline-none bg-white px-4 py-1.5"
                  >
                    <option value="">Select remarks category</option>
                    <option value="pickup_confirmed">Pickup Confirmed</option>
                    <option value="driver_assigned">Driver Assigned</option>
                    <option value="rescheduled">Rescheduled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] text-gray-700">Connected Rides</label>
                  <input
                    name="connected_ride"
                    type="text"
                    value={selectedCab.connected_ride || ''}
                    onChange={handleChange}
                    placeholder="Link to another ride (optional)"
                    className="w-full text-[12px] rounded-md border border-gray-300 outline-none bg-white px-4 py-1.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] text-gray-700">Additional Remarks</label>
                <textarea
                  name="notes"
                  rows={3}
                  value={selectedCab.notes || ''}
                  onChange={handleChange}
                  placeholder="Enter any special instructions or notes..."
                  className="w-full text-[12px] rounded-md border border-gray-300 bg-white px-4 py-1.5 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] text-gray-700">Next Call Date</label>
                  <input
                    name="call_date"
                    type="date"
                    value={selectedCab.call_date || ''}
                    onChange={handleChange}
                    className="w-full text-[12px] rounded-md border border-gray-300 px-4 py-1.5"
                  />
                </div>

                <div>
                  <label className="block text-[12px] text-gray-700">Time</label>
                  <input
                    name="call_time"
                    type="time"
                    value={selectedCab.call_time || ''}
                    onChange={handleChange}
                    className="w-full text-[12px] rounded-md border border-gray-300 px-4 py-1.5"
                  />
                </div>
              </div>
            </div>
          )}

          {modalAction === 'whatsapp_chat' && (
            <div className="space-y-4">
              {/* TRIP DETAILS  */}
              <div className="bg-[#F9FAFB] border border-gray-200 rounded-xl p-4 mb-6">
                <h1 className='mb-4 text-[#374151] text-[16px]'>TRIP DETAILS</h1>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 rounded-md bg-[#DBEAFE] flex items-center justify-center">
                    <CiLocationOn className='text-[#3B82F6] text-xl' />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold text-gray-800">Mumbai Central Station</p>
                    <p className="text-sm text-gray-500">to Chhatrapati Shivaji Airport</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-md bg-[#F3E8FF] flex items-center justify-center">
                    <CiUser className='text-[#9333EA] text-xl' />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold text-gray-800">Raj Patel</p>
                    <p className="text-sm text-gray-500">+91-9693189968</p>
                  </div>
                </div>
              </div>

              {/* LAST MESSAGE SENT  */}
              <div className="bg-green-50 border border-[#F3F4F6] rounded-lg p-3 mb-4 flex items-start justify-between flex-col">
                <span>Last Message Sent</span>
                <div className='flex items-center justify-between w-full'>
                  <div className='space-y-[-2px]'>
                    <p className="text-[14px] text-[#005FE2] font-medium">Rb_pen_location_verify</p>
                    <p className="text-[12px] text-[#979090]">2025-15-10 10:30 AM</p>
                  </div>
                  <div className="flex items-center gap-2 bg-[#9CE4B7] text-green-600 rounded-2xl px-4 py-1.5">
                    <FiCheckCircle />
                    <span className="text-[12px] font-medium">Sent</span>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Message Template</label>
                  <select
                    className="w-full mt-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F3F4F6]"
                  >
                    <option>Choose a WhatsApp template</option>
                    <option value="location_verify">Rb_pen_location_verify</option>
                    <option value="ride_confirm">Rb_ride_confirm</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">WhatsApp Number</label>
                  <input
                    type="text"
                    defaultValue="+91-9693189968"
                    className="w-full mt-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F3F4F6]"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Payment Link (Optional)</label>
                  <input
                    type="text"
                    placeholder="Enter Razorpay payment link"
                    className="w-full mt-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F3F4F6]"
                  />
                </div>
              </div>
            </div>
          )}
        </UpdateDetailsModal>
      </div>
    </div>
  );
};

export default AllRidesPage;