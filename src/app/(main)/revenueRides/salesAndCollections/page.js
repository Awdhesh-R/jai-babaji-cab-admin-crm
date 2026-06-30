
"use client";
import React, { useMemo } from "react";

import { useState } from "react";
import { BsCashStack } from "react-icons/bs";
import { AiOutlineFileText } from "react-icons/ai";
import { CiSearch } from "react-icons/ci";
import { FaCarSide } from "react-icons/fa";
import { useRouter } from "next/navigation";
import DateRangePicker from "@/components/common/DateRange";
import moment from "moment";
import { useCallback, useEffect, useRef } from "react";
import { apiClient } from "@/app/lib/apiClient";
import CustomLoader from "@/components/common/CustomLoader";
import Link from "next/link";
import debounce from "lodash.debounce";

function getCollectionTypeClasses(type) {
  switch (type.toLowerCase()) {
    case "final fare":
      return "border-[#15803D33] text-[#15803D]";
    case "user advance":
      return "border-[#84CC1633] text-[#84CC16]";
    // case "rodbez fee":
    //   return "border-blue-400 text-blue-600";
    // case "driver due":
    //   return "border-orange-400 text-orange-600";
    // case "fare collection":
    //   return "border-purple-400 text-purple-600";
    // case "operator due":
    //   return "border-pink-400 text-pink-600";
    default:
      return "border-gray-300 text-gray-600";
  }
}


function formatAmount(num) {
  if (!num && num !== 0) return "";
  if (num >= 10000000) return (num / 10000000).toFixed(2) + " Cr";
  if (num >= 100000) return (num / 100000).toFixed(2) + " L";
  return Number(num).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  });
}

// Card component
const RevenueCard = ({ amount, label, gradient, textColor }) => {
  const [hovered, setHovered] = React.useState(false);

  const compactAmount = formatAmount(amount);
  const fullAmount = Number(amount).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  });

  return (
    <div
      className="relative rounded-2xl shadow-md border border-gray-200 p-4 flex flex-col justify-center items-center transition-all hover:scale-105 flex-grow flex-shrink basis-[220px]"
      style={{
        background: gradient,
        minWidth: "220px",
        minHeight: "180px",
        opacity: 0.9,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="absolute rounded-xl"
        style={{
          width: "70%",
          height: "80%",
          right: "-15%",
          top: "-10%",
          background: "rgba(255,255,255,0.18)",
          transform: "rotate(150deg)",
          pointerEvents: "none",
          zIndex: 0,
          opacity: 0.5,
        }}
      />
      <div className="relative z-10 text-center" style={{ width: "100%" }}>
        <div style={{ position: "relative", display: "inline-block", width: "100%" }}>
          <p
            className={`text-base md:text-2xl lg:text-4xl font-bold font-nunito ${textColor}`}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "95%",
              margin: "0 auto",
              cursor: "pointer",
            }}
            title={fullAmount} // native tooltip on hover
          >
            ₹{hovered ? fullAmount : compactAmount}
          </p>
        </div>
        <p className="text-[10px] md:text-lg font-nunito text-gray-700 mt-1 font-medium">
          {label}
        </p>
      </div>
    </div>
  );
};

const CollectionCard = ({ amount, label, gradient, textColor }) => {
  const [hovered, setHovered] = React.useState(false);

  // Compact for card: lakh/crore/normal
  const compactAmount = formatAmount(amount);

  // Full for hover/tooltip: full value commas
  const fullAmount =
    amount !== null && amount !== undefined && !isNaN(Number(amount))
      ? Number(amount).toLocaleString("en-IN", {
          maximumFractionDigits: 2,
          minimumFractionDigits: 0,
        })
      : "-";

  return (
    <div
      className={`relative rounded-2xl shadow-md border border-gray-200 p-4 flex flex-col justify-center items-center transition-all hover:scale-105 flex-grow flex-shrink basis-[120px]`}
      style={{
        background: gradient,
        minWidth: "120px",
        minHeight: "180px",
        opacity: 0.9,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* overlay */}
      <div
        className="absolute rounded-xl"
        style={{
          width: "70%",
          height: "80%",
          right: "-15%",
          top: "-10%",
          background: "rgba(255,255,255,0.18)",
          transform: "rotate(150deg)",
          pointerEvents: "none",
          zIndex: 0,
          opacity: 0.5,
        }}
      />
      <div className="relative z-10 w-full text-center">
        <div className="w-full flex justify-center">
          <p
            className={`text-base md:text-2xl lg:text-4xl font-bold font-nunito ${textColor}`}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "95%",
              margin: "0 auto",
              cursor: "pointer",
            }}
            title={fullAmount}
          >
            ₹{hovered ? fullAmount : compactAmount}
          </p>
        </div>
        <p className="text-[12px] md:text-lg font-nunito text-gray-700 mt-2 font-medium">
          {label}
        </p>
      </div>
    </div>
  );
};


function getPaymentModeClasses(mode) {
  switch (mode.toLowerCase()) {
    case "upi":
      return "bg-[#15803D1A] text-[#15803D]";
    case "cash":
      return "bg-[#FFEDD4] text-[#CA3500]";
    case "online":
      return "bg-[#84CC161A] text-[#84CC16]";
    default:
      return "bg-gray-100 text-gray-600";
  }
}


