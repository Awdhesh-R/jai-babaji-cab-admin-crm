"use client";
import React from 'react'
import { FiSearch, FiPlus, FiChevronRight } from 'react-icons/fi';
import { CiFilter } from "react-icons/ci";
import { IoLocationSharp } from "react-icons/io5";
import { MdOutlineWatchLater } from "react-icons/md";
import { FaCar, FaHome, FaEdit } from "react-icons/fa";
import { useState, useEffect } from 'react';
import CabOverview from '@/components/rbCabs/CabOverview';
import { apiClient } from '@/app/lib/apiClient';
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { setPage, reset, setCabId } from '@/redux/features/rbCabMainSlice';
import { useRouter } from "next/navigation";
// import DriverSelectionModal from "../DriverSelectionModal/DriverSelectionModal";
import DriverSelectionModal from "../../../../../components/DriverSelectionModal/DriverSelectionModal";
import { LuDownload } from "react-icons/lu";
import jsPDF from "jspdf";


const formatDate = (isoString) => {
  if (!isoString) return "N/A";
  const d = new Date(isoString);
  return d.toLocaleString("en-IN");
};




const Page = ({ setActiveComponent }) => {
    const [activeFilter, setActiveFilter] = useState("cabs"); // "cabs" | "cities" | "others"

    const [isActive, setIsActive] = useState("all");
    const [cabType, setCabType] = useState('all');
    const [cityName, setCityName] = useState(null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cabCount, setCabCount] = useState(0);
    const [miniCabCount, setMiniCabCount] = useState(0);
    const [suvCabCount, setSuvCabCount] = useState(0);
    const [sedanCabCount, setSedanCabCount] = useState(0);
    const [totalCab, setTotalCab] = useState(0);
    const [inCabCount, setInCabCount] = useState(0);
    const [inMiniCabCount, setInMiniCabCount] = useState(0);
    const [inSuvCabCount, setInSuvCabCount] = useState(0);
    const [inSedanCabCount, setInSedanCabCount] = useState(0);
    const [showCabOverview, setShowCabOverview] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCabId, setSelectedCabId] = useState("");
    const [localCount, setLocalCount] = useState(0);
    const [intracityCount, setIntracityCount] = useState(0);
    const [localminiCount, setLocalMiniCount] = useState(0);
    const [localsedanCount, setLocalsedanCount] = useState(0);
    const [localsuvCount, setLocalsuvCount] = useState(0);
    const [intracityminiCount, setintracityMiniCount] = useState(0);
    const [intracitysedanCount, setintracitysedanCount] = useState(0);
    const [intracitysuvCount, setintracitysuvCount] = useState(0);
    const [leaseCount, setLeaseCount] = useState(0);
    const [leaseSedanCount, setLeaseSedanCount] = useState(0);
    const [leaseSuvCount, setLeaseSUVCount] = useState(0);
    const [leaseMiniCount, setLeaseMiniCount] = useState(0);
    





    const [querry, setQuerry] = useState("");

    const dispatch = useDispatch();
    const page = useSelector((state) => state.rbCabMain.page);
    const router = useRouter();

    const handleChangePage = () => {
        dispatch(reset());
        setTimeout(() => {
            dispatch(setPage("CabOverview"));
        }, 0);
    };

    const fetchSearchData = async (querry = "") => {
        try {
            setLoading(true);
            setError(null);
            const res = await apiClient("POST", 
              // `/rb_cabs/rbCabsSearch`, 
              `/rb_cabs/rbCabsSearchrb-fleet-cab`,
              {
                searchTerm: querry
            }, true);
            if (res.success) {
                setData(res.data);
                setTotalCab(res.data.length);
                setLoading(false);
            }
        } catch (err) {
            setError(err.message);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };
    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await apiClient("GET", `/rb_cabs/getAllCabs`, "", true);
            if (res.success) {
                setData(res.data);
                setTotalCab(res.data.length);
                setLoading(false);
            }
        } catch (err) {
            setError(err.message);
            // setData([]);
            // setTotalCab([]);
            setLoading(false);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchData();
    }, [isActive, cabType, cityName]);

    useEffect(()=>{
        if(querry?.length > 3) {
            setTimeout(()=>{
                fetchSearchData(querry);
            },400)
        } else {
            fetchData();
        }
    },[querry])

    useEffect(() => {
        if (!data || data.length === 0) return;

        setTimeout(() => {
            let activeCount = 0;
            let miniCount = 0;
            let suvCount = 0;
            let sedanCount = 0;
            let inActiveCount = 0;
            let inMiniCount = 0;
            let inSuvCount = 0;
            let inSedanCount = 0;
            let localActiveCount = 0;
            let intracityActiveCount = 0;
            let localminiCount = 0;
            let locaSuvCount = 0;
            let localSedanCount = 0;
            let intracityminiCount = 0;
            let intracitySuvCount = 0;
            let intracitySedanCount = 0;
            let leaseCount = 0;
            let leaseMiniCount = 0;
            let leaseSedanCount = 0;
            let leaseSuvCount = 0;

            data.forEach((details) => {
                if (details?.cab_status?.toLowerCase() === "active") {
                    activeCount++;
                    if (details?.cab_name?.toLowerCase() === "mini") {
                        miniCount++;
                    } else if (details?.cab_name?.toLowerCase() === "suv") {
                        suvCount++;
                    } else {
                        sedanCount++;
                    }
                }
                if(details?.is_local === "yes") {
                    localActiveCount++;
                    if (details?.cab_name?.toLowerCase() === "mini") {
                        localminiCount++;
                    } else if (details?.cab_name?.toLowerCase() === "suv") {
                        locaSuvCount++;
                    } else {
                        localSedanCount++;
                    }
                }
                if(details?.is_intracity === "yes") {
                    intracityActiveCount++;
                    if (details?.cab_name?.toLowerCase() === "mini") {
                        intracityminiCount++;
                    } else if (details?.cab_name?.toLowerCase() === "suv") {
                        intracitySedanCount++;
                    } else {
                        intracitySuvCount++;
                    }
                }
                if (details?.cab_status?.toLowerCase() === "inactive") {
                    inActiveCount++;
                    if (details?.cab_name?.toLowerCase() === "mini") {
                        inMiniCount++;
                    } else if (details?.cab_name?.toLowerCase() === "suv") {
                        inSuvCount++;
                    } else {
                        inSedanCount++;
                    }
                }
                if (details?.cab_service_type?.toLowerCase() === "lease") {
                    leaseCount++;
                    if (details?.cab_name?.toLowerCase() === "mini") {
                        leaseMiniCount++;
                    } else if (details?.cab_name?.toLowerCase() === "suv") {
                        leaseSuvCount++;
                    } else {
                        leaseSedanCount++;
                    }
                }
            });

            setLocalCount(localActiveCount);
            setIntracityCount(intracityActiveCount);
            setLocalMiniCount(localminiCount);
            setLocalsuvCount(locaSuvCount);
            setLocalsedanCount(localSedanCount);
            setintracityMiniCount(intracityminiCount);
            setintracitysedanCount(intracitySedanCount);
            setintracitysuvCount(intracitySuvCount);

            setCabCount(activeCount);
            setMiniCabCount(miniCount);
            setSuvCabCount(suvCount);
            setSedanCabCount(sedanCount);
            setInCabCount(inActiveCount);
            setInMiniCabCount(inMiniCount);
            setInSuvCabCount(inSuvCount);
            setInSedanCabCount(inSedanCount);

            setLeaseCount(leaseCount);
            setLeaseSedanCount(leaseSedanCount);
            setLeaseMiniCount(leaseMiniCount);
            setLeaseSUVCount(leaseSuvCount);
        }, 500);
    }, [data]);



    const downloadExcel = () => {
  if (!data || data.length === 0) {
    alert("No cab data available to download");
    return;
  }

  const rows = data.map(details => ({
    "Cab Number": details?.cab_reg || "",
    "Cab Type": `${details?.cab_name || ""} (${details?.cab_model || ""})`,
    "Driver": details?.cab_driver_details?.driverName || "N/A",
    "Status": details?.cab_status || "",
    // "Local": details?.is_local === "yes" ? "On" : "Off",
    // "Intracity": details?.is_intracity === "yes" ? "On" : "Off",
    "Current City": details?.current_city || "",
    "Today's Drive (km)": details?.cab_gps_details_json?.todaysDrive?.todayKms || 0,
    // "Trip End Time": details?.trip_end_time || ""
  }));

  const header = Object.keys(rows[0]).join(",");
  const body = rows.map(r => Object.values(r).join(",")).join("\n");

  const csvContent = "data:text/csv;charset=utf-8," + header + "\n" + body;

  const link = document.createElement("a");
  link.href = encodeURI(csvContent);
  link.download = "cab_data.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


// const downloadPDF = () => {
//   if (!data || data.length === 0) {
//     alert("No cab data available to download");
//     return;
//   }

//   const doc = new jsPDF("landscape");

//   doc.text("Cab Report", 14, 10);

//   const tableHead = [
//     "Cab Number",
//     "Cab Type",
//     "Driver",
//     "Status",
//     "Current City",
//     "Today's Drive (km)",
//   ];

//   const tableBody = data.map(details => {
//     const todayKm =
//       details?.cab_gps_details_json?.todaysDrive?.todayKms || 0;

//     return {
//       row: [
//         details?.cab_reg || "",
//         `${details?.cab_name || ""} (${details?.cab_model || ""})`,
//         details?.cab_driver_details?.driverName || "N/A",
//         details?.cab_status || "",
//         details?.current_city || "",
//         todayKm,
//       ],
//       isLow: todayKm < 100,
//     };
//   });

//   doc.autoTable({
//     head: [tableHead],
//     body: tableBody.map(r => r.row),
//     startY: 20,
//     didParseCell: function (data) {
//       // 5 = Today's Drive column
//       if (
//         data.column.index === 5 &&
//         tableBody[data.row.index]?.isLow
//       ) {
//         data.cell.styles.textColor = [255, 0, 0]; // RED
//       }
//     },
//   });

//   doc.save("cab_report.pdf");
// };


// const downloadPDF = () => {
//   if (!data || data.length === 0) {
//     alert("No cab data available to download");
//     return;
//   }

//   const doc = new jsPDF("landscape");

//   doc.text("Cab Report", 14, 10);

//   const tableHead = [
//     "Cab Number",
//     "Cab Type",
//     "Driver",
//     "Status",
//     "Current City",
//     "Today's Drive (km)",
//   ];

//   const tableBody = data.map(details => {
//     const todayKm =
//       details?.cab_gps_details_json?.todaysDrive?.todayKms || 0;

//     return [
//       details?.cab_reg || "",
//       `${details?.cab_name || ""} (${details?.cab_model || ""})`,
//       details?.cab_driver_details?.driverName || "N/A",
//       details?.cab_status || "",
//       details?.current_city || "",
//       todayKm,
//     ];
//   });

//   autoTable(doc, {
//     head: [tableHead],
//     body: tableBody,
//     startY: 20,
//     didParseCell: function (data) {
//       // Column index 5 = Today's Drive
//       if (data.column.index === 5 && data.cell.raw < 100) {
//         data.cell.styles.textColor = [255, 0, 0]; // RED
//       }
//     },
//   });

//   doc.save("cab_report.pdf");
// };


    return (
        <div className='w-full overflow-x-hidden'>
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row items-start justify-between gap-4 p-4 w-full max-w-screen-2xl mx-auto ">
                {/* Title Section */}
                <div className="flex gap-2 sm:gap-3 flex-shrink-0">
                    <div className="bg-[#D9D9D9] rounded-lg h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 flex-shrink-0"></div>
                    <div className="flex flex-col">
                        <strong className="text-[#303032] text-lg sm:text-xl lg:text-2xl xl:text-[30px] leading-none">
                            My Cabs
                        </strong>
                        <span className="text-[#303032] text-xs sm:text-sm lg:text-base">
                            Manage your rides and vehicle
                        </span>
                    </div>
                </div>
                {/* Action Buttons */}
                <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-shrink-0 '>
                    {/* Search */}
                    <div className="relative min-w-[200px]">
                        <input
                            type="text"
                            placeholder="Search cabs..."
                            value={querry || ""}
                            onChange={(e)=> setQuerry(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <FiSearch className="absolute left-3 top-2.5 text-gray-500 text-lg" />
                    </div>

                    

                    {/* Add Cab */}
                    <button
                        onClick={() => router.push("/rbFleetManagement/rbCabs/AddCabs")}
                        className='flex items-center justify-center rounded-lg border border-[#2563EB] bg-[linear-gradient(90deg,#2563EB_0%,#153885_100%)] cursor-pointer 
                        hover:opacity-90 hover:shadow-lg transition-all duration-200 py-2 px-4 '>
                        <div className='flex items-center gap-2 text-white'>
                            <FiPlus className='h-5 w-5' />
                            <span className='font-bold text-sm sm:text-base'>Add Cab</span>
                        </div>
                    </button>
                    <button
  onClick={downloadExcel}
//   className="flex items-center justify-center rounded-lg border border-green-600 bg-green-600 text-white py-2 px-4"
  className="flex items-center justify-center rounded-lg border border-green-600 
  bg-green-600 text-white py-2.5 px-4 text-sm gap-2"
>
  Download <LuDownload size={18} />
</button>

                </div>




            </div>

            {/* Middle Section - Status Buttons */}
            <div className="flex flex-nowrap overflow-x-auto rounded-xl border border-gray-300 bg-[#F4F8FD] mx-4 p-2 gap-2 items-center">

                <button
                    onClick={() => {setIsActive(prev => "all");setActiveFilter("cabs"); setCabType("all")}}
                    className={`${isActive === "all" ? "bg-[#FFEDE6] border-[#E9550E]" : "bg-gray-200"} 
            flex gap-2 justify-center items-center rounded-lg border-2 
            py-2 px-4 min-w-[120px]`}
                >
                    <span className="text-xs sm:text-sm text-black font-bold">
                        All Cabs
                    </span>
                    <span className="text-xs sm:text-sm text-black font-bold">
                        {data?.length || 0}
                    </span>
                </button>

                <button
                    onClick={() => {setIsActive(prev => "active");setActiveFilter("cabs"); setCabType("all")}}
                    className={`${isActive === 'active' ? "bg-[#E6FBF0] border-[#14A150]" : "bg-gray-200"} 
            flex gap-2 justify-center items-center rounded-lg border-2 
            py-2 px-4 min-w-[120px]`}
                >
                    <span className="text-xs sm:text-sm text-black font-bold">
                        Active Cabs
                    </span>
                    <span className="text-xs sm:text-sm text-black font-bold">
                        {cabCount}
                    </span>
                </button>

                <button
                    onClick={() => {setIsActive(prev => "inactive");setActiveFilter("cabs"); setCabType("all")}}
                    className={`${isActive === "inactive" ? "bg-[#FFEDE6] border-[#E9550E]" : "bg-gray-200"} 
            flex gap-2 justify-center items-center rounded-lg border-2 
            py-2 px-4 min-w-[120px]`}
                >
                    <span className="text-xs sm:text-sm text-black font-bold">
                        Inactive Cabs
                    </span>
                    <span className="text-xs sm:text-sm text-black font-bold">
                        {inCabCount}
                    </span>
                </button>
                <div className="bg-[#D9D9D9] h-6 w-[1px] flex-shrink-0"></div>

                {/* Cab Type Filters */}
                {activeFilter === "cabs" && ["mini", "suv", "sedan"].map((type) => (
                    <React.Fragment key={type}>
                        <button
                            onClick={() => setCabType(type)}
                            disabled={cabType === type}
                            className={`flex items-center rounded-xl border gap-2 px-3 py-2 font-medium transition-all duration-300 min-w-max flex-1
                                ${cabType === type
                                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 border-purple-700 text-white shadow-lg"
                                    : "bg-white border-gray-300 text-gray-800 hover:bg-gray-100"
                                }
                         `}
                        >
                            <FaCar className="h-4 w-4 flex-shrink-0" />
                            <span className="text-xs sm:text-sm capitalize">{type}</span>
                            <span
                                className={`text-xs font-semibold px-2 py-[2px] rounded-full flex-shrink-0 ${cabType === type
                                    ? "bg-white text-purple-700"
                                    : "bg-gray-300 text-gray-800"
                                    }`}
                            >
                                {isActive === 'all'
                                 ? (type === "mini" ? miniCabCount+inMiniCabCount : type === "suv" ? suvCabCount+inSuvCabCount : sedanCabCount+inSedanCabCount)
                                 : isActive === 'active'
                                    ? (type === "mini" ? miniCabCount : type === "suv" ? suvCabCount : sedanCabCount)
                                    : (type === "mini" ? inMiniCabCount : type === "suv" ? inSuvCabCount : inSedanCabCount)
                                }
                            </span>
                        </button>
                        <div className="bg-[#D9D9D9] h-6 w-[1px] flex-shrink-0"></div>
                    </React.Fragment>
                ))}
            </div>

            {/* Filter Section */}
            <div className='flex flex-nowrap overflow-x-auto rounded-xl border border-gray-300 bg-[#F4F8FD] mx-4 p-2 gap-2 items-center'>
                <button
                    onClick={() => {activeFilter!=="local"?setActiveFilter("local"):setActiveFilter("");setCabType("all")}}
                    // disabled={cabType === "all"}
                    className={`flex items-center rounded-xl border gap-2 px-3 py-2 font-medium transition-all duration-300 justify-center min-w-max flex-1
                            bg-gradient-to-r from-indigo-700 to-purple-600 border-purple-500 text-white shadow-lg
                    `}
                >
                    <div
                        className={`h-2.5 w-2.5 rounded-full flex-shrink-0 bg-white`}
                    />
                    <span className="text-xs sm:text-sm whitespace-nowrap">Local Cabs</span>
                    <span
                        className={`text-xs font-semibold px-2 py-[2px] rounded-full flex-shrink-0 ${cabType === "all" && activeFilter=== 'local'
                            ? "bg-white text-purple-700"
                            : "bg-gray-300 text-gray-800"
                            }`}
                    >
                        {localCount}
                    </span>
                </button>

                <div className="bg-[#D9D9D9] h-6 w-[1px] flex-shrink-0"></div>

                {/* Cab Type Filters */}
                {activeFilter === "local" && ["mini", "suv", "sedan"].map((type) => (
                    <React.Fragment key={type}>
                        <button
                            onClick={() => setCabType(type)}
                            disabled={cabType === type}
                            className={`flex items-center rounded-xl border gap-2 px-3 py-2 font-medium transition-all duration-300 min-w-max flex-1
                                ${cabType === type
                                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 border-purple-700 text-white shadow-lg"
                                    : "bg-white border-gray-300 text-gray-800 hover:bg-gray-100"
                                }
                         `}
                        >
                            <FaCar className="h-4 w-4 flex-shrink-0" />
                            <span className="text-xs sm:text-sm capitalize">{type}</span>
                            <span
                                className={`text-xs font-semibold px-2 py-[2px] rounded-full flex-shrink-0 ${cabType === type
                                    ? "bg-white text-purple-700"
                                    : "bg-gray-300 text-gray-800"
                                    }`}
                            >
                                {(type === "mini" ? localminiCount : type === "suv" ? localsuvCount : localsedanCount)}
                            </span>
                        </button>
                        <div className="bg-[#D9D9D9] h-6 w-[1px] flex-shrink-0"></div>
                    </React.Fragment>
                ))}
                <button
                    onClick={() => {activeFilter!=="intraCity"? setActiveFilter("intraCity"):setActiveFilter("");setCabType("all")}}
                    // disabled={cabType === "all"}
                    className={`flex items-center rounded-xl border gap-2 px-3 py-2 font-medium transition-all duration-300 justify-center min-w-max flex-1
                            bg-gradient-to-r from-indigo-700 to-purple-600 border-purple-500 text-white shadow-lg
                    `}
                >
                    <div
                        className={`h-2.5 w-2.5 rounded-full flex-shrink-0 bg-white`}
                    />
                    <span className="text-xs sm:text-sm whitespace-nowrap">Intracity Cabs</span>
                    <span
                        className={`text-xs font-semibold px-2 py-[2px] rounded-full flex-shrink-0 ${cabType === "all" && activeFilter=== 'intraCity'
                            ? "bg-white text-purple-700"
                            : "bg-gray-300 text-gray-800"
                            }`}
                    >
                        {intracityCount}
                    </span>
                </button>

                <div className="bg-[#D9D9D9] h-6 w-[1px] flex-shrink-0"></div>

                {/* Cab Type Filters */}
                {activeFilter === "intraCity" && ["mini", "suv", "sedan"].map((type) => (
                    <React.Fragment key={type}>
                        <button
                            onClick={() => setCabType(type)}
                            disabled={cabType === type}
                            className={`flex items-center rounded-xl border gap-2 px-3 py-2 font-medium transition-all duration-300 min-w-max flex-1
                                ${cabType === type
                                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 border-purple-700 text-white shadow-lg"
                                    : "bg-white border-gray-300 text-gray-800 hover:bg-gray-100"
                                }
                         `}
                        >
                            <FaCar className="h-4 w-4 flex-shrink-0" />
                            <span className="text-xs sm:text-sm capitalize">{type}</span>
                            <span
                                className={`text-xs font-semibold px-2 py-[2px] rounded-full flex-shrink-0 ${cabType === type
                                    ? "bg-white text-purple-700"
                                    : "bg-gray-300 text-gray-800"
                                    }`}
                            >
                                {(type === "mini" ? intracityminiCount : type === "suv" ? intracitysuvCount : intracitysedanCount)}
                            </span>
                        </button>
                        <div className="bg-[#D9D9D9] h-6 w-[1px] flex-shrink-0"></div>
                    </React.Fragment>
                ))}

                <button
                    onClick={() => {activeFilter!=="lease"? setActiveFilter("lease"): setActiveFilter(""); setCabType("all")}}
                    // disabled={cabType === "all"}
                    className={`flex items-center rounded-xl border gap-2 px-3 py-2 font-medium transition-all duration-300 justify-center min-w-max flex-1
                    
                            bg-gradient-to-r from-indigo-700 to-purple-600 border-purple-500 text-white shadow-lg
                    `}
                >
                    <div
                        className={`h-2.5 w-2.5 rounded-full flex-shrink-0 bg-white`}
                    />
                    <span className="text-xs sm:text-sm whitespace-nowrap">Lease Cabs</span>
                    <span
                        className={`text-xs font-semibold px-2 py-[2px] rounded-full flex-shrink-0 ${cabType === "all" && activeFilter=== 'lease'
                            ? "bg-white text-purple-700"
                            : "bg-gray-300 text-gray-800"
                            }`}
                    >
                        {leaseCount}
                    </span>
                </button>

                <div className="bg-[#D9D9D9] h-6 w-[1px] flex-shrink-0"></div>

                {/* Cab Type Filters */}
                {activeFilter === "lease" && ["mini", "suv", "sedan"].map((type) => (
                    <React.Fragment key={type}>
                        <button
                            onClick={() => setCabType(type)}
                            disabled={cabType === type}
                            className={`flex items-center rounded-xl border gap-2 px-3 py-2 font-medium transition-all duration-300 min-w-max flex-1
                                ${cabType === type
                                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 border-purple-700 text-white shadow-lg"
                                    : "bg-white border-gray-300 text-gray-800 hover:bg-gray-100"
                                }
                         `}
                        >
                            <FaCar className="h-4 w-4 flex-shrink-0" />
                            <span className="text-xs sm:text-sm capitalize">{type}</span>
                            <span
                                className={`text-xs font-semibold px-2 py-[2px] rounded-full flex-shrink-0 ${cabType === type
                                    ? "bg-white text-purple-700"
                                    : "bg-gray-300 text-gray-800"
                                    }`}
                            >
                                {(type === "mini" ? leaseMiniCount : type === "suv" ? leaseSuvCount : leaseSedanCount)}
                            </span>
                        </button>
                        <div className="bg-[#D9D9D9] h-6 w-[1px] flex-shrink-0"></div>
                    </React.Fragment>
                ))}
            </div>

            {/* Cab Cards Grid */}
            {loading ? (
                <div
                    role="status"
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 w-full"
                >
                    {[...Array(8)].map((_, i) => (
                        <div
                            key={i}
                            className="p-4 bg-white rounded-xl shadow-md border flex flex-col animate-pulse"
                        >
                            {/* Top Section */}
                            <div className="flex items-start justify-between">
                                <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                                <div className="w-16 h-6 bg-gray-300 rounded-full"></div>
                            </div>

                            {/* Content Placeholders */}
                            <div className="mt-3 h-4 bg-gray-300 rounded w-3/4"></div>
                            <div className="mt-2 h-3 bg-gray-300 rounded w-1/2"></div>
                            <div className="mt-2 h-3 bg-gray-300 rounded w-2/3"></div>
                            <div className="mt-4 h-8 bg-gray-300 rounded-lg w-1/2"></div>

                            {/* Location & Time */}
                            <div className="mt-3 flex items-center space-x-2">
                                <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                            </div>
                            <div className="mt-2 flex items-center space-x-2">
                                <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                                <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                            </div>
                        </div>
                    ))}
                    <span className="sr-only">Loading...</span>
                </div>
            ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4'>
                    {data?.filter(details =>
                        ((isActive!=="all" && details?.cab_status?.toLowerCase() === isActive) ||
                            (isActive === "all")) &&
                        (
                            ((activeFilter !== "local" && activeFilter !== "intraCity") &&(cabType === "all" || cabType === details?.cab_name?.toLowerCase())) ||
                            (activeFilter === "local" && (cabType === "all" || cabType === details?.cab_name?.toLowerCase()) && details?.is_local?.toLowerCase() === "yes") ||
                            (activeFilter === "intraCity" && (cabType === "all" || cabType === details?.cab_name?.toLowerCase()) && details?.is_intracity?.toLowerCase() === "yes") ||
                            (activeFilter === "status" && (cabType === "all" || cabType === details?.cab_name?.toLowerCase()) && details?.cab_service_type?.toLowerCase() === "lease")
                        )
                    ).map((details, index) => (
                        <div key={index} className='relative group transition-all duration-300 hover:scale-[1.02] bg-white rounded-lg shadow-sm border border-[#E5E7EB] overflow-hidden p-2'>
                            <div className="flex flex-col">
                                <div className="flex justify-between bg-[url('/images/rbDriverBg.png')] bg-cover bg-center items-center p-4">
                                    {/* Car Image + Status */}
                                    <div className="relative">
                                        <div
                                            className="border border-[#0F913F] bg-cover bg-center h-16 w-16 rounded-full"
                                            style={{ backgroundImage: "url('/images/rbDriverCar.png')" }}
                                        />
                                        <div className="absolute -top-[10px] left-1/2 -translate-x-1/2 flex gap-1 border border-[#0F913F] rounded-full px-2 bg-white">
                                            <div className={`rounded-full h-2 w-2 my-auto ${details?.cab_status === 'active' ?"bg-[#0F913F]": "bg-red-500"}`} />
                                            <span
                                                className={`text-xs ${details?.cab_status === 'active' ? 'text-[#0F913F]' : 'text-red-500'}`}
                                            >
                                                {details?.cab_status === 'active' ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Driver Info */}
                                    <div className="flex flex-col items-end justify-end">
                                        <strong className="font-bold text-sm text-[#353535]">{details?.cab_reg}</strong>
                                        <span className="text-[#353535] text-sm"> {details?.cab_name} ({details?.cab_model})</span>
                                        <div className="flex items-start gap-1">
                                            <Image src="/images/string.svg" alt="String Icon" width={16} height={16} />
                                            <span className="text-[#353535] text-sm">{details?.cab_driver_details?.driverName ? details?.cab_driver_details?.driverName : "N/A"}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <div className='w-1/2 rounded-lg bg-[linear-gradient(90deg,_#005FE2_0%,_#00347C_100%)] px-3 py-1 text-center'>
                                        <p className="text-white text-xs font-bold capitalize px-2 py-1 text-center">{details?.ride_status}</p>
                                    </div>
                                </div>
                                {/* Location & Time */}
                                <div className="flex flex-col items-start p-4 gap-2">
                                    <div className="flex gap-2 items-center text-gray-700">
                                        <IoLocationSharp className="text-[#F80000] text-sm" />
                                        <span className="font-bold text-sm">Local: {details?.is_local === "yes"? "On": "Off"}</span>
                                    </div>
                                    <div className="flex gap-2 items-center text-gray-700">
                                        <IoLocationSharp className="text-[#F80000] text-sm" />
                                        <span className="font-bold text-sm">Intracity: {details?.is_intracity === "yes"? "On": "Off"}</span>
                                    </div>
                                    <div className="flex gap-2 items-center text-gray-700">
                                        <IoLocationSharp className="text-[#F80000] text-sm" />
                                        <span className="font-bold text-sm">{details?.current_city}</span>
                                    </div>
                                    <div className="flex gap-2 items-center text-gray-700">
  <FaCar className="text-sm" />
  {/* <span className="font-bold text-sm">
    Today&apos;s Drive: {details?.cab_gps_details_json?.todaysDrive?.todayKms || 0} km
  </span> */}
  <span
  className={`font-bold text-sm ${
    (details?.cab_gps_details_json?.todaysDrive?.todayKms || 0) < 100
      ? "text-red-600"
      : "text-green-600"
  }`}
>
  Today&apos;s Driver:{" "}
  {details?.cab_gps_details_json?.todaysDrive?.todayKms || 0} km
</span>

</div>

                                    {/* <div className="flex gap-2 items-center">
                                        <MdOutlineWatchLater className="text-sm" />
                                        <span className="font-bold text-sm text-[#005FE2]">NextAvailable from {details?.json_cab_avability_details?.Next_avilable_time}</span>
                                    </div> */}
                                    {/* <div className="flex gap-2 items-center">
  <MdOutlineWatchLater className="text-sm" />

  <span className="font-bold text-sm text-[#005FE2]">
    {details?.trip_end_time === null 
      ? `NextAvailable from ${details?.json_cab_avability_details?.Next_avilable_time}` 
      : `Trip  ${formatDate(details?.trip_end_time)}`}
  </span>
</div> */}

<div className="flex gap-2 items-center">
  <MdOutlineWatchLater className="text-sm" />
  <span className="font-bold text-sm text-[#005FE2]">
    Next available from {details?.json_cab_avability_details?.Next_avilable_time}
  </span>
</div>


                                </div>
                            </div>
                            <div className={'flex gap-2 w-full '+ `${!details?.cab_driver_details? "justify-between": "justify-end"}`}>
                                {!details?.cab_driver_details && 
                                <button
                                    className="text-orange-500 text-xs font-semibold rounded-xl flex items-center gap-1 justify-center"
                                    onClick={() => {setModalOpen(true); setSelectedCabId(details?.id)}}
                                >
                                    <span className="text-[14px] ">{"Assign Driver"}</span>
                                    <FaEdit className="text-[12px] h-4 w-4" />
                                </button>}

                                <button key={index}
                                    onClick={() => {
                                        dispatch(setCabId(details?.id));
                                        router.push(`/rbFleetManagement/rbCabs/CabOverView/${details?.id}`)
                                    }}
                                    className="text-right text-blue-600 hover:underline"
                                > view details</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <DriverSelectionModal
                open={modalOpen}
                title={"Assign Driver"}
                id={selectedCabId}
                onClose={() => setModalOpen(false)}
                onConfirm={() => {
                    fetchData();
                }}
            />
        </div>
    )
}

export default Page