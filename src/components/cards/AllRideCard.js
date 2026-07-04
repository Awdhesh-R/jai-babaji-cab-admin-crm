"use client";
import React, { useState, useEffect } from "react";
import {
  FaCarSide,
  FaLuggageCart,
  FaClock,
  FaCopy,
  FaExternalLinkAlt,
  FaIdCard,
  FaAndroid,
  FaLaptop,
  FaPhone,
  FaMobile,
  FaApple,
  FaSyncAlt,
} from "react-icons/fa";
import { HiUsers } from "react-icons/hi";
import { SiGitconnected } from "react-icons/si";
import { BsArrowRightCircle } from "react-icons/bs";
import Image from "next/image";
import { toast } from "react-toastify";
import Switch from "@mui/material/Switch";
import moment from "moment";
import { apiClient } from "@/app/lib/apiClient";
import CommonModal from "../common/CommonModal";
import AddRemarksSection from "../customerDetail/AddRemarksSection";
import { FaClockRotateLeft } from "react-icons/fa6";
import RideConnectionModal from "../modals/RideConnectionModal";
import PublishModal from "../ridesManagement/details/publishModal";
import { TbCopyCheckFilled } from "react-icons/tb";

const AllRideCard = ({
  actions = [],
  rides = [],
  moreData,
  checklastCardRef,
  refreshList,
  setAllRides,
}) => {
  const getRideLink = (ride) => {
    return `/ridesManagement/details?urid=${ride?.urid}`;
  };

  const [openModal, setModalOpen] = useState(false);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [selectedRide, setSelectedRide] = useState();
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const handleSelectedRide = (ride) => {
    setSelectedRide((prev) => ({ ...ride }));
    setModalOpen(true);
  };

  const handleSelectedRideForConnectedRide = (ride) => {
    setSelectedRide((prev) => ({ ...ride }));
    setShowConnectionModal(true);
  };

  const handleUpdateBookingDetailsToDriver = async (val, ride) => {
    try {
      const response = await apiClient(
        "PUT",
        `/ride_management/bookig-details-updated-to-driver/${ride?.urid}`,
        {
          status: ride?.status,
          booking_details_updated_to_driver: val,
        },
      );
      if (response.status || response.success) {
        toast.success(response.message);
        refreshList();
      } else {
        toast.error(response.message);
      }
    } catch (e) {
      console.log(e);
    } finally {
    }
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return moment(dateString).format("DD MMM, YYYY hh:mm A");
  };

  const rideServiceTypeEnum = {
    local: "Local",
    intercity: "Inter city",
    intracity: "Intra city",
    interstate: "Inter state",
    rental: "Rental",
    global: "Global",
  };

  const goToConnectRide = (urid) => {
    // Implement your navigation logic here
    window.open(`/ridesManagement/searchRideConnection/${urid}`, "_blank");
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "processing":
        return "bg-orange-100 text-orange-700";
      case "confirmed":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };
  // const getSettleBorderClass = (ride) => {
  //   if (ride?.status !== "confirmed") return "";

  //   if (ride?.cab_setteled_status === "settled") {
  //     return "border-2 border-green-500 shadow-green-300";
  //   }

  //   if (ride?.cab_setteled_status === "unsettled") {
  //     return "border-2 border-yellow-300 shadow-yellow-300";
  //   }

  //   return "";
  // };
  const getSettleBorderClass = (ride) => {
    if (ride?.status !== "confirmed") return "";

    if (ride?.cab_setteled_status === "settled") {
      return "border-2 border-green-300 bg-green-100 shadow-green-300";
    }

    if (ride?.cab_setteled_status === "unsettled") {
      return "border-2 border-yellow-300 bg-yellow-100 shadow-yellow-300";
    }

    return "";
  };

  const getMapURL = (ride) => {
    if (ride?.route_map && ride?.route_map != "0") {
      return ride?.route_map;
    } else {
      const src = ride?.booking_source_coordinates?.coordinates.sort();
      const dest = ride?.booking_destination_coordinates?.coordinates.sort();
      //       const src = ride?.booking_source_coordinates?.coordinates?.slice()?.reverse();
      // const dest = ride?.booking_destination_coordinates?.coordinates?.slice()?.reverse();

      if (src && dest) {
        return `https://www.google.com/maps/dir/${encodeURIComponent(
          src,
        )}/${encodeURIComponent(dest)}`;
      } else {
        return false;
      }
    }
  };

  const [settleMap, setSettleMap] = useState({});

  useEffect(() => {
    const map = {};
    rides.forEach((ride) => {
      map[ride.urid] = ride?.cab_setteled_status === "settled";
    });
    setSettleMap(map);
  }, [rides]);

  const handleSettleToggle = async (isChecked, ride) => {
    setSettleMap((prev) => ({
      ...prev,
      [ride.urid]: isChecked,
    }));

    try {
      const response = await apiClient(
        "PUT",
        `/ride_management/update-ride-settel-status/${ride.urid}`,
        { ride_setteld: isChecked ? "settled" : "unsettled" },
      );

      if (response?.status || response?.success) {
        toast.success("Status updated");
        refreshList();
      } else {
        throw new Error("failed");
      }
    } catch (err) {
      setSettleMap((prev) => ({
        ...prev,
        [ride.urid]: !isChecked,
      }));
      toast.error("Update failed");
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Header Section */}
      {/* <div className="w-full mb-6 flex justify-between items-center">
        <div className="flex items-center flex-wrap gap-2">
          {actions.map((action, i) =>
            action.isCustom ? (
              <div key={i} className='text-[14px]'>{action?.element}</div>
            ) : (
              <button key={i} className="text-[14px]">
                <span className="text-gray-600 dark:text-gray-300">{action?.label} : {action?.value}</span>
              </button>
            )
          )}
        </div>
      </div> */}

      {/* CARD FOR RIDE LISTS */}
      <div className="w-full my-2">
        <div
          className="grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-4 gap-3 "
          style={{ gridAutoColumns: "minmax(0,1fr)" }}
        >
          {/* {rides.map((ride, idx) => { */}
          {rides.map((ride, idx) => {
            if (!ride) return null;

            const isLastCard = idx === rides.length - 1;
            return (
              <div
                key={idx}
                ref={isLastCard ? checklastCardRef : null}
                // className={`w-full bg-white dark:bg-gray-800 rounded-2xl shadow-md flex flex-col gap-2 min-w-0 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]  ${
                //   ride.op_cab_status
                //     ? "border border-green-500 dark:border-green-700 shadow-green-300 hover:bg-green-100"
                //     : ride?.route_map &&
                //       ride?.route_map != "0" &&
                //       (ride?.status.toLowerCase() === "pending" ||
                //         ride?.status.toLowerCase() === "processing")
                //     ? "border border-yellow-500 dark:border-yellow-700 shadow-yellow-300 hover:bg-yellow-100"
                //     : "border border-gray-100 dark:border-gray-700 hover:bg-blue-100"
                // }`}
                className={`w-full  dark:bg-gray-800 rounded-2xl shadow-md flex flex-col gap-2 min-w-0 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]
${getSettleBorderClass(ride)}
${
  !getSettleBorderClass(ride) &&
  (ride.op_cab_status
    ? "border border-green-500 dark:border-green-700 shadow-green-300 hover:bg-green-100"
    : ride?.route_map &&
        ride?.route_map != "0" &&
        (ride?.status.toLowerCase() === "pending" ||
          ride?.status.toLowerCase() === "processing")
      ? "border border-yellow-500 dark:border-yellow-700 shadow-yellow-300 hover:bg-yellow-100"
      : "border border-gray-100 dark:border-gray-700 hover:bg-blue-100")
}`}
              >
                {/* Header */}
                <div className="flex justify-between mx-4 mt-3">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-[8px] w-[8px] rounded-full ${
                          ride?.executive_verification_lock_status
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      ></span>
                      <span className="text-slate-700 dark:text-gray-200 text-[14px] font-semibold cursor-pointer hover:underline">
                        {ride?.urid}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-500 dark:text-gray-400 text-[12px]">
                        {ride?.user_details_json?.name?.split(" ")[0]} (
                        {ride?.user_details_json?.book_for}){" "}
                        {ride?.user_details_json?.book_contact}
                      </span>

                      {ride?.via_source === "android" && (
                        <FaAndroid className="text-[#78C257]" />
                      )}
                      {ride?.via_source === "ios" && (
                        <FaApple className="text-[#A2AAAD]" />
                      )}
                      {(ride?.via_source === "web" ||
                        ride?.via_source === "website") && <FaLaptop />}
                    </div>
                    <span className="text-gray-500 dark:text-gray-400 text-[12px]">
                      {ride?.service_type}
                    </span>
                  </div>
                  <div>
                    <TbCopyCheckFilled
                      size={14}
                      title="Copy Data"
                      className="hover:cursor-pointer"
                      onClick={async () => {
                        const travelDate = ride?.booking_travel_date
                          ? moment(ride.booking_travel_date)
                          : null;

                        const formattedDate = travelDate
                          ? travelDate.format("DD-MM-YYYY")
                          : "N/A";

                        const formattedTime = travelDate
                          ? travelDate.format("hh:mm A")
                          : "N/A";

                        const sourceCity = ride?.source_city_name || "N/A";
                        const destinationCity =
                          ride?.destination_city_name || "N/A";

                        const estimatedKm =
                          ride?.price_details_json?.estimated_km || "0";
                        const mapUrl = getMapURL(ride) || "N/A";

                        const cabType =
                          ride?.op_cab_details_json?.cab_type ||
                          ride?.booking_type ||
                          "N/A";

                        const driverCollectedAmount = ride?.price_details_json?.collected_by_driver || "N/A";

//                         const message = `BOOKING BOOKING

// ${formattedDate}

// Time ${formattedTime}

// ${sourceCity} to ${destinationCity}

// ${estimatedKm}km

// ${cabType} (one way)

// Note : (AC भी चलाना है )

// 👉 ये भाड़ा वैसे ड्राईवर भाईयो के लिए है !
// जो वापसी में खाली जा रहे है या विपरीत साइड से अपना भाड़ा (BOOKING) हो !

// Contact number

// 9297924243

// Driver Route Location: ${mapUrl}

// Group 2 :- https://chat.whatsapp.com/IkeFzUzaL7IAYqh1Bwmao3?mode=hqrt2
// `;

const message = ` 

*BOOKING BOOKING*

*Date:* *${formattedDate}*

*Time:* *${formattedTime}*

*Route:* *${sourceCity} to ${destinationCity}*

*Distance:* *${estimatedKm}km*

*Amount*: *₹ ${driverCollectedAmount}* *(Fix)*

*Vehicle:* *${cabType} (one way)*

*Contact number*
*9297924243*

https://www.jaibabajicab.com

*Pickup & Drop Location :👇*
 ${mapUrl}

Group 2 :- https://chat.whatsapp.com/IkeFzUzaL7IAYqh1Bwmao3?mode=hqrt2

*Note:* *AC चलाना अनिवार्य है।*

*यह बुकिंग विशेष रूप से उन ड्राइवर भाइयों के लिए है,*
*जो वापसी में खाली जा रहे हैं या विपरीत दिशा में उनकी पहले से बुकिंग है।*
`;


                        

                        await navigator.clipboard.writeText(message);
                        toast.success("Copied successfully");
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-2 justify-between">
                    <div className="flex items-center gap-4 pt-1">
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
                                      : r,
                                  ),
                                );
                              } else {
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
                        title="Copy URID"
                        className="hover:cursor-pointer"
                        onClick={async () => {
                          await navigator.clipboard.writeText(ride?.urid);
                          toast.info("URID copied to clipboard");
                        }}
                      />
                      <FaClockRotateLeft
                        size={12}
                        title="Activity History"
                        className="hover:cursor-pointer"
                        onClick={() => handleSelectedRide(ride)}
                      />
                      <FaExternalLinkAlt
                        title="Open Details Page"
                        className="hover:cursor-pointer"
                        size={12}
                        onClick={() => window.open(getRideLink(ride), "_blank")}
                      />
                    </div>
                    <div
                      className={`px-3 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusClass(
                        ride?.status,
                      )}`}
                    >
                      {ride?.status}
                    </div>
                  </div>
                </div>
                {/* {ride?.payment_details_json?.refund_details?.refund_status ? (
  <span className="text-yellow-600 font-semibold ml-2">
    Refund Status:-{" "}
    {ride?.payment_details_json?.refund_details?.refund_status}
  </span>
) : ride?.payment_details_json?.payment_status === "paid" ? (
  <span className="text-green-600 font-semibold ml-2">
    Paid Amount:- ₹
    {ride?.payment_details_json?.advance_paid}
  </span>
) : null} */}

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
                ) : ride?.payment_details_json?.payment_status === "paid" ? (
                  <span className="text-green-600 font-semibold ml-2">
                    Paid Amount:- ₹{ride?.payment_details_json?.advance_paid}
                  </span>
                ) : null}

                {ride?.executive_remarks && (
                  <>
                    <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
                    <span
                      className="px-4 text-sm capitalize text-ellipsis"
                      title={ride?.executive_remarks}
                    >
                      {ride?.executive_remarks}
                    </span>
                  </>
                )}

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
                        {ride?.owner_details_json && (
                          <div className="mt-2  ">
                            <div className=" text-xs mt-2 ">
                              <span className="text-gray-500">Owner Name:</span>
                              <span className="font-medium px-5 capitalize text-gray-800">
                                {ride?.owner_details_json?.full_name}
                              </span>
                            </div>

                            <div className="text-xs">
                              <span className="text-gray-500">
                                Owner Phone:
                              </span>
                              <span className="font-medium px-5  text-gray-800">
                                {ride?.owner_details_json?.mobile_no}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* <div>
                          <span className="text-gray-500 text-[12px] capitalize">
                            owner name:Aman
                          {ride?.owner_details_json?.full_name}
                         
                        </span>
                        <div>
                          <span className="text-gray-500 text-[12px] capitalize">
                          {ride?.owner_details_json?.mobile_no}
                          owner phone no:788788788
                        </span>
                        </div>
                      </div> */}

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
                  </>
                )}

                {/* Divider */}
                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>

                {/* Ride Details */}
                <div className="space-y-2 cursor-pointer">
                  <div className="flex items-center gap-2 text-[12px] text-gray-600 mx-4">
                    <FaClock size={16} className="text-blue-500" />
                    <span
                      className="text-gray-700 dark:text-gray-300 font-semibold"
                      style={{ cursor: "pointer" }}
                    >
                      {formatDate(ride?.booking_travel_date)}
                    </span>
                    <span
                      className="ml-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        const url = getMapURL(ride);
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

                  <div className="flex items-center justify-between text-gray-700 bg-blue-200 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-1.5 shadow-sm text-[14px] mx-4 dark:bg-gray-900">
                    <div className="flex items-center  font-extrabold gap-1 dark:text-gray-300">
                      <HiUsers size={16} />
                      <span>
                        {Number(
                          ride?.booking_details_json?.adults ??
                            ride?.passenger_details_json?.adults ??
                            0,
                        ) +
                          Number(
                            ride?.booking_details_json?.children ??
                              ride?.passenger_details_json?.children ??
                              0,
                          )}
                      </span>
                    </div>
                    <div className="flex items-center font-extrabold gap-1 dark:text-gray-300">
                      <FaLuggageCart size={16} />
                      <span>
                        {Number(
                          ride?.booking_details_json?.luggage_big ??
                            ride?.passenger_details_json?.luggage_big ??
                            0,
                        ) +
                          Number(
                            ride?.booking_details_json?.luggage_small ??
                              ride?.passenger_details_json?.luggage_small ??
                              0,
                          )}
                      </span>
                    </div>
                    <div className="flex items-center font-extrabold gap-1 dark:text-gray-300">
                      <FaCarSide size={16} />
                      {(ride.op_cab_status ||
                        ride?.booking_or_type !== ride?.booking_type) && (
                        <span className={`capitalize`}>
                          {ride?.op_cab_details_json?.cab_type ??
                            ride?.booking_type}
                        </span>
                      )}
                      <span
                        className={`capitalize ${
                          ride.op_cab_status ||
                          ride?.booking_or_type !== ride?.booking_type
                            ? "line-through"
                            : ""
                        }`}
                      >
                        {ride?.booking_or_type}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>

                {/* Footer */}
                <div className="flex justify-between items-center text-gray-600 dark:text-gray-300 mx-4">
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
                        ₹{ride?.price_details_json?.estimated_fare}
                      </span>
                    </div>
                    <div className="flex gap-4 justify-between">
                      <span className="">Advance Amount</span>
                      <span className=" text-blue-600 font-semibold">
                        ₹{ride?.price_details_json?.advance_amount}
                      </span>
                    </div>
                    <div className="flex gap-4 justify-between">
                      <span className="">Collected By Driver</span>
                      <span className=" text-blue-600 font-semibold">
                        ₹{ride?.price_details_json?.collected_by_driver}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mx-4 mb-3">
                  {["pending", "processing", "confirmed"].includes(
                    ride?.status,
                  ) && (
                    <button
                      onClick={() => {
                        setSelectedRide((prev) => ride);
                        setPublishModalOpen((prev) => true);
                      }}
                      className="flex items-center gap-1 px-3 py-1 text-blue-500 bg-blue-100 rounded-lg text-xs shadow hover:bg-blue-200 transition-all duration-200 "
                    >
                      <BsArrowRightCircle />{" "}
                      {ride?.assigned_to_fleet === "published"
                        ? "Published"
                        : "Publish"}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      ride?.connected_ride_id
                        ? handleSelectedRideForConnectedRide(ride)
                        : goToConnectRide(ride?.urid);
                    }}
                    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs transition-all duration-200 min-w-[100px]
                    ${
                      ride?.connected_ride_id
                        ? "border border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-gray-700"
                        : "border border-gray-400 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                    }`}
                  >
                    <SiGitconnected />{" "}
                    {ride?.connected_ride_id ? "Connected" : "Connect"}
                  </button>
                  <Switch
                    color={
                      ride?.booking_details_updated_to_driver
                        ? "success"
                        : "default"
                    }
                    id={ride?.urid}
                    checked={ride?.booking_details_updated_to_driver}
                    onChange={(e) =>
                      handleUpdateBookingDetailsToDriver(e.target.checked, ride)
                    }
                    slotProps={{ input: { "aria-label": "controlled" } }}
                  />
                  <button
                    className={`flex items-center gap-2 rounded-lg text-xs transition-all duration-200`}
                  >
                    <FaCopy
                      size={12}
                      title="Copy Data"
                      className="hover:cursor-pointer"
                      onClick={async () => {
                        await navigator.clipboard.writeText(`Name: ${
                          ride?.user_details_json?.name
                        }
Mobile: ${ride?.user_details_json?.mobile}

ID: ${ride?.urid}

Type: ${ride?.op_cab_details_json?.cab_type || ride?.booking_type}

Distance: *${ride?.price_details_json?.estimated_km} KM*

Price: *${ride?.price_details_json?.collected_by_driver}*

Reporting Time: *${moment(ride?.booking_travel_date)
                          .subtract(15, "minutes")
                          .format("hh:mm A")}*

Travel Date: *${moment(ride?.booking_travel_date).format("DD-MM-YYYY hh:mm A")}*

Passenger: ${
                          parseInt(ride?.passenger_details_json?.adults || 0) +
                          parseInt(ride?.passenger_details_json?.children || 0)
                        }       Luggage: ${
                          parseInt(
                            ride?.passenger_details_json?.luggage_big || 0,
                          ) +
                          parseInt(
                            ride?.passenger_details_json?.luggage_small || 0,
                          )
                        }

Source: ${ride?.location_details?.source}
City: *${ride?.source_city_name}*

Destination: ${ride?.location_details?.destination}
City: *${ride?.destination_city_name}*

Map: ${getMapURL(ride)}

                            `);
                        toast.info("Data copied to clipboard");
                      }}
                    />
                  </button>
                  {/* <div className="flex flex-col items-center">
                    <Switch
                      checked={
                        settleMap[ride.urid] ?? ride?.ride_setteld === "settled"
                      }
                      onChange={(e) =>
                        handleSettleToggle(e.target.checked, ride)
                      }
                      color="success"
                    />
                    {ride?.cab_setteled_status ? (
                      <span
                        className={`text-[11px] font-semibold ${
                          ride.cab_setteled_status === "settled"
                            ? "text-green-500"
                            : "text-yellow-500"
                        }`}
                      >
                        {ride.cab_setteled_status === "settled"
                          ? "Settled"
                          : "Unsettled"}
                      </span>
                    ) : null}
                  </div> */}
                  {ride?.status === "confirmed" && (
                    <div className="flex flex-col items-center">
                      <Switch
                        checked={
                          settleMap[ride.urid] ??
                          ride?.ride_setteld === "settled"
                        }
                        onChange={(e) =>
                          handleSettleToggle(e.target.checked, ride)
                        }
                        color="success"
                      />

                      {ride?.cab_setteled_status ? (
                        <span
                          className={`text-[11px] font-semibold ${
                            ride.cab_setteled_status === "settled"
                              ? "text-green-500"
                              : "text-yellow-500"
                          }`}
                        >
                          {ride.cab_setteled_status === "settled"
                            ? "Settled"
                            : "Unsettled"}
                        </span>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <CommonModal
        maxWidth="md"
        title={
          <span>
            Activity History List{" "}
            {selectedRide?.urid ? (
              <span>({<b>{selectedRide?.urid}</b>})</span>
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
          <AddRemarksSection
            rideDetails={selectedRide || null}
            showHeader={false}
            isAddremarksSectionOpen={true}
            SetIsOpenAdRemarksSection={false}
          />
        </div>
      </CommonModal>
      <RideConnectionModal
        isOpen={showConnectionModal}
        onClose={() => setShowConnectionModal(false)}
        ridesData={selectedRide}
      />
      {/* No More Rides Message */}
      {!moreData && (
        <div className="text-center text-gray-500 dark:text-gray-400">
          🚫 No more rides data to load
        </div>
      )}
      <PublishModal
        open={publishModalOpen}
        details={selectedRide}
        onClose={() => setPublishModalOpen(false)}
        onConfirm={() => {
          refreshList();
          setPublishModalOpen(false);
          setSelectedRide((prev) => null);
        }}
      />
    </div>
  );
};

export default AllRideCard;
