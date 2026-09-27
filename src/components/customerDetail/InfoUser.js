"use client";
import React, { useState, useEffect } from "react";
import { FaPhone, FaWallet, FaIndianRupeeSign } from "react-icons/fa6";
import {
  FaCaretDown,
  FaCopy,
  FaExternalLinkAlt,
  FaPaperPlane,
  FaRegCopy,
  FaTimes,
  FaUser,
  FaWhatsapp,
  FaSyncAlt
} from "react-icons/fa";
import Image from "next/image";
import { MdLocationPin } from "react-icons/md";
import {
  BsCheck2Circle,
  BsLink,
  BsPencilSquare,
  BsThreeDotsVertical,
} from "react-icons/bs";
import { LuUser } from "react-icons/lu";
import { apiClient } from "@/app/lib/apiClient";
import { toast } from "react-toastify";
import Switch from "@mui/material/Switch";
import PublishModal from "../ridesManagement/details/publishModal";
import { FcApprove } from "react-icons/fc";

const statusColors = {
  pending: "bg-[#FFC107] text-white cursor-pointer",
  processing: "bg-[#FFB74D] text-white cursor-pointer",
  scheduled: "bg-[#9C27B0] text-white",
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
  approved: "bg-[#3F51B5] text-white",
};

const statusTextColors = {
  pending: "text-[#FFC107]",
  taxiPool: "text-[#03A9F4]",
  confirmed: "text-[#009688]",
  assigned: "text-[#3F51B5]",
  arrived: "text-[#673AB7]",
  started: "text-[#1B59F8]",
  completed: "text-[#16A34A]",
  cancelled: "text-[#F44336]",
  cabFound: "text-[#8BC34A]",
  needCab: "text-[#FF9800]",
  cancellation: "text-[#E57373]",
  linkSent: "text-[#00BCD4]",
  all: "text-[#9E9E9E]",
  notVerified: "text-[#FFB300]",
  activeRides: "text-[#1E88E5]",
};

