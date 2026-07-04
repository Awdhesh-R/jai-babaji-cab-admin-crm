'use client';
import React, { useState, useEffect } from 'react'
import Image from "next/image";
import { LuCircleCheckBig, LuPackage, LuCalendar } from "react-icons/lu";
import { Phone, MapPin, User, FileText } from "lucide-react";
import { BsFileCheck } from "react-icons/bs";
import { MdPhone } from "react-icons/md";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { Calendar, Package } from "lucide-react";
import { apiClient } from '@/app/lib/apiClient';
import { LuFuel } from "react-icons/lu";

import { useRouter } from "next/navigation";
import { FaEdit } from 'react-icons/fa';

const DriverDetails = ({id}) => {
  const [driver, setDriver] = useState(null);

  const router = useRouter();

  const Ride = () => {
    router.push(`/driverForm/jaiBabajiCabDriverWallet/${id}`);
  }

   const wallet = () => {
    router.push(`/fleetManagement/TransactionHistoryWallet`);
  }

   const fuelhistroy = () => {
    router.push(`/rbFleetManagement/FuelHistory/${id}`);
  }

  const fetchDriver = async (id) => {
    const res = await apiClient("GET", `/rb_drivers/getDriverById/${id}`);
    if (res?.success !== false) {
      setDriver(res?.data);
    } else {
      console.error("API error:", res.message);
    }
  };
  
  useEffect(() => {
    if(id) fetchDriver(id);
  }, [id]);

  const handleEdit = () => {
    router.push(`/driverForm/DriverOnBoardingMain/${id}`)
  }

  console.log(driver);


    useEffect(() => {
  if (driver?.driverName && id) {
    sessionStorage.setItem(`driver-name-${id}`, driver.driverName);
    window.updateBreadcrumbName(id, driver.driverName);
  }
}, [driver, id]);

  return (
    <div className="flex flex-col items-center justify-center w-full mt-4 px-2 sm:px-4 md:px-6">

      {/* DRIVER DETAILS HEADER */}
      <div className="flex flex-col sm:flex-row items-center justify-between w-full bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-col justify-center mb-2 sm:mb-0">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Driver Profile Summary
          </h1>
          <p className="text-gray-500 text-sm">Comprehensive overview of driver details</p>
        </div>
        <button className="px-4 py-2 text-sm font-semibold text-blue-600 border border-blue-200 rounded-full hover:bg-blue-50">
          Profile Details
        </button>
      </div>

      {/* DRIVER DETAILS SECTION 1 */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full bg-white rounded-2xl shadow-md p-6 border-l-4 border-blue-500 mt-8">

        {/* Left: Profile Image */}
        <div className="relative">
          <Image
            src={`/${driver?.driverImage || "images/kumar.jpg"}`}
            alt="Driver"
            width={80}
            height={80}
            className="rounded-full border-4 border-[#2563EB] shadow w-20 h-20 sm:w-24 sm:h-24"
          />
          <span className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></span>
        </div>

        {/* Right: Info Section */}
        <div className="flex-1">
          <div className='flex justify-between w-full items-center'>
            <h2 className="text-2xl font-bold text-gray-900 break-words">{driver?.driverName ? driver?.driverName : "N/A"}</h2>
            <div onClick={handleEdit} className='text-blue-600 cursor-pointer' title='Edit Driver Details'>
                <FaEdit/>
            </div>
          </div>
          {/* <p className="text-gray-500 text-sm">{driver?.id ?? "N/A"}</p> */}

          {/* Status Row 1 */}
          <div className="flex flex-wrap gap-2 mt-3">
            <div className="flex items-center gap-1 px-2 sm:px-3 py-1 text-sm rounded-full bg-green-100 text-green-700">
              <LuCircleCheckBig />
              <span> Onboarding Status: Completed</span>
            </div>
            <div className="flex items-center gap-1 px-2 sm:px-3 py-1 text-sm rounded-full bg-purple-100 text-purple-700">
              <LuPackage />
              <span>Package Selected: Package 1 - ₹25,300</span>
            </div>
          </div>

          {/* Status Row 2 */}
          <div className="flex flex-wrap gap-2 mt-2">
            <div className="flex items-center gap-1 px-2 sm:px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700">
              <LuCalendar />
              <span>Submitted: 2025-08-01</span>
            </div>
            <div className="flex items-center gap-1 px-2 sm:px-3 py-1 text-sm rounded-full bg-green-500 text-white">
              <BsFileCheck />
              <span>Status: {driver?.status ? driver?.status : "N/A"}</span>
            </div>
            <div className="w-fit rounded-full px-3 py-1 bg-gradient-to-r from-[#F97316] to-[#93440D] text-white shadow-md">
              <button className="flex items-center gap-2">
                <div className="w-6 h-6 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
                  <Image src='/icons/walleticon.png' height={25} width={25} alt='wallet icon' />
                </div>
                <p onClick={Ride} className="text-[14px]">Ride</p>
              </button>
            </div>
               <div className="w-fit rounded-full px-3 py-1 bg-gradient-to-r from-[#F97316] to-[#93440D] text-white shadow-md">
              <button className="flex items-center gap-2">
                <div className="w-6 h-6 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
                  <Image src='/icons/walleticon.png' height={25} width={25} alt='wallet icon' />
                </div>
                <p onClick={wallet} className="text-[14px]">Wallet</p>
              </button>
            </div>

            <div className="w-fit rounded-full px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-800 text-white shadow-md">
              <button className="flex items-center gap-2">
                {/* <div className="w-6 h-6 bg-white bg-opacity-10 rounded-full flex items-center justify-center"> */}
                  {/* <Image src='/icons/walleticon.png' height={25} width={25} alt='wallet icon' /> */}
                  <LuFuel />
                {/* </div> */}
                <p onClick={fuelhistroy} className="text-[14px]">Fuel Histroy</p>
              </button>
            </div>
            
          </div>
        </div>
      </div>

      {/* DRIVER DETAILS SECTION 2 */}
      <div className="flex flex-col md:flex-row gap-4 w-full mt-8">

        {/* Personal Information */}
        <div className="bg-white rounded-2xl shadow-md px-5 pt-3 pb-2 flex-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-gradient-to-b from-[#4777F4] to-[#863EEC] p-2 rounded-xl text-white">
              <User size={18} />
            </div>
            <h2 className="font-semibold text-black">Personal Information</h2>
          </div>
          <div className='flex flex-col gap-1'>
            <div className='flex flex-col sm:flex-row justify-between'>
              <span className='text-gray-500 text-[14px]'>Mobile Number</span>
              <span className='flex text-gray-500 text-[14px]'>WhatsApp Number</span>
            </div>
            <div className='flex flex-col sm:flex-row justify-between gap-2'>
              <div className='flex items-center gap-1'>
                <MdPhone className='text-blue-600' />
                <span className='text-gray-900 text-[14px]'>+91 {driver?.driverMobile ?? "7714171414"}</span>
              </div>
              <div className='flex items-center gap-1'>
                <MdPhone className='text-green-500' />
                <span className='text-gray-900 text-[14px]'>+91 {driver?.driverWaMobile ?? "7714171414"}</span>
              </div>
            </div>

            <div className='flex rounded-full bg-green-50 ml-auto border border-green-100 mt-1'>
              <span className='text-[12px] text-green-600 px-4 py-1'>Same as Mobile</span>
            </div>

            <div className='flex flex-col sm:flex-row justify-between mt-4'>
              <span className='text-gray-500 text-[14px]'>Alternative Number</span>
              <span className='text-gray-500 text-[14px]'>Family Contact Number</span>
            </div>
            <div className='flex flex-col sm:flex-row justify-between gap-2'>
              <div className='flex items-center gap-1'>
                <MdPhone className='text-gray-600' />
                <span className='text-gray-900 text-[14px]'>N/A</span>
              </div>
              <div className='flex items-center gap-1'>
                <MdPhone className='text-orange-500' />
                <span className='text-gray-900 text-[14px]'>+91 7282069430</span>
              </div>
            </div>

            <div className='h-0.5 bg-gray-300 mt-3'></div>

            <span className='text-gray-600 mt-2 text-[15px]'>Address</span>
            <div className='flex gap-2 items-start'>
              <HiOutlineLocationMarker className='text-red-500 h-5 w-5' />
              <span className='text-[14px] break-words'>{driver?.driverAddress ?? "N/A"}</span>
            </div>

            <span className='text-gray-600 text-[15px] mt-2'>City</span>
            <div className='flex gap-2 items-start'>
              <HiOutlineLocationMarker className='text-blue-500 h-4 w-4' />
              <span className='text-[14px]'>{driver?.driverCity ?? "N/A"}</span>
            </div>
          </div>
        </div>

        {/* Identification */}
        <div className="bg-white rounded-2xl shadow-md p-5 flex-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-gradient-to-b from-[#AF4EE3] to-[#D42D88] p-2 rounded-xl text-white">
              <FileText size={18} />
            </div>
            <h2 className="font-semibold text-purple-700">Identification</h2>
          </div>
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-medium text-gray-600">Aadhar Card Number</p>
              <p>1234 5678 9012</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className='flex flex-col flex-1 items-center'>
                <span className="text-gray-400 text-xs text-center px-2">Aadhar Front Image</span>
                <div className="bg-gray-200 rounded-lg w-full h-24 mt-1"></div>
              </div>
              <div className='flex flex-col flex-1 items-center'>
                <span className="text-gray-400 text-xs text-center px-2">Aadhar Back Image</span>
                <div className="bg-gray-200 rounded-lg w-full h-24 mt-1"></div>
              </div>
            </div>
          </div>
        </div>

      </div>
      {/* Cab Information */}
      {driver?.cabDetails && <div className="flex flex-col md:flex-row gap-4 w-full mt-8">
        <div className="bg-white rounded-2xl shadow-md px-5 pt-3 pb-2 flex-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-gradient-to-b from-[#4777F4] to-[#863EEC] p-2 rounded-xl text-white">
              <User size={18} />
            </div>
            <h2 className="font-semibold text-black">Cab Details</h2>
          </div>
          <div className='flex flex-col gap-1'>
            <div className='flex flex-col sm:flex-row justify-between'>
              <span className='text-gray-500 text-[14px] w-full'>Cab Registration</span>
              <span className='flex text-gray-500 text-[14px] w-full justify-center'>Cab Model</span>
              <span className='text-gray-500 text-[14px] w-full text-right'>Service Type</span>
            </div>
            <div className='flex flex-col sm:flex-row justify-between gap-2'>
              <div className='flex items-center gap-1 w-full'>
                <span className='text-gray-900 text-[14px]'>{driver?.cabDetails?.cab_reg ?? "XXXXXX"}</span>
              </div>
              <div className='flex items-center gap-1 w-full justify-center'>
                <span className='text-gray-900 text-[14px]'>{driver?.cabDetails?.cab_model ?? "7714171414"}</span>
              </div>
              <div className='flex items-center gap-1 w-full justify-end'>
                <span className='text-gray-900 text-[14px]'>{driver?.cabDetails?.cab_service_type}</span>
              </div>
            </div>
            <div className='flex flex-col sm:flex-row justify-between mt-4'>
              <span className='text-gray-500 text-[14px] w-full'>Cab Name</span>
              <span className='text-gray-500 text-[14px] flex w-full justify-center'>Fuel Type</span>
              <span className='text-gray-500 text-[14px] w-full text-right'>Ride Status</span>
            </div>
            <div className='flex flex-col sm:flex-row justify-between gap-2'>
              <div className='flex items-center gap-1'>
                <span className='text-gray-900 text-[14px]'>{driver?.cabDetails?.cab_name}</span>
              </div>
              <div className='flex items-center gap-1'>
                <span className='text-gray-900 text-[14px]'>{driver?.cabDetails?.fuel_type}</span>
              </div>
              <div className='flex items-center gap-1'>
                <span className='text-gray-900 text-[14px]'>{driver?.cabDetails?.ride_status}</span>
              </div>
            </div>
          </div>
        </div>
      </div>}

      {/* LICENSE INFORMATION */}
      <div className="bg-white rounded-2xl shadow-md p-6 w-full mt-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-8 flex items-center justify-center rounded-full bg-green-100 text-green-600">
            <FileText size={18} />
          </div>
          <h2 className="font-semibold text-lg">License Information</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Driving License Number</p>
            <p className="font-medium text-gray-900">{driver?.drvLicenseNumber ?? "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Driving License Issue Date</p>
            <div className="flex items-center gap-1 text-orange-600 font-medium">
              <Calendar size={16} />
              <span>{driver?.drvLicenseDate ?? "04-09-2025"}</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          <div>
            <p className="text-sm text-gray-500 mb-2">License Front Image</p>
            <div className="h-28 rounded-lg bg-gray-200"></div>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-2">License Back Image</p>
            <div className="h-28 rounded-lg bg-gray-200"></div>
          </div>
        </div>
      </div>

      {/* PACKAGE SUMMARY */}
      <div className="bg-white rounded-2xl shadow-md p-6 w-full mt-8 mb-12 font-[Inter]">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-8 flex items-center justify-center rounded-full bg-orange-100 text-orange-600">
            <Package size={18} />
          </div>
          <h2 className="font-semibold text-lg">Selected Package Summary</h2>
        </div>
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between mb-1">
          <h3 className="text-xl font-semibold">
            Package {driver?.packageId ?? "N/A"} - <span className="text-gray-900">₹25,300</span>
          </h3>
          <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-600 font-medium mt-2 sm:mt-0">
            ✅ Active Plan
          </span>
        </div>
        <p className="text-gray-500 text-sm mb-6">
          ₹500/day base, ₹100 No Refusal, ₹100 Night Incentive
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-xl text-center">
            <p className="text-sm text-gray-600">Base Pay (Monthly)</p>
            <p className="text-blue-600 font-semibold text-lg">₹14,000.00</p>
          </div>
          <div className="bg-pink-50 p-4 rounded-xl text-center">
            <p className="text-sm text-gray-600">Incentives (Estimated)</p>
            <p className="text-pink-600 font-semibold text-lg">₹11,300</p>
          </div>
          <div className="bg-green-50 p-4 rounded-xl text-center">
            <p className="text-sm text-gray-600">Total Potential Earnings</p>
            <p className="text-green-600 font-semibold text-lg">₹25,300.00</p>
          </div>
        </div>
        <div className="text-center">
          <button className="text-blue-600 font-medium text-sm flex items-center justify-center gap-2 mx-auto hover:underline">
            View Full Package Terms →
          </button>
        </div>
      </div>

    </div>
  )
}

export default DriverDetails;
