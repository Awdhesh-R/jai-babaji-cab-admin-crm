"use client";
import React, { useEffect, useState } from "react";
import { FiSearch, FiFilter } from "react-icons/fi";
import { apiClient } from "@/app/lib/apiClient";
import DateRangePicker from "@/components/common/DateRange";
// --------------------->

export default function DriverComplainList() {
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showDropdown, setShowDropdown] = useState(false);
  const [showNameList, setShowNameList] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchComplaints = async (pageNo = 1) => {
    try {
      const query = new URLSearchParams({
        page: pageNo,
        limit: 20,
        search: search || "",
        startDate: startDate || "",
        endDate: endDate || "",
      }).toString();

      const response = await apiClient(
        "GET",
        `/rb_drivers/fetch-driver-complaint-list?${query}`,
        "",
        true,
      );

      if (response?.status) {
        let filtered = response.data.data;

        if (search) {
          const text = search.toLowerCase();

          filtered = filtered.filter(
            (c) =>
              c.cab_reg?.toLowerCase().includes(text) ||
              c.driver_name?.toLowerCase().includes(text),
          );
        }

        setComplaints(filtered);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
      }

      // ---------------------------------- up>
    } catch (err) {
      console.log("ERROR:", err);
    }
  };

  useEffect(() => {
    fetchComplaints(currentPage);
  }, [search, startDate, endDate, currentPage]);

  // --------------------->

  return (
    <div className="w-full min-h-screen bg-[#f7faff] py-10 flex justify-center">
      <div className="w-full max-w-7xl">
        {/* HEADER */}
        <h1 className="text-3xl font-bold text-gray-900">
          Driver Complain List
        </h1>
        <p className="text-gray-500 mt-1">driver complain</p>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <p className="text-gray-500 text-sm">TOTAL COMPLAINTS</p>
            <p className="text-3xl font-bold mt-2">{complaints.length}</p>
          </div>

          <div className="bg-green-50 p-6 rounded-2xl shadow-sm border border-green-200">
            <p className="text-green-700 text-sm">RESOLVED</p>
            <p className="text-3xl font-bold text-green-700 mt-2">
              {complaints.filter((c) => c.status === "completed").length}
            </p>
          </div>

          <div className="bg-yellow-50 p-6 rounded-2xl shadow-sm border border-yellow-200">
            <p className="text-yellow-700 text-sm">PENDING</p>
            <p className="text-3xl font-bold text-yellow-700 mt-2">
              {complaints.filter((c) => c.status === "open").length}
            </p>
          </div>
        </div>
        <div
          className="bg-white mt-8 p-4 rounded-2xl shadow-sm border flex flex-col md:flex-row items-start md:items-center
 gap-4"
        >
          <div className="flex items-center gap-3 flex-1 bg-gray-50 rounded-xl px-3 py-2">
            <FiSearch className="text-gray-500 text-xl" />
            <input
              type="text"
              placeholder="Search by driver, reason, cab number or complaint..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent outline-none"
            />
          </div>
          <div className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-white cursor-pointer select-none relative">
            <DateRangePicker
              onChange={(date) => {
                setStartDate(date.startDate || "");
                setEndDate(date.endDate || "");
              }}
            />

            <div className="relative">
              <button
                onClick={() => {
                  setShowDropdown(!showDropdown);
                  setShowNameList(false);
                }}
                className="flex items-center gap-2 px-4 py-2 border rounded-xl hover:bg-gray-100 transition"
              >
                <FiFilter className="text-gray-600" /> Filter ▾
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-xl border z-20">
                  <p
                    onClick={() => setShowNameList(!showNameList)}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 font-medium"
                  >
                    Driver Name ▸
                  </p>

                  {showNameList && (
                    <div className="bg-white border-t">
                      {[...new Set(complaints.map((c) => c.driver_name))].map(
                        (name) => (
                          <p
                            key={name}
                            onClick={() => {
                              setSearch(name);
                              setShowDropdown(false);
                            }}
                            className="px-6 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                          >
                            {name}
                          </p>
                        ),
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="bg-white mt-10 p-6 rounded-2xl shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-900">
            Recent Activities
          </h2>
          <p className="text-gray-500 text-sm">
            Latest employee actions and system events
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="hidden md:table-header-group">
                <tr className="text-left text-gray-600 text-sm border-b">
                  <th className="p-3">#</th>
                  <th className="p-3">Driver Name</th>
                  <th className="p-3">Reason</th>
                  <th className="p-3">Complain</th>
                  <th className="p-3">Cab Number</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Complain To</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>

              <tbody className="text-sm text-gray-800">
                {complaints.length > 0 ? (
                  complaints.map((item, index) => (
                    <tr
                      key={item.id}
                      className="border-b hover:bg-gray-50 block md:table-row mb-4 md:mb-0 bg-white md:bg-transparent rounded-xl shadow md:shadow-none p-4 md:p-0"
                    >
                      <td className="p-2 md:p-3 block md:table-cell">
                        <span className="md:hidden font-semibold">#:</span>
                        {index + 1}
                      </td>

                      <td className="p-2 md:p-3 block md:table-cell font-medium">
                        <span className="md:hidden font-semibold">Driver:</span>{" "}
                        {item.driver_name}
                      </td>

                      <td className="p-2 md:p-3 block md:table-cell text-blue-600">
                        <span className="md:hidden font-semibold">Reason:</span>{" "}
                        {item.reason_name}
                      </td>

                      <td className="p-2 md:p-3 block md:table-cell">
                        <span className="md:hidden font-semibold">
                          Complain:
                        </span>{" "}
                        {item.description}
                      </td>

                      <td className="p-2 md:p-3 block md:table-cell">
                        <span className="md:hidden font-semibold">Cab:</span>{" "}
                        {item.cab_reg}
                      </td>

                      <td className="p-2 md:p-3 block md:table-cell">
                        <span className="md:hidden font-semibold">Date:</span>{" "}
                        {item.createdAt?.slice(0, 10)}
                      </td>

                      <td className="p-2 md:p-3 block md:table-cell">
                        <span className="md:hidden font-semibold">To:</span>{" "}
                        {item.admin_name}
                      </td>

                      <td className="p-2 md:p-3 block md:table-cell">
                        <span className="md:hidden font-semibold">Status:</span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs ml-2 md:ml-0 ${
                            item.status === "completed"
                              ? "bg-green-100 text-green-600"
                              : item.status === "open"
                                ? "bg-yellow-100 text-yellow-600"
                                : "bg-red-100 text-red-600"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-4 text-center text-gray-500" colSpan="7">
                      No results found...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-center gap-3 mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="px-4 py-2 bg-white border rounded">
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
