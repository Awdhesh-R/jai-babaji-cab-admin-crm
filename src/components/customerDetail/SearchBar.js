'use client';
import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter } from 'react-icons/fi';
import { FaChevronLeft, FaChevronRight, FaChevronDown } from 'react-icons/fa';
import AutoComplete from '../autocomplete/AutoComplete';
import { apiClient } from '@/app/lib/apiClient';

export default function SearchBar() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);
  const [mobile, setMobile] = useState('');
  const [cabReg, setCabReg] = useState('');
  const [cabRegData, setCabRegData] = useState([]);
  const [srcCity, setSrcCity] = useState('');
  const [dstCity, setDstCity] = useState('');
  const [searchData, setSearchData] = useState([]);
  const [cityData, setCityData] = useState([]);

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getMonthDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    const dates = [];
    let dayCounter = 1;

    for (let i = 0; i < 6; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if ((i === 0 && j < firstDay) || dayCounter > lastDate) {
          week.push(null);
        } else {
          week.push(dayCounter++);
        }
      }
      dates.push(week);
    }
    return dates;
  };

  const handleDateClick = (day, isStart) => {
    const baseDate = isStart ? startDate : endDate;
    const newDate = new Date(
      baseDate.getFullYear(),
      baseDate.getMonth(),
      day
    );

    if (isStart) {
      setStartDate(newDate);
      setOpenStart(false);
    } else {
      setEndDate(newDate);
      setOpenEnd(false);
    }
  };

  const renderCalendar = (date, setDate, isStart) => (
    <div className="absolute left-0 top-full mt-2 w-full bg-white border border-gray-200 shadow-xl rounded-md z-50">
      <div className="flex justify-between items-center px-4 py-2 border-b text-[12px] font-semibold text-gray-700">
        <span>
          {date.toLocaleString("default", { month: "long" })}{" "}
          {date.getFullYear()}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() =>
              setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1))
            }
          >
            <FaChevronLeft size={12} />
          </button>
          <button
            onClick={() =>
              setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1))
            }
          >
            <FaChevronRight size={12} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 px-2 pt-2 text-center text-[12px] text-gray-700">
        {daysOfWeek.map((day) => (
          <div key={day} className="font-medium text-gray-500">
            {day}
          </div>
        ))}
        {getMonthDays(date).map((week, i) =>
          week.map((day, j) => (
            <div
              key={`${i}-${j}`}
              className={`w-9 h-9 flex items-center justify-center rounded-md cursor-pointer 
                ${day === date.getDate() ? "bg-black text-white" : ""}
                ${day ? "hover:bg-gray-200" : "text-gray-300"}`}
              onClick={() => day && handleDateClick(day, isStart)}
            >
              {day || ""}
            </div>
          ))
        )}
      </div>
    </div>
  );

  useEffect(() => {
    const searchRides = async () => {
      try {
        const response = await apiClient('GET', `/ride_management/searchRide?keyword=${mobile}`);
        if (response && response?.data?.length > 0) {
          setSearchData(response?.data);
        }
      } catch (error) {
        console.log("Error fetching rides:", error.message || error);
      }
    };
    searchRides();
  }, [mobile]);

  // SEARCH RIDES USING CAB REGISTRATION
  useEffect(() => {
    const searchRideByCabRegistration = async () => {
      let payData = { searchTerm: cabReg };
      try {
        const response = await apiClient('POST', `/rb_cabs/rbCabsSearch`, JSON.stringify(payData), true);
        if (response && response.data?.length > 0) {
          setCabRegData(response.data);
          // console.log("cab reg data", cabRegData);
        }
      } catch (error) {
        console.log("Error fetching rides:", error.message || error);
      }
    };
    if (cabReg.length > 3) {
      searchRideByCabRegistration();
    } else {
      setCabRegData([]); // clear dropdown if input is too short
    }
  }, [cabReg]);

  // SEARCH CITIES USING SOURCE AND DESTINATION
  useEffect(() => {
    const searchCities = async () => {
      try {
        const response = await apiClient('POST', `/City/searchCity`, { "cityName": srcCity ? srcCity : dstCity });
        if (response && response.data?.length > 0) {
          // console.log('data', response.data);
          setCityData(response.data);
        }
      } catch (error) {
        console.log("Error fetching rides:", error.message || error);
      }
    };
    searchCities();
  }, [srcCity, dstCity]);

  return (
    <div className="w-full flex flex-col md:flex-row gap-4">
      {/* Left Section: Inputs */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          {/* URID / Mobile Input */}
          <div className="relative w-full">
            <FiSearch className="absolute top-3 left-4 text-gray-400" />
            <AutoComplete
              options={searchData}
              value={mobile}
              type="text"
              onChange={(text) => setMobile(text)}
              name="mobile"
              fieldType="Mobile"
              placeholder="Search by URI ID / Mobile No"
              className="px-4 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-white focus:outline-none w-full text-[12px]"
            />
          </div>
        </div>

        {/* SEARCH CAB BY CAB REGISTRATION NUMBER  */}
        <div className='ml-2'>
          {/* Cab Registration Input */}
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search by Cab..."
              value={cabReg}
              onChange={(e) => setCabReg(e.target.value)}
              className="px-4 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-white focus:outline-none w-full text-[12px]"
            />
            {cabRegData.length > 0 && cabRegData.some(cab => cab.cab_reg !== cabReg) && (
              <ul className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto z-50">
                {cabRegData.map((cab, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      setCabReg(cab?.cab_reg);
                      setCabRegData([]); 
                    }}
                    className="px-4 py-1 text-[12px] cursor-pointer hover:bg-orange-100"
                  >
                    {cab?.cab_reg}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Right Section: Date Filter */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 min-w-[220px]">
        {/* Start Date */}
        <div className="relative">
          <div
            className="flex items-center justify-between cursor-pointer bg-gray-100 px-4 py-1.5 rounded-md text-[12px] text-gray-800 border border-gray-300 shadow-sm w-full"
            onClick={() => {
              setOpenStart(!openStart);
              setOpenEnd(false);
            }}
          >
            <div className="flex items-center gap-2">
              {/* <FiFilter className="text-gray-500" /> */}
              <span className="font-semibold">Start Date:</span>
              <span>{formatDate(startDate)}</span>
            </div>
            <FaChevronDown size={14} className="text-gray-500" />
          </div>
          {openStart && renderCalendar(startDate, setStartDate, true)}
        </div>

        {/* End Date */}
        <div className="relative">
          <div
            className="flex items-center justify-between cursor-pointer bg-gray-100 px-4 py-1.5 rounded-md text-[12px] text-gray-800 border border-gray-300 shadow-sm w-full"
            onClick={() => {
              setOpenEnd(!openEnd);
              setOpenStart(false);
            }}
          >
            <div className="flex items-center gap-2">
              {/* <FiFilter className="text-gray-500" /> */}
              <span className="font-semibold">End Date:</span>
              <span>{formatDate(endDate)}</span>
            </div>
            <FaChevronDown size={14} className="text-gray-500" />
          </div>
          {openEnd && renderCalendar(endDate, setEndDate, false)}
        </div>
      </div>

    </div>
  );

}