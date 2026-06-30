'use client';
import React, { useEffect, useState } from 'react';
import { FaBell, FaCaretDown, FaPlus, FaRegBell } from "react-icons/fa";
import { LuMessageSquare } from 'react-icons/lu';
import { apiClient } from '@/app/lib/apiClient';
import moment from 'moment';
import { Loader } from 'lucide-react';
import { toast } from 'react-toastify';


  const statusColors = {
    pending: 'bg-[#FFC107]  text-white',
    probabal:'bg-[#FFC107]  text-white',
    processing:'bg-[#FFC107] text-white',
    taxiPool: 'bg-[#03A9F4] text-white',
    confirmed: 'bg-[#009688] text-white',
    assigned: 'bg-[#3F51B5] text-white',
    arrived: 'bg-[#673AB7] text-white',
    started: 'bg-[#1B59F8] text-white',
    completed: 'bg-[#16A34A] text-white',
    cancelled: 'bg-[#F44336] text-white',
    cabFound: 'bg-[#8BC34A] text-white',
    needCab: 'bg-[#FF9800] text-white',
    cancellation: 'bg-[#E57373] text-white',
    linkSent: 'bg-[#00BCD4] text-white',
    all: 'bg-[#9E9E9E] text-white',
    notVerified: 'bg-[#FFB300] text-white',
    activeRides: 'bg-[#1E88E5] text-white',
};

const statusTextColors = {
    pending: 'text-[#FFC107]',
    processing:'text-[#FFC107]',
    probabal:'text-[#FFC107]',
    taxiPool: 'text-[#03A9F4]',
    confirmed: 'text-[#009688]',
    assigned: 'text-[#3F51B5]',
    arrived: 'text-[#673AB7]',
    started: 'text-[#1B59F8]',
    completed: 'text-[#16A34A]',
    cancelled: 'text-[#F44336]',
    cabFound: 'text-[#8BC34A]',
    needCab: 'text-[#FF9800]',
    cancellation: 'text-[#E57373]',
    linkSent: 'text-[#00BCD4]',
    all: 'text-[#9E9E9E]',
    notVerified: 'text-[#FFB300]',
    activeRides: 'text-[#1E88E5]',
};

const PARENT_HIDE_LIST = [
  "booking source coordinates",
  "booking destination coordinates",
  "cab type id",
  "near ct id",
  "price details json",
];

const CHILD_HIDE_LIST = [
  "booking source coordinates - coordinates",
  "booking destination coordinates - coordinates",

  "location details - source",
  "location details - destination",

  "passenger details json - adults",
  "passenger details json - children",
  "passenger details json - luggage small",
  "passenger details json - luggage big",

  "price details json - advance amount",
  "price details json - estimated fare",
  "price details json - collected by driver",
];

// function getActivityIcon(title) {
//   title = title.toLowerCase();

//   if (title.includes("location")) return <MdEditLocationAlt className="text-white" />;
//   if (title.includes("booked")) return <FaCarSide className="text-white" />;
//   if (title.includes("called")) return <MdCall className="text-white" />;

//   return <FaCarSide className="text-white" />; // default
// }

// Normalize values for output

function normalize(val) {
  if (
    val === "" ||
    val === "0" ||
    val === 0 ||
    val === null ||
    val === undefined
  )
    return null;

  if (Array.isArray(val)) return val.join(", ");

  if (typeof val === "object") {
    if (val.source && val.destination) {
      return `Source: ${val.source} | Destination: ${val.destination}`;
    }
    if (val.coordinates) {
      return `(${val.coordinates[0]}, ${val.coordinates[1]})`;
    }
    return Object.entries(val)
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ");
  }

  return val;
}

// Deep compare old vs new (ignores 0, empty, null)
function isSame(oldVal, newVal) {
  const clean = (obj) => {
    if (
      obj === null ||
      obj === undefined ||
      obj === "" ||
      obj === "0" ||
      obj === 0
    )
      return null;

    if (typeof obj === "object") {
      const sorted = Object.keys(obj)
        .sort()
        .reduce((acc, key) => {
          const v = obj[key];
          if (v !== 0 && v !== "0" && v !== null && v !== "") {
            acc[key] = v;
          }
          return acc;
        }, {});
      return JSON.stringify(sorted);
    }

    return obj;
  };

  return clean(oldVal) === clean(newVal);
}

