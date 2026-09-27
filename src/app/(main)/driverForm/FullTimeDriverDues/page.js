"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { useState } from "react";
import { CiFilter } from "react-icons/ci";
import { apiClient } from "@/app/lib/apiClient";
import moment from "moment";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { CiSearch } from "react-icons/ci";
import { toast } from "react-toastify";

const paymentModeIcons = {
  UPI_ICICI: "/icons/UPI-Black.png",
  CREDIT_CARD: "/icons/credit.png",
  DEBIT_CARD: "/icons/debit.png",
  NET_BANKING: "/icons/online-banking.png",
};

export default function PaymentHistory() {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [userData, setUserData] = useState();
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef();
  const observerRefMobile = useRef();
  const [totals, setTotals] = useState(null);
  const [driver_id, setSelectedDriverId] = useState();
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [show, setShow] = useState(false);
  const [nameSearch, setNameSearch] = useState("");
  const [rodYaanDrivers, setrodYaanDrivers] = useState([]);
  const [openPopupIndex, setOpenPopupIndex] = useState(null);

  const [filter, setFilter] = useState({
    startDate: null,
    endDate: null,
    driver_id: null,
    q: "",
  });

  function formatAmountShort(num) {
    if (!num && num !== 0) return "";

    num = Number(num);

    if (num >= 10000000) return (num / 10000000).toFixed(2) + " Cr";
    if (num >= 100000) return (num / 100000).toFixed(2) + " L";

    return num.toLocaleString("en-IN");
  }

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
    [hasMore],
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
    [hasMore],
  );

  const fetchTransaction = useCallback(
    async (pageNo = 1) => {
      try {
        setLoading(true);

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
          q: filter.q,
          date_from: date_from ? toDateOnlyString(date_from) : null,
          date_to: date_to ? toDateOnlyString(date_to) : null,
          driver_id: filter.driver_id || null,
          payment_status: filter.paymentStatus || null,
        };

        // console.log("🚀 Sending Payload:", payload);

        const response = await apiClient(
          "POST",
           "/rb_driver_bookings/get-full-time-payment-history",
          // "/rb_drivers/get-full-time-payment-history",
          payload,
          {},
          false,
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
        } else {
          setTransactions([]);
        }
      } catch (err) {
        console.error(" Error:", err);
      } finally {
        setLoading(false);
      }
    },
    [filter],
  );

  const onFilterChange = (key, value) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
    setPage(1);
    setHasMore(true);
    // fetchTransaction(1);
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
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
  }, []);

  useEffect(() => {
    if (!hasMore && page > 1) return;
    setLoading(true);
    if (page === 1) {
      setTransactions([]);
    }
    fetchTransaction(page).finally(() => setLoading(false));
  }, [page, hasMore, fetchTransaction]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasMore(true);
      fetchTransaction(1).then(() => setLoading(false));
    }, 200);
    return () => {
      clearTimeout(timer);
    };
  }, [filter, fetchTransaction]);
  useEffect(() => {
    const delay = setTimeout(() => {
      setFilter((prev) => ({
        ...prev,
        q: searchInput,
      }));
      setPage(1);
      setHasMore(true);
    }, 500); // debounce delay (500ms)

    return () => clearTimeout(delay);
  }, [searchInput]);
  const router = useRouter();

  const handleSelect = (value) => {
    const statusList = ["Success", "Pending", "Failed"];

    const alreadySelected = selectedValues.includes(value);
    let updated = [...selectedValues];

    if (alreadySelected) {
      updated = updated.filter((i) => i !== value);

      if (statusList.includes(value)) onFilterChange("paymentStatus", null);

      setSelectedValues(updated);
      return;
    }

    const hasStatus = updated.some((v) => statusList.includes(v));

    if (updated.length >= 2) {
      toast.error("Only 2 filters allowed: 1 Status + 1 User Type.");
      return;
    }

    if (statusList.includes(value) && hasStatus) {
      toast.error("You can select only one Status.");
      return;
    }

    updated.push(value);
    setSelectedValues(updated);

    if (statusList.includes(value)) onFilterChange("paymentStatus", value);

    toast.success("Filter added.");
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

  const handleApprove = async (id) => {
    try {
      const response = await apiClient(
        "PUT",
        `/rb_drivers/approve-fulltime-driver-payment-request/${id}`,
        // `/rb_drivers/approve-fulltime-driver-payment-request/${id}`,
        {},
        {},
        true,
      );
      if (response.status || response.success) {
        toast.success(response.message);
        fetchTransaction(1);
      } else {
        toast.error(response.message);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Fetch rodYaan drivers
  const fetchrodYaanDrivers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient("GET", "/rb_drivers/getAllDriver", {});
      if (response.status || response.success) {
        setrodYaanDrivers(response.data.data || response.data || []);
      }
    } catch (error) {
      console.error("Error fetching rodYaan drivers:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // When show popup is true, fetch both drivers
  useEffect(() => {
    if (show) {
      fetchrodYaanDrivers();
    }
  }, [show, fetchrodYaanDrivers]);

  // Map rodYaan drivers to uniform format
  const mappedrodYaan = rodYaanDrivers.map((d) => ({
    driverId: d.id,
    driverName: d.driverName,
    driverMobile: d.driverMobile || "N/A",
    fleetType: "rodYaan",
  }));

  // Combine based on fleet filter
  const combinedDrivers = mappedrodYaan;

  // Filter combined drivers by search fields
  const displayData = combinedDrivers.filter(
    (d) =>
      d.driverName.toLowerCase().includes(nameSearch.toLowerCase()) ||
      d.driverMobile.toLowerCase().includes(nameSearch.toLowerCase()),
  );

  return (
    <div className="bg-white min-h-screen py-0 md:py-6 px-1">
      {/* <div className="max-w-100 mt-5 shadow max-w-full mx-auto "> */}
      <div className=" bg-[url('/images/eazyPay.png')] bg-cover bg-center flex flex-col md:flex-col  md:justify-between p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="w-full max-w-xl">
            <h1 className="text-xl leading-2 font-bold font-nunito tracking-tight flex items-center text-black">
              Full Time Driver - transaction
            </h1>
            <p className="text-gray-500 text-sm md:text-base font-nunito mt-1">
              Monitor and manage your payment transactions with real-time
              insights
            </p>
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
            <input
              type="text"
              placeholder="Search by Driver Name, Phone, Cab No or Ride ID..."
              className="border rounded-lg py-2 px-3 sm:w-64 w-full"
              value={searchInput || ""}
              onChange={(e) => setSearchInput(e.target.value)}
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
            <div className="flex items-center gap-2 w-full">
              <button
                type="button"
                className={`w-full min-w-max font-nunito px-2 md:px-4 py-1 md:py-2 rounded-lg font-medium shadow flex items-center text-[10px] sm:text-base hover:border-2 transition-colors duration-300 ${driver_id ? "bg-blue-500 text-white" : "bg-white text-gray-500"}`}
                onClick={() => {
                  console.log("Button clicked");
                  setShow(true);
                }}
              >
                {filter.driver_id
                  ? combinedDrivers?.find(
                      (driver) => driver?.driverId == filter.driver_id,
                    ).driverName
                  : "Select Drivers"}
              </button>

              {filter.driver_id && (
                <button
                  className={`h-full flex items-center justify-center rounded-lg hover:bg-gray-200 bg-white`}
                  onClick={() => {
                    onFilterChange("driver_id", "");
                  }}
                  aria-label="Clear Selection"
                >
                  {" "}
                  <span className="text-xl text-red-700"> × </span>
                </button>
              )}
              {show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-2">
                  <div className="bg-white rounded-2xl shadow-lg w-full max-w-[650px] max-h-[80vh] flex flex-col overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-4 sm:py-5">
                      <span className="font-bold text-lg sm:text-xl flex-1">
                        <span className="font-nunito bg-gradient-to-r from-[#15803D] to-[#81CA18] bg-clip-text text-transparent">
                          Driver List
                        </span>
                      </span>

                      {/* Close Button */}
                      <div className="w-8 h-8 rounded-lg p-[2px] bg-gradient-to-r from-[#15803D] to-[#81CA18] shadow ml-2">
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
                          </tr>
                        </thead>
                        <tbody>
                          {displayData.length > 0 ? (
                            displayData.map((d) => (
                              <tr
                                key={d.driverId + d.driverMobile + d.driverName}
                                onClick={() => {
                                  onFilterChange("driver_id", d.driverId);
                                  setShow(false);
                                }}
                                className={`border-b last:border-0 cursor-pointer transition ${
                                  driver_id === d.driverId
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
                      {/* <button
                        className="border px-2 py-1 flex items-center justify-center rounded-lg text-green-700 hover:bg-gray-200 text-xl bg-white"
                        onClick={() => {
                          fetchNotCollectedRides(1).then(() => setLoading(false)); setShow(false);
                        }}
                        aria-label="Close"
                      >
                        Apply
                      </button> */}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* header */}
        <div className="overflow-x-auto max-w-full rounded-b-lg h-auto min-h-[650px] hidden md:block">
          <table className="min-w-full  bg-white rounded-xl">
            <thead className="bg-[#F8FCF9]  text-gray-700 border-b p-1">
              <tr>
                <th className="py-3 px-2 text-left text-sm  ">Ref. ID</th>
                <th className="py-3 px-2 text-left text-sm   ">Driver Name</th>
                <th className="py-3 px-2 text-left text-sm   ">Ride Id</th>

                <th className="py-3 text-center text-sm  ">
                  User Type Payment
                </th>

                <th className="py-3 text-left text-sm   ">Transaction Date</th>
                <th className="py-3 text-left text-sm  ">Cash</th>
                <th className="py-3 text-left text-sm  ">Online</th>
                <th className="py-3 text-left text-sm  ">Total Amount</th>
                <th className="py-3 text-left text-sm  ">STATUS</th>
                <th className="py-3 text-center text-sm  ">Action</th>
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
                      <td className=" text-gray-800 p-3 text-sm capitalize ">
                        {t.id}
                      </td>

                      <td
                        onClick={() =>
                          router.push(
                            `/driverForm/rodYaanDriverWallet/${t.driver_id}`,
                          )
                        }
                        className="text-left font-semibold text-sm cursor-pointer hover:text-blue-600 hover:underline transition duration-200"
                      >
                        {t.driver_name || "-"}
                      </td>

                      {/* <td className="text-left">
                        <span className="text-sm flex flex-col gap-2">
                          {t.group_urid_json
                            ? t.group_urid_json.map((urid, i) => {
                                return (
                                  <span
                                    key={urid + i}
                                    className="px-5 py-1 border-gray-400 border hover:text-blue-600 hover:underline transition duration-200 cursor-pointer"
                                    onClick={() =>
                                      window.open(
                                        `/ridesManagement/details?urid=${urid}`
                                      )
                                    }
                                  >
                                    {urid}
                                  </span>
                                );
                              })
                            : "-"}
                        </span>
                      </td> */}

                      <td
                        className="text-gray-800 font-medium text-sm relative cursor-pointer"
                        onMouseEnter={() => setOpenPopupIndex(i)}
                        onMouseLeave={() => setOpenPopupIndex(null)}
                      >
                        {t.group_urid_json?.[0] || "-"}

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

                                <div className="absolute top-0 left-full ml-2 w-full max-w-xs sm:min-w-[380px] bg-white border border-gray-300 border-t-4 border-t-green-600 rounded-xl shadow-lg z-20 px-4 py-3">
                                  {groups.map((urid, idx) => (
                                    <div
                                      key={urid + idx}
                                      onClick={() =>
                                        window.open(
                                          `/ridesManagement/details?urid=${urid}`,
                                        )
                                      }
                                      className="mt-2 rounded-xl p-2 border border-gray-300 hover:text-blue-600 hover:underline cursor-pointer transition"
                                    >
                                      {urid}
                                    </div>
                                  ))}

                                  <div className="mt-3 pt-2 border-t text-sm text-gray-600">
                                    Total URIDs: <b>{groups.length}</b>
                                  </div>
                                </div>
                              </>
                            );
                          })()}
                      </td>

                      <td className="text-center">
                        <span className=" capitalize  border-gray-400 px-5 py-1 text-sm ">
                          {t.payment_user_type || "-"}
                        </span>
                      </td>

                      <td className=" text-gray-500  text-sm ">
                        {t.collected_date
                          ? moment(t.collected_date).format(
                              "DD-MM-YYYY hh:mm A",
                            )
                          : "-"}
                      </td>

                      <td className=" text-left text-sm">
                        <span className="">₹{t.cash_amount || "-"}</span>
                      </td>
                      <td className="text-left text-sm">
                        <span className=" ">₹{t.online_amount || "-"}</span>
                      </td>

                      <td className=" text-green-700 font-semibold text-sm text-left">
                        ₹{t.final_amount?.toLocaleString()}
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
                      {/* <td className=" font-bold text-sm text-right ">
                        <div className="w-full flex justify-center">
                          {!t.is_approved_by_rb &&
                            t.collected_by != userData?.id && (
                              <button
                                className={`text-xs py-0.5 px-3 rounded border font-semibold ${
                                  t.is_approved_by_rb
                                    ? "border-blue-700 text-blue-600 bg-white"
                                    : "border-gray-300 text-gray-700 bg-white"
                                }`}
                                onClick={() => handleApprove(t.id)}
                                disabled={t.is_approved_by_rb}
                              >
                                Approve
                              </button>
                            )}
                          {t.is_approved_by_rb && (
                            <span className="bg-green-100  text-green-600 px-2 py-0.5 rounded-full text-xs">
                              Approved
                            </span>
                          )}
                          {!t.is_approved_by_rb &&
                            t.collected_by == userData?.id && (
                              <span className="bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded-full text-xs">
                                PENDING APPROVAL
                              </span>
                            )}
                        </div>
                      </td> */}
                      <td className="font-bold text-sm text-right">
                        <div className="w-full flex justify-center gap-2">
                          {t.is_approved_by_rb && (
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                              Approved
                            </span>
                          )}
                          {!t.is_approved_by_rb &&
                            t.collected_by === userData?.id && (
                              <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
                                Pending Approval
                              </span>
                            )}
                          {!t.is_approved_by_rb &&
                            t.collected_by !== userData?.id && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleApprove(t.id)}
                                  className="text-xs px-3 py-1 rounded border border-green-600 text-green-700 hover:bg-green-50 transition font-semibold"
                                >
                                  Approve
                                </button>

                                <button
                                  onClick={() => handleReject(t.id)}
                                  className="text-xs px-3 py-1 rounded border border-red-600 text-red-700 hover:bg-red-50 transition font-semibold"
                                >
                                  Reject
                                </button>
                              </div>
                            )}
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
                  <div className="flex justify-between py-1 ">
                    <span className="font-semibold text-gray-600 ">
                      Drive Name
                    </span>
                    <span
                      onClick={() =>
                        router.push(
                          `/driverForm/rodYaanDriverWallet/${t.driver_id}`,
                        )
                      }
                      className="text-right cursor-pointer hover:text-blue-600 hover:underline transition duration-200"
                    >
                      {t.driver_name || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 ">
                    <span className="font-semibold text-gray-600 ">
                      Ride Id
                    </span>
                    {/* <span className=" text-right px-1 py-0.5 rounded-2xl capitalize  text-[10px]">
                      {t.group_urid_json || "-"}
                    </span> */}

                    <span
                      className="text-right px-1 py-0.5 rounded-2xl text-[10px] relative cursor-pointer"
                      onClick={() =>
                        setOpenPopupIndex(openPopupIndex === i ? null : i)
                      }
                    >
                      {(() => {
                        let groups = [];

                        try {
                          if (Array.isArray(t.group_urid_json)) {
                            groups = t.group_urid_json;
                          } else if (typeof t.group_urid_json === "string") {
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

                        return groups[0] || "-";
                      })()}

                      {openPopupIndex === i &&
                        (() => {
                          let groups = [];

                          try {
                            if (Array.isArray(t.group_urid_json)) {
                              groups = t.group_urid_json;
                            } else if (typeof t.group_urid_json === "string") {
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
                                className="fixed inset-0 z-10"
                                onClick={() => setOpenPopupIndex(null)}
                              />

                              <div className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-t-green-600 shadow-xl z-20 p-4 rounded-t-2xl text-xs">
                                <div className="font-semibold text-gray-700 mb-2">
                                  Group URIDs
                                </div>

                                {groups.map((groupId, idx) => (
                                  <div
                                    key={groupId + idx}
                                    className="p-2 border rounded-lg mb-2 text-gray-800"
                                  >
                                    {groupId}
                                  </div>
                                ))}

                                <div className="flex justify-between items-center pt-2 border-t">
                                  <span className="text-gray-600">
                                    Total: <b>{groups.length}</b>
                                  </span>
                                  <button
                                    onClick={() => setOpenPopupIndex(null)}
                                    className="bg-green-600 text-white px-3 py-1 rounded-full text-xs"
                                  >
                                    Close
                                  </button>
                                </div>
                              </div>
                            </>
                          );
                        })()}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 ">
                    <span className="font-semibold text-gray-600 ">
                      User Type Payment
                    </span>
                    <span className=" text-right px-1 py-0.5 rounded-2xl capitalize  text-[10px]">
                      {t.payment_user_type || "-"}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 ">
                    <span className="font-semibold  text-gray-600 ">
                      Transaction Date
                    </span>
                    <span className=" text-gray-500 text-sm text-right">
                      {t.collected_date
                        ? moment(t.collected_date).format("DD-MM-YYYY hh:mm A")
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
                      ₹{t.final_amount?.toLocaleString()}
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
                    <span className="font-semibold text-gray-600">Action</span>
                    <span>
                      {/* <div className="w-full flex justify-center">
                        {!t.is_approved_by_rb && (
                          <button
                            className={`text-xs py-0.5 px-3 rounded border font-semibold ${
                              t.is_approved_by_rb
                                ? "border-blue-700 text-blue-600 bg-white"
                                : "border-gray-300 text-gray-700 bg-white"
                            }`}
                            onClick={() => handleApprove(t.id)}
                            disabled={t.is_approved_by_rb}
                          >
                            Approve
                          </button>
                        )}
                        {t.is_approved_by_rb && (
                          <span className="bg-green-100  text-green-600 px-2 py-0.5 rounded-full text-xs">
                            Approved
                          </span>
                        )}
                      </div> */}

                      <div className="w-full flex justify-center px-2">
                        {t.is_approved_by_rb && (
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                            Approved
                          </span>
                        )}
                        {!t.is_approved_by_rb && (
                          <div className="flex gap-2 w-full sm:w-auto">
                            <button
                              onClick={() => handleApprove(t.id)}
                              className=" w-full sm:w-auto text-xs sm:text-sm py-1.5 px-3 sm:px-4  rounded border font-semibold  border-green-600 text-green-700 bg-white  hover:bg-green-50 transition "
                            >
                              Approve
                            </button>

                            <button
                              onClick={() => handleReject(t.id)}
                              className=" w-full sm:w-auto text-xs sm:text-sm py-1.5 px-3 sm:px-4  rounded border font-semibold  border-red-600 text-red-700 bg-white  hover:bg-red-50 transition "
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
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
