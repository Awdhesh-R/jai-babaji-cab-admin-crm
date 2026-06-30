'use client';
import React, { useState, useEffect } from 'react';
import { useSidebar } from '../sidebar/SidebarContext';
import { apiClient } from '@/app/lib/apiClient';
import { useSelector } from 'react-redux'; // Added useSelector

import {
  Activity,
} from "lucide-react";

export default function Header() {
  const { expanded, setExpanded } = useSidebar();
  const [userData, setUserData] = useState([]);
  
  // Get header data from Redux store
  const headerData = useSelector((state) => state.header);

  // console.log("ha bhai header me update karna hai na  ",headerData);

  return (
    <div
      className={`fixed flex justify-between items-center pl-6 py-4 bg-white z-50 shadow w-full
       `}
    >
      <div className='flex flex-col flex-1 '>
        <h2 className=" text-[12px] md:text-2xl font-bold bg-gradient-to-br from-[#FFC403] to-[#F97316] bg-clip-text text-transparent">
          {headerData?.title || 'RodBez Fleet'}
        </h2>
        <p className="text-[8px] md:text-sm text-gray-600">
          {headerData?.subtitle || 'Real-time fleet management and analytics'}
        </p>
      </div>
      <div className={`flex ${!expanded ? "mr-[350px]" : "mr-[80px]"}`}>
        <button className="flex items-center gap-2 md:px-4 md:py-2 rounded-md bg-[#15803D33] border border-[#15803D66] text-[8px] md:text-sm font-medium hover:bg-[#15803D66] transition text-green-700 ">
          <Activity className="w-4 h-4" />
          Live Monitoring
        </button>
      </div>
    </div>
  );
}