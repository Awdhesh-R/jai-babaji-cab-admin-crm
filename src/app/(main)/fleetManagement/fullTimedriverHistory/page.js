"use client";
import {
  BellIcon,
  Cog6ToothIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import React, { useCallback, useEffect, useRef } from "react";
import { BsWallet } from "react-icons/bs";

import { useState } from "react";
import { MdOutlineFileDownload } from "react-icons/md";
import { CiFilter } from "react-icons/ci";
import { FaCar } from "react-icons/fa";
import { apiClient } from "@/app/lib/apiClient";
import Image from "next/image";
import moment from "moment";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const paymentModeIcons = {
  UPI_ICICI: "/icons/UPI-Black.png",
  CREDIT_CARD: "/icons/credit.png",
  DEBIT_CARD: "/icons/debit.png",
  NET_BANKING: "/icons/online-banking.png",
};

function exportToCsv(filename, rows) {
  const headers = [
    "id",
    "user_id",
    "driver_id",
    "cab_reg",
    "payment_mode",
    "payment_source",
    "amount",
    "transaction_id",
    "payment_status",
    "transaction_date",
    "collected_by",
    "collected_date",
    "is_collected",
    "is_approved_by_rbis",
    "approved_by_rbis_date",
    "final_amount",
    "online_amount",
    "cash_amount",
    "online_status",
    "cash_status",
    "group_ur_id",
    "json_payment_by_id",
    "payment_by_date",
    "payment_user_type",
    "cash_status_approved_date",
    "cash_status_approved_by",
    "createdAt",
    "updatedAt",
    "driver_name",
  ];


  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date)) return dateStr; // if not a valid date
    return date
      .toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .replace(",", ""); // remove extra comma
  };

  
  const dateKeys = [
    "transaction_date",
    "collected_date",
    "approved_by_rbis_date",
    "payment_by_date",
    "cash_status_approved_date",
    "createdAt",
    "updatedAt",
  ];

  // ✅ Process each row and format dates
  const processRow = (row) =>
    headers
      .map((key) => {
        let value = row[key];
        if (dateKeys.includes(key)) value = formatDate(value); // format date
        return `"${
          value !== undefined && value !== null
            ? String(value).replace(/"/g, '""')
            : ""
        }"`;
      })
      .join(",");

  const csvContent = [headers.join(","), ...rows.map(processRow)].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.setAttribute("download", filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function formatShort(num) {
  if (!num) return "0";

  num = Number(num);

  if (num >= 10000000) {
    return (num / 10000000).toFixed(2).replace(/\.00$/, "") + " Cr";
  } else if (num >= 100000) {
    return (num / 100000).toFixed(2).replace(/\.00$/, "") + " L";
  } else {
    return num.toLocaleString("en-IN");
  }
}

function getSmartAmount(num) {
  if (!num) return "0";

  num = Number(num);

  // agar 1 lakh se chhota → full dikhao
  if (num < 100000) {
    return num.toLocaleString("en-IN");
  }

  // warna L/Cr format
  return formatShort(num);
}

export default function PaymentHistory() {
  const [query, setQuery] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [openPopupIndex, setOpenPopupIndex] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [active, setActive] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  // const [filter, setFilter] = useState({startDate: null, endDate: null});
  const observerRef = useRef();
  const observerRefMobile = useRef();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [totals, setTotals] = useState(null);


const [selectedPaymentStatus, setSelectedPaymentStatus] = useState([]);
const [selectedUserTypes, setSelectedUserTypes] = useState([]);
const [filterOpen, setFilterOpen] = useState(false);
const [selectedValues, setSelectedValues] = useState([]);





  const [filter, setFilter] = useState({
    startDate: null,
    endDate: null,
    q: "",
  });

  function formatAmountShort(num) {
    if (!num && num !== 0) return "";

    num = Number(num);

    if (num >= 10000000) return (num / 10000000).toFixed(2) + " Cr";
    if (num >= 100000) return (num / 100000).toFixed(2) + " L";

    return num.toLocaleString("en-IN");
  }

  // const summaryCards = [

  //     {
  //   title: "Total Collections",
  //   id: 1,
  //   //  amount: totals ? `₹ ${totals.total_cash_amount}` : "₹ 0",
  //    amount: <span className="text-black">₹{totals ? totals.total_final_amount : 0}</span>,
  //   border: "bg-[#FDCA4B]",
  //   bg: "/images/walletPoints.png",
  //   icon: (
  //     <div className="flex items-center justify-center w-12 h-12 bg-[#FFC667] rounded-2xl">
  //       <BsWallet className="text-white h-6 w-6" />
  //     </div>
  //   ),
  // },
  //   {
  //     title: <span className="text-white">Cash Collections</span>,
  //     id: 2,
  //     border: "bg-[#068A0E]",
  //     amount: <span className="text-white">₹{totals ? totals.total_cash_amount : 0}</span>,
  //     bg: "/images/eazypay-process.jpeg",
  //     icon: (
  //       <div className="flex items-center justify-center w-12 h-12 bg-[#4CF356] rounded-2xl">
  //         <BsWallet className="text-white h-6 w-6" />
  //       </div>
  //     ),
  //   },
  //   {
  //     title: <span className="text-white">Online Collections</span>,
  //     border: "bg-[#896FD1]",
  //     amount: <span className="text-white">₹{totals ? totals.total_online_amount : 0}</span>,

  //     // subtitle: <span className="text-white ">Cash 0 </span>,
  //     // subtitle2: <span className="text-white ">Online 0 </span>,
  //     bg: "/images/Untitleddesignpart.png",
  //     id: 3,
  //     icon: (
  //       // Your coin stack SVG here or use <svg>...</svg>
  //       //   <span className="text-yellow-500 text-5xl">🪙</span>
  //       <div className="flex items-center justify-center w-12 h-12 bg-[#C0AFEE] rounded-2xl">
  //         <BsWallet className="text-white h-6 w-6" />
  //       </div>
  //     ),
  //   },
  // ];

  const summaryCards = [
    {
      id: 1,
      title: "Total Collections",
      rawAmount: totals ? totals.total_final_amount : 0,
      border: "bg-[#FDCA4B]",
      bg: "/images/walletPoints.png",
    },
    {
      id: 2,
      title: "Cash Collections",
      rawAmount: totals ? totals.total_cash_amount : 0,
      border: "bg-[#068A0E]",
      bg: "/images/eazypay-process.jpeg",
    },
    {
      id: 3,
      title: "Online Collections",
      rawAmount: totals ? totals.total_online_amount : 0,
      border: "bg-[#896FD1]",
      bg: "/images/Untitleddesignpart.png",
    },
  ];

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

  const lastCardRefMobile = useCallback(
    (node) => {
      if (!hasMore) return;
      if (observerRefMobile.current) observerRefMobile.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [hasMore]
  );

  const fetchTransaction = useCallback(
    async (pageNo = 1) => {
      try {
        setLoading(true);

        // ✅ Detect from search bar value (filter.q)
        let driverName = "";
        let driverPhone = "";
        let urid = "";
        let cabReg = "";

        if (/^\d{10}$/.test(filter.q)) {
          driverPhone = filter.q.trim(); // 10 digit → phone
        } else if (/^\d+$/.test(filter.q)) {
          urid = filter.q.trim(); // only numbers → ride ID
        } else if (/^[A-Za-z]{2}\d{2}[A-Za-z]{1,2}\d{4}$/i.test(filter.q)) {
          cabReg = filter.q.trim(); // pattern like BR01PA1234 → cab number
        } else {
          driverName = filter.q.trim(); // otherwise → name
        }


        
//         let date_from = filter.startDate ? new Date(filter.startDate) : null;
// let date_to = filter.endDate ? new Date(filter.endDate) : null;
// if (date_from && date_to) {
//   if (filter.startDate === filter.endDate) {
//     // Single Date Selected: full day
//     date_from.setHours(0, 0, 0, 0);
//     date_to.setHours(23, 59, 59, 999);
//   } else {
//     // Range Selected: end date inclusive
//     date_to.setHours(23, 59, 59, 999);
//   }
// }

function toDateOnlyString(date) {
  if (!(date instanceof Date) || isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10); 
}

let date_from = filter.startDate ? new Date(filter.startDate) : null;
let date_to = filter.endDate ? new Date(filter.endDate) : null;

        // ✅ Build proper payload matching backend
        const payload = {
          page: pageNo,
          limit: 20,
          sort: "updatedAt",
          order: "DESC",
          // date_from: filter.startDate
          //   ? new Date(filter.startDate).toISOString()
          //   : null,
          // date_to: filter.endDate
          //   ? new Date(filter.endDate).toISOString()
          //   : null,

            date_from: date_from ? toDateOnlyString(date_from) : null,
  date_to: date_to ? toDateOnlyString(date_to) : null,

  //           date_from: date_from ? date_from.toISOString() : null,
  // date_to: date_to ? date_to.toISOString() : null,

          driver_id: filter.driverId || null,
          driver_name: driverName,
          driver_phone: driverPhone,
          cab_reg: cabReg,
          urid: urid,

          payment_status: filter.paymentStatus || null,
          online_status: filter.onlineStatus || null,
          cash_status: filter.cashStatus || null,
          payment_mode: filter.paymentMode || null,
          payment_source: filter.paymentSource || null,
           payment_user_type: filter.payment_user_type || null, 
        };

        // console.log("🚀 Sending Payload:", payload);

        const response = await apiClient(
          "POST",
          "/rb_drivers/get-payment-history",
          payload
        );

        if (response.status || response.success) {
          const resData = response.data || {};
          const totalsData = resData.totals || {};
          const dataList = resData.data || [];

          // update totals
          if (totalsData) setTotals(totalsData);

          if (pageNo === 1) setTransactions(dataList);
          else if (dataList?.length > 0)
            setTransactions((prev) => [...prev, ...dataList]);
          else setHasMore(false);

          setTotalRecords(resData.meta?.totalRecords || 0);
          setTotalPages(resData.meta?.totalPages || 1);
        } else {
          setTransactions([]);
        }
      } catch (err) {
        console.error(" Error:", err);
      } finally {
        setLoading(false);
      }
    },
    [filter]
  );

  //    const fetchTransaction = useCallback(async (pageNo) => {
  //   try {
  //     const payload = {
  //       page: pageNo,
  //       limit: 20,
  //       sort: "updatedAt",
  //       order: "DESC",
  //       date_from: filter?.startDate ? new Date(filter.startDate).toISOString() : null,
  //       date_to: filter?.endDate ? new Date(filter.endDate).toISOString() : null,
  //       q: query || "",
  //       driver_id: filter?.driverId || null,
  //       driver_name: filter?.driverName || "",
  //       driver_phone: filter?.driverPhone || "",
  //       cab_reg: filter?.cabReg || "",
  //       urid: filter?.urid || "",
  //       payment_status: filter?.paymentStatus || "",
  //       online_status: filter?.onlineStatus || "",
  //       cash_status: filter?.cashStatus || "",
  //       payment_mode: filter?.paymentMode || "",
  //       payment_source: filter?.paymentSource || "",
  //     };

  //     const response = await apiClient("POST", "/rb_drivers/get-payment-history", payload);

  //     let tempArr = [];

  //     if (response.status || response.success) {
  //       // 👇 FIX: adjust path
  //       tempArr = response.data.data.data || response.data.data;

  //       if (pageNo === 1) {
  //         setTransactions(tempArr);
  //       } else {
  //         if (tempArr?.length > 0) {
  //           setTransactions((prev) => [...prev, ...tempArr]);
  //         } else {
  //           setHasMore(false);
  //         }
  //       }

  //       // 👇 FIX: adjust totals
  //       const totals = response.data.data.totals || {};
  //       setTotalRecords(totals.total_records || 0);
  //       setTotalPages(Math.ceil((totals.total_records || 0) / 20));
  //     } else {
  //       setTransactions([]);
  //     }
  //   } catch (e) {
  //     console.error("Fetch Error:", e);
  //   }
  // }, [filter, query]);

  const onFilterChange = (key, value) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
    setPage(1);
    setHasMore(true);
    fetchTransaction(1);
  };

  useEffect(() => {
    if (!hasMore && page > 1) return;
    setLoading(true);
    if (page === 1) {
      setTransactions([]);
    }
    fetchTransaction(page).finally(() => setLoading(false));
  }, [page, hasMore, fetchTransaction]);

  useEffect(() => {
    if (query && query.length < 3) return;
    const timer = setTimeout(() => {
      setHasMore(true);
      fetchTransaction(1).then(() => setLoading(false));
    }, 200);
    return () => {
      clearTimeout(timer);
    };
  }, [filter, query, fetchTransaction]);

  const handleStatusCheck = async (t) => {
    try {
      if (true) {//t.payment_status?.toLowerCase() !== "success"
        const response = await apiClient(
          "GET",
          `/rb_drivers/get-eazypay-payment-status/${t.id}`
        );
        if (response.status || response.success) {
          toast.success(response.message);
          fetchTransaction(1).then(() => setLoading(false));
        } else {
          toast.error(response.message);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const router = useRouter();

  
const handleSelect = (value) => {
  const statusList = ["Success", "Pending", "Failed"];
  const userTypeList = ["customer", "accountant"];

  const alreadySelected = selectedValues.includes(value);
  let updated = [...selectedValues];

  if (alreadySelected) {
    updated = updated.filter((i) => i !== value);

    if (statusList.includes(value)) onFilterChange("paymentStatus", null);
    if (userTypeList.includes(value)) onFilterChange("payment_user_type", null);

    setSelectedValues(updated);
    return;
  }

  const hasStatus = updated.some((v) => statusList.includes(v));
  const hasUserType = updated.some((v) => userTypeList.includes(v));

  if (updated.length >= 2) {
    toast.error("Only 2 filters allowed: 1 Status + 1 User Type.");
    return;
  }

  if (statusList.includes(value) && hasStatus) {
    toast.error("You can select only one Status.");
    return;
  }

  if (userTypeList.includes(value) && hasUserType) {
    toast.error("You can select only one User Type.");
    return;
  }

  updated.push(value);
  setSelectedValues(updated);

  if (statusList.includes(value)) onFilterChange("paymentStatus", value);
  if (userTypeList.includes(value)) onFilterChange("payment_user_type", value);

  toast.success("Filter added.");
};


  const toggleOption = (value) => {
    if (["Success", "Pending", "Failed"].includes(value)) {
      setSelectedPaymentStatus((prev) =>
        prev.includes(value)
          ? prev.filter((i) => i !== value)
          : [...prev, value]
      );
    }

    if (["customer", "accountant"].includes(value)) {
      setSelectedUserTypes((prev) =>
        prev.includes(value)
          ? prev.filter((i) => i !== value)
          : [...prev, value]
      );
    }

    // Send to parent filter
    onFilterChange("paymentStatus", selectedPaymentStatus);
    onFilterChange("payment_user_type", selectedUserTypes);
  };

  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest(".filter-box")) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <div className="bg-white min-h-screen py-0 md:py-6 px-1">
      {/* <div className="max-w-100 mt-5 shadow max-w-full mx-auto "> */}
      <div className=" bg-[url('/images/eazyPay.png')] bg-cover bg-center flex flex-col md:flex-col  md:justify-between p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="w-full max-w-xl">
            <h1 className="text-xl leading-2 font-bold font-nunito tracking-tight flex items-center text-black">
              Online - transaction
            </h1>
            <p className="text-gray-500 text-sm md:text-base font-nunito mt-1">
              Monitor and manage your payment transactions with real-time
              insights
            </p>
          </div>

          {/* <div className="flex space-x-2 mt-5 md:mt-0"> */}
          {/* <div className=" grid grid-cols-1 md:flex-row md:space-x-2 gap-5 md:gap-2 mt-5 md:mt-0"> */}
          <div className="grid grid-cols-2 md:flex md:flex-row gap-5 mt-5">
            {/* EazyPay Button */}
            <div>
              <button
                onClick={() => setActive("eazypay")}
                className={`w-[100px] h-[35px] flex items-center justify-center rounded-[12px] bg-white border-[1px]
                  hover:bg-orange-100 hover:border-orange-400 transition duration-300 hover:scale-105
                  ${
                    active === "eazypay" ? "border-[#E26522] bg-orange-100" : ""
                  }
                `}
              >
                <Image
                  src="/images/eazyPay-top.png"
                  width={100}
                  height={100}
                  alt="EazyPay"
                  className="h-8 w-auto object-contain"
                />
              </button>
            </div>

            {/* Razorpay Button */}
            <div>
              <button
                onClick={() => setActive("razorpay")}
                className={`w-[100px] h-[35px] flex items-center justify-center rounded-[12px] bg-white border-[1px]
                  hover:bg-blue-100 hover:border-blue-400 transition duration-300 hover:scale-105
                  ${active === "razorpay" ? "border-[#2374d7] bg-blue-100" : ""}
                `}
              >
                <Image
                  src="/images/razorpay-stamp.png"
                  width={100}
                  height={100}
                  alt="Razorpay"
                  className="h-8 w-auto object-contain"
                />
              </button>
            </div>

            {/* Analytics Button */}
            <div>
              <button
                className={` w-[100px] h-[35px] flex items-center gap-1 rounded-full bg-white px-4 py-2 text-xs font-medium shadow border ${
                  active === "analytics" ? "border-blue-500 bg-blue-100" : ""
                }`}
              >
                <ChartBarIcon className="h-4 w-4" />
                Analytics
              </button>
            </div>

            {/* Alerts Button */}
            <div>
              <button
                className={` w-[100px] h-[35px] flex items-center gap-1 rounded-full bg-white px-4 py-2 text-xs font-medium shadow border ${
                  active === "alerts" ? "border-blue-500 bg-blue-100" : ""
                }`}
              >
                <BellIcon className="h-4 w-4" />
                Alerts
              </button>
            </div>

            {/* Settings Button */}
            <div>
              <button
                className={` w-[100px] h-[35px] flex items-center gap-1 rounded-full bg-white px-4 py-2 text-xs font-medium shadow border ${
                  active === "settings" ? "border-blue-500 bg-blue-100" : ""
                }`}
              >
                <Cog6ToothIcon className="h-4 w-4" />
                Settings
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {summaryCards.map(({ title, amount, rawAmount, bg, border, id }) => (
            <div
              key={id}
              className={`rounded-xl p-4 sm:p-8 bg-cover bg-center w-full border-2 ${border} transition-all duration-300 group`}
              style={{ backgroundImage: `url(${bg})`, minHeight: "12rem" }}
            >
              <div className="flex flex-col justify-center items-center h-full text-center">
                {/* Amount with hover */}
                <div className="font-semibold group text-center leading-tight max-h-16 overflow-hidden flex items-center justify-center">
                  <span className="group-hover:hidden break-words text-[clamp(1.5rem,4vw,3rem)]">
                    ₹{formatAmountShort(rawAmount)}
                  </span>

                  <span className="hidden group-hover:block break-words text-[clamp(1.3rem,3vw,2.5rem)]">
                    ₹{rawAmount?.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* Title */}
                <div
                  className="mt-2 font-medium"
                  style={{ fontSize: "clamp(1rem, 2.5vw, 1.5rem)" }}
                >
                  {title}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* header */}
      <div className="bg-white rounded-2xl mt-5 shadow max-w-full mx-auto min-h-[600px] ">
        <div className="flex p-4 flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h2 className="text-xl font-semibold">Payment Transactions</h2>
            <p className="text-gray-500 text-sm">
              Manage and track all payment activities
            </p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full md:w-auto">
            {/* <input
              type="text"
              placeholder="Search transactions..."
              className="border rounded-lg py-2 px-3 sm:w-64 w-full"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            /> */}

            <input
              type="text"
              placeholder="Search by Driver Name, Phone, Cab No or Ride ID..."
              className="border rounded-lg py-2 px-3 sm:w-64 w-full"
              value={filter.q || ""}
              onChange={(e) => onFilterChange("q", e.target.value)}
            />

            <div className="relative filter-box">
              <div
                className="flex items-center border rounded-lg px-3 py-3 gap-2 cursor-pointer 
               whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]"
                onClick={() => setFilterOpen(!filterOpen)}
              >
                <CiFilter className="text-gray-900 text-lg flex-shrink-0" />

                <span className="text-gray-800 text-sm truncate">
                  {selectedValues.length === 0
                    ? "Filter"
                    : selectedValues.join(", ")}
                </span>
              </div>

              {filterOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg border rounded-lg p-2 z-50">
                  <div className="text-xs font-semibold text-gray-500 px-2 py-1">
                    Payment Status
                  </div>

                  {["Success", "Pending", "Failed"].map((item) => (
                    <div
                      key={item}
                      className={`px-2 py-1 text-sm cursor-pointer rounded ${
                        selectedValues.includes(item)
                          ? "bg-blue-100 text-blue-700"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => handleSelect(item)}
                    >
                      {item}
                    </div>
                  ))}

                  <hr className="my-2" />

                  <div className="text-xs font-semibold text-gray-500 px-2 py-1">
                    Payment User Type
                  </div>

                  {["customer", "accountant"].map((item) => (
                    <div
                      key={item}
                      className={`px-2 py-1 text-sm cursor-pointer rounded ${
                        selectedValues.includes(item)
                          ? "bg-blue-100 text-blue-700"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => handleSelect(item)}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex  flex-col md:flex-row gap-2">
              <input
                type="date"
                value={filter.startDate || ""}
                onChange={(e) => onFilterChange("startDate", e.target.value)}
                className="border p-2 rounded"
              />

              <input
                type="date"
                value={filter.endDate || ""}
                onChange={(e) => onFilterChange("endDate", e.target.value)}
                className="border p-2 rounded"
              />
            </div>

            <button
              className="py-2 px-6 rounded-lg bg-gray-100 border shadow flex items-center gap-2 justify-center w-full sm:w-auto"
              onClick={() => exportToCsv("transactions.csv", transactions)}
            >
              <MdOutlineFileDownload className="text-lg" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* header */}
        <div className="overflow-x-auto max-w-full rounded-b-lg h-auto min-h-[650px] hidden md:block">
          <table className="min-w-full  bg-white rounded-xl">
            <thead className="bg-[#F8FCF9]  text-gray-700 border-b p-1">
              <tr>
                <th className="py-3 px-2 text-left text-sm  ">Ref. ID</th>
                <th className="py-3 px-2 text-left text-sm   ">Driver Name</th>
                {/* <th className="py-3 text-left text-sm  ">TRANSACTION ID</th> */}

                <th className="py-3 text-center text-sm  ">
                  User Type Payment
                </th>

                {/* <th className="py-3 text-left text-sm  ">Cab No.</th> */}
                <th className="py-3 text-left text-sm   ">Collected Date</th>
                <th className="py-3 text-left text-sm">Approved On</th>

                <th className="py-3 text-left text-sm  ">Cash</th>
                <th className="py-3 text-left text-sm  ">Online</th>
                <th className="py-3 text-left text-sm  ">Total Amount</th>
                <th className="py-3 text-left text-sm  ">STATUS</th>
                {/* <th className="py-3 text-center text-sm ">Payment Through</th> */}
                <th className="py-3 text-center text-sm  ">Payment Mode</th>
              </tr>
            </thead>
            <tbody>
              {!loading ? (
                transactions?.map((t, i) => {
                  let isLastCard = i === transactions.length - 1;
                  return (
                    <tr
                      key={t.id}
                      ref={isLastCard ? lastCardRef : null}
                      className="border-b last:border-0"
                    >
                      {/* <td
                    onClick={() => router.push(`/driverForm/jaiBabajiCabDriverWallet/${t.driver_id}`)} className="p-3 font-bold cursor-pointer ">
                      {t.driver_name || "-"}
                      
      
                  </td> */}

                      <td className=" text-gray-800 p-3 text-sm capitalize ">
                        {t.id}
                      </td>

                      <td
                        onClick={() =>
                          router.push(
                            `/driverForm/jaiBabajiCabDriverWallet/${t.driver_id}`
                          )
                        }
                        className="text-left font-semibold text-sm cursor-pointer hover:text-blue-600 hover:underline transition duration-200"
                      >
                        {t.driver_name || "-"}
                      </td>

                                        {/* new changes  */}
                      {/* <td
                        className=" text-gray-800 font-medium text-sm relative cursor-pointer"
                        onMouseEnter={() => setOpenPopupIndex(i)}
                        onMouseLeave={() => setOpenPopupIndex(null)}
                      >
                        {t.transection_id || "-"}
                        {openPopupIndex === i &&
                          (() => {
                            let groups = [];

                            try {
                              if (Array.isArray(t.group_urid_json)) {
                                groups = t.group_urid_json;
                              } else if (
                                typeof t.group_urid_json === "string"
                              ) {
                                try {
                                  groups = JSON.parse(t.group_urid_json);
                                  if (!Array.isArray(groups)) groups = [groups];
                                } catch {
                                  groups = t.group_urid_json
                                    .split(",")
                                    .map((s) => s.trim());
                                }
                              }
                            } catch {
                              groups = [];
                            }

                            if (groups.length <= 1) return null;

                            return (
                              <>
                                <div
                                  className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm z-10"
                                  onClick={() => setOpenPopupIndex(null)}
                                />{" "}
                                <div className="">
                                  <div className="absolute top-0 left-full ml-2  w-full max-w-xs sm:min-w-[380px] h-auto bg-white border border-gray-300 border-t-4 border-t-green-600 rounded-xl shadow-lg z-20 px-4 sm:px-5 pb-2 pt-4 text-sm sm:text-base">
                                    {groups.map((groupId, idx) => (
                                      <React.Fragment
                                        key={`${t.id}-group-${idx}`}
                                      >
                                        <div className="flex items-center w-full">
                                          <div className="flex items-center mt-2 rounded-2xl p-1 border border-gray-300 flex-1 gap-2 font-semibold text-[#38495A]">
                                            Group URID: {groupId}
                                          </div>
                                          <span className="text-blue-600 mt-1 ml-2 font-medium text-sm sm:text-base">
                                            -{" "}
                                            <span className="font-medium text-[#323745] text-center">
                                             </span>
                                          </span>
                                        </div>
                                      </React.Fragment>
                                    ))}
                                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200 px-2 text-sm sm:text-base">
                                      <span className="text-[#6C7A89] font-medium">
                                        Total No. Of Groups:{" "}
                                        <b>
                                          {groups.length
                                            .toString()
                                            .padStart(2, "0")}
                                        </b>
                                      </span>
                                      <span className="bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold rounded-full px-4 py-1 text-[14px] sm:text-[16px] flex justify-center items-center shadow">
                                        +₹{t.amount?.toLocaleString()}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </>
                            );
                          })()}
                      </td> */}
                                          {/* new changes  */}

                      <td className="text-center">
                        <span className=" capitalize  border-gray-400 px-5 py-1 text-sm ">
                          {t.payment_user_type || "-"}
                        </span>
                      </td>

                      {/* <td >
                    <span className="bg-white  border text-sm border-gray-400 px-5 py-1 rounded-2xl">
                      {t.payment_mode || "-"}
                    </span>
                  </td> */}
             {/* new chanegs  */}
                      {/* <td>
                        {t.cab_reg || "-"}
                        <br />
                        <span className="text-xs text-gray-400 ">{"-"}</span>
                      </td> */}
                                   {/* new chanegs  */}


                     <td className=" text-gray-500  text-sm ">
  {t.createdAt
    ? moment(t.createdAt).format("DD-MM-YYYY hh:mm A")
    : "-"}
</td>

<td className=" text-gray-500  text-sm ">
  {t.updatedAt
    ? moment(t.updatedAt).format("DD-MM-YYYY hh:mm A")
    : "-"}
</td>



                      <td className=" text-left text-sm">
                        <span className="">₹{t.cash_amount || "-"}</span>
                      </td>
                      <td className="text-left text-sm">
                        <span className=" ">₹{t.online_amount || "-"}</span>
                      </td>

                      <td className=" text-green-700 font-semibold text-sm text-left">
                        ₹{t.amount.toLocaleString()}
                      </td>

                      <td className="font-semibold text-xs text-left ">
                        {t.payment_status === "SUCCESS" ? (
                          <span className="bg-green-100  text-green-600 px-2 py-0.5 rounded-full text-xs">
                            SUCCESS
                          </span>
                        ) : t.payment_status === "PENDING" ? (
                          <span className="bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded-full text-xs">
                            PENDING
                          </span>
                        ) : t.payment_status === "FAILED" ? (
                          <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">
                            FAILED
                          </span>
                        ) : (
                          <span className="px-3 py-1  rounded-full ">
                            {t.payment_status || "-"}
                          </span>
                        )}
                      </td>
                      {/* <td>
                        <span className="bg-white flex justify-center text-sm  px-5 py-1 ">
                          {paymentModeIcons[t.payment_mode] && (
                            <img
                              src={paymentModeIcons[t.payment_mode]}
                              alt={t.payment_mode}
                              className="w-6 h-6 object-contain"
                              loading="lazy"
                            />
                          )}
                        </span>
                      </td> */}
                      <td className=" font-bold text-sm text-right ">
                        <div className="w-full flex justify-center">
                          <span
                            onClick={() => handleStatusCheck(t)}
                            className={`w-[60px] h-[20px] flex items-center justify-center rounded-full bg-white overflow-hidden border
                        ${
                          t.payment_status?.toLowerCase() === "failed"
                            ? "cursor-pointer"
                            : "cursor-default"
                        } 
                        ${
                          t.payment_source?.toLowerCase() === "razorpay"
                            ? "border-blue-500"
                            : t.payment_source?.toLowerCase() === "eazypay"
                            ? "border-[#E26522]"
                            : "border-gray-300"
                        }`}
                          >
                            {t.payment_source?.toLowerCase() === "razorpay" ? (
                              <Image
                                src="/images/razorpay-stamp.png"
                                alt="Razorpay"
                                width={100}
                                height={100}
                                className="h-8 w-20 object-contain "
                              />
                            ) : t.payment_source?.toLowerCase() ===
                              "eazypay" ? (
                              <Image
                                src="/images/eazypay-logo-stamp.png"
                                alt="EazyPay"
                                width={100}
                                height={100}
                                className="h-8 w-20 object-contain"
                              />
                            ) : (
                              "-"
                            )}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8}>
                    <Loader className="animate-spin mx-auto" size={30} />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {!hasMore && (
            <div className="text-center text-gray-500 dark:text-gray-400">
              🚫 No more Fuel data to load
            </div>
          )}
        </div>

        {/* Mobile View - Card Layout */}
        <div className="md:hidden">
          {!loading ? (
            transactions?.map((t, i) => {
              let isLastCard = transactions.length - 1 === i;
              return (
                <div
                  key={t.id}
                  ref={isLastCard ? lastCardRefMobile : null}
                  className="mb-4 border border-gray-200 rounded-xl bg-white p-4 shadow"
                >
                  <div className="flex justify-between py-1 ">
                    <span className="font-semibold text-gray-600 ">
                      Ref. ID
                    </span>
                    <span className="text-gray-600  ">{t.id || "-"}</span>
                  </div>

                  {/* new changes  */}
                  {/* <div className="flex justify-between py-1 ">
                    <span className="font-semibold text-gray-600 ">
                      Drive Name
                    </span>
                    <span
                      onClick={() =>
                        router.push(
                          `/driverForm/jaiBabajiCabDriverWallet/${t.driver_id}`
                        )
                      }
                      className="text-right cursor-pointer hover:text-blue-600 hover:underline transition duration-200"
                    >
                      {t.driver_name || "-"}
                    </span>
                  </div> */}

                  {/* <div className="flex justify-between py-1 ">
                    <span className="font-semibold text-gray-600 ">
                      Transaction ID
                    </span>
                    <span className="px-3 text-gray-600   text-right relative cursor-pointer">
                      <span
                        className="text-gray-600  text-sm text-right font-bold "
                        onMouseEnter={() => setOpenPopupIndex(i)}
                        onMouseLeave={() => setOpenPopupIndex(null)}
                      >
                        {t.transection_id || "-"}
                        {openPopupIndex === i &&
                          (() => {
                            let groups = [];

                            try {
                              if (Array.isArray(t.group_urid_json)) {
                                groups = t.group_urid_json;
                              } else if (
                                typeof t.group_urid_json === "string"
                              ) {
                                try {
                                  groups = JSON.parse(t.group_urid_json);
                                  if (!Array.isArray(groups)) groups = [groups];
                                } catch {
                                  groups = t.group_urid_json
                                    .split(",")
                                    .map((s) => s.trim());
                                }
                              }
                            } catch {
                              groups = [];
                            }

                            if (groups.length <= 1) return null;

                            return (
                              <>
                                <div
                                  className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm z-10"
                                  onClick={() => setOpenPopupIndex(null)}
                                />
                                <div className="absolute bottom-full left-1 transform -translate-x-1/2 mb-2 min-w-[280px] max-w-xs bg-white bg-opacity-80 backdrop-blur-sm border border-t-green-600 rounded-lg shadow-lg z-20 px-4 py-3 text-xs sm:text-sm">
                                  {groups.map((groupId, idx) => (
                                    <React.Fragment
                                      key={`${t.id}-group-${idx}`}
                                    >
                                      <div className="flex items-center w-full mb-2">
                                        <div className="flex items-center rounded-2xl p-1 border border-gray-300 flex-1 gap-2 font-semibold text-[#38495A] text-xs sm:text-sm">
                                          Group URID: {groupId}
                                        </div>
                                      </div>
                                    </React.Fragment>
                                  ))}
                                  <div className="flex items-center justify-between pt-2 border-t border-gray-200 text-xs sm:text-sm">
                                    <span className="text-[#6C7A89] font-medium">
                                      Total No. Of Groups:{" "}
                                      <b>
                                        {groups.length
                                          .toString()
                                          .padStart(2, "0")}
                                      </b>
                                      <span className="text-blue-600 mt-1 ml-2 font-medium text-sm sm:text-base">
                                        -{" "}
                                        <span className="font-medium text-[#323745] text-center">
                                         </span>
                                      </span>
                                    </span>
                                    <span className="bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold rounded-full px-3 py-1 text-xs sm:text-sm flex justify-center items-center shadow">
                                      +₹{t.amount?.toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              </>
                            );
                          })()}
                      </span>
                    </span>
                  </div> */}
                  {/* new changes  */}
                  <div className="flex justify-between py-1 ">
                    <span className="font-semibold text-gray-600 ">
                      User Type Payment
                    </span>
                    <span className=" text-right px-1 py-0.5 rounded-2xl capitalize  text-[10px]">
                      {t.payment_user_type || "-"}
                    </span>
                  </div>
                  {/* new chanegs  */}

                  {/* <div className="flex justify-between py-1 ">
                    <span className="font-semibold text-gray-600 ">
                      Cab No.
                    </span>
                    <span className=" text-right">
                      {t.cab_reg || "-"}
                      <br />
                      <span className=" text-gray-400 ">{"-"}</span>
                    </span>
                  </div> */}
                  {/* new chanegs  */}

                  <div className="flex justify-between py-1 ">
                    <span className="font-semibold  text-gray-600 ">
                      Collected Date
                    </span>
                    <span className=" text-gray-500 text-sm text-right">
                      {t.createdAt
                        ? moment(t.createdAt).format("DD-MM-YYYY hh:mm A")
                        : "-"}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 ">
                    <span className="font-semibold  text-gray-600 ">
                      Approved On
                    </span>
                    <span className=" text-gray-500 text-sm text-right">
                      {t.updatedAt
                        ? moment(t.updatedAt).format("DD-MM-YYYY hh:mm A")
                        : "-"}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 ">
                    <span className="font-semibold text-gray-600 ">Cash</span>
                    <span className="  ">{t.cash_amount || "-"}</span>
                  </div>
                  <div className="flex justify-between py-1 ">
                    <span className="font-semibold text-gray-600 ">Online</span>
                    <span className=" text-gray-600">
                      {t.online_amount || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1  ">
                    <span className="">Total Amount</span>
                    <span className=" text-right text-green-700 font-semibold">
                      ₹{t.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 ">
                    <span className="font-semibold  text-gray-600">Status</span>
                    <span>
                      {t.payment_status === "SUCCESS" ? (
                        <span className="bg-green-100  text-green-600 px-3 py-1 rounded-full text-xs">
                          SUCCESS
                        </span>
                      ) : t.payment_status === "PENDING" ? (
                        <span className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-xs">
                          PENDING
                        </span>
                      ) : t.payment_status === "FAILED" ? (
                        <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs">
                          FAILED
                        </span>
                      ) : (
                        <span className="px-3 py-1  rounded-full ">
                          {t.payment_status || "-"}
                        </span>
                      )}
                    </span>
                  </div>
                  
                  <div className="flex justify-between py-1 items-center text-sm md:text-base">
                    <span className="font-semibold text-gray-600">
                      Payment Mode
                    </span>
                    <span>
                      <span
                        onClick={() => handleStatusCheck(t)}
                        className={`w-[78px] h-[30px] flex items-center justify-center rounded-full bg-white overflow-hidden border ${
                          t.payment_source?.toLowerCase() === "razorpay"
                            ? "border-blue-500"
                            : t.payment_source?.toLowerCase() === "eazypay"
                            ? "border-[#E26522]"
                            : "border-gray-300"
                        }`}
                      >
                        {t.payment_source?.toLowerCase() === "razorpay" ? (
                          <Image
                            src="/images/razorpay-stamp.png"
                            alt="[translate:Razorpay]"
                            width={100}
                            height={100}
                            className="h-8 w-20 object-contain"
                          />
                        ) : t.payment_source?.toLowerCase() === "eazypay" ? (
                          <Image
                            src="/images/eazypay-logo-stamp.png"
                            alt="[translate:EazyPay]"
                            width={100}
                            height={100}
                            className="h-8 w-20 object-contain"
                          />
                        ) : (
                          "-"
                        )}
                      </span>
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex items-center justify-center">
              <Loader className="animate-spin mx-auto" size={30} />
            </div>
          )}
          {!hasMore && (
            <div className="text-center text-gray-500 dark:text-gray-400">
              🚫 No more Fuel data to load
            </div>
          )}
        </div>
      </div>

      {/* changes here */}
    </div>
  );
}
