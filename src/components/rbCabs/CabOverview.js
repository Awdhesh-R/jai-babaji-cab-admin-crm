"use client";
import React from "react";
import { FaHome } from "react-icons/fa";
import { FiChevronRight } from "react-icons/fi";
import { FaCarAlt } from 'react-icons/fa';
// import { MdLocationOn } from 'react-icons/md';
import { IoLocationSharp } from "react-icons/io5";
import { FaCar } from "react-icons/fa";
import { LuClock4 } from "react-icons/lu";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import { FaEdit } from "react-icons/fa";
import { MdOutlineArrowCircleRight } from "react-icons/md"
import { MdAccessTime } from "react-icons/md";
import { GrLocation } from "react-icons/gr";
import { GrNotes } from "react-icons/gr";
import { SlGraph } from "react-icons/sl";
import { GrHostMaintenance } from "react-icons/gr";
import { FiCheckCircle } from "react-icons/fi";
import { IoEyeOutline } from "react-icons/io5";
import { FiFileText } from "react-icons/fi";
import { MdOutlineDateRange } from "react-icons/md";
import { GrDocumentStore } from "react-icons/gr";
import { FiSearch } from "react-icons/fi";
import { CiFilter } from "react-icons/ci";
import { FiPlus } from "react-icons/fi";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchCabOverview } from "@/redux/features/cabOverviewSlice";
import { setPage, setCabId } from "@/redux/features/rbCabMainSlice";
import { useRouter } from "next/navigation";

import { BsDownload } from "react-icons/bs";
import { useState } from "react";
import DriverSelectionModal from "../DriverSelectionModal/DriverSelectionModal";
import { apiClient } from "@/app/lib/apiClient";
import { toast } from "react-toastify";
// import { IoEyeOutline } from "react-icons/io5";


