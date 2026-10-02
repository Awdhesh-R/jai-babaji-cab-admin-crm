  'use client';
  import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
  import Image from 'next/image';
  import { debounce } from "lodash";
  import { apiClient } from '@/app/lib/apiClient';
  import { X } from 'lucide-react';
  import UpdateDetailsModal from "../modals/UpdateDetailsModal";
  import { FiCheckCircle, FiSend } from 'react-icons/fi';
  import { FaUserFriends, FaSuitcaseRolling, FaCalendarAlt, FaClock, FaBolt, FaMapMarkerAlt, FaBell, FaCaretDown, FaCar } from 'react-icons/fa';
  import { BsExclamationTriangle, BsLink } from "react-icons/bs";
  import { CiUser, CiLocationOn } from "react-icons/ci";
  import { LuMessageSquare, LuMessageCircle } from "react-icons/lu";
  import { RiCheckDoubleFill } from "react-icons/ri";
  // import RideSection from './RideSection';
  import RideSection from './realtimeRidesection';
  import Failed from "../modals/Failed";
  import Success from "../modals/Success";
  import RideConnectionModal from '../modals/RideConnectionModal';
  import { useRouter } from 'next/navigation';
  import { toast } from 'react-toastify';
  import { ACTIVE_RIDE_STATUSES } from '@/helpers/constant';
  import moment from 'moment';



  const PARENT_HIDE_LIST = [
    "booking source coordinates",
    "booking destination coordinates",
    "cab type id",
    "near ct id",
    "price details json",
  ];

  const CHILD_HIDE_LIST = [
    "booking source coordinates - coordinates",
    "booking destination coordinates - coordinates",

    "location details - source",
    "location details - destination",

    "passenger details json - adults",
    "passenger details json - children",
    "passenger details json - luggage small",
    "passenger details json - luggage big",

    "price details json - advance amount",
    "price details json - estimated fare",
    "price details json - collected by driver",
  ];

  function normalize(val) {
    if (val === "" || val === "0" || val === 0 || val === null || val === undefined)
      return null;

    if (Array.isArray(val)) return val.join(", ");

    if (typeof val === "object") {
      if (val.source && val.destination) {
        return `Source: ${val.source} | Destination: ${val.destination}`;
      }
      if (val.coordinates) {
        return `(${val.coordinates[0]}, ${val.coordinates[1]})`;
      }
      return Object.entries(val)
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ");
    }

    return val;
  }

  function isSame(oldVal, newVal) {
    const clean = (obj) => {
      if (obj === null || obj === undefined || obj === "" || obj === "0" || obj === 0)
        return null;

      if (typeof obj === "object") {
        const sorted = Object.keys(obj)
          .sort()
          .reduce((acc, key) => {
            const v = obj[key];
            if (v !== 0 && v !== "0" && v !== null && v !== "") acc[key] = v;
            return acc;
          }, {});
        return JSON.stringify(sorted);
      }

      return obj;
    };

    return clean(oldVal) === clean(newVal);
  }

  // function extractPlainText(remark) {
  //   const jsonStart = remark.indexOf("{");
  //   let text = remark.slice(0, jsonStart).trim();

  //   text = text.replace(/pending:/i, "").trim();
  //   text = text.replace(/confirmed:/i, "").trim();
  //   text = text.replace(/with field/i, "").trim();

  //   return text;
  // }

  function extractPlainText(remark) {
    if (!remark || typeof remark !== "string") return ""; // 🔥 Safe guard

    const jsonStart = remark.indexOf("{");
    let text = remark.slice(0, jsonStart).trim();

    text = text.replace(/pending:/i, "").trim();
    text = text.replace(/confirmed:/i, "").trim();
    text = text.replace(/with field/i, "").trim();

    return text;
  }


  function parseOldNewFields(remark) {
    try {
      const start = remark.indexOf("{");
      if (start === -1) return [];

      const raw = JSON.parse(remark.slice(start));
      const rows = [];

      const cleanKey = (k) =>
        k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

      const pushRow = (label, oldVal, newVal) => {
        const lower = label.toLowerCase().trim();

        if (PARENT_HIDE_LIST.includes(lower)) return;

        if (CHILD_HIDE_LIST.some((h) => lower.startsWith(h))) return;

        if (!oldVal || oldVal === "" || oldVal === "0") oldVal = null;
        if (!newVal || newVal === "" || newVal === "0") newVal = null;

        if (isSame(oldVal, newVal)) return;

        const oldV = normalize(oldVal);
        const newV = normalize(newVal);
        if (!oldV && !newV) return;

        rows.push({ label, old: oldV, new: newV });
      };

      Object.entries(raw).forEach(([key, value]) => {
        const mainLabel = cleanKey(key);

        if (value && typeof value === "object" && ("old" in value || "new" in value)) {
          const oldObj = value.old || {};
          const newObj = value.new || {};

          pushRow(mainLabel, value.old, value.new);

          if (typeof newObj === "object") {
            Object.entries(newObj).forEach(([innerKey, newVal]) => {
              const oldVal = oldObj ? oldObj[innerKey] : null;
              pushRow(`${mainLabel} - ${cleanKey(innerKey)}`, oldVal, newVal);
            });
          }
        }
      });

      return rows;
    } catch {
      return [];
    }
  }


  const statusColors = {
      pending: 'bg-[#FFC107]  text-white',
      processing:'bg-[#FFC107] text-white',
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

  const statusTextColors = {
      pending: 'text-[#FFC107]',
      probabal:'text-[#FFC107]',
      processing:'text-[#FFC107]',
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

  const formatBookingTime = (timeStr) => {
      if (!timeStr) return '';

      // Handle "hh:mm AM/PM" format
      const amPmMatch = timeStr.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
      if (amPmMatch) {
          let [_, hour, minute, period] = amPmMatch;
          hour = parseInt(hour, 10);
          if (period.toUpperCase() === 'PM' && hour !== 12) hour += 12;
          if (period.toUpperCase() === 'AM' && hour === 12) hour = 0;
          return `${String(hour).padStart(2, '0')}:${minute}`;
      }

      // Fallback for "HH:MM:SS" or "HH:MM"
      if (timeStr.length >= 5 && timeStr[2] === ':') {
          return timeStr.slice(0, 5);
      }

      return '';
  };

  const formatDateToInput = (dateStr) => {
      if (!dateStr) return '';
      const [day, month, year] = dateStr.split('-');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  const UserPrimaryData = ({ rideData, activityData, generalTemplates, cancelTemplates, checkUpdate, setCheckUpdate, showStatus, setShowStatus }) => {

  const [isChecked, setIsChecked] = useState(false);

      const getInitialIndex = () => {
          const bookingType = rideData?.booking_type?.toLowerCase();
          if (bookingType.toLowerCase() === "mini") return 0;
          if (bookingType.toLowerCase() === "sedan") return 1;
          if (bookingType.toLowerCase() === "suv") return 2;
          return 0;
      };

      const [userDetails, setUserDetails] = useState({
          pickupLocation: rideData?.location_details?.source || '',
          dropLocation: rideData?.location_details?.destination || '',
          date: formatDateToInput(rideData?.booking_travel_date) || '',
          bookingTime: formatBookingTime(rideData?.bookingTime) || '',

          estKm: rideData?.price_details_json?.estimated_km || '',
          reqTime: rideData?.price_details_json?.estimated_time || rideData?.distance_time_google_data?.durationText || '',
          estimatedFare: rideData?.price_details_json?.estimated_fare || 0,
          totalCharge: rideData?.price_details_json?.actual_travel_price || 0,
          tollCharge: rideData?.price_details_json?.toll_charge || 0,//rest
          parkingCharge: rideData?.price_details_json?.parking_charge || 0,//rest
          waitingCharge: rideData?.price_details_json?.waitingCharge || 0, 
          other_charge: rideData?.price_details_json?.other_charge || 0,
          discount: parseFloat(rideData?.price_details_json?.discount || 0),
          advanceAmount: rideData?.price_details_json?.advance_amount || 0,
          remainingAmount: '',
          collected_by_driver: (rideData?.price_details_json?.collected_by_driver || 0),
          walletAmount: rideData?.wallet_amount || '',
          adult: rideData?.booking_details_json?.adults || rideData?.passenger_details_json?.adults || '',
          children: rideData?.booking_details_json?.children || rideData?.passenger_details_json?.children || '',
          bigLuggage: rideData?.booking_details_json?.luggage_big || rideData?.passenger_details_json?.luggage_big || '',
          smallLuggage: rideData?.booking_details_json?.luggage_small || rideData?.passenger_details_json?.luggage_small || '',
          bookingType: rideData?.booking_type || '',
          cabTypeId: rideData?.cab_details_json?.cab_type_id || rideData?.basePriceId || '',
          changeRoute: rideData?.via_name || '',
          mapLink: rideData?.route_map || '',
          cabIcon: '',
          couponCode: rideData?.payment_details_json?.coupon_apply_details?.coupon_details?.code || '',
      });

      
      const [suggestions, setSuggestions] = useState([]);
      const [loading, setLoading] = useState(false);
      const [toLoad, setToLoad] = useState(false);
      const [cabDatas, setCabDatas] = useState([]);
      const [selectedField, setSelectedField] = useState("");
      const [updatedFare, setUpdatedFare] = useState([]);
      const [latLong, setLatLong] = useState();
      const [cabFoundModal, setCabFoundModal] = useState(false);
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [selectedCabs, setSelectedCabs] = useState({});
      const [payStatus, setPayStatus] = useState('processing');
      const [selected, setSelected] = useState(getInitialIndex());
      const [selectedCab, setSelectedCab] = useState([]);
      const [modalAction, setModalAction] = useState(null);
      const [showModal, setShowModal] = useState(false);
      const [selectedTopic, setSelectedTopic] = useState('Please mention no. of Passengers & Luggage?');
      const [isErrorOpen, setIsErrorOpen] = useState(false);
      const [isSuccessOpen, setIsSuccessOpen] = useState(false);
      const [message, setMessage] = useState([]);
      const [remarkResponse, setRemarkResponse] = useState([]);
      const [selectedRemarksTemplate, setSelectedRemarksTemplate] = useState("");
      const [cancelTemplate, setCancelTemplate] = useState("");
      const [showDropdown, setShowDropdown] = useState(false);
      const [showDropdown1, setShowDropdown1] = useState(false);
      const [isOpen, setIsOpen] = useState(false);
      const [cabFoundDate, setCabFoundDate] = useState(formatDateToInput(rideData?.booking_travel_date) || '');
      const [cabFoundTime, setCabFoundTime] = useState(formatBookingTime(rideData?.bookingTime) || '')
      const dropdownRef = useRef();
      const cancelRef = useRef();
      const router = useRouter()
      useEffect(() => {
          if (Array.isArray(rideData?.estimatedFareList)) {
              setCabDatas(rideData);
          } else {
              setCabDatas([]);
          }
      }, [rideData]);

      // SEARCH PLACE API 
      // const searchPlace = useCallback(
      //     debounce(async (input, kInput) => {
      //         if (!input.trim()) return;
      //         kInput === "from" ? setLoading(true) : setToLoad(true);
      //         setSuggestions([]);
      //         const place = { placeName: input.trim() };
      //         try {
      //             const response = await fetch('https://api.jaibabajicab.com/api/v1/place/search-place', {
      //                 method: 'POST',
      //                 headers: { 'Content-Type': 'application/json' },
      //                 body: JSON.stringify(place),
      //             });
      //             const data = await response.json();
      //             if (!data?.success) throw new Error(data?.message || "Failed to fetch");
      //             setSuggestions(data?.data || []);
      //         } catch (err) {
      //             console.error("Error fetching autocomplete suggestions:", err.message);
      //         } finally {
      //             kInput === "from" ? setLoading(false) : setToLoad(false);
      //         }
      //     }, 200),
      //     []
      // );

      const debouncedSearch = useMemo(() => debounce(async (input, kInput) => {
          if (!input.trim()) return;
          kInput === "from" ? setLoading(true) : setToLoad(true);
          setSuggestions([]);
          const place = {
              placeName: input.trim(),
              api_key: process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
          };
          try {
              const data = await apiClient('POST','/place/search-place', place, null, false, false);
              if (!data?.success) throw new Error(data?.message || "Failed to fetch");
              
              // Normalize backend response to match UI expectations (description, geometry.location)
              let rawData = data?.data || [];
              let suggestionsArray = Array.isArray(rawData) ? rawData : [rawData];
              const mappedSuggestions = suggestionsArray.map(item => ({
                  description: item?.place || item?.name,
                  geometry: { location: { lat: item?.lat, lng: item?.long || item?.lng } }
              })).filter(item => item.description);
              
              setSuggestions(mappedSuggestions);
          } catch (err) {
              console.error("Error fetching autocomplete suggestions:", err.message);
          } finally {
              kInput === "from" ? setLoading(false) : setToLoad(false);
          }
      }, 500), []);

      const searchPlace = useCallback(
          (input, kInput) => debouncedSearch(input, kInput),
          [debouncedSearch]
      );
      const formatTime = (timeinMin) => {
          console.log(timeinMin)
          if(isNaN(timeinMin)) return timeinMin;
          if (!Number.isFinite(timeinMin) || timeinMin < 0) return "00:00:00";
          const totalSeconds = Math.floor(timeinMin * 60);
          const hours = Math.floor(totalSeconds / 3600);
          const mins = Math.floor((totalSeconds % 3600) / 60);
          const secs = totalSeconds % 60;

          const pad = (n) => String(n).padStart(2, "0");
          return `${pad(hours)}:${pad(mins)}:${pad(secs)}`;

      }

      // UPDATE FARE API 
      const updateFareDetail = useCallback(async () => {
          const src = rideData?.booking_source_coordinates?.coordinates?.sort();
          const dest = rideData?.booking_destination_coordinates?.coordinates?.sort();
          const payData = {
              lat1: latLong?.lat1 || src[0] || '',
              lon1: latLong?.long1 || src[1] || '',
              lat2: latLong?.lat2 || dest[0] || '',
              lon2: latLong?.long2 || dest[1] || '',
          };
          // console.log("hhh", payData);
          try {
              const response = await apiClient('POST', '/ride_management/getUpdatedEstimatedFare', JSON.stringify(payData), true);
              if (response?.success) {
                  console.log("reponse data ", response?.data);
                  setUpdatedFare(response?.data || []);
                  
              const currentCab = response.data?.estimatedFareList?.find(cab=> cab.id === (rideData?.op_cab_details_json? rideData?.op_cab_details_json?.cab_type_id: userDetails?.cabTypeId));
              setUserDetails(prev=> ({...prev,
                  rideServiceType: response?.data?.serviceType,
                  bothInCluster: response?.data?.bothInCluster,
                  destinationInCluster: response?.data?.destinationInCluster,
                  sourceInCluster: response?.data?.sourceInCluster,
                  is_cluster: response?.data?.is_cluster || false,
                  is_local: response?.data?.is_local || false,
                  rideStateName: response?.sourceState?.state,
                  estKm: response?.data?.distanceInKm,
                  collected_by_driver: parseFloat(currentCab?.estimated_fare || 0) - parseFloat(((rideData?.status === 'pending' || rideData?.status === "processing")? currentCab?.advanceToBe: rideData?.price_details_json?.advance_amount) || 0) - parseFloat(userDetails?.discount || 0),
                  estimatedFare: currentCab?.estimated_fare, advanceAmount: currentCab?.advanceToBe, reqTime: formatTime(response?.data?.durationInMin)}))
              }
          } catch (error) {
              console.error("Update Fare Detail error:", error);
          }
      }, [latLong]); // dependencies

      useEffect(() => {
          if(latLong?.lat1 || latLong?.lat2) {
              updateFareDetail();
          }
      }, [latLong, updateFareDetail]);

      // UPDATE DETAILS API
      const updateRideDetails = async (payload = null) => {
          console.log('rideData', updatedFare);

          const payData = {
              user_id: rideData?.user_id,
              cab_type_id: userDetails?.cabTypeId,
              near_ct_id: updatedFare?.sourceCity,
              near_ctd_id: updatedFare?.destCity,
              booking_type: userDetails?.bookingType.toLowerCase(),
              ride_type_id: rideData?.ride_type_id,
              city_sid: rideData?.city_sid,
              city_did: rideData?.city_did,
              status: rideData?.status,
              location_details: {
                  source: userDetails?.pickupLocation,
                  destination: userDetails?.dropLocation,
              },
              via_name: userDetails?.changeRoute,
              route_map: userDetails?.mapLink,
              booking_source_coordinates: { type: 'Point', coordinates: [latLong?.long1 || rideData?.booking_source_coordinates?.coordinates[0], latLong?.lat1 || rideData?.booking_source_coordinates?.coordinates[1]] },
              booking_destination_coordinates: { type: 'Point', coordinates: [latLong?.long2 || rideData?.booking_destination_coordinates?.coordinates[0], latLong?.lat2 || rideData?.booking_destination_coordinates?.coordinates[1]] },

              distance_time_google_data: updatedFare?.distanceTimeGoogleData || rideData?.distance_time_google_data,
              passenger_details_json: {
                  adults: Number(userDetails.adult),
                  children: Number(userDetails.children),
                  luggage_small: Number(userDetails.smallLuggage),
                  luggage_big: Number(userDetails.bigLuggage),
              },
              booking_details_json: {
                  adults: Number(userDetails.adult),
                  children: Number(userDetails.children),
                  luggage_small: Number(userDetails.smallLuggage),
                  luggage_big: Number(userDetails.bigLuggage),
              },
              booking_travel_date: `${userDetails.date} ${userDetails.bookingTime}`,
              cab_details_json: rideData?.cab_details_json,
              user_details_json: rideData?.user_details_json,
              cluster_details: {
                  ...rideData?.cluster_details,
                  rideServiceType: userDetails?.rideServiceType ?? rideData?.cluster_details?.rideServiceType,
                  bothInCluster: userDetails?.bothInCluster ?? rideData?.cluster_details?.bothInCluster,
                  isDestinationCityCluster: userDetails?.destinationInCluster ?? rideData?.cluster_details?.isDestinationCityCluster,
                  isSourceCityCluster: userDetails?.sourceInCluster ?? rideData?.cluster_details?.isSourceCityCluster,
                  is_cluster: userDetails?.is_cluster ?? rideData?.cluster_details?.is_cluster,
                  is_local: userDetails?.is_local ?? rideData?.cluster_details?.is_local,
                  rideStateName: userDetails?.sourceInCluster ?? rideData?.cluster_details?.rideStateName,
              },
              price_details_json: {
                  ...rideData?.price_details_json,
                  final_fare: userDetails?.estimatedFare,
                  collected_by_driver: parseFloat(userDetails?.estimatedFare || 0) - parseFloat(((rideData?.status === 'pending' || rideData?.status === "processing")? userDetails?.advanceAmount: rideData?.price_details_json?.advance_amount) || 0) - parseFloat(userDetails?.discount || 0), 
                  estimated_km: userDetails?.estKm,
                  advance_amount: (rideData?.status === 'pending' || rideData?.status === "processing")? userDetails?.advanceAmount: rideData?.price_details_json?.advance_amount,
                  estimated_fare: userDetails?.estimatedFare,
                  estimated_time: userDetails?.reqTime,
                  toll_charge: (userDetails?.tollCharge && !isNaN(userDetails?.tollCharge))? parseFloat(userDetails?.tollCharge): 0,//rest
                  parking_charge: userDetails?.parkingCharge  && !isNaN(userDetails?.parkingCharge)? parseFloat(userDetails?.parkingCharge): 0,//rest
                  waitingCharge: userDetails?.waitingCharge  && !isNaN(userDetails?.waitingCharge)? parseFloat(userDetails?.waitingCharge): 0, 
                  other_charge: userDetails?.other_charge  && !isNaN(userDetails?.waitingCharge)? parseFloat(userDetails?.waitingCharge): 0,
                  discount: userDetails?.discount  && !isNaN(userDetails?.discount)? parseFloat(userDetails?.discount): 0,
              }
          };
          const pattern = /^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
          if( payload? 
                  (payload?.price_details_json? 
                      (!payload?.price_details_json?.estimated_time 
                      || !pattern?.test(payload?.price_details_json?.estimated_time))
                  :false)
              : (!pattern?.test(payData?.price_details_json?.estimated_time))) {
              toast.error("Estimated Time Missing Or Incorrect Format!");
              return;
          }
          console.log('checking paydata', payData);
          try {
              const response = await apiClient('PUT', `/ride_management/updateRideDetails/${rideData?.urid}`, payload? JSON.stringify(payload): JSON.stringify( payData), true);
              if (response.success) {
                  setIsOpen(false);
                  setMessage(response);
                  console.log('messssss', response);
                  setIsSuccessOpen(true);
                  setCheckUpdate((prev) => !prev);
              }
              if (!response.success) {
                  console.log("response", response)
                  setMessage(response);
                  setIsErrorOpen(true);
              }
          } catch (err) {
              console.error('Update failed:', err);
          }
      };

      // CAB FOUND API 
      const cabFoundByAdmin = async () => {
          let payData = {
              urid: rideData?.urid,
              op_cab_details_json: {
                  ...selectedCab,
                  cab_type_id: selectedCab?.cab_type_id || selectedCab?.id,
                  cab_type: selectedCab?.cab_type,
                  estimated_fare: selectedCab?.estimatedFare,
                  distanceInKm: userDetails?.estKm,
                  durationInMin: userDetails?.reqTime,
                  advanceToBe: selectedCab?.advanceToBe,
                  remainingAmout: selectedCab?.remainingAmout,
                  cab_icon: selectedCab?.cab_icon,
                  distanceTimeGoogleData: updatedFare?.distanceTimeGoogleData || rideData?.distance_time_google_data,
                  booking_travel_date_unformated: `${cabFoundDate ? cabFoundDate :(userDetails?.date)} ${cabFoundTime ? cabFoundTime : userDetails?.bookingTime}`,
                  booking_travel_date: `${cabFoundDate ? formatDateToInput(cabFoundDate) : formatDateToInput(userDetails?.date)} ${cabFoundTime ? cabFoundTime : userDetails?.bookingTime}`
              }
          };

          try {
              const response = await apiClient("POST", '/ride_management/findCab', JSON.stringify(payData), true);
              if (response.success) {
                  console.log("success", response);
                  setMessage(response?.data);
                  setCheckUpdate((prev) => !prev);
                  setIsSuccessOpen(true);
                  setCabFoundModal(false);
              } else {
                  setMessage(response);
                  setIsErrorOpen(true);
              }
          } catch (error) {
              console.log(error);
          }
      }

      //CONFIRM RIDE 
      const confirmRide = async () => {
          if(rideData?.op_cab_status) {
              if(!rideData?.agree_cab_details_json) {
                  toast.error("Ride not Agreed by User");
                  return;
              }
              const payload = {
                  basePriceId: rideData?.agree_cab_details_json?.cab_type_id,
                  booking_type: rideData?.agree_cab_details_json?.cab_type?.toLowerCase(),
              };
              console.log(payload);
              await updateRideDetails(payload);
          }
          const userType = JSON.parse(localStorage.getItem('user'));
          // console.log("Confirm Ride Submittted", selectedCabs);
          let payData = {
              urid: rideData?.urid,
              remark: payStatus,
              remarkDiscription: selectedCabs?.remarks || '',
              user_id: String(userType?.id || ''),
              user_type: userType?.name || '',
              amount: String(selectedCabs?.advance || 0),
              carrier_required: selectedCabs?.carrier || 'no',
          }

          try {
              const response = await apiClient('POST', '/ride_management/updateRideStatusWithConfirm', JSON.stringify(payData), 'true');
              if (response.success) {
                  toast.success(response.message);
                  setShowStatus(response?.data?.data?.status);
                  console.log("ride confirm", response);
              } else {
                  toast.error(response.message);
              }
          } catch (error) {
              console.log(error);
          }
      }

      //PROCEED TO PAYMENT API (PAYMENT/ADD-PAYMENT) 
      const proceedToPayment = async () => {
        if(rideData?.op_cab_details_json && (moment(`${rideData?.booking_travel_date} ${rideData?.bookingTime}`, "DD-MM-YYYY hh:mm A").isAfter(moment(rideData?.op_cab_details_json.booking_travel_date, "DD-MM-YYYY HH:mm")) || moment(`${rideData?.booking_travel_date} ${rideData?.bookingTime}`, "DD-MM-YYYY hh:mm A").isBefore(moment(rideData?.op_cab_details_json.booking_travel_date, "DD-MM-YYYY HH:mm")))) {
          toast.error("Cab found date should be same as Booking Travel Date to Proceed to payment");
          return;
        }
          let payData = {
              user_id: rideData?.user_id,
              amount: selectedCabs?.advance,
              booking_id: rideData?.urid,
              mobile_no: rideData?.user_details_json?.c_wa_number || rideData?.user_details_json?.book_contact,
              remark: selectedCabs?.remarks,
              booking_type: rideData?.booking_type
          }
          // console.log("Payment", payData);
          // console.log('token', token);

          try {
              const response = await apiClient("POST",'/ride_management/proceed-to-payment',payData);
              if (response?.status) {
                  setCheckUpdate((prev) => !prev);
                  toast.success(response.message);
              } else {
                  toast.error(response.message);
              }
          } catch (error) {
              console.log(error);
          }
      }

      //ADD REMARKS
      const addRemarks = async (tempId, rstatus) => {
          let payData = {
              urid: rideData?.urid,
              status: rstatus,
              remark: selectedCabs?.notes,
              template_id: String(tempId),

              WA_Template: isChecked  

          };
          try {
              const response = await apiClient('POST', '/ride_management/addRemark', payData, true);
              if (response?.status || response?.success) {
                  // console.log("Ride Cancelled by MP", response);
                  toast.success(response.message);
                  setRemarkResponse(response?.data);
                  setShowStatus(response?.data?.activity_status);
              } else {
                  toast.error(response.message)
              }
          } catch (error) {
              console.log(error);
          }
      }

      // CALLING APIs ADD_REMARK, CONFRIM_RIDE, CANCEL_REQUEST AND PROCEED TO PAYMENT
      const handleModalSubmit = async () => {
          try {
              if (modalAction === 'confirm_ride') {
                  payStatus === 'processing' ? proceedToPayment() : confirmRide();
              } else if (modalAction === 'add_remarks') {
                  addRemarks(selectedRemarksTemplate, showStatus ? showStatus : rideData?.status);
              } else if (modalAction === 'cancel_request') {
                  addRemarks(cancelTemplate, 'cancelled');
              } else if (modalAction === 'whatsapp_chat') {

              }
              setIsModalOpen(false);
          } catch (err) {
              console.error("Modal submit failed", err);
          }
      };

      // STORE DATA IN SELCECTED CABS STATE
      const handleChange = (e) => {
          const { name, value } = e.target;
          setSelectedCabs((prev) => ({
              ...prev,
              [name]: value,
          }));
      };

      // MANUALLY UPDATING THE VALUES OF STATES
      const handleEditClick = (btn) => {
          const normalizedLabel = btn.label.toLowerCase().replace(/\s+/g, '_');
          const actionMap = {
              confirm: 'confirm_ride',
              remarks: 'add_remarks',
              map: 'map',
              whatsapp: 'whatsapp_chat',
              cancel_ride: 'cancel_request',
              connect_ride: 'connect_ride',
              searchRideConnection: 'searchRideConnection',
          };

          const action = actionMap[normalizedLabel];

          if (btn.label === 'Search Connection' || btn.label.toLowerCase().includes('search connection')) {
              console.log("Direct match for Search Connection button");
              window.open(`/ridesManagement/searchRideConnection/${rideData.urid}`, "_blank");
              return;
          }

          if (action) {
              setModalAction(action);
              setSelectedCabs({});
              setSelectedRemarksTemplate('');
              setShowDropdown(false);

              switch (action) {
                  case 'confirm_ride':
                      setSelectedCabs((prev) => ({
                          ...prev,
                          price: userDetails?.estimatedFare || rideData?.price_details_json?.estimated_price || '',
                          distance: selectedCabs?.distance || rideData?.price_details_json?.estimated_km || '',
                          cab_number: '',
                          cabType: selectedCabs?.cabType || rideData?.booking_type || '',
                          carrier: '',
                          date: selectedCabs?.date || formatDateToInput(rideData?.booking_travel_date) || '',
                          time: selectedCabs?.time || formatBookingTime(rideData?.bookingTime) || '',
                          advance: userDetails?.advanceAmount || '',
                          payment_status: '',
                          remarks: '',
                      }));
                      setIsModalOpen(true);
                      break;

                  case 'cancel_request':
                      setSelectedCabs({
                          rejection_reason: '',
                          notes: '',
                      });
                      setIsModalOpen(true);
                      break;

                  case 'add_remarks':
                      setSelectedCabs({
                          connected_ride: rideData?.connected_ride || '',
                          notes: rideData?.notes || '',
                          passengers: rideData?.booking_details_json?.adults || '',
                          luggage: rideData?.booking_details_json?.luggage_big || '',
                          whatsapp: rideData?.c_wa_number || '',
                          call_date: formatDateToInput(rideData?.next_followup_date) || '',
                          call_time: formatBookingTime(rideData?.next_followup_time) || '',
                      });
                      setIsModalOpen(true);
                      break;

                  case 'whatsapp_chat':
                      setSelectedCabs({
                          whatsapp: rideData?.c_wa_number || '',
                          payment_link: '',
                      });
                      setIsModalOpen(true);
                      break;

                  case 'connect_ride':
                      setShowModal(true);
                      break;
                  case 'searchRideConnection':
                      console.log("pushed")
                      router.push(`/searchRideConnection/${rideData.urid}`)
                      break;

                  case 'map':
                      if(rideData?.route_map && rideData?.route_map!= "0") {
                          window.open(rideData?.route_map, "_blank"); 
                      } else {
                        const src = rideData?.booking_source_coordinates?.coordinates?.sort();
                        const dest = rideData?.booking_destination_coordinates?.coordinates?.sort();
                        if (src && dest) {
                          const url = `https://www.google.com/maps/dir/${encodeURIComponent(src)}/${encodeURIComponent(dest)}`;
                          window.open(url, '_blank');
                        }
                      }
              }
          }
      };

      const handleRetry = () => {
          setIsErrorOpen(false);
      };

      useEffect(() => {
          if (rideData?.estimatedFareList?.length > 0) {
              const newCab = rideData.estimatedFareList[selected];
              if (newCab) {
                  setSelectedCab(newCab);
              }
          }
      }, [rideData, selected]);


      return (
        <div className="flex flex-col items-center mb-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4 w-[95%] mt-4">
            <h2 className="text-[14px] font-semibold text-gray-900 dark:text-white mb-4">
              Journey Points
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-3">
              {/* PICKUP LOCATION  */}
              <div className="relative w-full">
                <label className="flex items-center gap-2 mb-1">
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 bg-green-600 rounded-full"></span>
                    <span className="text-[12px] text-gray-400 dark:text-gray-300">
                      Pickup Location
                    </span>
                  </span>
                </label>

                <input
                  type="text"
                  value={userDetails?.pickupLocation || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setUserDetails((prev) => ({
                      ...prev,
                      pickupLocation: value,
                    }));
                    searchPlace(value, "from");
                    setSelectedField("from");
                  }}
                  className="w-full px-4 py-1.5 text-[14px] rounded-[5px] border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white"
                />

                {loading && (
                  <div className="absolute mt-1 w-full bg-white dark:bg-gray-700 border rounded shadow z-10 flex items-center justify-center py-1">
                    {/* <p className="p-2 text-sm text-gray-500 dark:text-gray-300">Loading...</p> */}
                    <div role="status">
                      <svg
                        aria-hidden="true"
                        className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-green-500"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                )}

                {!loading &&
                  selectedField === "from" &&
                  suggestions?.length > 0 && (
                    <ul className="absolute mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-lg rounded-lg max-h-48 overflow-auto z-30">
                      {suggestions?.map((item, index) => (
                        <li
                          key={index}
                          className="p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                          onClick={() => {
                            setUserDetails((prev) => ({
                              ...prev,
                              pickupLocation: `${item?.description}`,
                            }));
                            setLatLong((prev) => ({
                              ...prev,
                              lat1: item?.geometry?.location?.lat,
                              long1: item?.geometry?.location?.lng,
                            }));
                            // updateFareDetail();
                            setSuggestions([]);
                          }}
                        >
                          <div className="flex flex-col">
                            <h2 className="text-base font-semibold text-black dark:text-white">
                              {item?.description}
                            </h2>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {item?.address}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
              </div>

              {/* DROP LOCATION  */}
              <div className="relative w-full">
                <label className="flex items-center gap-2 mb-1">
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 bg-red-600 rounded-full"></span>
                    <span className="text-[12px] text-gray-400 dark:text-gray-300">
                      Drop Location
                    </span>
                  </span>
                </label>

                <input
                  type="text"
                  value={userDetails?.dropLocation || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setUserDetails((prev) => ({ ...prev, dropLocation: value }));
                    searchPlace(value, "to");
                    setSelectedField("to");
                  }}
                  className="w-full px-4 py-1.5 text-[14px] rounded-[5px] border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white"
                />

                {toLoad && (
                  <div className="absolute mt-1 w-full bg-white dark:bg-gray-700 border rounded shadow z-10 flex items-center justify-center py-1">
                    {/* <p className="p-2 text-sm text-gray-500 dark:text-gray-300">Loading...</p> */}
                    <div role="status">
                      <svg
                        aria-hidden="true"
                        className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-green-500"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <span class="sr-only">Loading...</span>
                    </div>
                  </div>
                )}

                {!toLoad && selectedField === "to" && suggestions?.length > 0 && (
                  <ul className="absolute mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-lg rounded-lg max-h-48 overflow-auto z-30">
                    {suggestions?.map((item, index) => (
                      <li
                        key={index}
                        className="p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        onClick={() => {
                          setUserDetails((prev) => ({
                            ...prev,
                            dropLocation: `${item?.description}`,
                          }));
                          setLatLong((prev) => ({
                            ...prev,
                            lat2: item?.geometry?.location?.lat,
                            long2: item?.geometry?.location?.lng,
                          }));
                          // updateFareDetail();
                          setSuggestions([]);
                        }}
                      >
                        <div className="flex flex-col">
                          <h2 className="text-base font-semibold text-black dark:text-white">
                            {item?.description}
                          </h2>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {item?.address}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between flex-wrap gap-6">
              <div className="flex items-center justify-between flex-1 gap-2">
                <div className="flex flex-col">
                  <label className="flex items-center gap-1 dark:text-gray-300">
                    <FaUserFriends className="text-gray-400 text-[12px]" />
                    <span className="text-[12px] text-gray-400 dark:text-gray-300">
                      Adults
                    </span>
                  </label>
                  <input
                    type="text"
                    value={userDetails?.adult || ""}
                    onChange={(e) =>
                      setUserDetails((prev) => ({
                        ...prev,
                        adult: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-1.5 border border-gray-300 dark:border-gray-700 rounded-[5px] bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white text-[14px]"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="flex items-center gap-1 dark:text-gray-300">
                    <FaUserFriends className="text-gray-400 text-[12px]" />
                    <span className="text-[12px] text-gray-400 dark:text-gray-300">
                      Children
                    </span>
                  </label>
                  <input
                    type="text"
                    value={userDetails?.children || ""}
                    onChange={(e) =>
                      setUserDetails((prev) => ({
                        ...prev,
                        children: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-1.5 border border-gray-300 dark:border-gray-700 rounded-[5px] bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white text-[14px]"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="flex items-center gap-1 dark:text-gray-300">
                    <FaSuitcaseRolling className="text-gray-400 text-[12px]" />
                    <span className="text-[12px] text-gray-400 dark:text-gray-300">
                      Big Luggage
                    </span>
                  </label>
                  <input
                    type="text"
                    value={userDetails?.bigLuggage || ""}
                    onChange={(e) =>
                      setUserDetails((prev) => ({
                        ...prev,
                        bigLuggage: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-1.5 border border-gray-300 dark:border-gray-700 rounded-[5px] bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white text-[14px]"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="flex items-center gap-1 dark:text-gray-300">
                    <FaSuitcaseRolling className="text-gray-400 text-[12px]" />
                    <span className="text-[12px] text-gray-400 dark:text-gray-300">
                      Small Luggage
                    </span>
                  </label>
                  <input
                    type="text"
                    value={userDetails?.smallLuggage || ""}
                    onChange={(e) =>
                      setUserDetails((prev) => ({
                        ...prev,
                        smallLuggage: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-1.5 border border-gray-300 dark:border-gray-700 rounded-[5px] bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white text-[14px]"
                  />
                </div>
              </div>

              {/* DATE AND TIME  */}
              <div className="flex items-center justify-between flex-1 gap-2">
                <div className="flex flex-col w-[48%]">
                  <label className="flex items-center gap-1 dark:text-gray-300">
                    <FaCalendarAlt className="text-gray-400 text-[12px]" />
                    <span className="text-[12px] text-gray-400 dark:text-gray-300">
                      Date
                    </span>
                  </label>
                  <input
                    type="date"
                    value={userDetails?.date || ""}
                    onChange={(e) =>
                      setUserDetails((prev) => ({
                        ...prev,
                        date: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-1.5 border border-gray-300 dark:border-gray-700 rounded-[5px] bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white text-[14px]"
                  />
                </div>

                <div className="flex flex-col w-[48%]">
                  <label className="flex items-center gap-1 dark:text-gray-300">
                    <FaClock className="text-gray-400 text-[12px]" />
                    <span className="text-[12px] text-gray-400 dark:text-gray-300">
                      Time
                    </span>
                  </label>
                  <input
                    type="time"
                    value={userDetails?.bookingTime || ""}
                    onChange={(e) =>
                      setUserDetails((prev) => ({
                        ...prev,
                        bookingTime: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-1.5 border border-gray-300 dark:border-gray-700 rounded-[5px] bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white text-[14px]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIDE LIST WITH FARE SUMMARY  */}
          <RideSection
            cabData={
              updatedFare?.estimatedFareList?.length > 0 ? updatedFare : cabDatas
            }
            ridess={rideData}
            updateCabData={setUpdatedFare}
            isUpdatedFare={updatedFare?.estimatedFareList?.length > 0}
            userDetails={userDetails}
            setUserDetails={setUserDetails}
            updateRideDetails={updateRideDetails}
            selectedCabs={selectedCabs}
            setCheckUpdate={setCheckUpdate}
            setSelectedCabs={setSelectedCabs}
            userAgreeData={selectedCab}
            cabDataFound={message ? message : []}
          />

          {/* CONFIRM, ADD REMARKS, CANCEL RIDE, WHATSAPP CHAT AND CAB FOUND BUTTONS  */}
          <div className="bg-[#f9fafb] dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm w-[95%] mx-auto mt-4">
            <div className="flex items-center gap-2 mb-4">
              <FaMapMarkerAlt className="text-purple-600 text-[16px]" />
              <h2 className="text-[14px] font-semibold text-gray-800 dark:text-white">
                Map
              </h2>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/3 space-y-4">
                <div>
                  <label className="flex items-center gap-1">
                    <span className="h-2 w-2 bg-purple-600 rounded-full" />
                    <span className="text-[12px] text-gray-500 dark:text-gray-300">
                      Via Route
                    </span>
                  </label>
                  <input
                    type="text"
                    value={userDetails?.changeRoute || ""}
                    onChange={(e) =>
                      setUserDetails((prev) => ({
                        ...prev,
                        changeRoute: e.target.value,
                      }))
                    }
                    placeholder="Enter route name"
                    className="w-full px-4 py-1.5 rounded-lg text-[14px] border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1">
                    <span className="h-2 w-2 bg-purple-600 rounded-full" />
                    <span className="text-[12px] text-gray-500 dark:text-gray-300">
                      Map Link
                    </span>
                  </label>
                  <input
                    type="url"
                    value={userDetails?.mapLink || ""}
                    onChange={(e) =>
                      setUserDetails((prev) => ({
                        ...prev,
                        mapLink: e.target.value,
                      }))
                    }
                    placeholder="Eg: https://maps.app.goo.gl/..."
                    className="w-full px-4 py-1.5 rounded-lg text-[14px] border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="w-full md:w-2/3 flex flex-col justify-between gap-4">
                <div className="grid grid-cols-7 gap-2">
                  {[
                    {
                      label: "Confirm",
                      color: "bg-[#F0FDF4]",
                      iconColor: "text-[#16A34A]",
                    },
                    {
                      label: "Remarks",
                      color: "bg-[#EFF6FF]",
                      iconColor: "text-[#2563EB]",
                    },
                    {
                      label: "Map",
                      color: "bg-[#FAF5FF]",
                      iconColor: "text-[#9333EA]",
                    },
                    {
                      label: "WhatsApp",
                      color: "bg-[#F0FDF4]",
                      iconColor: "text-[#22C55E]",
                    },
                    {
                      label: "Cancel Ride",
                      color: "bg-[#FEF2F2]",
                      iconColor: "text-[#DC2626]",
                    },
                    {
                      label: "Connect Ride",
                      color: "bg-[#F0FDF4]",
                      iconColor: "text-[#22C55E]",
                    },
                    {
                      label: "Search Connection",
                      color: "bg-[#E6E6FF]",
                      iconColor: "text-[#0000D1]",
                    },
                  ]
                    .filter(
                      (btn) =>
                        btn.label !== "Confirm" ||
                        rideData?.status?.toLowerCase() === "pending" ||
                        rideData?.status?.toLowerCase() === "processing"
                    )
                    .map((btn, i) => (
                      <button
                        key={i}
                        className={`flex flex-col items-center justify-center px-2 py-4 rounded-xl ${btn.color}`}
                        onClick={() => handleEditClick(btn)}
                      >
                        <div className={`text-[16px] ${btn.iconColor}`}>
                          {btn.label.toLocaleLowerCase() === "confirm" && (
                            <FiCheckCircle />
                          )}
                          {btn.label.toLocaleLowerCase() === "remarks" && (
                            <LuMessageSquare />
                          )}
                          {btn.label.toLocaleLowerCase() === "map" && (
                            <FaMapMarkerAlt />
                          )}
                          {btn.label.toLocaleLowerCase() === "whatsapp" && (
                            <LuMessageCircle />
                          )}
                          {btn.label.toLocaleLowerCase() === "cancel ride" && (
                            <BsExclamationTriangle />
                          )}
                          {btn.label.toLocaleLowerCase() === "connect ride" && (
                            <BsLink />
                          )}
                          {btn.label.toLocaleLowerCase() ===
                            "search connection" && <FaCar />}
                        </div>
                        <span className="text-[10px] text-[#374151] text-center">
                          {btn.label}
                        </span>
                      </button>
                    ))}
                </div>

                <div className="space-y-2">
                  <button
                    // onClick={updateRideDetails}
                    onClick={() => {
                      setIsOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-blue-500 to-cyan-400 dark:bg-yellow-500 text-white dark:text-black transition-all duration-200 shadow-sm text-[14px] font-medium"
                  >
                    <FaBolt className="text-white text-[14px]" />
                    <span className="text-white text-[14px] font-medium">
                      Update Journey Details
                    </span>
                  </button>
                  {["pending", "processing"].includes(
                    rideData?.status?.toLowerCase()
                  ) &&
                    rideData?.service_type?.toLowerCase() !== "rental" && (
                      <button
                        // onClick={cabFound}
                        onClick={() => setCabFoundModal(true)}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md ${
                          rideData?.op_cab_status === 1 ||
                          message?.op_cab_status === 1
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-black hover:bg-slate-700"
                        } transition-all duration-200 shadow text-white text-[14px] font-medium`}
                      >
                        {rideData?.is_agree === 1 ? (
                          <FiCheckCircle className="text-white text-[14px]" />
                        ) : (
                          ""
                        )}
                        <span className="text-white text-[14px] font-medium">
                          {rideData?.op_cab_status === 1 ||
                          message?.op_cab_status === 1
                            ? "Cab Found"
                            : "Cab Not Found"}
                        </span>
                      </button>
                    )}
                </div>
              </div>
            </div>
          </div>

          {/* MODAL FOR CONFIRM, ADD REMARKS, CANCEL RIDE, WHATSAPP CHAT  */}
          <UpdateDetailsModal
            isOpen={isModalOpen}
            title={
              modalAction === "confirm_ride"
                ? "Confirm Ride"
                : modalAction === "cancel_request"
                ? "Cancel Request"
                : modalAction === "add_remarks"
                ? "Add Remarks"
                : modalAction === "whatsapp_chat"
                ? "Whatsapp Chat"
                : ""
            }
            onClose={() =>
              modalAction === "cancel_request"
                ? addRemarks("", rideData?.status)
                : setIsModalOpen(false)
            }
            onSubmit={handleModalSubmit}
            modalAction={modalAction}
            payStatus={payStatus}
          >
            {/* CONFIRM RIDE MODAL  */}
            {modalAction === "confirm_ride" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    ["Distance", "distance"],
                    ["Price(₹)", "price"],
                    ["Advance Amount", "advance"],
                    ["CAB (Probable)", "cab_number"],
                    ["Required Carrier", "carrier"],
                    ["Payment Status", "payment_status"],
                  ].map(([label, name]) => (
                    <div key={name}>
                      <label className="block text-[12px] text-gray-500">
                        {label}
                      </label>

                      {name === "carrier" ? (
                        <select
                          name={name}
                          className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 focus:outline-none text-[12px]"
                          value={selectedCabs[name] || ""}
                          onChange={handleChange}
                        >
                          <option value="">--Please Select--</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      ) : name === "payment_status" ? (
                        <select
                          className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 focus:outline-none text-[12px]"
                          value={payStatus || ""}
                          onChange={(e) => {
                            if (e.target.value === "not_paid") {
                              setSelectedCabs((prev) => ({
                                ...prev,
                                advance: "0",
                              }));
                            } else {
                              setSelectedCabs((prev) => ({
                                ...prev,
                                advance: userDetails?.advanceAmount,
                              }));
                            }
                            setPayStatus(e.target.value);
                          }}
                        >
                          {/* <option value="">--Please Select--</option> */}
                          <option value="processing">--Processing--</option>
                          <option value="not_paid">Confirm--Not Paid</option>
                          <option value="paid">Confirm--Paid</option>
                        </select>
                      ) : (
                        <input
                          name={name}
                          type={
                            name === "date"
                              ? "date"
                              : name === "time"
                              ? "time"
                              : "text"
                          }
                          className="w-full text-[12px] rounded-md border border-gray-300 bg-white px-4 py-2 focus:outline-none"
                          placeholder={label}
                          value={selectedCabs[name] || ""}
                          onChange={handleChange}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <label className="block text-[12px] text-gray-700">
                    Additional Remarks
                  </label>
                  <textarea
                    rows={3}
                    className="w-full rounded-md border border-gray-300 bg-white px-4 py-1.5 focus:outline-none text-[12px]"
                    placeholder="Enter any special instructions or notes…"
                    name="remarks"
                    value={selectedCabs?.remarks}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </>
            )}

            {/* CANCEL RIDE MODAL  */}
            {modalAction === "cancel_request" && (
              <>
                <div className="bg-[#F9FAFB] border border-gray-200 rounded-xl p-4 mb-6">
                  <h1 className="mb-4 text-[#374151] text-[16px]">
                    TRIP DETAILS
                  </h1>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 rounded-md bg-[#DBEAFE] flex items-center justify-center">
                      <CiLocationOn className="text-[#3B82F6] text-xl" />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold text-gray-800">
                        {rideData?.location_details?.source}
                      </p>
                      <p className="text-sm font-semibold text-gray-800">
                        {rideData?.location_details?.destination}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-md bg-[#F3E8FF] flex items-center justify-center">
                      <CiUser className="text-[#9333EA] text-xl" />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold text-gray-800">
                        {rideData?.user_details_json?.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {rideData?.user_details_json?.book_contact}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-2">
                  <div className="mb-3 relative" ref={cancelRef}>
                    <label className="block text-xs text-gray-600 dark:text-gray-400">
                      Cancellation Reason
                    </label>

                    <div
                      onClick={() => setShowDropdown1(!showDropdown1)}
                      className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1E1B2E] text-gray-800 dark:text-gray-200 rounded px-3 py-2 text-[12px] cursor-pointer relative"
                    >
                      {cancelTemplate
                        ? cancelTemplates.find((t) => t.id === cancelTemplate)
                            ?.name
                        : "Select Whatsapp template"}
                      <FaCaretDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>

                    {showDropdown1 && (
                      <ul className="absolute z-50 mt-1 max-h-48 overflow-y-auto w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1E1B2E] rounded shadow text-sm">
                        {cancelTemplates.map((template) => (
                          <li
                            key={template.id}
                            onClick={() => {
                              setCancelTemplate(template.id);
                              setShowDropdown1(false);
                            }}
                            className={`px-4 py-2 text-[12px] cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                              cancelTemplate === template.id
                                ? "bg-blue-100 dark:bg-gray-700 font-semibold"
                                : ""
                            }`}
                          >
                            {template.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Remarks
                  </label>
                  <textarea
                    name="notes"
                    rows={3}
                    placeholder="Please provide additional details the cancellation.."
                    value={selectedCabs.notes || ""}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                </div>
              </>
            )}

            {/* ADD REMARKS MODAL  */}
            {/* {modalAction === 'add_remarks' && (
                      <div className="space-y-2">
                          <div>
                              <h3 className="text-sm font-medium text-gray-600 mb-1">RECENT ACTIVITY</h3>
                              <div className="bg-gray-100 rounded-md p-3">
                                  <ul className="space-y-2 text-sm text-gray-800 dark:text-gray-200 mt-2 max-h-64 overflow-y-auto">
                                      {activityData?.map((item, idx) => (
                                          <li key={idx} className="flex items-start gap-2">
                                              <div className={`mt-1 w-7 h-7 flex items-center justify-center rounded-full text-white ${statusColors[item.activity_status]}`}>
                                                  <FaBell className="w-4 h-4" />
                                              </div>
                                              <div>
                                                  <p><span className={`font-semibold ${statusTextColors[item?.activity_status]}`}>{item?.activity_status}:</span> {item?.remark}</p>
                                                  {item?.detail && <p className="text-xs text-gray-500 dark:text-gray-400">{item?.detail}</p>}
                                                  <p className="text-[11px] text-gray-500 dark:text-gray-400">{moment(item?.created_at).add(5.50, "hours").format("YYYY-MM-DD HH:mm:ss")} By: {item?.created_by_name}</p>
                                              </div>
                                          </li>
                                      ))}
                                  </ul>
                              </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                              <div className="relative" ref={dropdownRef}>
                                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Remarks Type</label>
                                  <div
                                      onClick={() => setShowDropdown(!showDropdown)}
                                      className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1E1B2E] text-gray-800 dark:text-gray-200 rounded px-3 py-2 text-[12px] cursor-pointer relative"
                                  >
                                      {selectedRemarksTemplate
                                          ? generalTemplates.find(t => t.id === selectedRemarksTemplate)?.name
                                          : 'Select Whatsapp template'}
                                      <FaCaretDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                  </div>

                                  {showDropdown && (
                                      <ul className="absolute z-50 mt-1 max-h-48 overflow-y-auto w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1E1B2E] rounded shadow text-sm">
                                          {generalTemplates.map((template) => (
                                              <li
                                                  key={template.id}
                                                  onClick={() => {
                                                      setSelectedRemarksTemplate(template.id);
                                                      setShowDropdown(false);
                                                  }}
                                                  className={`px-4 py-2 text-[12px] cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${selectedRemarksTemplate === template.id
                                                      ? 'bg-blue-100 dark:bg-gray-700 font-semibold'
                                                      : ''
                                                      }`}
                                              >
                                                  {template.name}
                                              </li>
                                          ))}
                                      </ul>
                                  )}
                              </div>

                              
                              <div>
                                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Next Call Date</label>
                                  <input
                                      name="call_date"
                                      type="date"
                                      value={selectedCabs.call_date || ''}
                                      onChange={handleChange}
                                      className="w-full rounded-md border border-gray-300 px-4 py-2 text-[12px]"
                                  />
                              </div>

                              
                              <div>
                                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Time</label>
                                  <input
                                      name="call_time"
                                      type="time"
                                      value={selectedCabs.call_time || ''}
                                      onChange={handleChange}
                                      className="w-full rounded-md border border-gray-300 px-4 py-2 text-[12px]"
                                  />
                              </div>
                          </div>


                          <div>
                              <label className="block text-xs text-gray-600 dark:text-gray-400">Additional Remarks</label>
                              <textarea
                                  name="notes"
                                  rows={2}
                                  value={selectedCabs.notes || ''}
                                  onChange={handleChange}
                                  placeholder="Write Remarks..."
                                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-1 text-[12px]"
                              />
                          </div>
                      </div>
                  )} */}

            {modalAction === "add_remarks" && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-600">
                  RECENT ACTIVITY
                </h3>

                <div className="bg-white border rounded-lg p-2 max-h-72 overflow-y-auto shadow-sm space-y-4">
                  {activityData?.map((item, idx) => (
                    <div
                      key={idx}
                      className="border rounded-lg p-3 bg-gray-50 shadow-sm"
                    >
                      {/* STATUS + ICON */}
                      <div className="flex items-center gap-3 ">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                            statusColors[item.activity_status]
                          }`}
                        >
                          <FaBell />
                        </div>
                        {/* <p className="font-semibold text-gray-800 capitalize">{item.activity_status}</p> */}
                        <p
                          className={`text-lg font-semibold capitalize ${
                            statusTextColors[item.activity_status] ||
                            "text-gray-800"
                          }`}
                        >
                          {item.activity_status}
                        </p>
                      </div>

                      {/* MAIN TEXT */}
                      <p className="text-sm text-gray-700">
                        {extractPlainText(item.remark)}
                      </p>

                      {/* OLD → NEW LIST */}
                      <div className=" space-y-1">
                        {parseOldNewFields(item.remark).map((row, i) => (
                          <p key={i} className="text-sm text-gray-700">
                            <span className="font-semibold">{row.label}:</span>
                            <span className="text-red-500"> Old: {row.old}</span>
                            <span className="text-gray-400 mx-1">→</span>
                            <span className="text-green-600 font-semibold">
                              New: {row.new}
                            </span>
                          </p>
                        ))}
                      </div>

                      {/* FOOTER */}
                      <p className="text-sm text-gray-500 ">
                        {moment(item.created_at)
                          .add(5.5, "hours")
                          .format("DD MMM YYYY, hh:mm A")}{" "}
                        • {item.created_by_name}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div className="relative" ref={dropdownRef}>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1 flex items-center justify-between w-full">
                      <span>Remarks Type</span>{" "}
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => setIsChecked(!isChecked)}
                      />
                    </label>
                    <div
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1E1B2E] text-gray-800 dark:text-gray-200 rounded px-3 py-2 text-[12px] cursor-pointer relative"
                    >
                      {selectedRemarksTemplate
                        ? generalTemplates.find(
                            (t) => t.id === selectedRemarksTemplate
                          )?.name
                        : "Select Whatsapp template"}
                      <FaCaretDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>

                    {showDropdown && (
                      <ul className="absolute z-50 mt-1 max-h-48 overflow-y-auto w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1E1B2E] rounded shadow text-sm">
                        {generalTemplates.map((template) => (
                          <li
                            key={template.id}
                            onClick={() => {
                              setSelectedRemarksTemplate(template.id);
                              setShowDropdown(false);
                            }}
                            className={`px-4 py-2 text-[12px] cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                              selectedRemarksTemplate === template.id
                                ? "bg-blue-100 dark:bg-gray-700 font-semibold"
                                : ""
                            }`}
                          >
                            {template.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Next Call Date
                    </label>
                    <input
                      name="call_date"
                      type="date"
                      value={selectedCabs.call_date || ""}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 px-4 py-2 text-[12px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Time
                    </label>
                    <input
                      name="call_time"
                      type="time"
                      value={selectedCabs.call_time || ""}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 px-4 py-2 text-[12px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400">
                    Additional Remarks
                  </label>
                  <textarea
                    name="notes"
                    rows={2}
                    value={selectedCabs.notes || ""}
                    onChange={handleChange}
                    placeholder="Write Remarks..."
                    className="w-full rounded-md border border-gray-300 bg-white px-4 py-1 text-[12px]"
                  />
                </div>
              </div>
            )}

            {/* WHATSAPP CHAT  */}
            {modalAction === "whatsapp_chat" && (
              <div className="flex justify-center items-center">
                <div className="w-full max-w-2xl">
                  {/* Header */}
                  {/* <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-t-xl px-6 py-4 flex items-center gap-3">
                                  <div className="text-white text-lg font-semibold">
                                      <div>WhatsApp Chat</div>
                                      <div className="text-xs font-normal">Connect instantly with customer</div>
                                  </div>
                              </div> */}

                  {/* Chat messages */}
                  <div className="p-6 space-y-4 text-sm">
                    {/* Incoming */}
                    <div className="flex flex-col items-start space-y-1">
                      <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-xl rounded-bl-none max-w-[80%]">
                        Hi there, How are you?
                      </div>
                      <span className="text-[10px] text-gray-500">12:24 PM</span>
                    </div>

                    <div className="flex flex-col items-start space-y-1">
                      <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-xl rounded-bl-none max-w-[80%]">
                        Waiting for your reply. As I have to go back soon. I have
                        to travel long distance.
                      </div>
                      <span className="text-[10px] text-gray-500">12:25 PM</span>
                    </div>

                    {/* Outgoing */}
                    <div className="flex flex-col items-end space-y-1">
                      <div className="bg-green-500 text-white px-4 py-2 rounded-xl rounded-br-none max-w-[80%]">
                        Hi, I am coming there in few minutes. Please wait!! I am
                        in taxi right now.
                      </div>
                      <span className="text-[10px] text-gray-500">12:28 PM</span>
                    </div>

                    {/* Incoming */}
                    <div className="flex flex-col items-start space-y-1">
                      <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-xl rounded-bl-none max-w-[80%]">
                        Thank you very much, I am waiting here at StarBuck cafe.
                      </div>
                      <span className="text-[10px] text-gray-500">12:35 PM</span>
                    </div>
                  </div>

                  {/* Message input area */}
                  <div className="px-6 py-4 border-t flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Select Topic
                      </label>
                      <select
                        className="w-full rounded-md border-gray-300 text-sm px-3 py-2"
                        value={selectedTopic}
                        onChange={(e) => setSelectedTopic(e.target.value)}
                      >
                        <option>
                          Please mention no. of Passengers & Luggage?
                        </option>
                        <option>Where are you currently waiting?</option>
                        <option>ETA to Pickup Location?</option>
                      </select>
                    </div>

                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Your Message
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Please mention no. of......."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="w-full px-4 py-2 rounded-md border border-gray-300 text-sm"
                        />
                        <button className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition">
                          <FiSend size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </UpdateDetailsModal>

          <RideConnectionModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            ridesData={rideData}
          />

          {/* <RidesModal isOpen={ridesModalOpen} onClose={() => setRidesModalOpen(false)} urId={rideData.urid} /> */}

          <Failed
            isOpen={isErrorOpen}
            onClose={() => setIsErrorOpen(false)}
            onRetry={handleRetry}
            info={message}
          />
          <Success
            isOpen={isSuccessOpen}
            onClose={() => setIsSuccessOpen(false)}
            info={message}
          />

          {/* CAB FOUND MODAL  */}
          {cabFoundModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
              <div className="relative bg-white dark:bg-gray-900 rounded-xl p-4 max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-lg">
                <button
                  onClick={() => setCabFoundModal(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-xl font-bold"
                >
                  &times;
                </button>
                <div className="bg-[#005FE2] bg-opacity-10 dark:from-gray-800 dark:to-gray-900 p-4 rounded-2xl mt-4">
                  <div className="flex items-center gap-2 mb-4">
                    <FaBolt className="text-purple-600 dark:text-yellow-400 text-[14px]" />
                    <span className="text-[14px] font-semibold text-gray-600 dark:text-gray-100">
                      Choose Your Ride
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cabDatas?.estimatedFareList?.length > 0 &&
                      cabDatas?.estimatedFareList?.map((ride, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            setSelected(index);
                          }}
                          className={`relative flex flex-col items-start bg-white dark:bg-gray-800 py-1 rounded-lg shadow-lg cursor-pointer transition-all duration-200 border-2 ${
                            selected === index
                              ? "border-[#005FE2] dark:border-yellow-400"
                              : rideData?.op_cab_details_json?.cab_type?.toLowerCase() ===
                                ride?.cab_type.toLowerCase()
                              ? "border-green-600"
                              : rideData?.booking_type.toLowerCase() ===
                                ride?.cab_type.toLowerCase()
                              ? "border-[#005FE2] dark:border-yellow-400"
                              : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                          }`}
                        >
                          <div
                            className={`absolute top-0 left-20 -translate-x-1/2 -translate-y-1/2 ${
                              rideData?.op_cab_details_json?.cab_type?.toLowerCase() ===
                              ride?.cab_type.toLowerCase()
                                ? "bg-gradient-to-r from-[#038e29] to-[#02f946]"
                                : "bg-gradient-to-r from-blue-500 to-cyan-400"
                            } text-white text-[12px] px-4 py-0.5 rounded-full`}
                          >
                            {ride?.cab_type}
                          </div>

                          {rideData?.op_cab_details_json?.cab_type?.toLowerCase() ===
                            ride?.cab_type.toLowerCase() && (
                            <div className="absolute top-0 right-5 -translate-x-1/2 -translate-y-1/2 bg-yellow-500 text-white px-4 py-1 rounded-full flex gap-1">
                              <RiCheckDoubleFill className="text-white text-[14px]" />
                              <span className="text-white text-[10px] font-semibold">
                                NA
                              </span>
                            </div>
                          )}
                          <div className="w-full flex items-center gap-8">
                            <div className="ml-[7%] w-20 h-20">
                              {ride?.cab_icon ? (
                                <Image
                                  src={ride?.cab_icon}
                                  alt="Cab"
                                  height={200}
                                  width={200}
                                  className="object-contain rounded-xl"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  No Image
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center">
                                <span className="font-semibold text-gray-600 dark:text-gray-100 text-[14px]">
                                  {ride?.cab_type}
                                </span>
                              </div>
                              <span className="text-purple-700 dark:text-yellow-400 text-[14px] font-semibold">
                                ₹{ride?.estimated_fare}
                              </span>
                            </div>
                          </div>
                          <div className="w-full flex ml-[7%] gap-1">
                            <div className="bg-[#E2F6FA] dark:bg-gray-700 px-1 rounded-md">
                              <span className="text-[10px] text-gray-700 dark:text-gray-300 font-semibold">
                                <span>{rideData?.booking_travel_date}</span> |{" "}
                                <span>{rideData?.bookingTime}</span>
                              </span>
                            </div>
                            {rideData?.op_cab_details_json?.cab_type?.toLowerCase() ===
                              ride?.cab_type.toLowerCase() &&
                              rideData?.op_cab_details_json
                                ?.booking_travel_date && (
                                <div className="bg-green-100 dark:bg-gray-700 px-1 rounded-md">
                                  <span className="text-[10px] text-green-600 dark:text-gray-300 font-semibold">
                                    <span>
                                      {
                                        rideData?.op_cab_details_json
                                          ?.booking_travel_date
                                      }
                                    </span>
                                  </span>
                                </div>
                              )}
                          </div>
                        </div>
                      ))}
                  </div>

                  <div className="flex items-center justify-between flex-1 gap-2 mt-4">
                    <div className="flex-1 flex-col">
                      <label className="flex items-center gap-1 dark:text-gray-300">
                        <FaCalendarAlt className="text-gray-400 text-[12px]" />
                        <span className="text-[12px] text-gray-400 dark:text-gray-300">
                          Date
                        </span>
                      </label>
                      <input
                        type="date"
                        value={cabFoundDate}
                        onChange={(e) => setCabFoundDate(e.target.value)}
                        className="w-full px-4 py-1.5 border border-gray-300 dark:border-gray-700 rounded-[5px] bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white text-[14px]"
                      />
                    </div>

                    <div className="flex-1 flex-col">
                      <label className="flex items-center gap-1 dark:text-gray-300">
                        <FaClock className="text-gray-400 text-[12px]" />
                        <span className="text-[12px] text-gray-400 dark:text-gray-300">
                          Time
                        </span>
                      </label>
                      <input
                        type="time"
                        value={cabFoundTime}
                        onChange={(e) => setCabFoundTime(e.target.value)}
                        className="w-full px-4 py-1.5 border border-gray-300 dark:border-gray-700 rounded-[5px] bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white text-[14px]"
                      />
                    </div>

                    <div className="flex-1 flex-col">
                      <button
                        onClick={cabFoundByAdmin}
                        className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 transition-all duration-200 shadow text-white text-[14px] font-medium"
                      >
                        <FiCheckCircle className="text-white text-[14px]" />
                        <span className="text-white text-[14px] font-medium">
                          Cab Found
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CONFIRMATION MODAL  */}
          {isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white rounded-md shadow-xl w-full max-w-sm relative">
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5 text-red-600" />
                </button>

                <div className="flex flex-col items-center px-6 py-8 text-center">
                  <div className="bg-green-100 text-green-600 p-2 rounded-full mb-4">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h2 className="text-lg font-bold text-black-700 mb-6">
                    Are you sure to update ride details?
                  </h2>
                  {/* <p className="text-sm text-gray-600 mb-6">Are you sure to confirm that a cab has been found for this journey?</p> */}

                  <div className="flex gap-4 w-full">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="flex-1 border border-red-600 text-red-600 py-1.5 rounded-md hover:bg-gray-200"
                    >
                      Not, Now
                    </button>
                    <button
                      onClick={() => updateRideDetails()}
                      className="flex-1 border border-green-600 text-green-600 py-1.5 rounded-md hover:bg-green-700 hover:text-white"
                    >
                      Yes, Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      );
  }

  export default UserPrimaryData