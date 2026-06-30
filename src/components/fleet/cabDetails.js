'use client';
import React, { useState } from 'react';
import {
  IoHomeOutline
} from "react-icons/io5";
import {
  MdKeyboardDoubleArrowLeft
} from "react-icons/md";
import {
  FaPhone,
  FaPhoneAlt,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaBuilding
} from "react-icons/fa";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from "next/image"

const CabDetails = () => {
  const router = useRouter();
  

  return (
    <div className='space-y-4'>
      {/* Breadcrumb */}
      <div className="border border-[#babbba] p-2 flex items-center gap-2 bg-white dark:bg-gray-900 mt-1">
        <IoHomeOutline className="text-gray-400" size={18} />
        <MdKeyboardDoubleArrowLeft className="text-gray-400 w-4 h-4" />
        <span className="text-sm text-gray-600 font-medium">Fleet Dashboard</span>
        <MdKeyboardDoubleArrowLeft className="text-gray-400 w-4 h-4" />
        <span className="text-sm text-gray-600 font-medium">Active Fleets Abhishek kumar</span>
        <MdKeyboardDoubleArrowLeft className="text-gray-400 w-4 h-4" />
        <Link href="#" className="text-sm text-blue-600 font-medium hover:underline">
          Cab Details - BR 12 AB 1234
        </Link>
      </div>

      {/* Main Card */}
      <div className="border border-[#DBEAFE] rounded-xl p-6 bg-white shadow-sm w-full">

        {/* Top Section - Images and Dates */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cab Images */}
          <div className="flex-1 grid grid-cols-2 gap-4">
            <Image src="/images/cab1.png" alt="Cab 1" className="rounded-lg shadow-md object-cover" />
            <Image src="/images/cab2.png" alt="Cab 2" className="rounded-lg shadow-md object-cover" />
          </div>

          {/* Important Dates */}
          <div className="w-full lg:w-1/3 bg-white p-4 rounded-xl shadow-md border">
            <h4 className="font-semibold text-gray-800 text-sm mb-4">Important Dates</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pollution End Date</span>
                <span className="font-medium text-gray-800">31-12-2025</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Insurance End Date</span>
                <span className="font-medium text-gray-800">31-12-2025</span>
              </div>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
          {[
            { label: "RC Front", status: "Approved" },
            { label: "RC Back", status: "Approved" },
            { label: "Pollutions", status: "Pending" },
            { label: "Fitness", status: "Approved" },
            { label: "Permit", status: "Approved" }
          ].map((doc, idx) => (
            <div key={idx} className="bg-white border rounded-lg p-4 text-center shadow-sm">
              <p className="text-sm font-semibold mb-2">{doc.label}</p>
              <div className="flex justify-center gap-2">
                <button className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded">Reject</button>
                <button className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">Approve</button>
              </div>
              {doc.status === "Pending" && (
                <div className="text-xs text-yellow-600 mt-2">Pending</div>
              )}
            </div>
          ))}
        </div>

        {/* Owner Documents */}
        <div className="bg-white mt-6 p-4 rounded-xl shadow-md border">
          <h4 className="text-md font-semibold text-gray-800 mb-4">Cab Owner Documents</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div>
              <label className="block text-sm text-gray-600">Owner Aadhaar Number</label>
              <p className="font-medium mt-1">7544-9724-1720</p>
            </div>
            <div>
              <label className="block text-sm text-gray-600">Name (as per Aadhaar)</label>
              <p className="font-medium mt-1">Abhishek kumar</p>
            </div>
            <div className="flex gap-4">
              <Image src="/images/aadhar_front.png" alt="Aadhar Front" className="h-16 rounded-md border" />
              <Image src="/images/aadhar_back.png" alt="Aadhar Back" className="h-16 rounded-md border" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CabDetails;
