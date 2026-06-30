'use client'

import React, { useState } from "react";

  const data = [
          {
    id: "3",
    username: "Aman",
    refundAmount: "₹1,150",
    refundId: "RFN-12347",
    orderId: "ORD-771122",
    date: "21 Nov 2025, 11:45 AM",
    status: "Refunded",
  },
  {
    id: "4",
    username: "Neha",
    refundAmount: "₹820",
    refundId: "RFN-12348",
    orderId: "ORD-661122",
    date: "21 Nov 2025, 12:20 PM",
    status: "Processing",
  },
  {
    id: "5",
    username: "Sameer",
    refundAmount: "₹1,450",
    refundId: "RFN-12349",
    orderId: "ORD-551122",
    date: "21 Nov 2025, 12:50 PM",
    status: "Failed",
  },
  {
    id: "6",
    username: "Kiran",
    refundAmount: "₹780",
    refundId: "RFN-12350",
    orderId: "ORD-441122",
    date: "21 Nov 2025, 01:10 PM",
    status: "Refunded",
  },
  {
    id: "7",
    username: "Arjun",
    refundAmount: "₹1,980",
    refundId: "RFN-12351",
    orderId: "ORD-331122",
    date: "21 Nov 2025, 01:50 PM",
    status: "Processing",
  },
  {
    id: "8",
    username: "Sneha",
    refundAmount: "₹650",
    refundId: "RFN-12352",
    orderId: "ORD-221122",
    date: "21 Nov 2025, 02:25 PM",
    status: "Refunded",
  },
  {
    id: "9",
    username: "Rakesh",
    refundAmount: "₹1,300",
    refundId: "RFN-12353",
    orderId: "ORD-111122",
    date: "21 Nov 2025, 03:00 PM",
    status: "Failed",
  },
  {
    id: "10",
    username: "Divya",
    refundAmount: "₹900",
    refundId: "RFN-12354",
    orderId: "ORD-991121",
    date: "21 Nov 2025, 03:35 PM",
    status: "Refunded",
  },
  {
    id: "11",
    username: "Manoj",
    refundAmount: "₹1,750",
    refundId: "RFN-12355",
    orderId: "ORD-881121",
    date: "21 Nov 2025, 04:10 PM",
    status: "Processing",
  },
  {
    id: "12",
    username: "Aisha",
    refundAmount: "₹860",
    refundId: "RFN-12356",
    orderId: "ORD-771121",
    date: "21 Nov 2025, 04:40 PM",
    status: "Refunded",
  },
  {
    id: "13",
    username: "Vikram",
    refundAmount: "₹2,050",
    refundId: "RFN-12357",
    orderId: "ORD-661121",
    date: "21 Nov 2025, 05:20 PM",
    status: "Processing",
  },
  {
    id: "14",
    username: "Meera",
    refundAmount: "₹720",
    refundId: "RFN-12358",
    orderId: "ORD-551121",
    date: "21 Nov 2025, 06:00 PM",
    status: "Refunded",
  },
  {
    id: "15",
    username: "Sagar",
    refundAmount: "₹1,380",
    refundId: "RFN-12359",
    orderId: "ORD-441121",
    date: "21 Nov 2025, 06:35 PM",
    status: "Failed",
  },
  {
    id: "16",
    username: "Pooja",
    refundAmount: "₹990",
    refundId: "RFN-12360",
    orderId: "ORD-331121",
    date: "21 Nov 2025, 07:10 PM",
    status: "Refunded",
  },
  {
    id: "17",
    username: "Kabir",
    refundAmount: "₹1,120",
    refundId: "RFN-12361",
    orderId: "ORD-221121",
    date: "21 Nov 2025, 07:55 PM",
    status: "Processing",
  },
  {
    id: "18",
    username: "Sonia",
    refundAmount: "₹750",
    refundId: "RFN-12362",
    orderId: "ORD-111121",
    date: "21 Nov 2025, 08:20 PM",
    status: "Refunded",
  },
  {
    id: "19",
    username: "Harsh",
    refundAmount: "₹1,600",
    refundId: "RFN-12363",
    orderId: "ORD-991120",
    date: "21 Nov 2025, 08:55 PM",
    status: "Processing",
  },
  {
    id: "20",
    username: "Tina",
    refundAmount: "₹880",
    refundId: "RFN-12364",
    orderId: "ORD-881120",
    date: "21 Nov 2025, 09:20 PM",
    status: "Refunded",
  },
  {
    id: "21",
    username: "Rahul",
    refundAmount: "₹1,340",
    refundId: "RFN-12365",
    orderId: "ORD-771120",
    date: "21 Nov 2025, 09:55 PM",
    status: "Failed",
  },
  {
    id: "22",
    username: "Anita",
    refundAmount: "₹930",
    refundId: "RFN-12366",
    orderId: "ORD-661120",
    date: "21 Nov 2025, 10:20 PM",
    status: "Refunded",
  },
];

