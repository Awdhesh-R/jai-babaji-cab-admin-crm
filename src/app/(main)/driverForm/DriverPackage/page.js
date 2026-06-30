import React from 'react'
import { Star, Check } from "lucide-react";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import {
    Wallet,
    Gift,
    TrendingUp,
    CheckCircle,
    AlertTriangle,
    ChevronDown
} from "lucide-react";
import { FcRules } from "react-icons/fc";
import { IoChevronDownSharp } from "react-icons/io5";
import { BsGraphUpArrow } from "react-icons/bs";
import { FaCarSide } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
// import { CheckCircle,  } from "lucide-react";

const page = () => {
    return (
        <div className='w-full '>
            <div className="py-2 px-[250px] bg-white shadow  w-full flex items-center justify-center">
                {/* Header */}
                <div className='flex  '>
                    <div className="flex gap-4 items-center justify-between ">
                        <button className="text-sm text-gray-600 hover:text-blue-600">
                            ← Back to Dashboard
                        </button>
                        <div className="">
                            <h2 className="text-xl  text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 font-bold">
                                Choose Your Driver Package
                            </h2>
                            <p className="text-[10px] text-gray-500">
                                Please select one of the following driver plans to begin earning with RodBez
                            </p>
                        </div>

                    </div>
                </div>
                <div className='flex ml-auto rounded-full border bg-blue-50 px-2 py-1'>
                    <span className='font-semibold text-blue-400 text-[9px] '>Package Selection</span>
                </div>
            </div>
            <div className='mx-[250] flex flex-col mb-16'>
                <div className='flex mt-4 mb-4  items-center justify-center'>
                    <span className='text-[11px] text-gray-600 '>
                        Tap on a package to view full benefits and terms & conditions
                    </span>
                </div>
                <div className='flex flex-col bg-white shadow-md rounded-t-xl border border-gray-200 px-4 pt-2 pb-3 w-full'>
                    <div className=" flex flex-col sm:flex-row sm:items-center sm:justify-between w-full ">

                        <div className="flex items-start gap-3">
                            <div className="bg-gradient-to-r from-[#3B82F6] to-[#9333EA] p-2 rounded-lg">
                                <Star className="w-4 h-4 text-white" />
                            </div>

                            <div className='flex flex-col items-start'>
                                <span className="font-bold text-[16px] text-gray-900">Package 1</span>
                                <span className="text-[10px] text-gray-500">Benefit After 28 Duties</span>
                            </div>

                        </div>

                        <div className="mt-4 sm:mt-0 text-right">
                            {/* Recommended Tag + Price */}
                            <div className="flex items-center justify-end gap-2">
                                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                    ⭐ Recommended
                                </span>
                                <h2 className="text-green-600 font-bold text-xl">₹25,300</h2>
                            </div>

                            {/* Details */}
                            <p className="text-[11px] text-gray-500 mt-1">
                                ₹500/day base, ₹100 No Refusal, ₹100 Night Incentive
                            </p>

                        </div>
                    </div>

                    <div className='flex  '>
                        <button className="flex items-center gap-2 text-[12px] text-gray-900 mt-2 px-2 py-0.5 border rounded-md">
                            <IoMdCheckmarkCircleOutline className="w-3 h-3 text-gray-900" />
                            Select This Plan
                        </button>

                        {/* Hide Details */}
                        <button className="flex items-center gap-2 text-[12px] text-gray-900 ml-auto  ">
                            <IoIosArrowUp />
                            Hide Details
                        </button>
                    </div>
                </div>


                <div className="bg-white p-6 rounded-b-xl shadow-md w-full  mx-auto text-gray-800 ">
                    {/* Base Package */}
                    <div className="mb-6">
                        <h2 className="flex items-center gap-2 font-semibold text-lg text-gray-800">
                            <Wallet className="w-5 h-5 text-blue-500" /> Base Package
                        </h2>
                        <div className='flex  gap-3'>
                            <div className="flex flex-1 flex-col bg-blue-50 rounded-lg p-2">
                                <span className='text-gray-400 text-[10px]'>
                                    Basic Daily Payment
                                </span>
                                <span className="text-blue-600 font-medium">₹500/Day</span>
                            </div>
                            <div className="flex flex-1 flex-col bg-blue-50 rounded-lg p-2">
                                <span className='text-gray-400 text-[10px]'>
                                    Basic Daily Payment
                                </span>
                                <span className="text-green-600 font-semibold">₹14,000.00</span>
                            </div>
                        </div>

                    </div>

                    {/* Incentives */}
                    <div className="mb-6">
                        <h2 className="flex items-center gap-2 font-semibold text-lg text-gray-800">
                            <Gift className="w-5 h-5 text-pink-500" /> Incentives
                        </h2>

                        <div className="flex flex-col mt-2 gap-2 ">
                            <div className="flex bg-purple-50  rounded-lg px-2 py-1">
                                <span className='flex flex-1 text-[12px]'>No Refusal Incentive</span>
                                <span className="flex text-purple-600 text-[14px]">
                                    ₹100/Day × 28 days = ₹2,800.00
                                </span>
                            </div>

                            <div className="flex bg-blue-50  rounded-lg px-2 py-1">
                                <span className='flex flex-1 text-[12px]'>Night Duty Incentive</span>
                                <span className="flex text-blue-600 text-[14px]">
                                    ₹100/Night × 15 nights = ₹1,500.00
                                </span>
                                {/* <p></p> */}
                                {/* <p className="text-indigo-600 text-sm">
                                   
                                </p> */}
                            </div>

                            <div className="flex bg-green-50  rounded-lg px-2 py-1">
                                <span className='flex flex-1 text-[12px]'>On-Time Pickup/Drop</span>
                                <span className="flex text-green-600 text-[14px]">
                                    ₹20/Ride × 50 Rides = ₹1,000.00
                                </span>
                            </div>

                            <div className="flex flex-col bg-red-50 p-2 rounded-lg">
                                <span className='text-[12px]'>RodBez Hero Incentive</span>
                                {/* <p></p> */}
                                <span className="text-[#EA580C] text-[13px]">
                                    ₹7,500 Quarterly bonus
                                </span>
                                <span className="text-red-600 text-[13px]">
                                    ₹7,500 Quarterly bonus
                                </span>
                            </div>

                            <div className="flex bg-green-50  rounded-lg px-2 py-1">
                                <span className='flex flex-1 text-[12px]'>Safe Ride Incentive</span>
                                <span className="flex text-green-600 text-[14px]">
                                    ₹3,500/Month
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Total Earnings */}


                    <div className="bg-green-50 p-2 border rounded-lg mb-4">
                        <span className="flex items-center gap-2 font-semibold text-lg text-gray-800 ">
                            <TrendingUp className="w-5 h-5 text-green-700" />
                            <span className='text-[14px] text-green-700'>

                                💰Total Potential Monthly Earnings
                            </span>
                        </span>
                        <span className="text-green-600 font-bold text-[1]">₹25,300.00</span>
                    </div>


                    {/* Rules */}
                    <div className="mb-4">
                        <span className="flex items-center gap-2 font-semibold text-[16px] text-gray-800">
                            <FcRules className="w-4 h-4 text-gray-600" /> नियम एवं शर्तें
                        </span>
                        <div className="flex flex-col mt-1  text-[14px] text-gray-700 list-disc gap-2">
                            <div className='flex items-center gap-2 bg-gray-100 rounded-md px-2 py-0.5'>
                                <CheckCircle className='h-3 w-3 text-blue-500 '></CheckCircle>
                                <span className='text-[12px]'>
                                    ड्राइवर ₹500/Day - अगर ड्राइवर महीने के 12 दिनों की ड्यूटी नहीं करता है तो ₹500/दिन बेसिक पे आएगा
                                </span>
                            </div>
                            <div className='flex items-center gap-2 bg-gray-100 rounded-md px-2 py-0.5'>
                                <CheckCircle className='h-3 w-3 text-blue-500 '></CheckCircle>
                                <span className='text-[12px]'>
                                    अगर कोई Refuse करता है, तो उस दिन का ₹100 No Refusal Incentive नहीं मिलेगा
                                </span>
                            </div>
                            <div className='flex items-center gap-2 bg-gray-100 rounded-md px-2 py-0.5'>
                                <CheckCircle className='h-3 w-3 text-blue-500 '></CheckCircle>
                                <span className='text-[12px]'>
                                    No Refusal Incentive ₹100/Day - 92 ड्यूटी करने पर ही ड्राइवर को यह इंसेंटिव मिलेगा
                                </span>
                            </div>

                            <div className='flex items-center gap-2 bg-gray-100 rounded-md px-2 py-0.5'>
                                <CheckCircle className='h-3 w-3 text-blue-500 '></CheckCircle>
                                <span className='text-[12px]'>
                                    नाइट ड्यूटी ₹100/Night - 15 रातें करने पर ही ड्राइवर को यह इंसेंटिव मिलेगा
                                </span>
                            </div>

                            <div className='flex items-center gap-2 bg-gray-100 rounded-md px-2 py-0.5'>
                                <CheckCircle className='h-3 w-3 text-blue-500 '></CheckCircle>
                                <span className='text-[12px]'>
                                    On-Time Incentive ₹20/Ride - अगर ETA से पहले 5 मिनट पर पिकअप पर पहुंचा तो मिलेगा
                                </span>
                            </div>

                            <div className='flex items-center gap-2 bg-gray-100 rounded-md px-2 py-0.5'>
                                <CheckCircle className='h-3 w-3 text-blue-500 '></CheckCircle>
                                <span className='text-[12px]'>
                                    RodBez Hero Incentive = 28 ड्यूटी + 0 Refusal, 50 Rides & 100KM ड्राइविंग पर ₹2500 मिलेगा
                                </span>
                            </div>

                            <div className='flex items-center gap-2 bg-gray-100 rounded-md px-2 py-0.5'>
                                <CheckCircle className='h-3 w-3 text-blue-500 '></CheckCircle>
                                <span className='text-[12px]'>
                                    Safe Ride Incentive ₹3,500/Month - अगर ड्राइवर महीने में 28 दिन ड्राइविंग करता है तो
                                </span>
                            </div>

                            <div className='flex items-center gap-2 bg-gray-100 rounded-md px-2 py-0.5'>
                                <CheckCircle className='h-3 w-3 text-blue-500 '></CheckCircle>
                                <span className='text-[12px]'>
                                    ओवरटाइम 9 घंटे से ज्यादा करने पर ₹50/घंटा (max 6 घंटे)
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Penalties */}
                    <div>
                        <span className="flex items-center gap-2 font-semibold text-lg text-gray-800">
                            <AlertTriangle className="w-5 h-5 text-red-500" /> जुर्माना व दंड
                        </span>
                        <ul className="flex flex-col mt-1   text-red-600 list-disc gap-2">
                            <div className='flex items-center gap-2 bg-gray-100 rounded-md px-2 py-0.5'>
                                <AlertTriangle className='h-2.5 w-2.5'></AlertTriangle>
                                <span className='text-[12px]'>
                                    कस्टमर शिकायत पर ड्राइवर को ₹100-₹850 तक का पेनल्टी
                                </span>
                            </div>
                            <div className='flex items-center gap-2 bg-gray-100 rounded-md px-2 py-0.5'>
                                <AlertTriangle className='h-2.5 w-2.5'></AlertTriangle>
                                <span className='text-[12px]'>
                                    Late return पर ₹850 पेनल्टी
                                </span>
                            </div>
                            <div className='flex items-center gap-2 bg-gray-100 rounded-md px-2 py-0.5'>
                                <AlertTriangle className='h-2.5 w-2.5  '></AlertTriangle>
                                <span className='text-[12px]'>
                                    ड्यूटी पर शराब पीकर आने पर कंपनी से निकाल दिया जाएगा
                                </span>
                            </div>
                        </ul>
                    </div>
                </div>


                <div className='flex flex-col bg-white shadow-md rounded-xl border border-gray-200 px-4 pt-2 pb-3 w-full mt-4'>
                    <div className=" flex flex-col sm:flex-row sm:items-center sm:justify-between w-full ">

                        <div className="flex items-start gap-3">
                            <div className="bg-gradient-to-r from-[#3B82F6] to-[#9333EA] p-2 rounded-lg">
                                <BsGraphUpArrow className="w-4 h-4 text-white" />
                            </div>

                            <div className='flex flex-col items-start'>
                                <span className="font-bold text-[16px] text-gray-900">Package 2</span>
                                <span className="text-[10px] text-gray-500">Benefit After 28 Duties</span>
                            </div>

                        </div>

                        <div className="mt-4 sm:mt-0 text-right">
                            {/* Recommended Tag + Price */}
                            <div className="flex items-center justify-end gap-2">
                                <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
                                    Popular
                                </span>
                                <h2 className="text-green-600 font-bold text-xl">₹25,300</h2>
                            </div>

                            {/* Details */}
                            <p className="text-[11px] text-gray-500 mt-1">
                                same benifites as Package 1
                            </p>

                        </div>
                    </div>

                    <div className='flex  '>
                        <button className="flex items-center gap-2 text-[12px] text-gray-900 mt-2 px-2 py-0.5 border rounded-md">
                            <IoMdCheckmarkCircleOutline className="w-3 h-3 text-gray-900" />
                            Select This Plan
                        </button>

                        {/* Hide Details */}
                        <button className="flex items-center gap-2 text-[12px] text-gray-900 ml-auto  ">
                            <IoChevronDownSharp />
                            View Details
                        </button>
                    </div>
                </div>



                <div className='flex flex-col bg-white shadow-md rounded-xl border border-gray-200 px-4 pt-2 pb-3 w-full mt-4'>
                    <div className=" flex flex-col sm:flex-row sm:items-center sm:justify-between w-full ">

                        <div className="flex items-start gap-3">
                            <div className="bg-gradient-to-r from-[#3B82F6] to-[#9333EA] p-2 rounded-lg">
                                <FaCarSide className="w-4 h-4 text-white" />
                            </div>

                            <div className='flex flex-col items-start'>
                                <span className="font-bold text-[16px] text-gray-900">Basic Plan</span>
                                <span className="text-[10px] text-gray-500">₹ 800 Entry</span>
                            </div>

                        </div>

                        <div className="mt-4 sm:mt-0 text-right">
                            {/* Recommended Tag + Price */}
                            <div className="flex items-center justify-end gap-2">
                                <span className="bg-orange-500 text-white text-xs px-3 py-1 rounded-full">
                                    Trial
                                </span>
                                <h2 className="text-green-600 font-bold text-xl">₹800</h2>
                            </div>

                            {/* Details */}
                            <p className="text-[11px] text-gray-500 mt-1">
                                No incentives, Just ride access
                            </p>

                        </div>
                    </div>

                    <div className='flex  '>
                        <button className="flex items-center gap-2 text-[12px] text-gray-900 mt-2 px-2 py-0.5 border rounded-md">
                            <IoMdCheckmarkCircleOutline className="w-3 h-3 text-gray-900" />
                            Select This Plan
                        </button>

                        {/* Hide Details */}
                        <button className="flex items-center gap-2 text-[12px] text-gray-900 ml-auto  ">
                            <IoChevronDownSharp />
                            View Details
                        </button>
                    </div>
                </div>

                <div className='mt-4 mb-2 flex flex-col items-center justify-center gap-1 '>
                    <button className='flex items-center gap-2 bg-gray-200 px-8 py-1.5 rounded-xl'>
                        <span className='flex items-center justify-center text-[14px] text-gray-500'>
                            Continue
                        </span>
                        <FaArrowRightLong className='flex items-center justify-center text-[14px] text-gray-500' />

                    </button>
                    <span className='flex items-center justify-center text-[12px] text-gray-500'>
                        Please select a package to continue
                    </span>
                </div>


            </div>

        </div>
    )
}

export default page