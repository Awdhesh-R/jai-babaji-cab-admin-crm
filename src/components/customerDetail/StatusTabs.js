"use client";
import React, { useState } from "react";
import RideStatsCard from "./RideStatCards";

const rideData = [
  { title: "Total Ride", valueKey: "total" },
  { title: "Intra City", valueKey: "intraCity" },
  { title: "Local", valueKey: "local" },
  { title: "Inter City", valueKey: "interCity" },
  { title: "Inter State", valueKey: "interState" },
  { title: "Rental", valueKey: "rental" },
];

const statusColors = {
  all: "bg-gray-500 text-white",
  searched: "bg-[#FFC107] border-green-300 text-white",
  pending: "bg-[#FFC107] text-white",
  processing: "bg-[#FFB74D] text-white",
  confirmed: "bg-[#009688] text-white",
  // onride: 'bg-[#03A9F4] text-white',
  assigned: "bg-[#3F51B5] text-white",
  arrived: "bg-[#673AB7] text-white",
  started: "bg-[#1B59F8] text-white",
  completed: "bg-[#16A34A] text-white",
  cancelled: "bg-[#F44336] text-white",
  connectedride: "bg-[#19A625] text-white",
  notcollected: "bg-[#F44336] text-white",
  approved: "bg-[#3F51B5] text-white",
};

const marketRideData = [
  { title: "All", valueKey: "all" },
  { title: "Pending", valueKey: "pending" },
  { title: "Confirmed", valueKey: "confirmed" },
  { title: "Assigned", valueKey: "assigned" },
  { title: "Arrived", valueKey: "arrived" },
  { title: "Started", valueKey: "started" },
  { title: "Completed", valueKey: "completed" },
  { title: "Not Collected", valueKey: "notcollected" },
  { title: "Cancelled", valueKey: "cancelled" },
  { title: "Connected", valueKey: "connectedride" },
];

export default function StatusTabs({
  statusTab,
  setStatusTab,
  tabs,
  rideserviceTypeData,
  totalCount,
  marketRideReport = {},
}) {
  const [activeCard, setActiveCard] = useState("Total Ride");

  return (
    <div className="w-full bg-white dark:bg-gray-900 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-md">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 w-full">
        {tabs.map((tab, idx) => {
          const normalizedTab =
            tab.toLowerCase() === "connected"
              ? "connectedride"
              : tab.toLowerCase() === "on ride"
              ? "onride"
              : tab?.toLowerCase() === "not collected"
              ? "notcollected"
              : tab.toLowerCase();
          const isActive = statusTab.toLowerCase() === normalizedTab;
          return (
            <div className="w-full" key={idx}>
              <button
                onClick={() => {
                  if (tab.toLowerCase() === "connected") {
                    window.open("/fleetManagement/connectRideList", "_blank");
                    return;
                  }
                  setStatusTab(
                    tab.toLowerCase() === "connected"
                      ? "connectedride"
                      : tab.toLowerCase() === "on ride"
                      ? "onride"
                      : tab?.toLowerCase() === "not collected"
                      ? "notcollected"
                      : tab.toLowerCase()
                  );
                }}
                className={`w-full px-4 py-1.5 rounded-md border text-center text-sm font-semibold transition-all duration-200
                  ${
                    isActive
                      ? statusColors[statusTab]
                      : "bg-white text-gray-700 border-gray-300"
                  }
                `}
              >
                {tab}
              </button>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2 w-full my-2">
        {rideData.map((data, i) => {
          const isActive = activeCard === data.title;
          return (
            <button
              key={i}
              onClick={() => setActiveCard(data.title)}
              className="cursor-pointer"
            >
              <RideStatsCard
                {...data}
                rideserviceTypeData={{
                  ...rideserviceTypeData,
                  total: totalCount,
                }}
                isActive={isActive}
              />
            </button>
          );
        })}
      </div>
      {/* <h3 className="text-base font-semibold mb-2 text-gray-800 dark:text-gray-200">
        Market Ride Report
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-2 w-full">
        {marketRideData.map((data, i) => (
          <button key={i} onClick={() => setActiveCard(data.title)}>
            <RideStatsCard
              {...data}
              rideserviceTypeData={marketRideReport}
              isActive={activeCard === data.title}
            />
          </button>
        ))}
      </div> */}
    </div>
  );
}
