// 'use client';
// import React, { useEffect, useState } from 'react'
// import { IoHomeOutline } from "react-icons/io5";
// import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
// import { FaXmark, FaCircleDot } from "react-icons/fa6";
// import { BsCheck2Circle } from "react-icons/bs"
// import { FaCar, FaPhone, FaPhoneAlt, FaWhatsapp, FaMapMarkerAlt, FaBuilding, FaClock, FaUser } from "react-icons/fa";
// import { PiSteeringWheelFill } from "react-icons/pi";
// import Link from 'next/link';
// import Image from 'next/image';
// import { useRouter } from 'next/navigation';
// import { apiClient } from '@/app/lib/apiClient';
// import TotalDrivers from './TotalDrivers';

// const rides = [
//     {
//         status: 'Upcoming',
//         from: 'Darbhanga Tower',
//         to: 'Madhubni Harlakhi',
//         time: '15 Jan, 02:30 pm',
//         driver: 'Jethalal Gada',
//         phone: '+91-9693189968',
//         cab: 'BR-12-AB-1234',
//         fare: '₹450.00',
//     },
//     {
//         status: 'Upcoming',
//         from: 'Darbhanga Tower',
//         to: 'Madhubni Harlakhi',
//         time: '15 Jan, 02:30 pm',
//         driver: 'Jethalal Gada',
//         phone: '+91-9693189968',
//         cab: 'BR-12-AB-1234',
//         fare: '₹450.00',
//     },
//     {
//         status: 'Upcoming',
//         from: 'Darbhanga Tower',
//         to: 'Madhubni Harlakhi',
//         time: '15 Jan, 02:30 pm',
//         driver: 'Jethalal Gada',
//         phone: '+91-9693189968',
//         cab: 'BR-12-AB-1234',
//         fare: '₹450.00',
//     },
//     {
//         status: 'Upcoming',
//         from: 'Darbhanga Tower',
//         to: 'Madhubni Harlakhi',
//         time: '15 Jan, 02:30 pm',
//         driver: 'Jethalal Gada',
//         phone: '+91-9693189968',
//         cab: 'BR-12-AB-1234',
//         fare: '₹450.00',
//     }
// ];

// const statuses = ['Upcoming', 'Completed', 'Cancelled'];

// const FleetDetails = ({ fleetId }) => {

//     const [totalCabs, setTotalCabs] = useState([]);
//     const [totalDriver, setTotalDriver] = useState([])
//     const [fleetData, setFleetData] = useState(null)
//     const [fleetStats, setFleetStats] = useState([]);
//     const [fleetRides, setFleetRides] = useState([]);
//     const [activeTab, setActiveTab] = useState('Upcoming');
//     const router = useRouter();

//     useEffect(() => {
//         //setFleetId(fleetId);

//         if(!fleetId) return;
//         const fetchFleetOverview = async () => {
//             console.log("fleetId", fleetId)
//             try {
//                 const res = await apiClient("GET", `/fleet/fleetDetailsById/${fleetId}`, '', true);
//                 console.log("=====================>",res)
//                 if(res?.data) {
//                     setFleetData(res?.data);
//                     setFleetStats(res?.data.stats || []);
//                     setFleetRides(res?.data.rides || []);
//                 }

//                  const cabRes = await apiClient("GET", `/fleet/getTotalCabsCount-by-fleetId/${fleetId}`, '', true);
//                  console.log("working", cabRes)
//                  if (cabRes?.data) {
//                    setTotalCabs(cabRes?.data); // depends on your API response shape
//                 }  else {
//         console.warn("No cabs found for this fleet.");
//         setTotalCabs(0); // default value
//     }

//       const DriverRes = await apiClient("GET", `/fleet/getTotalDriverCount-by-fleetId/${fleetId}`, '', true);
//                  console.log("working Driver", DriverRes)
//                  if (DriverRes?.data) {
//                    setTotalDriver(DriverRes?.data); // depends on your API response shape
//                 }  else {
//         console.warn("No cabs found for this fleet.");
//         setTotalDriver(0); // default value
//     }

//             } catch (error) {
//                 console.error(error);
//             }
//         };
//         fetchFleetOverview();
//     }, [fleetId]);

