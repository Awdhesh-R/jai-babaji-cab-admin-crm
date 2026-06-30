import React from 'react'
import {
    FaUser,
    FaPhone,
    FaWhatsapp,
    FaUsers,
    FaIdCard,
    FaCarSide,
    FaMapMarkerAlt,
    FaPaperPlane,
    FaRedoAlt
} from "react-icons/fa";
import { FiUpload } from "react-icons/fi";
import { CiCalendar } from "react-icons/ci";




const page = () => {
    return (
        <div className=''>
            <div className='mx-[64px]'>
                <div className='flex gap-2 items-center justify-center mt-4'>
                    <div>
                        <div className="flex ">
                            {/* Left Triangle */}
                            <div
                                className="w-0 h-0 
                            border-t-[15px] border-t-transparent 
                            border-b-[15px] border-b-transparent 
                            border-r-[15px] border-r-blue-600"
                            ></div>
                            <div
                                className="w-0 h-0 
                            border-t-[15px] border-t-transparent 
                            border-b-[15px] border-b-transparent 
                            border-l-[15px] border-l-blue-600"
                            ></div>
                        </div>
                    </div>
                    <span className="font-bold text-[24px] text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#1E40AF]">
                        Driver Onboarding Form
                    </span>
                </div>
                <div className='h-1 w-full bg-gray-400 mt-4'>

                </div>
                <div className='flex items-center justify-center mt-1'>
                    <span className='flex items-center text-[#2563EB]'>Progress: 0% complete</span>
                </div>
                <div className="p-6 bg-white shadow-md rounded-lg border border-blue-100 mt-6">
                    {/* Heading */}
                    <div className="flex items-center gap-2 border-b border-gray-200 pb-3 mb-6">
                        <FaUser className="text-blue-600" />
                        <h2 className="text-lg font-semibold text-blue-700">Driver Basic Information</h2>
                    </div>

                    {/* Form Grid */}
                    <div className="grid grid-cols-2 gap-6 ">
                        {/* Driver Name */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1">
                                <FaUser className="text-gray-400" /> Driver Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter driver's full name"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                            />
                        </div>

                        {/* Mobile Number */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1">
                                <FaPhone className="text-gray-400" /> Mobile Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="10 digit mobile number"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                            />
                        </div>

                        {/* WhatsApp Number */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1">
                                <FaWhatsapp className="text-green-500" /> WhatsApp Number
                            </label>
                            <input
                                type="text"
                                placeholder="WhatsApp number"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                            />
                        </div>

                        {/* Alternative Number */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1">
                                <FaPhone className="text-gray-400" /> Alternative Number
                                <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-600 rounded-full">
                                    Optional
                                </span>
                            </label>
                            <input
                                type="text"
                                placeholder="Alternative contact number"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                            />
                        </div>

                        <div className='flex flex-col justify-between items-start gap-6 w-full'>
                            {/* Same as mobile number Checkbox */}
                            <div className="mt-4 flex items-center gap-2">
                                <input type="checkbox" id="sameMobile" className="w-4 h-4 border-gray-300 rounded" />
                                <label htmlFor="sameMobile" className="text-sm text-gray-600">
                                    Same as mobile number
                                </label>
                            </div>
                            <div className='w-full'>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1">
                                    <FaUsers className="text-gray-400" /> Family Contact Number
                                    <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-600 rounded-full">
                                        Optional
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Family emergency contact"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                                />
                            </div>
                        </div>


                        {/* Upload Driver Image */}
                        <div className="border-2 border-dashed border-blue-300 rounded-md flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-blue-50 transition">
                            <FiUpload className="text-blue-500 text-xl mb-2" />
                            <p className="text-blue-600 font-medium">Upload Driver Image</p>
                            <p className="text-xs text-gray-500 underline mt-1">Click to upload</p>
                        </div>

                    </div>
                    {/* Family Contact Number */}




                </div>
                <div className="p-6 bg-white shadow-md rounded-lg border border-blue-100 mt-6">
                    {/* Heading */}
                    <div className="flex items-center gap-2 border-b border-gray-200 pb-3 mb-6">
                        <FaIdCard className="text-blue-600 text-lg" />
                        <h2 className="text-lg font-semibold text-blue-700">Identity Verification</h2>
                    </div>

                    {/* Aadhaar Number Input */}
                    <div className="mb-6">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1">
                            <FaIdCard className="text-gray-400" /> Aadhar Card Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="12 digit Aadhar number"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                    </div>

                    {/* Upload Section */}
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Upload Aadhar Card Photos</h3>
                    <div className="grid grid-cols-2 gap-6">
                        {/* Front Image Upload */}
                        <div className="border-2 border-dashed border-blue-300 rounded-md flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-blue-50 transition">
                            <FiUpload className="text-blue-500 text-xl mb-2" />
                            <p className="text-blue-600 font-medium">Upload Front Image</p>
                            <p className="text-xs text-gray-500 underline mt-1">Click to upload</p>
                        </div>

                        {/* Back Image Upload */}
                        <div className="border-2 border-dashed border-blue-300 rounded-md flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-blue-50 transition">
                            <FiUpload className="text-blue-500 text-xl mb-2" />
                            <p className="text-blue-600 font-medium">Upload Back Image</p>
                            <p className="text-xs text-gray-500 underline mt-1">Click to upload</p>
                        </div>
                    </div>
                </div>
                <div className="p-6 bg-white shadow-md rounded-lg border border-blue-100 mt-6">
                    {/* Heading */}
                    <div className="flex items-center gap-2 border-b border-gray-200 pb-3 mb-6">
                        <FaCarSide className="text-blue-600 text-lg" />
                        <h2 className="text-lg font-semibold text-blue-700">Driving Licence Details</h2>
                    </div>

                    {/* Licence Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Licence Number */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1">
                                <FaCarSide className="text-gray-400" /> Driving Licence Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter licence number"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                            />
                        </div>

                        {/* Licence Validity Date */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1">
                                <CiCalendar className="text-gray-400" /> Licence Validity Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                            />
                        </div>
                    </div>

                    {/* Upload Section */}
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Upload Driving Licence</h3>
                    <div className="grid grid-cols-2 gap-6">
                        {/* Front Image Upload */}
                        <div className="border-2 border-dashed border-blue-300 rounded-md flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-blue-50 transition">
                            <FiUpload className="text-blue-500 text-xl mb-2" />
                            <p className="text-blue-600 font-medium">Upload Front Image</p>
                            <p className="text-xs text-gray-500 underline mt-1">Click to upload</p>
                        </div>

                        {/* Back Image Upload */}
                        <div className="border-2 border-dashed border-blue-300 rounded-md flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-blue-50 transition">
                            <FiUpload className="text-blue-500 text-xl mb-2" />
                            <p className="text-blue-600 font-medium">Upload Back Image</p>
                            <p className="text-xs text-gray-500 underline mt-1">Click to upload</p>
                        </div>
                    </div>
                </div>
                <div className="p-6 bg-white shadow-md rounded-lg border border-blue-100 mt-6">
                    {/* Heading */}
                    <div className="flex items-center gap-2 border-b border-gray-200 pb-3 mb-6">
                        <FaMapMarkerAlt className="text-red-500 text-lg" />
                        <h2 className="text-lg font-semibold text-blue-700">Address Details</h2>
                    </div>

                    {/* Address Field */}
                    <div className="mb-6">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1">
                            <FaMapMarkerAlt className="text-gray-400" /> Address <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            rows="3"
                            placeholder="Enter complete address with landmarks"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none resize-none"
                        />
                    </div>

                    {/* City Dropdown */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1">
                            <FaMapMarkerAlt className="text-gray-400" /> City <span className="text-red-500">*</span>
                        </label>
                        <select
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                        >
                            <option value="">Select city...</option>
                            <option value="Delhi">Delhi</option>
                            <option value="Mumbai">Mumbai</option>
                            <option value="Bangalore">Bangalore</option>
                            <option value="Hyderabad">Hyderabad</option>
                            <option value="Chennai">Chennai</option>
                        </select>
                    </div>
                </div>
                <div className="flex items-center justify-between bg-white shadow-lg rounded-xl border border-blue-100 p-5 mt-6 mb-6">
                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="flex items-center justify-center gap-2 flex-1 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-200"
                    >
                        <FaPaperPlane className="text-base" />
                        Submit Application
                    </button>

                    {/* Reset Button */}
                    <button
                        type="reset"
                        className="ml-4 flex items-center justify-center gap-2 px-5 py-2 rounded-lg border border-blue-400 text-blue-600 font-medium bg-white hover:bg-blue-50 hover:border-blue-500 transition-all duration-200 shadow-sm"
                    >
                        <FaRedoAlt className="text-base" />
                        Reset Form
                    </button>
                </div>

            </div>
        </div>
    )
}

export default page