const statusColor = (status) => {
  switch (status) {
    case "Refunded": return "bg-green-100 text-green-700";
    case "Processing": return "bg-yellow-100 text-yellow-700";
    case "Failed": return "bg-red-100 text-red-700";
    default: return "bg-gray-100 text-gray-700";
  }
};

export default function RazorPayHistory() {
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Filter logic
  const filteredData = data.filter(
    (row) =>
      row.username.toLowerCase().includes(search.toLowerCase()) &&
      (!fromDate || new Date(row.date) >= new Date(fromDate)) &&
      (!toDate || new Date(row.date) <= new Date(toDate))
  );

  return (
    <div className="bg-white rounded-xl shadow-md p-3 sm:p-6 w-full ">
      <h2 className="text-base sm:text-xl font-bold text-gray-900 mb-1">Razor Pay Initiative</h2>
      <p className="text-gray-500 text-xs sm:text-sm mb-5">
        Manage and track all Razorpay refund activities
      </p>

      {/* Toolbar: Search + Date Range */}
      {/* <div className="flex flex-col sm:flex-row gap-3 mb-5 justify-between sm:items-center w-full">
        <input
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-lg text-[13px] sm:text-sm w-full sm:w-[550px]"
          placeholder="Search username…"
        />
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="date"
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
            className="border px-3 py-2 rounded-lg text-[13px] sm:text-sm w-full sm:w-[150px]"
            placeholder="From"
          />
          <input
            type="date"
            value={toDate}
            onChange={e => setToDate(e.target.value)}
            className="border px-3 py-2 rounded-lg text-[13px] sm:text-sm w-full md:w-[150px]"
            placeholder="To"
          />
        </div>
      </div> */}

            <div className="flex flex-col sm:flex-row gap-3 mb-5 justify-between sm:items-center w-full">
        <input
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-lg text-[13px] sm:text-sm w-full"
          placeholder="Search username…"
        />
        <div className="flex gap-2 w-full flex-col md:flex-row sm:w-auto">
          <input
            type="date"
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
            className="border px-3 py-2 rounded-lg text-[13px] sm:text-sm w-full sm:w-[150px]"
            placeholder="From"
          />
          <input
            type="date"
            value={toDate}
            onChange={e => setToDate(e.target.value)}
            className="border px-3 py-2 rounded-lg text-[13px] sm:text-sm w-full md:w-[150px]"
            placeholder="To"
          />
        </div>
      </div>

      {/* Desktop/tablet TABLE */}
      <div className="hidden sm:block">
        <div className="relative overflow-x-auto" style={{ height: "60vh", minHeight: "220px" }}>
          <table className="min-w-[700px] w-full text-xs sm:text-sm">
            <thead className="sticky top-0 bg-gray-100 z-10">
              <tr className="border-b text-gray-600">
                <th className="py-2 px-2 sm:px-4 text-left font-medium">urid</th>
                <th className="py-2 px-2 sm:px-4 text-left font-medium">Username</th>
                <th className="py-2 px-2 sm:px-4 text-left font-medium">Order Amount</th>
                {/* <th className="py-2 px-2 sm:px-4 text-left font-medium">Refund ID</th> */}
                {/* <th className="py-2 px-2 sm:px-4 text-left font-medium">Order ID</th> */}
                <th className="py-2 px-2 sm:px-4 text-left font-medium">Date</th>
                <th className="py-2 px-2 sm:px-4 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-gray-400 py-8">
                    No refund data found.
                  </td>
                </tr>
              )}
              {filteredData.map((row) => (
                <tr key={row.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-2 sm:px-4">{row.id}</td>
                  <td className="py-2 px-2 sm:px-4">{row.username}</td>
                  <td className="py-2 px-2 sm:px-4">{row.refundAmount}</td>
                  {/* <td className="py-2 px-2 sm:px-4">{row.refundId}</td>
                  <td className="py-2 px-2 sm:px-4">{row.orderId}</td> */}
                  <td className="py-2 px-2 sm:px-4 whitespace-nowrap">{row.date}</td>
                  <td className="py-2 px-2 sm:px-4">
                    <span className={`px-2 py-1 rounded text-xs sm:text-sm ${statusColor(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE LIST */}
      <div className="sm:hidden max-h-[60vh] overflow-y-auto space-y-3">
        {filteredData.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            No refund data found.
          </div>
        )}
        {filteredData.map((row) => (
          <div key={row.id} className="bg-gray-50 border rounded-lg px-3 py-2 flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-400">Refund ID: {row.refundId}</span>
              <span className={`px-2 py-1 rounded ${statusColor(row.status)} text-[11px]`}>
                {row.status}
              </span>
            </div>
            <span className="font-semibold text-gray-700">
              {row.username} <span className="text-gray-500 text-xs">({row.id})</span>
            </span>
            {/* <span className="text-gray-500 text-xs">Order ID: {row.orderId}</span> */}
            <span className="text-gray-500 text-xs"> Order Amount: {row.refundAmount}</span>
            <span className="text-gray-500 text-xs">Date: {row.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}