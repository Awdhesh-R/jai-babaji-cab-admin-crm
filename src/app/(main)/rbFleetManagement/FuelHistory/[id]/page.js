"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { LuFuel } from "react-icons/lu";
import { CiLocationOn } from "react-icons/ci";
import { FaCarSide, FaTimes } from "react-icons/fa";
import { apiClient } from "@/app/lib/apiClient";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import moment from "moment";
import { useParams } from "next/navigation";
import { Loader } from "lucide-react";
import Image from "next/image";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useRouter } from "next/navigation";

export default function FuelRequestLogs() {
  // const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const id = useParams().id;
  const router = useRouter();
  const [fuelRequests, setFuelRequests] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const observerRef = useRef();
  const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: "",
  }); // all, thisWeek, pastWeek, pastMonth

  const now = new Date();
  const baseImageUrl =
    process.env.NEXT_IMG_BASE_URL || "https://api.jaibabajicab.com";

  const fetchFuelHistoryList = useCallback(
    async (pageNo) => {
      try {
        setLoading(false);
        const params = {
          driver_id: id,
          page: pageNo || 1,
          startDate: dateFilter.startDate || "",
          endDate: dateFilter.endDate || "",
        };
        const response = await apiClient(
          "GET",
          `/rb_drivers/getFuelHistory`,
          params
        );
        let tempArr = [];
        if (response.status || response.success) {
          // toast.error(response.message);
          tempArr = response.data;
          if (pageNo === 1) {
            setFuelRequests(tempArr);
          } else {
            if (tempArr?.length > 0) {
              setFuelRequests((prev) => [...prev, ...tempArr]);
            } else {
              setHasMore(false);
            }
          }
          setTotalRecords(response.meta.totalRecords);
          setTotalPages(response.meta.totalPages);
        } else {
          setFuelRequests([]);
        }
        // You may want to setFuelRequests(response.data) here if needed
      } catch (err) {
        setFuelRequests([]);
      } finally {
        setLoading(false);
      }
    },
    [dateFilter.startDate, dateFilter.endDate, id]
  );

  const lastCardRef = useCallback(
    (node) => {
      if (!hasMore) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setCurrentPage((prev) => prev + 1);
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [hasMore]
  );

  useEffect(() => {
    if (id) fetchFuelHistoryList(1).then(() => setLoading(false));
  }, [id, dateFilter, fetchFuelHistoryList]);

  useEffect(() => {
    if (!hasMore && currentPage > 1) return;
    setLoading(true);
    if (currentPage === 1) {
      setFuelRequests([]);
    }
    fetchFuelHistoryList(currentPage).finally(() => setLoading(false));
  }, [currentPage, hasMore, fetchFuelHistoryList]);

  const filteredData = searchTerm
    ? fuelRequests.filter(({ fuel_type: fuelType, cabs }) => {
        const term = searchTerm.toLowerCase();
        return (
          fuelType?.fuel_type.toLowerCase().includes(term) ||
          cabs?.cab_reg.toLowerCase().includes(term)
        );
      })
    : fuelRequests;

  const handleThisWeekDateFormat = () => {
    const sdate = moment().subtract(1, "week").format("YYYY-MM-DD");
    const endDate = moment().format("YYYY-MM-DD");
    setDateFilter({
      startDate: sdate,
      endDate: endDate,
    });
  };

  const updateStatus = async (fId, payload) => {
    try {
      setLoading(true);
      const response = await apiClient(
        "PUT",
        `/rb_drivers/updateFuelStatusby/${fId}`,
        payload
      );
      if (response.status || response.success) {
        toast.success(response.message);
        fetchFuelHistoryList(currentPage);
      } else {
        toast.error(response.message);
      }
    } catch (e) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (id, amount, cab) => {
    updateStatus(id, {
      status: "approved",
      fuel_id: id,
      cab_no: cab.cab_reg,
      amount
    });
  };

  const handleReject = (id, amount, cab) => {
    updateStatus(id, {
      status: "rejected",
      fuel_id: id,
      cab_no: cab.cab_reg,
      amount
    });
  };

  const handleBackClick = () => {
    router.push(`/rbFleetManagement/rbDriver/driverDetails/${id}`);
  };

  return (
    // <div className="max-w-full mx-auto">
    // <div className="bg-white min-h-screen py-4 px-2 md:px-8">
    <div className="relative ">
      {/* Header */}

      <div className="border mb-2 max-w-full">
        <div className="flex gap-6 items-center">
          <div
            className="flex items-center cursor-pointer"
            onClick={handleBackClick}
          >
            <IoIosArrowRoundBack className="font-bold text-black w-8 h-6" />
            <span className="text font-semibold text-[12px]">
              Back to driver Form
            </span>
          </div>
        </div>
      </div>

      {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gradient-to-r from-blue-500 to-blue-900 text-white rounded-t-lg p-6 gap-4">
        <div className="flex items-center gap-2">
           <LuFuel size={24} />
          <h2 className="font-semibold text-lg"> Fuel Request Logs</h2>
          <span className="bg-white text-gray-700 rounded-lg px-4 py-3 text-sm font-medium">
            Total Requests: <span className="font-bold text-blue-700 "> {totalRecords} </span>
          </span>
        </div>

        <div className="flex gap-6 sm:items-center flex-col sm:flex-row sm:justify-between">
          <div className="">
            <input
              type="text-gray-800"
              placeholder="Search by cab no./ fuel type"
              className="rounded border border-gray-300 text-blue-400 p-2 placeholder:text-blue-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={searchTerm || ""}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 bg-white rounded-lg border px-2 border-gray-300 text-sm text-gray-700 cursor-pointer select-none">
            <span className="font-bold ">Date:</span>
            <input
              type="date"
              value={dateFilter?.startDate}
              onChange={e=> setDateFilter(prev => ({...prev, startDate: e.target.value? moment(e.target.value).format("YYYY-MM-DD"): ""}))}
              className="outline-none text-sm focus:outline-none p-2"
              defaultValue="2025-07-14"
            />
          </div>
          <div className="" >
            <button onClick={handleThisWeekDateFormat} className=" w-full bg-blue-900 py-2 px-4 rounded-lg border border-gray-white text-sm font-semibold text-white">
              This Week
            </button> 
          </div>
        </div>
      </div> */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gradient-to-r from-blue-500 to-blue-900 text-white rounded-t-lg p-3 sm:p-6 gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <LuFuel size={24} />
          <h2 className="font-semibold text-lg sm:text-xl whitespace-nowrap">
            Fuel Request Logs
          </h2>
          <span className="bg-white text-gray-700 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium flex-shrink-0">
            Total Requests:{" "}
            <span className="font-bold text-blue-700"> {totalRecords} </span>
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by cab no./ fuel type"
            className="rounded border border-gray-300 text-blue-400 p-2 text-xs sm:text-sm placeholder:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition w-full sm:w-72"
            value={searchTerm || ""}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="flex items-center gap-2 bg-white rounded-lg border px-2 border-gray-300 text-xs sm:text-sm text-gray-700 cursor-pointer select-none w-full sm:w-auto">
            <span className="font-bold whitespace-nowrap">Date:</span>
            <input
              type="date"
              value={dateFilter?.startDate}
              onChange={(e) =>
                setDateFilter((prev) => ({
                  ...prev,
                  startDate: e.target.value
                    ? moment(e.target.value).format("YYYY-MM-DD")
                    : "",
                }))
              }
              className="outline-none text-xs sm:text-sm focus:outline-none p-2"
              defaultValue="2025-07-14"
            />
          </div>

          <button
            onClick={handleThisWeekDateFormat}
            className="w-full sm:w-auto bg-blue-900 py-2 px-4 rounded-lg border border-gray-white text-sm font-semibold text-white"
          >
            This Week
          </button>
        </div>
      </div>

      {/* Table */}
      {/* <div className="max-w-full bg-white p-4 rounded-b-lg">
        <table className="min-w-full">
          <thead className="bg-white">
            <tr className="text-left text-gray-600 text-sm font-semibold border-b">
              
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Fuel Type</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Vehicle No.</th>
              <th className="px-4 py-3">Fuel Meter</th>
              <th className="px-4 py-3">Date/Time</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {!loading ?
              filteredData.length > 0 ?
                filteredData.map(
                  (
                    { id, fuel_type,address, amount, cab, vehicleNo, image, createdAt, status },
                    i
                  ) => {
                    const isLastCard = i === filteredData.length -1;
                    return (
                    <tr
                      key={id}
                      ref={isLastCard? lastCardRef: null}
                      className={`${i % 2 === 0 ? "bg-gray-100" : "bg-white"} border-b`}
                    >
                     
                      <td className="px-4 py-3 mt-5 text-sm text-gray-800 flex items-center gap-2">
                        <CiLocationOn className="w-6 h-4 text-blue-600" />
                        {address}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-blue-700 cursor-pointer">{fuel_type.fuel_type}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-blue-700">₹{amount}</td>
                      <td className="px-4 py-3 text-sm text-gray-800 mt-5 flex items-center gap-2">
                        <FaCarSide className="w-6 h-4 text-blue-600" />
                        {cab?.cab_reg}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="bg-gray-300 rounded-md">
                          <Image src={`${baseImageUrl}/uploads/driver_docs/${image}`} width={30} height={30} alt="meter-image" />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{createdAt? moment(createdAt).format("DD-MM-YYYY, HH:mm A"):"-"}</td>
                      <td className="px-4 py-3 flex flex-col gap-3 align-top">
                        <button
                          className={`text-xs py-0.5 px-4 rounded border font-semibold ${status?.toLowerCase() === "approved"
                              ? "border-blue-700 text-blue-600 bg-white"
                              : "border-gray-300 text-gray-700 bg-white"
                            }`}
                          onClick={() => handleApprove(id)}
                          disabled={status?.toLowerCase() === "approved"}
                        >
                          Approve
                        </button>
                        <button
                          className={`text-xs py-0.5 px-6 rounded border font-semibold bg-red-700 text-white hover:bg-red-700 ${status?.toLowerCase() === "rejected" ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                          onClick={() => handleReject(id)}
                          disabled={status?.toLowerCase() === "rejected"}
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  )}
                ) : <tr>
                  <td colSpan={8}>
                    <div className="flex justify-center items-center gap-6 text-gray-700">
                      <FaTimes size={30} className="text-red-600" />
                      <p>  No Fuel History found</p>
                    </div>
                  </td>
                </tr>
              : <tr>
                <td colSpan={8}>
                  <div className="flex items-center justify-center w-full text-blue-600">
                    <Loader className="animate-spin" size={30} />
                  </div>
                </td>
              </tr>}
          </tbody>
        </table>
        {!hasMore && (
        <div className="text-center text-gray-500 dark:text-gray-400">
          🚫 No more Fuel data to load
        </div>
      )}
      </div> */}

      {/* <div className="overflow-x-auto  w-full">
        <table className="min-w-full border-collapse block md:table">
          <thead className="block md:table-header-group">
            <tr className="text-gray-600 text-left border-b border-gray-300 block md:table-row">
              <th className="p-3 font-semibold block md:table-cell">
                Location
              </th>
              <th className="p-3 font-semibold block md:table-cell">
                Fuel Type
              </th>
              <th className="p-3 font-semibold block md:table-cell">Amount</th>
              <th className="p-3 font-semibold block md:table-cell">
                Vehicle No.
              </th>
              <th className="p-3 font-semibold block md:table-cell">
                Fuel Meter
              </th>
              <th className="p-3 font-semibold block md:table-cell">
                Date/Time
              </th>
              <th className="p-3 font-semibold block md:table-cell"></th>
            </tr>
          </thead>
          <tbody className="block md:table-row-group">
            {!loading ? (
              filteredData.length > 0 ? (
                filteredData.map(
                  (
                    {
                      id,
                      fuel_type,
                      address,
                      amount,
                      cab,
                      image,
                      createdAt,
                      status,
                    },
                    i
                  ) => (
                    <tr
                      key={id}
                      className={`mb-4 block md:table-row border-b border-gray-300 ${
                        i % 2 === 0 ? "bg-gray-100" : "bg-white"
                      }`}
                    >
                      <td
                        className="p-3 flex items-center gap-2 block md:table-cell"
                        data-label="Location"
                      >
                        <CiLocationOn className="w-5 h-4 text-blue-600" />
                        {address}
                      </td>
                      <td
                        className="p-3 font-semibold text-blue-700 block md:table-cell"
                        data-label="Fuel Type"
                      >
                        {fuel_type.fuel_type}
                      </td>
                      <td
                        className="p-3 font-semibold text-blue-700 block md:table-cell"
                        data-label="Amount"
                      >
                        ₹{amount}
                      </td>
                      <td
                        className="p-3 flex items-center gap-2 text-gray-800 block md:table-cell"
                        data-label="Vehicle No."
                      >
                        <FaCarSide className="w-5 h-4 text-blue-600" />
                        {cab?.cab_reg}
                      </td>
                      <td
                        className="p-3 text-center block md:table-cell"
                        data-label="Fuel Meter"
                      >
                        <div className="bg-gray-300 rounded-md w-8 h-8 flex items-center justify-center">
                          <Image
                            src={`${baseImageUrl}/uploads/${image}`}
                            width={30}
                            height={30}
                            alt="meter-image"
                            className="object-cover"
                          />
                        </div>
                      </td>
                      <td
                        className="p-3 text-gray-700 block md:table-cell"
                        data-label="Date/Time"
                      >
                        {createdAt
                          ? moment(createdAt).format("DD-MM-YYYY, HH:mm A")
                          : "-"}
                      </td>
                      <td
                        className="p-3 flex flex-col gap-2 align-top block md:table-cell"
                        data-label=""
                      >
                        <button
                          className={`text-xs py-0.5 px-3 rounded border font-semibold ${
                            status?.toLowerCase() === "approved"
                              ? "border-blue-700 text-blue-600 bg-white"
                              : "border-gray-300 text-gray-700 bg-white"
                          }`}
                          onClick={() => handleApprove(id)}
                          disabled={status?.toLowerCase() === "approved"}
                        >
                          Approve
                        </button>
                        <button
                          className={`text-xs py-0.5 px-4 rounded border font-semibold bg-red-700 text-white hover:bg-red-700 ${
                            status?.toLowerCase() === "rejected"
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          onClick={() => handleReject(id)}
                          disabled={status?.toLowerCase() === "rejected"}
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr className="block md:table-row">
                  <td
                    colSpan={7}
                    className="p-3 text-center text-gray-700 block md:table-cell"
                  >
                    <FaTimes size={30} className="text-red-600 mx-auto" />
                    <p>No Fuel History found</p>
                  </td>
                </tr>
              )
            ) : (
              <tr className="block md:table-row">
                <td
                  colSpan={7}
                  className="p-3 text-center text-blue-600 block md:table-cell"
                >
                  <Loader className="animate-spin mx-auto" size={30} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div> */}

      {/* <div className="max-w-full bg-white md:p-4 p-2 rounded-b-lg">
        <table className="min-w-full border-collapse block md:table">
          <thead className="hidden md:table-header-group"> */}
      <div className="max-w-full bg-white rounded-b-lg md:h-[500px] h-[600px] overflow-y-auto">
        <table className="min-w-full border-collapse block md:table">
          <thead className="hidden md:table-header-group sticky top-0 bg-white z-10">
            <tr className="text-left text-gray-600 text-sm font-semibold border-b border-gray-300 block md:table-row">
              <th className="px-4 py-3 font-semibold block md:table-cell">
                Location
              </th>
              <th className="px-4 py-3 font-semibold block md:table-cell">
                Fuel Type
              </th>
              <th className="px-4 py-3 font-semibold block md:table-cell">
                Amount
              </th>
              <th className="px-4 py-3 font-semibold block md:table-cell">
                Vehicle No.
              </th>
              <th className="px-4 py-3 font-semibold block md:table-cell">
                Fuel Meter
              </th>
              <th className="px-4 py-3 font-semibold block md:table-cell">
                Date/Time
              </th>
              <th className="px-4 py-3 font-semibold block md:table-cell"></th>
              <th className="px-4 py-3 font-semibold block md:table-cell"></th>
            </tr>
          </thead>

          <tbody className="block md:table-row-group">
            {!loading ? (
              filteredData.length > 0 ? (
                filteredData.map(
                  (
                    {
                      id,
                      fuel_type,
                      address,
                      amount,
                      cab,
                      image,
                      createdAt,
                      status,
                    },
                    i
                  ) => {
                    let isLastCard = filteredData?.length - 1 === i;
                    return (
                    <tr
                      key={id}
                      ref={isLastCard? lastCardRef: null}
                      className={`mb-4 block md:table-row border-b border-gray-300 ${
                        i % 2 === 0 ? "bg-[#EFF6FF80]" : "bg-white"
                      }`}
                    >
                      <td
                        className="px-4 py-3 text-sm text-gray-800  gap-2 block md:table-cell"
                        data-label="Location"
                      >
                        <div className="flex justify-between md:block">
                          <span className="font-bold text-gray-500 md:hidden">
                            Location:
                          </span>
                          <span className="flex items-start gap-2">
                            <CiLocationOn className="w-5 h-4 text-blue-600" />
                            {address}
                          </span>
                        </div>
                      </td>
                      <td
                        className="px-4 py-3 text-sm  cursor-pointer block md:table-cell"
                        data-label="Fuel Type"
                      >
                        <div className="flex justify-between  md:block">
                          <span className="font-bold text-gray-500 md:hidden">
                            Fuel Type:
                          </span>
                          <span className="font-semibold text-blue-700">
                            {fuel_type.fuel_type}
                          </span>
                        </div>
                      </td>
                      <td
                        className="px-4 py-3 text-sm  block md:table-cell"
                        data-label="Amount"
                      >
                        <div className="flex justify-between md:block">
                          <span className="font-bold text-gray-500 md:hidden">
                            Amount:
                          </span>
                          <span className="font-semibold text-blue-700">
                            ₹{amount}
                          </span>
                        </div>
                      </td>
                      <td
                        className="px-4 py-3 text-sm text-gray-800 mt-5  gap-2 block md:table-cell"
                        data-label="Vehicle No."
                      >
                        <div className="flex justify-between md:block">
                          <span className="font-bold text-gray-500 md:hidden">
                            Vehicle No.:
                          </span>
                          <span className="flex items-center gap-2 text-gray-800">
                            <FaCarSide className="w-6 h-4 text-blue-600" />{" "}
                            {cab?.cab_reg}
                          </span>
                        </div>
                      </td>
                      <td
                        className="p-3 block md:table-cell text-center"
                        data-label="Fuel Meter"
                      >
                        <div className="flex justify-between px-2 py-3 text-sm  md:block items-center">
                          <span className="font-bold text-gray-500 md:hidden">
                            Fuel Meter:
                          </span>
                          <span>
                            {/* <div className="bg-gray-300 rounded-md  flex items-center justify-center">
                              <Image
                                src={`${baseImageUrl}/uploads/driver_docs/${image}`}
                                width={50}
                                height={30}
                                alt="meter-image"
                                className="object-cover"
                              />
                            </div> */}

                            <>
                              <div
                                className="bg-gray-300 rounded-md flex items-center justify-center w-[64px] h-[40px] overflow-hidden cursor-pointer"
                                onClick={() => setSelectedImage(image)} // yahan par!
                              >
                                <Image
                                  src={`${baseImageUrl}/uploads/driver_docs/${image}`}
                                  width={50}
                                  height={30}
                                  alt="meter-image"
                                  className="object-cover w-full h-full"
                                />
                              </div>

                              {selectedImage && (
                                <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/5 backdrop-blur-sm px-2 py-4">
                                  <div className="relative rounded-lg bg-white max-w-[94vw] w-[340px] max-h-[90vh] h-[420px] md:w-[340px] md:h-[420px] shadow-xl flex flex-col items-center justify-center">
                                    {/* Close Icon Button */}
                                    <button
                                      className="absolute top-2 right-2 md:top-2 md:right-2 rounded-full bg-white/70 hover:bg-white/90 p-1 md:p-1.5 shadow transition-all z-10"
                                      aria-label="Close"
                                      onClick={() => setSelectedImage(null)}
                                      style={{ lineHeight: 0 }}
                                    >
                                      {/* X-icon SVG */}
                                      <svg
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className="w-5 h-5 md:w-6 md:h-6 text-gray-700"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M6.47 6.47a.75.75 0 011.06 0L10 8.94l2.47-2.47a.75.75 0 111.06 1.06L11.06 10l2.47 2.47a.75.75 0 01-1.06 1.06L10 11.06l-2.47 2.47a.75.75 0 01-1.06-1.06L8.94 10 6.47 7.53a.75.75 0 010-1.06z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </button>
                                    <Image
                                      src={`${baseImageUrl}/uploads/driver_docs/${selectedImage}`}
                                      alt="meter-full-image"
                                      fill
                                      className="object-contain w-full h-full rounded-lg"
                                    />
                                  </div>
                                </div>
                              )}
                            </>
                          </span>
                        </div>
                      </td>
                      <td
                        className="px-4 py-3 text-sm block md:table-cell"
                        data-label="Date/Time"
                      >
                        <div className="flex justify-between md:block">
                          <span className="font-bold text-gray-500 md:hidden">
                            Date/Time:
                          </span>
                          <span className="text-gray-700">
                            {createdAt
                              ? moment(createdAt).format("DD-MM-YYYY, HH:mm A")
                              : "-"}
                          </span>
                        </div>
                      </td>
                      <td
                        className="p-3 block md:table-cell px-4 py-3 gap-3 align-top"
                        data-label=""
                      >
                        <div className="flex flex-col gap-2 md:flex-col md:gap-2">
                          {status !== "approved" && <button
                            className={`text-xs py-0.5 px-3 rounded border font-semibold ${
                              status?.toLowerCase() === "approved"
                                ? "border-blue-700 text-blue-600 bg-white"
                                : "border-gray-300 text-gray-700 bg-white"
                            }`}
                            onClick={() => handleApprove(id, amount, cab)}
                            disabled={status?.toLowerCase() === "approved"}
                          >
                            Approve
                          </button>}
                          {status === "pending" && <button
                            className={`text-xs py-0.5 px-4 rounded border font-semibold bg-[#FF8080] text-white hover:bg-red-700 ${
                              status?.toLowerCase() === "rejected"
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            onClick={() => handleReject(id, amount, cab)}
                            disabled={status?.toLowerCase() === "rejected"}
                          >
                            Reject
                          </button>}
                          {status === "rejected" && <span className={`bg-red-100 border rounded-lg border-red-500 text-black text-center`} >Rejected</span>}
                          {status === "approved" && <span className={`bg-green-100 border rounded-lg border-green-500 text-black text-center`} >Approved</span>}
                        </div>
                      </td>
                    </tr>
                  )}
                )
              ) : (
                <tr className="block md:table-row">
                  <td
                    colSpan={8}
                    className="p-3 text-center text-gray-700 block md:table-cell"
                  >
                    <FaTimes size={30} className="text-red-600 mx-auto" />
                    <p>No Fuel History found</p>
                  </td>
                </tr>
              )
            ) : (
              <tr className="block md:table-row">
                <td
                  colSpan={7}
                  className="p-3 text-center text-blue-600 block md:table-cell"
                >
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
    </div>
  );
}
