"use client";

import React, { useState } from "react";
import { FiArrowDownLeft } from "react-icons/fi";
import { FiArrowUpRight } from "react-icons/fi";
import { CiSearch } from "react-icons/ci";
import { RxCounterClockwiseClock } from "react-icons/rx";
import { FiTrendingUp } from "react-icons/fi";
import { FiTrendingDown } from "react-icons/fi";

const dummyTransactions = [
  {
    id: 1,
    type: "credit",
    amount: 450,
    date: "10 July 2025",
    time: "03:30 PM",
    txnId: "TXN78901234",
    paymentMode: "UPI",
    notes: "Client payment received for project milestone.",
  },
  {
    id: 2,
    type: "debit",
    amount: 320,
    date: "12 July 2025",
    time: "11:45 AM",
    txnId: "TXN56789012",
    paymentMode: "Card",
    notes: "Lunch with team at restaurant.",
  },
  {
    id: 3,
    type: "credit",
    amount: 1200,
    date: "15 August 2025",
    time: "05:10 PM",
    txnId: "TXN34567890",
    paymentMode: "Bank Transfer",
    notes: "Freelance payment from client.",
  },
  {
    id: 4,
    type: "debit",
    amount: 250,
    date: "20 August 2025",
    time: "09:25 AM",
    txnId: "TXN90123456",
    paymentMode: "UPI",
    notes: "Cab fare to office.",
  },
  {
    id: 5,
    type: "credit",
    amount: 890,
    date: "02 September 2025",
    time: "07:40 PM",
    txnId: "TXN65432109",
    paymentMode: "Wallet",
    notes: "Refund from Swiggy order.",
  },
  {
    id: 6,
    type: "debit",
    amount: 670,
    date: "05 October 2025",
    time: "01:55 PM",
    txnId: "TXN11223344",
    paymentMode: "Card",
    notes: "Monthly internet bill payment.",
  },
  {
    id: 7,
    type: "credit",
    amount: 2000,
    date: "08 October 2025",
    time: "10:15 AM",
    txnId: "TXN22334455",
    paymentMode: "UPI",
    notes: "Salary credited from company.",
  },
  {
    id: 8,
    type: "debit",
    amount: 350,
    date: "10 October 2025",
    time: "04:30 PM",
    txnId: "TXN99887766",
    paymentMode: "Wallet",
    notes: "Snacks and beverages purchase.",
  },
  {
    id: 9,
    type: "credit",
    amount: 980,
    date: "12 October 2025",
    time: "06:10 PM",
    txnId: "TXN55667788",
    paymentMode: "Card",
    notes: "Cashback from Amazon offer.",
  },
  {
    id: 10,
    type: "debit",
    amount: 410,
    date: "14 October 2025",
    time: "09:20 AM",
    txnId: "TXN33445566",
    paymentMode: "UPI",
    notes: "Electricity bill payment.",
  },
  {
    id: 11,
    type: "credit",
    amount: 1500,
    date: "15 October 2025",
    time: "02:00 PM",
    txnId: "TXN10293847",
    paymentMode: "Bank Transfer",
    notes: "Bonus credited by employer.",
  },
  {
    id: 12,
    type: "debit",
    amount: 280,
    date: "17 October 2025",
    time: "03:25 PM",
    txnId: "TXN56473829",
    paymentMode: "Card",
    notes: "Recharge for mobile plan.",
  },
  {
    id: 13,
    type: "credit",
    amount: 750,
    date: "18 October 2025",
    time: "05:50 PM",
    txnId: "TXN92837465",
    paymentMode: "UPI",
    notes: "Received from friend for dinner share.",
  },
  {
    id: 14,
    type: "debit",
    amount: 130,
    date: "19 October 2025",
    time: "10:45 AM",
    txnId: "TXN37485920",
    paymentMode: "Wallet",
    notes: "Coffee at Starbucks.",
  },
  {
    id: 15,
    type: "credit",
    amount: 2200,
    date: "20 October 2025",
    time: "08:00 PM",
    txnId: "TXN48392018",
    paymentMode: "Bank Transfer",
    notes: "Freelance UI design project payment.",
  },
  {
    id: 16,
    type: "debit",
    amount: 500,
    date: "21 October 2025",
    time: "12:15 PM",
    txnId: "TXN48592038",
    paymentMode: "Card",
    notes: "Fuel refill for bike.",
  },
  {
    id: 17,
    type: "credit",
    amount: 950,
    date: "22 October 2025",
    time: "06:20 PM",
    txnId: "TXN58492039",
    paymentMode: "UPI",
    notes: "Sold old headphone on OLX.",
  },
  {
    id: 18,
    type: "debit",
    amount: 330,
    date: "23 October 2025",
    time: "09:35 AM",
    txnId: "TXN49203859",
    paymentMode: "Wallet",
    notes: "Groceries from local store.",
  },
  {
    id: 19,
    type: "credit",
    amount: 870,
    date: "25 October 2025",
    time: "03:40 PM",
    txnId: "TXN50293847",
    paymentMode: "UPI",
    notes: "Received refund for canceled order.",
  },
  {
    id: 20,
    type: "debit",
    amount: 260,
    date: "26 October 2025",
    time: "11:00 AM",
    txnId: "TXN40293857",
    paymentMode: "Card",
    notes: "Parking charges payment.",
  },
  {
    id: 21,
    type: "credit",
    amount: 1950,
    date: "28 October 2025",
    time: "07:25 PM",
    txnId: "TXN60293857",
    paymentMode: "Bank Transfer",
    notes: "Received client project payment.",
  },
  {
    id: 22,
    type: "debit",
    amount: 480,
    date: "30 October 2025",
    time: "04:45 PM",
    txnId: "TXN70293857",
    paymentMode: "UPI",
    notes: "Dinner at restaurant with family.",
  },
  {
    id: 23,
    type: "credit",
    amount: 1250,
    date: "31 October 2025",
    time: "01:10 PM",
    txnId: "TXN80293857",
    paymentMode: "Wallet",
    notes: "App cashback credited.",
  },
  {
    id: 24,
    type: "debit",
    amount: 540,
    date: "01 November 2025",
    time: "10:50 AM",
    txnId: "TXN90293857",
    paymentMode: "Card",
    notes: "Netflix monthly subscription.",
  },
  {
    id: 25,
    type: "credit",
    amount: 1750,
    date: "03 November 2025",
    time: "05:30 PM",
    txnId: "TXN10029385",
    paymentMode: "Bank Transfer",
    notes: "Freelance backend development payment.",
  },
];

