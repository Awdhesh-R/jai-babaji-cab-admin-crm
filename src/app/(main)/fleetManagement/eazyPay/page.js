"use client";
import {
  BellIcon,
  Cog6ToothIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import { BsWallet } from "react-icons/bs";

import { useState } from "react";
import { MdOutlineFileDownload } from "react-icons/md";
import { CiFilter } from "react-icons/ci";
import { FaCar } from "react-icons/fa";

const summaryCards = [
  {
    title: "Total Collections",
    amount: "₹ 58,735",
    border: "bg-[#FDCA4B]",
    subtitle: <span className="text-gray-400 ">119 captured mohan </span>,
    bg: "/images/walletPoints.png",
    icon: (
      // Your coin stack SVG here or use <svg>...</svg>
      //   <span className="text-yellow-500 text-5xl">🪙</span>
      <div className="flex items-center justify-center w-12 h-12 bg-[#FFC667] rounded-2xl">
        <BsWallet className="text-white h-6 w-6" />
      </div>
    ),
  },
  {
    title: <span className="text-white">Processing</span>,
    border: "bg-[#068A0E]",
    amount: <span className="text-white ">₹58,735 </span>,
    subtitle: <span className="text-white ">0 under-review</span>,
    bg: "/images/eazypay-process.jpeg",
    // icon: (
    // //   <CurrencyRupee className="w-12 h-12 text-green-600" />
    //  <span className="text-yellow-500 text-5xl"></span>
    // ),
    icon: (
      // Your coin stack SVG here or use <svg>...</svg>
      //   <span className="text-yellow-500 text-5xl">🪙</span>
      <div className="flex items-center justify-center w-12 h-12 bg-[#4CF356] rounded-2xl">
        <BsWallet className="text-white h-6 w-6" />
      </div>
    ),
  },
  {
    title: <span className="text-white">Failed Payment</span>,
    border: "bg-[#896FD1]",
    amount: <span className="text-white ">₹58,735 </span>,
    subtitle: <span className="text-white ">payments</span>,
    bg: "/images/Untitleddesignpart.png",

    icon: (
      // Your coin stack SVG here or use <svg>...</svg>
      //   <span className="text-yellow-500 text-5xl">🪙</span>
      <div className="flex items-center justify-center w-12 h-12 bg-[#C0AFEE] rounded-2xl">
        <BsWallet className="text-white h-6 w-6" />
      </div>
    ),
  },
];
const transactions = [
  // Single ride
  {
    id: "TXN-001",
    paymentThrough: "User",
    referenceId: "RFN-00123456",
    cabNo: "Sedan",
    number: "BR-01-AB1234",
    date: "23 Sep 2025, 09:00 AM",
    amount: 1050.0,
    status: "Captured",
    paymentMethod: "razorpay",
  },

  // Multi-ride
  {
    id: "TXN-002",
    referenceId: "RFN-00234567",
    paymentThrough: "User",
    cabNo: "Sedan",
    number: "BR-02-XY9876",
    date: "23 Sep 2025, 10:10 AM",
    rides: [
      {
        rideId: "RID-001",
        cabNo: "SUV",
        number: "BR-02-BC2345",
        amount: 980.0,
      },
      {
        rideId: "RID-002",
        cabNo: "Sedan",
        number: "BR-02-XY9876",
        amount: 1120.0,
      },
    ],
    amount: 2100.0,
    status: "Captured",
    paymentMethod: "razorpay",
  },

  {
    id: "TXN-003",
    paymentThrough: "User",
    referenceId: "RFN-00345678",
    cabNo: "Sedan",
    number: "BR-03-CD3456",
    date: "23 Sep 2025, 10:00 AM",
    amount: 1125.0,
    status: "Captured",
    paymentMethod: "eazypay",
  },

  {
    id: "TXN-004",
    paymentThrough: "User",
    referenceId: "RFN-00456789",
    cabNo: "Sedan",
    number: "BR-04-DE4567",
    date: "23 Sep 2025, 10:15 AM",
    amount: 1340.0,
    status: "Created",
    paymentMethod: "eazypay",
  },

  // Multi-ride
  {
    id: "TXN-005",
    referenceId: "RFN-00567890",
    paymentThrough: "Driver",
    cabNo: "SUV",
    number: "BR-05-EF5678",
    date: "23 Sep 2025, 11:15 AM",
    rides: [
      {
        rideId: "RID-003",
        cabNo: "SUV",
        number: "BR-05-EF5678",
        amount: 890.0,
      },
      {
        rideId: "RID-004",
        cabNo: "Sedan",
        number: "BR-05-GH6789",
        amount: 1010.0,
      },
    ],
    amount: 1900.0,
    status: "Created",
  },

  {
    id: "TXN-006",
    paymentThrough: "User",
    referenceId: "RFN-00678901",
    cabNo: "Sedan",
    number: "BR-06-FG6789",
    date: "23 Sep 2025, 11:00 AM",
    amount: 1570.0,
    status: "Created",
  },

  {
    id: "TXN-007",
    paymentThrough: "Driver",
    referenceId: "RFN-00789012",
    cabNo: "Sedan",
    number: "BR-07-GH7890",
    date: "23 Sep 2025, 11:30 AM",
    amount: 1230.0,
    status: "Failed",
  },

  // Multi-ride
  {
    id: "TXN-008",
    referenceId: "RFN-00890123",
    paymentThrough: "User",
    cabNo: "Sedan",
    number: "BR-08-IJ8901",
    date: "23 Sep 2025, 12:30 PM",
    rides: [
      {
        rideId: "RID-005",
        cabNo: "SUV",
        number: "BR-08-HI8901",
        amount: 1247.0,
      },
      {
        rideId: "RID-006",
        cabNo: "Sedan",
        number: "BR-08-IJ8901",
        amount: 1330.0,
      },
    ],
    amount: 2577.0,
    status: "Captured",
    paymentMethod: "eazypay",
  },

  {
    id: "TXN-009",
    paymentThrough: "User",
    referenceId: "RFN-00901234",
    cabNo: "Hatchback",
    number: "BR-09-IJ9012",
    date: "23 Sep 2025, 12:30 PM",
    amount: 1110.0,
    status: "Created",
  },

  {
    id: "TXN-010",
    paymentThrough: "User",
    referenceId: "RFN-01012345",
    cabNo: "Sedan",
    number: "BR-10-JK0123",
    date: "23 Sep 2025, 01:00 PM",
    amount: 1365.0,
    status: "Captured",
  },

  {
    id: "TXN-011",
    paymentThrough: "Driver",
    referenceId: "RFN-01123456",
    cabNo: "SUV",
    number: "BR-11-KL1234",
    date: "23 Sep 2025, 01:30 PM",
    amount: 1420.0,
    status: "Failed",
  },

  // Multi-ride
  {
    id: "TXN-012",
    referenceId: "RFN-01234567",
    paymentThrough: "Driver",
    cabNo: "Sedan",
    number: "BR-12-MN2345",
    date: "23 Sep 2025, 02:30 PM",
    rides: [
      {
        rideId: "RID-007",
        cabNo: "Hatchback",
        number: "BR-12-LM2345",
        amount: 1195.0,
      },
      {
        rideId: "RID-008",
        cabNo: "Sedan",
        number: "BR-12-MN2345",
        amount: 1300.0,
      },
    ],
    amount: 2495.0,
    status: "Captured",
  },

  {
    id: "TXN-013",
    paymentThrough: "User",
    referenceId: "RFN-01345678",
    cabNo: "Sedan",
    number: "BR-13-MN3456",
    date: "23 Sep 2025, 02:30 PM",
    amount: 1280.0,
    status: "Created",
  },

  {
    id: "TXN-014",
    paymentThrough: "User",
    referenceId: "RFN-01456789",
    cabNo: "SUV",
    number: "BR-14-NO4567",
    date: "23 Sep 2025, 03:00 PM",
    amount: 1505.0,
    status: "Captured",
    paymentMethod: "eazypay",
  },

  {
    id: "TXN-015",
    paymentThrough: "Driver",
    referenceId: "RFN-01567890",
    cabNo: "Hatchback",
    number: "BR-15-OP5678",
    date: "23 Sep 2025, 03:30 PM",
    amount: 975.0,
    status: "Failed",
  },

  {
    id: "TXN-016",
    paymentThrough: "User",
    referenceId: "RFN-01678901",
    cabNo: "Sedan",
    number: "BR-16-PQ6789",
    date: "23 Sep 2025, 04:00 PM",
    amount: 1380.0,
    status: "Captured",
  },
];

function exportToCsv(filename, rows) {
  const processRow = (row) =>
    row
      .map(
        (item) =>
          `"${typeof item === "string" ? item.replace(/"/g, '""') : item}"`
      )
      .join(",");

  const csvContent = [
    Object.keys(rows[0]),
    ...rows.map((row) => Object.values(row)),
  ]
    .map(processRow)
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.setAttribute("download", filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export default function EazyPay() {
  const [query, setQuery] = useState("");
  const [openPopupIndex, setOpenPopupIndex] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [active, setActive] = useState("");

  const filtered = transactions.filter((t) => {
    const matchesQuery =
      t.id.toLowerCase().includes(query.toLowerCase()) ||
      t.referenceId.toLowerCase().includes(query.toLowerCase()) ||
      t.amount.toString().includes(query);

    const matchesStatus = statusFilter ? t.status === statusFilter : true;

    const matchesPaymentMethod = active ? t.paymentMethod === active : true;

    return matchesQuery && matchesStatus && matchesPaymentMethod;
  });

  return (
    // <div className="min-h-screen bg-gradient-to-tr from-white to-blue-100 p-4 md:p-8">
    <div className="bg-[#f6fcff] min-h-screen py-6 px-2 md:mt-0 mt-16 md:px-8">
      {/* <div className="max-w-100 mt-5 shadow max-w-full mx-auto "> */}
      <div className=" bg-[url('/images/eazyPay.png')] bg-cover bg-center flex flex-col md:flex-col  md:justify-between p-4 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold">Online - transaction</h1>
            <p className="text-gray-500">
              Monitor and manage your payment transactions with real-time
              insights
            </p>
          </div>
          {/* <div className="flex space-x-2 mt-5 md:mt-0"> */}
          <div className="flex flex-col md:flex-row md:space-x-2 gap-5 md:gap-2 mt-5 md:mt-0">
            {/* EazyPay Button */}
            <button
              onClick={() => setActive("eazypay")}
              className={`w-[100px] h-[35px] flex items-center justify-center rounded-3xl bg-white border  hover:bg-orange-100 hover:border-orange-400 transition duration-300 hover:scale-105 ${
                active === "eazypay" ? "border-[#E26522] bg-orange-100" : ""
              }`}
            >
              <img
                src="/images/eazyPay-top.png"
                alt="EazyPay"
                className="h-8 w-auto object-contain"
              />
            </button>

            {/* Razorpay Button */}
            <button
              onClick={() => setActive("razorpay")}
              className={`w-[100px] h-[35px] flex items-center justify-center rounded-3xl bg-white border  hover:bg-blue-100 hover:border-blue-400 transition duration-300 hover:scale-105 ${
                active === "razorpay" ? "border-[#2374d7] bg-blue-100" : ""
              }`}
            >
              <img
                src="/images/razorpay-stamp.png"
                alt="Razorpay"
                className="h-8 w-auto object-contain"
              />
            </button>

            {/* Analytics Button */}
            <button
              className={` w-[100px] h-[35px] flex items-center gap-1 rounded-full bg-white px-4 py-2 text-xs font-medium shadow border ${
                active === "analytics" ? "border-blue-500 bg-blue-100" : ""
              }`}
            >
              <ChartBarIcon className="h-4 w-4" />
              Analytics
            </button>

            {/* Alerts Button */}
            <button
              className={` w-[100px] h-[35px] flex items-center gap-1 rounded-full bg-white px-4 py-2 text-xs font-medium shadow border ${
                active === "alerts" ? "border-blue-500 bg-blue-100" : ""
              }`}
            >
              <BellIcon className="h-4 w-4" />
              Alerts
            </button>

            {/* Settings Button */}
            <button
              className={` w-[100px] h-[35px] flex items-center gap-1 rounded-full bg-white px-4 py-2 text-xs font-medium shadow border ${
                active === "settings" ? "border-blue-500 bg-blue-100" : ""
              }`}
            >
              <Cog6ToothIcon className="h-4 w-4" />
              Settings
            </button>
          </div>
        </div>

        {/* <div className="grid grid-cols-1 sm:grid-cols-3 flex-wrap justity-between gap-6">
          {summaryCards.map(
            ({ title, amount, subtitle, bg, icon, border }, idx) => (
              <div
                key={title}
                className={`  rounded-xl p-8 bg-cover bg-center h-70 w-70   border-2 ${border}`}
                style={{ backgroundImage: `url(${bg})` }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-gray-600">{icon}</span>
                      <span className="text-xl px-2 font-semi">{title}</span>
                    </div>
                    <div className=" px-2 text-4xl font-bold">{amount}</div>
                    <div className="text-xl px-2 mt-5">{subtitle}</div>
                  </div>
                </div>
              </div>
            )
          )}
        </div> */}

        {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
  {summaryCards.map(
    ({ title, amount, subtitle, bg, icon, border }, idx) => (
      <div
        key={title}
        className={`rounded-xl p-8 bg-cover bg-center h-70 w-70 border-2 ${border}`}
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-gray-600">{icon}</span>
              <span className="text-xl px-2 font-semi">{title}</span>
            </div>
            <div className="px-2 text-4xl font-bold">{amount}</div>
            <div className="text-xl px-2 mt-5">{subtitle}</div>
          </div>
        </div>
      </div>
    )
  )}
</div> */}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {summaryCards.map(
            ({ title, amount, subtitle, bg, icon, border }, idx) => (
              <div
                key={title}
                className={`rounded-xl p-4 sm:p-8 bg-cover bg-center h-48 sm:h-70 w-full sm:w-70 border-2 ${border}`}
                style={{ backgroundImage: `url(${bg})` }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2 sm:mb-4">
                      <span className="text-gray-600 text-sm sm:text-base">
                        {icon}
                      </span>
                      <span className="text-lg sm:text-xl px-2 font-semibold">
                        {title}
                      </span>
                    </div>
                    <div className="px-2 text-2xl sm:text-4xl font-bold">
                      {amount}
                    </div>
                    <div className="text-base sm:text-xl px-2 mt-3 sm:mt-5">
                      {subtitle}
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* header */}
      {/* <div className="p-6 bg-white rounded-2xl mt-5 shadow max-w-full mx-auto min-h-[600px] ">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h2 className="text-xl font-semibold">Payment Transactions</h2>
            <p className="text-gray-500 text-sm">
              Manage and track all payment activities
            </p>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search transactions..."
              className="border rounded-lg py-2 px-3 w-64"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="flex items-center border rounded-lg px-2 gap-2">
              <CiFilter className="text-gray-900 text-lg" />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Filter</option>
                <option value="Captured">Captured</option>
                <option value="Created">Created</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
            <button
              className="py-2 px-6 rounded-lg bg-gray-100 border shadow flex items-center gap-2"
              onClick={() => exportToCsv("transactions.csv", filtered)}
            >
              <MdOutlineFileDownload className="text-lg" />
              <span>Export</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto min-h-[400px]">
          <table className="min-w-full bg-white rounded-xl">
            <thead>
              <tr className="border-b">
                <th className="p-3 text-left text-gray-600 font-semibold text-lg">
                  TRANSACTION ID
                </th>
                <th className="p-3 text-left text-gray-600 font-semibold text-lg">
                  Payment Through
                </th>
                <th className="p-3 text-left text-gray-600 font-semibold text-lg">
                  Ref. ID
                </th>
                <th className="p-3 text-left text-gray-600 font-semibold text-lg">
                  Cab No.
                </th>
                <th className="p-3 text-left text-gray-600 font-semibold text-lg">
                  Transaction Date
                </th>
                <th className="p-3 text-left text-gray-600 font-semibold text-lg">
                  Amount
                </th>
                <th className="p-3 text-left text-gray-600 font-semibold text-lg">
                  STATUS
                </th>
                <th className="p-3 text-left text-gray-600 font-semibold text-lg"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td
                    className="p-3 text-green-600 font-medium relative cursor-pointer"
                    onMouseEnter={() => setOpenPopupIndex(i)}
                    onMouseLeave={() => setOpenPopupIndex(null)}
                  >
                    {t.id}
                    {openPopupIndex === i && t.rides && t.rides.length > 1 && (
                      <>
                        <div
                          className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm z-10"
                          onClick={() => setOpenPopupIndex(null)}
                        />
                        <div className="absolute top-full left-28 mt-2 min-w-[380px] bg-white border border-gray-300 border-t-4 border-t-green-600  rounded-xl shadow-lg z-20 px-5 pb-2 pt-4">
                          {t.rides.map((ride, idx) => (
                            <React.Fragment
                              key={`${t.id}-${ride.rideId || idx}`}
                            >
                            
                              <div className="flex items-center w-full  ">
                                <div className="flex items-center mt-2 rounded-2xl p-1 border border-gray-300 flex-1 gap-2">
                                  <span className="font-[600] text-[#38495A] text-[15px]">
                                    URID: {ride.rideId}
                                  </span>
                                  <span>
                                    <FaCar className="text-gray-700" />
                                  </span>
                                  <span className="font-[500] text-[#323745]  text-[16px] text-center">
                                    {ride.number}
                                  </span>
                                </div>
                                <span className="text-blue-600 mt-1 ml-2 font-medium">
                                  +₹{ride.amount?.toLocaleString()}
                                </span>
                              </div>

                             
                            </React.Fragment>
                          ))}
                          <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200 px-2">
                            <span className="text-[#6C7A89] font-[500] text-[15px]">
                              Total No. Of Rides:{" "}
                              <b>
                                {t.rides.length.toString().padStart(2, "0")}
                              </b>
                            </span>
                            <span className="bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold rounded-full px-4 py-1 text-[16px] flex justify-center items-center shadow">
                              +₹{t.amount?.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </td>
                  
                  <td className="p-3">
                    <span className="bg-white border border-gray-400 px-5 py-1 rounded-2xl text-l font-medium">
                      {t.paymentThrough}
                    </span>
                  </td>
                  <td className="p-3 text-green-600">{t.referenceId}</td>
                  <td className="p-3">
                    {t.cabNo}
                    <br />
                    <span className="text-xs text-gray-400">{t.number}</span>
                  </td>
                  <td className="p-3">{t.date}</td>
                  <td className="p-3 font-bold">
                    ₹{t.amount.toLocaleString()}
                  </td>
                  <td className="p-3">
                    {t.status === "Captured" ? (
                      <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs">
                        Captured
                      </span>
                    ) : t.status === "Created" ? (
                      <span className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-xs">
                        Created
                      </span>
                    ) : t.status === "Failed" ? (
                      <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs">
                        Failed
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs">
                        {t.status}
                      </span>
                    )}
                  </td>
                  <td className="p-3 font-bold">
                    <span
                      className={`w-[78px] h-[30px] flex items-center justify-center rounded-full bg-white overflow-hidden border ${
                        t.paymentMethod === "razorpay"
                          ? "border-blue-500"
                          : t.paymentMethod === "eazypay"
                          ? "border-[#E26522]"
                          : "border-gray-300"
                      }`}
                    >
                      {t.paymentMethod === "razorpay" && (
                        <img
                          src="/images/razorpay-stamp.png"
                          alt="Razorpay"
                          className="h-8 w-20 object-contain "
                        />
                      )}
                      {t.paymentMethod === "eazypay" && (
                        <img
                          src="/images/eazypay-logo-stamp.png"
                          alt="EazyPay"
                          className="h-8 w-20 object-contain"
                        />
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> */}

      {/* changes here */}

      <div className="p-4 sm:p-6 bg-white rounded-2xl mt-5 shadow max-w-full mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold">
              Payment Transactions
            </h2>
            <p className="text-gray-500 text-sm">
              Manage and track all payment activities
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search transactions..."
              className="border rounded-lg py-2 px-3 w-full sm:w-64 text-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            {/* Filter */}
            <div className="flex items-center border rounded-lg px-2 gap-2">
              <CiFilter className="text-gray-900 text-base" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-sm outline-none"
              >
                <option value="">Filter</option>
                <option value="Captured">Captured</option>
                <option value="Created">Created</option>
                <option value="Failed">Failed</option>
              </select>
            </div>

            {/* Export Button */}
            <button
              className="py-2 px-4 sm:px-6 rounded-lg bg-gray-100 border shadow flex items-center justify-center gap-2 text-sm"
              onClick={() => exportToCsv("transactions.csv", filtered)}
            >
              <MdOutlineFileDownload className="text-base" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Table Responsive Wrapper */}

        <div className="overflow-x-auto w-full">
          <table className="md:min-w-[700px] w-full table-auto bg-white rounded-xl text-xs sm:text-sm block md:table">
            <thead className="block md:table-header-group">
              <tr className="border-b block md:table-row">
                <th className="p-2 sm:p-3 text-left text-gray-600 font-semibold whitespace-nowrap block md:table-cell">
                  TRANSACTION ID
                </th>
                <th className="p-2 sm:p-3 text-left text-gray-600 font-semibold whitespace-nowrap block md:table-cell">
                  Payment Through
                </th>
                <th className="p-2 sm:p-3 text-left text-gray-600 font-semibold whitespace-nowrap block md:table-cell">
                  Ref. ID
                </th>
                <th className="p-2 sm:p-3 text-left text-gray-600 font-semibold whitespace-nowrap block md:table-cell">
                  Cab No.
                </th>
                <th className="p-2 sm:p-3 text-left text-gray-600 font-semibold whitespace-nowrap block md:table-cell">
                  Transaction Date
                </th>
                <th className="p-2 sm:p-3 text-left text-gray-600 font-semibold whitespace-nowrap block md:table-cell">
                  Amount
                </th>
                <th className="p-2 sm:p-3 text-left text-gray-600 font-semibold whitespace-nowrap block md:table-cell">
                  STATUS
                </th>
                <th className="p-2 sm:p-3 block md:table-cell"></th>
              </tr>
            </thead>
            <tbody className="block md:table-row-group">
              {filtered.map((t, i) => (
                <tr
                  key={i}
                  className="border-b last:border-0 block md:table-row"
                >
                  {/* <td className="p-2 sm:p-3 text-green-600 font-medium whitespace-nowrap block md:table-cell">{t.id}</td> */}
                  {/* 
          <td
                    className="p-3 text-green-600 font-medium relative cursor-pointer"
                    onMouseEnter={() => setOpenPopupIndex(i)}
                    onMouseLeave={() => setOpenPopupIndex(null)}
                  >
                    {t.id}
                    {openPopupIndex === i && t.rides && t.rides.length > 1 && (
                      <>
                        <div
                          className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm z-10"
                          onClick={() => setOpenPopupIndex(null)}
                        />
                        <div className="absolute top-full left-28 mt-2 md:min-h-[80px] md:min-w-[380px] min-w-[120px] bg-white border border-gray-300 border-t-4 border-t-green-600  rounded-xl shadow-lg z-20 px-5 pb-2 pt-4">
                          {t.rides.map((ride, idx) => (
                            <React.Fragment
                              key={`${t.id}-${ride.rideId || idx}`}
                            >
                            
                              <div className="flex items-center w-full  ">
                                <div className="flex items-center mt-2 rounded-2xl p-1 border border-gray-300 flex-1 gap-2">
                                  <span className="font-[600] text-[#38495A] text-[15px]">
                                    URID: {ride.rideId}
                                  </span>
                                  <span>
                                    <FaCar className="text-gray-700" />
                                  </span>
                                  <span className="font-[500] text-[#323745]  text-[16px] text-center">
                                    {ride.number}
                                  </span>
                                </div>
                                <span className="text-blue-600 mt-1 ml-2 font-medium">
                                  +₹{ride.amount?.toLocaleString()}
                                </span>
                              </div>

                             
                            </React.Fragment>
                          ))}
                          <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200 px-2">
                            <span className="text-[#6C7A89] font-[500] text-[15px]">
                              Total No. Of Rides:{" "}
                              <b>
                                {t.rides.length.toString().padStart(2, "0")}
                              </b>
                            </span>
                            <span className="bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold rounded-full px-4 py-1 text-[16px] flex justify-center items-center shadow">
                              +₹{t.amount?.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </td> */}

                  <td
                    className="p-2 text-green-600 font-medium relative cursor-pointer"
                    onMouseEnter={() => setOpenPopupIndex(i)}
                    onMouseLeave={() => setOpenPopupIndex(null)}
                  >
                    {t.id}
                    {openPopupIndex === i && t.rides && t.rides.length > 1 && (
                      <>
                        <div
                          className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm z-10"
                          onClick={() => setOpenPopupIndex(null)}
                        />
                        <div
                          className="
          absolute top-full left-2 mt-1
          w-[99vw] max-w-[160px] sm:max-w-[230px]
          bg-white border border-gray-300 border-t-4 border-t-green-600
          rounded-lg shadow-lg z-20 px-1 py-1
        "
                        >
                          {t.rides.map((ride, idx) => (
                            <React.Fragment
                              key={`${t.id}-${ride.rideId || idx}`}
                            >
                              <div className="flex items-center w-full mb-1 last:mb-0">
                                <div className="flex items-center mt-0 rounded-lg p-0.5 border border-gray-200 flex-1 gap-0.5">
                                  <span className="font-semibold text-[#38495A] text-[10px]">
                                    URID: {ride.rideId}
                                  </span>
                                  <span>
                                    <FaCar className="text-gray-700 text-[10px]" />
                                  </span>
                                  <span className="font-medium text-[#323745] text-[10px] text-center">
                                    {ride.number}
                                  </span>
                                </div>
                                <span className="text-blue-600 font-medium text-[10px] ml-1">
                                  +₹{ride.amount?.toLocaleString()}
                                </span>
                              </div>
                            </React.Fragment>
                          ))}

                          <div className="flex items-center justify-between flex-nowrap mt-1 pt-1 border-t border-gray-200 px-1">
                            <span className="text-[#6C7A89] font-medium text-[8px] md:text-[12px] whitespace-nowrap">
                              Total No. Of Rides:{" "}
                              <b>
                                {t.rides.length.toString().padStart(2, "0")}
                              </b>
                            </span>
                            <span className="bg-green-600 text-white font-semibold rounded-full px-2 py-0.5 text-[8px] md:text-[12px] flex items-center justify-center shadow whitespace-nowrap">
                              +₹{t.amount?.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </td>

                  <td className="p-2 sm:p-3 whitespace-nowrap block md:table-cell">
                    <span className="bg-white border border-gray-400 px-3 sm:px-4 py-1 rounded-2xl text-xs sm:text-sm">
                      {t.paymentThrough}
                    </span>
                  </td>
                  <td className="p-2 sm:p-3 text-green-600 whitespace-nowrap block md:table-cell">
                    {t.referenceId}
                  </td>
                  <td className="p-2 sm:p-3 whitespace-nowrap block md:table-cell">
                    {t.cabNo}
                  </td>
                  <td className="p-2 sm:p-3 whitespace-nowrap block md:table-cell">
                    {t.date}
                  </td>
                  <td className="p-2 sm:p-3 font-bold whitespace-nowrap block md:table-cell">
                    ₹{t.amount.toLocaleString()}
                  </td>
                  <td className="p-2 sm:p-3 whitespace-nowrap block md:table-cell">
                    {t.status === "Captured" ? (
                      <span className="bg-green-100 text-green-600 px-2 sm:px-3 py-1 rounded-full text-xs">
                        Captured
                      </span>
                    ) : t.status === "Created" ? (
                      <span className="bg-yellow-100 text-yellow-600 px-2 sm:px-3 py-1 rounded-full text-xs">
                        Created
                      </span>
                    ) : (
                      <span className="bg-purple-100 text-purple-600 px-2 sm:px-3 py-1 rounded-full text-xs">
                        Failed
                      </span>
                    )}
                  </td>
                  <td className="p-2 sm:p-3 font-bold whitespace-nowrap block md:table-cell">
                    <span
                      className={`w-[60px] sm:w-[70px] h-[28px] flex items-center justify-center rounded-full bg-white overflow-hidden border ${
                        t.paymentMethod === "razorpay"
                          ? "border-blue-500"
                          : t.paymentMethod === "eazypay"
                          ? "border-[#E26522]"
                          : "border-gray-300"
                      }`}
                    >
                      {t.paymentMethod === "razorpay" && (
                        <img
                          src="/images/razorpay-stamp.png"
                          alt="Razorpay"
                          className="h-6 w-12 sm:w-16 object-contain"
                        />
                      )}
                      {t.paymentMethod === "eazypay" && (
                        <img
                          src="/images/eazypay-logo-stamp.png"
                          alt="EazyPay"
                          className="h-6 w-12 sm:w-16 object-contain"
                        />
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