function downloadCSV(data) {
  if (!data || data.length === 0) {
    alert("No data to download");
    return;
  }

  const headers = [
    "Invoice ID",
    "Ride ID",
    "Invoice Type",
    "Date",
    "HSN Code",
    "Amount",
    "SGST",
    "CGST",
    "IGST",
    "Total Payout",
  ];

  // const rows = data.map((item) => [
  //   item.invoice_id || "",
  //   item.ride_id || "",
  //   item.invoice_type
  //     ? item.invoice_type.split("_").join(" ")
  //     : "",
  //   item.invoice_generate_date
  //     ? moment(item.invoice_generate_date).format("DD/MM/YYYY")
  //     : "",
  //   item.hsn_code || "",
  //   item.taxableValue || 0,
  //   item.sgst || 0,
  //   item.cgst || 0,
  //   item.igst || 0,
  //   item.total_payable_amount || 0,
  // ]);


const rows = data.map((item) => [
  item.invoice_id ? `'${item.invoice_id}` : "",
  item.ride_id ? `'${item.ride_id}` : "",
  item.invoice_type
    ? item.invoice_type.split("_").join(" ")
    : "",
  item.invoice_generate_date
    ? moment(item.invoice_generate_date).format("DD/MM/YYYY")
    : "",
  item.hsn_code ? `${item.hsn_code}` : "",
  item.taxableValue || 0,
  item.sgst || 0,
  item.cgst || 0,
  item.igst || 0,
  item.total_payable_amount || 0,
]);


  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers, ...rows].map((e) => e.join(",")).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "sales_invoice.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
   

