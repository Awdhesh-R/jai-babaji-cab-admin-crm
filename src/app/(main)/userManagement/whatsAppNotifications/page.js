

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { FiSearch } from "react-icons/fi";
import { RiWhatsappFill } from "react-icons/ri";
import MessageDetailsModal from "./MsgDetailsModal/page";
import { apiClient } from "@/app/lib/apiClient";

export default function WhatsAppNotifications() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const [notifications, setNotifications] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

 const [toast, setToast] = useState({ show: false, type: "", message: "" });


  const observerRefTable = useRef();
const observerRefMobile = useRef();


  const fetchNotifications = useCallback(
    async (pageNo) => {
      if (loading) return;
      setLoading(true);

      try {
        const params = {
          page: pageNo,
          limit,
          search: search || null,
          status: statusFilter !== "all" ? statusFilter : null,
        };

        const res = await apiClient("GET", "/rbWaTemplate/wa-templates-queue", params);
        const list = res?.data?.templates || [];


 
//  const mapped = list.map((item) => {
//    const p =
//      item?.wa_template_payload_message_json?.template?.components?.[0]
//        ?.parameters || [];

//    return {
//      id: item?.id,
//      name: "Customer",
//      number: item?.wa_template_payload_message_json?.mobile,

//      templateName: item?.RbWATemplate?.template_name || "N/A",

//      // messageText: item?.RbWATemplate?.text_message|| "No Message",
//      // messageText: item?.urid || "N/A",

//      status: item?.status || "pending",
//      response: "Pending",
//      Date: item?.createdAt?.split("T")[0],
//      Time: item?.createdAt ? new Date(item.createdAt).toLocaleTimeString() : "",

//      full: item,


const mapped = list.map((item) => {
  const p =
    item?.wa_template_payload_message_json?.template?.components?.[0]
      ?.parameters || [];

  return {
    id: item?.id,
    name: "Customer",
    number: item?.wa_template_payload_message_json?.mobile,

    templateName: item?.RbWATemplate?.template_name || "N/A",

    // messageText: item?.RbWATemplate?.text_message|| "No Message",
    messageText: item?.urid || "N/A",

    status: item?.status || "pending",
    response: "Pending",
    Date: item?.createdAt?.split("T")[0],
    Time: item?.createdAt
      ? new Date(item.createdAt).toLocaleTimeString()
      : "",

    full: item,
   };
 });






        if (pageNo === 1) setNotifications(mapped);
        else setNotifications((prev) => [...prev, ...mapped]);

        setHasMore(mapped.length === limit);
      } finally {
        setLoading(false);
      }
    },
    [search, statusFilter]
  );

  // Reset pagination on search / filter change
  useEffect(() => {
    setPage(1);
    fetchNotifications(1);
  }, [search, statusFilter, fetchNotifications]);

  // Pagination scroll
  useEffect(() => {
    if (page > 1) fetchNotifications(page);
  }, [page, fetchNotifications]);

  

  const lastItemRefTable = useCallback(
  (node) => {
    if (loading || !hasMore) return;

    if (observerRefTable.current) observerRefTable.current.disconnect();

    observerRefTable.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prev) => prev + 1);
      }
    });

    if (node) observerRefTable.current.observe(node);
  },
  [loading, hasMore]
);



