'use client'
import React, { useState } from 'react'
// import { FaCarSide } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineLocalOffer } from "react-icons/md";
import { MdAccessTime } from "react-icons/md";
import { useEffect } from 'react'
import { IoIosTrendingUp } from "react-icons/io";
import { FaCarSide } from "react-icons/fa";
import { IoMdTrendingUp } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import { HiSparkles } from "react-icons/hi2";
import { TbCarSuv } from "react-icons/tb";
import { GoPlus } from "react-icons/go";
import { FaLongArrowAltRight } from "react-icons/fa";
// import Image from 'next/image';
import { MdOutlineCurrencyRupee } from "react-icons/md";
import ClusterModal from '@/components/cluster/modal/ClusterModal';
import Image from "next/image";

const PatnaRenter = () => {
    const [activeCity, setActiveCity] = useState('Patna')
    const [showMore, setShowMore] = useState(false)
    const [intraValue, setIntraValue] = useState(35)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState("");

    const handleShowModalComponent = (modalType) => {
        // setShowModalComponent(true);
        // setSelectedType(aaaaa);
        setModalType(modalType);
        setIsModalOpen(true);
    };

    useEffect(() => {
        setLocalServiceRange(intraValue);
    }, [intraValue])
    const [localServiceRange, setLocalServiceRange] = useState(intraValue);

    return (
        <div className='w-full bg-gray-100 flex flex-col gap-1'>

            {/* Header Section */}

            <div className='flex justify-center flex-col gap-1 bg-[linear-gradient(135deg,_#F8FAFC_0%,_#EFF6FF_50%, _#E0E7FF_100%)] rounded-lg mx-48 p-4 '>
                {/* this div is for the city details componenets  */}
                <div className='relative  flex bg-[linear-gradient(90deg,_#2563EB_0%,_#4F46E5_50%,_#9333EA_100%)] rounded-lg p-4 gap-5 w-full'>
                    {/* <div className='bg-red-200'> "Div 2.1.1" </div> */}
                    <div className=' bg-white/20 p-4 rounded-full'>
                        <IoLocationOutline className="text-white text-2xl " />
                    </div>
                    <div>
                        <strong className='text-white text-3xl'>City: Patna</strong>
                        <h6 className='text-white text-sm'>Configure cluster settings</h6>
                    </div>
                    <span className="bg-white/20 border border-white/30 backdrop-blur-sm font-small text-white rounded-full shadow hover:bg-green-300 transition px-3 m-4 text-md ">
                        Active
                    </span>
                    {/* <button className="text-white hover:text-white hover:bg-red-400 transition-all duration-200 px-4 block  ml-auto rounded-full m-4">
            ✕
          </button> */}
                    {/* <div className="flex items-center justify-between w-full bg-[linear-gradient(90deg,_#2563EB_0%,_#4F46E5_50%,_#9333EA_100%)] rounded-md shadow-sm gap-20">
          </div> */}
                </div>
                <div className='flex items-center '>
                    <strong className='text-black px-12  m-4'>Manage Discounts</strong>
                    <div className='flex gap-4 m-4 ml-auto px-12' >
                        <button
                            onClick={() => {
                                handleShowModalComponent('offer')
                            }}
                            className="flex items-center gap-2 bg-[linear-gradient(90deg,_#2862EB_0%,_#9234EA_100%)] text-white rounded-lg p-2  transition-transform duration-300 hover:scale-105">
                            <MdOutlineLocalOffer className="text-xl" />
                            <span className="text-sm font-medium ">Offer Discount</span>
                        </button>
                        {/* // setModalType("realtime");
            // setIsModalOpen(true); */}
                        <button
                            onClick={() => {
                                handleShowModalComponent('realtime');
                            }}
                            className="flex items-center gap-2 bg-[linear-gradient(90deg,_#EA580C_0%,_#DC2725_100%)] text-white rounded-lg p-2 transition-transform duration-300 hover:scale-105">
                            <MdAccessTime className="text-xl" />
                            <span className="text-sm font-medium ">Real-Time Discount</span>
                        </button>

                    </div>
                </div>
                <div className='flex flex-col'>
                    <div className='flex justify-between'>
                        {/* First Box */}
                        <div className='flex flex-1 items-center bg-[linear-gradient(90deg,_#EFF6FF_0%,_#EEF2FF_100%)] border border-[#DBEAFE] my-4 px-4 mx-2 py-2 rounded-lg '>
                            <div className='flex flex-col p-2'>
                                <strong className="text-black text-md">Cluster Management</strong>
                                <span className="text-black text-sm">Enable cluster Management for Patna</span>
                            </div>
                            <div className="flex items-center gap-3 ml-auto">
                                <span className="text-sm text-gray-700 font-medium">ON</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-300 peer-checked:bg-blue-600 rounded-full transition-colors"></div>
                                    <div className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-transform peer-checked:translate-x-5"></div>
                                </label>
                            </div>
                        </div>

                        {/* Second Box */}
                        <div className='flex flex-1 items-center bg-[linear-gradient(90deg,_#EFF6FF_0%,_#EEF2FF_100%)] border border-[#DBEAFE] my-4 px-4 mx-2 py-2 rounded-lg '>
                            <div className='flex flex-col p-2'>
                                <strong className="text-black text-md">Rental</strong>
                                <span className="text-black text-sm">Enable cluster Management for Patna</span>
                            </div>
                            <div className="flex items-center gap-3 ml-auto">
                                <span className="text-sm text-gray-700 font-medium">ON</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-300 peer-checked:bg-blue-600 rounded-full transition-colors"></div>
                                    <div className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-transform peer-checked:translate-x-5"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* <strong className='text-black  p-4 text-lg'>Service Options</strong> */}

                </div>
                <div className='flex gap-2 m-4 items-center'>
                    <FaCarSide className='w-5 h-5 object-cover rounded-lg bg-white text-blue-600' />
                    {/* <img src="\icons\Local_Service_Icon.svg" alt="rental Service" className="w-6 h-6 object-cover rounded-lg bg-white " /> */}
                    <strong className='text-black text-lg '>Choose Your Rental Package</strong>
                </div>
                <div className='flex flex-col gap-2'>
                    <div className='flex  mx-4  gap-3  '>
                        <button className='flex flex-col items-center border border-blue-400 px-4 py-6  rounded-md flex-1 bg-[#F3F7FE] gap-1 hover:scale-105 transition'>
                            <div className="flex items-center justify-center bg-[linear-gradient(117.87deg,_#4D7AF6_14.23%,_#985DF7_87.05%)] text-white rounded-full w-8 h-8">
                                <FaCarSide className="w-4 h-4" />
                            </div>
                            <span className='text-[#323B47] text-[11px] font-bold'>40 KM/4Hr</span>
                        </button>
                        <button className='flex flex-col items-center  border border-[#E5E7EB] px-4 py-6 rounded-md flex-1 bg-[#FFFFFF] gap-1 hover:scale-105 transition'>
                            <div className="flex items-center justify-center bg-[#E5E7EB] text-[#C8A4A4] rounded-full w-8 h-8">
                                <FaCarSide className="w-4 h-4" />
                            </div>
                            <span className='text-[#323B47] text-[11px] font-bold'>40 KM/4Hr</span>
                        </button>
                        <button className='flex flex-col items-center  border border-[#E5E7EB] px-4 py-6 rounded-md flex-1 bg-[#FFFFFF] gap-1 hover:scale-105 transition'>
                            <div className="flex items-center justify-center bg-[#E5E7EB] text-[#C8A4A4] rounded-full w-8 h-8">
                                <FaCarSide className="w-4 h-4" />
                            </div>
                            <span className='text-[#323B47] text-[11px] font-bold'>40 KM/4Hr</span>
                        </button>
                        <button className='flex flex-col items-center border border-[#E5E7EB]  px-4 py-6 rounded-md flex-1 bg-[#FFFFFF] gap-1 hover:scale-105 transition'>
                            <div className="flex items-center justify-center bg-[#E5E7EB] text-[#C8A4A4] rounded-full w-8 h-8">
                                <FaCarSide className="w-4 h-4" />
                            </div>
                            <span className='text-[#323B47] text-[11px] font-bold'>40 KM/4Hr</span>
                        </button>
                        <button className='flex flex-col items-center  border border-[#E5E7EB] px-4 py-6 rounded-md flex-1 bg-[#FFFFFF] gap-1 hover:scale-105 transition'>
                            <div className="flex items-center justify-center bg-[#E5E7EB] text-[#C8A4A4] rounded-full w-8 h-8">
                                <FaCarSide className="w-4 h-4" />
                            </div>
                            <span className='text-[#323B47] text-[11px] font-bold'>40 KM/4Hr</span>
                        </button>
                        <button className='flex flex-col items-center border border-[#E5E7EB]  px-4 py-6 rounded-md flex-1 bg-[#FFFFFF] gap-1 hover:scale-105 transition'>
                            <div className="flex items-center justify-center bg-[#E5E7EB] text-[#C8A4A4] rounded-full w-8 h-8">
                                <FaCarSide className="w-4 h-4" />
                            </div>
                            <span className='text-[#323B47] text-[11px] font-bold'>40 KM/4Hr</span>
                        </button>
                    </div>

                    <div className='flex gap-3 mx-4 pb-4 '>
                        <button className='flex flex-col items-center border border-[#E5E7EB]  px-4 py-6 rounded-md flex-1 bg-[#FFFFFF] gap-1 hover:scale-105 transition'>
                            <div className="flex items-center justify-center bg-[#E5E7EB] text-[#C8A4A4] rounded-full w-8 h-8">
                                <FaCarSide className="w-4 h-4" />
                            </div>
                            <span className='text-[#323B47] text-[11px] font-bold'>40 KM/4Hr</span>
                        </button>
                        <button className='flex flex-col items-center border border-[#E5E7EB]  px-4 py-6 rounded-md flex-1 bg-[#FFFFFF] gap-1 hover:scale-105 transition'>
                            <div className="flex items-center justify-center bg-[#E5E7EB] text-[#C8A4A4] rounded-full w-8 h-8">
                                <FaCarSide className="w-4 h-4" />
                            </div>
                            <span className='text-[#323B47] text-[11px] font-bold'>40 KM/4Hr</span>
                        </button>
                        <button className='flex flex-col items-center border border-[#E5E7EB]   px-4 py-6 rounded-md flex-1 bg-[#FFFFFF] gap-1 hover:scale-105 transition'>
                            <div className="flex items-center justify-center bg-[#E5E7EB] text-[#C8A4A4] rounded-full w-8 h-8">
                                <FaCarSide className="w-4 h-4" />
                            </div>
                            <span className='text-[#323B47] text-[11px] font-bold'>40 KM/4Hr</span>
                        </button>
                        <button className='flex flex-col items-center border border-[#E5E7EB]  px-4 py-6 rounded-md flex-1 bg-[#FFFFFF] gap-1 hover:scale-105 transition '>
                            <div className="flex items-center justify-center bg-[#E5E7EB] text-[#C8A4A4] rounded-full w-8 h-8">
                                <FaCarSide className="w-4 h-4" />
                            </div>
                            <span className='text-[#323B47] text-[11px] font-bold'>40 KM/4Hr</span>
                        </button>
                        <button className='flex flex-col items-center  px-4 py-6 border-2 border-dotted   border-[#A855F7] 1px solid rounded-md flex-1 bg-[#F9F8FE] gap-1 hover:scale-105 transition'>
                            <div className="flex items-center justify-center bg-[linear-gradient(139.73deg,_#B552E5_16.83%,_#E04BAA_83.79%)] text-[#FFFFFF] rounded-full w-8 h-8">
                                <GoPlus className="w-4 h-4" />
                            </div>
                            <div className='flex flex-col'>
                                <span className='text-[#323B47] text-[9px] font-bold'>Hourly Package</span>
                                <span className='text-[#1F293799] text-[8px]'>X KM / X Hr</span>
                            </div>
                        </button>
                        <button className='flex flex-col items-center border border-[#E5E7EB] px-4 py-6   rounded-md flex-1 bg-[#FFFFFF] gap-1 hover:scale-105 transition'>
                            <div className="flex items-center justify-center bg-[#E5E7EB] text-[#FFFFFF] rounded-full w-8 h-8">
                                <GoPlus className="w-4 h-4" />
                            </div>
                            <div className='flex flex-col'>
                                <span className='text-[#323B47] text-[9px] font-bold'>Daily Package</span>
                                <span className='text-[#1F293799] text-[8px]'>X KM / X Day</span>
                            </div>
                        </button>
                    </div>
                </div>
                <div className='flex gap-2 m-4 items-center'>
                    <FaCarSide className='w-5 h-5 object-cover rounded-lg bg-white text-[#9333EA]' />
                    {/* <img src="\icons\Local_Service_Icon.svg" alt="rental Service" className="w-6 h-6 object-cover rounded-lg bg-white " /> */}
                    <strong className='text-black text-lg '>Select Your Vehicle</strong>
                </div>

                <div className='flex   mx-4 my-2 gap-2.5'>
                    <div className='flex flex-col gap-1 flex-1 rounded-lg border border-[#3B82F6] my-2 p-4'>
                        <div className='flex items-center mx-2 justify-start'>
                            <Image src='/CarImages.jpg' alt='MINI' width={72} height={72} />
                            <strong className='text-[13px] font-bold'>MINI</strong>
                        </div >
                        <div className='flex items-start mx-2'>
                            <MdOutlineCurrencyRupee className='text-[#16A34A]' />
                            <strong className='text-[12px] font-bold text-black'>Base Fare: 650</strong>
                        </div>
                        <div className='flex items-center justify-start mx-2 '>
                            <h6 className='text-[9px] text-[#4B5563] \'>Extra Distance Charge:</h6>
                            <strong className='text-[10px] font-bold text-[#4B5563]'>₹6/km</strong>
                        </div >
                        <div className='flex items-start mx-2'>
                            <h6 className='text-[8px] text-[#4B5563] '>Extra Time Charge:</h6>
                            <strong className='text-[9px] font-bold text-[#4B5563]'> ₹10/min</strong>
                        </div>

                        <button className='flex items-center  transition-transform duration-300 hover:scale-105  text-white rounded-full justify-center bg-[linear-gradient(90deg,_#2563EB_0%,_#4F46E5_50%,_#9333EA_100%)] mx-2'>
                            <span className=' font-solid text-sm '>Selected</span>
                            {/* <IoMdTrendingUp className="text-white cursor-pointer" /> */}

                        </button>

                    </div>
                    <div className='flex flex-col gap-1 flex-1 rounded-lg border border-[#FFFFFF] my-2 p-4'>
                        <div className='flex items-center justify-start mx-2'>
                            <Image src='/CarImages.jpg' alt='MINI' width={72} height={72} />
                            <strong className='text-[13px] font-bold'>Sedan</strong>
                        </div >
                        <div className='flex items-center justify-start mx-2'>
                            <MdOutlineCurrencyRupee className='text-[#16A34A]' />
                            <strong className='text-[12px] font-bold text-black'>Base Fare: 820</strong>
                        </div>
                        <div className='flex items-start mx-2'>
                            <h6 className='text-[9px] text-[#4B5563] '>Extra Distance Charge:</h6>
                            <strong className='text-[10px] font-bold text-[#4B5563]'>₹8/km</strong>
                        </div >
                        <div className='flex items-start mx-2'>
                            <h6 className='text-[9px] text-[#4B5563] '>Extra Time Charge:</h6>
                            <strong className='text-[10px] font-bold text-[#4B5563]'> ₹15/min</strong>
                        </div>

                        <button className='flex items-center  transition-transform duration-300 hover:scale-105  text-[#020817] rounded-full justify-center border mx-2'>
                            <span className=' font-solid text-sm '>Select Vehicle</span>
                            {/* <IoMdTrendingUp className="text-white cursor-pointer" /> */}

                        </button>

                    </div>
                    <div className='flex flex-col  gap-1 flex-1 rounded-lg border border-[#FFFFFF] my-2 p-4'>
                        <div className='flex items-center justify-start mx-2'>
                            {/* <Image src='/public/CarImages.jpg' alt='MINI'> MINI </Image> */}
                            <Image src='/CarImages.jpg' alt='MINI' width={72} height={72} />
                            <strong className='text-[13px] font-bold'>SUV</strong>
                        </div >
                        <div className='flex items-center justify-start mx-2'>
                            <MdOutlineCurrencyRupee className='text-[#16A34A]' />
                            <strong className='text-[12px] font-bold text-black'>Base Fare: 1100</strong>
                        </div>
                        <div className='flex items-start mx-2'>
                            <h6 className='text-[9px] text-[#4B5563] '>Extra Distance Charge:</h6>
                            <strong className='text-[10px] font-bold text-[#4B5563]'>₹12/km</strong>
                        </div >
                        <div className='flex items-start mx-2'>
                            <h6 className='text-[9px] text-[#4B5563] '>Extra Time Charge:</h6>
                            <strong className='text-[10px] font-bold text-[#4B5563]'> ₹20/min</strong>
                        </div>

                        <button className='flex items-center  transition-transform duration-300 hover:scale-105  text-[#020817] rounded-full justify-center border mx-2'>
                            <span className=' font-solid text-sm '>Select Vehicle</span>
                            {/* <IoMdTrendingUp className="text-white cursor-pointer" /> */}

                        </button>

                    </div>
                </div>

                <div className='flex justify-center'>
                    <button className='flex items-center transition-transform duration-300 hover:scale-105 gap-2 text-white rounded-full justify-center bg-[linear-gradient(90deg,_#2563EB_0%,_#4F46E5_50%,_#9333EA_100%)] px-2'>
                        {/* <img src='/icons/clusterlogo.png' className='w-5 h-5'></img> */}
                        <span className='text-white font-solid text-sm '>Save Cluster Configuration</span>
                        <FaLongArrowAltRight className="text-white cursor-pointer" />

                    </button>
                </div>
                {/* <button className='flex items-center transition-transform duration-300 hover:scale-105 gap-2 text-white rounded-full w-fit mx-4 my-4 px-2 py-1 bg-[linear-gradient(90deg,_#2563EB_0%,_#4F46E5_50%,_#9333EA_100%)]'>
                    <img src='/icons/clusterlogo.png' className='w-5 h-5'></img>
                    <span className='text-white font-solid text-sm '>Save Cluster Configuration</span>
                </button> */}
                <div className='flex flex-col gap-10 my-4'>
                    <div className='flex items-center gap-2 bg-[linear-gradient(90deg,_#4F46E51A_0%,_#9333EA1A_50%,_#DB27771A_100%)] rounded-md '>
                        <div className='flex items-center  mx-4 py-6 rounded-md gap-2 '>
                            <div className='bg-[linear-gradient(90deg,_#4F46E5_0%,_#9333EA_100%)] rounded-lg flex items-center justify-center p-2'>
                                <IoIosTrendingUp className='text-white text-[18px] font-bold' />
                            </div>
                            <div className='flex flex-col items-start '>
                                <strong className="text-transparent text-3xl font-bold bg-clip-text bg-[linear-gradient(90deg,#111827_0%,#3730A3_50%,#6B21A8_100%)]">
                                    Fare Details
                                </strong>

                                <span className='text-black text-sm'>Configure base fares and per km rates for different vehicle types</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col rounded-xl shadow-lg overflow-hidden">
                        {/* Header: MINI + Description + Services */}
                        <div className="flex justify-between items-center bg-gradient-to-r from-emerald-400 to-cyan-600 px-6 py-4">
                            {/* Left: Icon + Labels */}
                            <div className="flex items-center gap-3">
                                <div className="bg-white/20 rounded-lg p-2">
                                    <FaCarSide className="text-white text-xl" />
                                </div>
                                <div className="flex flex-col leading-tight">
                                    <span className="text-white font-bold text-xl">Mini</span>
                                    <span className="text-white text-sm">Premium vehicle category</span>
                                </div>
                            </div>
                            {/* Right: Services Count */}
                            <div className="bg-white/20 border border-white/30 px-4 py-1 rounded-full text-white font-medium text-sm">
                                4 Services
                            </div>
                        </div>
                        {/* Fare Cards Row */}
                        <div className="grid grid-cols-4 gap-4 bg-white p-4">
                            {/* Single Fare Card - IntraCity */}


                            <div className="rounded-lg overflow-hidden shadow border border-gray-100">
                                {/* Card Header with Gradient and Edit Icon */}
                                {/* Card Header with Gradient and Edit Icon */}



                                <div className="flex justify-between items-center p-6 bg-[linear-gradient(90deg,_#22D3EE_0%,_#3B82F6_50%,_#4F46E5_100%)]" >
                                    <div className="flex items-center gap-2">
                                        <Image
                                            src="/icons/IntraCity_Icon.svg"
                                            alt="IntraCity"
                                            className="w-6 h-6"
                                        />
                                        <span className="text-white font-semibold text-sm">IntraCity</span>
                                    </div>
                                    <button onClick={() => {
                                        handleShowModalComponent('price');
                                    }}
                                        className='transition-transform duration-300 hover:scale-[1.5]'>
                                        <CiEdit className="text-white cursor-pointer" />
                                    </button>
                                </div>

                                {/* Card Body */}
                                <div className="flex flex-col gap-3 bg-gradient-to-b from-gray-50 to-white px-4 py-4 space-y-3 text-sm text-gray-800 p-2">
                                    <div className="flex justify-between items-center rounded-lg gap-2 p-2  bg-[#ffffff] ">
                                        <div className="flex items-center gap-2">
                                            <IoMdTrendingUp />
                                            <span>Base Fare:</span>
                                        </div>
                                        <strong>₹350</strong>
                                    </div>

                                    <div className="flex justify-between items-center rounded-lg gap-2  p-2 bg-[#ffffff]">
                                        <div className="flex items-center gap-2">
                                            <FaCarSide />
                                            <span>IntraCity Per Km:</span>
                                        </div>
                                        <strong>₹35</strong>
                                    </div>

                                    <div className="flex justify-between items-center rounded-lg gap-2 p-2 bg-[#ffffff]">
                                        <div className="flex items-center gap-2 ">
                                            {/* <IoMdTrendingUp />  */}
                                            <HiSparkles />
                                            {/* <img src='\icons\clusterlogo.png' alt='Intracity' className='text-black '></img> */}
                                            <span>IntraCity Extra Km:</span>
                                        </div>
                                        <strong>₹35</strong>
                                    </div>

                                    <div className="flex justify-between items-center rounded-lg gap-2 p-2 bg-[#ffffff]">
                                        <div className="flex items-center gap-2">
                                            {/* <IoMdTrendingUp /> */}
                                            <MdAccessTime />
                                            <span>IntraCity Waiting:</span>
                                        </div>
                                        <strong>₹35</strong>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-lg overflow-hidden shadow border border-gray-100">
                                {/* Card Header with Gradient and Edit Icon */}
                                <div className="flex justify-between items-center p-6 bg-[linear-gradient(90deg,_#3B82F6_0%,_#4F46E5_50%,_#7E22CE_100%)]">
                                    <div className="flex items-center gap-2">
                                        <Image
                                            src="/icons/Local_Service_icon.svg"
                                            alt="Local"
                                            className="w-6 h-6"
                                        />
                                        <span className="text-white font-semibold text-sm">Local</span>
                                    </div>
                                    <button onClick={() => {
                                        handleShowModalComponent('price');
                                    }}
                                        className='transition-transform duration-300 hover:scale-[1.5]'>
                                        <CiEdit className="text-white cursor-pointer" />
                                    </button>
                                </div>

                                {/* Card Body */}
                                <div className="flex flex-col gap-3 bg-gradient-to-b from-gray-50 to-white px-4 py-4 space-y-3 text-sm text-gray-800 p-2">
                                    <div className="flex justify-between items-center rounded-lg gap-2 p-2  bg-[#ffffff] ">
                                        <div className="flex items-center gap-2">
                                            <IoMdTrendingUp />
                                            <span>Local Base Fare:</span>
                                        </div>
                                        <strong>₹200</strong>
                                    </div>

                                    <div className="flex justify-between items-center rounded-lg gap-2  p-2 bg-[#ffffff]">
                                        <div className="flex items-center gap-2">
                                            <FaCarSide />
                                            <span>Local Per Km:</span>
                                        </div>
                                        <strong>₹20</strong>
                                    </div>

                                    <div className="flex justify-between items-center rounded-lg gap-2 p-2 bg-[#ffffff]">
                                        <div className="flex items-center gap-2 ">
                                            {/* <IoMdTrendingUp />  */}
                                            <HiSparkles />
                                            {/* <img src='\icons\clusterlogo.png' alt='Intracity' className='text-black '></img> */}
                                            <span>Local Extra Km:</span>
                                        </div>
                                        <strong>₹20</strong>
                                    </div>

                                    <div className="flex justify-between items-center rounded-lg gap-2 p-2 bg-[#ffffff]">
                                        <div className="flex items-center gap-2">
                                            {/* <IoMdTrendingUp /> */}
                                            <MdAccessTime />
                                            <span>Local Waiting:</span>
                                        </div>
                                        <strong>₹20</strong>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-lg overflow-hidden shadow border border-gray-100">
                                {/* Card Header with Gradient and Edit Icon */}
                                <div className="flex justify-between items-center p-6 bg-[linear-gradient(90deg,_#4F46E5_0%,_#7E22CE_50%,_#9D174D_100%)]">
                                    <div className="flex items-center gap-2">
                                        <Image
                                            src="/icons/InterCity_Icon.svg"
                                            alt="intercity"
                                            className="w-6 h-6"
                                        />
                                        <span className="text-white font-semibold text-sm">Intercity</span>
                                    </div>
                                    <button onClick={() => {
                                        handleShowModalComponent('price');
                                    }}
                                        className='transition-transform duration-300 hover:scale-[1.5]'>
                                        <CiEdit className="text-white cursor-pointer" />
                                    </button>
                                </div>

                                {/* Card Body */}
                                <div className="flex flex-col gap-3 bg-gradient-to-b from-gray-50 to-white px-4 py-4 space-y-3 text-sm text-gray-800 p-2">
                                    <div className="flex justify-between items-center rounded-lg gap-2 p-2  bg-[#ffffff] ">
                                        <div className="flex items-center gap-2">
                                            <IoMdTrendingUp />
                                            <span>Base Fare:</span>
                                        </div>
                                        <strong>₹300</strong>
                                    </div>

                                    <div className="flex justify-between items-center rounded-lg gap-2  p-2 bg-[#ffffff]">
                                        <div className="flex items-center gap-2">
                                            <FaCarSide />
                                            <span>intercity Per Km:</span>
                                        </div>
                                        <strong>₹30</strong>
                                    </div>

                                    <div className="flex justify-between items-center rounded-lg gap-2 p-2 bg-[#ffffff]">
                                        <div className="flex items-center gap-2 ">
                                            {/* <IoMdTrendingUp />  */}
                                            <HiSparkles />
                                            {/* <img src='\icons\clusterlogo.png' alt='Intracity' className='text-black '></img> */}
                                            <span>intercity Extra Km:</span>
                                        </div>
                                        <strong>₹30</strong>
                                    </div>

                                    <div className="flex justify-between items-center rounded-lg gap-2 p-2 bg-[#ffffff]">
                                        <div className="flex items-center gap-2">
                                            {/* <IoMdTrendingUp /> */}
                                            <MdAccessTime />
                                            <span>intercity Waiting:</span>
                                        </div>
                                        <strong>₹30</strong>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-lg overflow-hidden shadow border border-gray-100">
                                {/* Card Header with Gradient and Edit Icon */}
                                <div className="flex justify-between items-center p-6 bg-[linear-gradient(90deg,_#7E22CE_0%,_#9D174D_50%,_#881337_100%)]">
                                    <div className="flex items-center gap-2">
                                        <Image
                                            src="/icons/InterState_Icon.svg"
                                            alt="Interstate"
                                            className="w-6 h-6"
                                        />
                                        <span className="text-white font-semibold text-sm">Interstate</span>
                                    </div>
                                    <button onClick={() => {
                                        handleShowModalComponent('price');
                                    }}
                                        className='transition-transform duration-300 hover:scale-[1.5]'>
                                        <CiEdit className="text-white cursor-pointer" />
                                    </button>
                                </div>

                                {/* Card Body */}
                                <div className="flex flex-col gap-3 bg-gradient-to-b from-gray-50 to-white px-4 py-4 space-y-3 text-sm text-gray-800 p-2">
                                    <div className="flex justify-between items-center rounded-lg gap-2 p-2  bg-[#ffffff] ">
                                        <div className="flex items-center gap-2">
                                            <IoMdTrendingUp />
                                            <span>Base Fare:</span>
                                        </div>
                                        <strong>₹400</strong>
                                    </div>

                                    <div className="flex justify-between items-center rounded-lg gap-2  p-2 bg-[#ffffff]">
                                        <div className="flex items-center gap-2">
                                            <FaCarSide />
                                            <span>interstate Per Km:</span>
                                        </div>
                                        <strong>₹35</strong>
                                    </div>

                                    <div className="flex justify-between items-center rounded-lg gap-2 p-2 bg-[#ffffff]">
                                        <div className="flex items-center gap-2 ">
                                            {/* <IoMdTrendingUp />  */}
                                            <HiSparkles />
                                            {/* <img src='\icons\clusterlogo.png' alt='Intracity' className='text-black '></img> */}
                                            <span>interstate Extra Km:</span>
                                        </div>
                                        <strong>₹35</strong>
                                    </div>

                                    <div className="flex justify-between items-center rounded-lg gap-2 p-2 bg-[#ffffff]">
                                        <div className="flex items-center gap-2">
                                            {/* <IoMdTrendingUp /> */}
                                            <MdAccessTime />
                                            <span>interstate Waiting:</span>
                                        </div>
                                        <strong>₹35</strong>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>
                    <div className="flex flex-col rounded-xl shadow-lg overflow-hidden">
                        {/* Header: MINI + Description + Services */}
                        <div className="flex justify-between items-center  bg-[linear-gradient(90deg,_#3B82F6_0%,_#4338CA_100%)] px-6 py-4">
                            {/* Left: Icon + Labels */}
                            <div className="flex items-center gap-3">
                                <div className="bg-white/20 rounded-lg p-2">
                                    <FaCarSide className="text-white text-xl" />
                                </div>
                                <div className="flex flex-col leading-tight">
                                    <span className="text-white font-bold text-xl">Sedan</span>
                                    <span className="text-white text-sm">Premium vehicle category</span>
                                </div>
                            </div>
                            {/* Right: Services Count */}
                            <div className="bg-white/20 border border-white/30 px-4 py-1 rounded-full text-white font-medium text-sm">
                                4 Services
                            </div>
                        </div>
                        {/* Fare Cards Row */}
                        <div className="grid grid-cols-4 gap-4 bg-white p-4">
                            {/* Single Fare Card - IntraCity */}


                            <div className="rounded-lg overflow-hidden shadow border border-gray-100">
                                {/* Card Header with Gradient and Edit Icon */}
                                {/* Card Header with Gradient and Edit Icon */}



                                <div className="flex justify-between items-center p-6 bg-[linear-gradient(90deg,_#22D3EE_0%,_#3B82F6_50%,_#4F46E5_100%)]">
                                    <div className="flex items-center gap-2">
                                        <Image
                                            src="/icons/IntraCity_Icon.svg"
                                            alt="IntraCity"
                                            className="w-6 h-6"
                                        />
                                        <span className="text-white font-semibold text-sm">IntraCity</span>
                                    </div>
                                    <button onClick={() => {
                                        handleShowModalComponent('price');
                                    }}
                                        className='transition-transform duration-300 hover:scale-[1.5]'>
                                        <CiEdit className="text-white cursor-pointer" />
                                    </button>
                                </div>

                                {/* Card Body */}
                                <div className="flex flex-col gap-3 bg-gradient-to-b from-gray-50 to-white px-4 py-4 space-y-3 text-sm text-gray-800 p-2">
                                    <div className="flex justify-between items-center rounded-lg gap-2 p-2  bg-[#ffffff] ">
                                        <div className="flex items-center gap-2">
                                            <IoMdTrendingUp />
                                            <span>Base Fare:</span>
                                        </div>
                                        <strong>₹350</strong>
                                    </div>

                                    <div className="flex justify-between items-center rounded-lg gap-2  p-2 bg-[#ffffff]">
                                        <div className="flex items-center gap-2">
                                            <FaCarSide />
                                            <span>IntraCity Per Km:</span>
                                        </div>
                                        <strong>₹35</strong>
                                    </div>

                                    <div className="flex justify-between items-center rounded-lg gap-2 p-2 bg-[#ffffff]">
                                        <div className="flex items-center gap-2 ">
                                            {/* <IoMdTrendingUp />  */}
                                            <HiSparkles />
                                            {/* <img src='\icons\clusterlogo.png' alt='Intracity' className='text-black '></img> */}
                                            <span>IntraCity Extra Km:</span>
                                        </div>
                                        <strong>₹35</strong>
                                    </div>

                                    <div className="flex justify-between items-center rounded-lg gap-2 p-2 bg-[#ffffff]">
                                        <div className="flex items-center gap-2">
                                            {/* <IoMdTrendingUp /> */}
                                            <MdAccessTime />
                                            <span>IntraCity Waiting:</span>
                                        </div>
                                        <strong>₹35</strong>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-lg overflow-hidden shadow border border-gray-100">
                                {/* Card Header with Gradient and Edit Icon */}
                                <div className="flex justify-between items-center p-6 bg-[linear-gradient(90deg,_#3B82F6_0%,_#4F46E5_50%,_#7E22CE_100%)]">
                                    <div className="flex items-center gap-2">
                                        <Image
                                            src="/icons/Local_Service_icon.svg"
                                            alt="Local"
                                            className="w-6 h-6"
                                        />
                                        <span className="text-white font-semibold text-sm">Local</span>
                                    </div>
                                    <button onClick={() => {
                                        handleShowModalComponent('price');
                                    }}
                                        className='transition-transform duration-300 hover:scale-[1.5]'>
                                        <CiEdit className="text-white cursor-pointer" />
                                    </button>
                                </div>

                                {/* Card Body */}
                                <div className="flex flex-col gap-3 bg-gradient-to-b from-gray-50 to-white px-4 py-4 space-y-3 text-sm text-gray-800 p-2">
                                    <div className="flex justify-between items-center rounded-lg gap-2 p-2  bg-[#ffffff] ">
                                        <div className="flex items-center gap-2">
                                            <IoMdTrendingUp />
                                            <span>Local Base Fare:</span>
                                        </div>
                                        <strong>₹200</strong>
                                    </div>

                                    <div className="flex justify-between items-center rounded-lg gap-2  p-2 bg-[#ffffff]">
                                        <div className="flex items-center gap-2">
                                            <FaCarSide />
                                            <span>Local Per Km:</span>
                                        </div>
                                        <strong>₹20</strong>
                                    </div>

                                    <div className="flex justify-between items-center rounded-lg gap-2 p-2 bg-[#ffffff]">
                                        <div className="flex items-center gap-2 ">
                                            {/* <IoMdTrendingUp />  */}
                                            <HiSparkles />
                                            {/* <img src='\icons\clusterlogo.png' alt='Intracity' className='text-black '></img> */}
                                            <span>Local Extra Km:</span>
                                        </div>
                                        <strong>₹20</strong>
                                    </div>

                                    <div className="flex justify-between items-center rounded-lg gap-2 p-2 bg-[#ffffff]">
                                        <div className="flex items-center gap-2">
                                            {/* <IoMdTrendingUp /> */}
                                            <MdAccessTime />
                                            <span>Local Waiting:</span>
                                        </div>
                                        <strong>₹20</strong>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-lg overflow-hidden shadow border border-gray-100">
                                {/* Card Header with Gradient and Edit Icon */}
                                <div className="flex justify-between items-center p-6 bg-[linear-gradient(90deg,_#4F46E5_0%,_#7E22CE_50%,_#9D174D_100%)]">
                                    <div className="flex items-center gap-2">
                                        <Image
                                            src="/icons/InterCity_Icon.svg"
                                            alt="intercity"
                                            className="w-6 h-6"
                                        />
                                        <span className="text-white font-semibold text-sm">Intercity</span>
                                    </div>
                                    <button onClick={() => {
                                        handleShowModalComponent('price');
                                    }}
                                        className='transition-transform duration-300 hover:scale-[1.5]'>
                                        <CiEdit className="text-white cursor-pointer" />
                                    </button>
                                </div>

                                {/* Card Body */}
                                <div className="flex flex-col gap-3 bg-gradient-to-b from-gray-50 to-white px-4 py-4 space-y-3 text-sm text-gray-800 p-2">
                                    <div className="flex justify-between items-center rounded-lg gap-2 p-2  bg-[#ffffff] ">
                                        <div className="flex items-center gap-2">
                                            <IoMdTrendingUp />
                                            <span>Base Fare:</span>
                                        </div>
                                        <strong>₹300</strong>
                                    </div>

                                    <div className="flex justify-between items-center rounded-lg gap-2  p-2 bg-[#ffffff]">
                                        <div className="flex items-center gap-2">
                                            <FaCarSide />
                                            <span>intercity Per Km:</span>
                                        </div>
                                        <strong>₹30</strong>
                                    </div>

                                    <div className="flex justify-between items-center rounded-lg gap-2 p-2 bg-[#ffffff]">
                                        <div className="flex items-center gap-2 ">
                                            {/* <IoMdTrendingUp />  */}
                                            <HiSparkles />
                                            {/* <img src='\icons\clusterlogo.png' alt='Intracity' className='text-black '></img> */}
                                            <span>intercity Extra Km:</span>
                                        </div>
                                        <strong>₹30</strong>
                                    </div>

                                    <div className="flex justify-between items-center rounded-lg gap-2 p-2 bg-[#ffffff]">
                                        <div className="flex items-center gap-2">
                                            {/* <IoMdTrendingUp /> */}
                                            <MdAccessTime />
                                            <span>intercity Waiting:</span>
                                        </div>
                                        <strong>₹30</strong>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-lg overflow-hidden shadow border border-gray-100">
                                {/* Card Header with Gradient and Edit Icon */}
                                <div className="flex justify-between items-center p-6 bg-[linear-gradient(90deg,_#7E22CE_0%,_#9D174D_50%,_#881337_100%)]">
                                    <div className="flex items-center gap-2">
                                        <Image
                                            src="/icons/InterState_Icon.svg"
                                            alt="Interstate"
                                            className="w-6 h-6"
                                        />
                                        <span className="text-white font-semibold text-sm">Interstate</span>
                                    </div>
                                    <button onClick={() => {
                                        handleShowModalComponent('price');
                                    }}
                                        className='transition-transform duration-300 hover:scale-[1.5]'>
                                        <CiEdit className="text-white cursor-pointer" />
                                    </button>
                                </div>
                                {/* Card Body */}
                                <div className="flex flex-col gap-3 bg-gradient-to-b from-gray-50 to-white px-4 py-4 space-y-3 text-sm text-gray-800 p-2">
                                    <div className="flex justify-between items-center rounded-lg gap-2 p-2  bg-[#ffffff] ">
                                        <div className="flex items-center gap-2">
                                            <IoMdTrendingUp />
                                            <span>Base Fare:</span>
                                        </div>
                                        <strong>₹400</strong>
                                    </div>

                                    <div className="flex justify-between items-center rounded-lg gap-2  p-2 bg-[#ffffff]">
                                        <div className="flex items-center gap-2">
                                            <FaCarSide />
                                            <span>interstate Per Km:</span>
                                        </div>
                                        <strong>₹35</strong>
                                    </div>

                                    <div className="flex justify-between items-center rounded-lg gap-2 p-2 bg-[#ffffff]">
                                        <div className="flex items-center gap-2 ">
                                            {/* <IoMdTrendingUp />  */}
                                            <HiSparkles />
                                            {/* <img src='\icons\clusterlogo.png' alt='Intracity' className='text-black '></img> */}
                                            <span>interstate Extra Km:</span>
                                        </div>
                                        <strong>₹35</strong>
                                    </div>

                                    <div className="flex justify-between items-center rounded-lg gap-2 p-2 bg-[#ffffff]">
                                        <div className="flex items-center gap-2">
                                            {/* <IoMdTrendingUp /> */}
                                            <MdAccessTime />
                                            <span>interstate Waiting:</span>
                                        </div>
                                        <strong>₹35</strong>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>
                    <div className="flex flex-col rounded-xl shadow-lg overflow-hidden">
                        {/* Header: MINI + Description + Services */}
                        <div className="flex justify-between items-center  bg-[linear-gradient(90deg,_#9333EA_0%,_#9D174D_100%)] px-6 py-4">
                            {/* Left: Icon + Labels */}
                            <div className="flex items-center gap-3">
                                <div className="bg-white/20 rounded-lg p-2">
                                    <TbCarSuv className="text-white text-xl" />
                                </div>
                                <div className="flex flex-col leading-tight">
                                    <span className="text-white font-bold text-xl">Suv</span>
                                    <span className="text-white text-sm">Premium vehicle category</span>
                                </div>
                            </div>
                            {/* Right: Services Count */}
                            <div className="bg-white/20 border border-white/30 px-4 py-1 rounded-full text-white font-medium text-sm">
                                4 Services
                            </div>
                        </div>
                        {/* Fare Cards Row */}
                        <div className="grid grid-cols-4 gap-4 bg-white p-4">
                            {/* Single Fare Card - IntraCity */}


                            <div className="rounded-lg overflow-hidden shadow border border-gray-100">
                                {/* Card Header with Gradient and Edit Icon */}
                                {/* Card Header with Gradient and Edit Icon */}



                                <div className="flex justify-between items-center p-6 bg-[linear-gradient(90deg,_#22D3EE_0%,_#3B82F6_50%,_#4F46E5_100%)]">
                                    <div className="flex items-center gap-2">
                                        <Image
                                            src="/icons/IntraCity_Icon.svg"
                                            alt="IntraCity"
                                            className="w-6 h-6"
                                        />
                                        <span className="text-white font-semibold text-sm">IntraCity</span>
                                    </div>
                                    <button onClick={() => {
                                        handleShowModalComponent('price');
                                    }}
                                        className='transition-transform duration-300 hover:scale-[1.5]'>
                                        <CiEdit className="text-white cursor-pointer" />
                                    </button>
                                </div>

                                {/* Card Body */}
                                <div className="flex flex-col gap-3 bg-gradient-to-b from-gray-50 to-white px-4 py-4 space-y-3 text-sm text-gray-800 p-2">
                                    <div className="flex justify-between items-center rounded-lg gap-2 p-2  bg-[#ffffff] ">
                                        <div className="flex items-center gap-2">
                                            <IoMdTrendingUp />
                                            <span>Base Fare:</span>
                                        </div>
                                        <strong>₹350</strong>
                                    </div>

                                    <div className="flex justify-between items-center rounded-lg gap-2  p-2 bg-[#ffffff]">
                                        <div className="flex items-center gap-2">
                                            <FaCarSide />
                                            <span>IntraCity Per Km:</span>
                                        </div>
                                        <strong>₹35</strong>
                                    </div>

                                    <div className="flex justify-between items-center rounded-lg gap-2 p-2 bg-[#ffffff]">
                                        <div className="flex items-center gap-2 ">
                                            {/* <IoMdTrendingUp />  */}
                                            <HiSparkles />
                                            {/* <img src='\icons\clusterlogo.png' alt='Intracity' className='text-black '></img> */}
                                            <span>IntraCity Extra Km:</span>
                                        </div>
                                        <strong>₹35</strong>
                                    </div>

                                    <div className="flex justify-between items-center rounded-lg gap-2 p-2 bg-[#ffffff]">
                                        <div className="flex items-center gap-2">
                                            {/* <IoMdTrendingUp /> */}
                                            <MdAccessTime />
                                            <span>IntraCity Waiting:</span>
                                        </div>
                                        <strong>₹35</strong>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-lg overflow-hidden shadow border border-gray-100">
                                {/* Card Header with Gradient and Edit Icon */}
                                <div className="flex justify-between items-center p-6 bg-[linear-gradient(90deg,_#3B82F6_0%,_#4F46E5_50%,_#7E22CE_100%)]">
                                    <div className="flex items-center gap-2">
                                        <Image
                                            src="/icons/Local_Service_icon.svg"
                                            alt="Local"
                                            className="w-6 h-6"
                                        />
                                        <span className="text-white font-semibold text-sm">Local</span>
                                    </div>
                                    <button onClick={() => {
                                        handleShowModalComponent('price');
                                    }}
                                        className='transition-transform duration-300 hover:scale-[1.5]'>
                                        <CiEdit className="text-white cursor-pointer" />
                                    </button>
                                </div>

                                {/* Card Body */}
                                <div className=" flex flex-col gap-3 bg-gradient-to-b from-gray-50 to-white px-4 py-4 space-y-3 text-sm text-gray-800 p-2">
                                    <div className="flex justify-between items-center rounded-lg gap-2 p-2  bg-[#ffffff] ">
                                        <div className="flex items-center gap-2">
                                            <IoMdTrendingUp />
                                            <span>Local Base Fare:</span>
                                        </div>
                                        <strong>₹200</strong>
                                    </div>

                                    <div className="flex justify-between items-center rounded-lg gap-2  p-2 bg-[#ffffff]">
                                        <div className="flex items-center gap-2">
                                            <FaCarSide />
                                            <span>Local Per Km:</span>
                                        </div>
                                        <strong>₹20</strong>
                                    </div>

                                    <div className="flex justify-between items-center rounded-lg gap-2 p-2 bg-[#ffffff]">
                                        <div className="flex items-center gap-2 ">
                                            {/* <IoMdTrendingUp />  */}
                                            <HiSparkles />
                                            {/* <img src='\icons\clusterlogo.png' alt='Intracity' className='text-black '></img> */}
                                            <span>Local Extra Km:</span>
                                        </div>
                                        <strong>₹20</strong>
                                    </div>

                                    <div className="flex justify-between items-center rounded-lg gap-2 p-2 bg-[#ffffff]">
                                        <div className="flex items-center gap-2">
                                            {/* <IoMdTrendingUp /> */}
                                            <MdAccessTime />
                                            <span>Local Waiting:</span>
                                        </div>
                                        <strong>₹20</strong>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-lg overflow-hidden shadow border border-gray-100">
                                {/* Card Header with Gradient and Edit Icon */}
                                <div className="flex justify-between items-center p-6 bg-[linear-gradient(90deg,_#4F46E5_0%,_#7E22CE_50%,_#9D174D_100%)]">
                                    <div className="flex items-center gap-2">
                                        <Image
                                            src="/icons/InterCity_Icon.svg"
                                            alt="intercity"
                                            className="w-6 h-6"
                                        />
                                        <span className="text-white font-semibold text-sm">Intercity</span>
                                    </div>
                                    <button onClick={() => {
                                        handleShowModalComponent('price');
                                    }}
                                        className='transition-transform duration-300 hover:scale-[1.5]'>
                                        <CiEdit className="text-white cursor-pointer" />
                                    </button>
                                </div>

                                {/* Card Body */}
                                <div className=" flex flex-col gap-3 bg-gradient-to-b from-gray-50 to-white px-4 py-4 space-y-3 text-sm text-gray-800 p-2">
                                    <div className="flex justify-between items-center rounded-lg gap-2 p-2  bg-[#ffffff] ">
                                        <div className="flex items-center gap-2">
                                            <IoMdTrendingUp />
                                            <span>Base Fare:</span>
                                        </div>
                                        <strong>₹300</strong>
                                    </div>

                                    <div className="flex justify-between items-center rounded-lg gap-2  p-2 bg-[#ffffff]">
                                        <div className="flex items-center gap-2">
                                            <FaCarSide />
                                            <span>intercity Per Km:</span>
                                        </div>
                                        <strong>₹30</strong>
                                    </div>

                                    <div className="flex justify-between items-center rounded-lg gap-2 p-2 bg-[#ffffff]">
                                        <div className="flex items-center gap-2 ">
                                            {/* <IoMdTrendingUp />  */}
                                            <HiSparkles />
                                            {/* <img src='\icons\clusterlogo.png' alt='Intracity' className='text-black '></img> */}
                                            <span>intercity Extra Km:</span>
                                        </div>
                                        <strong>₹30</strong>
                                    </div>

                                    <div className="flex justify-between items-center rounded-lg gap-2 p-2 bg-[#ffffff]">
                                        <div className="flex items-center gap-2">
                                            {/* <IoMdTrendingUp /> */}
                                            <MdAccessTime />
                                            <span>intercity Waiting:</span>
                                        </div>
                                        <strong>₹30</strong>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-lg overflow-hidden shadow border border-gray-100">
                                {/* Card Header with Gradient and Edit Icon */}
                                <div className="flex justify-between items-center p-6 bg-[linear-gradient(90deg,_#7E22CE_0%,_#9D174D_50%,_#881337_100%)]">
                                    <div className="flex items-center gap-2">
                                        <Image
                                            src="/icons/InterState_Icon.svg"
                                            alt="Interstate"
                                            className="w-6 h-6"
                                        />
                                        <span className="text-white font-semibold text-sm">Interstate</span>
                                    </div>
                                    <button onClick={() => {
                                        handleShowModalComponent('price');
                                    }}
                                        className='transition-transform duration-300 hover:scale-[1.5]'>
                                        <CiEdit className="text-white cursor-pointer" />
                                    </button>
                                </div>

                                {/* Card Body */}
                                <div className="flex flex-col gap-3 bg-gradient-to-b from-gray-50 to-white px-4 py-4 space-y-3 text-sm text-gray-800 p-2">
                                    <div className="flex justify-between items-center rounded-lg gap-2 p-2  bg-[#ffffff] ">
                                        <div className="flex items-center gap-2">
                                            <IoMdTrendingUp />
                                            <span>Base Fare:</span>
                                        </div>
                                        <strong>₹400</strong>
                                    </div>

                                    <div className="flex justify-between items-center rounded-lg gap-2  p-2 bg-[#ffffff]">
                                        <div className="flex items-center gap-2">
                                            <FaCarSide />
                                            <span>interstate Per Km:</span>
                                        </div>
                                        <strong>₹35</strong>
                                    </div>

                                    <div className="flex justify-between items-center rounded-lg gap-2 p-2 bg-[#ffffff]">
                                        <div className="flex items-center gap-2 ">
                                            {/* <IoMdTrendingUp />  */}
                                            <HiSparkles />
                                            {/* <img src='\icons\clusterlogo.png' alt='Intracity' className='text-black '></img> */}
                                            <span>interstate Extra Km:</span>
                                        </div>
                                        <strong>₹35</strong>
                                    </div>

                                    <div className="flex justify-between items-center rounded-lg gap-2 p-2 bg-[#ffffff]">
                                        <div className="flex items-center gap-2">
                                            {/* <IoMdTrendingUp /> */}
                                            <MdAccessTime />
                                            <span>interstate Waiting:</span>
                                        </div>
                                        <strong>₹35</strong>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
                <div className='flex justify-center'>
                    <button className='flex items-center transition-transform duration-300 hover:scale-105 gap-2 text-white rounded-full justify-center bg-[linear-gradient(90deg,_#2563EB_0%,_#4F46E5_50%,_#9333EA_100%)] p-2'>
                        <Image src='/icons/clusterlogo.png' alt='ClusterLogo' className='w-5 h-5'></Image>
                        <span className='text-white font-solid text-sm '>Save Cluster Configuration</span>
                        <IoMdTrendingUp className="text-white cursor-pointer" />

                    </button>
                </div>
            </div>

            <ClusterModal
                type={modalType}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

        </div>
    )
}


export default PatnaRenter