export default function TransactionHistory() {
 const txns = [
  {
    id: 1,
    type: "credit",
    amount: 2500,
    notes: "Ride completed",
    date: "2025-10-31",
    time: "10:45 AM",
    txnId: "TXN12345",
    paymentMode: "UPI",
  },
  {
    id: 2,
    type: "debit",
    amount: 1200,
    notes: "Driver payment",
    date: "2025-10-30",
    time: "2:15 PM",
    txnId: "TXN67890",
    paymentMode: "Bank Transfer",
  },
  {
    id: 3,
    type: "credit",
    amount: 1800,
    notes: "Cab booking",
    date: "2025-10-29",
    time: "4:05 PM",
    txnId: "TXN11223",
    paymentMode: "Credit Card",
  },
  {
    id: 4,
    type: "credit",
    amount: 950,
    notes: "Ride completed",
    date: "2025-10-28",
    time: "9:30 AM",
    txnId: "TXN44556",
    paymentMode: "UPI",
  },
  {
    id: 5,
    type: "debit",
    amount: 3000,
    notes: "Refund to customer",
    date: "2025-10-27",
    time: "6:25 PM",
    txnId: "TXN77889",
    paymentMode: "Wallet",
  },
  {
    id: 6,
    type: "credit",
    amount: 4200,
    notes: "Ride completed",
    date: "2025-10-26",
    time: "10:15 AM",
    txnId: "TXN99881",
    paymentMode: "Debit Card",
  },
  {
    id: 7,
    type: "debit",
    amount: 1500,
    notes: "Driver commission",
    date: "2025-10-25",
    time: "3:30 PM",
    txnId: "TXN55443",
    paymentMode: "UPI",
  },
  {
    id: 8,
    type: "credit",
    amount: 2700,
    notes: "Ride completed",
    date: "2025-10-24",
    time: "12:20 PM",
    txnId: "TXN22114",
    paymentMode: "Credit Card",
  },
  {
    id: 9,
    type: "debit",
    amount: 1100,
    notes: "App maintenance fee",
    date: "2025-10-23",
    time: "5:10 PM",
    txnId: "TXN33225",
    paymentMode: "Wallet",
  },
  {
    id: 10,
    type: "credit",
    amount: 3700,
    notes: "Ride completed",
    date: "2025-10-22",
    time: "8:50 AM",
    txnId: "TXN99112",
    paymentMode: "Bank Transfer",
  },
  {
    id: 11,
    type: "credit",
    amount: 2400,
    notes: "Cab booking",
    date: "2025-10-21",
    time: "1:00 PM",
    txnId: "TXN88101",
    paymentMode: "Debit Card",
  },
  {
    id: 12,
    type: "debit",
    amount: 900,
    notes: "Customer cashback",
    date: "2025-10-20",
    time: "9:45 AM",
    txnId: "TXN66123",
    paymentMode: "UPI",
  },
  {
    id: 13,
    type: "credit",
    amount: 5200,
    notes: "Premium ride",
    date: "2025-10-19",
    time: "7:40 PM",
    txnId: "TXN77712",
    paymentMode: "Credit Card",
  },
  {
    id: 14,
    type: "debit",
    amount: 2000,
    notes: "Fuel expense",
    date: "2025-10-18",
    time: "11:35 AM",
    txnId: "TXN65433",
    paymentMode: "UPI",
  },
  {
    id: 15,
    type: "credit",
    amount: 3100,
    notes: "Ride completed",
    date: "2025-10-17",
    time: "10:20 AM",
    txnId: "TXN91234",
    paymentMode: "Wallet",
  },
  {
    id: 16,
    type: "debit",
    amount: 600,
    notes: "Penalty adjustment",
    date: "2025-10-16",
    time: "8:10 PM",
    txnId: "TXN44522",
    paymentMode: "Bank Transfer",
  },
  {
    id: 17,
    type: "credit",
    amount: 4500,
    notes: "Corporate booking",
    date: "2025-10-15",
    time: "6:50 PM",
    txnId: "TXN77119",
    paymentMode: "Credit Card",
  },
  {
    id: 18,
    type: "debit",
    amount: 250,
    notes: "Service charge",
    date: "2025-10-14",
    time: "3:05 PM",
    txnId: "TXN22189",
    paymentMode: "Wallet",
  },
  {
    id: 19,
    type: "credit",
    amount: 1950,
    notes: "Ride completed",
    date: "2025-10-13",
    time: "2:30 PM",
    txnId: "TXN55331",
    paymentMode: "UPI",
  },
  {
    id: 20,
    type: "debit",
    amount: 1300,
    notes: "Driver payment",
    date: "2025-10-12",
    time: "9:00 AM",
    txnId: "TXN44512",
    paymentMode: "Bank Transfer",
  },
  {
    id: 21,
    type: "credit",
    amount: 3900,
    notes: "Ride completed",
    date: "2025-10-11",
    time: "4:45 PM",
    txnId: "TXN99345",
    paymentMode: "UPI",
  },
];

  const [activeTab, setActiveTab] = useState("credit");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTxns = txns.filter(
    (t) =>
      (activeTab === "all" || t.type === activeTab) &&
      t.txnId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCredit = txns
    .filter((t) => t.type === "credit")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDebit = txns
    .filter((t) => t.type === "debit")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div> 
         <div className="bg-[#f6f8fc] p-4 md:p-6 rounded-lg">

              {/* Left side title */}
    <div className="flex items-center bg-[#f6f8fc]  rounded-2xl p-1 gap-3">
      <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
        <RxCounterClockwiseClock className="text-[#2563EB] text-2xl" />
      </div>
      <div>
        <h2 className="text-lg md:text-xl font-semibold text-gray-800">
          Fuel Transaction History
        </h2>
        <p className="text-sm md:text-base text-gray-400 mt-0.5">
          View and manage your recent transactions
        </p>
      </div>
    </div>


       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div
                  className="rounded-xl border border-[#dcf6ea] p-6 py-10 flex flex-col justify-between"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(21,128,61,0.1) 0%, rgba(21,128,61,0) 100%)",
                  }}
                >
                  <span className=" text-gray-600 text-xl mb-2 flex items-center justify-between">
                    Total Credit
                    <FiTrendingUp className="text-[#15803D] text-xl" />
                  </span>
                  <span className="text-3xl font-bold text-[#15803D]"></span>
                  <span className="text-xs text-gray-400 block mt-1">
                    <h3 className="text-3xl font-bold text-green-700">
                                ₹{totalCredit.toFixed(2)}
                    </h3>
                  </span>
                </div>


                <div
                  className="rounded-xl border border-[#f9dede] p-6 py-10 flex flex-col justify-between"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(190,18,60,0.07) 0%, rgba(190,18,60,0) 100%)",
                  }}
                >
                  <span className="text-xl text-gray-600 mb-2 flex items-center justify-between">
                   Total Debit
                    <FiTrendingDown className="text-[#BE123C] text-xl" />
                  </span>
                  <span className="text-3xl font-bold text-red-700"> 
                     <h3 className="text-3xl font-bold text-red-700">
                         ₹{totalDebit.toFixed(2)}
                      </h3></span>
                  <span className="text-xs text-gray-400 block mt-1"></span>
                </div>


  </div>


  {/* Header Section */}
  <div className="flex items-center py-10 justify-between flex-col md:flex-row rounded-2xl p-4 gap-3">

    


    {/* Right side tabs */}
    {/* <div className="flex items-center gap-2">
      <button
        onClick={() => setActiveTab("credit")}
        className={`px-4 py-2 rounded-md text-sm font-semibold ${
          activeTab === "credit"
            ? "bg-green-600 text-white"
            : "bg-white border border-gray-300 text-gray-700"
        }`}
      >
        Credit
      </button>
      <button
        onClick={() => setActiveTab("debit")}
        className={`px-4 py-2 rounded-md text-sm font-semibold ${
          activeTab === "debit"
            ? "bg-red-600 text-white"
            : "bg-white border border-gray-300 text-gray-700"
        }`}
      >
        Debit
      </button>
    </div> */}



    <button
  onClick={() => setActiveTab("credit")}
  className={`w-full px-4 py-2 rounded-md text-sm font-semibold ${
    activeTab === "credit"
      ? "bg-green-600 text-white"
      : "bg-white border border-gray-300 text-gray-700"
  }`}
