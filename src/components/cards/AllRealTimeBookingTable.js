"use client";
import React, { useEffect, useState } from "react";
import {
  FaCarSide,
  FaCopy,
  FaExternalLinkAlt,
  FaClock,
  FaAndroid,
  FaApple,
  FaLaptop,
} from "react-icons/fa";
import { SiGitconnected } from "react-icons/si";
import Switch from "@mui/material/Switch";
import moment from "moment";
import Image from "next/image";
import { toast } from "react-toastify";
import { apiClient } from "@/app/lib/apiClient";
import CommonModal from "../common/CommonModal";
import AddRemarksSection from "../customerDetail/AddRemarksSection";
import { FaClockRotateLeft } from "react-icons/fa6";
import RideConnectionModal from "../modals/RideConnectionModal";
import { BsArrowRightCircle } from "react-icons/bs";
import PublishModal from "../ridesManagement/details/publishModal";

const AllRealTimeBookingTable = ({
  rides = [],
  refreshList,
  custom = false,
  moreData,
  checklastCardRef,
}) => {
  const [openModal, setModalOpen] = useState(false);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [publishModalOpen, setPublishModalOpen] = useState(false);

  const rideServiceTypeEnum = {
    local: "Local",
    intercity: "Inter city",
    intracity: "Intra city",
    interstate: "Inter state",
    rental: "Rental",
    global: "Global",
  };

  const formatDate = (date) => moment(date).format("DD MMM, YYYY hh:mm A");

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "processing":
        return "bg-orange-100 text-orange-700";
      case "confirmed":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getMapURL = (ride) => {
    if (ride?.route_map && ride?.route_map !== "0") return ride.route_map;
    const src = ride?.booking_source_coordinates?.coordinates;
    const dest = ride?.booking_destination_coordinates?.coordinates;
    if (!src || !dest) return null;

    return `https://www.google.com/maps/dir/${encodeURIComponent(
      src
    )}/${encodeURIComponent(dest)}`;
  };

  const goToConnectRide = (urid) => {
    window.open(`/ridesManagement/searchRideConnection/${urid}`, "_blank");
  };

  return (
    <div className="overflow-x-auto w-full bg-white rounded-2xl shadow-md p-4">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-2 py-2">URID</th>
            <th className="px-2 py-2">Customer</th>
            <th className="px-2 py-2">Travel Date</th>
            <th className="px-2 py-2">Route</th>
            <th className="px-2 py-2">Fare</th>
            <th className="px-2 py-2">Status</th>
            <th className="px-2 py-2 text-center">	Cab & Driver</th>
            <th className="px-2 py-2 text-center">Notifications</th>
          </tr>
        </thead>

        <tbody>
          {rides.map((ride, idx) => {
            const isLast = idx === rides.length - 1;

            return (
              <tr
                key={ride?.urid || idx}
                ref={isLast ? checklastCardRef : null}
                className="border hover:bg-gray-50"
              >
                {/* URID */}
                <td className="px-2 py-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-center">
                      {ride?.id}
                    </span>
                    <FaCopy
                      size={12}
                      className="cursor-pointer"
                      onClick={async () => {
                        await navigator.clipboard.writeText(ride?.id);
                        toast.info("URID copied");
                      }}
                    />
                    <FaExternalLinkAlt
                      size={12}
                      className="cursor-pointer"
                      onClick={() =>
                        window.open(
                          `/ridesManagement/details?urid=${ride?.id}`,
                          "_blank"
                        )
                      }
                    />
                  </div>

                  <div className="flex items-center gap-1 text-xs mt-1">
                    {ride?.via_source === "android" && <FaAndroid />}
                    {ride?.via_source === "ios" && <FaApple />}
                    {(ride?.via_source === "web" ||
                      ride?.via_source === "website") && <FaLaptop />}
                    <span>
                      {rideServiceTypeEnum[
                        ride?.cluster_details?.rideServiceType?.toLowerCase()
                      ] || "-"}
                    </span>
                  </div>
                </td>

                {/* Customer */}
                <td className="px-2 py-2 text-center">
                  <div className="flex flex-col">
                    <span>
                      {ride?.user_details_json?.name}(
                      {ride?.user_details_json?.book_for})
                    </span>
                    <span className="text-xs text-gray-500">
                      {ride?.user_details_json?.mobile}
                    </span>
                  </div>
                </td>

                {/* Date */}
                <td className="px-2 py-2 text-xs text-center">
                  <FaClock className="inline mr-1 text-blue-500" />
                  {formatDate(ride?.booking_travel_date)}
                </td>

                {/* Route */}

                <td className="px-2 py-2 text-center">
                  <div className="flex justify-between flex-wrap gap-2">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-[12px]">
                        <span className="h-[8px] w-[8px] bg-green-500 rounded-full"></span>
                        <span className="text-gray-700 dark:text-gray-300">
                          {ride?.source_city_name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[12px]">
                        <span className="h-[8px] w-[8px] bg-red-500 rounded-full"></span>
                        <span className="text-gray-700 dark:text-gray-300">
                           {ride?.destination_city_name}
                        </span>
                      </div>
                    </div>
                    <span
                      className=""
                      onClick={(e) => {
                        e.stopPropagation();
                        const url = getMapURL(ride);
                        if (url) {
                          window.open(url, "_blank");
                        }
                      }}
                      style={{
                        display: "flex",
                        alignItems: "start",
                        cursor: "pointer",
                      }}
                    >
                      <Image
                        src="/icons/googlemap.svg"
                        alt="Google Maps"
                        height={25}
                        width={25}
                      />
                    </span>
                  </div>
                </td>
                <td className="px-2 py-2 text-left">
                  {!custom && (
                    <div className="text-[12px] flex flex-col">
                      <div className="flex gap-4 justify-between">
                        <span className="">Distance</span>
                        <span className="font-semibold">
                          {ride?.price_details_json?.estimated_km} Km
                        </span>
                      </div>
                      <div className="flex gap-4 justify-between">
                        <span className="">Estimated Fare</span>
                        <span className=" text-blue-600 font-semibold">
                          ₹{ride?.price_details_json?.estimated_fare ?? ride?.price_details_json?.estimated_price ?? 0}
                        </span>
                      </div>
                      <div className="flex gap-4 justify-between">
                        <span className="">Collected By Driver</span>
                        <span className=" text-blue-600 font-semibold">
                          ₹{ride?.price_details_json?.collected_by_driver ?? ride?.amount_to_be_Paid ?? 0}
                        </span>
                      </div>
                    </div>
                  )}
                  {custom && (
                    <div className="text-[12px] flex flex-col gap-1">
                      <div className="flex gap-4 justify-between">
                        <span className="">Final Fare</span>
                        <span className=" text-blue-600 font-semibold">
                          ₹{ride?.price_details_json?.final_fare}
                        </span>
                      </div>
                      <div className="flex gap-4 justify-between">
                        <span className="">Advance Amount</span>
                        <span className=" text-blue-600 font-semibold">
                          ₹{ride?.price_details_json?.advance_amount ?? ride?.price_details_json?.advance_to_be ?? 0}
                        </span>
                      </div>
                      <div className="flex gap-4 justify-between">
                        <span className="">Collected By Driver</span>
                        <span className=" text-blue-600 font-semibold">
                          ₹{ride?.price_details_json?.collected_by_driver ?? ride?.amount_to_be_Paid ?? 0}
                        </span>
                      </div>
                    </div>
                  )}
                </td>

                {/* Status */}
                <td className="px-2 py-2 text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getStatusClass(
                      ride?.status
                    )}`}
                  >
                    {ride?.status}
                  </span>
                </td>

                {/* Actions */}

                              <td className="px-2 py-2">
                {ride?.cab_details_json?.cab_reg ? (
                  <div className={`flex flex-col ${ride?.cab_details_json?.cab_source === "Operator"? "bg-blue-100": ""}`}>
                    <span>{ride?.cab_details_json?.cab_reg}</span>
                    <span className="text-gray-500 dark:text-gray-400 text-[12px]">{ride?.cab_details_json?.cab_model}-{ride?.cab_details_json?.cab_type}({ride?.cab_details_json?.cab_source})</span>
                    <span className='text-gray-500 text-[12px] capitalize'>{ride?.cab_details_json?.cab_service_type}</span>
                    <div className='flex items-center gap-2'>
                        <span className={`h-[8px] w-[8px] rounded-full ${ride?.booking_details_updated_to_driver? "bg-green-500": "bg-red-500"}`}></span>
                      <span className="items-center gap-2 text-slate-700 dark:text-gray-200 text-[14px] font-semibold text-ellipsis">
                        {ride?.driver_details_json?.drv_name || ""}
                      </span>
                    </div>
                  </div>
                ):"-"}
              </td>

              {/* Notifications */}

                <td className="px-2 py-2">
                  {ride?.searched_drivers_details_json?.length > 0 ? (
                    <div className="flex flex-col gap-1 text-xs">
                      {ride.searched_drivers_details_json.map((drv, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between bg-gray-100 px-2 py-1 rounded"
                        >
                          {/* <span className="font-medium">
            {drv.name}
          </span> */}
                          <div className="flex flex-col">
                            <span className="font-medium">{drv.name}</span>
                            <span className="text-[10px] text-gray-500">
                              {drv.mobile}
                            </span>
                          </div>

                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full ${
                              drv.from === "rb_driver"
                                ? "bg-green-100 text-green-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {drv.from === "rb_driver"
                              ? "RB Driver"
                              : "Operator"}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400 text-xs">
                      No notification sent
                    </span>
                  )}
                </td>

                {/* <td className="px-2 py-2 text-center">
                  <div className="flex gap-2 justify-center">
                    <FaClockRotateLeft
                      size={12}
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedRide(ride);
                        setModalOpen(true);
                      }}
                    />
                    <button
                      onClick={() =>
                        ride?.connected_ride_id
                          ? setShowConnectionModal(true)
                          : goToConnectRide(ride?.urid)
                      }
                      className="text-xs border px-2 py-1 rounded"
                    >
                      <SiGitconnected />{" "}
                      {ride?.connected_ride_id ? "Connected" : "Connect"}
                    </button>
                  </div>
                </td> */}
              </tr>
            );
          })}
        </tbody>
      </table>

      {!moreData && (
        <div className="text-center text-gray-500 mt-3">🚫 No more rides</div>
      )}
    </div>
  );
};

export default AllRealTimeBookingTable;