const CabOverview = ({cab_id}) => {
    const dispatch = useDispatch();
    const { page, selectedCabId } = useSelector((state) => state.rbCabMain);
    const { overview, loading, error } = useSelector((state) => state.cabOverview);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentServiceType, setCurrentServiceType] = useState("");
    const [serviceTypeModalOpen, setOpenModalForServiceType] = useState(false);
    const [currentCabStatus, setCurrentCabStatus] = useState("");
    const [cabStatusModalOpen, setOpenModalForCabStatus] = useState(false);
    const [currentRideStatus, setCurrentRideStatus] = useState("");
    const [rideStatusModalOpen, setOpenModalForRideStatus] = useState(false);
    const [componentLoading, setLoading] = useState(false);
    const [userData, setUserData] = useState(null);
    // console.log("cabId:", cabId);
    const router = useRouter();

    useEffect(() => {
        console.log(cab_id);
        
        if (cab_id) {
            dispatch(fetchCabOverview(cab_id));
        }
        const user = localStorage.getItem('user');
        if (user) {
            const userData = JSON.parse(user) || JSON.parse(user);
            console.log("User Data:", userData);
            if (userData && userData.user) {
                setUserData(userData.user);
            } else {
                console.log("User name not found in the user data.");
                setUserData(null);
            }
        }
    }, [cab_id, dispatch]);
    // console.log(overview);
    // console.log("Ram");

    const handleEditServiceType = (type) => {
        setCurrentServiceType(type);
        setOpenModalForServiceType(true);
    }
    const handleServiceTypeChange = async (e) => {
        const val = e.target.value;
        setCurrentServiceType(val);
        setLoading(true);
        try {
            const response = await apiClient("PUT", `/rb_cabs/updateCab/${cab_id}`, {
                cab_service_type: val
            });
            if(response.status || response.success) {
                toast.success(response.message);
                dispatch(fetchCabOverview(cab_id));
                setOpenModalForServiceType(false);
            }
        }catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }
    const handleEditCabStatus = (status) => {
        setCurrentCabStatus(status);
        setOpenModalForCabStatus(true);
    }
    const handleCabStatusChange = async (e) => {
        const val = e.target.value;
        setCurrentCabStatus(val);
        setLoading(true);
        try {
            const response = await apiClient("PUT", `/rb_cabs/updateCab/${cab_id}`, {
                cab_status: val
            });
            if(response.status || response.success) {
                toast.success(response.message);
                dispatch(fetchCabOverview(cab_id));
                setOpenModalForCabStatus(false);
            }
        }catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }
    const handleEditRideStatus = (status) => {
        setCurrentRideStatus(status);
        setOpenModalForRideStatus(true);
    }
    const handleRideStatusChange = async (e) => {
        const val = e.target.value;
        setCurrentRideStatus(val);
        setLoading(true);
        try {
            const response = await apiClient("PUT", `/rb_cabs/updateCab/${cab_id}`, {
                ride_status: val
            });
            if(response.status || response.success) {
                toast.success(response.message);
                dispatch(fetchCabOverview(cab_id));
                setOpenModalForRideStatus(false);
            }
        }catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
  if (overview?.cab_reg && cab_id) {

    sessionStorage.setItem(`label-cab-${cab_id}`, overview.cab_reg);

    if (window.updateBreadcrumbName) {
      window.updateBreadcrumbName(cab_id, overview.cab_reg);
    }
  }
}, [overview?.cab_reg, cab_id]);


    return (

        <div className="p-4">
            {!overview && <p>No cab data found</p>}

            {overview && <>
            {/* Breadcrumb Navigation */}
            <div className='flex  my-4 justify-between '>
                <div className='flex items-center gap-2'>
                    <div className='bg-[#D9D9D9] rounded-lg h-12 w-12'></div>
                    <div className='flex flex-col '>
                        <strong className='text-[#303032] text-[30px]'>My Cabs</strong>
                        <span className='text-[#303032] text-[15px]'>Mange your rides and vehicle</span>
                    </div>
                </div>
                <div className='flex items-center gap-3 '>
                    <div className="relative  max-w-sm rounded-full border border-[#E2E8F0]">
                        <input
                            type="text"
                            placeholder="Search cabs..."
                            // onChange={onChange}
                            className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <FiSearch className="absolute left-3 top-2.5 text-gray-500 text-lg" />
                    </div>
                    <button className='flex items-center  rounded-lg border border-[#E2E8F0] '>
                        <div className='flex items-center gap-3 px-3 py-2'>
                            <CiFilter className='h-5 w-5' />
                            <span className='text-black text-bold text-[17px] '>
                                Filter
                            </span>
                        </div>
                    </button>


                    <button
                        onClick={() => router.push("/rbFleetManagement/rbCabs/AddCabs")}
                        className='flex items-center rounded-lg border border-[#E2E8F0] 
                        bg-[linear-gradient(90deg,#2563EB_0%,#153885_100%)] 
                        hover:bg-[linear-gradient(90deg,#153885_0%,#2563EB_100%)] 
                        hover:scale-105 
                        transition-all duration-300 ease-in-out'
                    >
                        <div className='flex items-center gap-3 px-3 py-2 text-white'>
                            <FiPlus className='h-5 w-5' />
                            <span className='text-white font-bold text-[17px]'>
                                Add Cab
                            </span>
                        </div>
                    </button>



                </div>


            </div>
            {/* Content Section */}
            <div className="flex gap-4 ">
                {/* Left Section */}
                <div className="flex flex-col w-3/4">
                    <div
                        className="flex gap-4 bg-cover  bg-no-repeat bg-center rounded-lg "
                        style={{ backgroundImage: "url('/images/CabOverBG.svg')" }}
                    >
                        <div className="flex flex-col gap-4 my-4">
                            <div className="flex gap-2 items-center">
                                <div className="flex items-center rounded-lg  bg-[linear-gradient(90deg,_#005FE2_0%,_#00347C_100%)]  p-1 ">
                                    <FaCar className="flex items-center text-white h-6 w-6" />
                                </div>
                                <span className="text-[#221E1E] font-bold text-[14px]">Cab Overview</span>
                            </div>
                            <div className="relative flex items-center">
                                {/* Parent Box */}
                                <div
                                    className="relative border border-[#0F913F] bg-cover bg-center w-[150px] h-[100px] rounded-md"
                                    style={{ backgroundImage: "url('/images/rbDriverCar.png')" }}
                                >
                                    {/* Green Dot - top-right corner */}
                                    <div className={`absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 h-3 w-3 rounded-full border-2 border-white ${overview?.cab_status === 'active' ? 'bg-[#0F913F]' : 'bg-[#FF0000]'}`} />
                                </div>
                            </div>


                        </div>
                        <div className="flex flex-col gap-4 items-start mt-12 mb-12">

                                <div className="flex gap-4">
                                    <span className="text-[32px] text-[#020202] font-bold">{overview?.cab_reg}</span>
                                    <button className="flex items-center border-black border-x-4 rounded-full">
                                        <strong className="text-[#616161] text-bold text-[16px] px-3 py-2 capitalize">{overview?.cab_name}  ({overview?.cab_model})</strong>
                                    </button>
                                </div>
                            <div className="flex gap-2  ">
                                <div>

                                    {!cabStatusModalOpen && <button className="flex items-center bg-[#a6e702] rounded-full gap-3 py-2 px-4">
                                        <strong className="text-black text-bold text-[16px] py-2 capitalize">{overview?.cab_status}</strong>
                                        <FaEdit className="cursor-pointer text-blue-600" onClick={()=>handleEditCabStatus(overview?.cab_status)}/>
                                    </button>}
                                    {cabStatusModalOpen && <div className="flex flex-col items-center bg-[#a6e702] rounded-full py-2 px-4">
                                        {/* <label forHtml="serviceType">Service Type</label> */}
                                        <select id="cab_status" disabled={componentLoading} name="cab_status" className="px-4 py-2 bg-transparent focus:outline-none" onChange={handleCabStatusChange} value={currentCabStatus || ""}>
                                            <option value={"active"}>Active</option>
                                            <option value={"inactive"}>Inactive</option>
                                        </select>
                                    </div>}
                                </div>
                                <div>
                                    {!serviceTypeModalOpen && <button className="flex items-center bg-[#a6e702] rounded-full gap-3 py-2 px-4">
                                        <strong className="text-black text-bold text-[16px] py-2 capitalize">{overview?.cab_service_type}</strong>
                                        {userData?.id && [1,3,36].includes(userData?.id) && <FaEdit className="cursor-pointer text-blue-600" onClick={()=>handleEditServiceType(overview?.cab_service_type)}/>}
                                    </button>}
                                    {serviceTypeModalOpen && <div className="flex flex-col items-center bg-[#a6e702] rounded-full py-2 px-4">
                                        {/* <label forHtml="serviceType">Service Type</label> */}
                                        <select id="serviceType" disabled={componentLoading} name="serviceType" className="px-4 py-2 bg-transparent focus:outline-none" onChange={handleServiceTypeChange} value={currentServiceType || ""}>
                                            <option value={"fulltime"}>Full Time</option>
                                            <option value={"lease"}>Lease</option>
                                        </select>
                                    </div>}
                                </div>
                                <div>
                                    {!rideStatusModalOpen && <button className="flex items-center bg-[#a6e702] rounded-full gap-3 py-2 px-4">
                                        <strong className="text-black text-bold text-[16px] py-2 capitalize">{overview?.ride_status}</strong>
                                        <FaEdit className="cursor-pointer text-blue-600" onClick={()=>handleEditRideStatus(overview?.ride_status)}/>
                                    </button>}
                                    {rideStatusModalOpen && <div className="flex flex-col items-center bg-[#a6e702] rounded-full py-2 px-4">
                                        {/* <label forHtml="serviceType">Service Type</label> */}
                                        <select id="ride_status" disabled={componentLoading} name="ride_status" className="px-4 py-2 bg-transparent focus:outline-none" onChange={handleRideStatusChange} value={currentRideStatus || ""}>
                                            <option value={"booked"}>Booked</option>
                                            <option value={"free"}>Free</option>
                                            <option value={"rest"}>Rest</option>
                                            <option value={"breakdown"}>Breakdown</option>
                                            <option value={"official duty"}>Official Duty</option>
                                            <option value={"leave"}>Leave</option>
                                            <option value={"Probable"}>Probable</option>
                                        </select>
                                    </div>}
                                </div>
                            </div>

                            <div className="flex gap-2 items-center">
                                <IoLocationSharp className="text-[#F80000] h-6 w-6" />
                                <span className="text-[16px] text-[#888080] font-bold">{overview?.cab_city}</span>
                            </div>
                            <div className="flex gap-2 items-center">
                                <div className="flex gap-4 bg-[#ECFDF5] rounded-lg p-3 items-center border border-[#15803D]">
                                    <div className="bg-[#D9D9D9]  h-8 w-8 rounded-lg"></div>
                                    <span className="text-[#15803D] text-[16px] font-bold ">Total KM:  85,230 km</span>
                                </div>
                                <div className="flex gap-4 bg-[#EEF4FF] rounded-lg p-4 items-center border border-[#2563EB]">
                                    {/* <div className="bg-[#D9D9D9]  h-8 w-8 rounded-lg"></div> */}
                                    <span className="text-[#2563EB] text-[16px] font-bold ">Average Mileage:  18.4 km/l</span>
                                </div>
                            </div>

                        </div>
                    </div>


                    <div
                        className="flex items-center bg-cover bg-center rounded-2xl pl-6 pt-6 pb-8 justify-center mx-5"
                        style={{ backgroundImage: "url('/images/RectangleBG.png')" }}
                    >
                        {/* Left side - Ride Info */}
                        <div className="flex-1 flex bg-white rounded-lg flex-col gap-2 mr-2 items p-4 ">
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                <LuClock4 className="text-lg" />
                                {/* <span className="text-[14px]">
                                    Last Ride at   <strong className="text-[14px]">12:30 AM</strong>
                                </span> */}
                                <div className="text-[14px] text-gray-700 font-medium">
                                    12:30 AM · 18 km <span className="text-gray-500 font-normal">(Last Ride)</span>
                                </div>



                            </div>
                            <div className="flex gap-4 text-sm items-center justify-between">
                                {/* From */}
                                <div className="flex items-center gap-1 text-gray-700 px-4">
                                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                                    <span className="text-[12px]">Patna </span>
                                </div>
                                <div className=" items-center  text-gray-500 text-[20px] ">
                                    →
                                </div>
                                {/* To */}
                                <div className="flex items-center gap-1 font-medium px-7">
                                    <FaMapMarkerAlt className="text-[12px] text-red-600" />
                                    <span className="text-gray-700 text-[12px]">Darbhanga </span>
                                </div>
                            </div>
                        </div>

                        {/* Right side - Button */}
                        <div className="flex-1 flex justify-center">
                            <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl font-semibold text-sm hover:brightness-110 transition px-6 py-4">
                                View Booking Rides lists
                                <FiExternalLink className="text-lg" />
                            </button>
                        </div>
                    </div>


                    <div className=" mx-2 ">
                        {/* Driver Information */}
                        <h2 className="text-base font-semibold text-gray-900 mt-2">Driver Information</h2>
                        <div className="flex gap-8 bg-white rounded-2xl shadow-sm p-4  ">
                            <div className="flex items-center gap-3">
                                <div className=" w-full">
                                    <Image src={overview?.driver?.driverImage ? (overview?.driver?.driverImage.startsWith("http") ? overview.driver.driverImage : `${process.env.NEXT_PUBLIC_API_BASE_URL ? process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, "") : "https://api.jaibabajicab.com"}/uploads/driver_docs/${overview.driver.driverImage.replace(/^\//, "")}`) : '/images/kumar.jpg'} alt="Driver_image" width={200} height={200} className="object-cover rounded-3xl"/>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 w-full">
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 bg-gray-100 rounded-xl px-2 py-3">
                                        <div className="text-xs text-gray-500 mb-1">Driver Name</div>
                                        <div className="font-semibold text-gray-800 text-sm">
                                            {overview?.driver?.driverName ? overview.driver.driverName : (overview?.cab_driver_details?.driverName ? overview.cab_driver_details.driverName : "N/A")}
                                        </div>
                                    </div>
                                    <div className="flex-1 bg-blue-100 rounded-xl px-2 py-3">
                                        <div className="text-xs text-gray-500 mb-1">Mobile Number</div>
                                        <div className="font-semibold text-gray-900 text-sm">+91 {overview?.driver?.driverMobile ? overview.driver.driverMobile : (overview?.cab_driver_details?.driverMobile ? overview.cab_driver_details.driverMobile : "9999999999")}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex  gap-4 justify-start w-auto">
                                    {/* <button className="bg-[linear-gradient(90deg,_#F80000_0%,_#920000_100%)] text-white text-xs font-semibold  rounded-xl flex items-center gap-1 justify-center px-6 py-4">
                                        <span className="text-[14px] text-[#FFFFFF]">Change Driver</span>
                                        <FaEdit className="text-[12px] text-[#FFFFFF] h-4 w-4" />
                                    </button> */}

                                        <button
                                            className="bg-[linear-gradient(90deg,_#F80000_0%,_#920000_100%)] text-white text-xs font-semibold rounded-xl flex items-center gap-1 justify-center px-6 py-4 "
                                            onClick={() => setModalOpen(true)}
                                        >
                                            <span className="text-[14px] text-[#FFFFFF]">{overview?.driver?"Change Driver": "Assign Driver"}</span>
                                            <FaEdit className="text-[12px] text-[#FFFFFF] h-4 w-4" />
                                        </button>

                                    <button className=" rounded-xl bg-[#005FE2] flex  gap-1 items-center justify-center px-3 py-4"
                                    onClick={() => router.push(`/rbFleetManagement/rbDriver/driverDetails/${overview?.driver_id}`)}>
                                        <span className="text-[14px] text-[#FFFFFF]">View Driver profile</span>
                                        <MdOutlineArrowCircleRight className="flex items-center text-white h-4 w-4 " />
                                    </button>
                                </div>
                            </div>

                        </div>

                        {/* Live Ride & Location */}
                        <h2 className="text-base font-semibold text-gray-900 mt-5">Live Ride & Location</h2>
                        <div className="bg-white rounded-2xl shadow-sm p-4 space-y-4 ">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-orange-100 rounded-xl p-3 gap-4">
                                    <div className="text-xs text-gray-500 mb-1">Last Active</div>
                                    <div className="text-sm font-semibold text-black flex items-center gap-1"><MdAccessTime className="text-orange-500 h-5 w-5" /> 2 hrs ago</div>
                                </div>
                                <div className="bg-green-50 rounded-xl p-3 gap-4">
                                    <div className="text-xs text-gray-500 mb-1">Current Status</div>
                                    <button className=" border border-green-300 text-sm font-semibold text-green-700 items-center bg-green-100 rounded-full px-4 py-1 ">{overview?.ride_status}</button>
                                </div>
                                <div className="bg-blue-100 rounded-xl p-3 gap-4">
                                    <div className="text-xs text-gray-500 mb-1">Live Location</div>
                                    <div className="text-sm font-semibold text-blue-900 flex items-center gap-1"> <GrLocation className="text-blue-500 h-5 w-5" /> Patna Railway Station</div>
                                </div>
                            </div>

                        </div>
                    </div>


                </div>

                {/* Right Section */}
                <div className="flex flex-col w-2/5 ">
                    {/* You can add more content here later */}
                    {/* Document Validity Section */}
                    <div className="flex flex-col bg-white px-3 py-2 rounded-xl shadow gap-4 h-[36%] mb-4">
                        <div className="flex items-center gap-2 ">
                            <div className="flex items-center bg-gradient-to-r from-purple-500 to-indigo-500 p-2 rounded-xl">
                                <GrNotes className="text-white text-lg" />
                            </div>
                            <h2 className="flex items-center font-semibold text-lg text-gray-900">Document Validity</h2>
                        </div>

                        <div className="flex  flex-col gap-3">
                            <div className="flex items-center justify-between bg-gray-50  rounded-xl px-4 py-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-green-500 text-lg">🛡️</span>
                                    <span className="font-medium text-gray-800">Pollution Check</span>
                                </div>
                                <span className="text-sm text-gray-600">15-Dec-2024</span>
                            </div>
                            <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-blue-500 text-lg">📅</span>
                                    <span className="font-medium text-gray-800">Insurance Expiry</span>
                                </div>
                                <span className="text-sm text-gray-600">22-Mar-2025</span>
                            </div>
                            <div className="flex items-center justify-between bg-gray-50  rounded-xl px-4 py-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-purple-500 text-lg">📝</span>
                                    <span className="font-medium text-gray-800">Permit Valid Till</span>
                                </div>
                                <span className="text-sm text-gray-600">10-Jan-2025</span>
                            </div>
                            <div className="flex items-center justify-between bg-gray-50  rounded-xl px-4 py-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-orange-500 text-lg">🧾</span>
                                    <span className="font-medium text-gray-800">Fitness Certificate</span>
                                </div>
                                <span className="text-sm text-gray-600">05-Feb-2025</span>
                            </div>
                        </div>
                    </div>

                    {/* Performance Analytics Section */}
                    <div className="flex flex-col bg-white px-5 pb-5 pt-1 rounded-xl shadow gap-2  mt-2">
                        <div className="flex items-center gap-2 my-2 ">
                            <div className="bg-green-600 h-8 w-8 rounded-lg"></div>
                            <h2 className="font-semibold text-lg text-gray-900">Performance Analytics</h2>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-xl mb-4">
                            <p className="text-3xl font-bold text-center text-blue-600">92%</p>
                            <p className="text-center text-sm text-blue-500 font-medium">Efficiency Score</p>
                            <div className="mt-2 h-1 w-full bg-blue-200 rounded-full">
                                <div className="h-1 bg-blue-600 rounded-full w-[92%]"></div>
                            </div>
                        </div>

                        <div className="bg-green-50 p-3 rounded-xl flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-black">
                                <span className="text-xl">🔁</span>
                                <span className="text-sm font-medium">Today KM</span>
                            </div>
                            <span className="font-semibold text-green-500">65 KM</span>
                        </div>

                        <div className="bg-blue-50 p-3 rounded-xl flex items-center justify-between mb-2">
                            <div className="flex items-center gap-4 text-black">
                                <SlGraph className="text-xl" />
                                <span className="text-sm font-medium">Total Rides</span>
                            </div>
                            <span className="font-semibold text-blue-600">9</span>
                        </div>

                        <div className="flex flex-col bg-green-50 p-4 rounded-xl">
                            <div className="flex items-center justify-between text-black">
                                <span className="text-sm font-medium">Weekly Earnings</span>
                                <span className="font-bold text-lg text-green-500">₹14,500</span>
                            </div>
                            <div className="flex justify-between text-sm  text-black mt-1">
                                <span>Last Settlement</span>
                                <span className="text-green-500">₹2060</span>

                            </div>
                            <span className="flex ml-auto">07-aug</span>
                        </div>
                    </div>
                </div>
                </div>

                <DriverSelectionModal
                    open={modalOpen}
                    title={overview?.driver? "Change Driver": "Assign Driver"}
                    id={cab_id}
                    onClose={() => setModalOpen(false)}
                    onConfirm={(selectedId) => {
                        dispatch(fetchCabOverview(cab_id));
                    }}
                />
            </>}
        </div>
    );
};

export default CabOverview;