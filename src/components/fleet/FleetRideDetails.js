"use client";
import React, { useState } from "react";
import { IoHomeOutline } from "react-icons/io5";
import { LuShield } from "react-icons/lu";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import {
  FaCheckCircle,
  FaClock,
  FaCarSide,
  FaUserFriends,
  FaSuitcaseRolling,
  FaWallet,
  FaInfoCircle,
  FaChartLine,
} from "react-icons/fa";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { FiSend, FiTrendingUp } from "react-icons/fi";
import { GoStarFill } from "react-icons/go";
import { CiStar } from "react-icons/ci";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

const cardData = [
  {
    label: "Ride Type",
    value: "Oneway",
    icon: <FaCarSide className="text-white text-lg" />,
  },
  {
    label: "Vehicle Class",
    value: "Sedan",
    icon: <FaCarSide className="text-white text-lg" />,
  },
  {
    label: "Passengers",
    value: "3",
    icon: <FaUserFriends className="text-white text-lg" />,
  },
  {
    label: "Luggage",
    value: "2 Bags",
    icon: <FaSuitcaseRolling className="text-white text-lg" />,
  },
];

const topSummary = [
  {
    label: "Estimated Fare",
    value: "₹750",
    icon: <FaInfoCircle className="text-blue-600" />,
    bg: "bg-white",
    text: "text-gray-900",
  },
  {
    label: "Final Amount",
    value: "₹920",
    icon: <FaWallet className="text-white" />,
    bg: "bg-gradient-to-r from-[#6366F1] to-[#4F46E5]",
    text: "text-white",
  },
  {
    label: "Total Collected",
    value: "₹920",
    icon: <FaCheckCircle className="text-white" />,
    bg: "bg-gradient-to-r from-[#10B981] to-[#059669]",
    text: "text-white",
  },
  {
    label: "rodYaan Fee",
    value: "₹92",
    icon: <FaChartLine className="text-white" />,
    bg: "bg-gradient-to-r from-[#FB923C] to-[#F97316]",
    text: "text-white",
  },
];

const breakdown = [
  { label: "Platform Fee", value: "₹25", description: "Service charge" },
  { label: "Extra Time", value: "₹50", description: "Additional waiting" },
  { label: "Extra Distance", value: "₹20", description: "Beyond estimate" },
  { label: "Taxes & Fees", value: "₹46", description: "Government taxes" },
];