//     const stats = [
//     {
//         label: 'Cancelled Rides',
//         value: 12,
//         icon: <FaXmark className="text-white" />,
//         iconBg: 'bg-red-500',
//         bg: 'bg-red-50',
//         border: 'border-red-300',
//     },
//     {
//         label: 'Completed Rides',
//         value: 12,
//         icon: <BsCheck2Circle className="text-white" />,
//         iconBg: 'bg-green-500',
//         bg: 'bg-green-50',
//         border: 'border-green-300',
//     },
//     {
//         label: 'Total Cabs',
//         value: totalCabs,
//         icon: <FaCar className="text-white" />,
//         iconBg: 'bg-blue-600',
//         bg: 'bg-blue-50',
//         border: 'border-blue-400',
//     },
//     {
//         label: 'Total Drivers',
//         value: totalDriver,
//         icon: <PiSteeringWheelFill className="text-white" />,
//         iconBg: 'bg-purple-600',
//         bg: 'bg-purple-50',
//         border: 'border-purple-400',
//     },
//     {
//         label: 'Total Rides',
//         value: 12,
//         icon: <FaCircleDot className="text-white" />,
//         iconBg: 'bg-indigo-600',
//         bg: 'bg-indigo-50',
//         border: 'border-indigo-400',
//     },
// ];

//     return (
//         <div className='space-y-2'>
//             <div className="border border-[#babbba] p-2 flex items-center gap-2 bg-white dark:bg-gray-900 mt-1">
//                 <IoHomeOutline className="text-gray-400" size={18} />
//                 <MdKeyboardDoubleArrowLeft className="text-gray-400 w-4 h-4" />
//                 <span className="text-sm text-gray-600 font-medium">Fleet Dashboard</span>
//                 <MdKeyboardDoubleArrowLeft className="text-gray-400 w-4 h-4" />
//                 <Link href="#" className="text-sm text-blue-600 font-medium hover:underline">Active Fleets {fleetData?.full_name} </Link>
//             </div>
//             {/* FLEET test OVERVIEW  */}
//             <div className="bg-[url('/images/FleetBackground.svg')] bg-cover bg-center p-4 rounded-lg border">
//                 <h2 className="text-lg font-bold text-gray-800 mb-4">Fleet Overview</h2>

//                 <div className="flex flex-wrap gap-4">
//                     {stats.map((stat, index) => {
//                         const handleClick = () => {
//                             const labelToRoute = {
//                                 'Cancelled Rides': '/fleetManagement/cancelledRides',
//                                 'Completed Rides': '/fleetManagement/completedRides',
//                                 'Total Cabs': '/fleetManagement/totalCabs',
//                                 'Total Drivers': '/fleetManagement/totalDrivers',
//                                 'Total Rides': '/fleetManagement/totalRides',
//                             };

//                             const targetRoute = labelToRoute[stat.label];
//                             if (targetRoute) router.push(targetRoute);
//                         };

//                          return (
//                             <div
//                                 key={index}
//                                 onClick={handleClick}
//                                 className={`cursor-pointer flex items-center gap-4 flex-1 min-w-[200px] p-4 rounded-lg border ${stat.border} ${stat.bg} shadow hover:shadow-md transition`}
//                             >
//                                 <div className={`w-10 h-10 rounded-md flex items-center justify-center ${stat.iconBg}`}>{stat.icon}</div>
//                                 <div>
//                                     <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
//                                     <p className="text-xl font-bold text-gray-900">{stat.value}</p>
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </div>
//             </div>

//             <div className="border border-[#DBEAFE] rounded-xl p-6 bg-white shadow-sm w-full">
//                 <div className='flex items-center justify-between'>
//                     <h2 className="text-lg font-semibold text-gray-700 mb-4">Fleet Overview</h2>

//                     {/* WALLET AMOUNT SMALL CARD  */}
//                     <div className="w-fit rounded-lg px-6 py-1 bg-gradient-to-r from-[#0AC450] to-[#0C331A] text-white shadow-md">
//                         <p className="text-[12px] opacity-80">Wallet Amount</p>
//                         <button
//                             onClick={()=>{
//                                 router.push('/fleetManagement/walletAmount');
//                             }}
//                             className="flex items-center gap-2"
//                         >
//                             <div className="w-6 h-6 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
//                                 <Image
//                                     src='/icons/walleticon.png'
//                                     height={25}
//                                     width={25}
//                                     alt='wallet icon'
//                                 />
//                             </div>

