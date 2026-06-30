'use client';

import { apiClient } from "@/app/lib/apiClient";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import { FaSpinner } from "react-icons/fa";

export default function DriverSelectionModal({ open, onClose, onConfirm, title, id }) {

  const [selectedId, setSelectedId] = useState();
  const [driver, setDriver] = useState();
  const [loading, setLoading] = useState(false);
  // Force Assign Popup
const [forcePopup, setForcePopup] = useState(false);
const [pendingData, setPendingData] = useState(null);

  const [driverList, setDriverList] = useState([]);
  const [filteredDrivers, setFilteredDriverList] = useState([]);

  const [search, setSearch] = useState("");
  const [errorMsg, setErrorMsg] = useState("");


  const fetchAllDriver = async () => {
    try {
      setLoading(true);
      const res = await apiClient("GET", `/rb_drivers/getAllDriver`);
      if(res.success) {
        setDriverList(res.data);
        // setFilteredDriverList(res.data);
      }
    } catch (err) {
      toast.error("Unable to fetch Driver List!");
    } finally {
      setLoading(false);
    }

  }

  useEffect(()=>{
    if(open) {
      fetchAllDriver();
    }
  },[open]);

  useEffect(()=>{
    if(search) {
      let arr = [...driverList].filter(d => 
        d.driverName.toLowerCase().includes(search.toLowerCase()) ||
        d.driverMobile.includes(search)); 
        setFilteredDriverList([...arr]);
    } else {
      setFilteredDriverList(driverList);
    }
  }, [search, driverList]);

  
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // const handleConfirm = async () => {
  //   try {
  //     setLoading(true);
  //     const res = await apiClient("PUT", `/rb_cabs/assignDriverToCab/${id}`, {
  //       driver_id: driver.id,
  //       cab_driver_details: {
  //         driverName: driver.driverName,
  //         driverMobile: driver.driverMobile
  //       },
  //       force:"true"
  //     });
  //     if(res.success || res.status) {
  //       onConfirm && onConfirm();
  //       toast.success(res.message);
  //       onClose && onClose();
  //     } else {
  //       toast.error(res.message);
  //     }
  //   } catch (err) {
  //     toast.error("something went wrong!");
  //   } finally {
  //     setLoading(false);
  //     setDriver();
  //   }
  // }


//   const handleConfirm = async () => {
//   try {
//     setLoading(true);

//     const res = await apiClient("PUT", `/rb_cabs/assignDriverToCab/${id}`, {
//       driver_id: driver.id,
//       cab_driver_details: {
//         driverName: driver.driverName,
//         driverMobile: driver.driverMobile
//       }
//     });

//     // If assigned successfully
//     if (res.success || res.status) {
//       onConfirm && onConfirm();
//       onClose && onClose();
//       return;
//     }

//     // Otherwise open confirmation popup
//     setPendingData({
//       driver_id: driver.id,
//       cab_driver_details: {
//         driverName: driver.driverName,
//         driverMobile: driver.driverMobile
//       }
//     });

//     setForcePopup(true);

//   } catch (err) {

//     // also open popup on failure
//     setPendingData({
//       driver_id: driver.id,
//       cab_driver_details: {
//         driverName: driver.driverName,
//         driverMobile: driver.driverMobile
//       }
//     });

//     setForcePopup(true);

//   } finally {
//     setLoading(false);
//   }
// };

const handleConfirm = async () => {
  try {
    setLoading(true);

    const res = await apiClient("PUT", `/rb_cabs/assignDriverToCab/${id}`, {
      driver_id: driver.id,
      cab_driver_details: {
        driverName: driver.driverName,
        driverMobile: driver.driverMobile
      }
    });

    // SUCCESS → normal close
    if (res.success || res.status) {
      onConfirm && onConfirm();
      onClose && onClose();
      return;
    }

    // ❌ ERROR → popup open + error message show
    setErrorMsg(res.message || "Driver Already Assigned!");
    setPendingData({
      driver_id: driver.id,
      cab_driver_details: {
        driverName: driver.driverName,
        driverMobile: driver.driverMobile
      }
    });
    setForcePopup(true);

  } catch (err) {

    // ❌ Server crash or catch error
    setErrorMsg(err.response?.data?.message || "Driver Already Assigned");
    setPendingData({
      driver_id: driver.id,
      cab_driver_details: {
        driverName: driver.driverName,
        driverMobile: driver.driverMobile
      }
    });
    setForcePopup(true);

  } finally {
    setLoading(false);
  }
};


const handleForceAssign = async () => {
  try {
    setLoading(true);

    const res = await apiClient("PUT", `/rb_cabs/assignDriverToCab/${id}`, {
      ...pendingData,
      force: "true"
    });

    if (res.success || res.status) {
      setForcePopup(false);
      onConfirm && onConfirm();
      onClose && onClose();
    }

  } catch (e) {
    console.log(e);
  } finally {
    setLoading(false);
  }
};

  if (!open) return null; 

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-[500px] max-w-full relative">
        <div className="flex items-center gap-3 mb-5">
          <span className="text-lg text-red-600 font-semibold bg-red-100 rounded px-3 py-1">
            {title}
          </span>
          <input
            type="text"
            className="flex-1 border border-gray-200 rounded text-sm px-3 py-2 outline-none"
            placeholder="Search driver by name & mobile number"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="space-y-3 mb-6 overflow-x-auto max-h-[70vh]">
          {!loading && filteredDrivers.map((driver, idx) => (
            <div
              key={driver.id || idx}
              className={
                "flex items-center rounded-xl px-4 py-3 cursor-pointer border " +
                (selectedId === driver.id
                  ? "bg-green-50 border-green-400"
                  : "bg-white border-gray-200 hover:bg-gray-50")
              }
              onClick={() => {setSelectedId(driver.id); setDriver(driver);}}
            >
              <Image
                src='/images/kumar.jpg'
                alt='driver images'
                width={50}
                height={50}
                className="rounded-full object-cover"
              />
              <div className="ml-4 flex-1">
                <div className="font-semibold text-base text-gray-800">{driver.driverName}</div>
                <div className="text-gray-500 text-sm">{driver.driverMobile}</div>
              </div>
              {(selectedId && selectedId=== driver.id) && (
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="11" fill="#EAFAEF" />
                  <path d="M8.5 12.5l2 2 4-4" stroke="#22C55E" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          ))}
          {
            loading && <FaSpinner/>
          }
        </div>
        <div className="flex justify-end items-center mt-3 gap-2">
          <button
            className="border border-gray-300 rounded-lg px-6 py-2 font-semibold text-gray-700 bg-white hover:bg-gray-50"
            onClick={() => {
              setDriver();
              onClose && onClose();
            }}
          >
            Cancel
          </button>
          <button
            className="rounded-lg px-6 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700"
            onClick={() => handleConfirm()}
          >
            Confirm
          </button>
          
        </div>

        {/* {forcePopup && (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[999]">
    <div className="bg-white p-6 rounded-xl w-[350px] text-center shadow-xl">

      <h2 className="text-lg font-bold text-red-600">Driver Already Assigned </h2>
      <p className="mt-2 text-gray-700">to cab. Use force: true to reassign?</p>

      <div className="flex justify-center gap-4 mt-6">
        <button
          className="px-6 py-2 bg-gray-200 rounded-lg font-semibold"
          onClick={() => setForcePopup(false)}
        >
          No
        </button>

        <button
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold"
          onClick={handleForceAssign}
        >
          Yes
        </button>
      </div>

    </div>
  </div>
)} */}


{forcePopup && (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[999]">
    <div className="bg-white p-6 rounded-xl w-[350px] text-center shadow-xl">

      <h2 className="text-lg font-bold text-red-600">
        {errorMsg || "Driver Already Assigned"}
      </h2>

      <p className="mt-2 text-gray-700">
        Use force: true to reassign?
      </p>

      <div className="flex justify-center gap-4 mt-6">
        <button
          className="px-6 py-2 bg-gray-200 rounded-lg font-semibold"
          onClick={() => setForcePopup(false)}
        >
          No
        </button>

        <button
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold"
          onClick={handleForceAssign}
        >
          Force Assign
        </button>
      </div>

    </div>
  </div>
)}


      </div>
    </div>
    

    
  );
}