// newchange

function extractPlainText(remark) {
  if (!remark || typeof remark !== "string") return ""; // 🔥 Safe guard

  const jsonStart = remark.indexOf("{");
  if (jsonStart === -1) return remark.trim();
  let text = remark.slice(0, jsonStart).trim();

  text = text.replace(/pending:/i, "").trim();
  text = text.replace(/confirmed:/i, "").trim();
  text = text.replace(/with field/i, "").trim();

  return text;
}


function parseOldNewFields(remark) {
  try {
    const start = remark.indexOf("{");
    if (start === -1) return [];

    const raw = JSON.parse(remark.slice(start));
    const rows = [];

    const cleanKey = (k) =>
      k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

    // const pushRow = (label, oldVal, newVal) => {

    //     if (CHILD_HIDE_LIST.some(h => label.toLowerCase().startsWith(h))) return;

    //   // Remove empty
    //   if (oldVal === "" || oldVal === "0" || oldVal === 0) oldVal = null;
    //   if (newVal === "" || newVal === "0" || newVal === 0) newVal = null;

    //   // Skip unchanged
    //   if (isSame(oldVal, newVal)) return;

    //   const oldV = normalize(oldVal);
    //   const newV = normalize(newVal);

    //   if (!oldV && !newV) return;

    //   rows.push({
    //     label,
    //     old: oldV,
    //     new: newV,
    //   });
    // };

    const pushRow = (label, oldVal, newVal) => {
      const lower = label.toLowerCase().trim();

      
      if (PARENT_HIDE_LIST.includes(lower)) return;

      if (CHILD_HIDE_LIST.some((h) => lower.startsWith(h))) return;

      if (!oldVal || oldVal === "" || oldVal === "0") oldVal = null;
      if (!newVal || newVal === "" || newVal === "0") newVal = null;

      if (isSame(oldVal, newVal)) return;

      const oldV = normalize(oldVal);
      const newV = normalize(newVal);

      if (!oldV && !newV) return;

      rows.push({ label, old: oldV, new: newV });
    };

    Object.entries(raw).forEach(([key, value]) => {
      const mainLabel = cleanKey(key);

      if (
        value &&
        typeof value === "object" &&
        ("old" in value || "new" in value)
      ) {
        const oldObj = value.old || {};
        const newObj = value.new || {};

        pushRow(mainLabel, value.old, value.new);

        if (typeof newObj === "object") {
          Object.entries(newObj).forEach(([innerKey, newVal]) => {
            const oldVal = oldObj ? oldObj[innerKey] : null;

            pushRow(`${mainLabel} - ${cleanKey(innerKey)}`, oldVal, newVal);
          });
        }
      }
    });

    return rows;
  } catch (e) {
    console.log("PARSE ERROR:", e);
    return [];
  }
}

