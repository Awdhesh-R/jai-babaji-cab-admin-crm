"use client";

import {
  PhoneOff,
  Clock,
  Search,
  Filter,
  Download,
  Calendar,
  X,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { apiClient } from "@/app/lib/apiClient";
import moment from "moment";
import DateRangePicker from "@/components/common/DateRange";


export default function CallBackManagementPage() {

const [data, setData] = useState([]);
const [hasMore, setHasMore] = useState(true);
const [adminList, setAdminList] = useState([]);
const [selectedAdmin, setSelectedAdmin] = useState(null);


const [loading, setLoading] = useState(false);
const [search, setSearch] = useState("");
const [status, setStatus] = useState("");
const [page, setPage] = useState(1);
const [dateFilter, setDateFilter] = useState({
  startDate: "",
  endDate: "",
});
const observerRef = useRef(null);
const resetCallbackForm = () => {
  setSelectedCabId(null);
  setReason("");
  setDate("");
  setTime("");
  setDestination("");
  setSelectedCityForCallback("");
  setSelectedCityIdForCallback("");
  setSourceCoordinate(null);
  setSelectedItem(null);
};



const params = {
  page: page,
  limit: 10,
  registration_no: search || undefined,
    startDate: dateFilter.startDate || undefined,
  endDate: dateFilter.endDate || undefined,
   ride_captain_user_id: selectedAdmin || undefined,
};

const fetchData = async () => {
  setLoading(true);
  try {
    const response = await apiClient(
      "GET",
      "/rb_cabs/callback-requests",
      params
    );

    const list = response?.data?.callbacks || [];

    if (page === 1) {
      setData(list);
    } else {
      setData((prev) => [...prev, ...list]);
    }
    if (page === 1) {
  setHasMore(list.length === 10);
} else if (list.length < 10) {
  setHasMore(false);
}


  } catch (error) {
    console.log("API error:", error);
  }
  setLoading(false);
};



useEffect(() => {
  fetchData();
}, [page, search, status, dateFilter.startDate, dateFilter.endDate, selectedAdmin]);


const fetchAdminList = async () => {
  try {
    const res = await apiClient("GET", "/rbac");
    setAdminList(res?.data || []);
  } catch (err) {
    console.log("Admin API error:", err);
  }
};


useEffect(() => {
  fetchAdminList();
}, []);



const exportData = () => {
  const csvContent =
    "Cab,Date,Time,From,To,Reason\n" +
    data
      .map(
        (d) =>
          `${d.cab_reg},${moment(d.call_back_date).format("DD MMM YYYY")} , ${moment(d.call_back_date, "HH:mm").format("hh:mm A")},${d.pickup_city_name},${d.drop_city_name},${d.call_back_reason}`
      )
      .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "callback_data.csv";
  a.click();
};

const lastRowRef = (node) => {
  if (!hasMore || loading) return;

  if (observerRef.current) observerRef.current.disconnect();

  observerRef.current = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      setPage((prev) => prev + 1);
    }
  });

  if (node) observerRef.current.observe(node);
};


  return (
    <section>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#FFBF001A] text-[#FFBF00]">
            <PhoneOff size={18} />
          </div>

          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Call Back Management
            </h1>
            <p className="text-sm text-gray-500">
              Track and manage recalled cab rides
            </p>
          </div>
        </div>





      </div>

              <div className="flex flex-col md:flex-row items-stretch sm:items-center sm:justify-between gap-3 w-full mb-5 md:w-auto">
          {/* <div className="relative w-full sm:w-56"> */}
          <div className="relative w-full  md:w-[450px]">

            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
  type="text"
  placeholder="Search by Cab No"
  value={search}
  onChange={(e) => {
  setSearch(e.target.value);
  setPage(1);
  setHasMore(true);
}}

  className="h-9 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
/>

          </div>

          <div className="flex flex-wrap md:flex-nowrap gap-2 w-full sm:w-auto">
<DateRangePicker
  onChange={(date) => {
    setDateFilter({
      startDate: date.startDate
        ? moment(date.startDate).format("YYYY-MM-DD")
        : "",
      endDate: date.endDate
        ? moment(date.endDate).format("YYYY-MM-DD")
        : "",
    });
    setPage(1);
    setHasMore(true);
  }}
/>

          <button onClick={exportData}  className="flex items-center justify-center gap-2 h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium hover:bg-gray-50 w-full sm:w-auto">
            <Download size={16} />
            Export
          </button>
                  <select
  className="h-9 rounded-lg border w-full sm:w-auto px-2 text-sm"
  onChange={(e) => {
    setSelectedAdmin(e.target.value || null);
    setPage(1);
    setHasMore(true);
  }}
>
  <option value="">All Admin</option>

  {adminList.map((a) => (
    <option key={a.id} value={a.id}>
      {a.name}
    </option>
  ))}
</select>
</div>
        </div>

      <div className="rounded-xl border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="hidden md:table-header-group bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left font-bold">Cab Number</th>
              <th className="px-4 py-3 text-left font-bold">
                Call Back Date & Time
              </th>
              <th className="px-4 py-3 text-left font-bold">Location</th>
              <th className="px-4 py-3 text-left font-bold">Ride Captain</th>
              <th className="px-4 py-3 text-left font-bold">From City</th>
              <th className="px-4 py-3 text-left font-bold">To City</th>
              <th className="px-4 py-3 text-left font-bold">
                Call Back Reason
              </th>
            </tr>
          </thead>

          <tbody>

                {data.map((item, index) => {
  const isLast = data.length - 1 === index;

  return (
    <tr
      key={index}
      ref={isLast ? lastRowRef : null}

                className="block md:table-row border rounded-lg md:border-0 mb-4 md:mb-0"
              >
                <td
                  data-label="Cab Number"
                  className="flex md:table-cell justify-between px-4 py-2 font-bold"
                >
                  <span className="md:hidden text-gray-500">Cab Number</span>
                  <span>{item.cab_reg}</span>
                </td>

                <td
                  data-label="Date & Time"
                  className="flex md:table-cell justify-between px-4 py-2"
                >
                  <span className="md:hidden text-gray-500">Date & Time</span>
                  <span>
  {moment(item.call_back_date).format("DD MMM YYYY")}
  <div className="text-xs text-gray-400">
     {moment(item.call_back_date).format("hh:mm A")}
  </div>
</span>

                </td>

                <td
                  data-label="Location"
                  className="flex md:table-cell justify-between px-4 py-2"
                >
                  <span className="md:hidden text-gray-500">Location</span>
                  <span>
  {item.call_back_drop_location_address 
    ? item.call_back_drop_location_address 
    : item.drop_city_name}
</span>

                </td>

                <td
                  data-label="Captain"
                  className="flex md:table-cell justify-between px-4 py-2"
                >
                  <span className="md:hidden text-gray-500">Captain</span>
                  <span>{item.ride_captain_name}</span>
                </td>

                <td
                  data-label="From City"
                  className="flex md:table-cell justify-between px-4 py-2"
                >
                  <span className="md:hidden text-gray-500">From</span>
                  <span>{item.pickup_city_name}</span>
                </td>

                <td
                  data-label="To City"
                  className="flex md:table-cell justify-between px-4 py-2"
                >
                  <span className="md:hidden text-gray-500">To</span>
                  <span>{item.drop_city_name}</span>
                </td>

                <td
                  data-label="Reason"
                  className="flex md:table-cell justify-between px-4 py-2 text-xs text-gray-600"
                >
                  <span className="md:hidden text-gray-500">Reason</span>
                  <span>{item.call_back_reason}</span>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </section>
  );
}