const InfoUser = ({
  rideDetails,
  showStatus,
  setCheckUpdate,
  setShowStatus,
  storeStatus,
  setStoreStatus,
}) => {
  const [isActive, setIsActive] = useState(true);
  const [showWallet, setShowWallet] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [showUserUpdate, setShowUserUpdate] = useState(false);
  const [amount, setAmount] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
    const [showRefundModal, setShowRefundModal] = useState(false);

  const handlePublishButton = () => {
    if (rideDetails.assigned_to_fleet === "unpublished") {
      setModalOpen(true);
    }
    console.log(rideDetails.connected_ride_id);
  };
  const getRideLink = (ride) => {
    const status = ride?.status?.toLowerCase();
    return ["pending", "processing"].includes(status)
      ? setShowMessage(true)
      : setStoreStatus("unique_detail");
  };

  const handleStatusClick = (status) => {
    status = status.toLowerCase();
    setShowActionModal(true);
  };

  const handleReturnToPending = async () => {
    try {
      const response = await apiClient(
        "GET",
        `/ride_management/revertToPending/${rideDetails?.urid}`
      );
      if (response.status || response.success) {
        toast.success(response.message);
        setCheckUpdate((prev) => !prev);
      } else {
        toast.error(response.message);
      }
    } catch (e) {
      toast.error(e?.response?.error?.message || "Something went wrong");
    } finally {
      setShowActionModal(false);
    }
  };
  const [executiveVerified, setExecutiveVerified] = useState(
    rideDetails?.executive_verification_lock_status || false
  );

  const handleExecutiveVerification = async (checked) => {
    try {
      const response = await apiClient(
        "PUT",
        `/ride_management/bookig-details-updated-with-executive-lock-status/${rideDetails?.urid}`,
        JSON.stringify({
          excutiv_lock_status: checked,
          status: rideDetails?.status,
        })
      );
      if (response.status || response.success) {
        toast.success(response.message);
        setExecutiveVerified(checked);
        setCheckUpdate((prev) => !prev);
      } else {
        toast.error(response.message);
      }
    } catch (e) {
      toast.error(e?.response?.error?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    setExecutiveVerified(
      rideDetails?.executive_verification_lock_status || false
    );
  }, [rideDetails]);

  const handleCancelRide = async () => {
    try {
      const response = await apiClient("POST", `/ride_management/addRemark`, {
        urid: rideDetails?.urid,
        status: "cancelled",
        remark: "Cancelled by Admin",
      });
      if (response.status || response.success) {
        toast.success(response.message);
        setCheckUpdate((prev) => !prev);
      } else {
        toast.error(response.message);
      }
    } catch (e) {
      toast.error(e?.response?.error?.message || "Something went wrong");
    } finally {
      setShowActionModal(false);
    }
  };
  const goToUserDetails = () => {
    window.open(
      `/fleetManagement/userDetails/${rideDetails?.user_id}`,
      "_blank"
    );
  };

  const [settled, setSettled] = useState(false);

  useEffect(() => {
    setSettled(rideDetails?.cab_setteled_status === "settled");
  }, [rideDetails?.urid, rideDetails?.cab_setteled_status]);

  const handleSettleToggle = async (checked) => {
    setSettled(checked);

    try {
      const response = await apiClient(
        "PUT",
        `/ride_management/update-ride-settel-status/${rideDetails?.urid}`,
        {
          ride_setteld: checked ? "settled" : "unsettled",
        }
      );

      if (response?.status || response?.success) {
        toast.success("Status updated");
        setCheckUpdate((prev) => !prev);
      } else {
        throw new Error("Failed");
      }
    } catch (err) {
      setSettled(!checked);
      toast.error("Update failed");
    }
  };


  const getPaymentUrl = () => {
  if (!rideDetails?.urid) return "-";

  // if (rideDetails?.payment_method === "") {
  //   return  `https://payment.jaibabajicab.com/rideDetails?urid=${rideDetails?.urid}`;
  // }
  if (rideDetails?.payment_method !== "cashfree") {
  return `https://payment.jaibabajicab.com/rideDetails?urid=${rideDetails?.urid}`;
}

  if (rideDetails?.payment_method === "cashfree") {
    return `https://www.jaibabajicab.com/oldpay?urid=${rideDetails?.urid}`;
    // return `http://local-website.rodYaan.tech/oldpay?urid=${rideDetails?.urid}`;
  }
  return "-";
};

  return (
    <div className="bg-white dark:bg-gray-900 shadow-md border dark:border-slate-700 rounded-md transition-all duration-300 ease-in-out">
      {/* TOP SECTION  */}
      <div className="flex md:flex-row items-start md:items-center justify-between gap-4 rounded-t-md px-4 py-2 bg-gradient-to-r from-[#F0F5FD] to-[#B9EAFF] dark:from-[#1E1F2D] dark:to-[#323B50]">
        <div className="flex items-center gap-4 flex-1">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-400 dark:bg-[#EADFFA] p-2 rounded-lg shadow-lg">
            <Image
              src="/icons/journey.svg"
              alt="Journey"
              width={20}
              height={20}
            />
          </div>
          <div className="flex flex-col">
            <h2 className="text-[14px] font-semibold text-gray-900 dark:text-white">
              {rideDetails?.user_details_json?.name}
            </h2>
            <p className="text-[12px] text-gray-600 dark:text-gray-300">
              {rideDetails?.user_details_json?.book_contact}
            </p>
          </div>
        </div>

       <div className="flex items-center gap-2">

        {/* {rideDetails?.refund_details && (
                                                    <FaSyncAlt
                                                      size={14}
                                                      className="cursor-pointer text-blue-500"
                                                      onClick={async () => {
                                                        try {
                                                          const response = await apiClient(
                                                            "GET",
                                                            `/ride_management/update-refund-status/${rideDetails?.refund_details?.refund_id}`,
                                                          );
                              
           if (response?.success) {
          toast.success(response?.message);
        } else {
          toast.error("Failed to update");
        }
        
                                                          
                                                        } catch (error) {
                                                          toast.error("Something went wrong");
                                                        }
                                                      }}
                                                    />
                                                  )} */}
                                                  {rideDetails?.refund_details && (
                                                  
                                                                        <FaSyncAlt
                                                                          size={14}
                                                                          className="cursor-pointer text-blue-500"
                                                                          onClick={async () => {
                                                  try {
                                                    const response = await apiClient(
                                                      "GET",
                                                      `/ride_management/update-refund-status/${rideDetails?.refund_details?.refund_id}`
                                                    );
                                                  
                                                    if (response?.success === true) {
                                                  toast.success(response?.message);
                                                  setCheckUpdate(prev => !prev);
                                                  
                                                    } else {
                                                      toast.error(response?.message || "Failed to update");
                                                    }
                                                  } catch (error) {
                                                    console.error(error);
                                                    toast.error("Something went wrong");
                                                  }
                                                  
                                                                          }}
                                                                        />
                                                                                            )}
          {rideDetails?.refund_details ? (
                      <span
  className={`font-semibold ml-2 ${
    rideDetails?.refund_details?.refund_status === "pending"
      ? "text-yellow-600"
      : rideDetails?.refund_details?.refund_status === "processed"
      ? "text-green-600"
      : rideDetails?.refund_details?.refund_status === "failed"
      ? "text-red-600"
      : "text-gray-600"
  }`}
>
  Refund Status:- {rideDetails?.refund_details?.refund_status}
</span>
) : rideDetails?.payment_details_json?.payment_status === "paid" ? (
  <span className="text-green-600 font-semibold ml-2">
    Paid Amount:- ₹
    {rideDetails?.payment_details_json?.advance_paid}
  </span>
) : null}

{rideDetails?.refund_details && (
  <span
    onClick={() => setShowRefundModal(true)}
    className="text-blue-600 text-sm font-semibold cursor-pointer"
  >
    View More
  </span>
)}
        </div>

        {/* <div className="flex items-center gap-2">
          <span
            className={`text-[11px] font-semibold ${
              !settled ? "text-yellow-600" : "text-gray-400"
            }`}
          >
            Unsettled
          </span>

          <Switch
            checked={settled}
            onChange={(e) => handleSettleToggle(e.target.checked)}
            color="success"
          />

          <span
            className={`text-[11px] font-semibold ${
              settled ? "text-green-600" : "text-gray-400"
            }`}
          >
            Settled
          </span>
        </div> */}

        {/* <div className="flex items-center gap-2">

          <Switch
            checked={rideDetails?.cab_setteled_status === "settled"}
            onChange={(e) => handleSettleToggle(e.target.checked)}
            color="success"
          />

          {rideDetails?.cab_setteled_status ? (
            <span
              className={`text-[11px] font-semibold ${
                rideDetails.cab_setteled_status === "settled"
                  ? "text-green-600"
                  : "text-yellow-600"
              }`}
            >
              {rideDetails.cab_setteled_status === "settled"
                ? "Settled"
                : "Unsettled"}
            </span>
          ) : null}
        </div> */}
        {rideDetails?.status === "confirmed" && (
          <div className="flex items-center gap-2">
            <Switch
              checked={rideDetails?.cab_setteled_status === "settled"}
              onChange={(e) => handleSettleToggle(e.target.checked)}
              color="success"
            />

            {rideDetails?.cab_setteled_status ? (
              <span
                className={`text-[11px] font-semibold ${
                  rideDetails.cab_setteled_status === "settled"
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}
              >
                {rideDetails.cab_setteled_status === "settled"
                  ? "Settled"
                  : "Unsettled"}
              </span>
            ) : null}
          </div>
        )}

        <div className="flex flex-col md:flex-row items-start md:items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
          <label className="text-[12px] font-semibold text-gray-700 dark:text-gray-300">
            Chat Lock
          </label>
          <Switch
            color={executiveVerified ? "success" : "default"}
            checked={executiveVerified}
            onChange={(e) => handleExecutiveVerification(e.target.checked)}
            slotProps={{ input: { "aria-label": "controlled" } }}
          />
          {["pending", "processing", "confirmed"].includes(
            rideDetails?.status
          ) && (
            <button
              onClick={handlePublishButton}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900 dark:to-indigo-900 border border-indigo-200 dark:border-indigo-700 shadow-sm"
            >
              <BsLink className="text-indigo-900 dark:text-white font-bold" />
              <span className="text-[12px] font-bold text-indigo-900 dark:text-white">
                {rideDetails?.assigned_to_fleet === "unpublished"
                  ? "Publish Ride"
                  : "Published"}
              </span>
            </button>
          )}
          <button
            onClick={() => {
              // setStoreStatus('unique_detail')
              getRideLink(rideDetails);
            }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900 dark:to-indigo-900 border border-indigo-200 dark:border-indigo-700 shadow-sm"
          >
            <span className="text-[12px] font-bold text-indigo-900 dark:text-white">
              Ride Detail
            </span>
          </button>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900 dark:to-indigo-900 border border-indigo-200 dark:border-indigo-700 shadow-sm">
            <span className="text-[10px] font-semibold text-indigo-700 dark:text-indigo-300 tracking-wide">
              Ride ID
            </span>
            <span className="text-[12px] font-bold text-indigo-900 dark:text-white">
              {rideDetails?.urid}
            </span>
          </div>
          <div
            onClick={() => handleStatusClick(rideDetails?.status)}
            className={`flex items-end gap-2 px-4 py-1 rounded-full border border-yellow-300 dark:border-yellow-800 ${
              statusColors[rideDetails?.status]
            } dark:bg-yellow-950 text-white dark:text-yellow-200 text-[12px] font-semibold shadow-sm`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-50 animate-pulse"></span>
            <span className="capitalize">
              {showStatus ? showStatus : rideDetails?.status}
            </span>
          </div>
        </div>

        <button
          className="mt-4 md:mt-0 text-black dark:text-gray-300"
          onClick={() => setIsActive(!isActive)}
        >
          <FaCaretDown
            className={`text-2xl transform transition-transform duration-300 ${
              isActive ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Conditionally Rendered Section */}
      {isActive && (
        <div className="flex items-center justify-center text-sm rounded-md py-2 transition-colors">
          <div className="flex flex-wrap gap-6 items-start justify-between p-4 transition-colors text-sm w-full">
            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex-1 p-4 flex flex-col gap-3 rounded-md">
              <div className="flex items-center gap-2 relative">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-400 dark:bg-violet-900 border border-violet-300 dark:border-violet-700 rounded-full p-2">
                  <LuUser className="text-white dark:text-purple-300 text-[14px] font-semibold" />
                </div>

                <div className="flex flex-col items-center relative">
                  <div className="flex items-center gap-1">
                    <span className="text-black dark:text-white text-[14px] font-semibold">
                      {rideDetails?.user_details_json?.name}
                    </span>

                    {/* Pencil Icon with Relative Parent */}
                    <div className="relative">
                      <div className="flex gap-2 items-center">
                        <BsPencilSquare
                          className="text-[14px] text-black dark:text-green-400 cursor-pointer"
                          onClick={() => setShowUserUpdate(!showUserUpdate)}
                        />
                        <FaExternalLinkAlt
                          className="text-blue-600 cursor-pointer"
                          onClick={goToUserDetails}
                        />
                      </div>

                      {/* UPDATE USER AND CUSTOMER DETAILS */}
                      {showUserUpdate && (
                        <div className="bg-white py-3 px-4 rounded-2xl shadow-md border border-slate-400 text-gray-800 absolute ml-5 mt-[-30px] z-50 min-w-[220px]">
                          {/* Profile Header */}
                          <div className="flex items-center gap-4 mb-3">
                            <div className="w-8 h-8 rounded-full border-2 border-blue-200 bg-blue-100 flex items-center justify-center">
                              <LuUser className="text-md text-gradient-to-r from-sky-400 to-blue-600" />
                            </div>
                            <div>
                              <h2 className="text-[14px] font-semibold">
                                Kumar, Murari
                              </h2>
                            </div>
                          </div>

                          {/* Form Fields */}
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <FaUser className="text-gray-400 mr-3 text-sm" />
                              <input
                                type="text"
                                placeholder="Abhishek"
                                className="w-full outline-none border border-[#D1D5DB] rounded-md px-3 py-1.5 text-[12px]"
                              />
                            </div>

                            <div className="flex items-center">
                              <FaPhone className="text-gray-400 mr-3 text-sm" />
                              <input
                                type="text"
                                placeholder="+91-9693189968"
                                className="w-full outline-none border border-[#D1D5DB] rounded-md px-3 py-1.5 text-[12px]"
                              />
                            </div>

                            <div className="flex items-center">
                              <FaWhatsapp className="text-green-500 mr-3 text-base" />
                              <input
                                type="text"
                                placeholder="+91-9693189968"
                                className="w-full outline-none border border-[#D1D5DB] rounded-md px-3 py-1.5 text-[12px]"
                              />
                            </div>
                          </div>

                          <button className="mt-6 w-full bg-gradient-to-r from-sky-400 to-blue-600 text-white font-medium py-2 rounded-md shadow-sm hover:opacity-90 transition">
                            Update Now
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* <span className="text-gray-500 dark:text-gray-400 text-[12px]">{rideDetails?.user_details_json?.book_for}</span> */}
                </div>
              </div>
              <div className="flex items-center justify-between border border-gray-300 dark:border-gray-600 p-2 rounded-md">
                <div className="flex items-center gap-2">
                  <FaPhone className="text-gray-500" />
                  <span className="text-gray-900 dark:text-white text-[12px]">
                    +91 {rideDetails?.user_details_json?.book_contact}
                  </span>
                </div>
                <div className="border border-green-200 dark:border-green-600 bg-green-100 dark:bg-green-900 rounded-2xl flex items-center px-5">
                  <BsCheck2Circle className="text-green-500 font-semibold" />
                  <span className="text-green-500 dark:text-green-400 mx-2 text-[10px] font-semibold">
                    Verified
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between border border-gray-300 dark:border-gray-600 p-2 rounded-md">
                <div className="flex items-center gap-2">
                  <FaWhatsapp className="text-green-500 dark:text-green-400 text-[20px]" />
                  <span className="text-gray-900 dark:text-white text-[12px]">
                    +91 {rideDetails?.user_details_json?.c_wa_number}
                  </span>
                </div>
                <div className="border border-green-200 dark:border-green-600 bg-green-100 dark:bg-green-900 rounded-2xl flex items-center px-5">
                  <BsCheck2Circle className="text-green-500 dark:text-green-400 semibold" />
                  <span className="text-green-500 dark:text-green-400 mx-2 text-[10px] font-semibold">
                    Verified
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-gray-600 dark:text-white text-[14px]">
                    Communication Preference
                  </span>
                  <div className="flex items-center gap-2">
                    <button className="bg-gradient-to-r from-blue-500 to-cyan-400 dark:bg-purple-500 text-white flex items-center gap-2 px-2 py-1 rounded-2xl">
                      <FaPhone className="text-[14px]" />
                      <span className="text-[12px]">Call</span>
                    </button>

                    <button className="bg-gradient-to-r from-blue-500 to-cyan-400 dark:bg-purple-500 text-white flex items-center gap-2 px-4 py-1 rounded-2xl">
                      <FaWhatsapp className="text-[14px]" />
                      <span className="text-[12px]">Whatsapp</span>
                    </button>

                    <button className="bg-gradient-to-r from-blue-500 to-cyan-400 dark:bg-gray-900 dark:text-gray-300 flex items-center gap-2 px-4 py-1 rounded-lg border border-gray-300 dark:border-gray-600">
                      <LuUser className="text-[14px] text-white" />
                      <span className="text-[12px] text-white">Both</span>
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-600 dark:text-white text-[14px]">
                    Past Ride Summary
                  </span>
                  <div className="flex justify-between items-center gap-2">
                    {rideDetails?.rideCount?.length > 0 &&
                      rideDetails?.rideCount?.map((count, index) => (
                        <div key={index} className="flex items-center gap-1">
                          <div
                            className={`h-2 w-2 rounded-full ${
                              statusColors[count?.key]
                            }`}
                          ></div>
                          <b className={`text-[12px]`}>{count?.value}</b>
                          <span className="text-gray-500 dark:text-gray-400 text-[12px]">
                            {count?.key}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex-1 p-4 flex flex-col gap-2 rounded-md">
              <div className="flex items-center justify-between border border-gray-300 dark:border-gray-600 px-2 py-1 rounded-md">
                <span className="text-gray-600 dark:text-gray-300 text-[12px]">
                  Last Ride ID
                </span>
                <span className="text-gray-600 dark:text-white text-[13px]">
                  RB {rideDetails?.urid}
                </span>
              </div>

              {/* Main Container */}
              <div className="flex items-center justify-between border gap-2 border-gray-300 dark:border-gray-600 px-2 py-1 rounded-md relative">
                <span className="text-gray-600 dark:text-gray-300 text-[12px] w-1/2 text-ellipsis">
                  Payment URL
                </span>
                {rideDetails?.status !== "pending" ? (
                  <div className="flex gap-2 items-center">
                    <span className="text-purple-600 dark:text-purple-400 text-[12px] text-ellipsis">
                      {/* {`https://payment.jaibabajicab.com/rideDetails?urid=${rideDetails?.urid}`} */}
                         {getPaymentUrl()}
                      </span>
                    <FaCopy
                      onClick={async () => {
                        // await navigator.clipboard.writeText(
                        //   `https://payment.jaibabajicab.com/rideDetails?urid=${rideDetails?.urid}`
                        // );
                        await navigator.clipboard.writeText(getPaymentUrl());
                        toast.info("Link copied to clipboard");
                      }}
                      className="text-black dark:text-purple-400 text-[14px] cursor-pointer"
                    />
                  </div>
                ) : (
                  <div className="flex gap-2 items-center">
                    <span className="text-purple-600 dark:text-purple-400 text-[12px] text-ellipsis">{`-`}</span>
                  </div> 
                )}
                {/* Dropdown Menu */}
                {/* {menuVisible && (
                  <div
                    className="absolute right-0 top-7 w-56 bg-white dark:bg-slate-800 shadow-md rounded-xl p-4 border dark:border-slate-700 flex flex-col items-start space-y-3 z-50"
                  >
                    <button className="flex items-center space-x-2 text-red-600 text-sm font-bold hover:opacity-80 transition">
                      <span>Send Reminder</span>
                      <FaPaperPlane className="text-red-600" />
                    </button>

                    <button className="flex items-center space-x-2 text-blue-600 text-sm font-semibold hover:opacity-80 transition">
                      <span>Pay URL</span>
                      <FaRegCopy className="text-blue-600" />
                    </button>
                  </div>
                )} */}
              </div>

              <div className="flex items-center justify-between border border-gray-300 dark:border-gray-600 p-2 rounded-md">
                <div className="flex items-center gap-2">
                  <MdLocationPin className="text-[14px] text-purple-600 dark:text-purple-400" />
                  <span className="text-[12px] text-purple-600 dark:text-purple-400">
                    Automatic Location Verification
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between border border-gray-300 dark:border-gray-600 p-2 rounded-md relative">
                <div className="flex gap-2 text-[16px] text-black dark:text-white items-center">
                  <FaWallet className="text-[14px]" />
                  <span className="text-[12px]">Wallet Balance</span>
                </div>
                <div className="flex items-center text-green-600 dark:text-green-400 text-[16px]">
                  <FaIndianRupeeSign className="text-[14px]" />
                  <b>{rideDetails?.wallet_amount}</b>
                  <BsPencilSquare
                    className="text-[14px] text-black dark:text-green-400"
                    onClick={() => setShowWallet(!showWallet)}
                  />
                </div>
                {showWallet && (
                  <div className="w-full bg-white shadow-md border border-slate-600 rounded-xl p-4 flex items-center justify-between space-x-4 absolute top-10 right-0 z-50">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">
                        Wallet Balance
                      </span>
                      <span className="text-green-600 font-bold text-md">
                        {}
                      </span>
                    </div>

                    <input
                      type="number"
                      placeholder="Amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />

                    <button className="bg-gradient-to-r from-blue-400 to-blue-600 text-white text-sm font-medium px-4 py-1.5 rounded-md shadow hover:opacity-90 transition-all">
                      Update Balance
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-1 items-center justify-between gap-2 border border-gray-300 dark:border-gray-600 p-1 rounded-md">
                  <div className="flex items-center gap-2">
                    <LuUser className="text-[14px] text-gray-600 dark:text-white" />
                    <span className="text-[12px]">Ride Taken By</span>
                  </div>
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-400 dark:bg-yellow-500 rounded-2xl px-4">
                    <span className="text-[12px] text-white dark:text-black">
                      {rideDetails?.user_details_json?.book_for}
                    </span>
                  </div>
                </div>
                <div className="flex flex-1 items-center justify-between gap-2 border border-gray-300 dark:border-gray-600 p-1 rounded-md">
                  <div className="rounded-2xl px-4">
                    <span className="text-black dark:text-white">
                      {rideDetails?.user_details_json?.name
                        ? rideDetails?.user_details_json?.name
                        : rideDetails?.user_details_json?.name}
                    </span>
                  </div>
                  <div className="px-4 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-md shadow-sm">
                    <p className="text-[12px] font-semibold text-white dark:text-black tracking-wide">
                      {rideDetails?.user_details_json?.book_contact}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-6">
              Status Alert
            </h2>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Your Status is{" "}
              <span className="font-medium text-[#FFC107] dark:text-blue-400">
                {rideDetails?.status}
              </span>
              . Your status must be{" "}
              <span className="font-semibold text-green-600">
                Confirmed, Assigned, Arrived, Started, Completed
              </span>
              .
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowMessage(false)}
                className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {showActionModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
          onClick={() => setShowActionModal(false)}
        >
          <div className="relative bg-white dark:bg-slate-800 rounded-lg shadow-lg max-w-md w-full p-6 flex flex-col gap-4">
            <button
              type="button"
              className="absolute top-1 right-2 text-gray-500 text-lg sm:text-2xl font-semibold"
              onClick={() => setShowActionModal(false)}
              aria-label="Close modal"
            >
              ×
            </button>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white text-center">
              Status Alert
            </h2>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Your Status is{" "}
              <span className="font-medium text-[#FFC107] dark:text-blue-400 capitalize">
                {rideDetails?.status}
              </span>
              .
            </p>
            <div className="flex justify-between">
              {rideDetails?.status?.toLowerCase() !== "cancelled" && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleCancelRide()}
                    className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md"
                  >
                    Cancel Ride
                  </button>
                </div>
              )}
              {(rideDetails?.status?.toLowerCase() == "cancelled" ||
                rideDetails?.status?.toLowerCase() == "processing") && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleReturnToPending()}
                    className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md"
                  >
                    Revert to Pending
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <PublishModal
        open={modalOpen}
        details={rideDetails}
        onClose={() => setModalOpen(false)}
        onConfirm={() => {
          setCheckUpdate((prev) => !prev);
          setModalOpen(false);
        }}
      />
      {showRefundModal && (
  <div
    className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
    onClick={() => setShowRefundModal(false)}
  >
    <div
      className="bg-white w-[340px] rounded-2xl shadow-xl p-6 relative"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Refund Details
      </h3>

      {/* Divider */}
      <div className="border-t mb-4"></div>

      {/* Content */}
      <div className="space-y-3 text-sm">

        <div className="flex justify-between">
          <span className="text-gray-500">Refund ID</span>
          <span className="font-medium text-gray-800 break-all">
            {rideDetails?.refund_details?.refund_id}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Created At</span>
          <span className="font-medium text-gray-800">
            {new Date(
              rideDetails?.refund_details?.createdAt
            ).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
          </span>
        </div>

      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default InfoUser;
