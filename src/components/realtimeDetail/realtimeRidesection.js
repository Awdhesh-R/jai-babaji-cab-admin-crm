"use client";
import React, { useState, useEffect, useCallback } from "react";
import { FaBolt, FaInfoCircle, FaTimes } from "react-icons/fa";
import { AiTwotoneExclamationCircle } from "react-icons/ai";
import { FiChevronDown } from "react-icons/fi";
import FareSection from "./realtimeFareSection";
import { RiCheckDoubleFill } from "react-icons/ri";
import { apiClient } from "@/app/lib/apiClient";
import Image from "next/image";
import moment from "moment";
import Swal from "sweetalert2";

const RideSection = ({ cabData, updateCabData, isUpdatedFare, ridess, userDetails, setUserDetails, selectedCabs, setSelectedCabs, userAgreeData, cabDataFound, setCheckUpdate, updateRideDetails }) => {

    //States to update data
    const [found, setFound] = useState("");
    const [selected, setSelected] = useState(() => {
        const bookingType = ridess?.booking_type?.toLowerCase();
        return bookingType === "mini" ? 0 : bookingType === "sedan" ? 1 : bookingType === "suv" ? 2 : 0;
    });
    const [selectedCab, setSelectedCab] = useState(null);
    const [cabFounds, setCabFounds] = useState([]);
    const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
    const [coupon, setCoupon] = useState([]);
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [selectedCouponIndex, setSelectedCouponIndex] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showFareBreakUpModal, setShowFareBreakUpModal] = useState(false);
    const [naOpen, setNaOpen] = useState(false);
    const [agreeOption, setAgreeOption] = useState('yes');
    const [checkAgree, setCheckAgree] = useState([]);

    const formatDateToInput = (dateStr) => {
        if (!dateStr) return '';
        const [day, month, year] = dateStr.split('-');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
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
    //data changes then render related jsx
    useEffect(()=> {
        if(ridess?.op_cab_details_json) {
            setCabFounds(ridess?.op_cab_details_json);
        }
    }, [ridess]);
    //AGREE BY CUSTOMER API
    const agreeByUser = async () => {
        const payData = {
            urid: ridess?.urid,
            agree_cab_details_json: {
                ...(cabFounds || {}),
                cab_type_id: cabFounds?.cab_type_id,
                cab_type: cabFounds?.cab_type,
                estimated_fare: userDetails?.estimatedFare,
                distanceInKm: userDetails?.estKm,
                durationInMin: userDetails?.reqTime,
                advanceToBe: userDetails?.advanceAmount,
                remaningAmout: userDetails?.remainingAmount,
                cab_icon: userDetails?.cabIcon,
                booking_travel_date: `${cabFounds?.booking_travel_date}`,
            },
            agree: agreeOption === 'yes' ? 1 : 0,
        };

        try {
            const response = await apiClient("POST", "/ride_management/agreeRideByAdmin", JSON.stringify(payData), true);
            if (response?.success || response.status) {
                setNaOpen(false);
                updateRideDetails({
                    booking_type: cabFounds?.cab_type.toLowerCase(),
                    basePriceId: cabFounds?.cab_type_id,
                    booking_travel_date: cabFounds?.booking_travel_date ?`${moment(cabFounds?.booking_travel_date, "DD-MM-YYYY HH:mm").format("YYYY-MM-DD hh:mm A")}` : `${formatDateToInput(userDetails?.date)} ${formatBookingTime(userDetails?.bookingTime)}`,
                    price_details_json: {
                        ...ridess?.price_details_json,
                        estimated_fare: userDetails?.estimatedFare,
                        final_fare: userDetails?.estimatedFare,
                        collected_by_driver: parseFloat(userDetails?.estimatedFare || 0) - parseFloat(((ridess?.status === 'pending' || ridess?.status === "processing")? userDetails?.advanceAmount: ridess?.price_details_json?.advance_amount) || 0) - parseFloat(userDetails?.discount || 0), 
                        final_fare: userDetails?.estimatedFare,
                        estimared_km: userDetails?.estKm,
                        estimated_time: userDetails?.reqTime,
                        advance_amount: (ridess?.status === 'pending' || ridess?.status === "processing")? userDetails?.advanceAmount: ridess?.price_details_json?.advance_amount,
                        // advance_amount: userDetails?.advanceAmount,
                        extra_per_km: cabFounds?.extra_per_km || ridess?.price_details_json?.extra_per_km || 0,
                        extra_time_per_minutes: cabFounds?.extra_minutes_charge || ridess?.price_details_json?.extra_time_per_minutes || 0,
                    }
                });
                setCheckUpdate((prev) => !prev);
                setCheckAgree(response?.data ? response?.data : []);
            }
        } catch (error) {
            console.error(error);
        }
    };

    //Coupon Lists 
    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const response = await apiClient("GET", "/coupon/coupon-list", '', true);
                setCoupon(response?.success ? response?.data?.coupons : []);
            } catch (error) {
                console.error(error);
            }
        };
        fetchCoupons();
    }, []);

    // COUPON APPLY 
    const applyCoupon = useCallback(async () => {
        const userType = JSON.parse(localStorage.getItem('user'));
        const payData = {
            coupon_code: selectedCoupon?.coupon_code,
            user_id: selectedCoupon?.user_id,
            urid: ridess?.urid,
            created_by: String(userType?.id),
        };
        try {
            const response = await apiClient("POST", '/coupon/applyCouponByAdmin', JSON.stringify(payData), 'true');
            if(response?.success){
                console.log("wow coupon applied");
            }
            if (!response?.success) console.warn("Coupon apply failed");
        } catch (error) {
            console.error(error);
        }
    }, [selectedCoupon?.coupon_code, selectedCoupon?.user_id, ridess?.urid]);

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
    const handleSetSelected = (index) => {
        setSelected(index);
        const newCab = cabData?.estimatedFareList?.[index];
        setSelectedCab(newCab);
        setUserDetails((prev) => ({
            ...prev,
            cabTypeId: newCab?.id || "",
            bookingType: newCab?.cab_type || "",
            remainingAmount: newCab?.remaningAmout || "",
            cabIcon: newCab?.cab_icon || "",
            estimateFare: newCab?.estimated_fare || "",
            reqTime: formatTime(cabData?.durationInMin) || prev?.reqTime,
            estKm: cabData?.distanceTimeGoogleData?.distanceText || cabData?.distanceInKm || prev?.estKm || "",
            advanceAmount: newCab?.advanceToBe || "",
            couponCode: ridess?.payment_details_json?.coupon_apply_details?.coupon_details?.code || selectedCoupon?.coupon_code || '',
        }));
        setSelectedCabs((prev) => ({
            ...prev,
            price: newCab?.estimated_fare || '',
            distance: newCab?.base_km || '',
            cabType: newCab?.cab_type || '',
            advance: newCab?.advanceToBe || '',
        }));
    }

    const handleRemoveCabFound = async () => {
        try {
            Swal.fire("Are you sure?", "Found cab will be removed", "question").then(res=>{
                if(res.value) {
                    updateRideDetails({
                        op_cab_status: 0,
                        op_cab_details_json: null,
                        is_agree: 0,
                        agree_cab_details_json: null
                    });
                }
            })
        } catch (e) {

        }
    }

    // Now list it in dependencies
    useEffect(() => {
        const applied = ridess?.payment_details_json?.coupon_apply_details?.estimated_amount;
        if (selectedCoupon && !applied) applyCoupon();
    }, [applyCoupon, selectedCoupon, ridess?.payment_details_json?.coupon_apply_details?.estimated_amount]);

    return (
        <>

            {ridess?.service_type?.toLowerCase() !== 'rental' && <div className="bg-[white] border dark:from-gray-800 dark:to-gray-900 p-4 rounded-2xl shadow-md w-[95%] transition-colors duration-300 mt-4">
                <div className="flex items-center gap-2 mb-4">
                    <FaBolt className="text-purple-600 dark:text-yellow-400 text-[14px]" />
                    <span className="text-[18px] font-semibold text-black dark:text-gray-100">Selected Cab & Journey Details</span>
                </div>
                {/* BOOKING TYPES FARE LISTS  */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div
                                className={`relative flex flex-col items-start bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm cursor-pointer transition-all duration-200 border-2`}
                            >
                                <div className="w-full flex flex-col items-center gap-3">
                                    <div className="rounded-xl flex items-start">
                                            <Image
                                                src={ridess?.cab_details_json?.cab_icon ||(ridess?.estimatedFareList?.find((fare)=> fare.cab_type.toLowerCase() === ridess?.booking_type?.toLowerCase())?.cab_icon) || "/images/car.png"}
                                                alt="Cab"
                                                width={120}
                                                height={120}
                                                className="object-contain rounded-xl"
                                            />
                                    </div>

                                    {ridess?.booking_type && (
                                        <div className={`capitalize dark:bg-yellow-500 text-black font-bold text-2xl px-4 py-0.5 rounded-full`}>
                                            {ridess?.booking_type}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={`relative flex flex-col items-center justify-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border-2`}>
                                <div className="font-semibold flex flex-col items-center justify-center gap-3">
                                    <div className="flex items-center gap-2">
                                        <span> Estimated Fare</span>
                                        <button onClick={() => setShowFareBreakUpModal(true)}>
                                                <FaInfoCircle className="text-black text-[18px]" />
                                        </button>
                                    </div> 
                                    <span className="text-purple-700 text-2xl font-bold">
                                        ₹{ridess?.price_details_json?.estimated_fare}
                                    </span>
                                            
                                </div>
                            </div>

                            <div className={`relative flex flex-col items-start justify-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border-2`}>
                                <div className="w-full flex flex-col justify-center items-center">
                                    <div className="flex items-center gap-2">
                                        <span> Booking Date</span>
                                    </div> 
                                    <span className="text-black text-xl font-bold">
                                        {ridess?.booking_travel_date}
                                        {/* {ridess?.booking_travel_date
  ? new Date(ridess.booking_travel_date)
      .toLocaleDateString("en-GB")
      .replaceAll("/", "-")
  : ""} */}

                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span> Estimated Travel Time /Distance</span>
                                    </div> 
                                    <span className="text-black text-xl font-bold">
                                        {ridess?.price_details_json?.estimated_time} ({ridess?.price_details_json?.estimated_km} KM)
                                    </span>
                                </div>
                            </div>
                </div>
            </div>}
            {ridess?.service_type?.toLowerCase() !== 'rental' && <div className="bg-[#005FE2] bg-opacity-10 dark:from-gray-800 dark:to-gray-900 p-4 rounded-2xl shadow-md w-[95%] transition-colors duration-300 mt-4">
                
                <div className="flex items-center gap-2 mb-4">
                    <FaBolt className="text-purple-600 dark:text-yellow-400 text-[14px]" />
                    <span className="text-[14px] font-semibold text-gray-600 dark:text-gray-100">Choose Your Ride</span>
                </div>
                {/* BOOKING TYPES FARE LISTS  */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cabData?.estimatedFareList?.map((ride, index) => {
                        const rideType = ride?.cab_type?.toLowerCase();
                        const bookedType = ridess?.booking_type?.toLowerCase();
                        const foundType = ridess?.op_cab_details_json?.cab_type?.toLowerCase();
                        const agreedType = checkAgree?.agree_cab_details_json?.cab_type?.toLowerCase();

                        // Border priority function
                        const getBorderClass = () => {
                            // if (rideType === bookedType) return "border-blue-600 dark:border-yellow-400"; // User booked cab
                            if (rideType === foundType) return "border-green-600 dark:border-green-700";       // Cab found
                            if ((rideType === agreedType && rideType === foundType && ridess?.is_agree === 1))
                                return "border-green-600 dark:border-green-700";                         // Agreed cab
                            if(selected === index) return "border-gray-500";
                            return "border-transparent hover:border-gray-300 dark:hover:border-gray-600";
                        };

                        return (
                            <div
                                key={index}
                                onClick={() => handleSetSelected(index)}
                                className={`relative flex flex-col items-start bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm cursor-pointer transition-all duration-200 border-2 ${getBorderClass()}`}
                            >
                                {/* CAB TYPE BADGE */}
                                {ride?.cab_type && (
                                    <div
                                        className={`absolute top-0 left-20 -translate-x-1/2 -translate-y-1/2 
                                            ${rideType === foundType
                                                ? "bg-gradient-to-r from-[#038e29] to-[#02f946]"
                                                : "bg-gradient-to-r from-blue-500 to-cyan-400"} 
                                            dark:bg-yellow-500 text-white dark:text-black text-[12px] px-4 py-0.5 rounded-full`}
                                    >
                                        {ride?.cab_type}
                                    </div>
                                )}

                                {/* AGREE / NA BUTTON */}
                                {rideType === foundType && (
                                    <button
                                        onClick={() => setNaOpen(true)}
                                        className={`absolute top-0 right-10 -translate-x-1/2 -translate-y-1/2 
                                            ${(ridess?.is_agree === 0 && ridess?.op_cab_status === 1)
                                                ? "bg-yellow-500"
                                                : "bg-gradient-to-r from-green-600 to-green-400"} 
                                                text-white px-4 py-1 rounded-full flex gap-2`}
                                    >
                                        <RiCheckDoubleFill className="text-white text-[20px]" />
                                        <span className="text-[12px] font-bold">
                                            {(ridess?.is_agree === 0 && ridess?.op_cab_status === 1)
                                                ? "NA"
                                                : "A"}
                                        </span>
                                    </button>
                                )}
                                {rideType === foundType && (
                                    <button
                                        onClick={() => handleRemoveCabFound()}
                                        className={`absolute top-0 right-0 -translate-x-1/2 -translate-y-1/2 bg-red-500 
                                                text-white px-4 py-1 rounded-full flex gap-2`}
                                    >
                                        <span className="text-[12px] font-bold">
                                            <FaTimes/>
                                        </span>
                                    </button>
                                )}

                                {/* CONTENT: CAB IMAGE + PRICE + COUPON DROPDOWN */}
                                <div className="w-full flex items-center gap-8 mb-3">
                                    {/* IMAGE */}
                                    <div className="ml-[7%] rounded-xl flex items-start">
                                        {ride?.cab_icon ? (
                                            <Image
                                                src={ride?.cab_icon}
                                                alt="Cab"
                                                width={120}
                                                height={120}
                                                className="object-contain rounded-xl"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                No Image
                                            </div>
                                        )}
                                    </div>

                                    {/* PRICE + COUPON */}
                                    <div className="flex items-start flex-col">
                                        <div className="flex items-start gap-1">
                                            <span className="font-bold text-gray-600 dark:text-gray-100 text-[14px]">
                                                {ride?.cab_type}
                                            </span>
                                            <button onClick={() => setShowModal(true)}>
                                                <AiTwotoneExclamationCircle className="text-gray-300 text-[18px]" />
                                            </button>
                                        </div>

                                        <div className="flex flex-col text-[12px]">
                                            <div className="flex items-center gap-4 justify-between">
                                            <span>Estimated Fare</span>
                                            <span
                                                className={`${ridess?.payment_details_json?.applyCoupon &&
                                                    ridess?.payment_details_json?.coupon_apply_details
                                                        ?.estimated_amount &&
                                                    rideType === foundType
                                                    ? "text-red-700 line-through"
                                                    : "text-purple-700 dark:text-yellow-400"
                                                    } text-[16px] font-bold`}
                                            >
                                                ₹{ride?.estimated_fare}
                                            </span>
                                            {ridess?.payment_details_json?.coupon_apply_details?.estimated_amount > 0 &&
                                                rideType === foundType && (
                                                    <span className="text-purple-700 dark:text-yellow-400 text-[16px] font-bold">
                                                        ₹{ridess?.payment_details_json?.coupon_apply_details?.estimated_amount}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4 justify-between">
                                            <span>Extra Per Km</span>
                                            <span className="text-[16px]">₹{ride?.extra_per_km || 0} /Km</span>
                                            </div>
                                            <div className="flex items-center gap-4 justify-between">
                                            <span>Extra Per Min</span>
                                            <span className="text-[16px]">₹{ride?.extra_minutes_charge || 0} /min</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* COUPON DROPDOWN */}
                                    {/* {(rideType === bookedType || rideType === foundType || selected === index) && (
                                        <div className="flex flex-col items-start relative w-[30%]">
                                            <button
                                                onClick={() =>
                                                    setOpenDropdownIndex(openDropdownIndex === index ? null : index)
                                                }
                                                className="w-full px-4 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md flex justify-between items-center text-gray-700 dark:text-gray-200 shadow-sm text-[12px] font-semibold"
                                            >
                                                {selectedCouponIndex === index && selectedCoupon
                                                    ? selectedCoupon?.coupon_code
                                                    : "Coupon"}
                                                <FiChevronDown className="ml-1 text-[12px] font-semibold" />
                                            </button>

                                            {openDropdownIndex === index && (
                                                <div className="absolute z-10 top-8 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-b-lg shadow-lg max-h-60 overflow-auto">
                                                    {coupon.map((item) => (
                                                        <div
                                                            key={item.id}
                                                            onClick={() => {
                                                                setSelectedCoupon(item);
                                                                setSelectedCouponIndex(index);
                                                                setOpenDropdownIndex(null);
                                                            }}
                                                            className="px-4 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-400 text-[12px]"
                                                        >
                                                            {item.coupon_type?.toLowerCase() === "master" && item?.coupon_code}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {(selectedCoupon && rideType === foundType) ||
                                                (rideType === foundType &&
                                                    ridess?.payment_details_json?.applyCoupon &&
                                                    userDetails?.couponCode) ? (
                                                <span className="text-[12px] text-green-600 font-semibold">
                                                    Coupon Applied
                                                </span>
                                            ) : null}
                                        </div>
                                    )} */}
                                </div>
                                {/* DATE AND TIME CODE  */}
                                <div className="w-full flex flex-wrap items-center gap-3 mt-3 ml-[7%]">
                                    <div className="bg-[#E2F6FA] dark:bg-gray-700 px-2 py-1 rounded-md">
                                        <span
                                            className={`text-[12px] dark:text-gray-300 ${((found?.toLowerCase() === ride?.cab_type.toLowerCase() && cabFounds?.booking_travel_date)) ? 'text-red-600 line-through' : 'text-gray-700'}`}
                                        >
                                            <b>{ridess?.booking_travel_date}</b> | <b>{ridess?.bookingTime}</b>
                                        </span>
                                    </div>
                                    {
                                        (found?.toLowerCase() === ride?.cab_type.toLowerCase() || ridess?.op_cab_details_json?.cab_type?.toLowerCase() === ride?.cab_type.toLowerCase())
                                        && (ridess?.op_cab_details_json?.booking_travel_date)
                                        && (
                                            <button className="bg-green-100 dark:bg-gray-700 px-3 py-1 rounded-md">
                                                <span className="text-[12px] text-green-600 dark:text-gray-300">
                                                    <b>{ridess?.op_cab_details_json?.booking_travel_date? `${moment(ridess?.op_cab_details_json?.booking_travel_date, "DD-MM-YYYY hh:mm").isValid()?moment(ridess?.op_cab_details_json?.booking_travel_date, "DD-MM-YYYY hh:mm").format("DD-MM-YYYY hh:mm A"):ridess?.op_cab_details_json?.booking_travel_date}`: "-"}</b>
                                                </span>
                                            </button>
                                        )
                                    }
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>}
            {/* FARE SECTION COMPONENT RENDER  */}
            <FareSection
                userDetails={userDetails}
                updatedFareData={cabData}
                modifyFareData={updateCabData}
                setUserDetails={setUserDetails}
                estimateFare={selectedCab}
                setCheckUpdate={setCheckUpdate}
                rideData={ridess}
            />
            {/* FARE SUMMARY OF THE SPECIFICE BOOKING TYPE  */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full max-w-md mx-auto border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Fare Summary</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-800 dark:hover:text-white text-sm">✕</button>
                        </div>
                        <div className="space-y-2 text-[14px]">
                            {[
                                { label: "Distance (KM)", value: `${userDetails?.estKm}` },
                                { label: "Time (Minutes)", value: `${userDetails?.reqTime}` },
                                { label: "Estimated Fare", value: `${userDetails?.estimatedFare}` },
                                { label: "Advance Amount", value: `${userDetails?.advanceAmount}` },
                                { label: "Rest Amount", value: `${userDetails?.remainingAmount}` },
                                { label: "Wallet", value: `${userDetails?.walletAmount}` },
                                { label: "Coupon", value: `${userDetails?.couponCode}` },
                            ].map((item, idx) => (
                                <div key={idx} className="flex justify-between text-gray-600 dark:text-gray-300">
                                    <span>{item.label}</span>
                                    <span className="font-medium text-gray-800 dark:text-white">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {showFareBreakUpModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full max-w-md mx-auto border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Fare Summary</h2>
                            <button onClick={() => setShowFareBreakUpModal(false)} className="text-gray-500 hover:text-gray-800 dark:hover:text-white text-sm">✕</button>
                        </div>
                        <div className="space-y-2 text-[14px]">
                            {[
                                { label: "Estimated Distance (KM)", value: `${ridess?.price_details_json?.estimated_km}` },
                                { label: "Estimated Time (H: M: S)", value: `${ridess?.price_details_json?.estimated_time}` },
                                { label: "Estimated Fare", value: `₹ ${ridess?.price_details_json?.estimated_fare}` },
                                { label: "Advance Amount", value: `₹ ${ridess?.price_details_json?.advance_amount}` },
                                { label: "Collected by Driver", value: `₹ ${ridess?.price_details_json?.collected_by_driver}` },
                                { label: "Extra per KM charge", value: `₹ ${ridess?.price_details_json?.extra_per_km}` },
                                { label: ridess?.service_type === "Oneway"? "Extra per Min charge": "Extra per Hour charge", value: `₹ ${ridess?.service_type === "Oneway"? ridess?.price_details_json?.extra_time_per_minutes: ridess?.price_details_json?.extra_time_per_hr}` },
                                // { label: "Waiting Charge", value: `₹ ${ridess?.price_details_json?.waitingCharge || 0}` },
                                // { label: "Parking Charge", value: `₹ ${ridess?.price_details_json?.parkingCharge || 0}` },
                                // { label: "Toll Charge", value: `₹ ${ridess?.price_details_json?.tollCharge || 0}` },
                                { label: "Coupon", value: `${userDetails?.couponCode}` },
                            ].map((item, idx) => (
                                <div key={idx} className="flex justify-between text-gray-600 dark:text-gray-300">
                                    <span>{item.label}</span>
                                    <span className="font-medium text-gray-800 dark:text-white">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {/* USER AGREE OR NOT AGREE MODAL  */}
            {naOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white dark:bg-gray-800 w-[300px] h-[220px] px-6 py-2 rounded-lg shadow-lg relative">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">User Confirmation</h2>
                            <button
                                className="text-red-600 hover:text-red-700 text-lg"
                                onClick={() => setNaOpen(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <span className="flex items-center justify-center text-md font-semibold text-gray-800 dark:text-white mb-2">User agree to reschedule date</span>
                        <label className="block text-[12px] font-medium text-gray-600 dark:text-gray-300">Agree</label>
                        <select
                            value={agreeOption}
                            onChange={(e) => setAgreeOption(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm"
                        >
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                        {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-blue-800 dark:bg-blue-900 dark:text-blue-200 shadow-sm text-sm font-medium mt-4">
                            <FaCalendarAlt className="text-[14px]" />
                            <span>{cabFounds?.booking_travel_date}</span>
                        </div> */}
                        <div className="mt-6 text-right">
                            <button
                                onClick={() => { agreeByUser() }}
                                className="px-6 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-400 dark:bg-yellow-500 text-white dark:text-black rounded-md hover:bg-green-700"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default RideSection;