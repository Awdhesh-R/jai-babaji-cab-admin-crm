'use client'
import React, { useState } from 'react'
import { IoHomeOutline } from "react-icons/io5";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { FaMapMarkerAlt, FaCar, FaClock, FaUser } from "react-icons/fa";
import { FiArrowRightCircle } from "react-icons/fi";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const rides = [
    {
        status: 'Upcoming',
        from: 'Darbhanga Tower',
        to: 'Madhubni Harlakhi',
        time: '15 Jan, 02:30 pm',
        driver: 'Jethalal Gada',
        phone: '+91-9693189968',
        cab: 'BR-12-AB-1234',
        fare: '₹450.00',
        esTime: '45m',
        estKm: '12Km'
    },
    {
        status: 'Upcoming',
        from: 'Darbhanga Tower',
        to: 'Madhubni Harlakhi',
        time: '15 Jan, 02:30 pm',
        driver: 'Jethalal Gada',
        phone: '+91-9693189968',
        cab: 'BR-12-AB-1234',
        fare: '₹450.00',
        esTime: '35m',
        estKm: '10Km'
    },
    {
        status: 'Upcoming',
        from: 'Darbhanga Tower',
        to: 'Madhubni Harlakhi',
        time: '15 Jan, 02:30 pm',
        driver: 'Jethalal Gada',
        phone: '+91-9693189968',
        cab: 'BR-12-AB-1234',
        fare: '₹450.00',
        esTime: '80m',
        estKm: '37Km'
    },
    {
        status: 'Upcoming',
        from: 'Darbhanga Tower',
        to: 'Madhubni Harlakhi',
        time: '15 Jan, 02:30 pm',
        driver: 'Jethalal Gada',
        phone: '+91-9693189968',
        cab: 'BR-12-AB-1234',
        fare: '₹450.00',
        esTime: '120m',
        estKm: '90Km'
    }
];

const statuses = ['Upcoming', 'Completed', 'Cancelled'];

