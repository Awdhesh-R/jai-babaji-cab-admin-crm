'use client'
import React, { useState } from "react";
import { CiSearch, CiFilter } from "react-icons/ci";
import { LuWallet } from "react-icons/lu";


const driverRecords = [
  { id: 1, driver: "Abhishek Kumar", mobile: "+91 9693189968", cab: "KA-01-AB-1234", wallet: 450, totalRides: 12 },
  { id: 2, driver: "Ravi Sharma", mobile: "+91 9876543210", cab: "DL-02-XY-4567", wallet: 820, totalRides: 18 },
  { id: 3, driver: "Sandeep Singh", mobile: "+91 9123456789", cab: "MH-03-ZA-7890", wallet: 230, totalRides: 7 },
  { id: 4, driver: "Rahul Verma", mobile: "+91 9812345678", cab: "UP-14-BQ-1122", wallet: 600, totalRides: 15 },
  { id: 5, driver: "Vikram Mehta", mobile: "+91 9988776655", cab: "GJ-05-LM-3344", wallet: 150, totalRides: 5 },
  { id: 6, driver: "Deepak Patel", mobile: "+91 9765432109", cab: "TN-10-CX-5566", wallet: 920, totalRides: 20 },
  { id: 7, driver: "Amit Yadav", mobile: "+91 9090909090", cab: "RJ-11-QW-7788", wallet: 310, totalRides: 9 },
  { id: 8, driver: "Karan Thakur", mobile: "+91 9654321890", cab: "PB-08-ER-9900", wallet: 700, totalRides: 14 },
  { id: 9, driver: "Rohit Chauhan", mobile: "+91 9823123456", cab: "HR-26-JK-6677", wallet: 480, totalRides: 11 },
  { id: 10, driver: "Saurabh Tiwari", mobile: "+91 9876501234", cab: "MP-09-HH-2244", wallet: 550, totalRides: 13 },
];



export default function DriverWalletAmount() {
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [amountFilter, setAmountFilter] = useState(false);

  // Filter driverRecords based on search and filter criteria
  const filteredRecords = driverRecords.filter((r) => {
    const searchMatch =
      r.driver.toLowerCase().includes(search.toLowerCase()) ||
      r.mobile.toLowerCase().includes(search.toLowerCase()) ||
      r.cab.toLowerCase().includes(search.toLowerCase());
    const filterMatch = amountFilter ? r.wallet > 400 : true;
    return searchMatch && filterMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#f6faff] to-[#f3f6fc] flex flex-col items-center px-2 py-4">
      <div className="w-full bg-white shadow rounded-xl px-4 py-6">
        <h2 className="text-2xl font-bold mb-0.5 text-[#0F172A]">Driver wallet amount</h2>
        <p className="text-[#64748B] mb-5">Manage and track outstanding driver balances</p>

        {/* <div className="mb-5 ">
  <div className="flex items-center bg-[#f9f5ff] rounded-xl shadow-sm px-6 py-5 w-max min-w-[210px] gap-4">
    <div>
      <div className="text-xs font-medium text-[#64748B]">Total Dues</div>
      <div className="text-2xl font-bold text-[#0F172A] mt-0.5">₹9,100</div>
    </div>
    
    <LuWallet className="text-[42px] text-[#c3bddb]" />
  </div>
</div> */}

<div className="mb-5 flex justify-start">
  <div
    className="flex items-center rounded-[16px] shadow-sm px-6 py-5 w-full max-w-xs sm:max-w-[308px] min-h-[88px] sm:min-h-[108px]"
    style={{
      background: "linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%)",
      opacity: 1,
    }}
  >
    <div className="flex flex-col justify-center flex-1 min-w-0">
      <div className="text-xs font-medium text-[#64748B]">Total Dues</div>
      <div className="text-2xl font-bold text-[#0F172A] mt-0.5">
        ₹9,100
      </div>
    </div>
    <LuWallet className="text-[38px] sm:text-[42px] text-[#c3bddb] ml-5 sm:ml-7 shrink-0" />
  </div>
</div>

        <div className="flex flex-col sm:flex-row w-full gap-2 mb-6">
          <div className="relative w-full sm:w-full">
            <input
              type="text"
              placeholder="Search driver, mobile, or cab no."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-100"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
              <CiSearch />
            </span>
          </div>

          <div className="relative">
            <button
              className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center gap-2 hover:bg-gray-50 transition"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <CiFilter />
              Filter
            </button>
            {/* {filterOpen && (
              <div className="absolute right-0 z-10 mt-2 w-48 bg-white border border-gray-200 shadow rounded py-2">
                <label className="flex items-center gap-2 px-4 py-1">
                  <input
                    type="checkbox"
                    checked={amountFilter}
                    onChange={(e) => setAmountFilter(e.target.checked)}
                  />
                  Show wallet amount &gt; ₹400
                </label>
              </div>
            )} */}
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-1 text-[#0F172A]">Recent Activities</h3>
        <p className="text-[#64748B] mb-2">All driver wallet amount</p>

        <div className="hidden sm:block">
          <div className="overflow-hidden rounded-xl border bg-white">
            <table className="w-full bg-white border rounded-xl">
              <thead>
                <tr className="bg-gray-50 text-sm text-[#0F172A]">
                  <th className="p-2 text-left">#</th>
                  <th className="p-2 text-left">Driver</th>
                  <th className="p-2 text-left">Mobile Number</th>
                  <th className="p-2 text-left">Cab Number</th>
                  <th className="p-2 text-left">Wallet Amount</th>
                  <th className="p-2 text-left"></th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((r, idx) => (
                  <tr key={idx} className="border-b text-sm ">
                    <td className="p-2 text-[#64748B]">{idx}</td>
                    <td className="p-2 text-[#0F172A]">{r.driver}</td>
                    <td className="p-2 text-[#64748B]">{r.mobile}</td>
                    <td className="p-2 text-[#0F172A]">{r.cab}</td>
                    <td className="p-2">
                      <span
                        className="inline-block px-3 py-1 rounded-lg font-semibold"
                        style={{
                          background: "linear-gradient(90deg, #10B981 0%, #16A34A 100%)",
                          color: "#fff"
                        }}
                      >
                        ₹{r.wallet.toFixed(2)}
                      </span>
                    </td>
                    {/* <td className="p-2 text-[#64748B]">{r.totalRides}</td> */}
                    <div className="text-gray-500 p-2 text-sm">Ride Count ( {r.totalRides} )</div>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="sm:hidden space-y-3">
          {filteredRecords.map((r, idx) => (
            <div key={idx} className="bg-gray-50 border rounded-lg px-3 py-2 flex flex-col gap-1">
              <span className="text-xs text-gray-400 font-bold">#{idx + 1} Recent Activity</span>
              <div className="font-semibold text-gray-700">{r.driver}</div>
              <div className="text-gray-500 text-sm">Mobile: {r.mobile}</div>
              <div className="text-gray-500 text-sm">Cab: {r.cab}</div>
              <div className="text-right mt-1">
                <span className="inline-block px-3 py-1 rounded-lg font-semibold bg-green-100 text-green-700">
                  ₹{r.wallet.toFixed(2)}
                </span>
              </div>
              {/* <div className="text-gray-500 text-sm"> {r.totalRides}</div> */}
              <div className="text-gray-500  text-sm">Ride Count ( {r.totalRides} )</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