//                             {/* Amount */}
//                             <p className="text-[18px] font-semibold tracking-wide">₹4,500</p>
//                         </button>
//                     </div>
//                 </div>

//                 <div className="flex flex-col md:flex-row gap-6">
//                     <div className="flex flex-1 gap-5">
//                         <div className="relative w-24 h-24">
//                             <Image
//                                  src={fleetData?.avatar && fleetData?.avatar.trim() !== ""
//                                 ? fleetData.avatar
//                                 : "/images/cab-captian-avator-default.png"}
//                                 //alt={fleetData?full_name.name || "Profile"}
//                                 alt="Profile"
//                                 fill
//                                 className="w-full h-full rounded-full border-4 border-white shadow-lg object-cover"
//                             />
//                             <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
//                         </div>

//                         <div className="flex flex-col justify-start gap-3">
//                             <h3 className="text-xl font-bold text-gray-800">{fleetData?.full_name}</h3>

//                             <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-md text-gray-800 text-sm font-medium">
//                                 <FaPhone className="text-blue-500" />
//                                 {fleetData?.mobile_no}
//                             </div>

//                             <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-md text-gray-800 text-sm font-medium">
//                                 <FaPhoneAlt className="text-gray-500" />
//                                 {fleetData?.alternate_no}
//                             </div>

//                             <div className="flex items-center justify-between bg-green-50 px-4 py-2 rounded-md text-sm font-medium">
//                                 <div className="flex items-center gap-3 text-green-700">
//                                     <FaWhatsapp className="text-green-600" />
//                                     {fleetData?.whatsapp}
//                                 </div>
//                                 <button className="bg-green-600 text-white ml-3 px-3 py-1 rounded shadow-lg hover:bg-green-700 transition text-sm">
//                                     WhatsApp
//                                 </button>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="flex flex-col gap-4 flex-1">
//                         <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
//                             <div className="flex items-center gap-2 text-gray-800 mb-1">
//                                 <FaMapMarkerAlt className="text-blue-600" />
//                                 <span className="font-semibold">Address</span>
//                             </div>
//                             <p className="text-sm text-gray-600 ml-6">{fleetData?.address}</p>
//                         </div>

//                         <div className="bg-blue-50 rounded-xl p-4 shadow-sm">
//                             <div className="flex items-center gap-2 text-gray-800 mb-1">
//                                 <FaBuilding className="text-blue-600" />
//                                 <span className="font-semibold">Vendor</span>
//                             </div>
//                             <p className="text-sm text-gray-700 ml-6"> Difelly Mobility India Private Limite</p>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div className="p-4 md:p-6 border rounded-xl bg-white shadow-sm">
//                 <h2 className="text-lg font-semibold text-gray-800 mb-4">Default Rides</h2>
//                 <div className="flex justify-between items-center mb-6 bg-gray-50 p-1 rounded-full shadow-inner overflow-auto w-full">
//                     {statuses.map((status) => {
//                         const isActive = activeTab === status;

//                         let activeClasses = '';
//                         if (status === 'Completed' && isActive) {
//                             activeClasses = 'bg-gradient-to-r from-green-400 to-green-900 text-white';
//                         } else if (status === 'Cancelled' && isActive) {
//                             activeClasses = 'bg-gradient-to-r from-red-400 to-red-700 text-white';
//                         } else if (isActive) {
//                             activeClasses = 'bg-gradient-to-r from-[#005ED7] to-[#2E89FF] text-white';
//                         }

//                         return (
//                             <button
//                                 key={status}
//                                 onClick={() => setActiveTab(status)}
//                                 className={`flex-1 text-center px-4 py-2 rounded-full font-medium text-sm transition whitespace-nowrap ${isActive ? activeClasses : 'text-gray-600 hover:bg-gray-100'}`}
//                             >
//                                 {status}
//                                 <span className={`ml-2 font-semibold inline-block rounded-full px-2 py-0.5 ${isActive ? 'bg-[#58A1FF] text-white' : 'bg-gray-200 text-gray-600'}`}>
//                                     {fleetRides.filter((ride) => ride.status === status).length}
//                                 </span>
//                             </button>
//                         );
//                     })}
//                 </div>

