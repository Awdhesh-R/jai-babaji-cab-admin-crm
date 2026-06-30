'use client'
import React, { useEffect, useState } from "react";
import { MdOutlineLightMode, MdAir, MdGpsFixed } from "react-icons/md";
import { FaStar, FaUserFriends, FaSuitcase, FaMusic, FaCaretDown } from 'react-icons/fa';
import { LuSunset, LuCar, LuUsers, LuLuggage, LuCircleCheckBig, LuShield, LuClock, LuDot } from "react-icons/lu";
import { CiCalendar } from "react-icons/ci";
import { CheckCircle, Loader } from 'lucide-react';
import CustomRentalModal from "../modals/CustomRentalModal";
import { apiClient } from "@/app/lib/apiClient";
import Image from "next/image";
import { toast } from "react-toastify";
const miniCab = process.env.NEXT_PUBLIC_MINI || "https://api.rodbez.com/uploads/cabs/mini-cab.png";
const sedanCab = process.env.NEXT_PUBLIC_SEDAN || "https://api.rodbez.com/uploads/cabs/sedan-cab.png";
const suvCab = process.env.NEXT_PUBLIC_SUV || "https://api.rodbez.com/uploads/cabs/suv-cab.png";

const RideRental = ({ rideDetails, setCheckUpdate }) => {
    const [selected, setSelected] = useState('');
    const [showSelectionPannel, setShowSelectionPannel] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showRentalModal, setShowRentalModal] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState([]);
    const [selectedCab, setSeletedCab] = useState();
    const [packageList, setPackageList] = useState([]);
    const [showCabLists, setShowCabLists] = useState(false);
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        const packageList = async () => {
            let payData = {
                // distance: rideDetails?.price_details_json?.estimated_km
                distance: 40
            };

            try {
                const response = await apiClient('POST', '/ride_management/getPackageList', JSON.stringify(payData), true);
                if (response?.success) {
                    setPackageList(response?.data?.data);
                }
            } catch (error) {
                console.error(error);
            }
        };
        // packageList();
        if(rideDetails?.near_ct_id) fetchRentalPackageListByCityId(rideDetails?.near_ct_id);
    }, [rideDetails?.near_ct_id]);

    const handleModifySelection = () => {
        setShowSelectionPannel(true);
    }

    const fetchRentalPackageListByCityId = async (city_id) => {
        try {
            setLoading(true);
            const response = await apiClient("GET", `/rental_package/get-rental-package-price-details-by-city_id/${city_id}`);
            if (response.status) {
                // toast.success(response.message);
                setPackageList(response.data);

            } else {
                toast.error(response.message);
                setPackageList([]);
            }
        } catch (error) {
            setPackageList([]);
        } finally {
            setLoading(false);
        }
    }

    const updateRentalDetails = async () => {
        try {
            const payData = {
                package_id: selectedPackage.id,
                booking_type: selectedCab.cab_type_name,
                cab_type_id: selectedCab.cab_type_id,
                price_details_json: {
                    ...rideDetails?.package_price_json,
                    estimated_fare: selectedCab.Base_price,
                    estimated_km: selectedPackage.package_km,
                    estimated_time: selectedPackage.package_time,
                    extra_per_km: selectedCab.extra_per_km,
                    extra_time_per_hr: selectedCab.extra_time_per_hr
                }
            }
            const response = await apiClient('PUT', `/ride_management/updateRideDetails/${rideDetails?.urid}`, JSON.stringify(payData), true);
            if (response.success) {
                setIsOpen(false);
                setMessage(response);
                toast.success(response.message);
                console.log('messssss', response);
                setCheckUpdate((prev) => !prev);
            }
            if (!response.success) {
                toast.error(response.message);
                console.log("response", response)
                setMessage(response);
            }
        } catch (err) {
            console.error('Update failed:', err);
        }
    } 

    useEffect(() => {
        if (packageList?.length > 0 && !selected) {
            const pkg = packageList.find(pkg=> pkg.id == rideDetails?.package_id);
            setSelected(pkg.package_name);
            setSelectedPackage(pkg);
            console.log(pkg)
            const cab = pkg?.package_price_json?.find(cab=>cab.cab_type_name.toLowerCase() === rideDetails?.booking_type?.toLowerCase());
            console.log(cab)
            setSeletedCab(cab);
            if(cab) setShowCabLists(true);
        }
    }, [packageList, selected, rideDetails]);

    return (
        <div className="bg-white dark:bg-gray-900 shadow-md border dark:border-slate-700 my-4 rounded-md transition-all duration-300 ease-in-out">
            {/* TOP SECTION  */}
            <div
                className="flex md:flex-row items-start md:items-center justify-between gap-4 rounded-t-md px-4 py-3 bg-gradient-to-r from-[#F0F5FD] to-[#B9EAFF] dark:from-[#1E1F2D] dark:to-[#323B50]">
                <div className="flex items-center gap-4 flex-1">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-400 dark:bg-[#EADFFA] p-2 rounded-lg shadow-lg">
                        <Image src="/icons/journey.svg" alt="Journey" width={20} height={20} />
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-[14px] font-semibold text-gray-900 dark:text-white">{"Rental Package Details"}</h2>
                        {/* <p className="text-[12px] text-gray-600 dark:text-gray-300">{"rideDetails?.user_details_json?.book_contact"}</p> */}
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <div className={`inline-flex items-center gap-2 px-4 py-1 rounded-md border border-blue-300 dark:border-yellow-800 dark:bg-yellow-950 text-blue-600 dark:text-yellow-200 text-[12px] font-semibold shadow-sm`}>
                        <span className="capitalize">{rideDetails?.service_type}</span>
                    </div>
                </div>

                <button
                    className="mt-4 md:mt-0 text-black dark:text-gray-300"
                    onClick={() => setIsActive(!isActive)}
                >
                    <FaCaretDown className={`text-2xl transform transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`} />
                </button>
            </div>
            {(isActive && rideDetails?.service_type?.toLowerCase() === 'rental') && (
                <div>
                    {/* BOOKING SUMMARY */}
                    {rideDetails?.service_type?.toLowerCase() === 'rental' && (
                        <div className="bg-[#F4F7FE] p-4 rounded-md">
                            {/* Header */}
                            <div className="mb-6 flex justify-between items-start">
                                <div className="flex items-start flex-col">
                                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#2563EB] to-[#9333EA]">Booking Summary</span>
                                    <p className="text-sm text-gray-500">Review your selection and confirm booking</p>
                                </div>
                            </div>

                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Vehicle Card */}
                                <div className="bg-white rounded-md shadow-md p-5">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="bg-gradient-to-r from-[#3B82F6] to-[#A855F7] p-2 rounded-md">
                                            <LuCar className="text-white text-[18px]" />
                                        </div>
                                        <span className="text-[16px] font-medium text-black rounded-full">Selected Vehicle</span>
                                    </div>
                                    <div className="relative w-full flex justify-center rounded-lg bg-[#E2F6FB]">
                                        <Image
                                            src={rideDetails?.booking_type?.toLowerCase() === 'mini' ? miniCab : rideDetails?.booking_type?.toLowerCase() === 'sedan' ? sedanCab : suvCab}
                                            width={100}
                                            height={100}
                                            alt="Vehicle"
                                            className="object-contain rounded-md"
                                        />
                                        <span className="text-sm font-semibold bg-white text-black px-2 rounded-full absolute top-2 right-2">⭐ 4.8</span>
                                    </div>
                                    <div className="text-center mt-1">
                                        <h3 className="text-lg font-bold text-gray-800">{selected}</h3>
                                        <p className="text-sm text-gray-500 capitalize">{rideDetails?.booking_type}</p>
                                    </div>

                                    <div className="flex justify-between items-center gap-2 mt-1">
                                        <div className="bg-[#EFF6FF] rounded-md flex flex-1 items-center justify-center flex-col py-4">
                                            <LuUsers className="text-[#2563EB]" />
                                            <p className="text-xs text-gray-500">Capacity</p>
                                            <p className="text-sm font-semibold text-[#1E40AF]">{selectedCab?.totalPerson} Seats</p>
                                        </div>
                                        <div className="bg-[#FAF5FF] rounded-md flex flex-1 items-center justify-center flex-col py-4">
                                            <LuLuggage className="text-[#9333EA]" />
                                            <p className="text-xs text-gray-500">Luggage</p>
                                            <p className="text-sm font-semibold text-[#9333EA]">{selectedCab?.totalLuggageCount} Bags</p>
                                        </div>
                                    </div>

                                    <ul className="mt-1 space-y-1 text-sm text-green-600">
                                        <li className="flex items-center gap-1">
                                            <LuCircleCheckBig className="text-[#22C55E] text-[16px]" />
                                            <span className="text[14px] text-[#374151]">AC</span>
                                        </li>
                                        <li className="flex items-center gap-1">
                                            <LuCircleCheckBig className="text-[#22C55E] text-[16px]" />
                                            <span className="text[14px] text-[#374151]">GPS</span>
                                        </li>
                                        <li className="flex items-center gap-1">
                                            <LuCircleCheckBig className="text-[#22C55E] text-[16px]" />
                                            <span className="text[14px] text-[#374151]">Music System</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Package Details */}
                                <div className="bg-white rounded-md shadow-md p-5">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-gradient-to-r from-[#22C55E] to-[#10B981] p-2 rounded-md">
                                            <LuClock className="text-white text-[18px]" />
                                        </div>
                                        <span className="text-[16px] font-medium text-black rounded-full">Package Details</span>
                                    </div>

                                    <div className="flex flex-col gap-2 bg-[#D1FAE5] p-2 mt-2 rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-2xl font-bold text-gray-800">{selectedPackage?.package_time} Hrs</h3>
                                            <span className="bg-[#16A34A] text-white text-xs px-2 py-1 rounded-full">{selectedPackage?.package_km}km</span>
                                        </div>
                                        <p className="flex items-start text-sm text-gray-500 mb-3">Perfect for city tours</p>
                                    </div>

                                    <div className="mt-4 text-sm space-y-4 border border-[#E5E7EB] shadow-sm rounded-md p-2">
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-blue-600">• Base fare</span>
                                                <span className="font-semibold text-gray-700">₹{selectedCab?.Base_price}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-orange-600">• Extra km charge</span>
                                                <span className="font-semibold text-gray-700">₹{selectedCab?.extra_per_km}/km</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-purple-600">• Extra hour charge</span>
                                                <span className="font-semibold text-gray-700">₹{selectedCab?.extra_time_per_hr}/hr</span>
                                            </div>
                                        </div>
                                        {/* <div className="">
                                            <div className="pt-2 border-t border-gray-200 flex justify-between">
                                                <span className="text-black font-semibold">Total Amount</span>
                                                <div className="flex items-end justify-between flex-col">
                                                    <span className="text-green-600 text-[18px] font-semibold">₹{rideDetails?.price_details_json?.actual_travel_price}</span>
                                                    <p className="text-[12px] text-gray-400">Inclusive of base fare</p>
                                                </div>
                                            </div>
                                        </div> */}
                                    </div>
                                </div>

                                {/* Important Info */}
                                <div className="bg-white rounded-md shadow-md p-5">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-gradient-to-r from-[#F59E0B] to-[#F97316] p-2 rounded-md">
                                            <LuShield className="text-white text-[18px]" />
                                        </div>
                                        <span className="text-[16px] font-medium text-black rounded-full">Important Info</span>
                                    </div>

                                    <div className="mb-3 mt-2 bg-[#FFF9EC] px-4 py-2 rounded-md border border-[#FDE68A]">
                                        <div className="flex items-start mb-1 gap-1">
                                            <div className="h-6 w-6 rounded-full text-white bg-[#F59E0B]">!</div>
                                            <div className="flex flex-col items-start gap-1">
                                                <span className="text-sm font-medium text-yellow-600 ">Toll & Parking</span>
                                                <span className="text-xs text-[#B45309]">Charges will be added </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-3 mt-2 bg-[#EFF5FF] px-4 py-2 rounded-md border border-[#FDE68A]">
                                        <div className="flex items-start mb-1 gap-1">
                                            <div className="h-6 w-6 rounded-full text-white bg-[#3B82F6]">🌙</div>
                                            <div className="flex flex-col items-start gap-1">
                                                <span className="text-sm font-medium text-[#1E40AF] ">Night Charges</span>
                                                <span className="text-xs text-[#1D4ED8]">₹200 extra after 10:00 PM</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-3 mt-2 bg-[#FFF9EC] px-4 py-2 rounded-md border border-[#FDE68A]">
                                        <div className="flex items-start mb-1 gap-1">
                                            <div className="h-6 w-6 rounded-full text-white bg-[#22C55E]">🌐</div>
                                            <div className="flex flex-col items-start gap-1">
                                                <span className="text-sm font-medium text-[#166534] ">Interstate Tax</span>
                                                <span className="text-xs text-[#15803D]">₹300 if crossing state borders</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <div className="mb-1 flex items-center gap-1">
                                            <LuCircleCheckBig className="text-[#22C55E] text-[16px]" />
                                            <span className="text-sm font-medium text-black">What is Included</span>
                                        </div>
                                        <ul className="text-xs text-gray-600 list-disc ml-5 space-y-1">
                                            <li className="flex items-center gap-1">
                                                <LuDot className="text-gray-500" />
                                                <span className="text[14px] text-[#374151]">Professional verified driver</span>
                                            </li>
                                            <li className="flex items-center gap-1">
                                                <LuDot className="text-gray-500 text-[16px]" />
                                                <span>Fuel & maintenance covered</span>
                                            </li>
                                            <li className="flex items-center gap-1">
                                                <LuDot className="text-gray-500" />
                                                <span>24/7 customer support</span>
                                            </li>
                                            <li className="flex items-center gap-1">
                                                <LuDot className="text-gray-500" />
                                                <span>GPS tracking & safety</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* MODIFY RENTAL DATA */}
                            <div className="flex flex-col md:flex-row justify-between items-center mt-10 bg-white p-4 rounded-xl shadow-md">
                                <div className="text-xl font-bold text-indigo-600 mb-2 md:mb-0 flex flex-col items-start">
                                    ₹{rideDetails?.price_details_json?.estimated_fare}
                                    <span className="text-sm font-normal text-gray-500">Total estimated fare</span>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={handleModifySelection} className="px-4 py-1.5 rounded-md border border-gray-400 text-black hover:bg-gray-100">
                                        Modify Selection
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* RENTAL PACKAGES  */}
                    {showSelectionPannel && ( !loading ?<div className="p-4 bg-[#F0F3FF] rounded-md m-4 transition-all duration-300 ease-in-out">
                        <h2 className="text-2xl font-semibold text-gray-800">Select Your Rental Package</h2>
                        <p className="text-gray-500 mb-2">
                            Choose from our carefully crafted packages or create a custom plan that fits your schedule perfectly.
                        </p>

                        {/* RENTAL PACKAGES  */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {packageList?.map((pkg, index) => {
                                const isSelected = selectedPackage.id === pkg.id;
                                return (
                                    <div
                                        key={index}
                                        className={`flex items-center justify-center flex-col rounded-md shadow-md p-6 bg-white relative transition-all ${isSelected ? 'border-2 border-blue-500 scale-[1.02]' : 'border border-transparent'}`}
                                    >
                                        <div className={`text-3xl mb-3 text-white rounded-full p-2 bg-gradient-to-r from-[#3B82F6] to-[#6366F1]`}><MdOutlineLightMode /></div>
                                        <h3 className="text-xl font-bold text-gray-800">{pkg.package_name}</h3>
                                        <p className="text-gray-600">{pkg.package_km}km</p>
                                        <button
                                            className={`mt-6 w-full rounded-md py-2 text-sm font-medium ${isSelected
                                                ? 'bg-blue-100 text-blue-700 cursor-default'
                                                : 'bg-white text-gray-700 hover:bg-gray-100 border'
                                                }`}
                                            onClick={() => {
                                                setSelectedPackage(pkg);
                                                setSelected(pkg.package_name);
                                                setShowCabLists(true);
                                            }}
                                            disabled={isSelected}
                                        >
                                            {isSelected ? 'Selected' : 'Select'}
                                        </button>
                                    </div>
                                );
                            })}
                            {/* <div className="flex items-center justify-center flex-col rounded-md shadow-md p-6 bg-gradient-to-br from-[#fdf0f4] to-[#fbefff] relative transition-all border border-transparent">
                                <div className="flex justify-center items-center mb-2">
                                    <div className="bg-gradient-to-r from-[#2563EB] to-[#9333EA] p-3 rounded-full">
                                        <CiCalendar className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900">Custom</h2>
                                <p className="text-sm text-gray-500">Tailored to your needs</p>

                                <button
                                    onClick={() => {
                                        setShowRentalModal(true);
                                        setShowCabLists(true);
                                    }}
                                    className={`mt-6 w-full rounded-md py-2 text-sm font-medium ${showRentalModal ? 'bg-blue-100 text-blue-700 cursor-default' : 'bg-white text-gray-700 hover:bg-gray-100 border'}`}
                                >
                                    {showRentalModal ? 'Selected' : 'Select'}
                                </button>
                            </div> */}
                        </div>

                        {/* CAB LIST ACCORDING TO SELECTED PACKAGE  */}
                        {showCabLists && (
                            <section className="py-4 bg-gradient-to-b from-white to-blue-50 mt-6 rounded-md">
                                <div className="max-w-6xl mx-auto px-4">
                                    <h2 className="text-2xl font-semibold text-gray-800">Choose Your Vehicle</h2>
                                    <p className="text-sm text-gray-500 mb-2">Select from our premium fleet of well-maintained vehicles</p>

                                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                                        {selectedPackage?.package_price_json?.map((cab, index) => (
                                            <div key={index} className={`bg-white rounded-md shadow-md hover:shadow-lg p-4 w-full max-w-xs transition transform hover:scale-[1.02] ${selectedCab?.cab_type_name?.toLowerCase() === cab.cab_type_name?.toLowerCase() ? 'border-2 border-blue-500 scale-[1.02]' : 'border border-transparent'}`}>
                                                <div className="relative bg-blue-100 h-32 rounded-md mb-4 flex items-center justify-center">
                                                    <span className="absolute top-2 right-2 bg-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                                        <FaStar className="text-[14px] text-[#EAB308]" /> 4.5
                                                    </span>
                                                    <div className="w-full h-full flex items-center justify-center overflow-hidden rounded-md">
                                                        <Image
                                                            src={cab?.cab_type_name?.toLowerCase() === 'mini' ? miniCab : rideDetails?.booking_type?.toLowerCase() === 'sedan' ? sedanCab : suvCab}
                                                            width={100}
                                                            height={100}
                                                            alt="vehicle"
                                                            className="w-[70%] h-[80%] object-contain"
                                                        />
                                                    </div>
                                                </div>

                                                <h3 className="font-semibold text-lg">{cab?.cab_type_name}</h3>
                                                <p className="text-sm text-gray-500">{cab?.cab_caption}</p>

                                                {/* <div className="flex items-center text-[12px] text-[#4B5563] gap-4 mt-2">
                                                    <div className="flex items-center gap-1"><LuUsers className="text-[18px]" /> {Number(cab?.booking_details_json?.adult) + Number(cab?.booking_details_json?.child)} seats</div>
                                                    <div className="flex items-center gap-1"><LuLuggage className="text-[18px]" /> {Number(cab?.booking_details_json?.bigLaggage) + Number(cab?.booking_details_json?.smallLaggage)} bags</div>
                                                </div> */}

                                                <div className="mt-4 flex justify-between items-center">
                                                    <p className="bg-gradient-to-r from-[#2563EB] to-[#9333EA] bg-clip-text text-transparent font-semibold text-lg">₹{cab?.Base_price}</p>
                                                    <button className="px-4 py-2 text-sm bg-gradient-to-r from-[#3B82F6] to-[#A855F7] text-white rounded-md hover:opacity-90" onClick={() => {
                                                        if(selectedCab?.cab_type_name?.toLowerCase() !== cab.cab_type_name?.toLowerCase()){
                                                            setSeletedCab(cab);
                                                            updateRentalDetails();
                                                        } 
                                                    }}>
                                                        {`${selectedCab?.cab_type_name?.toLowerCase() === cab.cab_type_name?.toLowerCase() ? "Booked": "Book Now"}`}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        )}

                        {showRentalModal && <CustomRentalModal onClose={() => setShowRentalModal(false)} />}
                    </div>
                    :<div className="flex justify-between items-center min-h-[40px]">
                        <Loader className="animate-spin"/>
                    </div> )}
                </div>
            )}
        </div>
    );
}

export default RideRental;