"use client";
import { useState, useMemo } from "react";
import { IoIosSearch } from "react-icons/io";
import { LuDownload } from "react-icons/lu";
import { GiCheckMark } from "react-icons/gi";
import { LuClock10 } from "react-icons/lu";
import { useEffect, useCallback, useRef } from "react";
import { apiClient } from "@/app/lib/apiClient";
import DateRangePicker from "../common/DateRange";
import moment from "moment";

export default function Lead() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [leads, setLeads] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const limit = 20;

  const uniqueByLeadId = (arr) => {
    const map = new Map();
    arr.forEach((item) => {
      map.set(item.lead_id, item);
    });
    return Array.from(map.values());
  };

  const [dateFilter, setDateFilter] = useState({
    startsAt: "",
    endsAt: "",
  });

  const observerRef = useRef();
  const observerRefMobile = useRef();

  const loadLeads = useCallback(
    async (page) => {
      if (loading) return;
      setLoading(true);

      try {
        const params = {
          page,
          limit,
          ...(dateFilter.startsAt && { from: dateFilter.startsAt }),
          ...(dateFilter.endsAt && { to: dateFilter.endsAt }),
        };

        const res = await apiClient("GET", "/leads/get-all-leads", params);

        const list = res?.data?.data || [];
        if (page === 1) {
          setLeads(uniqueByLeadId(list));
        } else {
          setLeads((prev) => uniqueByLeadId([...prev, ...list]));
        }

        setHasMore(
          Array.isArray(list) && list.length === limit && list.length > 0,
        );
      } catch (err) {
        console.error("Error loading leads:", err);
      } finally {
        setLoading(false);
      }
    },
    [dateFilter],
  );

  useEffect(() => {
    setPageNo(1);
    loadLeads(1);
  }, [dateFilter]);

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
    [hasMore],
  );
  const lastCardRefMobile = useCallback(
    (node) => {
      if (!hasMore || loading) return;
      if (observerRefMobile.current) observerRefMobile.current.disconnect();

      observerRefMobile.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPageNo((prev) => prev + 1);
        }
      });

      if (node) observerRefMobile.current.observe(node);
    },
    [hasMore, loading],
  );

  useEffect(() => {
    if (pageNo > 1) loadLeads(pageNo);
  }, [pageNo, loadLeads]);

  const filteredLeads = useMemo(() => {
    let data = leads;

    if (activeTab !== "all") {
      data = data.filter((l) => l.status?.toLowerCase() === activeTab);
    }

    if (search.trim()) {
      const s = search.toLowerCase();
      data = data.filter((l) =>
        Object.values(l).join(" ").toLowerCase().includes(s),
      );
    }

    return data;
  }, [leads, activeTab, search]);
  const exportCSV = () => {
    if (!filteredLeads.length) return;

    const headers = [
      "Lead ID",
      "Full Name",
      "Phone",
      "Channel",
      "Status",
      "Source Address",
      "Destination Address",
      "Travel Date Time",
      "Created At",
      "Updated At",
    ];

    const rows = filteredLeads.map((l) => [
      l.lead_id,
      [l.first_name, l.last_name].filter(Boolean).join(" "),
      l.phone,
      l.channel,
      l.status,
      l.source_address,
      l.destination_address,
      l.travel_date_time
        ? moment(l.travel_date_time).format("DD MMM YYYY, hh:mm A")
        : "",
      l.createdAt ? moment(l.createdAt).format("DD MMM YYYY, hh:mm A") : "",
      l.updatedAt ? moment(l.updatedAt).format("DD MMM YYYY, hh:mm A") : "",
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((r) =>
        r.map((v) => `"${String(v || "").replace(/"/g, '""')}"`).join(","),
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "leads.csv";
    a.click();
  };

  return (
    <div className="space-y-6 bg-white py-4 px-2 sm:py-6 lg:py-8 rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold px-2 ">Lead Module</h1>
      <p className="text-gray-500 mb-4 px-2">
        Manage and track transportation leads across India
      </p>
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <IoIosSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Lead ID, Username, Mobile, City, or Destination..."
              className="w-full border rounded-xl pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center ">
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
          </div>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3 mb-5">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
              activeTab === "all"
                ? "bg-blue-700 text-white border-blue-700"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            }`}
          >
            All Leads ({filteredLeads.length})
          </button>

          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
              activeTab === "pending"
                ? "bg-blue-700 text-white border-blue-700"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            }`}
          >
            Pending ({leads.filter((l) => l.status === "Pending").length})
          </button>

          <button
            onClick={() => setActiveTab("complete")}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
              activeTab === "complete"
                ? "bg-blue-700 text-white border-blue-700"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            }`}
          >
            Complete ({leads.filter((l) => l.status === "Complete").length})
          </button>
        </div>

        <p className="text-sm text-gray-500">
          Showing {filteredLeads.length} leads
        </p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4">
          <div>
            <h2 className="text-lg font-semibold">Lead Records</h2>
            <p className="text-sm text-gray-500">
              Complete list of transportation leads with booking details
            </p>
          </div>

          <button
            onClick={exportCSV}
            className="flex items-center gap-2 border px-3 py-1.5 rounded-md text-sm hover:bg-gray-100"
          >
            <LuDownload size={16} /> Export
          </button>
        </div>

        <div className="border-t mb-10" />
        <div className="hidden sm:block overflow-x-auto max-h-[500px] overflow-y-auto relative">
          <table className="min-w-[1100px] w-full text-sm">
            <thead className="bg-gray-50 border-b sticky top-0 z-10">
              <tr>
                {[
                  "Lead ID",
                  "District City",
                  "Source",
                  "Destination",
                  "Username",
                  "Mobile",
                  "City",
                  "State",
                  "Status",
                  "Lead Date",
                ].map((h) => (
                  <th key={h} className="py-3 text-left font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredLeads.map((lead, idx) => {
                const isLast = filteredLeads.length - 1 === idx;
                return (
                  <tr
                    key={lead.lead_id}
                    ref={isLast ? lastCardRef : null}
                    className="border-b last:border-none hover:bg-gray-50"
                  >
                    <td className="p-1 text-blue-600 font-medium">
                      {lead?.lead_id}
                    </td>
                    <td className="p-1">{lead.district}</td>
                    <td className="p-1">{lead?.source_address}</td>
                    <td className="p-1">{lead?.destination_address}</td>
                    <td className="p-1 font-medium">
                      {[lead?.first_name, lead?.last_name]
                        .filter(Boolean)
                        .join(" ")}
                    </td>

                    <td className="p-1">{lead?.phone}</td>
                    <td className="p-1">{lead.city}</td>
                    <td className="p-1">{lead.state}</td>
                    <td className="p-1">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          lead.status === "active"
                            ? "bg-[#D0FAE5] text-[#006045]"
                            : "bg-[#FEF3C6] text-[#973C00]"
                        }`}
                      >
                        {lead.status === "active" ? (
                          <>
                            <GiCheckMark className="text-xs" />
                            Active
                          </>
                        ) : (
                          <>
                            <LuClock10 className="text-xs" />
                            Pending
                          </>
                        )}
                      </span>
                    </td>
                    <td className="p-3 text-gray-500">
                      {lead?.createdAt
                        ? new Date(lead.createdAt).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                        : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="grid gap-4 sm:hidden">
          {filteredLeads.map((lead, idx) => {
            const isLast = filteredLeads.length - 1 === idx;

            return (
              <div
                key={`${lead.lead_id}-${idx}`}
                ref={isLast ? lastCardRefMobile : null}
                className="border rounded-lg p-1 space-y-2 shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-blue-600">{lead?.lead_id}</p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      lead.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {lead.status}
                  </span>
                </div>

                <div className="text-sm space-y-1">
                  <p>
                    <b>District:</b> {lead.district}
                  </p>
                  <p>
                    <b>Source:</b> {lead?.source_address}
                  </p>
                  <p>
                    <b>Destination:</b> {lead?.destination_address}
                  </p>
                  <p>
                    <b>User:</b>{" "}
                    {[lead?.first_name, lead?.last_name]
                      .filter(Boolean)
                      .join(" ")}
                  </p>
                  <p>
                    <b>Mobile:</b> {lead?.phone}
                  </p>
                  <p>
                    <b>City:</b> {lead.city}
                  </p>
                  <p>
                    <b>State:</b> {lead.state}
                  </p>
                  <p>
                    <b>Date:</b> {lead.date}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