//                 <div className="flex flex-col gap-4">
//                     {rides
//                         .filter((ride) => ride.status === activeTab)
//                         .map((ride, index) => (
//                             <div
//                                 key={index}
//                              className="bg-white border rounded-xl p-4 shadow hover:shadow-md transition flex justify-between"
//                             >
//                                 <div className="flex flex-col justify-between">
//                                     <div>
//                                         <span className="text-xs bg-blue-100 font-semibold text-blue-600 px-2 py-1 rounded-full capitalize mb-2 inline-block">
//                                             {ride.status}
//                                         </span>

//                                         <div className="flex items-center gap-2 text-sm text-gray-800 font-medium mb-1">
//                                             <FaMapMarkerAlt className="text-gray-500" />
//                                             {ride.from} → {ride.to}
//                                         </div>

//                                         <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
//                                             <FaClock className="text-gray-400" />
//                                             {ride.time}
//                                         </div>

//                                         <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
//                                             <FaUser className="text-gray-400" />
//                                             <span className="font-semibold text-gray-800">{ride.driver}</span>
//                                             <span className="text-gray-500">{ride.phone}</span>
//                                         </div>

//                                         <div className="flex items-center gap-2 text-sm text-gray-600">
//                                             <FaCar className="text-gray-400" />
//                                             {ride.cab}
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="flex flex-col justify-end">
//                                     <div className="text-white text-[14px] bg-gradient-to-r from-[#10B981] to-[#16A34A] px-3 py-1 rounded-md self-end mt-auto">{ride.fare}</div>
//                                 </div>
//                             </div>
//                         ))}
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default FleetDetails

"use client";
import React, { useEffect, useState } from "react";
import { IoHomeOutline } from "react-icons/io5";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { FaXmark, FaCircleDot } from "react-icons/fa6";
import { BsCheck2Circle } from "react-icons/bs";
import {
  FaCar,
  FaPhone,
  FaPhoneAlt,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaBuilding,
  FaClock,
  FaUser,
} from "react-icons/fa";
import { PiSteeringWheelFill } from "react-icons/pi";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { apiClient } from "@/app/lib/apiClient";
import TotalDrivers from "./TotalDrivers";

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

