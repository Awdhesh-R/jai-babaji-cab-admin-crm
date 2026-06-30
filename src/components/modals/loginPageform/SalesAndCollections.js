"use client";
import { useState } from "react";
import { HiOutlineBars4 } from "react-icons/hi2";
import { MdNavigateNext } from "react-icons/md";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { FaPlus } from "react-icons/fa6";
import { LuNotebookPen } from "react-icons/lu";
import { FiDollarSign } from "react-icons/fi";
import { MdDateRange } from "react-icons/md";

import {
    Calendar,
    Car,
    Users,
    Plus,
    Globe,
    MapPin,
    DollarSign,
    LayoutGrid,
    Clock,
    AlertCircle,
    Activity,
    ChevronRight,
} from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
} from "recharts";
import { TrendingUp } from "lucide-react";

const revenueData = [
    { month: "Jan", value: 4000 },
    { month: "Feb", value: 3000 },
    { month: "Mar", value: 5000 },
    { month: "Apr", value: 4500 },
    { month: "May", value: 6000 },
    { month: "Jun", value: 5200 },
];

const ridesData = [
    { month: "Jan", rides: 220 },
    { month: "Feb", rides: 160 },
    { month: "Mar", rides: 300 },
    { month: "Apr", rides: 280 },
    { month: "May", rides: 380 },
    { month: "Jun", rides: 340 },
];

const menuItems = [
    { name: "Booking", icon: <Calendar className="w-5 h-5" /> },
    { name: "RB Fleet", icon: <Car className="w-5 h-5" /> },
    { name: "Market Fleet", icon: <LayoutGrid className="w-5 h-5" /> },
    { name: "Add RB Cabs", icon: <Plus className="w-5 h-5" /> },
    { name: "Add RB Drivers", icon: <Users className="w-5 h-5" /> },
    { name: "Our Cluster & City", icon: <Globe className="w-5 h-5" /> },
    { name: "Real-Time RB Cab Locations", icon: <MapPin className="w-5 h-5" /> },
    { name: "Real-Time RB Operators Fleet", icon: <MapPin className="w-5 h-5" /> },
    { name: "Revenue & Rides", icon: <DollarSign className="w-5 h-5" /> },
];

