"use client";
import React, { useState } from "react";
import { IoHomeOutline } from "react-icons/io5";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import {
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaPhone,
  FaEye,
  FaCar,
  FaClock,
  FaUser,
} from "react-icons/fa";
import { BsCheck2Circle } from "react-icons/bs";
import { ExternalLink, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DriverAadhaarModal from "../modals/DriverAadhaarModal";
import BlockDriverModal from "../modals/BlockDriverModal";
import Image from "next/image";

const rides = [
  {
    status: "Upcoming",
    from: "Darbhanga Tower",
    to: "Madhubni Harlakhi",
    time: "15 Jan, 02:30 pm",
    driver: "Jethalal Gada",
    phone: "+91-9693189968",
    cab: "BR-12-AB-1234",
    fare: "₹450.00",
  },
  {
    status: "Upcoming",
    from: "Darbhanga Tower",
    to: "Madhubni Harlakhi",
    time: "15 Jan, 02:30 pm",
    driver: "Jethalal Gada",
    phone: "+91-9693189968",
    cab: "BR-12-AB-1234",
    fare: "₹450.00",
  },
  {
    status: "Upcoming",
    from: "Darbhanga Tower",
    to: "Madhubni Harlakhi",
    time: "15 Jan, 02:30 pm",
    driver: "Jethalal Gada",
    phone: "+91-9693189968",
    cab: "BR-12-AB-1234",
    fare: "₹450.00",
  },
  {
    status: "Upcoming",
    from: "Darbhanga Tower",
    to: "Madhubni Harlakhi",
    time: "15 Jan, 02:30 pm",
    driver: "Jethalal Gada",
    phone: "+91-9693189968",
    cab: "BR-12-AB-1234",
    fare: "₹450.00",
  },
];

const statuses = ["Upcoming", "Completed", "Cancelled"];

const DriverDetails = () => {
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [showModal, setShowModal] = useState(false);
  const [blockModal, setBlockModal] = useState(false);
  const router = useRouter();

  const documents = [
    { title: "Aadhar Front", image: "/images/aadhaar.png" },
    { title: "Aadhar Back", image: "/images/aadhaar.png" },
    { title: "Driving licence - Fornt", image: "/images/dlfront.png" },
    { title: "Driving licence - Back", image: "/images/dlback.png" },
  ];
  return (
    <div className="space-y-2">
      <div className="border border-[#babbba] p-2 flex items-center gap-2 bg-white dark:bg-gray-900 mt-1">
        <IoHomeOutline className="text-gray-400" size={18} />
        <MdKeyboardDoubleArrowLeft className="text-gray-400 w-4 h-4" />
        <span className="text-sm text-gray-600 font-medium">
          Fleet Dashboard
        </span>
        <MdKeyboardDoubleArrowLeft className="text-gray-400 w-4 h-4" />
        <Link
          href="#"
          className="text-sm text-gray-600 font-medium hover:underline hover:text-blue-600"
        >
          Active Fleets Kumar Murari
        </Link>
        <MdKeyboardDoubleArrowLeft className="text-gray-400 w-4 h-4" />
        <Link
          href="#"
          className="text-sm text-gray-600 font-medium hover:underline hover:text-blue-600"
        >
          Total Drivers
        </Link>
        <MdKeyboardDoubleArrowLeft className="text-gray-400 w-4 h-4" />
        <Link
          href="#"
          className="text-sm text-blue-600 font-medium hover:underline"
        >
          Abhishek kumar
        </Link>
      </div>
      <div className="border border-[#DBEAFE] rounded-xl p-6 bg-white shadow-sm w-full">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Driver Overview
        </h2>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-1 gap-5">
            <div className="relative w-24 h-24">
              <Image
                src="/images/driverplaceholderimg.png"
                alt="Profile"
                fill
                className="w-full h-full rounded-full border-4 border-white shadow-lg object-cover"
              />
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
            </div>

            <div className="flex flex-col justify-start gap-3">
              <h3 className="text-xl font-bold text-gray-800">Murari kumar</h3>

              <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-md text-gray-800 text-sm font-medium">
                <FaPhone className="text-blue-500" />
                +91 9993189968
              </div>

              <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-md text-gray-800 text-sm font-medium">
                <FaPhoneAlt className="text-gray-500" />
                +91 9993189968
              </div>

              <div className="flex items-center justify-between bg-green-50 px-4 py-2 rounded-md text-sm font-medium">
                <div className="flex items-center gap-3 text-green-700">
                  <FaWhatsapp className="text-green-600" />
                  +91 9993189968
                </div>
                <button className="bg-green-600 text-white ml-3 px-3 py-1 rounded shadow-lg hover:bg-green-700 transition text-sm">
                  WhatsApp
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 flex-1">
            <div className="flex gap-6 items-center">
              {/* View Booking Rides lists */}
              <button className="relative flex items-center justify-between px-6 py-4 text-white rounded-md bg-gradient-to-r from-[#005FE2] to-[#00347C] shadow-md w-[320px]">
                <span className="text-lg font-medium">
                  View Booking Rides lists
                </span>
                <span className="absolute right-0 top-[22px] -translate-y-1/2 rotate-[6deg] origin-left-bottom bg-[#005FE2] px-4 py-3 rounded-lg shadow-md">
                  <ExternalLink className="text-white w-5 h-5 rotate-[-6deg]" />
                </span>
              </button>

              {/* Block this Driver */}
              <button
                onClick={() => setBlockModal(true)}
                className="relative flex items-center justify-between px-6 py-4 text-white rounded-md bg-gradient-to-r from-[#E30613] to-[#7D030A] shadow-md w-[280px]"
              >
                <span className="text-lg font-medium">Block this Driver</span>
                <span className="absolute right-0 top-[22px] -translate-y-1/2 rotate-[6deg] bg-[#E30613] px-4 py-3 rounded-md shadow-md">
                  <Trash2 className="text-white w-5 h-5" />
                </span>
              </button>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 text-gray-800 mb-1">
                <FaMapMarkerAlt className="text-blue-600" />
                <span className="font-semibold">Address</span>
              </div>
              <p className="text-sm text-gray-600 ml-6">
                123 Main Street, Mumbai, Maharashtra 400001
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Cab Driver Documents
        </h2>

        <div className="flex flex-col md:flex-row gap-6 flex-nowrap items-start">
          <div className="w-full md:w-[28%] space-y-4">
            <div>
              <label className="text-sm text-gray-700 font-medium block mb-1">
                Whatsapp Number
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue="+91-9693189968"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700 font-medium block mb-1">
                Aadhar Card Number
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue="7544-1234-1234"
              />
            </div>
          </div>

          <div className="w-full md:w-[72%] flex flex-wrap gap-4">
            {documents.map((doc, index) => (
              <div
                key={index}
                className="w-[220px] rounded-xl border border-blue-500 relative overflow-hidden flex flex-col justify-between"
              >
                <div className="relative h-[140px]">
                  <Image
                    src={doc.image}
                    alt={doc.title}
                    fill
                    className="w-full h-full object-cover"
                  />
                  <FaEye className="absolute top-2 right-2 text-gray-700 bg-white rounded-md p-1 text-lg shadow cursor-pointer" />

                  {/* Centered Icon + Label */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <BsCheck2Circle className="text-blue-500 text-lg" />
                    <div className="text-center font-semibold text-sm text-black">
                      {doc.title}
                    </div>
                  </div>
                </div>

                {/* <div className="flex justify-between px-3 py-2 mt-2">
                                    <button className="text-red-600 border border-red-500 px-3 py-1 text-xs rounded hover:bg-red-50">
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => setShowModal(true)}
                                        className="text-blue-600 border border-blue-500 px-3 py-1 text-xs rounded hover:bg-blue-50"
                                    >
                                        Approve
                                    </button>
                                </div> */}
                <div className="flex gap-2 px-3 py-2">
                  <button className="flex-1 text-red-600 border border-red-500 px-3 py-1 text-xs rounded hover:bg-red-50">
                    Reject
                  </button>
                  <button
                    onClick={() => setShowModal(true)}
                    className="flex-1 text-blue-600 border border-blue-500 px-3 py-1 text-xs rounded hover:bg-blue-50"
                  >
                    Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="p-4 md:p-6 border rounded-xl bg-white shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Total Rides
        </h2>
        <div className="flex justify-between items-center mb-6 bg-gray-50 p-1 rounded-full shadow-inner overflow-auto w-full">
          {statuses.map((status) => {
            const isActive = activeTab === status;

            let activeClasses = "";
            if (status === "Completed" && isActive) {
              activeClasses =
                "bg-gradient-to-r from-green-400 to-green-900 text-white";
            } else if (status === "Cancelled" && isActive) {
              activeClasses =
                "bg-gradient-to-r from-red-400 to-red-700 text-white";
            } else if (isActive) {
              activeClasses = "bg-blue-600 text-white";
            }

            return (
              <button
                key={status}
                onClick={() => setActiveTab(status)}
                className={`flex-1 text-center px-4 py-2 rounded-full font-medium text-sm transition whitespace-nowrap ${
                  isActive ? activeClasses : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {status}
                <span
                  className={`ml-2 font-semibold inline-block rounded-full px-2 py-0.5 ${
                    isActive
                      ? "bg-white text-green-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {rides.filter((ride) => ride.status === status).length}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-4">
          {rides
            .filter((ride) => ride.status === activeTab)
            .map((ride, index) => (
              <div
                key={index}
                className="bg-white border rounded-xl p-4 shadow hover:shadow-md transition flex justify-between"
              >
                <div className="flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-semibold bg-blue-100 text-blue-600 px-2 py-1 rounded-full uppercase mb-2 inline-block">
                      {ride.status}
                    </span>

                    <div className="flex items-center gap-2 text-sm text-gray-800 font-medium mb-1">
                      <FaMapMarkerAlt className="text-gray-500" />
                      {ride.from} → {ride.to}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <FaClock className="text-gray-400" />
                      {ride.time}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <FaUser className="text-gray-400" />
                      <span className="font-semibold text-gray-800">
                        {ride.driver}
                      </span>
                      <span className="text-gray-500">{ride.phone}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaCar className="text-gray-400" />
                      {ride.cab}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-end">
                  <div className="text-white text-[14px] bg-gradient-to-r from-[#10B981] to-[#16A34A] px-3 py-1 rounded-md self-end mt-auto">
                    {ride.fare}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      {showModal && <DriverAadhaarModal onClose={() => setShowModal(false)} />}
      <BlockDriverModal
        isOpen={blockModal}
        onClose={() => setBlockModal(false)}
      />
    </div>
  );
};

export default DriverDetails;