const AddRemarksSection = ({
  rideDetails,
  activityData,
  SetIsOpenAdRemarksSection,
  isAddremarksSectionOpen,
  showHeader = true,
}) => {
//   const statusTextColors = {
//     pending: "text-[#FFC107]",
//     processing: "text-[#FFC107]",
//     taxiPool: "text-[#03A9F4]",
//     confirmed: "text-[#009688]",
//     assigned: "text-[#3F51B5]",
//     arrived: "text-[#673AB7]",
//     started: "text-[#1B59F8]",
//     completed: "text-[#16A34A]",
//     cancelled: "text-[#F44336]",
//     cabFound: "text-[#8BC34A]",
//     needCab: "text-[#FF9800]",
//     cancellation: "text-[#E57373]",
//     linkSent: "text-[#00BCD4]",
//     probabal: "text-[#FFC107]",
//     all: "text-[#9E9E9E]",
//     notVerified: "text-[#FFB300]",
//     activeRides: "text-[#1E88E5]",
//   };

//   const statusColors = {
//     pending: "bg-[#FFC107]  text-white",
//     processing: "bg-[#FFC107] text-white",
//     taxiPool: "bg-[#03A9F4] text-white",
//     confirmed: "bg-[#009688] text-white",
//     assigned: "bg-[#3F51B5] text-white",
//     arrived: "bg-[#673AB7] text-white",
//     started: "bg-[#1B59F8] text-white",
//     completed: "bg-[#16A34A] text-white",
//     cancelled: "bg-[#F44336] text-white",
//     cabFound: "bg-[#8BC34A] text-white",
//     needCab: "bg-[#FF9800] text-white",
//     cancellation: "bg-[#E57373] text-white",
//     linkSent: "bg-[#00BCD4] text-white",
//     probabal: "bg-[#FFC107] text-white",
//     all: "bg-[#9E9E9E] text-white",
//     notVerified: "bg-[#FFB300] text-white",
//     activeRides: "bg-[#1E88E5] text-white",
//   };

  const [loadingRideActivity, setLoadingRideActivity] = useState(false);
  const [rideActivityList, setRideActivityList] = useState([]);
  const [inputRemark, setInputRemark] = useState("");

  const handleRemarksInput = (e) => {
    console.log(e.target.value);
    const value = e.target.value;
    setInputRemark(value);
  };

  const fetchRideActivity = async (urid) => {
    try {
      setLoadingRideActivity(true);
      const res = await apiClient(
        "GET",
        `/ride_management/rideActivityHistoryList/${urid.toString()}`
      );
      if (res.success || res.status) {
        setRideActivityList(res.data);
      } else {
        setRideActivityList([]);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingRideActivity(false);
    }
  };
  const handleAddRemarks = async () => {
    try {
      setLoadingRideActivity(true);
      let payData = {
        urid: rideDetails?.urid || rideDetails?.id,
        remark: inputRemark,
      };
      const response = await apiClient(
        "POST",
        "/ride_management/addRemark",
        payData,
        true
      );
      if (response?.success) {
        fetchRideActivity(rideDetails?.urid || rideDetails?.id);
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingRideActivity(false);
      setInputRemark("");
    }
  };

  // useEffect(() => {
  //   if (activityData?.length > 0) {
  //     setRideActivityList(activityData);
  //   } else {
  //     if (rideDetails && rideDetails.urid) fetchRideActivity(rideDetails.urid);
  //   }
  // }, [rideDetails, activityData]);

  useEffect(() => {
  if (!rideDetails) return;

  const key = rideDetails.urid || rideDetails.id;

  console.log("Calling Activity API with:", key);

  if (key) {
    fetchRideActivity(key);
  }
}, [rideDetails]);


  return (
    <div className={`w-full overflow-hidden shadow-md mx-2 rounded-md `}>
      {showHeader && (
        <div
          className={`${
            isAddremarksSectionOpen ? "rounded-t-md" : "rounded-md "
          } flex flex-wrap md:flex-nowrap items-start md:items-center justify-between text-sm p-4 transition-colors bg-gradient-to-r from-[#3B82F6] to-[#6366F1] dark:from-[#3B82F6] dark:to-[#6366F1]`}
        >
          <div className="flex flex-col gap-4 flex-1">
            <div className="flex flex-wrap items-center gap-3 md:gap-4">
              <div className="bg-white/20 p-2 rounded-lg shadow-lg">
                <LuMessageSquare className="text-white" />
              </div>
              <span className="text-lg font-semibold text-white">
                Activity History and Remarks
              </span>
            </div>
          </div>
          <button
            className="mt-4 md:mt-0 text-white"
            onClick={() => SetIsOpenAdRemarksSection(!isAddremarksSectionOpen)}
          >
            <FaCaretDown
              className={`text-2xl transform transition-transform duration-300 ${
                isAddremarksSectionOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      )}
      {isAddremarksSectionOpen && (
        <div className="bg-white rounded-b-md p-4">
          <div className="flex gap-3 w-full">
            <div
              className={
                showHeader ? "border-black border p-4 rounded-lg w-full" : ""
              }
            >
              <div className="border-l-4 pl-4 border-[#005FE2] text-gray-700 font-bold">
                Activity History
              </div>
              {!loadingRideActivity ? (
                <div className="py-4 flex w-full flex-col gap-3">
                  {rideActivityList.length > 0 ? (
                    rideActivityList?.map((activity) => (
                      // <div key={activity.id} className='flex gap-2 w-full items-center'>
                      //     <div className={`w-8 h-8 p-2 flex items-center text-center rounded-[50%] text-white ${statusColors[activity?.activity_status]}`}>
                      //         <FaRegBell className=''/>
                      //     </div>
                      //     <div>
                      //         <p className='capitalize text-gray-600 w-full break-all'><span className={` ${statusTextColors[activity?.activity_status?.toLowerCase()]}`}>{activity.activity_status}:</span> {activity.remark}</p>
                      //         <p className='capitalize text-gray-500'>{moment(activity.created_at).add(5.5, "hours").format("DD MMM YYYY, hh:mm A")} {activity.user_type}</p>
                      //     </div>
                      // </div>
                      <div key={activity.id} className="bg-white  p-1 ">
                        {/* STATUS + TITLE */}
                        <div className="flex items-center gap-3 ">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                              statusColors[activity.activity_status]
                            }`}
                          >
                            <FaBell />
                          </div>

                          {/* <p className="text-lg font-semibold text-gray-800 capitalize">
                            {activity.activity_status}
                          </p> */}
                          <p
                            className={`text-lg font-semibold capitalize ${
                              statusTextColors[activity.activity_status] ||
                              "text-gray-800"
                            }`}
                          >
                            {activity.activity_status}
                          </p>
                        </div>

                       
                        <p className="text-sm text-gray-700 ml-12 ">
                          {extractPlainText(activity.remark)}
                        </p>

                        <div className="ml-12 flex flex-col gap-1">
                          {parseOldNewFields(activity.remark).map(
                            (row, idx) => (
                              <p key={idx} className="text-sm text-gray-700">
                                <span className="font-semibold">
                                  {row.label}:
                                </span>{" "}
                                <span className="text-red-500 font-medium">
                                  Old: {row.old}
                                </span>{" "}
                                <span className="text-gray-400">→</span>{" "}
                                <span className="text-green-600 font-semibold">
                                  New: {row.new}
                                </span>
                                ,
                              </p>
                            )
                          )}
                        </div>

                     
                        <p className="text-sm text-gray-500 ml-12">
                          {moment(activity.created_at)
                            .add(5.5, "hours")
                            .format("DD MMM YYYY, hh:mm A")}{" "}
                          • {activity.created_by_name}
                        </p>
                      </div>
                    ))
                  ) : (
                    <>No Ride History Available</>
                  )}
                </div>
              ) : (
                <div className="w-full flex justify-center items-center">
                  <Loader className="animate-spin duration-500 w-12 h-12 text-blue-500" />
                </div>
              )}
            </div>
            {/* <div className='border-black border p-4  rounded-lg w-full flex flex-col gap-3'>
                        <div className='border-l-4 pl-4 border-[#005FE2] text-gray-700 font-bold'>New Remark</div>
                        {!loadingRideActivity ? <div className='flex flex-col gap-3'>
                            <textarea placeholder='Type your remark' maxLength={275} className='w-full border border-black p-2 rounded-lg' rows={5} value={inputRemark} onChange={handleRemarksInput} />
                            <button onClick={handleAddRemarks} className='bg-[linear-gradient(90deg,_#22C55E_0%,_#105F2D_100%)] font-bold text-white p-2 flex items-center justify-center gap-2 rounded-lg shadow-lg'><FaPlus className='text-white'/> Add Remark</button>
                        </div>
                        : <div className='w-full flex justify-center items-center'><Loader className='animate-spin duration-500 w-12 h-12 text-blue-500'/></div>}
                    </div> */}
          </div>
        </div>
      )}
    </div>
  );
};
export default AddRemarksSection;