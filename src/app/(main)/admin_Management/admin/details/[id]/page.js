"use client";

import React, { useEffect, useState } from "react";
import {
  IoCallOutline,
  IoChatbubbleOutline,
  IoArrowBack,
} from "react-icons/io5";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import { CiCalendarDate } from "react-icons/ci";
import { apiClient } from "@/app/lib/apiClient";
import moment from "moment";
import { useParams, useRouter } from "next/navigation";

export default function AdminProfile() {
  const router = useRouter();
  const today = moment().format("YYYY-MM-DD");
  const sevenDaysAgo = moment().subtract(7, "days").format("YYYY-MM-DD");
  const params = useParams();
  const id = params?.id;

  const [data, setData] = useState(null);
  const [dateFilter, setDateFilter] = useState({
    startDate: sevenDaysAgo,
    endDate: today,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiClient(
          "GET",
          `/dashboard/employee-activity-stats/${id}?startDate=${dateFilter.startDate}&endDate=${dateFilter.endDate}`
        );

        if (res && res.data) {
          setData(res.data);
        } else {
          console.error("Response structure unexpected", res);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (id) fetchData();
  }, [id, dateFilter]);

  const filteredData =
    data && Array.isArray(data.data)
      ? data.data.filter((row) => {
          const rowDate = moment(row.date);
          return (
            rowDate.isSameOrAfter(moment(dateFilter.startDate)) &&
            rowDate.isSameOrBefore(moment(dateFilter.endDate))
          );
        })
      : [];

  if (!data)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );

  const totalConfirmed = filteredData.reduce(
    (sum, row) => sum + (row.stats.confirmed || 0),
    0
  );
  const totalCancelled = filteredData.reduce(
    (sum, row) => sum + (row.stats.cancelled || 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#ECF9F5] py-4 px-2 flex flex-col items-center">
      {/* Header new */}

      <div className="text-lg sm:text-2xl py-5 font-semibold text-[#334155] flex items-center max-w-6xl w-full gap-3 justify-start text-left">
        <span
          onClick={() => router.back()}
          // className="p-2 bg-[#E8F5EE] rounded-lg border border-[#15803D33] text-[#15803D] cursor-pointer"
              className="p-2 bg-[#E8F5EE] rounded-lg border border-[#15803D33] text-[#15803D] cursor-pointer
               transition-colors duration-300
               hover:bg-[#D1E7DD] hover:text-[#14532D]"
        >
          <IoArrowBack className="text-xl" />
        </span>
        Admin Profile
      </div>

      <div className="max-w-6xl w-full mb-7">
        {/* Profile Section */}
        <div className="bg-white p-4 gap-5 mb-8 sm:p-8 rounded-2xl shadow-md">
          <div className="bg-[#f6fcfa] rounded-xl p-4 pt-12 sm:p-6 border border-[#e3f4ec] flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-7">
            <img
              className="w-28 h-28 rounded-full object-cover border border-[#b0e2cf] shadow-md"
              src="/images/cab-captian-avator-default.png"
              alt="Admin"
            />
            <div className="flex-1 flex flex-col gap-3 sm:gap-4 justify-center">
              <div>
                <div className="font-bold text-xl text-[#263238]">
                  {data.name}
                </div>
                <div className="text-gray-500 text-sm font-medium mt-1">
                  Employee ID: #{data.id}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 mt-2">
                <div className="flex-1 bg-white border border-[#e3f4ec] rounded-lg px-5 py-4 flex items-center gap-3 shadow-sm">
                  <IoCallOutline className="text-[#15803D] text-xl" />
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Mobile</div>
                    <div className="font-semibold text-[#263238] text-base">
                      +91 {data.mobile_no}
                    </div>
                  </div>
                </div>
                <div className="flex-1 bg-white border border-[#e3f4ec] rounded-lg px-5 py-4 flex items-center gap-3 shadow-sm">
                  <IoChatbubbleOutline className="text-[#15803D] text-xl" />
                  <div>
                    <div className="text-xs text-gray-400 mb-1">WhatsApp</div>
                    <div className="font-semibold text-[#263238] text-base">
                      +91 {data.mobile_no}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-2xl mb-10 shadow-md p-6 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div
              className="rounded-xl border border-[#dcf6ea] p-6 flex flex-col justify-between"
              style={{
                background:
                  "linear-gradient(135deg, rgba(21,128,61,0.1) 0%, rgba(21,128,61,0) 100%)",
              }}
            >
              <span className="text-sm text-gray-600 mb-2 flex items-center justify-between">
                Total Confirmed Rides
                <FiTrendingUp className="text-[#15803D] text-xl" />
              </span>
              <span className="text-3xl font-bold text-[#15803D]">
                {totalConfirmed}
              </span>
              <span className="text-xs text-gray-400 block mt-1">
                This week
              </span>
            </div>

            <div
              className="rounded-xl border border-[#f9dede] p-6 flex flex-col justify-between"
              style={{
                background:
                  "linear-gradient(135deg, rgba(190,18,60,0.07) 0%, rgba(190,18,60,0) 100%)",
              }}
            >
              <span className="text-sm text-gray-600 mb-2 flex items-center justify-between">
                Total Cancelled Rides
                <FiTrendingDown className="text-[#BE123C] text-xl" />
              </span>
              <span className="text-3xl font-bold text-[#BE123C]">
                {totalCancelled}
              </span>
              <span className="text-xs text-gray-400 block mt-1">
                This week
              </span>
            </div>
          </div>
        </div>

        {/* Date-wise Breakdown */}

        <div className="bg-white rounded-xl shadow p-3 sm:p-4 mb-5">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-3 gap-3">
            <h2 className="font-semibold text-[#b3b7bc] flex items-center gap-5 text-base sm:text-lg">
              <CiCalendarDate className="text-[#15803D] text-2xl" />
              Date-wise Breakdown
            </h2>

            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              <input
                type="date"
                value={dateFilter.startDate}
                onChange={(e) =>
                  setDateFilter({ ...dateFilter, startDate: e.target.value })
                }
                className="border rounded-md p-1 text-xs w-full sm:w-auto focus:outline-none"
              />
              <span className="text-gray-500 text-sm">to</span>
              <input
                type="date"
                value={dateFilter.endDate}
                onChange={(e) =>
                  setDateFilter({ ...dateFilter, endDate: e.target.value })
                }
                className="border rounded-md p-1 text-xs w-full sm:w-auto focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-xs sm:text-sm table-auto">
              <thead>
                <tr>
                  <th className="text-left text-gray-500 py-2 px-2">Date</th>
                  <th className="text-left text-[#15803D] py-2 px-2">
                    Confirmed
                  </th>
                  <th className="text-left text-[#BE123C] py-2 px-2">
                    Cancelled
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(data.data) && data.data.length > 0 ? (
                  data.data
                    .filter((row) => {
                      const rowDate = moment(row.date);
                      return (
                        rowDate.isSameOrAfter(moment(dateFilter.startDate)) &&
                        rowDate.isSameOrBefore(moment(dateFilter.endDate))
                      );
                    })
                    .map((row) => (
                      <tr key={row.date} className="border-t">
                        <td className="py-2 px-2 whitespace-nowrap">
                          {row.date}
                        </td>
                        <td className="py-2 px-2">
                          <span className="bg-[#e7fbee] px-3 py-1 rounded-lg font-medium text-[#15803D]">
                            {row.stats.confirmed}
                          </span>
                        </td>
                        <td className="py-2 px-2">
                          <span className="bg-[#ffeaea] px-3 py-1 rounded-lg font-medium text-[#BE123C]">
                            {row.stats.cancelled}
                          </span>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-4 text-gray-500">
                      No data available for selected date range.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Attendance Tracker with Coming Soon */}
        <div className="p-6 bg-[#FFFFFFCC] rounded-2xl shadow-md w-full max-w-3xl text-center text-gray-600 font-semibold text-xl">
          Attendance Tracker (Last 7 Days) - Coming Soon
        </div>
      </div>
    </div>
  );
}
