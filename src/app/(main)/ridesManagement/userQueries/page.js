'use client';
import BasicTable from '@/components/tables/BasicTable';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import UpdateDetailsModal from '@/components/modals/UpdateDetailsModal';
import AllRideCard from '@/components/cards/AllRideCard';
import { apiClient } from '@/app/lib/apiClient';
import { FiFastForward } from "react-icons/fi";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { FaMobileAlt, FaCalendarAlt, FaRegCopy, FaCheck, FaWhatsapp } from "react-icons/fa";
import { FiCheckCircle } from 'react-icons/fi';
import { FaCarSide } from "react-icons/fa6";
import { BsExclamationCircle, BsAndroid2 } from "react-icons/bs";
import { IoIosAperture } from "react-icons/io";
import { RxCrossCircled } from "react-icons/rx";
import { TiLocationOutline } from "react-icons/ti";
import { CiUser, CiLocationOn } from "react-icons/ci";
import { HiMiniLink } from "react-icons/hi2";
import { useRouter } from 'next/navigation';
import StatusTabs from '@/components/customerDetail/StatusTabs';

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

const tabs = ['Pending', 'Processing', 'Confirmed', 'On Ride', 'Completed', 'Cancelled', 'Connected Ride'];
const endPointMap = {
  pending: "userQueries",
  processing: "processingRides",
  confirmed: "confirmRide",
  onride: "onRide",
  completed: "complete",
  cancelled: "cancelRide",
  connectedride: "allRide",
};

const PendingRidesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCab, setSelectedCab] = useState({});
  const [modalAction, setModalAction] = useState('');
  const [modalMode, setModalMode] = useState('edit');
  const [viewType, setViewType] = useState("Card");
  const [allRides, setAllRides] = useState([]);
  const [statusTab, setStatusTab] = useState('pending');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef();
  const router = useRouter();

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

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleEditClick = (item, action) => {
    setSelectedCab(item);
    setModalAction(action);
    setIsModalOpen(true);
  };

  const handleNewClick = () => {
    setModalMode('add');
    setSelectedCab({
      vehicle_number: '',
      vehicle_model: '',
      driver_name: '',
      phone: '',
      rc_number: '',
      status: 'ACTIVE'
    });
    setIsModalOpen(true);
  };

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

  // const fetchRides = async (pageNo) => {
  //   try {
  //     const apiEndpoint = endPointMap[statusTab];
  //     const response = await apiClient("GET", `/ride_management/${apiEndpoint}/${pageNo}`);
  //     if (response && response.data?.length > 0) {
  //       if (pageNo === 1) {
  //         setAllRides(response.data);
  //         // console.log(response.data);
  //       } else {
  //         setAllRides((prev) => [...prev, ...response?.data]);
  //       }
  //     } else {
  //       setHasMore(false);
  //     }
  //   } catch (error) {
  //     console.log("Error fetching rides:", error.message || error);
  //   }
  // };

  const fetchRides = useCallback(
    async (pageNo) => {
      try {
        const apiEndpoint = endPointMap[statusTab];
        const response = await apiClient("GET", `/ride_management/${apiEndpoint}/${pageNo}`);
        if (response && response.data?.length > 0) {
          if (pageNo === 1) {
            setAllRides(response.data);
          } else {
            setAllRides((prev) => [...prev, ...response?.data]);
          }
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.log("Error fetching rides:", error.message || error);
      }
    },
    [statusTab] // dependency: changes when tab changes
  );

  const thead = (
    <tr className="bg-gray-100 dark:bg-gray-800 text-[14px] sm:text-[12px] text-gray-800 dark:text-gray-200 uppercase">
      <th className="px-4 py-3 text-left font-semibold tracking-wide border-b border-gray-200 dark:border-gray-700">ID</th>
      <th className="px-4 py-3 text-left font-semibold tracking-wide border-b border-gray-200 dark:border-gray-700">Name</th>
      <th className="px-4 py-3 text-left font-semibold tracking-wide border-b border-gray-200 dark:border-gray-700">CAB#</th>
      <th className="px-4 py-3 text-left font-semibold tracking-wide border-b border-gray-200 dark:border-gray-700">Status</th>
      <th className="px-4 py-3 text-left font-semibold tracking-wide border-b border-gray-200 dark:border-gray-700">Locations</th>
      <th className="px-4 py-3 text-left font-semibold tracking-wide border-b border-gray-200 dark:border-gray-700">Actions</th>
    </tr>
  );

  const tbody = allRides.map((item) => (
    <tr
      key={item.id}
      className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
    >
      {/* ID */}
      <td className="px-4 py-3 text-[12px] text-gray-800 dark:text-gray-200">
        <div className="flex flex-col items-start">
          <button
            className='text-[12px] font-semibold text-[#2F6FED]'
            onClick={() => router.push(`/ridesManagement/details?urid=${item?.urid}`)}
          >
            {item?.urid.slice(0, 6)}
          </button>
          <HiOutlineLocationMarker className='text-[#0CC638] text-[20px]' />
        </div>
      </td>
      {/* NAME  */}
      <td className="text-[12px] text-gray-800 dark:text-gray-200">
        <div className="flex flex-col pb-3 pt-3 text-sm w-full max-w-md mx-auto">
          <button className="bg-[#2F6FED] text-white px-2 rounded-md w-fit text-[12px] cursor-pointer">
            {item?.c_name}
          </button>

          <button
            className="flex items-center gap-2 text-gray-700 dark:text-gray-200 cursor-pointer hover:text-blue-600 whitespace-nowrap"
            onClick={() => handleCopy(item?.book_contact)}
          >
            <FaMobileAlt className="text-blue-600 text-[12px]" />
            <span className="flex items-center gap-1 text-[12px]">
              {item?.book_contact} {copied ? <FaCheck className='text-[12px]' /> : <FaRegCopy className='text-[12px]' />}
            </span>
          </button>
          <div className="text-gray-700 dark:text-gray-300 flex items-center gap-1">
            <FaWhatsapp className='text-[12px] text-green-600' /> <span className='text-[12px]'>{item?.c_wa_number}</span>
          </div>

          <div className="text-gray-600 dark:text-gray-400 text-[12px]">
            URID:<span className="font-semibold">{item?.urid}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
            <HiMiniLink className="text-blue-600 text-[12px]" />
            {/* <span>Connect Ride</span> */}
            <button className="bg-[#FF9F05] text-white px-1 rounded-md w-fit text-[12px]">Connect Ride</button>
            <span className="h-4 w-[2px] bg-gray-400"></span>
            <div className="text-black text-[14px]">
              {item?.req_src_type?.toLowerCase() === 'android' ? <BsAndroid2 /> : <IoIosAperture />}
            </div>
          </div>

          <div className="flex items-center gap-1 text-[12px]">
            <button><i className="text-red-600 font-medium">Settled?</i></button>
            <span className="h-4 w-[2px] bg-gray-400"></span>
            <button><i className="text-red-600 font-medium">Remove</i></button>
          </div>
        </div>
      </td>
      {/* CAB#  */}
      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
        <div className="text-[12px]">
          <div className="flex flex-col pb-3 pt-3 w-full max-w-md mx-auto">
            <div className="text-gray-500 rounded-md w-fit font-medium">
              [{item?.booking_type}][<span className='text-blue-500'>NA</span>]
            </div>

            <div className="flex items-center gap-1 text-gray-700 dark:text-gray-200">
              <FaCarSide className="text-blue-600" />
              <span className="break-all text-gray-500">{item?.cab_reg}</span>
            </div>

            <div className="text-gray-500 dark:text-gray-300">
              Driver:-- <span className="font-medium ">{item?.drv_name}</span>
            </div>

            <div className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <span>Need Carrier:</span>
              <div className="bg-green-600 text-white px-2 rounded-md w-fit font-normal">No</div>
              <span className="h-4 w-[2px] bg-gray-400"></span>
              <button>
                <span className="text-black">Copy Data</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
              <div className="text-gray-500 py-[3px] rounded-md w-fit font-medium">
                [Passengers: {item?.totalPerson} Luggage: {item?.totalLuggageCount}]
              </div>
            </div>
          </div>
        </div>
      </td>
      {/* STATUS  */}
      <td className="px-4 py-3">
        <div className="flex flex-col pb-3 pt-3 text-sm w-full max-w-md mx-auto">
          <button className={`${statusColors[item?.status]} px-2 rounded-md w-fit text-[12px]`}>{item?.status}</button>

          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
            <FaCarSide className="text-blue-600 text-[12px]" />
            <span className="break-all text-gray-500 text-[12px] font-semibold">{item?.booking_travel_date}</span>
          </div>

          <div className="text-gray-500 dark:text-gray-300 text-[12px] font-semibold">{item?.estimated_km}Km ₹{item?.estimated_price}/-</div>

          <div className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
            <span className="text-black text-[12px]">₹{item?.advance_amt}/- </span>
            <span className='text-[12px]'>{item?.amount_to_be_paid}</span>
          </div>

          <div className="flex items-center text-gray-700 dark:text-gray-200 text-[12px]">
            <button className='bg-[#FF9F05] text-black px-2 rounded-md w-fit font-normal'>Create Offer</button>
          </div>
        </div>
      </td>
      {/* LOCATIONS  */}
      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
        <div className="flex flex-col pb-3 pt-3 text-sm w-full max-w-md">
          <div className="text-gray-500 text-[14px] flex items-center gap-2">
            <FaCalendarAlt />
            <span className='text-[12px] text-black'>{item?.booking_travel_date}</span>
          </div>

          {/* <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
            <FaLocationDot className="text-green-600" />
            <span className="break-all text-gray-500">{item?.booking_source}</span>
          </div> */}
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
            {/* <FaLocationDot  className="text-green-600" /> */}
            <span className='text-[12px]'>Src City:</span>
            <span className="break-all text-gray-500 font-semibold">{item?.source_city_name}</span>
          </div>

          {/* <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
            <FaLocationDot className="text-red-600" />
            <span className="break-all text-gray-500">{item?.booking_destination}</span>
          </div> */}

          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
            {/* <FaLocationDot  className="text-green-600" /> */}
            <span className='text-[12px]'>Dst City:</span>
            <span className="break-all text-gray-500 font-semibold">{item?.destination_city_name}</span>
          </div>
        </div>
      </td>
      {/* ACTIONS  */}
      <td className="px-4 py-3">
        <div className="flex flex-col gap-1 items-start">
          <div className='flex items-center gap-2'>
            <button className='border-r border-gray-400' onClick={() => handleEditClick(item, 'confirm_ride')}>
              <FiFastForward className='mr-2 text-green-600 text-xl' />
            </button>
            <button className='border-r border-gray-400' onClick={() => handleEditClick(item, 'add_remarks')}>
              <BsExclamationCircle className='mr-2 text-green-600 text-xl' />
            </button>
            <button className='border-r border-gray-400' onClick={() => handleEditClick(item, 'cancel_request')}>
              <RxCrossCircled className='mr-2 text-red-600 text-xl' />
            </button>
            <button className='border-r border-gray-400'>
              <TiLocationOutline className='mr-2 text-green-600 text-2xl' />
            </button>
            <button onClick={() => handleEditClick(item, 'whatsapp_chat')}>
              <FaWhatsapp className='mr-2 text-green-600 text-xl' />
            </button>
          </div>
          {/* <button
            className="bg-green-600 text-white dark:text-blue-400 hover:underline rounded-md px-2 flex items-center gap-1 text-sm font-medium"
            onClick={() => {

            }}
          >
            Remarks
          </button> */}
        </div>
      </td>
    </tr>
  ));

  // Skeleton Loader Component
  const SkeletonRow = () => (
    <tr className="animate-pulse bg-white dark:bg-gray-800">
      {[...Array(6)].map((_, idx) => (
        <td key={idx} className="px-4 py-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-3 bg-gray-100 dark:bg-gray-600 rounded w-2/3"></div>
        </td>
      ))}
    </tr>
  );

  const SkeletonCard = () => (
    <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-2 sm:px-4 lg:px-6 mb-6">
      {Array.from({ length: 5 }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border dark:border-gray-700 p-4 space-y-4"
        >
          {/* Header Section */}
          <div className="flex justify-between items-start gap-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-700"></div>
              <div className="space-y-2">
                <div className="w-24 h-3 bg-gray-200 dark:bg-gray-600 rounded"></div>
                <div className="w-32 h-2 bg-gray-100 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
            <div className="w-20 h-4 bg-gray-200 dark:bg-gray-600 rounded"></div>
          </div>

          {/* Location Info */}
          <div className="space-y-2">
            <div className="w-5/6 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="w-4/6 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>

          {/* Car & Phone */}
          <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <div className="w-24 h-3 bg-gray-100 dark:bg-gray-700 rounded"></div>
            <div className="w-32 h-3 bg-gray-100 dark:bg-gray-700 rounded"></div>
          </div>

          {/* Date & Time */}
          <div className="space-y-2">
            <div className="w-28 h-3 bg-gray-200 dark:bg-gray-600 rounded"></div>
            <div className="w-32 h-3 bg-gray-200 dark:bg-gray-600 rounded"></div>
          </div>

          {/* KM & Person/Luggage */}
          <div className="flex justify-between gap-4">
            <div className="w-20 h-3 bg-gray-100 dark:bg-gray-700 rounded"></div>
            <div className="space-y-2">
              <div className="w-16 h-2.5 bg-gray-100 dark:bg-gray-700 rounded"></div>
              <div className="w-16 h-2.5 bg-gray-100 dark:bg-gray-700 rounded"></div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-[1px] bg-gray-200 dark:bg-gray-700 rounded"></div>

          {/* Fare Info */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <div className="w-28 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="w-16 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
            <div className="flex justify-between">
              <div className="w-28 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="w-16 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
            <div className="flex justify-between">
              <div className="w-28 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="w-16 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-3">
            <div className="w-1/2 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div className="w-1/2 h-8 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // useEffect(() => {
  //   if (!hasMore && page > 1) return; // stop if no more data
  //   setLoading(true);
  //   if (page === 1) {
  //     setAllRides([]); // clear rides on new tab
  //   }
  //   fetchRides(page).finally(() => setLoading(false));
  // }, [page, statusTab]);

  // useEffect(() => {
  //   setPage(1);
  //   setHasMore(true);
  // }, [statusTab]);

  // useEffect(() => {
  //   setLoading(true);
  //   const timer = setTimeout(() => setLoading(false), 500);
  //   return () => clearTimeout(timer);
  // }, [viewType]);

  // ✅ Effect depends on fetchRides, page, hasMore
  useEffect(() => {
    if (!hasMore && page > 1) return; // stop if no more data
    setLoading(true);
    if (page === 1) {
      setAllRides([]); // clear rides on new tab
    }
    fetchRides(page).finally(() => setLoading(false));
  }, [page, hasMore, fetchRides]);

  // ✅ reset pagination on tab change
  useEffect(() => {
    setPage(1);
    setHasMore(true);
  }, [statusTab]);


  return (
    <>
      {/* <SearchPanel /> */}
      <div className='rounded-md mx-4 sticky top-14 z-40 '>
        <StatusTabs statusTab={statusTab} setStatusTab={setStatusTab} tabs={tabs} />
      </div>
      {
        viewType === 'Table' ? (
          <BasicTable
            title="RB Booking"
            subtitle={[
              {
                label: 'Mini',
                value: '8',
              },
              {
                label: 'Sedan',
                value: '155'
              },
              {
                label: 'SUV',
                value: '57'
              }
            ]}
            actions={[
              {
                isCustom: true,
                element: (
                  <select
                    className="py-2 px-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-sm text-sm text-gray-700 dark:text-white"
                    value={viewType}
                    onChange={(e) => setViewType(e.target.value)}
                  >
                    <option value="Table">Table</option>
                    <option value="Card">Card</option>
                  </select>
                )
              },
            ]}
            thead={thead}
            tbody={
              loading && allRides.length === 0
                ? [...Array(6)].map((_, i) => <SkeletonRow key={i} />)
                : tbody
            }
            getDetail={goToDetail}
          />
        ) : (
          <div>
            {loading && allRides.length === 0
              ? [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
              : (
                <AllRideCard
                  actions={[
                    {
                      isCustom: true,
                      element: (
                        <select
                          className="py-1.5 px-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-[12px] text-gray-700 dark:text-white"
                          value={viewType}
                          onChange={(e) => setViewType(e.target.value)}
                        >
                          <option value="Table">Table</option>
                          <option value="Card">Card</option>
                        </select>
                      )
                    },
                  ]}
                  rides={allRides}
                  moreData={hasMore}
                  checklastCardRef={lastCardRef}
                  getDetail={goToDetail}
                />
              )
            }
          </div>
        )
      }

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

              {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">No. of Passengers</label>
                  <select
                    name="passengers"
                    value={selectedCab.passengers || ''}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 bg-white px-4 py-2"
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">No. of Luggage</label>
                  <select
                    name="luggage"
                    value={selectedCab.luggage || ''}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 bg-white px-4 py-2"
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ride Whatsapp Number</label>
                  <div className="flex gap-2">
                    <span className="inline-flex items-center px-3 bg-gray-100 border border-gray-300 text-gray-700 text-sm rounded-md">+91</span>
                    <input
                      name="whatsapp"
                      type="tel"
                      value={selectedCab.whatsapp || ''}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                      placeholder="Whatsapp Number"
                    />
                  </div>
                </div>
              </div> */}

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
    </>
  );
};

export default PendingRidesPage;