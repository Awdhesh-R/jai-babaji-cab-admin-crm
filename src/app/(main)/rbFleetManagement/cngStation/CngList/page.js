"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoArrowBackSharp } from "react-icons/io5";
import { apiClient } from "@/app/lib/apiClient";
import { toast } from "react-toastify";


export default function CngList() {
  const router = useRouter();
  const [pumps, setPumps] = useState([]);

  const [editData, setEditData] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);

  const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);
const [loading, setLoading] = useState(false);
const observerRef = useRef();
const observerRefMobile = useRef();
const [search, setSearch] = useState("");
 const dropdownRef = useRef(null);

const fetchPumps = async (pageToLoad) => {
  if (loading) return;
  setLoading(true);
  const params = {
    page: pageToLoad,
    pageSize: 10,
    search: search,
  };

  try {
    const res = await apiClient("GET", `/rb_pump/all-rb-pump`,
      params);

    const list = res?.data?.pumps || [];

    const formatted = list.map(p => {
      const coord = p?.pump_coordinate?.coordinates || [];
      return {
        id: p.id,
        pumpName: p.pump_name || "",
        cityId: p.city_name || "",
        phone: p.pump_mobile_number || "",
        lat: coord[1] || "",
        lng: coord[0] || "",
        status: p.pump_status || "Unknown",
      };
    });

    // if (pageToLoad === 1) setPumps(formatted);
    // else setPumps(prev => [...prev, ...formatted]);
    if (pageToLoad === 1) setPumps(formatted);
else setPumps(prev => [...prev, ...formatted]);


    setHasMore(list.length === 10);

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};



const lastCardRef = useCallback(
  (node) => {
    if (!hasMore || loading) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage(prev => prev + 1);
      }
    });

    if (node) observerRef.current.observe(node);
  },
  [hasMore, loading]
);


const lastCardRefMobile = useCallback(
  (node) => {
    if (!hasMore || loading) return;

    if (observerRefMobile.current) observerRefMobile.current.disconnect();

    observerRefMobile.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage(prev => prev + 1);
      }
    });

    if (node) observerRefMobile.current.observe(node);
  },
  [hasMore, loading]
);


useEffect(() => {
  fetchPumps(page);
}, [page]);


  
  const handleDelete = (id) => {
    const filtered = pumps.filter((p) => p.id !== id);
    setPumps(filtered);
  };


  const handleCopy = (lat, lng) => {
  const link = `https://www.google.com/maps?q=${lat},${lng}`;
  navigator.clipboard.writeText(link);
  toast.success("Link copied!", { autoClose: 1200 });
};



// const handleSaveEdit = async () => {
//   try {
//     const res = await apiClient(
//       "PUT",
//       `/rb_pump/update-rb-pump/${editData.id}`,
//       {
//         pump_name: editData.pumpName,
//         city_name: editData.cityId,
//         pump_mobile_number: editData.phone,
//         pump_status: editData.status,
//         pump_coordinate: {
//           type: "Point",
//           coordinates: [editData.lng, editData.lat],
//         }
//       }
//     );
const handleSaveEdit = async () => {
  try {
    const body = {
      pump_name: editData.pumpName,
      city_name: editData.cityId,
      pump_status: editData.status || "active",
      pump_coordinate: {
        type: "Point",
        coordinates: [editData.lng, editData.lat],
      },
    };
    // const phone = (editData.phone || "").trim();
    // if (phone !== "") {
    //   body.pump_mobile_number = phone;
    // }
const phone = (editData.phone || "").trim();

if (phone !== "") {
  body.pump_mobile_number = phone;
}


    const res = await apiClient(
      "PUT",
      `/rb_pump/update-rb-pump/${editData.id}`,
      body
    );

    const data = res?.data || res;

    console.log("SERVER RESPONSE:", data);


    if (data?.success === false || data?.status === false) {
      toast.error(
        ` ERROR  
Message: ${data?.message}  
Status Code: ${data?.statusCode}  
Field: ${data?.error?.[0]?.field}  
Reason: ${data?.error?.[0]?.message}`
      );
      return;
    }


    setPumps(prev =>
      prev.map(p => (p.id === editData.id ? editData : p))
    );

    setShowEditPopup(false);
    toast.success("Updated successfully!");

  } catch (err) {


    const apiErr = err?.response?.data;

    toast.error(
      `ERROR  
Message: ${apiErr?.message}  
Status Code: ${apiErr?.statusCode}  
Field: ${apiErr?.error?.[0]?.field}  
Reason: ${apiErr?.error?.[0]?.message}`
    );
  }
};



