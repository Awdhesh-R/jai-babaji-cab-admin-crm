"use client";
import React, { useEffect, useState } from "react";
import { IoHomeOutline } from "react-icons/io5";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { FaPhoneAlt, FaMapMarkerAlt, FaWhatsapp } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiClient } from "@/app/lib/apiClient";
import { data } from "autoprefixer";
import Image from "next/image"; // Uncomment if you use images

const statusStyles = {
  Approved: {
    border: "border-green-400",
    badge: "bg-green-100 text-green-700 border-green-500",
    button: "bg-green-500",
  },
  Blocked: {
    border: "border-red-400",
    badge: "bg-red-100 text-red-700 border-red-500",
    button: "bg-red-500",
  },
  Pending: {
    border: "border-orange-400",
    badge: "bg-orange-100 text-orange-700 border-orange-500",
    button: "bg-orange-500",
  },
  Inactive: {
    border: "border-yellow-400",
    badge: "bg-yellow-100 text-yellow-700 border-yellow-500",
    button: "bg-yellow-500",
  },
};

const TotalDrivers = ({ fleetId, drivers = [] }) => {
  console.log("totalDriver", drivers);
  const [driver, setDriver] = useState([]);
  const [loading, setLoading] = useState([]);

  const router = useRouter();

  useEffect(() => {
    if (!fleetId) return;

    const fetchDrivers = async () => {
      try {
        const data = await apiClient(
          "GET",
          `/fleet/getTotalDriverList-by-fleetId/${fleetId}`,
          "",
          true
        );

        setDriver(data?.data?.data || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDrivers();
  }, [fleetId]);

  return (
    <div className="space-y-2">
      <div>
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm text-blue-600 font-medium">
            {driver.length} Total Drivers
          </span>
          <Link
            href="/fleetManagement/fleetDetails"
            className="text-sm text-blue-600 font-medium hover:underline"
          >
            ← Back to Fleet
          </Link>
        </div>
        {/* {drivers?.length > 0 ? (
                    drivers?.map((item, index) => { */}
        {driver?.length > 0 ? (
          driver.map((item, index) => {
            const style =
              statusStyles[item?.status] || statusStyles["Approved"];
            const status = item?.login_status ? "active" : "inactive";
            const verifyStatus = item?.verify_status?.toLowerCase();

            return (
              <div
                key={index}
                className={`flex flex-col md:flex-row justify-between items-start md:items-center border ${style.border} rounded-xl p-4 shadow-sm bg-white mt-4 w-full overflow-x-hidden`}
              >
                <div className="flex flex-col md:flex-row justify-between items-start w-full gap-4 ml-0 md:ml-4">
                  {/* LEFT SIDE */}
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-4">
                        {/* IMAGE */}
                        <div className="w-16 h-16 rounded-full ring-2 ring-purple-400 overflow-hidden relative">
                          <Image
                            src={
                              item?.avatar ||
                              "/images/driverProfileplaceholder.png"
                            }
                            alt={item?.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* NAME + RATING */}
                        <div className="flex flex-col leading-none">
                          <h2 className="text-[20px] md:text-[22px] font-semibold text-black">
                            {item?.full_name}
                          </h2>

                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex text-yellow-400 text-xl md:text-2xl">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span key={i}>
                                  {i < Math.round(item?.avg_rating || 0)
                                    ? "★"
                                    : "☆"}
                                </span>
                              ))}
                            </div>

                            <span className="text-[16px] md:text-[18px] text-gray-600 font-semibold">
                              {item?.avg_rating || "0.0"}
                            </span>

                            <span className="text-gray-500 text-xs">
                              (142 reviews)
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* DETAILS GRID */}
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-4 px-2 md:px-16">
                          {/* PRIMARY */}
                          <div>
                            <div className="flex flex-col items-start">
                              <span className="text-sm text-gray-500 font-medium">
                                Primary:
                              </span>
                              <div className="flex items-center gap-1">
                                <FaPhoneAlt className="text-xs text-gray-500 font-medium" />
                                {item?.mobile_no}
                              </div>
                            </div>

                            <div className="flex flex-col items-start">
                              <div className="flex items-center gap-1">
                                <FaMapMarkerAlt className="text-xs text-black" />{" "}
                                Location:
                              </div>
                              <span>{item?.location}</span>
                            </div>
                          </div>

                          {/* ALTERNATE */}
                          <div>
                            <div className="flex flex-col items-start">
                              <span className="text-sm text-gray-500 font-medium">
                                Alternate:
                              </span>
                              <div className="flex items-center gap-1">
                                <FaPhoneAlt className="text-xs" />{" "}
                                {item?.alternate}
                              </div>
                            </div>

                            <div className="text-gray-700 text-xs flex flex-col items-start">
                              <span className="text-sm text-gray-500 font-medium">
                                License:
                              </span>
                              <span>{item?.license}</span>
                            </div>
                          </div>

                          {/* WHATSAPP */}
                          <div>
                            <div className="flex flex-col items-start">
                              <span className="text-sm text-gray-500 font-medium">
                                Whatsapp:
                              </span>
                              <div className="flex items-center gap-1">
                                <FaWhatsapp className="text-green-600 text-base" />
                                <span className="text-green-600 text-sm">
                                  {item?.whatsapp}
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-col items-start">
                              <span className="text-sm text-gray-500 font-medium">
                                Mode:
                              </span>
                              <span>{item?.mode}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT SIDE BUTTONS */}
                  {/* <div className="w-full md:w-[30%] flex md:items-end md:justify-end gap-2 mt-5 relative z-50">
                    <div className="flex flex-col md:items-end gap-3 w-full md:w-auto">
                      <button
                        onClick={() =>
                          router.push(
                            `/fleetManagement/driverDetails/${fleetId}`
                          )
                        }
                        className="text-blue-600 text-sm border border-blue-500 px-4 py-1.5 rounded-lg hover:bg-blue-50 transition w-full md:w-auto"
                      >
                        View Detail
                      </button>

                      <button
                        className={`text-sm px-8 py-1.5 rounded-lg text-white font-medium w-full md:w-auto ${style.button}`}
                      >
                        {item?.status || "Active"}
                      </button>

                      <button className="text-sm px-6 py-1.5 rounded-lg bg-green-100 text-[#16A350] font-medium w-full md:w-auto">
                        {item?.verify_status || "Approved"}
                      </button>
                    </div>
                  </div> */}
                  <div className="w-full md:w-[30%] flex md:items-end md:justify-end gap-2 mt-5 relative z-50">
                    <div className="flex flex-col md:items-end gap-3 w-full md:w-auto">
                      {/* View Detail – always show */}
                      <button
                        onClick={() =>
                          router.push(
                            `/fleetManagement/driverDetails/${fleetId}`
                          )
                        }
                        className="text-blue-600 text-sm border border-blue-500 px-4 py-1.5 rounded-lg hover:bg-blue-50 transition w-full md:w-auto"
                      >
                        View Detail
                      </button>

                      {/* STATUS BUTTON */}
                      {/* {item?.status === "Active" && (
                        <button className="text-sm px-8 py-1.5 rounded-lg bg-green-600 text-white font-medium w-full md:w-auto">
                          Active
                        </button>
                      )}

                      {item?.status === "Inactive" && (
                        <button className="text-sm px-8 py-1.5 rounded-lg bg-gray-400 text-white font-medium w-full md:w-auto">
                          Inactive
                        </button>
                      )} */}

                      {status === "active" && (
                        <button className="text-sm px-8 py-1.5 rounded-lg bg-green-600 text-white font-medium w-full md:w-auto">
                          Active
                        </button>
                      )}

                      {status === "inactive" && (
                        <button className="text-sm px-8 py-1.5 rounded-lg bg-gray-400 text-white font-medium w-full md:w-auto">
                          Inactive
                        </button>
                      )}

                      {/* VERIFY STATUS */}
                      {/* {item?.verify_status === "Approved" && (
                        <button className="text-sm px-6 py-1.5 rounded-lg bg-green-100 text-[#16A350] font-medium w-full md:w-auto">
                          Approved
                        </button>
                      )}

                      {item?.verify_status === "Pending" && (
                        <button className="text-sm px-6 py-1.5 rounded-lg bg-yellow-100 text-yellow-700 font-medium w-full md:w-auto">
                          Pending
                        </button>
                      )}

                      {item?.verify_status === "Rejected" && (
                        <button className="text-sm px-6 py-1.5 rounded-lg bg-red-100 text-red-700 font-medium w-full md:w-auto">
                          Rejected
                        </button>
                      )} */}

                      {verifyStatus === "approved" && (
                        <button className="text-sm px-6 py-1.5 rounded-lg bg-green-100 text-green-700 font-medium w-full md:w-auto">
                          Approved
                        </button>
                      )}

                      {verifyStatus === "pending" && (
                        <button className="text-sm px-6 py-1.5 rounded-lg bg-yellow-100 text-yellow-700 font-medium w-full md:w-auto">
                          Pending
                        </button>
                      )}

                      {verifyStatus === "rejected" && (
                        <button className="text-sm px-6 py-1.5 rounded-lg bg-red-100 text-red-700 font-medium w-full md:w-auto">
                          Rejected
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div>No drivers found</div>
        )}
      </div>
    </div>
  );
};

export default TotalDrivers;