const SalesAndCollections = () => {
    return (
        <div className="w-full ml-[350px] bg-green-50 ">
            <div className="fixed flex justify-between items-center px-6 py-4 bg-green-50 z-50 shadow left-[350px] w-[calc(100%-350px)]">
                <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-br from-[#FFC403] to-[#F97316] bg-clip-text text-transparent">
                        Fleet Command Center
                    </h2>
                    <p className="text-sm text-gray-600">
                        Real-time fleet management and analytics
                    </p>
                </div>

                <div className="flex gap-4">
                    <button className="flex  justify-end">
                        <div className="flex items-center gap-2 px-5 py-2 rounded-md text-sm font-medium 
                            bg-[linear-gradient(95.96deg,#15803D_0%,#84CC16_100%)] text-white border border-transparent
                            hover:opacity-90 transition">
                            <LuNotebookPen className="w-4 h-4" />
                            Sales Invoice
                        </div>
                    </button>
                    <button className="flex  justify-end">
                        <div className="flex items-center gap-2 px-8 py-2 rounded-md text-sm font-medium 
                            bg-white text-green-700 border border-gray-300
                            hover:bg-gray-50 transition">
                            <FiDollarSign className="w-4 h-4" />
                            Collections
                        </div>
                    </button>
                </div>

                <div className="flex gap-4 ">
                    <button className="flex  justify-end">
                        <div className="flex items-center gap-2 px-8 py-2 rounded-md text-sm font-medium 
                            bg-white text-green-700 border border-gray-300
                            hover:bg-gray-50 transition">
                            <MdDateRange className="w-4 h-4" />
                            Start date
                        </div>
                    </button>
                    <button className="flex  justify-end">
                        <div className="flex items-center gap-2 px-8 py-2 rounded-md text-sm font-medium 
                            bg-white text-green-700 border border-gray-300
                            hover:bg-gray-50 transition">
                            <MdDateRange className="w-4 h-4" />
                            Last date
                        </div>
                    </button>
                </div>



            </div>
            <div className="p-6 bg-[#F8FCF9] rounded-lg shadow border border-gray-200 mt-[100px]">
                {/* Heading */}
                <div className="grid grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow border border-gray-200 p-6 text-center">
                        <p className="text-2xl font-bold text-green-700">₹1,000</p>
                        <p className="text-gray-600 text-sm">Total Revenue</p>
                    </div>
                    <div className="bg-white rounded-lg shadow border border-gray-200 p-6 text-center">
                        <p className="text-2xl font-bold text-green-500">₹1,000</p>
                        <p className="text-gray-600 text-sm">Own Fleet</p>
                    </div>
                    <div className="bg-white rounded-lg shadow border border-gray-200 p-6 text-center">
                        <p className="text-2xl font-bold text-black">₹1,000</p>
                        <p className="text-gray-600 text-sm">Operator Fleet</p>
                    </div>
                    <div className="bg-white rounded-lg shadow border border-gray-200 p-6 text-center">
                        <p className="text-2xl font-bold text-orange-600">₹1,000</p>
                        <p className="text-gray-600 text-sm">Other Fee</p>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                    <table className="min-w-full text-sm">
                        <thead className="bg-[#F8FCF9] text-gray-700">
                            <tr>
                                <th className="px-4 py-3 text-left">Invoice ID</th>
                                <th className="px-4 py-3 text-left">Invoice Type</th>
                                <th className="px-4 py-3 text-left">HSN Code</th>
                                <th className="px-4 py-3 text-left">Amount</th>
                                <th className="px-4 py-3 text-left">SGST</th>
                                <th className="px-4 py-3 text-left">CGST</th>
                                <th className="px-4 py-3 text-left">IGST</th>
                                <th className="px-4 py-3 text-left">Total Payout</th>
                                <th className="px-4 py-3 text-left">Payment Mode</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            <tr>
                                <td className="px-4 py-3 text-green-700 font-medium">INV-001</td>
                                {/* <div className="pr-16">
                                    <div className="flex rounded-xl bg-gray-400">
                                        
                                    </div>
                                </div> */}
                                <td className="px-4 py-3 text-gray-800 ">Ride Fare</td>
                                <td className="px-4 py-3 text-gray-500">996511</td>
                                <td className="px-4 py-3 text-gray-800">₹250</td>
                                <td className="px-4 py-3 text-gray-800">₹22.5</td>
                                <td className="px-4 py-3 text-gray-800">₹22.5</td>
                                <td className="px-4 py-3 text-gray-800">₹0</td>
                                <td className="px-4 py-3 text-green-700 font-semibold">₹295</td>
                                <td className="px-4 py-3">
                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">UPI</span>
                                </td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 text-green-700 font-medium">INV-002</td>
                                <td className="px-4 py-3 text-gray-800">Convenience Fee </td>
                                <td className="px-4 py-3 text-gray-500">998314</td>
                                <td className="px-4 py-3 text-gray-800">₹15</td>
                                <td className="px-4 py-3 text-gray-800">₹1.35</td>
                                <td className="px-4 py-3 text-gray-800">₹1.35</td>
                                <td className="px-4 py-3 text-gray-800">₹0</td>
                                <td className="px-4 py-3 text-green-700 font-semibold">₹17.7</td>
                                <td className="px-4 py-3">
                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">Card</span>
                                </td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 text-green-700 font-medium">INV-003</td>
                                <td className="px-4 py-3 text-gray-800">RedBee Fee</td>
                                <td className="px-4 py-3 text-gray-500">998314</td>
                                <td className="px-4 py-3 text-gray-800">₹25</td>
                                <td className="px-4 py-3 text-gray-800">₹2.25</td>
                                <td className="px-4 py-3 text-gray-800">₹2.25</td>
                                <td className="px-4 py-3 text-gray-800">₹0</td>
                                <td className="px-4 py-3 text-green-700 font-semibold">₹29.5</td>
                                <td className="px-4 py-3 text-gray-800">
                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">Cash</span>
                                </td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 text-green-700 font-medium">INV-004</td>
                                <td className="px-4 py-3 text-gray-800">Cancellation Fee</td>
                                <td className="px-4 py-3 text-gray-500">996511</td>
                                <td className="px-4 py-3 text-gray-800">₹50</td>
                                <td className="px-4 py-3 text-gray-800">₹4.5</td>
                                <td className="px-4 py-3 text-gray-800">₹4.5</td>
                                <td className="px-4 py-3 text-gray-800">₹0</td>
                                <td className="px-4 py-3 text-green-700 font-semibold">₹59</td>
                                <td className="px-4 py-3">
                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">UPI</span>
                                </td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 text-green-700 font-medium">INV-005</td>
                                <td className="px-4 py-3 text-gray-800">Ride Fare</td>
                                <td className="px-4 py-3 text-gray-500">996511</td>
                                <td className="px-4 py-3 text-gray-800">₹180</td>
                                <td className="px-4 py-3 text-gray-800">₹16.2</td>
                                <td className="px-4 py-3 text-gray-800">₹16.2</td>
                                <td className="px-4 py-3 text-gray-800">₹0</td>
                                <td className="px-4 py-3 text-green-700 font-semibold">₹212.4</td>
                                <td className="px-4 py-3 ">
                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">Card</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default SalesAndCollections