export default function SalesAndCollectionMonitor() {
  const router = useRouter();

  const [view, setView] = useState("sales"); // default to collections

  const [show, setShow] = useState(false);
  const [nameSearch, setNameSearch] = useState("");
  const [cabSearch, setCabSearch] = useState("");
  const [searchRideId, setSearchRideId] = useState("");
  const [invoicesList, setInvoiceList] = useState([]);
  const [dateFilter, setDateFilter] = useState({
    startDate: null,
    endDate: null,
  });

   const [selectedDriverId, setSelectedDriverId] = useState([]);

  

  const filteredData = [];
  const filteredInvoiceData = [].filter((item) => {
    // Date filter
    if (dateFilter.startDate && dateFilter.endDate) {
      const itemDate = new Date(item.date);
      const start = new Date(dateFilter.startDate);
      const end = new Date(dateFilter.endDate);
      if (itemDate < start || itemDate > end) return false; // Date filter ke bahar
    }
    // Search filter
    if (
      searchRideId &&
      item.ride_id.toLowerCase().indexOf(searchRideId.toLowerCase()) === -1
    ) {
      return false;
    }
    return true;
  });

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [loading, setLoading] = useState(false);
  const [invoiceDetails, setInvoiceDetails] = useState();
  const [searchURID, setSearchURID] = useState("");
  const [querry, setQuerry] = useState("");
  const observerRef = useRef();
   const [data, setData] = useState("");
    const [fleetFilter, setFleetFilter] = useState("Rodbez");

  const filterInvoiceList = invoicesList;

  const debouncedSearch = useMemo(() => debounce(async (querry) => {
    // if(!querry.trim()) return;
    setQuerry(prev=> querry);
  }, 100), [])

  const searchRide = useCallback(
      (querry) => debouncedSearch(querry),
      [debouncedSearch]
  );
  useEffect(()=>{
    searchRide(searchURID);
  }, [searchURID, searchRide]);

  const fetchInvoices =
    async (pageNo) => {
      try {
        setLoading(true);
        console.log(selectedDriverId, "driver ids")
        const params = {
          page: pageNo,
          startsAt: dateFilter.startDate
            ? moment(dateFilter.startDate).format()
            : null,
          endsAt: dateFilter.endDate
            ? moment(dateFilter.endDate)
                .add(23, "hours")
                .add(59, "minutes")
                .add(59, "seconds")
                .format()
            : null,
          limit: 100,
          ride_id: querry,
          driver_id: selectedDriverId?.length > 0? selectedDriverId?.join(","): null
        };
        const response = await apiClient(
          "GET",
          "/ride_management/rides-revenue",
          params
        );
        if (response.status || response.success) {
          setInvoiceDetails(response.data.meta);
          console.log(response);
          const temppArr = response.data.data;
          if (pageNo === 1) {
            setHasMore(prev => true);
            setInvoiceList(temppArr);
          } else {
            if (temppArr?.length > 0) {
              setHasMore(prev => true);
              setInvoiceList((prev) => [...prev, ...temppArr]);
            } else {
              setHasMore(false);
            }
          }
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    }

  const lastCardRef = useCallback(
    (node) => {
      if (!hasMore) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [hasMore]
  );

  useEffect(() => {
    if (!hasMore && page > 1) return;
    setLoading(true);
    if (page === 1) {
      setInvoiceList([]);
    }
    fetchInvoices(page).finally(() => setLoading(false));
  }, [page, hasMore]);

  useEffect(() => {
    fetchInvoices(1).finally(() => setLoading(false));
  }, [dateFilter.startDate, dateFilter.endDate, querry]);

    const toggleBtnClass = (selected, val) =>
    `px-2 py-1 rounded-full text-xs sm:text-sm font-medium border transition ${
      selected === val
        ? "bg-gradient-to-r from-[#15803D] to-[#81CA18] text-white border-none"
        : "bg-white border border-gray-300 text-gray-700"
    }`;


      // const filterInvoiceList = invoicesList.filter((invoice) =>
      //   invoice?.ride_id
      //     ?.toString()
      //     .toLowerCase()
      //     .includes(searchURID.toLowerCase())
      // );
    
      const [RodbezDrivers, setRodbezDrivers] = useState([]);
      const [marketDrivers, setMarketDrivers] = useState([]);
    
      // Fetch Rodbez drivers
      const fetchRodbezDrivers = useCallback(async () => {
        setLoading(true);
        try {
          const response = await apiClient("GET", "/rb_drivers/getAllDriver", {});
          if (response.status || response.success) {
            setRodbezDrivers(response.data.data || response.data || []);
          }
        } catch (error) {
          console.error("Error fetching Rodbez drivers:", error);
        } finally {
          setLoading(false);
        }
      }, []);
    
      // Fetch Market drivers
      const fetchMarketDrivers = useCallback(async () => {
        setLoading(true);
        try {
          const response = await apiClient(
            "GET",
            "/fleet/getAllFeetlOperatorList",
            {}
          );
          if (response.status || response.success) {
            setMarketDrivers(response.data.data || response.data || []);
          }
        } catch (error) {
          console.error("Error fetching Operator drivers:", error);
        } finally {
          setLoading(false);
        }
      }, []);
    
      // When show popup is true, fetch both drivers
      useEffect(() => {
        if (show) {
          fetchRodbezDrivers();
          fetchMarketDrivers();
        }
      }, [show, fetchRodbezDrivers, fetchMarketDrivers]);
    
      // Map Rodbez drivers to uniform format
      const mappedRodbez = RodbezDrivers.map((d) => ({
        driverId: d.id,
        driverName: d.driverName,
        driverMobile: d.driverMobile || "N/A",
        fleetType: "Rodbez",
      }));
    
      // Map Market drivers to uniform format
      const mappedMarket = marketDrivers.map((d) => ({
        driverId: d.id,
        driverName: d.full_name || d.driverName || "Unknown",
        driverMobile: d.mobile_no || "N/A",
        fleetType: "Operator",
      }));
    
      // Combine based on fleet filter
      const combinedDrivers =
        fleetFilter === "Rodbez"
          ? mappedRodbez
          : fleetFilter === "Operator"
          ? mappedMarket
          : [...mappedRodbez, ...mappedMarket];
    
      // Filter combined drivers by search fields
      const displayData = combinedDrivers.filter(
        (d) =>
          d.driverName.toLowerCase().includes(nameSearch.toLowerCase()) &&
          d.driverMobile.toLowerCase().includes(cabSearch.toLowerCase())
      );


   
 useEffect(() => {
  const fetchCollectionRevenue = async () => {
    setLoading(true);
try {
  const response = await apiClient("GET", "/ride_management/collection-revenue");
  console.log("Response", response);
  setData(response.data);
} catch (error) {
  console.error("Error fetching collection revenue", error.response || error.message || error);
} finally {
      setLoading(false);
    }
  };

  fetchCollectionRevenue();
}, []);

  const handleDriverSelect = (d) => {

    let tempArr = (selectedDriverId && selectedDriverId.length > 0) ? [...selectedDriverId] : [];
    const index = tempArr.indexOf(d.driverId);
    if (index > -1) {
      tempArr = tempArr.filter((id) => id !== d.driverId);
    } else {
      tempArr.push(d.driverId);
    }
    setSelectedDriverId(prev => tempArr);
    console.log(selectedDriverId, "driver ids", tempArr);
  }

const summaryData = data ?[

] : [];


  return (
    // <div className="bg-green-50 min-h-screen p-6">
    <div className="bg-[#f6fcff]  min-h-screen  px-2 ">
      <div className="flex space-x-2 py-2 md:py-2 mb-6  mx-auto">
        <button
          className={`md:px-4 md:py-2 px-2 py-2 rounded-2xl font-medium border ${
            view === "sales"
              ? "bg-gradient-to-r from-[#15803D] to-[#81CA18] text-white border-0"
              : "bg-white text-green-600 border-green-300"
          }`}
          onClick={() => setView("sales")}
        >
          <span className="flex font-nunito md:text-base text-[14px] items-center md:gap-2 gap-1">
            <AiOutlineFileText />
            Sales Invoice
          </span>
        </button>

        <button
          className={`md:px-4 md:py-2 rounded-2xl font-medium border
    px-2 py-1
    ${
      view === "collections"
        ? "bg-gradient-to-r from-[#15803D] to-[#81CA18] text-white border-0"
        : "bg-white text-green-600 border-green-300"
    }`}
          onClick={() => setView("collections")}
        >
          <span className="flex font-nunito md:text-base text-[14px] items-center gap-2 sm:gap-1 sm:text-xs">
            <BsCashStack className="md:text-base" />
            Collections
          </span>
        </button>
      </div>

      {/* Conditional rendering */}
      {view === "collections" && (
        <>
          <div className="bg-white rounded-lg shadow-md p-6 mt-4  mx-auto w-full">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <div className="w-1 h-3 sm:h-6 rounded-md bg-green-700 mr-2 sm:mr-3"></div>
                <h2 className=" text-[16px] md:text-2xl font-bold font-nunito bg-gradient-to-r from-[#15803D] to-[#81CA18] bg-clip-text text-transparent">
                  Collections
                </h2>
              </div>

              <div>
                <button
                  className="bg-gradient-to-r from-[#15803D] to-[#81CA18] font-nunito text-white px-2 md:px-4 py-1 md:py-2 rounded-2xl font-medium shadow flex items-center text-[10px] sm:text-base"
                  onClick={() => setShow(true)}
                >
                  Drivers Dues
                </button>

                {show && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-lg w-[95vw] max-w-[340px] sm:max-w-[650px] h-[330px] sm:h-[500px]">
                      <div className="flex items-center justify-between px-3 pt-4 pb-2 sm:px-6 sm:pt-6 sm:pb-3">
                        <span className="font-bold text-base sm:text-lg">
                          <span className=" font-nunito bg-gradient-to-r from-[#15803D] to-[#81CA18] bg-clip-text text-transparent">
                            Driver Dues
                          </span>
                        </span>
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg p-[2px] bg-gradient-to-r from-[#15803D] to-[#81CA18] shadow">
                          <button
                            className="w-full h-full flex items-center justify-center rounded-lg text-green-700 hover:bg-gray-200 text-base sm:text-xl bg-white"
                            onClick={() => setShow(false)}
                            aria-label="Close"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                      <div className="flex gap-2 sm:gap-3 px-3 pb-2 sm:px-6 sm:pb-4">
                        <div className="relative w-1/2">
                          <CiSearch className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-base sm:text-xl" />
                          <input
                            type="text"
                            placeholder="Search by Name"
                            value={nameSearch}
                            onChange={(e) => setNameSearch(e.target.value)}
                            className="w-full border-gray-300 rounded-lg pl-8 sm:pl-10 pr-2 sm:pr-3 py-1 sm:py-1.5 shadow-sm outline-none text-xs sm:text-base"
                          />
                        </div>
                        <div className="relative w-1/2">
                          <FaCarSide className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm sm:text-lg" />
                          <input
                            type="text"
                            placeholder="Search by Cab No."
                            value={cabSearch}
                            onChange={(e) => setCabSearch(e.target.value)}
                            className="w-full border-gray-300 rounded-lg pl-8 sm:pl-10 pr-2 sm:pr-3 py-1 sm:py-1.5 shadow-sm outline-none text-xs sm:text-base"
                          />
                        </div>
                      </div>
                      <div
                        className="px-3 pb-3 sm:px-6 sm:pb-6 overflow-x-auto max-h-[180px] sm:max-h-[340px] overflow-y-auto scroll-smooth scrollbar-hide"
                        style={{
                          scrollbarWidth: "none",
                          msOverflowStyle: "none",
                        }}
                      >
                        <table className="w-full text-xs sm:text-sm border-separate [border-spacing:0]">
                          <thead className="sticky top-0 bg-gradient-to-r from-[#18A83E] to-[#B6F162] z-10">
                            <tr>
                              <th className="text-left text-white px-2 py-1 sm:px-3 sm:py-2 rounded-tl-xl font-normal text-xs sm:text-sm">
                                Driver Name
                              </th>
                              <th className="text-left text-white px-2 py-1 sm:px-3 sm:py-2 font-normal text-xs sm:text-sm">
                                Cab Number
                              </th>
                              <th className="text-left text-white px-2 py-1 sm:px-3 sm:py-2 rounded-tr-xl font-normal text-xs sm:text-sm">
                                Cab Type
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredData.map((d, i) => (
                              <tr
                                key={i}
                                className="border-b last:border-0 cursor-pointer hover:bg-gray-200 transition"
                                onClick={() =>
                                  router.push(
                                    "/driverForm/RodBezDriverWallet/1"
                                  )
                                }
                              >
                                <td className="py-1 px-2 sm:py-2 sm:px-3 text-xs sm:text-sm">
                                  {d.driverName}
                                </td>
                                <td className="py-1 px-2 sm:py-2 sm:px-3 text-xs sm:text-sm">
                                  {d.cabNumber}
                                </td>
                                <td className="py-1 px-2 sm:py-2 sm:px-3 text-xs sm:text-sm">
                                  <span className="bg-gray-100 rounded px-2 py-0.5 text-xs sm:text-sm">
                                    {d.cabType}
                                  </span>
                                </td>
                              </tr>
                            ))}
                            {filteredData.length === 0 && (
                              <tr>
                                <td
                                  colSpan={3}
                                  className="py-2 sm:py-4 text-center text-gray-400 text-xs sm:text-base"
                                >
                                  No records found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Cards Container */}

<div className="flex w-full gap-4 justify-center px-4 py-4 flex-wrap">
  {[
  {
    label: "Total Collections",
      amount: data.totalCollections || 0,
    color: "",
    gradient: "linear-gradient(135deg, #F8A348 60%, #E87015 100%)", // Orange
  },
  {
    label: "Ride Advance",
        amount: data.rideAdvance || 0,
    color: "",
    gradient: "linear-gradient(135deg, #B4E380 60%, #A2CA71 100%)", // Green
  },
  {
    label: "Operator Advance",
            amount: data.operatorAdvance || 0,
    color: "",
    gradient: "linear-gradient(135deg, #FFEEAD 0%, #F4CE14D2 100%)", // Yellow
  },
  {
    label: "Fare Collections",
        amount: data.fareCollections || 0,
    color: "",
    gradient: "linear-gradient(135deg, #FFEEAD 0%, #FF8A8AD2 100%)", // Red
  },
  {
    label: "Driver Due",
    amount: data.driverDue || 0,
    color: "",
    gradient: "linear-gradient(135deg, #D1E9F6 60%, #7695FF 100%)", // Blue
  },
  {
    label: "Operator Due",
        amount: data.operatorDue || 0,
    color: "",
    gradient: "linear-gradient(135deg, #67C900 60%, #15803D 100%)", // Green
  },
    // ... more cards
  ].map((item, idx) => (
    <CollectionCard key={idx} {...item} />
  ))}
</div>


            {/* Transactions Table Container */}

            <div className="max-w-full bg-white md:p-0 p-2  shadow-md rounded-lg">
              <table className="min-w-full border-collapse block md:table">
                <thead className="hidden md:table-header-group">
                  <tr className="text-left text-gray-600 font-semibold border-b border-gray-300 block md:table-row">
                    <th className="p-1 md:py-4   text-[14px]   block md:table-cell">
                      Transaction ID
                    </th>
                    <th className="p-1 text-[14px]   block md:table-cell">
                      Date and Time
                    </th>
                    <th className="p-1 text-[14px]   block md:table-cell">
                      Amount
                    </th>
                    <th className="p-1 text-[14px]   block md:table-cell">
                      Payment Mode
                    </th>
                    <th className="p-1 text-[14px]   block md:table-cell">
                      Payment Through
                    </th>
                    <th className="p-1 text-[14px]   block md:table-cell">
                      Collection Type
                    </th>
                    <th className="p-1 text-[14px]   block md:table-cell">
                      User Details
                    </th>
                    <th className="p-1 text-[14px]   block md:table-cell">
                      Driver Details
                    </th>
                    <th className="p-1 text-[14px]   block md:table-cell">
                      collected By
                    </th>
                    <th className="p-1 text-[14px]   block md:table-cell">
                      Operator Details
                    </th>
                  </tr>
                </thead>

                <tbody className="block md:table-row-group">
                  {[].map(
                    ({
                      id,
                      date,
                      amount,
                      mode,
                      through,
                      type,
                      user,
                      driver,
                      admin,
                      operator,
                    }) => (
                      <tr
                        key={id}
                        className="mb-4 text-sm block md:table-row border-b border-gray-300"
                      >
                        <td
                          className="p-3 md:py-4  font-nunito text-[#15803D] whitespace-nowrap font-semibold hover:underline cursor-pointer block md:table-cell"
                          data-label="Transaction ID"
                        >
                          <div className="flex justify-between md:block">
                            <span className="font-bold  text-gray-500 md:hidden">
                              Transaction ID:
                            </span>
                            <span className="flex items-center gap-2">
                              {id}
                            </span>
                          </div>
                        </td>
                        <td
                          className="p-3 md:1  font-nunito block md:table-cell"
                          data-label="Date and Time"
                        >
                          {/* <div className="flex justify-between md:block">
                            <span className="font-bold  text-gray-500 md:hidden">
                              Date and Time:
                            </span>
                            <span className="  flex items-center gap-2"> */}
                          <div className="flex justify-between md:block">
                            <span className="font-bold text-gray-500 md:hidden">
                              Date and Time:
                            </span>
                            <span className="text-right md:text-left flex flex-col items-end md:items-start">
                              {date}
                            </span>
                          </div>
                        </td>
                        <td
                          className="p-3 md:1  font-nunito text-black block md:table-cell"
                          data-label="Amount"
                        >
                          <div className="flex justify-between md:block">
                            <span className="font-bold text-gray-500 md:hidden">
                              Amount:
                            </span>
                            <span className=" flex items-center font-semibold gap-2">
                              {amount}
                            </span>
                          </div>
                        </td>
                        <td
                          className="md:p-1 p-3  font-nunito block md:table-cell"
                          data-label="Payment Mode"
                        >
                          <div className="flex justify-between md:block">
                            <span className="font-bold text-gray-500 md:hidden">
                              Payment Mode:
                            </span>
                            <span className="flex items-center  gap-2">
                              <span
                                className={`md:px-3 md:py-0.4 px-2 py-0 rounded-xl  ${getPaymentModeClasses(
                                  mode
                                )}`}
                              >
                                {mode}
                              </span>
                            </span>
                          </div>
                        </td>
                        <td
                          className="md:p-1 p-3 font-nunito  block md:table-cell"
                          data-label="Payment Through"
                        >
                          <div className="flex justify-between md:block">
                            <span className="font-bold text-gray-500 md:hidden">
                              Payment Through:
                            </span>
                            <span className="flex items-center gap-2">
                              <span className="border border-gray-200 md:px-2 md:py-0.4 px-1 py-0.3   rounded-xl">
                                {through}
                              </span>
                            </span>
                          </div>
                        </td>
                        <td
                          className="font-nunito md:p-1 p-3  block md:table-cell"
                          data-label="Collection Type"
                        >
                          <div className="flex justify-between md:block">
                            <span className="font-bold text-gray-500 md:hidden">
                              Collection Type:
                            </span>
                            <span className="flex items-center gap-2">
                              <span
                                className={`md:px-3 md:py-0.5 px-1 py-0 md:rounded-3xl rounded-full  border whitespace-nowrap ${getCollectionTypeClasses(
                                  type
                                )}`}
                              >
                                {type}
                              </span>
                            </span>
                          </div>
                        </td>
                        <td
                          className="font-nunito md:p-1 p-3  block md:table-cell"
                          data-label="User Details"
                        >
                          {/* <div className="flex items-center md:block w-full">
                            <span className="font-bold text-gray-500 md:hidden">
                              User:
                            </span>
                            <span className="ml-auto  md:ml-0 text-gray-800"> */}
                          <div className="flex justify-between md:block">
                            <span className="font-bold text-gray-500 md:hidden">
                              User:
                            </span>
                            <span className="text-right md:text-left flex flex-col items-end md:items-start">
                              {user}
                            </span>
                          </div>
                        </td>
                        <td
                          className="font-nunito md:p-1 p-3  block md:table-cell"
                          data-label="Driver Details"
                        >
                          <div className="flex justify-between md:block">
                            <span className="font-bold text-gray-500 md:hidden">
                              Driver Details:
                            </span>
                            <span className="text-right md:text-left flex flex-col items-end md:items-start">
                              {driver}
                            </span>
                          </div>
                        </td>
                        <td
                          className="font-nunito md:p-1 p-3  block md:table-cell"
                          data-label="Admin Details"
                        >
                          <div className="flex justify-between md:block">
                            <span className="font-bold text-gray-500 md:hidden">
                              collected By:
                            </span>
                            <span className="flex items-center  gap-2">
                              {admin}
                            </span>
                          </div>
                        </td>
                        <td
                          className="font-nunito md:p-1 p-3 block md:table-cell"
                          data-label="Operator Details"
                        >
                          <div className="flex justify-between md:block">
                            <span className="font-bold text-gray-500 md:hidden">
                              Operator Details:
                            </span>
                            <span className="flex items-center  gap-2">
                              {operator}
                            </span>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {view === "sales" && (
        <>
          <div className="bg-white rounded-lg shadow-md mt-4 max-auto w-full  p-6">
            {/* <div className="flex items-center mb-6">
             
              <div className="w-1 h-3 sm:h-6 rounded-md bg-green-700 mr-2 sm:mr-3"></div>
              <h2 className="md:text-2xl text-[16px] font-bold  font-nunito bg-gradient-to-r from-[#15803D] to-[#81CA18]  bg-clip-text text-transparent">
                Sales Invoice
              </h2>
            </div> */}

            <div className="flex items-center justify-between mb-6">
  {/* Left side – Title */}
  <div className="flex items-center">
    {/* <div className="w-1 h-3 sm:h-6 rounded-md bg-green-700 mr-2 sm:mr-3"></div> */}
    <h2 className="md:text-2xl text-[16px] font-bold font-nunito bg-gradient-to-r from-[#15803D] to-[#81CA18] bg-clip-text text-transparent">
      Sales Invoice
    </h2>
  </div>

  {/* Right side – Download button */}
  <button
    onClick={() => downloadCSV(filterInvoiceList)}
    className="bg-gradient-to-r from-[#15803D] to-[#81CA18] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl font-medium shadow hover:opacity-90 text-xs sm:text-sm"
  >
    Download CSV
  </button>
</div>

            {/* Summary Cards */}

 <div className="flex w-full gap-4 justify-center px-4 py-4 md:flex-row flex-col opacity-80 overflow-hidden flex-wrap">
  {[
    {
      label: "Total Revenue",
      amount: invoiceDetails?.totalRevenue || 0,
      gradient: "linear-gradient(135deg, #67C900 60%, #15803D 100%)",
      textColor: "text-black",
    },
    {
      label: "Own Fleet",
      amount: invoiceDetails?.ownFleetRevenue || 0,
      gradient: "linear-gradient(135deg, #FFEEAD 0%, #FF8A8AD2 100%)",
      textColor: "text-black",
    },
    {
      label: "Operator Fleet",
      amount: invoiceDetails?.operatorFleetRevenue || 0,
      gradient: "linear-gradient(135deg, #D1E9F6 60%, #7695FF 100%)",
      textColor: "text-black",
    },
    {
      label: "Other Fee",
      amount: invoiceDetails?.otherFeesRevenue || 0,
      gradient: "linear-gradient(135deg, #F8A348 60%, #E87015 100%)",
      textColor: "text-black",
    },
  ].map((item, idx) => (
    <RevenueCard key={idx} {...item} />
  ))}
</div>

                    <div className="flex justify-end rounded-lg w-full">
                      <div className="flex items-center flex-col sm:flex-row  gap-2">
                        <div className="flex items-center  gap-2 w-full">
                          <button
                            type="button"
                            className={`w-full min-w-max font-nunito px-2 md:px-4 py-3 md:py-2 rounded-lg font-medium shadow flex items-center text-[14px] sm:text-base transition-colors duration-300 hover:scale-105 bg-blue-500 text-white`}
                            onClick={() => {
                              console.log("Button clicked");
                              window.open("/ridesManagement/cancelledRide", "_blank");
                            }}
                          >
                            Cancelled Rides
                          </button>
                          <button
                            type="button"
                            className={`w-full min-w-max font-nunito px-2 md:px-4 py-3 md:py-2 rounded-lg font-medium shadow flex items-center text-[14px] sm:text-base transition-colors duration-300 hover:scale-105 bg-blue-500 text-white`}
                            onClick={() => {
                              console.log("Button clicked");
                              window.open("/ridesManagement/cashNotCollectedRides", "_blank");
                            }}
                          >
                            Not collected Rides
                          </button>
                          <button
                            type="button"
                            className={`w-full min-w-max font-nunito px-2 md:px-4 py-3 md:py-2 rounded-lg font-medium shadow flex items-center text-[14px] sm:text-base transition-colors ease-out hover:scale-105 duration-300 ${(selectedDriverId && selectedDriverId.length>0)? "bg-blue-500 text-white" :"bg-white text-gray-500"}`}
                            onClick={() => {
                              console.log("Button clicked");
                              setShow(true);
                            }}
                          >
                            Select Drivers
                          </button>
            
                          {selectedDriverId && selectedDriverId.length > 0 && <button
                              className={`w-full h-full flex items-center justify-center rounded-lg hover:bg-gray-200 bg-white`}
                              onClick={() => {
                                setSelectedDriverId(prev=> []);
                                setShow(false);
                                fetchInvoices(1).then(()=>setLoading(false));
                              }}
                              aria-label="Clear Selection"
                          > <span className="text-xl text-red-700">  × </span>
                          </button>}
                          {show && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-2">
                              <div className="bg-white rounded-2xl shadow-lg w-full max-w-[650px] max-h-[80vh] flex flex-col overflow-hidden">
                                <div className="flex flex-row sm:flex-row sm:items-center sm:justify-between px-4 py-4 sm:py-5">
                                  <span className="font-bold text-lg sm:text-xl flex-1">
                                    <span className="font-nunito bg-gradient-to-r from-[#15803D] to-[#81CA18] bg-clip-text text-transparent">
                                      Driver List
                                    </span>
                                  </span>
            
                                  <div className="flex justify-center my-2 sm:my-0">
                                    <div className="inline-flex space-x-2 sm:space-x-3 items-center w-[280px]">
                                      <button
                                        onClick={() => setFleetFilter("Rodbez")}
                                        className={toggleBtnClass(fleetFilter, "Rodbez")}
                                        aria-label="Filter Personal Fleet Type"
                                      >
                                        RodBez
                                      </button>
                                      <button
                                        onClick={() => setFleetFilter("Operator")}
                                        className={toggleBtnClass(fleetFilter, "Operator")}
                                        aria-label="Filter Market Fleet Type"
                                      >
                                        Operator
                                      </button>
                                    </div>
                                  </div>
            
                                  {/* Close Button */}
                                  <div className="flex-shrink-0 w-8 h-8 rounded-lg p-[2px] bg-gradient-to-r from-[#15803D] to-[#81CA18] shadow ml-2">
                                    <button
                                      className="w-full h-full flex items-center justify-center rounded-lg text-green-700 hover:bg-gray-200 text-xl bg-white"
                                      onClick={() => setShow(false)}
                                      aria-label="Close"
                                    >
                                      ×
                                    </button>
                                  </div>
                                </div>
            
                                {/* Search Inputs */}
                                <div className="flex flex-col sm:flex-row gap-3 px-4">
                                  <div className="relative flex-1">
                                    <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />
                                    <input
                                      type="text"
                                      placeholder="Search by Name"
                                      value={nameSearch}
                                      onChange={(e) => setNameSearch(e.target.value)}
                                      className="w-full border-gray-300 rounded-lg pl-10 pr-3 py-2 shadow-sm outline-none text-base"
                                    />
                                  </div>
                                                          {/* <div className="relative flex-1">
                                                           <FaCarSide className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />
                                                           <input
                                                             type="text"
                                                             placeholder="Search by Cab No."
                                                             value={cabSearch}
                                                             onChange={(e) => setCabSearch(e.target.value)}
                                                             className="w-full border-gray-300 rounded-lg pl-10 pr-3 py-2 shadow-sm outline-none text-base"
                                                           />
                                                         </div> */}
                                </div>
            
                                {/* Table */}
                                <div className="overflow-auto flex-grow px-4 my-3 scroll-hide">
                                  <table className="w-full text-sm border-separate [border-spacing:0] min-w-[500px]">
                                    <thead className="sticky top-0 bg-gradient-to-r from-[#18A83E] to-[#B6F162] z-10">
                                      <tr>
                                        <th className="text-left text-white px-3 py-2  rounded-tl-xl font-normal">
                                          Driver Name
                                        </th>
                                        <th className="text-left text-white px-3 py-2 font-normal  rounded-tr-xl">
                                          Mobile Number
                                        </th>
                                        {/* <th className="text-left text-white px-3 py-2 font-normal">
                                          Cab Type
                                        </th> */}
                                        {/* <th className="text-left text-white px-3 py-2 rounded-tr-xl font-normal">
                                         Fleet Type
                                        </th> */}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {displayData.length > 0 ? (
                                        displayData.map((d) => (
                                          <tr
                                            key={d.driverId}
                                            onClick={() => {
                                              handleDriverSelect(d)
                                            }}
                                            className={`border-b last:border-0 cursor-pointer transition ${
                                              (selectedDriverId && selectedDriverId.length > 0 && selectedDriverId.includes(d.driverId))
                                                ? "bg-green-200"
                                                : "hover:bg-gray-200"
                                            }`}
                                          >
                                            <td className="py-2 px-3">{d.driverName}</td>
                                            <td className="py-2 px-3">{d.driverMobile}</td>
                                            {/* <td className="py-2 px-3">{d.fleetType}</td> */}
                                          </tr>
                                        ))
                                      ) : (
                                        <tr>
                                          <td
                                            colSpan={3}
                                            className="py-4 text-center text-gray-400"
                                          >
                                            No records found
                                          </td>
                                        </tr>
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                                <div className="footer flex justify-end w-full py-2 px-4 border-t-2">
                                    <button
                                      className="border px-2 py-1 flex items-center justify-center rounded-lg text-green-700 hover:bg-gray-200 text-xl bg-white"
                                      onClick={() => {
                                        fetchInvoices(1).then(()=>setLoading(false));
                                        setShow(false);
                                      }}
                                      aria-label="Close"
                                    >
                                      Apply
                                    </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
            
                        <div>
                          <input
                            value={searchURID}
                            onChange={(e) => setSearchURID(e.target.value)}
                            className="px-4 py-2 rounded-lg focus:outline-none border text-black"
                            placeholder="Search Ride ID"
                          />
                        </div>
                        <DateRangePicker
                          onChange={(date) => {
                            setDateFilter((prev) => ({
                              startDate: date.startDate
                                ? moment(date.startDate).format()
                                : null,
                              endDate: date.endDate ? moment(date.endDate).format() : null,
                            }));
                          }}
                        />
                      </div>
                    </div>

            {/* Invoice Table */}

            <div className="max-w-full bg-white md:p-0 p-2 mt-5 shadow-md rounded-lg">
              <table className="min-w-full border-collapse block md:table">
                <thead className="hidden md:table-header-group">
                  <tr className="text-left text-gray-600 font-semibold border-b border-gray-300 block md:table-row">
                    <th className="p-1 md:py-4   text-[14px]   block md:table-cell">
                      Invoice ID
                    </th>
                    <th className="p-3 font-semibold block md:table-cell">
                      Ride Id
                    </th>
                    <th className="p-3 font-semibold block md:table-cell">
                      Invoice Type
                    </th>
                    <th className="p-3 font-nunito block md:table-cell">
                      Date
                    </th>
                    <th className="p-3 font-semibold block md:table-cell">
                      HSN Code
                    </th>
                    <th className="p-3 font-semibold block md:table-cell">
                      Amount
                    </th>
                    <th className="p-3 font-semibold block md:table-cell">
                      SGST
                    </th>
                    <th className="p-3 font-semibold block md:table-cell">
                      CGST
                    </th>
                    <th className="p-3 font-semibold block md:table-cell">
                      IGST
                    </th>
                    <th className="p-3 font-semibold block md:table-cell">
                      Total Payout
                    </th>
                  </tr>
                </thead>

                <tbody className="block md:table-row-group">
                  {/* {invoiceData.map( */}
                  {filterInvoiceList.length > 0 &&
                    filterInvoiceList.map((invoice, i) => {
                      const isLastCard = i === filterInvoiceList.length - 1;
                      return (
                        <tr
                          key={invoice.id}
                          ref={isLastCard ? lastCardRef : null}
                          className="border-b"
                        >
                          <td
                            className="block md:table-cell md:w-auto p-3 font-nunito text-[#15803D] font-semibold"
                            data-label="Invoice ID"
                          >
                            <div className="flex justify-between md:block">
                              <span className="font-bold text-gray-500 md:hidden">
                                Invoice ID:
                              </span>
                              <span>{invoice.invoice_id}</span>
                            </div>
                          </td>
                          {/* <td >
                            {invoice.invoice_id}
                          </td> */}

                          <td
                            className="block md:table-cell md:w-auto p-3 font-nunito text-[#15803D] font-semibold"
                            data-label="Invoice ID"
                          >
                            <div className="flex justify-between md:block">
                              <span className="font-bold text-gray-500 md:hidden">
                                Ride Id:
                              </span>
                              <Link
                                href={`/ridesManagement/details?urid=${invoice.ride_id}`}
                                target="_blank"
                                className="hover:underline"
                              >
                                {invoice.ride_id}
                              </Link>
                            </div>
                          </td>
                          {/* <td className="p-2 text-green-700 font-medium">
                            <Link
                              href={`/ridesManagement/details?urid=${invoice.ride_id}`}
                              target="_blank"
                              className="hover:underline"
                            >
                              {invoice.ride_id}
                            </Link>
                          </td> */}

                          <td
                            className="block md:table-cell md:w-auto p-3 font-nunito"
                            data-label="Invoice Type"
                          >
                            <div className="flex justify-between md:block">
                              <span className="font-bold text-gray-500 md:hidden">
                                Invoice Type:
                              </span>
                            </div>
                            <span className="md:px-1 md:py-0.5 px-1 py-0   ">
                              {invoice.invoice_type
                                ? invoice.invoice_type.split("_").join(" ")
                                : "-"}
                            </span>
                          </td>

                          {/* <td className="p-2 text-gray-800 capitalize">
                            {invoice.invoice_type
                              ? invoice.invoice_type.split("_").join(" ")
                              : "-"}
                          </td> */}

                          <td
                            className="block md:table-cell md:w-auto p-3 font-nunito"
                            data-label="Date and Time"
                          >
                            <div className="flex justify-between md:block">
                              <span className="font-bold text-gray-500 md:hidden">
                                Date
                              </span>
                              <span className="text-right md:text-left flex flex-col items-end md:items-start">
                                {invoice.invoice_generate_date
                                  ? moment(invoice.invoice_generate_date).format(
                                      "DD/MM/YYYY"
                                    )
                                  : "-"}
                              </span>
                            </div>
                          </td>
                          {/* <td className="p-2 text-gray-500 ">
                            {invoice.updatedAt
                              ? moment(invoice.updatedAt).format(
                                  "DD/MM/YYYY hh:mm A"
                                )
                              : "-"}
                          </td> */}

                          <td
                            className="block md:table-cell md:w-auto p-3 font-nunito"
                            data-label="HSN Code"
                          >
                            <div className="flex justify-between md:block">
                              <span className="font-bold text-gray-500 md:hidden">
                                HSN Code:
                              </span>
                              <span> {invoice.hsn_code}</span>
                            </div>
                          </td>
                          {/* <td className="p-2 text-gray-500">
                            {invoice.hsn_code}
                          </td> */}

                          <td
                            className="block md:table-cell md:w-auto p-3 font-nunito"
                            data-label="Amount"
                          >
                            <div className="flex justify-between md:block">
                              <span className="font-bold text-gray-500 md:hidden">
                                Amount:
                              </span>
                              <span className="font-semibold">
                                ₹{invoice.taxableValue}
                              </span>
                            </div>
                          </td>
                          {/* <td className="p-2 text-right text-gray-800">
                            ₹{invoice.taxableValue}
                          </td> */}

                          <td
                            className="block md:table-cell md:w-auto p-3 font-nunito"
                            data-label="SGST"
                          >
                            <div className="flex justify-between md:block">
                              <span className="font-bold text-gray-500 md:hidden">
                                SGST:
                              </span>
                              <span>₹{invoice.sgst}</span>
                            </div>
                          </td>
                          {/* <td className="p-2 text-right text-gray-800">
                            ₹{invoice.sgst}
                          </td> */}

                          {/* <td className="p-2 text-right text-gray-800">
                            ₹{invoice.cgst}
                          </td> */}
                          <td
                            className="block md:table-cell md:w-auto p-3 font-nunito"
                            data-label="CGST"
                          >
                            <div className="flex justify-between md:block">
                              <span className="font-bold text-gray-500 md:hidden">
                                CGST:
                              </span>
                              <span> ₹{invoice.cgst}</span>
                            </div>
                          </td>

                          {/* <td className="p-2 text-right text-gray-800">
                            ₹{invoice.igst}
                          </td> */}
                          <td
                            className="block md:table-cell md:w-auto p-3 font-nunito"
                            data-label="IGST"
                          >
                            <div className="flex justify-between md:block">
                              <span className="font-bold text-gray-500 md:hidden">
                                IGST:
                              </span>
                              <span> ₹{invoice.igst}</span>
                            </div>
                          </td>
                          {/* <td className="p-2 text-right text-green-700 font-semibold">
                            ₹{invoice.total_payable_amount}
                          </td> */}
                          <td
                            className="block md:table-cell md:w-auto p-3 font-nunito font-bold text-[#15803D]"
                            data-label="Total Payout"
                          >
                            <div className="flex justify-between md:block">
                              <span className="font-bold text-gray-500 md:hidden">
                                Total Payout:
                              </span>
                              <span>₹{invoice.total_payable_amount}</span>
                            </div>
                          </td>
                          {/* <td className="p-2 text-right text-green-700 font-semibold">₹{invoice.final_collection_by_driver}</td>
                                                      <td className="p-2">
                                                          <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${invoice.payment_mode ==='online'? "bg-green-100 text-green-700 ": "bg-yellow-100 text-yellow-700 "}`}>{invoice.payment_mode}</span>
                                                      </td> */}
                        </tr>
                      );
                    })}

                  {loading && (
                    <tr>
                      <td colSpan={11}>
                        <div className="flex justify-center">
                          <CustomLoader />
                        </div>
                      </td>
                    </tr>
                  )}
                  {!hasMore && (
                    <tr>
                      <td colSpan={11}>
                        <div className="text-center text-gray-500 dark:text-gray-400">
                          🚫 No more Revenue data to load
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