const FleetRideDetails = () => {
  return (
    <div className="space-y-2">
      <div className="border border-[#babbba] p-2 flex items-center gap-2 bg-white dark:bg-gray-900 mt-1">
        <IoHomeOutline className="text-gray-400" size={18} />
        <MdKeyboardDoubleArrowLeft className="text-gray-400 w-4 h-4" />
        <span className="text-sm text-gray-600 font-medium">
          Fleet Dashboard
        </span>
        <MdKeyboardDoubleArrowLeft className="text-gray-400 w-4 h-4" />
        <Link
          href="#"
          className="text-sm text-gray-600 font-medium hover:underline hover:text-blue-600"
        >
          Active Fleets Kumar Murari
        </Link>
        <MdKeyboardDoubleArrowLeft className="text-gray-400 w-4 h-4" />
        <Link
          href="#"
          className="text-sm text-gray-600 font-medium hover:underline hover:text-blue-600"
        >
          Total Cabs
        </Link>
        <MdKeyboardDoubleArrowLeft className="text-gray-400 w-4 h-4" />
        <Link
          href="#"
          className="text-sm text-gray-600 font-medium hover:underline hover:text-blue-600"
        >
          Cab Details - BR 12 AB 1234
        </Link>
        <MdKeyboardDoubleArrowLeft className="text-gray-400 w-4 h-4" />
        <Link
          href="#"
          className="text-sm text-gray-600 font-medium hover:underline hover:text-blue-600"
        >
          Cab Details - BR 12 AB 1234 Ride-Lists
        </Link>
        <MdKeyboardDoubleArrowLeft className="text-gray-400 w-4 h-4" />
        <Link
          href="#"
          className="text-sm text-blue-600 font-medium hover:underline"
        >
          ID: 1752814693013
        </Link>
      </div>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
        {/* Top Header */}
        <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 shadow-md flex items-center justify-center">
          <div className="flex justify-between flex-wrap w-full max-w-5xl">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold flex items-center">
                <span className="bg-white/20 p-2 rounded-md">📄</span>
              </h1>
              <div className="flex flex-col">
                <span className="text-[18px] font-bold">Ride Details</span>
                <span className="text-[12px]">Trip Reference: RD001234</span>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 bg-green-100 text-green-600 px-3 py-1 rounded-full">
                  <FaCheckCircle className="text-green-500 text-sm font-semibold" />
                  <span className="text-[12px]">Completed</span>
                </span>
                <div>
                  <p className="text-[12px]">Booking Date: 15 Jan 2024</p>
                  <span className="text-[12px]">Time: 14:30 - 15:45</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trip Overview */}
        <div className="w-full max-w-5xl bg-white rounded-b-lg shadow-md -mt-4">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-5 py-3 mb-6 flex items-center gap-2">
            <div className="bg-white/20 p-2 rounded-md">
              <FiSend className="text-lg" />
            </div>
            <h2 className="text-lg font-semibold">Trip Overview</h2>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-8 m-4">
            {/* Origin */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 text-sm font-semibold text-blue-700 mb-1">
                <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                ORIGIN
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Darbhanga Tower
              </h3>
              <p className="text-sm text-gray-600 flex items-center justify-center md:justify-start gap-1 mt-1">
                <FaClock /> Departure: 14:30
              </p>
            </div>

            {/* Route */}
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-600 text-white rounded-full p-4 shadow-lg relative">
                <FiSend size={20} />
                <span className="absolute top-0 right-0 h-4 w-4 bg-green-500 rounded-full border-2 border-white" />
              </div>
              <div className="mt-2">
                <div className="text-blue-700 font-bold">45.2 km</div>
                <div className="text-xs text-gray-500">1h 15m</div>
              </div>
            </div>

            {/* Destination */}
            <div className="flex-1 text-center md:text-right">
              <div className="flex items-center justify-center md:justify-end gap-2 text-sm font-semibold text-red-700 mb-1">
                <span className="h-2 w-2 bg-red-500 rounded-full"></span>
                DESTINATION
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Madhubani Harlakhi
              </h3>
              <p className="text-sm text-gray-600 flex items-center justify-center md:justify-end gap-1 mt-1">
                <FaClock /> Arrival: 15:45
              </p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-5xl bg-gray-100 flex items-center justify-between gap-3 py-4">
          {cardData.map((item, index) => (
            <div
              key={index}
              className="w-1/4 bg-white rounded-md shadow-md p-5 flex justify-between items-center hover:shadow-lg transition"
            >
              <div>
                <p className="text-xs text-blue-600 font-semibold uppercase">
                  {item.label}
                </p>
                <p className="text-lg font-semibold text-gray-800 mt-1">
                  {item.value}
                </p>
              </div>
              <div className="bg-blue-600 p-3 rounded-full shadow-lg">
                {item.icon}
              </div>
            </div>
          ))}
        </div>

        {/* FINANCIAL SUMMARY  */}
        <div className="w-full max-w-5xl pb-4 bg-white rounded-md">
          {/* Header */}
          <div className="rounded-t-md bg-gradient-to-r from-[#3B82F6] to-[#6366F1] text-white p-4 flex items-center gap-3 text-lg font-semibold">
            <div className="bg-white/20 p-2 rounded-md">
              <FaWallet className="text-2xl" />
            </div>
            Financial Summary
          </div>

          {/* Top Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-white">
            {topSummary.map((item, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg shadow ${item.bg} flex justify-between items-center`}
              >
                <div>
                  <p className="text-xs font-semibold uppercase text-blue-600">
                    {item.label}
                  </p>
                  <p className={`text-xl font-bold ${item.text}`}>
                    {item.value}
                  </p>
                </div>
                <div
                  className={`p-2 rounded-full bg-white bg-opacity-30 shadow-inner`}
                >
                  {item.icon}
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Breakdown */}
          <div className="mt-6 border-b border-gray-300 pb-8">
            <div className="border-l-4 border-blue-600 ml-4">
              <h3 className="text-md font-semibold text-blue-700 mb-4 ml-2">
                Detailed Breakdown
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ml-4 mr-4">
              {breakdown.map((item, index) => (
                <div
                  key={index}
                  className="p-4 bg-white rounded-md shadow-md border border-gray-200"
                >
                  <p className="text-xs font-semibold text-blue-600 uppercase">
                    {item.label}
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {item.value}
                  </p>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Distance & Rate Analysis */}
          <div className="mt-6">
            <div className="border-l-4 border-blue-600 ml-4">
              <h3 className="text-md font-semibold text-blue-700 mb-4 ml-2">
                Distance & Rate Analysis
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ml-4 mr-4">
              <div className="p-4 bg-gradient-to-r from-[#EFF6FF] to-[#E0E7FF] rounded-md shadow-md border border-gray-200 flex items-center justify-center flex-col">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#4F46E5] flex items-center justify-center">
                  <FiTrendingUp className="text-white text-[14px]" />
                </div>
                <p className="text-xs font-semibold text-[#1D4ED8] uppercase">
                  Distance Travelled
                </p>
                <p className="text-xl font-bold text-black">47.8</p>
                <p className="text-sm text-gray-500">vs 45.2 km estimated</p>
              </div>
              <div className="p-4 bg-gradient-to-r from-[#ECFDF5] to-[#CCFBF1] rounded-md shadow-md border border-gray-200 flex items-center justify-center flex-col">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#10B981] to-[#0D9488] flex items-center justify-center">
                  <FaWallet className="text-white text-[14px]" />
                </div>
                <p className="text-xs font-semibold text-[#047857] uppercase">
                  Rate Per Kilometer
                </p>
                <p className="text-xl font-bold text-gray-900">₹18.5</p>
                <p className="text-sm text-gray-500">Standard rate applied</p>
              </div>
              <div className="p-4 bg-gradient-to-r from-[#FAF5FF] to-[#E0E7FF] rounded-md shadow-md border border-gray-200 flex items-center justify-center flex-col">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#A855F7] to-[#4F46E5] flex items-center justify-center">
                  <IoMdInformationCircleOutline className="text-white text-[20px]" />
                </div>
                <p className="text-xs font-semibold text-[#7E22CE] uppercase">
                  Start & End Meter Reading
                </p>
                <div className="flex items-center justify-center relative">
                  <div>
                    <Image
                      src="/images/Meter.png"
                      alt="Meter Reading"
                      width={140}
                      height={130}
                    />
                  </div>
                  <p className="absolute text-[12px] bg-white font-bold text-gray-900 bottom-2 px-2 rounded-md">
                    120 km
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SERVICE PROVIDER DETAILS  */}
        <div className="w-full max-w-5xl mt-8 bg-white rounded-xl">
          <div className="rounded-t-xl bg-gradient-to-r from-[#3B82F6] to-[#6366F1] text-white p-4 flex items-center gap-3 text-lg font-semibold">
            <div className="bg-white/20 p-2 rounded-md">
              <LuShield className="text-2xl text-white" />
            </div>
            Service Provider Details
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 p-4">
            {/* Driver Information */}
            <div className="bg-white shadow rounded-xl p-5">
              <div className="border-l-4 border-blue-600 pl-3 mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Driver Information
                </h3>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <Image
                  src="/images/driverplaceholderimg.png"
                  alt="driver image"
                  height={60}
                  width={60}
                  className="rounded-full object-cover border-2 border-blue-500"
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800 text-sm">
                    Abhishek Kumar
                  </span>
                  <div className="flex items-center gap-1 text-[#FBBF24]">
                    {[...Array(5)].map((_, i) => (
                      <GoStarFill key={i} />
                    ))}
                    <span className="text-[13px] text-gray-700 ml-1">5.0</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-blue-100 p-3 rounded-md">
                  <span className="text-xs text-gray-500 font-semibold block">
                    Total Rides
                  </span>
                  <span className="text-sm text-gray-700 font-medium">
                    +91 8825114911
                  </span>
                </div>
                <div className="bg-blue-100 p-3 rounded-md">
                  <span className="text-xs text-gray-500 font-semibold block">
                    Location
                  </span>
                  <span className="text-sm text-gray-700 font-medium">
                    +91 8825114911
                  </span>
                </div>
              </div>

              <div className="bg-blue-100 rounded-md flex items-center justify-between px-4 py-2 mb-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FaCarSide />
                  <span>Contact Number</span>
                </div>
                <span className="text-sm text-gray-800 font-semibold">
                  +91 8825114911
                </span>
              </div>
              <div className="bg-blue-100 rounded-md flex items-center justify-between px-4 py-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <LuShield />
                  <span>Licence Number</span>
                </div>
                <span className="text-sm text-gray-800 font-semibold">
                  DL-1420110012345
                </span>
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="bg-white shadow rounded-xl p-5">
              <div className="border-l-4 border-blue-600 pl-3 mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Vehicle Information
                </h3>
              </div>
              <div className="space-y-3">
                <div className="bg-blue-100 rounded-md flex items-center justify-between px-4 py-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <FaCarSide />
                    <span>Registration Number</span>
                  </div>
                  <span className="text-sm text-gray-800 font-semibold">
                    BR 01 AB 1234
                  </span>
                </div>
                <div className="bg-blue-100 rounded-md flex items-center justify-between px-4 py-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <FaCarSide />
                    <span>Cab Type</span>
                  </div>
                  <span className="text-sm text-gray-800 font-semibold">
                    Sedan
                  </span>
                </div>
                <div className="bg-blue-100 rounded-md flex items-center justify-between px-4 py-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <div className="h-4 w-4 rounded-full bg-white border border-blue-400"></div>
                    <span>Color</span>
                  </div>
                  <span className="text-sm text-gray-800 font-semibold">
                    White
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CUSTOMER FEEDBACK */}
        <div className="w-full max-w-5xl mt-8 bg-white rounded-xl">
          <div className="rounded-t-xl bg-gradient-to-r from-[#3B82F6] to-[#6366F1] text-white p-4 flex items-center gap-3 text-lg font-semibold">
            <div className="bg-white/20 p-2 rounded-md">
              <CiStar className="text-2xl text-white" />
            </div>
            Customer Feedback
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 p-4">
            {/* Driver Information */}
            <div className="bg-gradient-to-r from-[#EFF6FF] to-[#EEF2FF] shadow rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Image
                    src="/images/driverplaceholderimg.png"
                    alt="driver image"
                    height={60}
                    width={60}
                    className="rounded-full object-cover border-2 border-blue-500"
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800 text-sm">
                      Abhishek Kumar
                    </span>
                    <span className="text-[13px] text-gray-700 ml-1">
                      13 Jan 2025
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[#FBBF24]">
                  {[...Array(5)].map((_, i) => (
                    <GoStarFill key={i} />
                  ))}
                  <span className="text-[13px] text-gray-700 ml-1">5.0</span>
                </div>
              </div>
              <div className="mt-2">
                <span className="text-[14px] text-gray-700">
                  Excellent service! Driver was very professional and the car
                  was clean. Reached on time.
                </span>
              </div>
            </div>
            <div className="bg-gradient-to-r from-[#EFF6FF] to-[#EEF2FF] shadow rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Image
                    src="/images/driverplaceholderimg.png"
                    alt="driver image"
                    height={60}
                    width={60}
                    className="rounded-full object-cover border-2 border-blue-500"
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800 text-sm">
                      Abhishek Kumar
                    </span>
                    <span className="text-[13px] text-gray-700 ml-1">
                      13 Jan 2025
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[#FBBF24]">
                  {[...Array(5)].map((_, i) => (
                    <GoStarFill key={i} />
                  ))}
                  <span className="text-[13px] text-gray-700 ml-1">5.0</span>
                </div>
              </div>
              <div className="mt-2">
                <span className="text-[14px] text-gray-700">
                  Good ride overall. Driver was courteous and drove safely.
                  Would recommended.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FleetRideDetails;