const lastItemRefMobile = useCallback(
  (node) => {
    if (loading || !hasMore) return;

    if (observerRefMobile.current) observerRefMobile.current.disconnect();

    observerRefMobile.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prev) => prev + 1);
      }
    });

    if (node) observerRefMobile.current.observe(node);
  },
  [loading, hasMore]
);


  // UI Filtered list
  const filtered = notifications.filter((i) => {
    const matchSearch =
      // i.message?.toLowerCase().includes(search.toLowerCase()) ||
      i.number?.includes(search) ||
      i.id?.toString().includes(search);

    const matchStatus = statusFilter === "all" ? true : i.status === statusFilter;

    return matchSearch && matchStatus;
  });

  const badgeClass = (status) => {
    if (status === "sent") return "bg-green-100 text-green-700";
    // if (status === "processing") return "bg-blue-100 text-blue-700";
    if (status === "failed") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAF9] p-6 flex justify-center">
      <div className="w-full max-w-8xl">
        {toast.show && (
  <div
    className={`fixed top-4 right-4 px-4 py-2 rounded-lg text-white shadow-lg z-[9999]
    ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}
  >
    {toast.message}
  </div>
)}


        {/* HEADER */}
        <div className="flex items-center gap-2 text-gray-800 mb-4">
          <RiWhatsappFill className="text-green-600 text-xl" />
          <h1 className="text-2xl font-semibold">WhatsApp Notifications</h1>
        </div>

        {/* FILTERS */}
        <div className="bg-white p-4 rounded-xl shadow-sm border flex flex-col md:flex-row justify-between gap-4">

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border px-3 py-2 rounded-lg bg-gray-50 text-sm"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            {/* <option value="processing">Processing</option> */}
            <option value="sent">Sent</option>
            <option value="failed">Failed</option>
          </select>

          {/* Search */}
          <div className="flex items-center gap-3 bg-gray-50 px-3 py-2 rounded-lg w-42 border">
            <FiSearch className="text-gray-500" />
            <input
              type="text"
              className="bg-transparent outline-none text-sm w-full"
              placeholder="Search messages or IDs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white mt-6 rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full hidden md:table">
            <thead className="bg-gray-50 text-left text-gray-600 text-sm border-b">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Details</th>
<th className="p-3">Template Name</th>
<th className="p-3" >Template ur Id</th>
                <th className="p-3">Status</th>
                <th className="p-3">Response</th>
                <th className="p-3">Date</th>
                <th className="p-3">Time</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>


            

            <tbody className="text-sm text-gray-700">
              {filtered.map((item, idx) => {
                const isLast = idx === notifications.length - 1;

                return (
                  // <tr
                  //   key={item.id}
                  //   ref={isLast ? lastItemRef : null}
                  <tr
  key={item.id}
  ref={isLast ? lastItemRefTable : null}


                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-3 font-semibold">{item.id}</td>
                    <td className="p-3">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-gray-500 text-xs">{item.number}</p>
                    </td>
                    {/* <td className="p-3">{item.message}</td> */}
                    <td className="p-3">{item.templateName}</td>
<td className="p-3">{item.full?.urid || "N/A"}</td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${badgeClass(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3">{item.response}</td>
                    <td className="p-3">{item.Date}</td>
                    <td className="p-3">{item.Time}</td>
                    <td className="p-3">
                      <button
                        className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md"
                        onClick={() => {
                          setSelectedData(item.full);
                          setOpenModal(true);
                        }}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {loading && (
            <p className="p-4 text-center text-gray-500">Loading...</p>
          )}





          {/* MODAL */}
          <MessageDetailsModal
  open={openModal}
  onClose={() => setOpenModal(false)}
  data={selectedData}
  showToast={setToast}   
/>

        </div>







        {/* MOBILE VIEW (Cards) */}
<div className="md:hidden space-y-4 mt-6">
  {filtered.map((item, idx) => {
    const isLast = idx === filtered.length - 1; // mobile pagination FIX

    return (
      
      <div
  key={item.id}
  ref={isLast ? lastItemRefMobile : null}

        className="bg-white border rounded-xl p-4 shadow-sm"
      >
       
        <div className="flex justify-between items-center">
          <p className="font-semibold text-gray-800">ID: {item.id}</p>

          <span
            className={`px-3 py-1 rounded-full text-xs ${badgeClass(
              item.status
            )}`}
          >
            {item.status}
          </span>
        </div>

         <div className="mt-2">
          <p className="font-medium">{item.name}</p>
          <p className="text-gray-500 text-xs">{item.number}</p>
        </div>

      
        <div className="mt-2">
          <p className="text-[11px] text-gray-400">Template Name</p>
          <p className="font-medium text-gray-700">{item.templateName}</p>
        </div>

      
        <div className="mt-2">
          <p className="text-[11px] text-gray-400">Template ur Id</p>
<p className="text-gray-700 text-sm">{item.full?.urid ?? "N/A"}</p>
        </div>

       
        <div className="mt-2 text-xs text-gray-500">
          {item.Date} • {item.Time}
        </div>

       
        <button
          className="mt-3 px-4 py-2 bg-green-100 text-green-700 rounded-md text-sm w-full"
          onClick={() => {
            setSelectedData(item.full);
            setOpenModal(true);
          }}
        >
          Edit
        </button>
      </div>
    );
  })}

  {loading && (
    <p className="text-center py-3 text-gray-500">Loading...</p>
  )}
</div>


        



        



        
      </div>
    </div>
  );
}










