"use client";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { FaPlus } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { useDispatch } from 'react-redux';
import { setHeader } from '@/redux/features/headerSlice';

import { useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BsEye } from "react-icons/bs";

import { FaChevronDown } from "react-icons/fa";
import { MdCalendarToday } from "react-icons/md";
import DateRangePicker from "@/components/common/DateRange";
import moment from "moment";

import {
  Calendar,
  Car,
  Users,
  Plus,
  Globe,
  MapPin,
  DollarSign,
  LayoutGrid,
  Clock,
  AlertCircle,
  Activity,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import {

  LineChart as ConfirmLineChart,
  Line as ConfirmLine,
  CartesianGrid as ConfirmCartesianGrid,    
  BarChart,
  Bar,
} from "recharts";
import React, { useCallback, useEffect } from "react";
import { apiClient } from "@/app/lib/apiClient";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];



function AdminStatsCard({ id, name, dates, values, isCancel = false }) {
  const router = useRouter();

  const handleViewDetails = () => {
    // router.push(`/admin_Management/admin/details/id/${id}`);
    router.push(`/admin_Management/admin/details/${id}`);

  };

  return (
    <div className="bg-white shadow rounded-lg p-4 border border-[#e9f6ef]">
      <div className="flex flex-col-2 sm:flex-row sm:items-center justify-between gap-2 mb-2 w-full">
        <span className="font-semibold text-sm sm:text-base">{name}</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-7  justify-between items-center gap-1 my-4">
        {dates.length> 0 && dates.map((day, idx) => (
          <div
            key={day + idx}
            className={`flex flex-col items-center justify-center flex-1 min-w-[52px] h-[48px] rounded-lg border ${
              isCancel ? "bg-red-50 border-red-100 text-red-500" : "bg-green-50 border-green-100 text-green-700"
            }`}
          >
            <span className={`text-xs font-medium ${isCancel ? "text-[#BE123C]" : "text-[#15803D]"}`}>{moment(day).format("ddd")}</span>
            <span className="font-bold text-sm text-[#374151]">
              {values[idx] !== undefined ? values[idx] : "--"}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={handleViewDetails}
        className={`w-full flex gap-2 items-center justify-center border rounded-lg py-1 font-medium text-sm transition ${
          isCancel ? "border-red-100 text-red-700 hover:bg-red-100" : "border-[#d1e7dd] text-[#15803D] hover:bg-green-50"
        }`}
      >
        <BsEye className="text-sm" />
        View Details
      </button>
    </div>
  );
}




function CancelLineChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <LineChart
        data={data.map((value, idx) => ({
          day: days[idx],
          value,
        }))}
        margin={{ left: 10, right: 10, top: 10, bottom: 0 }}
      >
        <XAxis
          dataKey="day"
          tick={{ fill: "#9CA3AF", fontSize: 12 }}
          stroke="#e5e7eb"
        />
        <YAxis
          tick={{ fill: "#9CA3AF", fontSize: 12 }}
          stroke="#e5e7eb"
        />
        <CartesianGrid stroke="#e5e7eb" strokeDasharray="5 5" />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#BE123C"
          fill="#BE123C"
          strokeWidth={3}
          dot={{ r: 5, fill: "#BE123C" }}
          activeDot={{ r: 7 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}


const FleetCommandCenter = () => {
  const router = useRouter();
  const [cancelledRideData, setCancelledRidesData] = React.useState([]);
  const [confirmedRideData, setConfirmedRidesData] = React.useState([]);
  const [completedRideData, setCompletedRidesData] = React.useState([]);
  const [revenueData, setRevenueData] = React.useState([]);
  const [bookingDetails, setBookingDetails] = React.useState();
  const [resourceDetails, setResourceDetails] = React.useState();
  const [futureConfirmedRides, setFutureConfirmedCount] = React.useState();

    const [showConfirm, setShowConfirm] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  




    const [dateFilter, setDateFilter] = useState({
    startDate: moment().subtract(6, "days").format("YYYY-MM-DD"),
    endDate: moment().format("YYYY-MM-DD"),
    key: "selection",
  });

  const dispatch = useDispatch();

  const fetchDetails = useCallback(async () => {
    try {
      const response = await apiClient("GET", '/rideConnectionManagement/dashboard');
      if(response?.success || response?.status){
        setRevenueData(response?.data?.analytics?.revenueTrendsLast7Days);
        setCancelledRidesData(response?.data?.analytics?.cancelledLast7Days);
        setConfirmedRidesData(response?.data?.analytics?.confirmedLast7Days);
        setCompletedRidesData(response?.data?.analytics?.ridesCompletedLast7Days);
        setFutureConfirmedCount(response?.data?.analytics?.ridesConfirmedNext7Days);
        setBookingDetails(response?.data?.bookingStatus);
        setResourceDetails(response?.data?.resources);
        // console.log('User Details:', response.data);
      }
      // console.log('User Details:', data);
      // setUserData(data); // Assuming you want to store this in state
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  },[]);

  useEffect(()=>{
    fetchDetails();
  }, [fetchDetails]);

  






  
  const today = moment().format("YYYY-MM-DD");
  const sevenDaysAgo = moment().subtract(6, "days").format("YYYY-MM-DD");

  const [confirmations, setConfirmations] = useState([]);
  const [cancellations, setCancellations] = useState([]);




useEffect(() => {
  async function fetchStats() {
    try {
      const json = await apiClient(
        "GET",
        `/dashboard/employee-activity-stats?startDate=${dateFilter.startDate}&endDate=${dateFilter.endDate}`
      );

      if (json.success && Array.isArray(json.data)) {
        setConfirmations(
          json.data.map((user) => ({
            id: user.id,
            name: user.name,
            dates: user.data && user.data.length > 0? user.data.map((d) => d.date): [],
            values: user.data && user.data.length > 0? user.data.map((d) => d.stats.confirmed): [],
          }))
        );
        setCancellations(
          json.data.map((user) => ({
            id: user.id,
            name: user.name,
            dates: user.data && user.data.length > 0? user.data.map((d) => d.date): [],
            values: user.data && user.data.length > 0? user.data.map((d) => d.stats.cancelled): [],
          }))
        );
      } else {
        setConfirmations([]);
        setCancellations([]);
      }
    } catch (err) {
      console.error("API Error: ", err);
      setConfirmations([]);
      setCancellations([]);
    }
  }
  fetchStats();
}, [dateFilter]);



  const updateHeader = () => {
    dispatch(setHeader({
      title: 'My Custom Title',
      subtitle: 'Custom subtitle here'
    }));
  };
  // updateHeader();

  return (
    <div className="w-full bg-green-50 min-h-screen">
      <div className="flex flex-col gap-0 w-full bg-green-50">
        {/* Top Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 sm:p-6 bg-white mx-2 mt-4 rounded-xl">
          {/* Booking Status */}
          <div className="bg-white shadow rounded-2xl p-4 sm:p-5 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-gray-700">
                BOOKING STATUS
              </h3>
              <Calendar className="w-5 h-5 text-green-600" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center justify-center bg-green-50 rounded-lg py-4">
                <Clock className="w-5 h-5 text-green-600 mb-1" />
                <p className="text-xl font-bold text-green-600">
                  {bookingDetails?.upcoming || 0}
                </p>
                <span className="text-sm text-gray-600">Upcoming</span>
              </div>

              <div className="flex flex-col items-center justify-center bg-red-50 rounded-lg py-4">
                <AlertCircle className="w-5 h-5 text-red-600 mb-1" />
                <p className="text-xl font-bold text-red-600">
                  {bookingDetails?.pending || 0}
                </p>
                <span className="text-sm text-gray-600">Pending</span>
              </div>
            </div>
          </div>

          {/* RB Fleet */}
          <div className="bg-white shadow rounded-2xl p-4 sm:p-5 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-gray-700">RB FLEET</h3>
              <Car className="w-5 h-5 text-green-500" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center justify-center bg-green-50 rounded-lg py-4">
                <p className="text-xl font-bold text-green-600">
                  {resourceDetails?.activeCars || 0}
                </p>
                <span className="text-sm text-gray-600">Active Cars</span>
              </div>

              <div className="flex flex-col items-center justify-center bg-green-50 rounded-lg py-4">
                <p className="text-xl font-bold text-green-600">
                  {resourceDetails?.activeDrivers || 0}
                </p>
                <span className="text-sm text-gray-600">Drivers</span>
              </div>
            </div>
          </div>

          {/* Market Fleet */}
          <div className="bg-white shadow rounded-2xl p-4 sm:p-5 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-gray-700">
                MARKET FLEET
              </h3>
              <Car className="w-5 h-5 text-gray-500" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg py-4">
                <p className="text-xl font-bold text-gray-800">
                  {resourceDetails?.fleetCars || 0}
                </p>
                <span className="text-sm text-gray-600">Fleet Cars</span>
              </div>

              <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg py-4">
                <p className="text-xl font-bold text-gray-800">
                  {resourceDetails?.operators || 0}
                </p>
                <span className="text-sm text-gray-600">Operators</span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white shadow rounded-2xl px-4 sm:px-6 mx-2 mt-8 pb-6">
          {/* Header */}
          <div className="flex items-center gap-2 mb-3 mt-3">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-800">
              {"Confirmed Ride Next 10 Days"}
            </h2>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 gap-6">
            {/* Revenue Trend */}
            <div className="bg-green-800/5 rounded-xl p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold text-gray-700">
                  Confirmed Rides
                </h3>
                {/* <span className="text-xs px-2 py-1 rounded bg-white border border-[#15803D33] text-green-700 font-medium">
                  +12.5%
                </span> */}
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={futureConfirmedRides}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="day_iso" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#84CC16" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        {/* Confirm and Cancelled */}
        <div className="bg-white shadow rounded-2xl px-4 sm:px-6 mx-2 mt-8 pb-6">
          {/* Header */}
          <div className="flex items-center gap-2 mb-3 mt-3">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-800">
              {"Confirm & Cancelled Rides Analytics"}
            </h2>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <div className="bg-green-800/5 rounded-xl p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold text-gray-700">
                  Confirmed Rides
                </h3>
                {/* <span className="text-xs px-2 py-1 rounded bg-white border border-[#15803D33] text-green-700 font-medium">
                  +12.5%
                </span> */}
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={confirmedRideData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="day_name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#059669"
                    strokeWidth={2}
                    dot={{ r: 5, fill: "#059669" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Rides Completed */}
            <div className="bg-green-800/5 border rounded-xl p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold text-gray-700">
                  Cancelled Rides
                </h3>
                {/* <span className="text-xs px-2 py-1 rounded bg-white text-[#84CC16] font-medium border border-[#15803D33] ">
                  +8.3%
                </span> */}
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={cancelledRideData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="day_name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#059669"
                    strokeWidth={2}
                    dot={{ r: 5, fill: "#059669" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* my chanegs */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Confirm Rides */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <button
                onClick={() => setShowConfirm((p) => !p)}
                className="bg-gradient-to-r from-green-700 to-green-600 justify-between text-white text-xs rounded-lg mt-3 py-3 px-5 w-full font-semibold flex items-center"
              >
                View Confirm Details
                <span
                  className={`ml-2 transition-transform ${
                    showConfirm ? "rotate-180" : ""
                  }`}
                >
                  <FaChevronDown />
                </span>
              </button>
              {showConfirm && (
                <div className="mt-2 px-4 py-1 rounded-lg bg-[#15803D0D] border border-[#15803D1A]">
                  <div className="p-2 text-base font-semibold flex-col md:flex-row flex justify-between items-center gap-2 text-gray-800 mb-2">
                    <span>Admin Confirmations</span>
                   
                    <div className="flex flex-col  md:flex-row items-center gap-2">
                      <input
                        type="date"
                        value={dateFilter.startDate}
                        onChange={(e) =>
                          setDateFilter({
                            ...dateFilter,
                            startDate: e.target.value,
                          })
                        }
                        className="border rounded-md p-1 text-xs focus:outline-none"
                      />
                      <span className="text-gray-500 text-sm">to</span>
                      <input
                        type="date"
                        value={dateFilter.endDate}
                        onChange={(e) =>
                          setDateFilter({
                            ...dateFilter,
                            endDate: e.target.value,
                          })
                        }
                        className="border rounded-md p-1 text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                  {/* <div className="space-y-4 mb-5">
                {confirmations.map((d, idx) => (
                  <AdminStatsCard key={idx} {...d} />
                ))}
              </div> */}

                  <div className="space-y-4 mb-5 max-h-80 overflow-y-auto">
                    {confirmations.filter(stat=> stat.dates.length>0).map((d) => (
                      <AdminStatsCard
                        key={d.id}
                        id={d.id} // important for routing
                        name={d.name}
                        dates={d.dates}
                        values={d.values}
                        isCancel={false}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Cancel Rides */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <button
                onClick={() => setShowCancel((p) => !p)}
                className="bg-gradient-to-r from-[#BE123C] to-[#BE123CCC] justify-between text-white text-xs rounded-lg mt-3 py-3 px-5 w-full font-semibold flex items-center"
              >
                View Cancel Details
                <span
                  className={`ml-2 transition-transform ${
                    showCancel ? "rotate-180" : ""
                  }`}
                >
                  <FaChevronDown />
                </span>
              </button>
              {showCancel && (
                <div className="mt-2 px-4 py-1 rounded-lg bg-red-50 border border-red-100">
                  <div className="p-2 text-base font-semibold flex-col md:flex-row gap-2 flex justify-between items-center text-gray-800 mb-2">
                    <span>Admin Cancellations</span>
                    {/* Simple Date Range Inputs */}
                    <div className="flex flex-col  md:flex-row  items-center gap-2">
                      <input
                        type="date"
                        value={dateFilter.startDate}
                        onChange={(e) =>
                          setDateFilter({
                            ...dateFilter,
                            startDate: e.target.value,
                          })
                        }
                        className="border rounded-md p-1 text-xs focus:outline-none"
                      />
                      <span className="text-gray-500 text-sm">to</span>
                      <input
                        type="date"
                        value={dateFilter.endDate}
                        onChange={(e) =>
                          setDateFilter({
                            ...dateFilter,
                            endDate: e.target.value,
                          })
                        }
                        className="border rounded-md p-1 text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                  {/* <div className="space-y-4 mb-5">
                    {cancellations.map((d, idx) => (
                      <AdminStatsCard key={idx} {...d} isCancel />
                    ))}
                  </div> */}
                  <div className="space-y-4 mb-5 max-h-80 overflow-y-auto">
                    {cancellations.filter(stat=> stat.dates.length>0).map((d) => (
                      <AdminStatsCard
                        key={d.id}
                        id={d.id} // important for routing
                        dates={d.dates}
                        name={d.name}
                        values={d.values}
                        isCancel={true}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Revenue & Performance */}
        <div className="bg-white shadow rounded-2xl px-4 sm:px-6 mx-2 mt-8 pb-6">
          {/* Header */}
          <div className="flex items-center gap-2 mb-3 mt-3">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-800">
              Revenue & Performance Analytics
            </h2>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <div className="bg-green-800/5 rounded-xl p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold text-gray-700">
                  Revenue Trend
                </h3>
                {/* <span className="text-xs px-2 py-1 rounded bg-white border border-[#15803D33] text-green-700 font-medium">
                  +12.5%
                </span> */}
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="day_name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#059669"
                    strokeWidth={2}
                    dot={{ r: 5, fill: "#059669" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Rides Completed */}
            <div className="bg-green-800/5 border rounded-xl p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold text-gray-700">
                  Rides Completed
                </h3>
                {/* <span className="text-xs px-2 py-1 rounded bg-white text-[#84CC16] font-medium border border-[#15803D33] ">
                  +8.3%
                </span> */}
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={completedRideData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="day_name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#84CC16" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Cluster Config */}
        <div className="bg-white rounded-2xl shadow p-5 border border-[#9da09800] mt-8 mx-2">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              <h3 className="text-base font-semibold text-gray-800">
                Cluster Configuration
              </h3>
            </div>
            <span className="px-3 py-1 text-xs rounded bg-[#15803D1A] text-green-700 font-medium border ">
              Active
            </span>
          </div>

          <button className="w-full flex justify-between items-center px-4 py-3 rounded-lg bg-white border border-[#84CC1633] hover:bg-green-50 transition">
            <span className="text-sm text-gray-700 font-medium">
              Price Configurations
            </span>
            <ChevronRight className="w-4 h-4 text-green-600" />
          </button>
        </div>

        {/* Real-Time Monitoring */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mx-2 mt-8 rounded-xl">
          {/* Cab Locations */}
          <div className="bg-white shadow rounded-2xl p-5 border border-[#84CC1633]">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-green-600" />
              <h3 className="text-base font-semibold text-gray-800">
                Real-Time RB Cab Locations
              </h3>
            </div>

            <div
              className="flex flex-col items-center justify-center rounded-xl p-8"
              style={{
                background:
                  "linear-gradient(135deg, rgba(21, 128, 61, 0.05) 0%, rgba(132, 204, 22, 0.05) 100%)",
                border: "1px solid #15803D1A",
              }}
            >
              <div className="flex items-center justify-center bg-[#15803D1A] h-16 w-16 rounded-full">
                <MapPin className="w-8 h-8 text-green-600 " />
              </div>

              <p className="text-sm text-gray-700 mb-3">Live tracking active</p>
              <span className="px-4 py-1 rounded-md bg-green-600 text-white text-sm font-medium">
                24 Active Cabs
              </span>
            </div>
          </div>

          {/* Operators Fleet */}
          <div className="bg-white shadow rounded-2xl p-5 border border-[#84CC1633]">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-[#84CC16]" />
              <h3 className="text-base font-semibold text-gray-800">
                Real-Time RB Operators Fleet
              </h3>
            </div>

            <div
              className="flex flex-col items-center justify-center rounded-xl p-8"
              style={{
                background:
                  "linear-gradient(135deg,  rgba(132, 204, 22, 0.05) 100%), rgba(21, 128, 61, 0.05) 0%",
                border: "1px solid #15803D1A",
              }}
            >
              <div className="flex items-center justify-center bg-[#15803D1A] h-16 w-16 rounded-full">
                <Users className="w-8 h-8 text-[#84CC16] mb-3" />
              </div>
              <p className="text-sm text-gray-700 mb-3">Fleet monitoring</p>
              <span className="px-4 py-1 rounded-md bg-[#84CC16] text-black text-sm font-medium">
                18 Active Operators
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div
          className="rounded-2xl flex flex-col gap-6 justify-start mx-2 mt-8 mb-16 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/images/loginPageFive.png')",
          }}
        >
          <div className="flex gap-2 items-center justify-start px-6 pt-6 ">
            <AiOutlineThunderbolt className="text-green-500 h-5 w-5" />
            <span className="text-white font-bold">Quick Actions</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 items-center justify-center sm:justify-between px-6 sm:px-12 lg:mx-32 mb-12">
            <button
              onClick={() => {
                router.push("/rbFleetManagement/rbCabs/AddCabs");
              }}
              className="flex gap-3 rounded-xl items-center justify-center 
                        bg-[#FFFFFF40] backdrop-blur-md 
                        shadow-[0px_4px_6px_-4px_#0000001A] px-6 sm:px-12 lg:px-36 py-4 w-full sm:w-auto"
            >
              <FaPlus className="h-4 w-4" />
              <span className="text-white font-bold ">Add RB Cabs</span>
            </button>
            <button
              onClick={() => {
                router.push("/driverForm/DriverOnBoardingMain");
              }}
              className="flex gap-3 rounded-xl items-center justify-center 
                        bg-[#FFFFFF40] backdrop-blur-md 
                        shadow-[0px_4px_6px_-4px_#0000001A] px-6 sm:px-12 lg:px-36 py-4 w-full sm:w-auto"
            >
              <Users className="h-4 w-4" />
              <span className="text-white font-bold ">Add RB Drivers</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FleetCommandCenter;