const CabRideLists = () => {
    const [activeTab, setActiveTab] = useState('Upcoming');
    const router = useRouter();

    return (
        <div className='space-y-2'>
            <div className="border border-[#babbba] p-2 flex items-center gap-2 bg-white dark:bg-gray-900 mt-1">
                <IoHomeOutline className="text-gray-400" size={18} />
                <MdKeyboardDoubleArrowLeft className="text-gray-400 w-4 h-4" />
                <span className="text-sm text-gray-600 font-medium">Fleet Dashboard</span>
                <MdKeyboardDoubleArrowLeft className="text-gray-400 w-4 h-4" />
                <Link href="#" className="text-sm text-gray-600 font-medium hover:underline hover:text-blue-600">Active Fleets Kumar Murari</Link>
                <MdKeyboardDoubleArrowLeft className="text-gray-400 w-4 h-4" />
                <Link href="#" className="text-sm text-gray-600 font-medium hover:underline hover:text-blue-600">Total Cabs</Link>
                <MdKeyboardDoubleArrowLeft className="text-gray-400 w-4 h-4" />
                <Link href="#" className="text-sm text-gray-600 font-medium hover:underline hover:text-blue-600">Cab Details - BR 12 AB 1234</Link>
                <MdKeyboardDoubleArrowLeft className="text-gray-400 w-4 h-4" />
                <Link href="#" className="text-sm text-blue-600 font-medium hover:underline">Cab Details - BR 12 AB 1234 Ride-Lists</Link>
            </div>
            <div className="px-4 py-2">
                <div className="flex justify-between items-center mb-2">
                    <div className='px-4 py-1 bg-[#BFDBFE] rounded-full'>
                        <span className="text-sm text-blue-600 font-medium">BR 12 AB 1234</span>
                    </div>
                    <Link href="/fleetManagement/fleetDetails" className="text-sm text-blue-600 border border-[#BFDBFE] rounded-[4px] px-4 py-1 font-medium hover:underline">
                        ← Back to Fleet
                    </Link>
                </div>
            </div>
            <div className="p-4 md:p-6 border rounded-xl bg-white shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Cab Total Ride Lists</h2>
                <div className="flex justify-between items-center mb-6 bg-gray-50 p-1 rounded-md shadow-inner overflow-auto w-full">
                    {statuses.map((status) => {
                        const isActive = activeTab === status;

                        let activeClasses = '';
                        if (status === 'Completed' && isActive) {
                            activeClasses = 'bg-gradient-to-r from-green-400 to-green-900 text-white';
                        } else if (status === 'Cancelled' && isActive) {
                            activeClasses = 'bg-gradient-to-r from-red-400 to-red-700 text-white';
                        } else if (isActive) {
                            activeClasses = 'bg-blue-600 text-white';
                        }

                        return (
                            <button
                                key={status}
                                onClick={() => setActiveTab(status)}
                                className={`flex-1 text-center px-4 py-2 rounded-md font-medium text-sm transition whitespace-nowrap ${isActive ? activeClasses : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                {status}
                                <span className={`ml-2 font-semibold inline-block rounded-full px-2 py-0.5 ${isActive ? 'bg-white text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                                    {rides.filter((ride) => ride.status === status).length}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="flex flex-col gap-4">
                    {rides
                        .filter((ride) => ride.status === activeTab)
                        .map((ride, index) => (
                            <div
                                key={index}
                                className="bg-white border rounded-xl p-4 shadow hover:shadow-md transition flex flex-col md:flex-row gap-4"
                            >
                                {/* Left Section */}
                                <div className="w-full md:w-3/5 flex flex-col justify-between">
                                    <div>
                                        {/* Status Label */}
                                        <span className="text-xs font-semibold bg-[#EFF6FF] text-[#3A72ED] px-4 py-1 rounded-full capitalize mb-2 inline-block">
                                            {ride.status}
                                        </span>

                                        {/* From → To and Driver Info */}
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                            <div className="flex items-center gap-2 text-sm text-gray-800 font-medium">
                                                <FaMapMarkerAlt className="text-gray-500" />
                                                {ride.from} → {ride.to}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <FaUser className="text-gray-400" />
                                                <span className="font-semibold text-gray-800">{ride.driver}</span>
                                                <span className="text-gray-500">{ride.phone}</span>
                                            </div>
                                        </div>

                                        {/* Time & Cab Info */}
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mt-2">
                                            <div className="flex items-center gap-8 text-sm text-gray-800 font-medium">
                                                <div className='flex items-center gap-1'>
                                                    <FaClock className="text-gray-400" />
                                                    <span>{ride.time}</span>
                                                </div>
                                                <div className='flex items-center gap-1'>
                                                    <div className='h-1 w-1 rounded-full bg-[#6B7280]'></div>
                                                    <span>{ride.esTime}</span>
                                                </div>
                                                <div className='flex items-center gap-1'>
                                                    <div className='h-1 w-1 rounded-full bg-[#6B7280]'></div>
                                                    <span>{ride.estKm}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <FaCar className="text-gray-400" />
                                                <span>{ride.cab}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Section - Fare */}
                                <div className="w-full md:w-2/5 flex md:justify-end items-top md:items-end flex-col gap-4">
                                    <div className="text-white text-[14px] bg-gradient-to-r from-[#10B981] to-[#16A34A] px-4 py-1 rounded-md w-max md:self-end">
                                        {ride.fare}
                                    </div>
                                    <button 
                                        onClick={()=> router.push('/fleetManagement/fleetRideDetail')}
                                        className='border border-[#005FE2] rounded-md flex items-center gap-2 px-2 py-1'
                                    >
                                        <span className='text-[#005FE2] text-[14px]'>View Details</span>
                                        <FiArrowRightCircle className='text-[#005FE2]' />
                                    </button>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    )
}

export default CabRideLists