>
  Credit
</button>

<button
  onClick={() => setActiveTab("debit")}
  className={`w-full px-4 py-2 rounded-md text-sm font-semibold ${
    activeTab === "debit"
      ? "bg-red-600 text-white"
      : "bg-white border border-gray-300 text-gray-700"
  }`}
>
  Debit
</button>
  </div>

  <div className="">
        <div className="relative flex justify-end">
    <input
      className="w-full md:w-72 border border-gray-300 rounded-md py-2 pl-10 pr-2 focus:outline-none focus:ring focus:ring-blue-200 text-sm md:text-base"
      placeholder="Search by transaction ID"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    {/* <span className="absolute left-2 text-lg top-2.5 text-gray-400">
      <CiSearch />
    </span> */}
  </div>
  </div>




  {/* Transaction Cards */}
  {filteredTxns
    .filter((txn) => activeTab === "all" || txn.type === activeTab)
    .map((txn) => (
      <div
        key={txn.id}
        className="relative rounded-xl mb-5 shadow-lg bg-white mt-4"
      >
        <div
          className={`absolute left-0 top-0 p-4 w-full border-t-2 rounded-t-xl ${
            txn.type === "credit"
              ? "border-t-[#15803D]"
              : "border-t-[#F80000]"
          }`}
        />
        <div className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-2 md:gap-0">
            <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
              {txn.type === "credit" ? (
                <div className="p-2 bg-green-50 rounded-xl">
                  <FiArrowDownLeft className="text-[#059669] text-xl" />
                </div>
              ) : (
                <div className="p-2 bg-red-50 rounded-lg">
                  <FiArrowUpRight className="text-[#DC2626] text-xl" />
                </div>
              )}

              <span className="font-semibold text-gray-700 w-20 capitalize text-sm md:text-base">
                {txn.type === "credit" ? "Credited" : "Debit"}
              </span>

              <div className="text-sm md:text-base text-blue-700 flex-1 min-w-[100px]">
                ( {txn.notes} )
              </div>
            </div>

            <span
              className={`font-bold text-lg md:text-xl ${
                txn.type === "credit" ? "text-[#059669]" : "text-[#DC2626]"
              }`}
            >
              {txn.type === "credit" ? "+" : "-"}₹{txn.amount.toFixed(2)}
            </span>
          </div>

          <div className="flex flex-wrap md:flex-nowrap items-center gap-1 md:gap-4 text-xs md:text-sm text-gray-500">
            <span className="flex items-center gap-1 whitespace-nowrap">
              <svg
                className="w-3 h-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth={2}
                ></circle>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3"
                />
              </svg>
              {txn.date}
            </span>
            <span className="whitespace-nowrap">{txn.time}</span>
            <span className="whitespace-nowrap">
              Transaction ID:{" "}
              <span className="font-bold text-gray-700">{txn.txnId}</span>
            </span>
            <span className="whitespace-nowrap flex flex-col md:flex-row">
              Mode of Payment:{" "}
              <span className="font-bold flex flex-row md:flex-col text-gray-700">
                Via {txn.paymentMode}
              </span>
            </span>
          </div>
        </div>
      </div>
    ))}
</div>
    </div>
  );
}

