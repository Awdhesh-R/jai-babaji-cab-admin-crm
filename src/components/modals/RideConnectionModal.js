"use client";
import React, { useState, useEffect } from "react";
import { TiLocation } from "react-icons/ti";
import { IoIosArrowForward } from "react-icons/io";
import { FiSearch, FiFilter } from "react-icons/fi";
import Image from "next/image";
import { MdContentCopy } from "react-icons/md";
import { FaLink, FaTimes } from "react-icons/fa";
import { BsClock } from "react-icons/bs";
import { Sparkles, X } from "lucide-react";
import { apiClient } from "@/app/lib/apiClient";
import { toast } from "react-toastify";
import PublishModal from "../ridesManagement/details/publishModal";
import moment from "moment";

const cities = [
  "Patna",
  "Muzaffarpur",
  "Samastipur",
  "Madhubani",
  "Sitamarhi",
  "Gaya",
  "Purnia",
  "Bhagalpur",
  "Saharsa",
  "Begusarai",
  "Raxaul",
  "Forbesganj",
  "Darbhanga",
];

const tabs = [
  { label: "Forward", count: 10 },
  { label: "Reverse", count: 7 },
  { label: "Custom", count: 12 },
];

export default function RideConnectionModal({ isOpen, onClose, ridesData }) {
  const statusColors = {
    pending: "bg-[#FFC107] text-white",
    taxiPool: "bg-[#03A9F4] text-white",
    confirmed: "bg-[#009688] text-white",
    assigned: "bg-[#3F51B5] text-white",
    arrived: "bg-[#673AB7] text-white",
    started: "bg-[#1B59F8] text-white",
    completed: "bg-[#16A34A] text-white",
    cancelled: "bg-[#F44336] text-white",
    cabFound: "bg-[#8BC34A] text-white",
    needCab: "bg-[#FF9800] text-white",
    cancellation: "bg-[#E57373] text-white",
    linkSent: "bg-[#00BCD4] text-white",
    all: "bg-[#9E9E9E] text-white",
    notVerified: "bg-[#FFB300] text-white",
    activeRides: "bg-[#1E88E5] text-white",
  };
  const [selectedCity, setSelectedCity] = useState([]);
  const [selectedTab, setSelectedTab] = useState("Forward");
  const [connectedRideList, setConnectedRideList] = useState([]);
  const [rideId, setRideId] = useState("");
  const [distance, setDistance] = useState(0);
  const [amount, setAmount] = useState(0);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [lastCabDetails, setLastCabDetails] = useState(null);

  useEffect(() => {
    if (connectedRideList.length > 0) {
      let totalDistance = connectedRideList.reduce((sum, ride) => {
        return (sum +=
          parseFloat(ride?.price_details_json?.estimated_km) +
          (ride?.gap_km ? parseFloat(ride?.gap_km.split(" ")[0]) : 0));
      }, 0);
      let totalAmount = connectedRideList.reduce((sum, ride) => {
        return (sum += ride?.price_details_json?.collected_by_driver
          ? parseFloat(ride?.price_details_json?.collected_by_driver)
          : 0);
      }, 0);
      console.log(totalDistance, totalAmount);
      setDistance(totalDistance);
      setAmount(totalAmount);
    }
  }, [connectedRideList]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  useEffect(() => {
    if (!ridesData?.urid || !isOpen) {
      return; // ✅ No null return
    }
    fetchConnectedRideList();
  }, [isOpen, ridesData?.urid]);

  const connectRide = async (con_ride_id) => {
    console.log("Connecting", ridesData?.urid, con_ride_id);
    let payData = {
      type: "manual",
      parent_ur_id: ridesData?.urid,
      connection_urid_list: con_ride_id,
    };

    try {
      const response = await apiClient(
        "POST",
        "/rideConnectionManagement/connectRide",
        JSON.stringify(payData),
        true
      );
      if (response?.success) {
        toast.success(response.message);
        fetchConnectedRideList();
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDisconnect = async (ride) => {
    let payData = {
      parent_urid: ridesData?.urid,
      disconnected_urid: ride?.urid,
    };

    try {
      const response = await apiClient(
        "POST",
        "/rideConnectionManagement/disconnectedRideListByurid",
        JSON.stringify(payData),
        true
      );
      if (response?.success) {
        toast.success(response.message);
        fetchConnectedRideList();
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchConnectedRideList = async () => {
    try {
      const response = await apiClient(
        "GET",
        `/rideConnectionManagement/connectedRideListByurid/${ridesData?.urid}`,
        "",
        true
      );
      if (response?.success) {
        console.log("connectedRideList", response?.data);
        setConnectedRideList(response?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getMapURL = (multiple = false, ride = null) => {
    if (multiple) {
      let arr = [...connectedRideList];
      let coordinates = arr.reduce(
        (c, r) =>
          (c += `${r.booking_source_coordinates?.coordinates.sort()}/${r.booking_destination_coordinates?.coordinates.sort()}/`),
        ""
      );
      return `https://www.google.com/maps/dir/${coordinates}`;
    } else if (!multiple && ride) {
      const src1 = ride?.booking_source_coordinates?.coordinates.sort();
      const dest1 = ride?.booking_destination_coordinates?.coordinates.sort();
      return `https://www.google.com/maps/dir/${encodeURIComponent(
        src1
      )}/${encodeURIComponent(dest1)}`;
    } else {
      return false;
    }
  };

  const publishRide = () => {
    setPublishModalOpen(true);
  };

  const handleSelectCity = (city) => {
    if (!selectedCity.includes(city)) {
      setSelectedCity([...selectedCity, city]);
    }
  };

  const handleRemove = (city) => {
    setSelectedCity((prev) => prev.filter((item) => item !== city));
  };

  const handleClearAll = () => {
    setSelectedCity([]);
  };

  useEffect(() => {
    if (connectedRideList.length > 0) {
      const lastCab = [...connectedRideList]
        .reverse()
        .find((ride) => ride?.cab_details_json);

      if (lastCab) {
        setLastCabDetails(lastCab.cab_details_json);
      }
    }
  }, [connectedRideList]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end items-start bg-black/70 px-4">
      <div className="my-auto bg-gradient-to-r from-[#E8F1FF] to-[#005FE2] shadow-xl w-full max-w-4xl p-6 relative">
        <button
          className="absolute top-0 right-4 text-white hover:text-gray-800 text-3xl font-semibold"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Tab Buttons */}
        <div className="flex items-start justify-start gap-2 my-4">
          <div className="flex w-full items-center border-2 border-[#005FE2] rounded-md shadow-sm overflow-hidden bg-gradient-to-r from-[#E8F1FF] to-[#dceeff]">
            <input
              type="text"
              value={rideId}
              onChange={(e) => setRideId(e.target.value)}
              placeholder="Enter Ride ID"
              className="flex-1 px-4 py-2 text-sm bg-transparent focus:outline-none placeholder-blue-400 text-blue-800"
            />
            <button
              onClick={() => {
                connectRide(rideId);
              }}
              className="flex items-center gap-1 bg-gradient-to-r from-[#1E3A8A] to-[#1E40AF] text-white px-5 py-1 text-[14px] rounded-full m-1 transition hover:opacity-90"
            >
              Connect
              <FaLink className="text-white text-xs" />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="px-4 font-bold"> {ridesData?.urid} </div>
          <button
            onClick={() => {
              setPublishModalOpen(true);
            }}
            className={`flex items-center gap-1 text-white px-5 py-1 text-[14px] rounded-full m-1 transition hover:opacity-90 ${
              ridesData?.assigned_to_fleet == "unpublished"
                ? "bg-gradient-to-r from-[#1E3A8A] to-[#1E40AF]"
                : "bg-gradient-to-r from-[#208a1e] to-[#2aaf1e]"
            }`}
          >
            {ridesData?.assigned_to_fleet == "unpublished"
              ? "Publish Ride"
              : "Published"}
            <FaLink className="text-white text-xs" />
          </button>
        </div>
        <div className="space-y-4 shadow-lg shadow-gray-400 rounded-md bg-white pb-4">
          <div className="bg-gradient-to-r from-[#2563EB] to-[#1E40AF] p-4 rounded-t-md flex items-center justify-between">
            <span className="text-white gap-5">Connected Rides </span>

            <div className="text-white">
              {/* <span className="capitalize">
                {ridesData.cab_details_json?.cab_type}
              </span>{" "} */}
              <span className="capitalize">
                {ridesData?.cab_details_json?.cab_type ||
                  lastCabDetails?.cab_type ||
                  ridesData?.booking_type ||
                  "Cab type not assigned"}
              </span>{" "}
              {/* <span>
  {ridesData?.cab_details_json
    ? ridesData.cab_details_json.cab_type
    : "Cab not assigned"}
</span> */}
              {/* <span>{ridesData.cab_details_json?.cab_reg}</span> */}
              <span>
                {ridesData?.cab_details_json?.cab_reg ||
                  lastCabDetails?.cab_reg ||
                  ""}
              </span>
            </div>
            {connectedRideList.length > 0 && (
              <div className="flex items-center gap-2">
                <div>
                  <span
                    className="ml-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      const url = getMapURL(true);
                      if (url) {
                        window.open(url, "_blank");
                      }
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <Image
                      src="/icons/googlemap.svg"
                      alt="Google Maps"
                      height={30}
                      width={30}
                    />
                  </span>
                </div>

                <div className="text-white flex gap-2 items-center">
                  <span className="bg-green-500 rounded-full w-2 h-2"></span>{" "}
                  <span>₹{amount}</span>
                </div>
                <div className="text-white flex gap-2 items-center">
                  <span className="bg-green-500 rounded-full w-2 h-2"></span>{" "}
                  <span>{distance} Km</span>
                </div>
                <div className="text-white flex gap-2 items-center">
                  <span className="bg-green-500 rounded-full w-2 h-2"></span>{" "}
                  <span>₹{Math.ceil(Math.max(amount / distance, 0))}/km</span>
                </div>
              </div>
            )}
          </div>
          <div className="overflow-y-auto h-[60vh]">
            {connectedRideList?.length > 0 ? (
              connectedRideList.map((ride, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-3 bg-[#F2F7FF] border border-[#005FE2] rounded-md shadow-lg m-6 px-6 py-4 relative"
                >
                  <div className="flex flex-wrap items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium bg-white border border-[#005FE2] rounded-md">
                      <span className="flex items-center gap-1 text-blue-600 rounded-full px-3 py-1">
                        <TiLocation className="text-green-500 text-[16px]" />
                        <span className="text-[14px] font-semibold">
                          {ride?.source_city_name}
                        </span>
                      </span>
                      <IoIosArrowForward className="text-gray-400 text-lg" />
                      <span className="flex items-center gap-1 text-blue-600 rounded-full px-3 py-1">
                        <TiLocation className="text-red-500 text-[16px]" />
                        <span className="text-[14px] font-semibold">
                          {ride?.destination_city_name}
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="capitalize font-bold text-black text-lg">
                        {ride?.cab_details_json
                          ? ride?.cab_details_json?.cab_type
                          : ride?.op_cab_details_json
                          ? ride?.op_cab_details_json?.cab_type
                          : ride?.booking_type
                          ? ride?.booking_type
                          : "-"}
                      </span>
                      <div>
                        <span
                          className="ml-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            const url = getMapURL(false, ride);
                            if (url) {
                              window.open(url, "_blank");
                            }
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                        >
                          <Image
                            src="/icons/googlemap.svg"
                            alt="Google Maps"
                            height={30}
                            width={30}
                          />
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
                      <div className="bg-white px-3 py-1.5 rounded-md text-[14px] text-blue-700 flex gap-1 items-center font-medium border border-[#005FE2]">
                        Fare: ₹
                        {ride?.price_details_json?.collected_by_driver || 0}
                      </div>
                      {/* bg-gradient-to-r from-[#10B981] to-[#16A34A] */}
                      {/* <div className="px-3 py-2 rounded-md text-[14px] text-black flex gap-1 items-center font-medium">
                                                <span>Gap</span>
                                                <span>{ride?.gap_km ? ride?.gap_km : '0'} Km</span>
                                            </div> */}
                      <div
                        className={`border capitalize px-3 py-2 rounded-md text-[14px] ${
                          statusColors[ride?.status]
                        } flex gap-1 items-center font-medium`}
                      >
                        {ride?.status}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between text-xs text-gray-600 gap-2 px-1">
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1">
                        ID:{" "}
                        <span
                          className="text-[#005FE2] text-[13px] font-semibold hover:underline cursor-pointer"
                          onClick={() =>
                            window.open(
                              `/ridesManagement/details?urid=${ride?.urid}`
                            )
                          }
                        >
                          {ride?.urid}
                        </span>
                        <MdContentCopy
                          className="cursor-pointer"
                          onClick={async () => {
                            await navigator.clipboard.writeText(ride?.urid);
                            toast.info("URID copied to clipboard");
                          }}
                        />
                      </div>
                      <span>
                        Distance:{" "}
                        <span className="text-[#005FE2] text-[13px] font-semibold">
                          {ride?.price_details_json?.estimated_km} Km
                        </span>
                      </span>

                      <div className="flex items-center gap-1 font-semibold">
                        <BsClock className="text-gray-500" />
                        <span className="text-[13px]">
                          {moment(
                            ride?.booking_travel_date,
                            "DD-MM-YYYY HH:mm:ss"
                          ).format("DD MMM YYYY, hh:mm A")}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        className="bg-gradient-to-r from-[#F80000] to-[#920000] text-white text-sm font-semibold px-5 py-1.5 rounded-md shadow-md hover:opacity-90 transition-all"
                        onClick={() => handleDisconnect(ride)}
                      >
                        Disconnect →
                      </button>
                    </div>
                  </div>

                  {/* <div className="flex justify-center items-center gap-6 text-xs text-gray-600 ">
                      <span>
                        Gap KM:{" "}
                        <span className="text-[13px] font-semibold">
                          {ride?.gap_km || 0} Km
                        </span>
                      </span>

                      <span>
                        Gap Time:{" "}
                        <span className="text-[13px] font-semibold">
                          {Number(ride?.gap_time)
                            ? `${Math.floor(
                                (Number(ride.gap_time) + 60) / 60
                              )} hr ${(Number(ride.gap_time) + 60) % 60} min`
                            : "0 min"}
                        </span>
                      </span>
                    </div> */}
                  <div className="flex items-center text-xs text-gray-600">
                    {/* Start (Left): Estimated Time */}
                    <div className="flex-1 text-left">
                      Estimated Time:{" "}
                      <span className="text-[13px] font-semibold">
                        {ride?.price_details_json?.estimated_time
                          ? (() => {
                              const [hh, mm] =
                                ride.price_details_json.estimated_time
                                  .split(":")
                                  .map(Number);

                              const totalMinutes = hh * 60 + mm + 60;
                              const hours = Math.floor(totalMinutes / 60);
                              const minutes = totalMinutes % 60;

                              return `${hours} hr ${minutes} min`;
                            })()
                          : "0 min"}
                      </span>
                    </div>

                    {/* Center: Gap KM */}
                    <div className="flex-1 text-center">
                      Gap Time:{" "}
                      <span className="text-[13px] font-semibold">
                        {Number(ride?.gap_time)
                          ? `${Math.floor(Number(ride.gap_time) / 60)} hr ${
                              Number(ride.gap_time) % 60
                            } min`
                          : "0 min"}
                      </span>
                    </div>

                    {/* End (Right): Gap Time */}
                    <div className="flex-1 text-right">
                      Gap KM:{" "}
                      <span className="text-[13px] font-semibold">
                        {ride?.gap_km || 0} Km
                      </span>
                    </div>
                  </div>

                  <div className="h-8 w-8 bg-white border border-[#005FE2] text-black flex items-center justify-center rounded-full absolute left-[-17px] top-10">
                    <span>{index + 1}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex justify-center gap-4">
                <FaTimes size={24} className="text-red-600" /> No Connected Ride
                Found
              </div>
            )}
          </div>
          <PublishModal
            open={publishModalOpen}
            details={ridesData}
            onClose={() => setPublishModalOpen(false)}
            onConfirm={() => {
              setPublishModalOpen(false);
            }}
          />
        </div>
      </div>
    </div>
  );
}
