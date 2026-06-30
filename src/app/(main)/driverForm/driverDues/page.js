"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { LuWallet } from "react-icons/lu";
import { apiClient } from "@/app/lib/apiClient";
import DateRangePicker from "@/components/common/DateRange";
import moment from "moment";
import { FiFilter } from "react-icons/fi";
import { FiDownload } from "react-icons/fi";
import { useRouter } from "next/navigation";



function exportDriverDuesCsv(filename, rows) {
  const headers = [
    "Driver ID",
    "Driver Name",
    "Mobile Number",
    "Cab Number",
    "	Cab Service Type",
    "Total Dues",
    "Ride Count",
  ];

  const keys = [
    "driver_id",
    "driver_name",
    "driver_mobile",
    "cab_reg",
    "cab_service_type",
    "total_collected",
    "invoices_count",
  ];

  const dateKeys = ["createdAt", "updatedAt"];

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date)) return dateStr;

    return date
      .toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .replace(",", "");
  };

  const processRow = (row) =>
    keys
      .map((key) => {
        let value = row[key];

        if (dateKeys.includes(key)) {
          value = formatDate(value);
        }

        return `"${value !== undefined && value !== null ? String(value).replace(/"/g, '""') : ""}"`;
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





function formatToCrL(num) {
  if (num >= 10000000) return (num / 10000000).toFixed(2) + " Cr";
  if (num >= 100000) return (num / 100000).toFixed(2) + " L";
  return num ? num.toLocaleString("en-IN") : "0";
}
// moment(date.startDate).format("YYYY-MM-DD")
// moment(date.endDate).format("YYYY-MM-DD")


export default function DriverDueList() {
  const [search, setSearch] = useState("");
  const [driverRecords, setDriverRecords] = useState([]);
  const [totalDue, setTotalDue] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [limit] = useState(20);
  //   const [startDate, setStartDate] = useState("");
  // const [endDate, setEndDate] = useState("");

  const [dateFilter, setDateFilter] = useState({
    startsAt: "",
    endsAt: "",
  });


  const observerRef = useRef();
  const observerRefMobile = useRef();
 

  // API fetch function
  const loadDriverDues = useCallback(async (page) => {
    if (loading) return;
    setLoading(true);
    try {
      // const params = { search, page, limit };
      //   const params = {
      //   search,
      //   page,
      //   limit,
      //   // date_from: startDate || null,
      //   // date_to: endDate || null,
      //     startsAt: dateFilter.startsAt
      //     ? moment(dateFilter.startsAt).format("YYYY-MM-DD")
      //     : null,
      //   endsAt: dateFilter.endsAt
      //     ? moment(dateFilter.endsAt).format("YYYY-MM-DD")
      //     : null,
      // };

      const params = {
        search,
        page,
        limit,
        date_from: dateFilter.startsAt || null,
        date_to: dateFilter.endsAt || null,
      };


      const response = await apiClient("GET", "/rb_drivers/get-driver-dues-list", params);

      let list = [];
      let total = 0;
      if (response?.data) {
        if (response?.data?.drivers?.rows) {
          list = response.data.drivers.rows;
        } else if (Array.isArray(response.data)) {
          list = response.data;
        }
        if (response?.data?.totalDriverDues !== undefined) {
          total = response.data.totalDriverDues;
        }
      }
      setTotalDue(Number(total));

      if (page === 1) setDriverRecords(list);
      else setDriverRecords((prev) => [...prev, ...list]);

      setHasMore(Array.isArray(list) && list.length === limit && list.length > 0);
    } catch (err) {
      console.error("Error loading driver dues:", err);
    } finally {
      setLoading(false);
    }
  }, [search, dateFilter]);

  useEffect(() => {
    setPageNo(1);
    loadDriverDues(1);
  }, [dateFilter]);



  useEffect(() => {
    const delay = setTimeout(() => {
      setPageNo(1);
      loadDriverDues(1);
    }, 400);

    return () => clearTimeout(delay);
  }, [search, loadDriverDues]);

  const lastCardRef = useCallback(
    (node) => {
      if (!hasMore) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPageNo((prev) => prev + 1);
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [hasMore]
  );
  const lastCardRefMobile = useCallback((node) => {
    if (!hasMore || loading) return;
    if (observerRefMobile.current) observerRefMobile.current.disconnect();
    observerRefMobile.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPageNo((prev) => prev + 1);
      }
    });
    if (node) observerRefMobile.current.observe(node);
  }, [hasMore, loading]);


  useEffect(() => {
    if (pageNo > 1) loadDriverDues(pageNo);
  }, [pageNo, loadDriverDues]);


  const router = useRouter();


  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#f6faff] to-[#f3f6fc] flex flex-col items-center px-2 py-4">
      <div className="w-full bg-white shadow rounded-xl px-4 py-6">
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#0F172A]">
            Driver Dues Lists
          </h2>

          <button
            onClick={() => exportDriverDuesCsv("driver_dues.csv", driverRecords)}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
          >
            <FiDownload />
          </button>
        </div>

        <p className="text-[#64748B] mb-5">
          Manage and track outstanding driver balances
        </p>

        {/* Total Dues Card */}
        <div className="mb-5 flex justify-start">
          <div
            className="flex items-center rounded-[16px] shadow-md px-6 py-5 w-full max-w-xs sm:max-w-[308px]"
            style={{ background: "linear-gradient(135deg, #FAF5FF, #F3E8FF)" }}
          >
            <div className="flex flex-col flex-1">
              <div className="text-xs font-medium text-[#64748B]">
                Total Dues
              </div>
              <div
                title={`₹${totalDue.toLocaleString("en-IN")}`}
                className="md:text-2xl text-xl font-bold text-[#0F172A] mt-0.5 cursorhelp"
              >
                ₹{formatToCrL(totalDue)}
              </div>
            </div>
            <LuWallet className="text-[38px] text-[#c3bddb] ml-5" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:justify-between py-4 items-center gap-5 w-full">
          {/* Search Input */}
          <div className="relative w-full shadow-sm mb-6 md:mb-0">
            <input
              type="text"
              placeholder="Search driver, mobile, or cab no."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
              <CiSearch />
            </span>
          </div>

          <div className="flex gap-2 mb-4 md:mb-0  items-center">

            {/* Filter Icon */}
            <span className="text-gray-500 md:text-lg text-xs bg-gray-50  md:p-1 md:px-3 md:gap-2  rounded-lg flex items-center justify-center">
              <FiFilter />


              {/* Date Picker */}
              <DateRangePicker
                onChange={(date) => {
                  setDateFilter({
                    startsAt: date.startDate
                      ? moment(date.startDate).format("YYYY-MM-DD")
                      : null,
                    endsAt: date.endDate
                      ? moment(date.endDate).format("YYYY-MM-DD")
                      : null,
                  });
                }}
              />
            </span>

          </div>






        </div>

        {/* Desktop Table */}
        <div className="hidden sm:block">
          <div className="max-h-[65vh] overflow-y-auto border rounded-xl relative">
            <table className="w-full bg-white">
              <thead className="sticky top-0 bg-gray-50 z-10 text-sm text-[#0F172A] shadow-sm">
                <tr>
                  <th className="p-2 text-left">Driver ID</th>
                  <th className="p-2 text-left">Driver</th>
                  <th className="p-2 text-left">Mobile Number</th>
                  <th className="p-2 text-left">Cab Number</th>
                  <th className="p-2 text-left">Cab Service Type</th>
                  <th className="p-2 text-left">Wallet Amount</th>
                  <th className="p-2 text-left">Rides</th>
                </tr>
              </thead>
              <tbody>
                {driverRecords.length === 0 && !loading && (
                  <tr>
                    <td colSpan={7} className="text-center text-gray-500 py-8">
                      No driver data found.
                    </td>
                  </tr>
                )}
                {driverRecords.map((r, idx) => {
                  const isLastCard = driverRecords.length - 1 === idx;
                  return (
                    <tr
                      key={idx}
                      ref={isLastCard ? lastCardRef : null}
                      className="border-b text-sm"
                    >
                      <td className="p-2 text-[#64748B]">{r.driver_id}</td>
                      {/* <td className="p-2 text-[#0F172A]">{r.driver_name}</td> */}
                      <td
                        className="p-2 cursor-pointer hover:underline text-blue-600"
                        onClick={() =>
                          router.push(
                            `/rbFleetManagement/rbDriver/driverDetails/${r.driver_id}`
                          )
                        }
                      >
                        {r.driver_name}
                      </td>

                      <td className="p-2 text-[#64748B]">{r.driver_mobile}</td>
                      <td className="p-2 text-[#0F172A]">
                        {r.cab_reg || "No cab"}
                      </td>
                      <td className="p-2 text-[#0F172A]">
                        {r.cab_service_type || ""}
                      </td>
                      <td className="p-2">
                        <span
                          className={`inline-block max-w-[110px] truncate px-3 py-1 rounded-lg font-bold ${r.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                            } cursorhelp`}
                          title={`₹${Number(r.total_collected).toLocaleString(
                            "en-IN"
                          )}`}
                        >
                          ₹{formatToCrL(Number(r.total_collected))}
                        </span>
                      </td>
                      <td className="p-2 text-[#64748B]">{r.invoices_count}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {/* Observer div */}
            {loading && (
              <div className="py-3 text-center text-sm text-gray-500">
                Loading...
              </div>
            )}
          </div>
        </div>

        {/* Mobile List */}
        <div className="max-h-[50vh] overflow-y-auto border rounded-xl relative">
          <div className="sm:hidden space-y-3">
            {driverRecords.length === 0 && !loading && (
              <div className="text-center text-gray-500 py-8">
                No driver data found.
              </div>
            )}
            {driverRecords.map((r, idx) => (
              <div
                key={idx}
                ref={
                  idx === driverRecords.length - 1 ? lastCardRefMobile : null
                }
                className="bg-gray-50 border rounded-lg px-3 py-2 flex flex-col gap-1"
              >
                <span className="text-xs text-gray-400 font-bold">
                  Driver id: {r.driver_id}
                </span>
                <div className="font-semibold text-gray-700">
                  {r.driver_name}
                </div>
                <div className="text-gray-500 text-sm">
                  Mobile Number: {r.driver_mobile}
                </div>
                <div className="text-gray-500 text-sm">
                  Cab Number: {r.cab_reg || "N/A"}
                </div>
                <div className="text-gray-500 text-sm">
                  Cab Service Type: {r.cab_service_type || ""}
                </div>
                <div className="text-right mt-1">
                  <span
                    className={`inline-block px-3 py-1 rounded-lg font-bold truncate max-w-[130px]
                    ${r.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                      }`}
                    title={`₹${Number(r.total_collected).toLocaleString(
                      "en-IN"
                    )}`}
                  >
                    ₹{formatToCrL(Number(r.total_collected))}
                  </span>
                </div>
                <div className="text-gray-500 text-sm">
                  Ride Count ({r.invoices_count})
                </div>
              </div>
            ))}
            {loading && (
              <div className="py-3 text-center text-sm text-gray-500">
                Loading...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}