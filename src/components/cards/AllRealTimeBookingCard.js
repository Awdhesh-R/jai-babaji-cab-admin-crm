"use client";
import React, { useState, useEffect } from "react";
import {
  FaCarSide,
  FaLuggageCart,
  FaClock,
  FaCopy,
  FaExternalLinkAlt,
  FaAndroid,
  FaLaptop,
  FaApple,
  FaSyncAlt,
} from "react-icons/fa";
import { IoMdNotificationsOutline } from "react-icons/io";
import { HiUsers } from "react-icons/hi";
import { SiGitconnected } from "react-icons/si";
import { BsArrowRightCircle } from "react-icons/bs";
import Image from "next/image";
import { toast } from "react-toastify";
import Switch from "@mui/material/Switch";
import moment from "moment";
import { apiClient } from "@/app/lib/apiClient";
import CommonModal from "../common/CommonModal";
import AddRemarksSection from "../realtimeDetail/realtimeAddRemarksSection";
import { FaClockRotateLeft } from "react-icons/fa6";
import RideConnectionModal from "../modals/RideConnectionModal";
// import PublishModal from "../ridesManagement/details/publishModal";
import PublishModal from "../realtimerideManagement/realtimedeatils/realtimepublishModal";
import { number } from "framer-motion";
import {
  fetchCabModelList,
  fetchCabTypeList,
} from "@/redux/features/rbCabMainSlice";

