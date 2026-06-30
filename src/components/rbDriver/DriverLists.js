'use client';

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { ArrowLeft, Eye, Phone, Star } from 'lucide-react';
import { LuSlidersHorizontal, LuChevronDown, LuCheck } from "react-icons/lu";
import DriverCards from './cards/DriverCards';
import { apiClient } from '@/app/lib/apiClient';

const DriverLists = () => {
    const [driverList, setDriverList] = useState([]);
    const [querry, setQuerry] = useState("");
    const router = useRouter();

    const getAllDriver = async () => {
        try {
            const response = await apiClient("GET", "/rb_drivers/getAllDriver", '', true);
            console.log(response);
            setDriverList(response?.data);
        } catch (error) {
            console.error(error);
            setDriverList([]);
        }
    }
    const getFilteredDriver = async (querry) => {
        try {
            const response = await apiClient("POST", `/rb_drivers/serch-driver`, {
                searchQuery: querry
            }, true);
            if(response.success || response.status) {
                setDriverList(response?.data);
            } else {
                setDriverList([]);
            }

        } catch (err){
            console.error(err);
        } finally {

        }
    }
    useEffect(() => {
        getAllDriver();
    }, []);


    useEffect(() => {
        if (querry?.length > 3) {
            setTimeout(() => {
                getFilteredDriver(querry);
            }, 400)
        } else {
            getAllDriver();
        }
    }, [querry])


    return (
        <div>
            <div className="flex flex-col p-4 gap-2">
                <div className='flex items-center justify-between'>
                    {/* Back to Dashboard */}
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="flex items-center text-sm text-blue-600 hover:underline mb-2 sm:mb-0"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back to Dashboard
                    </button>

                    {/* Center Title */}
                    <h1 className="text-xl font-semibold text-gray-900 flex-grow text-center sm:text-left sm:flex-grow-0">
                        All Drivers Lists
                    </h1>
                </div>

                {/* Search + Filters */}
                <div className="w-[80%] flex flex-wrap items-center gap-4">
                    {/* Search */}
                    <div className="relative flex-1 max-w-[50%] shadow-sm">
                        <input
                            type="text"
                            value={querry || ""}
                            onChange={e=> setQuerry(e.target.value)}
                            placeholder="Search by name, mobile, or ID"
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-full"
                        />
                        <svg
                            className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-4.35-4.35M5 11a6 6 0 1112 0 6 6 0 01-12 0z"
                            />
                        </svg>
                    </div>

                    {/* Filter Dropdown */}
                    <button className="w-[15%] flex items-center justify-between border border-gray-300 rounded-full px-4 py-2 text-sm text-gray-700 shadow-sm">
                        <LuSlidersHorizontal className="w-4 h-4 mr-1" />
                        <span>All</span>
                        <LuChevronDown className="w-4 h-4 mr-1" />
                    </button>

                    <button className="w-[15%] flex items-center justify-between border border-gray-300 rounded-full px-4 py-2 text-sm text-gray-700 shadow-sm">
                        <LuCheck className="w-4 h-4 mr-1" />
                        <span>All</span>
                        <LuChevronDown className="w-4 h-4 mr-1" />
                    </button>
                </div>
            </div>
            <DriverCards driver={driverList} />
        </div>
    )
}

export default DriverLists