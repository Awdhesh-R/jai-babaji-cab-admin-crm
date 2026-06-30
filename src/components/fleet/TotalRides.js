"use client";
import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaClock, FaUser, FaCar } from "react-icons/fa";
import { apiClient } from "@/app/lib/apiClient";

const tabs = ["All", "Upcoming", "Completed", "Cancelled"];

const TotalRides = ({ fleetId }) => {
  const [activeTab, setActiveTab] = useState("All");

  const [allRides, setAllRides] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [cancelled, setCancelled] = useState([]);

  useEffect(() => {
    if (!fleetId) return;

    const fetchRides = async () => {
      try {
        const up = await apiClient(
          "GET",
          `/fleet/getOperatorRidesByStatus/${fleetId}?status=upcoming`,
          "",
          true
        );

        const com = await apiClient(
          "GET",
          `/fleet/getOperatorRidesByStatus/${fleetId}?status=completed`,
          "",
          true
        );

        const can = await apiClient(
          "GET",
          `/fleet/getOperatorRidesByStatus/${fleetId}?status=cancelled`,
          "",
          true
        );

        setUpcoming(up?.data || []);
        setCompleted(com?.data || []);
        setCancelled(can?.data || []);

        setAllRides([
          ...(up?.data || []),
          ...(com?.data || []),
          ...(can?.data || []),
        ]);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRides();
  }, [fleetId]);

  const ridesMap = {
    All: allRides,
    Upcoming: upcoming,
    Completed: completed,
    Cancelled: cancelled,
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">Total Rides</h2>

      {/* Tabs */}
      {/* <div className="flex bg-gray-50 p-1 rounded-full mb-6 overflow-x-auto">
        {tabs.map((tab) => {
          const active = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition
                ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
            >
              {tab}
              <span className="ml-2 text-xs bg-white/30 px-2 rounded-full">
                {ridesMap[tab]?.length || 0}
              </span>
            </button>
          );
        })}
      </div> */}
      <div className="flex items-center mb-6 bg-gray-50 p-1 rounded-full shadow-inner w-full overflow-x-auto">
  {tabs.map((tab) => {
    const isActive = activeTab === tab;

    let activeClasses = "";
    if (tab === "Completed" && isActive) {
      activeClasses = "bg-gradient-to-r from-green-400 to-green-900 text-white";
    } else if (tab === "Cancelled" && isActive) {
      activeClasses = "bg-gradient-to-r from-red-400 to-red-700 text-white";
    } else if (isActive) {
      activeClasses = "bg-gradient-to-r from-[#005ED7] to-[#2E89FF] text-white";
    }

    return (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`flex-1 text-center px-4 py-2 rounded-full font-medium text-sm transition whitespace-nowrap
          ${
            isActive
              ? activeClasses
              : "text-gray-600 hover:bg-gray-100"
          }`}
      >
        {tab}
        <span
          className={`ml-2 font-semibold inline-block rounded-full px-2 py-0.5
            ${
              isActive
                ? "bg-white/20 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
        >
          {ridesMap[tab]?.length || 0}
        </span>
      </button>
    );
  })}
</div>


      {/* Ride Cards */}
      <div className="space-y-4">
        {(ridesMap[activeTab] || []).map((ride, index) => (
          <div
            key={index}
            className="border rounded-xl p-4 flex justify-between shadow-sm hover:shadow"
          >
            <div>
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                {ride.ride_status}
              </span>

              <div className="flex items-center gap-2 mt-2 text-sm">
                <FaMapMarkerAlt className="text-red-500" />
                {ride.booking?.location_details?.source || "--"}
                <span className="mx-1">→</span>
                <FaMapMarkerAlt className="text-green-600" />
                {ride.booking?.location_details?.destination || "--"}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <FaClock />
                {new Date(ride.ride_accept_time).toLocaleString()}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <FaUser />
                {ride.booking?.driver_details_json?.drv_name || "N/A"} (
                {ride.booking?.driver_details_json?.driver_mobile || "N/A"})
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <FaCar />
                {ride.booking?.cab_details_json?.cab_reg || "N/A"}
              </div>
            </div>

            <div className="flex items-end">
              <div className="bg-green-600 text-white px-3 py-1 rounded-md text-sm">
                ₹
                {ride.booking?.price_details_json?.collected_by_driver || 0}
              </div>
            </div>
          </div>
        ))}

        {ridesMap[activeTab]?.length === 0 && (
          <p className="text-center text-gray-500 text-sm">
            No rides found
          </p>
        )}
      </div>
    </div>
  );
};

export default TotalRides;