import { useDispatch, useSelector } from "react-redux";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const AllRealTimeBookingCard = ({
  rides = [],
  moreData,
  checklastCardRef,
  setAllRides,
}) => {
  const getURID = (ride) => ride.urid || ride?.id || "_";

  const getRideLink = (ride) =>
    `/ridesManagement/realtimeDetails?urid=${getURID(ride)}`;

  const [openModal, setModalOpen] = useState(false);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [showDrivers, setShowDrivers] = useState(false);
  const [showDriversModal, setShowDriversModal] = useState(false);
  // const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  const [cabNumber, setCabNumber] = useState("");
  const [cabSuggestions, setCabSuggestions] = useState([]);
  const [cabDetails, setCabDetails] = useState(null);
  // const [showOneTimeModal, setShowOneTimeModal] = useState(false);

  const [oneTimeData, setOneTimeData] = useState({
    registration_no: "",
    cab_type: "",
    cab_model: "",
    fuel_type: "",
    full_name: "",
    mobile_no: "",
    gender: "",
    profile_pic: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const { cabModels = [], cabTypes = [] } = useSelector(
    (state) => state.rbCabMain || {},
  );

  useEffect(() => {
    dispatch(fetchCabModelList());
    dispatch(fetchCabTypeList());
  }, [dispatch]);

  //   const resetAssignModal = () => {
  //     setCabSuggestions([]);
  // setCabDetails(null);

  //     setCabNumber("");
  //     setCabDetails(null);
  //     setCabSuggestions([]);
  //     // setAssignModalOpen(false);
  //   };

  const resetAssignModal = () => {
    setCabNumber("");
    setCabDetails(null);
    setCabSuggestions([]);
    setActiveModal(null); // close modal
  };

  const rideServiceTypeEnum = {
    local: "Local",
    interCity: "Inter city",
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
    const src = ride?.booking_source_coordinates?.coordinates
      ?.slice()
      ?.reverse();
    const dest = ride?.booking_destination_coordinates?.coordinates
      ?.slice()
      ?.reverse();
    if (src && dest) {
      return `https://www.google.com/maps/dir/${encodeURIComponent(
        src,
      )}/${encodeURIComponent(dest)}`;
    }
    return null;
  };

  const searchCab = async (value) => {
    setCabNumber(value);

    // if (!value || value.length < 2) {
    if (!value.trim() || value.trim().length < 2) {
      setCabSuggestions([]);
      return;
    }

    try {
      const res = await apiClient(`POST`, "/rb_cabs/rbCabsSearch", {
        searchTerm: value,
      });

      setCabSuggestions(res.data || []);
    } catch (error) {
      console.log("Cab search error:", error);
    }
  };

  const assignCabToRide = async () => {
    if (!cabDetails || !cabDetails.driver?.id) {
      toast.error("Please select a cab first");
      return;
    }

    try {
      const res = await apiClient(
        "POST",
        "/ride_management/admin-accept-reject-booking-request",
        {
          type: cabDetails.source === "rodYaan" ? "rodYaan" : "Operator",
          driver_id: cabDetails.driver.id,
          booking_id: selectedRide.id,
          booking_type: "realTime",
          status: "assigned",
          reason: "",
        },
      );

      if (res?.success || res?.data?.success) {
        toast.success("Cab assigned successfully");
        // setAssignModalOpen(false);
        resetAssignModal();
        refreshList();
      } else {
        toast.error(
          res?.message || res?.data?.message || "Failed to assign cab",
        );
      }
    } catch (error) {
      console.log("Assign error:", error);
    }
  };

  //   const assignOneTimeOperator = async () => {
  //   try {
  //     const payload = {
  //       booking_id: selectedRide?.id,
  //       cab: {
  //         registration_no: oneTimeData.registration_no,
  //         cab_type: Number(oneTimeData.cab_type),
  //         cab_model: Number(oneTimeData.cab_model),
  //         fuel_type: Number(oneTimeData.fuel_type),
  //       },
  //       driver: {
  //         full_name: oneTimeData.full_name,
  //         mobile_no: oneTimeData.mobile_no,
  //         gender: oneTimeData.gender,
  //         profile_pic: oneTimeData.profile_pic,
  //       },
  //     };

  //     const res = await apiClient(
  //       "POST",
  //       "/fleet/assign-ride-with-cab-driver",
  //       payload
  //     );

  //     // if (res?.success || res?.data?.success) {
  //     //   toast.success("Operator added & ride assigned");
  //     //   // setShowOneTimeModal(false);
  //     //   // setAssignModalOpen(false);

  //     if (res?.success || res?.data?.success) {
  //   toast.success("Operator added & ride assigned");

  //   setActiveModal(null);
  //   setOneTimeData({
  //     registration_no: "",
  //     cab_type: "",
  //     cab_model: "",
  //     fuel_type: "",
  //     full_name: "",
  //     mobile_no: "",
  //     gender: "",
  //     profile_pic: "",
  //   });

  //       refreshList();
  //     } else {
  //       toast.error("Assignment failed");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("Something went wrong");
  //   }
  // };

  const assignOneTimeOperator = async () => {
    try {
      setIsSubmitting(true);

      const payload = {
        booking_id: selectedRide?.id,
        cab: {
          registration_no: oneTimeData.registration_no,
          cab_type: Number(oneTimeData.cab_type),
          cab_model: Number(oneTimeData.cab_model),
          fuel_type: Number(oneTimeData.fuel_type),
        },
        driver: {
          full_name: oneTimeData.full_name,
          mobile_no: oneTimeData.mobile_no,
          gender: oneTimeData.gender,
          profile_pic: oneTimeData.profile_pic,
        },
      };

      const res = await apiClient(
        "POST",
        "/fleet/assign-ride-with-cab-driver",
        payload,
      );

      if (res?.success || res?.data?.success) {
        toast.success("Operator added & ride assigned");

        setActiveModal(null);

        setOneTimeData({
          registration_no: "",
          cab_type: "",
          cab_model: "",
          fuel_type: "",
          full_name: "",
          mobile_no: "",
          gender: "",
          profile_pic: "",
        });

        refreshList();
      } else {
        toast.error("Assignment failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-4 gap-3">
        {rides.map((ride, idx) => {
          if (!ride) return null;
          const isLast = idx === rides.length - 1;
          const URID = getURID(ride);

          return (
            <div
              // key={idx}
              key={ride.id}
              ref={isLast ? checklastCardRef : null}
              className="w-full bg-white rounded-2xl shadow-md flex flex-col gap-2
              transition-all duration-300 hover:shadow-lg hover:scale-[1.02]  min-h-[200px]
              border border-gray-100"
            >
              {/* HEADER */}
              <div className="flex justify-between mx-4 mt-3">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-semibold">{URID}</span>
                  </div>

                  <div className="flex items-center gap-3 text-[12px] text-gray-500">
                    <span>
                      {ride?.user_details_json?.name} (
                      {ride?.user_details_json?.book_for})
                    </span>
                    {/* {ride?.payment_details_json?.payment_status === "paid" && (
                      <span className="text-green-600 font-semibold ml-2">
                        Paid Amount:- ₹
                        {ride?.payment_details_json?.advance_paid}
                      </span>
                    )} */}
                    {/* {ride?.payment_details_json?.payment_status === "paid" &&
 !ride?.payment_details_json?.refund_status && (
  <span className="text-green-600 font-semibold ml-2">
    Paid Amount:- ₹
    {ride?.payment_details_json?.advance_paid}
  </span>
)} */}
                    {ride?.refund_details ? (
                      <span
  className={`font-semibold ml-2 ${
    ride?.refund_details?.refund_status === "pending"
      ? "text-yellow-600"
      : ride?.refund_details?.refund_status === "processed"
      ? "text-green-600"
      : ride?.refund_details?.refund_status === "failed"
      ? "text-red-600"
      : "text-gray-600"
  }`}
>
  Refund Status:- {ride?.refund_details?.refund_status}
</span>
                    ) : ride?.payment_details_json?.payment_status ===
                      "paid" ? (
                      <span className="text-green-600 font-semibold ml-2">
                        Paid Amount:- ₹
                        {ride?.payment_details_json?.advance_paid}
                      </span>
                    ) : null}

                    {ride?.via_source === "android" && (
                      <FaAndroid className="text-[#78C257]" />
                    )}
                    {ride?.via_source === "ios" && (
                      <FaApple className="text-[#A2AAAD]" />
                    )}
                    {(ride?.via_source === "web" ||
                      ride?.via_source === "website") && <FaLaptop />}
                  </div>

                  <span className="text-gray-500 text-[12px]">
                    {ride?.service_type}
                  </span>
                </div>

                <div className="flex flex-col gap-2 items-end">
                  <div className="flex gap-3">
                    {ride?.refund_details && (
                      <FaSyncAlt
                        size={12}
                        className="cursor-pointer text-blue-500"
                        onClick={async () => {
                          try {
                            const response = await apiClient(
                              "GET",
                              `/ride_management/update-refund-status/${ride?.refund_details?.refund_id}`,
                            );

                    if (response?.success) {
  toast.success(response?.message);
  
setAllRides((prev) =>
  prev.map((r) =>
    r.id === ride.id
      ? {
          ...r,
          refund_details: {
            ...r.refund_details,
            refund_status: "processed", 
          },
        }
      : r
  )
);


}
                    else {
                      toast.error("Failed to update");
                    }
                          } catch (error) {
                            toast.error("Something went wrong");
                          }
                        }}
                      />
                    )}
                    <FaCopy
                      size={12}
                      className="cursor-pointer"
                      onClick={async () => {
                        await navigator.clipboard.writeText(URID);
                        toast.info("URID copied");
                      }}
                    />
                    {/* <FaSyncAlt
                      size={12}
                      className="cursor-pointer text-blue-500"
                      onClick={async () => {
                        try {
                          const response = await axios.post(
                            `ide_management/update-refund-status/${URID}`,
                          );

                          if (response?.data?.success) {
                            toast.success("Refund status updated");
                          } else {
                            toast.error("Failed to update");
                          }
                        } catch (error) {
                          toast.error("Something went wrong");
                        }
                      }}
                    /> */}

                    {/* <FaClockRotateLeft
                      size={12}
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedRide(ride);
                        setModalOpen(true);
                      }}
                    /> */}
                    <FaClockRotateLeft
                      size={12}
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedRide({
                          ...ride,
                          _key: ride.urid || ride.id,
                        });

                        setModalOpen(true);
                      }}
                    />

                    <FaExternalLinkAlt
                      size={12}
                      className="cursor-pointer"
                      onClick={() => window.open(getRideLink(ride), "_blank")}
                    />
                  </div>

                  <span
                    className={`px-3 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusClass(
                      ride?.status,
                    )}`}
                  >
                    {ride?.status}
                  </span>
                </div>
              </div>

              {ride?.cab_details_json && ride?.driver_details_json && (
                <>
                  {/* Divider */}
                  <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>

                  <div
                    className={`flex justify-between items-center px-4 py-2 ${
                      ride?.cab_details_json?.cab_source === "Operator"
                        ? "bg-blue-200"
                        : ""
                    }`}
                  >
                    <div className="flex flex-col space-y-[-2px]">
                      <span className="flex items-center gap-2 text-slate-700 dark:text-gray-200 text-[14px] font-semibold text-ellipsis">
                        <FaCarSide size={16} />
                        {ride?.cab_details_json?.cab_reg}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 text-[12px] capitalize">
                        {ride?.cab_details_json?.cab_model}-
                        {ride?.cab_details_json?.cab_type}(
                        {ride?.cab_details_json?.cab_source})
                      </span>
                      <span className="text-gray-500 text-[12px] capitalize">
                        {ride?.cab_details_json?.cab_service_type}
                      </span>
                    </div>
                    <div className="flex flex-col space-y-[-2px]">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-[8px] w-[8px] rounded-full ${
                            ride?.booking_details_updated_to_driver
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        ></span>
                        <span className="items-center gap-2 text-slate-700 dark:text-gray-200 text-[14px] font-semibold text-ellipsis">
                          {ride?.driver_details_json?.drv_name || ""}
                        </span>
                      </div>
                      {/* <FaIdCard size={16}/> */}
                      <span className="text-gray-500 dark:text-gray-400 text-[12px]">
                        {ride?.driver_details_json?.driver_mobile || "-"}
                      </span>
                    </div>
                  </div>
                  <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
                </>
              )}

              {/* DATE + MAP */}
              <div className="flex items-center gap-2 text-[12px] mx-4">
                <FaClock className="text-blue-500" />
                <span className="font-semibold">
                  {formatDate(ride?.booking_travel_date)}
                </span>
                <span
                  className="ml-auto cursor-pointer"
                  onClick={() => {
                    const url = getMapURL(ride);
                    if (url) window.open(url, "_blank");
                  }}
                >
                  <Image
                    src="/icons/googlemap.svg"
                    alt="map"
                    width={28}
                    height={28}
                  />
                </span>
              </div>

              <div className="flex flex-col gap-1 mx-4">
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
              <div className="flex justify-between mx-4 text-[12px] border rounded-xl px-3 py-1.5 bg-gray-50">
                <div className="flex items-center gap-1">
                  <HiUsers />{" "}
                  {Number(ride?.passenger_details_json?.adults ?? 0) +
                    Number(ride?.passenger_details_json?.children ?? 0)}
                </div>
                <div className="flex items-center gap-1">
                  <FaLuggageCart />{" "}
                  {Number(ride?.passenger_details_json?.luggage_big ?? 0) +
                    Number(ride?.passenger_details_json?.luggage_small ?? 0)}
                </div>
                <div className="flex items-center gap-1">
                  <FaCarSide /> {ride?.booking_type}
                </div>
              </div>

              {/* FARE */}
              {/* <div className="flex justify-between mx-4 text-[12px]">
                <span>Estimated Fare</span>
                <span className="font-semibold text-blue-600">
                  ₹{ride?.price_details_json?.estimated_fare}
                </span>
              </div> */}
              <div className="flex justify-between items-center text-gray-600 dark:text-gray-300 mx-4">
                {/* NOTIFIED DRIVERS */}
                {/* NOTIFIED DRIVERS */}

                {/* <span className="text-[14px]">Estimated Fare</span> */}
                <div className="flex gap-2">
                  <div className="flex items-center  dark:text-gray-300 text-sm">
                    <span className="capitalize">
                      {ride?.cluster_details?.rideServiceType
                        ? rideServiceTypeEnum[
                            ride?.cluster_details?.rideServiceType?.toLowerCase()
                          ]
                        : "-"}
                    </span>
                  </div>
                  <div className="flex items-center  dark:text-gray-300 text-sm">
                    <span>{ride?.price_details_json?.estimated_km} km</span>
                  </div>
                </div>
                <div className="text-[12px] flex flex-col gap-1">
                  <div className="flex gap-4 justify-between">
                    <span className="">Estimated Fare</span>
                    <span className=" text-blue-600 font-semibold">
                      ₹{ride?.price_details_json?.estimated_fare ?? ride?.price_details_json?.estimated_price ?? 0}
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
              </div>

              {ride?.searched_drivers_details_json?.length > 0 && (
                <div
                  onClick={() => {
                    setSelectedRide(ride);
                    setShowDriversModal(true);
                  }}
                  className="
    mx-4 mb-2
    flex items-center justify-between
    px-3 py-2
    bg-slate-100 hover:bg-slate-200
    rounded-xl cursor-pointer
    transition
  "
                >
                  {/* LEFT: Icon + Text */}
                  <div className="flex items-center gap-2">
                    <IoMdNotificationsOutline
                      className="text-slate-600"
                      size={16}
                    />
                    <span className="text-[12px] text-slate-700 font-medium">
                      Notified Drivers
                    </span>
                  </div>

                  {/* RIGHT: Count */}
                  <span
                    className="
      min-w-[20px] h-[20px]
      flex items-center justify-center
      text-[11px] font-semibold
      rounded-full
      bg-blue-600 text-white
    "
                  >
                    {ride?.searched_drivers_details_json?.length}
                  </span>
                </div>
              )}

              {/* {ride?.status?.toLowerCase() === "processing" && (
  <button
    onClick={() => {
      setSelectedRide(ride);
      setAssignModalOpen(true);
    }}
    className="mt-2 px-3 py-1 text-xs bg-blue-600 text-white rounded-lg"
  >
    Assign Cab
  </button>
)} */}

              {ride?.status?.toLowerCase() === "processing" && (
                <button
                  onClick={() => {
                    setSelectedRide(ride);
                    // setAssignModalOpen(true);
                    setActiveModal("assign");
                  }}
                  // className="mt-2 mb-3 px-3 py-1 text-xs bg-blue-600 text-white rounded-lg"
                  className="mt-auto mb-3 mx-4 px-3 py-2 text-xs bg-blue-600 text-white rounded-lg"
                >
                  Assign Cab
                </button>
              )}
            </div>
          );
        })}
      </div>

      {!moreData && (
        <div className="text-center text-gray-500 mt-4">🚫 No more rides</div>
      )}

      <CommonModal
        maxWidth="sm"
        title={
          <div className="flex items-center gap-2">
            <IoMdNotificationsOutline />
            <span>Notified Drivers</span>
          </div>
        }
        open={showDriversModal}
        onClose={() => setShowDriversModal(false)}
        actions={[]}
      >
        <div className="flex flex-col gap-2">
          {selectedRide?.searched_drivers_details_json?.map((d, i) => (
            <div
              key={i}
              className="flex justify-between items-center
                   border rounded-lg px-3 py-2 bg-gray-50"
            >
              <div className="flex flex-col">
                <span className="font-semibold">{d.name}</span>
                <span className="text-[11px] text-gray-500">{d.mobile}</span>
              </div>

              <span
                className={`text-[11px] px-2 py-0.5 rounded-full ${
                  d.from === "rb_driver"
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {d.from === "rb_driver" ? "RB Driver" : "Operator"}
              </span>
            </div>
          ))}
        </div>
      </CommonModal>

      <CommonModal
        maxWidth="sm"
        title="Assign Cab"
        // open={assignModalOpen}
        open={activeModal === "assign"}
        onClose={resetAssignModal}
        // onClose={() => setAssignModalOpen(false)}
        actions={[]}
      >
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Search Cab Number"
            value={cabNumber}
            onChange={(e) => searchCab(e.target.value)}
            className="border p-2 rounded w-full"
          />

          {cabSuggestions.length > 0 && (
            <div className="border rounded bg-white shadow max-h-40 overflow-auto">
              {cabSuggestions.map((cab) => (
                <div
                  key={cab.cabId}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setCabNumber(cab.cab_reg);
                    setCabDetails(cab);
                    setCabSuggestions([]);
                  }}
                >
                  {cab.cab_reg} — {cab.cab_model} — {cab.source}
                </div>
              ))}
            </div>
          )}

          <button
            onClick={async () => {
              const res = await apiClient.get(
                `/cab/details?cab_reg=${cabNumber}`,
              );
              setCabDetails(res.data);
            }}
            className="bg-gray-700 text-white p-2 rounded"
          >
            Get Cab Details
          </button>

          <button
            // onClick={() => setShowOneTimeModal(true)}
            onClick={() => {
              // setAssignModalOpen(false);   // 👈 pehle isko close karo
              // setShowOneTimeModal(true);
              setActiveModal("oneTime");
            }}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Add One Time Operator
          </button>

          {cabDetails && (
            <div className="border p-2 rounded bg-gray-50 text-sm">
              <p>
                <b>Cab:</b> {cabDetails.cab_reg}
              </p>
              <p>
                <b>Model:</b> {cabDetails.cab_model}
              </p>
              <p>
                <b>Fuel:</b> {cabDetails.fuel_type}
              </p>
              <p>
                <b>Status:</b> {cabDetails.cab_status}
              </p>
              <hr className="my-1" />
              <p>
                <b>Driver:</b> {cabDetails.driver.full_name}
              </p>
              <p>
                <b>Mobile:</b> {cabDetails.driver.mobile_no}
              </p>
              <p>
                <b>Source:</b> {cabDetails.source}
              </p>
            </div>
          )}

          <button
            onClick={assignCabToRide}
            className="bg-green-600 text-white p-2 rounded"
          >
            Assign to Ride
          </button>
        </div>
      </CommonModal>

      <CommonModal
        maxWidth="md"
        title={
          <span>
            Activity History List {/* {selectedRide?.urid ? ( */}
            {selectedRide?.urid || selectedRide?.id ? (
              <span>
                (<b>{selectedRide?.urid || selectedRide?.id}</b>)
              </span>
            ) : (
              ""
            )}
          </span>
        }
        open={openModal}
        onClose={() => setModalOpen(false)}
        actions={[]}
      >
        <div className="w-full">
          {/* <AddRemarksSection
      rideDetails={selectedRide || null}
      showHeader={false}
      isAddremarksSectionOpen={true}
      SetIsOpenAdRemarksSection={false}
    /> */}
          <AddRemarksSection
            rideDetails={selectedRide || null}
            activityData={[]}
            showHeader={false}
            isAddremarksSectionOpen={true}
            SetIsOpenAdRemarksSection={() => {}}
          />
        </div>
      </CommonModal>

      <CommonModal
        maxWidth="sm"
        title="Add One Time Operator"
        // open={showOneTimeModal}
        open={activeModal === "oneTime"}
        // onClose={() => setShowOneTimeModal(false)}
        onClose={() => setActiveModal(null)}
        actions={[
          {
            label: "Cancel",
            // onClick: () => setShowOneTimeModal(false),
            onClick: () => {
              setActiveModal(null);
              setOneTimeData({
                registration_no: "",
                cab_type: "",
                cab_model: "",
                fuel_type: "",
                full_name: "",
                mobile_no: "",
                gender: "",
                profile_pic: "",
              });
            },

            variant: "outlined",
            color: "inherit",
          },
          // {
          //   label: "Save & Assign",
          //   onClick: assignOneTimeOperator,
          //   variant: "contained",
          //   color: "primary",
          // },
          {
            label: isSubmitting ? "Saving..." : "Save & Assign",
            onClick: assignOneTimeOperator,
            variant: "contained",
            color: "primary",
            disabled: isSubmitting,
          },
        ]}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {/* RC Number */}
          <input
            placeholder="RC Number *"
            value={oneTimeData.registration_no || ""}
            onChange={(e) =>
              setOneTimeData((prev) => ({
                ...prev,
                registration_no: e.target.value.toUpperCase(),
              }))
            }
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />

          {/* Cab Type */}
          <FormControl fullWidth size="small">
            <InputLabel>Cab Type *</InputLabel>
            <Select
              value={oneTimeData.cab_type || ""}
              label="Cab Type *"
              onChange={(e) =>
                setOneTimeData((prev) => ({
                  ...prev,
                  cab_type: e.target.value,
                }))
              }
            >
              {(cabTypes || []).map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.cab_type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Cab Model */}
          <FormControl fullWidth size="small">
            <InputLabel>Cab Model *</InputLabel>
            <Select
              value={oneTimeData.cab_model || ""}
              label="Cab Model *"
              onChange={(e) =>
                setOneTimeData((prev) => ({
                  ...prev,
                  cab_model: e.target.value,
                }))
              }
            >
              {(cabModels || []).map((model) => (
                <MenuItem key={model.id} value={model.id}>
                  {model.make_model}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Fuel Type */}
          <select
            value={oneTimeData.fuel_type || ""}
            onChange={(e) =>
              setOneTimeData((prev) => ({
                ...prev,
                fuel_type: e.target.value,
              }))
            }
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">Fuel Type *</option>
            <option value="1">Petrol</option>
            <option value="2">Diesel</option>
            <option value="3">CNG</option>
          </select>

          {/* Driver Name */}
          <input
            placeholder="Driver Name *"
            value={oneTimeData.full_name || ""}
            onChange={(e) =>
              setOneTimeData((prev) => ({
                ...prev,
                full_name: e.target.value,
              }))
            }
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />

          {/* Driver Mobile */}
          <input
            placeholder="Driver Mobile *"
            value={oneTimeData.mobile_no || ""}
            onChange={(e) =>
              setOneTimeData((prev) => ({
                ...prev,
                mobile_no: e.target.value.replace(/\D/g, "").slice(0, 10),
              }))
            }
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />

          {/* Gender */}
          {/* <select
      value={oneTimeData.gender || ""}
      onChange={(e) =>
        setOneTimeData(prev => ({
          ...prev,
          gender: e.target.value
        }))
      }
      className="w-full border border-gray-300 rounded-md px-3 py-2"
    >
      <option value="">Gender *</option>
      <option value="male">Male</option>
      <option value="female">Female</option>
    </select> */}

          {/* Profile Pic */}
          <input
            placeholder="Profile Pic URL (Optional)"
            value={oneTimeData.profile_pic || ""}
            onChange={(e) =>
              setOneTimeData((prev) => ({
                ...prev,
                profile_pic: e.target.value,
              }))
            }
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
      </CommonModal>
    </div>
  );
};

export default AllRealTimeBookingCard;