const FleetDetails = ({ fleetId, operatorId }) => {
  const [totalCabs, setTotalCabs] = useState([]);
  const [totalDriver, setTotalDriver] = useState([]);
  const [fleetData, setFleetData] = useState(null);
  const [fleetStats, setFleetStats] = useState([]);
  const [fleetRides, setFleetRides] = useState([]);
  const [activeTab, setActiveTab] = useState("Upcoming");
  const router = useRouter();
  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [stats, setStats] = useState([]);

  const [upcomingRides, setUpcomingRides] = useState([]);
  const [completedRides, setCompletedRides] = useState([]);
  const [cancelledRides, setCancelledRides] = useState([]);

  const [showFull, setShowFull] = useState(null);

  useEffect(() => {
  
  if (!fleetId) return;
    const fetchFleetOverview = async () => {
      console.log("fleetId", fleetId);
      try {
        const res = await apiClient(
          "GET",
          `/fleet/fleetDetailsById/${fleetId}`,
          "",
          true
        );
        if (res?.data) {
          setFleetData(res?.data);
          setFleetStats(res?.data.stats || []);
          setFleetRides(res?.data.rides || []);
        }

        const cabRes = await apiClient(
          "GET",
          `/fleet/getTotalCabsCount-by-fleetId/${fleetId}`,
          "",
          true
        );
        console.log("working", cabRes);
        if (cabRes?.data) {
          setTotalCabs(cabRes?.data); 
        } else {
          console.warn("No cabs found for this fleet.");
          setTotalCabs(0); 
        }

        const DriverRes = await apiClient(
          "GET",
          `/fleet/getTotalDriverCount-by-fleetId/${fleetId}`,
          "",
          true
        );
        if (DriverRes?.data) {
          setTotalDriver(DriverRes?.data); 
        } else {
          console.warn("No cabs found for this fleet.");
          setTotalDriver(0); 
        }

           const dashboardRes = await apiClient(
        "GET",
        `/fleet/dashboard/${fleetId}`,
        "",
        true
      );
      if (dashboardRes?.success && dashboardRes?.data) {
        setDashboardSummary(dashboardRes.data);
      } else {
        setDashboardSummary(null);
      }

  if (operatorId) {
          const upcomingRes = await apiClient(
            "GET",
            `/fleet/getOperatorRidesByStatus/${operatorId}?status=upcoming`,
            "",
            true
          );
          setUpcomingRides(upcomingRes?.data || []);

          const completedRes = await apiClient(
            "GET",
            `/fleet/getOperatorRidesByStatus/${operatorId}?status=completed`,
            "",
            true
          );
          setCompletedRides(completedRes?.data || []);

          const cancelledRes = await apiClient(
            "GET",
            `/fleet/getOperatorRidesByStatus/${operatorId}?status=cancelled`,
            "",
            true
          );
          setCancelledRides(cancelledRes?.data || []);
        }      
      } catch (error) {
        console.error(error);
      }
    };
    fetchFleetOverview();
  }, [fleetId, operatorId]);



     useEffect(() => {
    if (!dashboardSummary) return;

    const mappedStats = [

       {
      label: "Cancelled Rides",
      value: dashboardSummary.cancelled_rides,
      icon: <FaXmark className="text-white" />,
      iconBg: "bg-red-500",
      bg: "bg-red-50",
      border: "border-red-300",
    },
     
      {
        label: "Completed Rides",
        value: dashboardSummary.completed_rides,
      icon: <BsCheck2Circle className="text-white" />,
      iconBg: "bg-green-500",
      bg: "bg-green-50",
      border: "border-green-300",
      },
      {
        label: "Total Cabs",
        value: dashboardSummary.total_cabs,
      icon: <FaCar className="text-white" />,
      iconBg: "bg-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-400",
      },
      {
        label: "Total Drivers",
        value: dashboardSummary.total_drivers,
        border: "border-yellow-300",
      icon: <PiSteeringWheelFill className="text-white" />,
      iconBg: "bg-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-400",
      },
      {
        label: "Total Rides",
        value: dashboardSummary.total_rides,
      icon: <FaCircleDot className="text-white" />,
      iconBg: "bg-indigo-600",
      bg: "bg-indigo-50",
      border: "border-indigo-400",
      },
    ];

    setStats(mappedStats);
  }, [dashboardSummary]);

  const ridesMap = {
    Upcoming: upcomingRides,
    Completed: completedRides,
    Cancelled: cancelledRides,
  };


  useEffect(() => {
  if (fleetData?.full_name && fleetId) {
    const label = fleetData.full_name;

    sessionStorage.setItem(`label-fleet-${fleetId}`, label);

    if (window.updateBreadcrumbName) {
      window.updateBreadcrumbName(fleetId, label);
    }
  }
}, [fleetData?.full_name, fleetId]);


useEffect(() => {
  if (activeTab === "Completed" || activeTab === "Cancelled") {
    setTimeout(() => {
      const section = document.getElementById("default-rides");
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 200);
  }
}, [activeTab]);


  return (
    <div className="space-y-2">
      {/* FLEET test OVERVIEW  */}
      <div className="bg-[url('/images/FleetBackground.svg')] bg-cover bg-center p-4 rounded-lg border">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Fleet Overview</h2>

        <div className="flex flex-wrap gap-4">
          {stats.map((stat, index) => {
//             const handleClick = () => {
//               // const labelToRoute = {
//               //   "Cancelled Rides": "/fleetManagement/cancelledRides",
//               //   "Completed Rides": "/fleetManagement/completedRides",
//               //   "Total Cabs": `/fleetManagement/totalCabs/${fleetId}`,
//               //   "Total Drivers": "/fleetManagement/totalDrivers",
//               //   "Total Rides": "/fleetManagement/totalRides",
//               // };

//                 if (stat.label === "Completed Rides") {
//     setActiveTab("Completed");
//   } else if (stat.label === "Cancelled Rides") {
//     setActiveTab("Cancelled");
//   // } else if (stat.label === "Upcoming Rides") {
//   //   setActiveTab("Upcoming");
//   }


//               const labelToRoute = {
//   // "Cancelled Rides": "/fleetManagement/cancelledRides",
//   // "Completed Rides": "/fleetManagement/completedRides",
//   "Total Cabs": `/fleetManagement/totalCabs/${fleetId}`,
//   "Total Drivers": `/fleetManagement/totalDrivers/${fleetId}`,
//   "Total Rides": "/fleetManagement/totalRides",
// };


//               const targetRoute = labelToRoute[stat.label];
//               if (targetRoute) router.push(targetRoute);
//             };

const handleClick = () => {
  if (stat.label === "Completed Rides") {
    setActiveTab("Completed");
  } else if (stat.label === "Cancelled Rides") {
    setActiveTab("Cancelled");
  }

  const labelToRoute = {
    "Total Cabs": `/fleetManagement/totalCabs/${fleetId}`,
    "Total Drivers": `/fleetManagement/totalDrivers/${fleetId}`,
    "Total Rides": `/fleetManagement/totalRides/${fleetId}`,
  };

  const targetRoute = labelToRoute[stat.label];
  if (targetRoute) router.push(targetRoute);
};

            return (
              <div
                key={index}
                onClick={handleClick}
                className={`cursor-pointer flex items-center gap-4 flex-1 min-w-[200px] p-4 rounded-lg border ${stat.border} ${stat.bg} shadow hover:shadow-md transition`}
              >
                <div
                  className={`w-10 h-10 rounded-md flex items-center justify-center ${stat.iconBg}`}
                >
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    {stat.label}
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border border-[#DBEAFE] rounded-xl p-6 bg-white shadow-sm w-full">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Fleet Overview
          </h2>

          {/* WALLET AMOUNT SMALL CARD  */}
          <div className="w-fit rounded-lg px-6 py-1 bg-gradient-to-r from-[#0AC450] to-[#0C331A] text-white shadow-md">
            <p className="text-[12px] opacity-80">Wallet Amount</p>
            <button
              onClick={() => {
                // router.push("/fleetManagement/walletAmount");
                router.push(`/fleetManagement/walletAmount/${operatorId}`);

              }}
              className="flex items-center gap-2"
            >
              <div className="w-6 h-6 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
                <Image
                  src="/icons/walleticon.png"
                  height={25}
                  width={25}
                  alt="wallet icon"
                />
              </div>

              {/* Amount */}
              <p className="text-[18px] font-semibold tracking-wide">₹4,500</p>
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-1 gap-5">
            <div className="relative w-24 h-24">
              <Image
                src={
                  fleetData?.avatar && fleetData?.avatar.trim() !== ""
                    ? fleetData.avatar
                    : "/images/cab-captian-avator-default.png"
                }
                //alt={fleetData?full_name.name || "Profile"}
                alt="Profile"
                fill
                className="w-full h-full rounded-full border-4 border-white shadow-lg object-cover"
              />
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
            </div>

            <div className="flex flex-col justify-start gap-3">
              <h3 className="text-xl font-bold text-gray-800">
                {fleetData?.full_name}
              </h3>

              <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-md text-gray-800 text-sm font-medium">
                <FaPhone className="text-blue-500" />
                {fleetData?.mobile_no}
              </div>

              <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-md text-gray-800 text-sm font-medium">
                <FaPhoneAlt className="text-gray-500" />
                {fleetData?.alternate_no}
              </div>

              <div className="flex items-center justify-between bg-green-50 px-4 py-2 rounded-md text-sm font-medium">
                <div className="flex items-center gap-3 text-green-700">
                  <FaWhatsapp className="text-green-600" />
                  {fleetData?.whatsapp}
                </div>
                <button className="bg-green-600 text-white ml-3 px-3 py-1 rounded shadow-lg hover:bg-green-700 transition text-sm">
                  WhatsApp
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 flex-1">
            <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 text-gray-800 mb-1">
                <FaMapMarkerAlt className="text-blue-600" />
                <span className="font-semibold">Address</span>
              </div>
              <p className="text-sm text-gray-600 ml-6">{fleetData?.address}</p>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 text-gray-800 mb-1">
                <FaBuilding className="text-blue-600" />
                <span className="font-semibold">Vendor</span>
              </div>
              <p className="text-sm text-gray-700 ml-6">
                {" "}
                Difelly Mobility India Private Limite
              </p>
            </div>
          </div>
        </div>
      </div>

      <div id="default-rides" className="p-4 md:p-6 border rounded-xl bg-white shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Default Rides
        </h2>
        {/* <div className="flex justify-between items-center mb-6 bg-gray-50 p-1 rounded-full shadow-inner overflow-auto w-full"> */}
        <div className="flex justify-between items-center mb-6 bg-gray-50 p-1 rounded-full shadow-inner w-full overflow-x-auto overflow-y-hidden">

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
              activeClasses =
                "bg-gradient-to-r from-[#005ED7] to-[#2E89FF] text-white";
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
                      ? "bg-[#58A1FF] text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {/* {fleetRides.filter((ride) => ride.status === status).length} */}
                  {ridesMap[status]?.length || 0}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-4">
          {/* {rides
                        .filter((ride) => ride.status === activeTab)
                        .map((ride, index) => ( */}
          {(ridesMap[activeTab] || []).map((ride, index) => (
            <div
              key={index}
              className="bg-white border rounded-xl p-4 shadow hover:shadow-md transition flex justify-between"
            >
              <div className="flex flex-col justify-between">
                <div>
                  <span className="text-xs bg-blue-100 font-semibold text-blue-600 px-2 py-1 rounded-full capitalize mb-2 inline-block">
                    {ride.ride_status}
                  </span>

                  <div className="flex items-center gap-3 text-sm font-medium text-gray-800 mb-1 relative">
                    <FaMapMarkerAlt className="text-red-500" />
                    <span
                      className="max-w-[140px] truncate cursor-pointer"
                      onClick={() =>
                        setShowFull(
                          showFull === `${index}-source`
                            ? null
                            : `${index}-source`
                        )
                      }
                    >
                      {ride.booking?.location_details?.source}
                    </span>
                    {showFull === `${index}-source` && (
                      <div className="absolute z-10 top-full left-0 mt-1 px-2 py-1 bg-white border rounded shadow text-xs max-w-[330px] break-words whitespace-normal">
                        <div>{ride.booking?.location_details?.source}</div>
                        <div>
                          <span className="font-semibold">Distance:</span>{" "}
                          {ride.booking?.location_details?.distance || "--"}
                        </div>
                      </div>
                    )}

                    <span className="mx-2 text-gray-400">→</span>

                    <FaMapMarkerAlt className="text-green-600" />
                    <span
                      className="max-w-[140px] truncate cursor-pointer"
                      onClick={() =>
                        setShowFull(
                          showFull === `${index}-destination`
                            ? null
                            : `${index}-destination`
                        )
                      }
                    >
                      {ride.booking?.location_details?.destination}
                    </span>
                    {showFull === `${index}-destination` && (
                      <div className="absolute z-10 top-full left-0 mt-1 px-2 py-1 bg-white border rounded shadow text-xs max-w-[330px] break-words whitespace-normal">
                        <div>{ride.booking?.location_details?.destination}</div>
                        <div>
                          {/* <span className="font-semibold">Distance:</span>{' '}
                          {ride.booking?.location_details?.distance_to_destination || '--'} */}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <FaClock className="text-gray-400" />
                    {/* {ride.time} */}
                    {new Date(ride.ride_accept_time).toLocaleString()}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <FaUser className="text-gray-400" />
                    <span className="font-semibold text-gray-800">
                      {ride.booking?.driver_details_json?.drv_name || "N/A"}
                    </span>
                    <span className="text-gray-500">
                      {ride.booking?.driver_details_json?.driver_mobile ||
                        "N/A"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaCar className="text-gray-400" />
                    {ride.booking?.cab_details_json?.cab_reg || "N/A"}
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-end">
                <div className="text-white text-[14px] bg-gradient-to-r from-[#10B981] to-[#16A34A] px-3 py-1 rounded-md self-end mt-auto">
                  ₹{ride.booking?.price_details_json?.collected_by_driver || "0"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FleetDetails;