useEffect(() => {
  const delay = setTimeout(() => {
    setPage(1);
    setPumps([]);
    fetchPumps(1); 
  }, 300);

  return () => clearTimeout(delay);
}, [search]);


 useEffect(() => {
  function handleClickOutside(e) {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setShowEditPopup(false); // popup close
    }
  }

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);


  return (
    <div className="w-full min-h-screen bg-gray-100 p-5">
      <div className="max-w-full mx-auto bg-white rounded shadow p-4">
        {/* HEADER */}


          <div className="flex items-center md:flex-row flex-col justify-between mb-4">

  {/* LEFT SIDE */}
  <div className="flex items-center gap-3">
    <button
      onClick={() =>
        router.push("/rbFleetManagement/cngStation/CabLocation")
      }
    >
      <IoArrowBackSharp size={30} />
    </button>

    <div className="md:text-2xl text-sm font-bold">
      CNG Pump List
    </div>
  </div>

  {/* RIGHT SIDE SEARCH BAR */}
  <div className="w-40 md:w-64">
    <input
      type="text"
      placeholder="Search pump name or city..."
      className="w-full border px-3 py-2 rounded-lg shadow-sm"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  </div>

</div>


        {pumps.length === 0 ? (
          <p className="text-gray-600">No pumps found.</p>
        ) : (
          <>
            {/* TABLE VIEW */}
            <div className="hidden md:block">
              <table className="w-full border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">City Name</th>
                    <th className="border p-2">Pump Name</th>
                    <th className="border p-2">Mobile</th>
                    <th className="border p-2">Latitude</th>
                    <th className="border p-2">Longitude</th>
                    <th className="border p-2 text-center">Pump Status</th>
                    <th className="border p-2 text-center">Map Link</th>
                    <th className="border p-2 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {pumps.map((p, idx) => {
                    const isLast = idx === pumps.length - 1;

                    return (
                      <tr
                        key={p.id}
                        ref={isLast ? lastCardRef : null}
                        className="border hover:bg-gray-50"
                      >
                        <td className="border p-2 text-center">{p.cityId}</td>
                        <td className="border p-2 text-center">{p.pumpName}</td>
                        <td className="border p-2 text-center">{p.phone}</td>
                        <td className="border p-2 text-center">{p.lat}</td>
                        <td className="border p-2 text-center">{p.lng}</td>
                        {/* <td className="border p-2 text-center">{p.status}</td> */}
                        <td className="border p-2 text-center">
                          <span
                            className={
                              p.status === "active"
                                ? "bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold"
                                : "bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold"
                            }
                          >
                            {p.status}
                          </span>
                        </td>

                        <td className="border p-2 text-center">
                          <div className="flex flex-col items-center">
                            <a
                              href={`https://www.google.com/maps?q=${p.lat},${p.lng}`}
                              target="_blank"
                              className="text-blue-600 underline text-sm"
                            >
                              Open Map
                            </a>

                            <button
                              onClick={() => handleCopy(p.lat, p.lng)}
                              className="w-28 bg-gray-900 text-white py-1 rounded text-xs mt-1"
                            >
                              Copy Link
                            </button>
                          </div>
                        </td>

                        <td className="border p-2 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <button
                              onClick={() => {
                                setEditData(p);
                                setShowEditPopup(true);
                              }}
                              className="w-10 h-10 flex items-center justify-center 
                                       border border-gray-300 rounded-lg bg-white 
                                       hover:bg-blue-50 transition"
                            >
                              <FaEdit className="text-blue-600 text-lg" />
                            </button>

                            {/* <button
                              onClick={() => handleDelete(p.id)}
                              className="w-10 h-10 flex items-center justify-center 
                                       border border-gray-300 rounded-lg bg-white 
                                       hover:bg-red-50 transition"
                            >
                              <RiDeleteBin6Line className="text-red-600 text-lg" />
                            </button> */}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {loading && (
                <div className="py-3 text-center text-sm text-gray-500">
                  Loading...
                </div>
              )}
            </div>

            {/* MOBILE CARDS */}
            <div className="block md:hidden flex flex-col gap-4">
              {pumps.map((p, idx) => {
                const isLast = idx === pumps.length - 1;

                return (
                  <div
                    key={p.id}
                    ref={isLast ? lastCardRefMobile : null}
                    className="border rounded-lg shadow p-4 bg-white flex flex-col gap-3"
                  >
                    <div className="text-xl font-bold text-gray-800 border-b pb-1">
                      {p.pumpName}
                    </div>

                    <div className="text-sm text-gray-700 flex flex-col gap-1">
                      <p>
                        <b>City:</b> {p.cityId}
                      </p>
                      <p>
                        <b>Mobile:</b> {p.phone}
                      </p>
                      <p>
                        <b>Latitude:</b> {p.lat}
                      </p>
                      <p>
                        <b>Longitude:</b> {p.lng}
                      </p>

                      <p>
                        <b>Status:</b>
                        <span
                          className={
                            p.status === "active"
                              ? "bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold ml-2"
                              : "bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold ml-2"
                          }
                        >
                          {p.status}
                        </span>
                      </p>
                    </div>

                    <a
                      href={`https://www.google.com/maps?q=${p.lat},${p.lng}`}
                      target="_blank"
                      className="bg-blue-600 text-white py-2 rounded text-center hover:bg-blue-700"
                    >
                      Open Map
                    </a>

                    <button
                      onClick={() => handleCopy(p.lat, p.lng)}
                      className="bg-gray-900 text-white py-2 rounded hover:bg-gray-700"
                    >
                      Copy Link
                    </button>

                    <div className="flex justify-between mt-2 flex-col">
                      <button
                        onClick={() => {
                          setEditData(p);
                          setShowEditPopup(true);
                        }}
                        className="flex items-center justify-center gap-2 px-4 py-2 border rounded-lg bg-white hover:bg-blue-50"
                      >
                        <FaEdit className="text-blue-600" /> Edit
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* EDIT POPUP */}
      {showEditPopup && editData && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div
           ref={dropdownRef}
          className="bg-white p-6 rounded w-80 shadow relative">
            <button
              className="absolute top-2 right-2 text-red-600 text-2xl"
              onClick={() => setShowEditPopup(false)}
            >
              ×
            </button>

            <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
              <FaEdit /> Edit Pump
            </h2>

            {[
              { key: "cityId", label: "City" },
              { key: "pumpName", label: "Pump Name" },
              { key: "phone", label: "Mobile" },
              { key: "lat", label: "Latitude" },
              { key: "lng", label: "Longitude" },
            ].map((f) => (
              <input
                key={f.key}
                type="text"
                placeholder={f.label}
               maxLength={f.key === "phone" ? 10 : undefined}
                className="w-full border px-3 py-2 rounded mb-3"
                value={editData[f.key]}
                onChange={(e) =>
                  setEditData({ ...editData, [f.key]: e.target.value })
                }
              />
            ))}
            <select
              className="w-full border px-3 py-2 rounded mb-3"
              value={editData.status || "active"}
              onChange={(e) =>
                setEditData({ ...editData, status: e.target.value })
              }
            >
              {/* <option value="">Select Status</option> */}
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <button
              className="bg-green-600 text-white w-full py-2 rounded"
              onClick={handleSaveEdit}
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
