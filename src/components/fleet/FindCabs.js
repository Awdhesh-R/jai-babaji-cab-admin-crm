"use client";
import { use, useCallback, useEffect, useRef, useState } from "react";
import { FaCarSide } from "react-icons/fa6";
import { CiShop } from "react-icons/ci";
import { useRouter } from 'next/navigation';
import { CiLocationOn } from "react-icons/ci";
import { SlCursor } from "react-icons/sl";
import Image from "next/image";
import { apiClient } from "@/app/lib/apiClient";
import { useDispatch } from "react-redux";
import { setCabListInSlice } from "@/redux/features/findCabSlice";
import { toast } from "react-toastify";
import { FaUserClock } from "react-icons/fa";
import { PiCityThin } from "react-icons/pi";
import { getCabType } from "@/helpers/utils";
import { probableCab } from "@/services/rideManagement";




const DISTANCES = [5, 10, 20, 50, 100];
const cab_types = [
  { label: "mini", id: 1, img: "/mini.png" },  
  { label: "sedan", id: 2, img: "/sedan.png" },
  { label: "suv", id: 3, img: "/suv.png" },
];


export default function CabBookingSteps({urid}) {
  const [cabType, setCabType] = useState(null);
  const [distance, setDistance] = useState(null);
  const [category, setCategory] = useState(null);
  const [selectedRideIds, setSelectedRideIds] = useState([]);
  const [cabList, setCabList] = useState([]);
  const [showStep4, setShowStep4] = useState(false);
  const [rideDetails, setRideDetails] = useState();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [notificationSent, setNotificationSent] = useState(false);
  const [selectedType, setSelectedType] = useState("");


  const router = useRouter();
  const statusColors = {
    pending: 'bg-[#FFC107] text-white',
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

  const acceptedRide = {
    registration: "BR32 AB 1234",
    cab: "Sedan (swift dzire)",
    driver: "Abhishek Bunny",
    mobile: "+91-9693189968",
  };

  const fetchCabList = useCallback(async () => {
    // if(cabType && distance && category && urid) {
    // if(cabType && distance && category && urid && selectedType){
    if (
  cabType &&
  distance &&
  category &&
  urid &&
  (category !== "ownCabs" || selectedType)
)
{

      setLoading(true);
      try {
        const params = {
          urid,
          cabFrom: category,
          radius: distance,
          cab_type: cabType,
          // type: selectedType,
          ...(category === "ownCabs" && { type: selectedType }),
        }
        const response = await apiClient("POST", `/ride_management/search-cabs`, params);
        if(response.success || response.status) {
          setCabList(response.data);
        }
      } catch (e) {
        console.log(e)
      } finally {
        setLoading(false);
      }
    }
  },[cabType, distance, category, urid, selectedType]);

  useEffect(() => {
  fetchCabList();
}, [fetchCabList]);


  const fetchRideDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient("GET",  `/ride_management/rideDetails/${urid}`);
      if(response.status || response.success) {
        setRideDetails(response.data);
      } else setRideDetails(null);
    } catch (e) {
      console.log(e);
    }
  }, [urid])

  useEffect(()=> {
    // setShowStep4(prev => cabType && distance && category && urid);
//     setShowStep4(
//   cabType && distance && category && urid && selectedType
// );
setShowStep4(
  cabType &&
  distance &&
  category &&
  urid &&
  (category !== "ownCabs" || selectedType)
);


    // if(showStep4) {
    //   fetchCabList().then(()=>setLoading(false))
    // }
  }, [distance, cabType, category, urid, fetchCabList, showStep4]);

  useEffect(() => {
    if(!rideDetails) {
      fetchRideDetails();
    }
  }, [urid, rideDetails, fetchRideDetails]);

  const goToSecondPage = async () => {
    await dispatch(setCabListInSlice(cabList));
    localStorage.setItem("cabList", JSON.stringify(cabList))
    localStorage.setItem("cab_source", category)
    localStorage.setItem("radius", distance)
    localStorage.setItem("cab_type", cabType)
    localStorage.setItem("urid", urid)
    window.open(`/rbFleetManagement/Map/${urid}`, "_blank"); // path to the next page
  };

  const handleSendNotification = async () => {
    try {
      setIsProcessing(true);
      let tempArr = cabList.filter(cab=> selectedRideIds.includes(cab.id));
      const payload = {
        urid,
        type: "schedule",
        cabs: tempArr.map(cab=>({
          id: cab.id,
          driver_id: cab.driver_id,
          distance_km: cab.distance_km,
        })),
      }
      const response = await apiClient("POST", '/ride_management/send-booking-request', payload);
      if(response.success || response.status) {
        toast.success(response.message);
        router.refresh();
      } else {
        toast.error(response.message);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsProcessing(false);
    }
  }

  const handleCabClick = (cab) => {
    if(category === "Operator") {
      window.open(`fleetManagement/cabDetailsVerification?id=${cab.id}`,"_blank");
    } else { 
      window.open(`/driverForm/rodYaanDriverWallet/${cab.driver_id || cab["driver.id"]}`, "_blank");
    }
  }

const handleProbableCab = async (cab) => {
  const payload = {
    drv_name:
      cab?.cab_driver_details?.driverName || cab?.driver_name || cab?.driverName || "",

    cab_reg: cab?.cab_reg || "",
    cab_id: String(cab?.id || ""),
    urid: String(rideDetails?.urid || ""),

    driver_id: String(cab?.driver_id || ""),
    driver_mobile:
      cab?.cab_driver_details?.driverMobile || cab?.driver_mobile || cab?.driverMobile || "",
    drv_wa_number:
      cab?.cab_driver_details?.driverMobile || cab?.driver_mobile || cab?.driverMobile || cab?.drv_wa_number || "",

    driver_image: cab?.driver_image || cab?.driverImage || "",
    cab_model: cab?.cab_model || "",
    cab_source: cab?.cab_source || cab?.latestBooking?.cab_details_json?.cab_source || "RY",
    cab_type: cab?.cab_name?.toLowerCase() || cab?.cab_type || "",
    fleet_rate_per_km:
      cab?.fleet_rate_per_km || cab?.latestBooking?.fleet_rate_per_km || "",

    fleet_fixed_rate:
      cab?.fleet_fixed_rate || cab?.latestBooking?.fleet_fixed_rate || "",

  };

  // console.log("PROBABLE PAYLOAD FINAL:", payload);

  if (!payload.drv_name || !payload.cab_reg || !payload.cab_id || !payload.urid) {
    toast.error("Missing required data for probable cab");
    return;
  }

  try {
    const response = await apiClient(
      "POST",
      "/rb_cabs/addCabInProbabal",
      payload, 
      true
    );

    if (response?.success) {
      toast.success("Cab marked as probable!");
      fetchCabList();
    } else {
      toast.error(response?.message || "Failed to mark cab probable");
    }
  } catch (error) {
    toast.error(error.message || "Something went wrong");
  }
};



  return (
  <div className="p-4 sm:p-6 bg-white rounded-xl shadow-lg">
    {/* STEP 1 */}
      <div className="bg-white rounded-xl  shadow-lg overflow-auto  w-full">
        {/* TABLE HEADER */}
        <div className="flex items-center gap-2 justify-between p-4 border-b">
          <div className='w-full'>Ride ID</div>
          <div className='w-full'>Name</div>
          <div className='w-full'>Location</div>
          <div className='w-full'>Fare</div>
          <div className='w-full'>Highlights</div>
        </div>
          <div 
            className="flex items-center gap-2 border-b p-4 hover:bg-gray-50"
          >
            {/* 1st cell: Ride ID */}
            <div className="w-full">
              <div className="font-semibold text-gray-900">{rideDetails?.urid}</div>
              {/* <div className="text-xs text-gray-500">{rideDetails?.number}</div> */}
              <div className="text-xs text-gray-500">{rideDetails?.booking_travel_date}</div>
              <div className={`font-semibold text-gray-900 ${statusColors[rideDetails?.status]} capitalize text-center w-[90%] flex justify-center rounded-md`}>{rideDetails?.status}</div>

            </div>

            {/* Name */}
            <div className='w-full'>
              <div className="font-semibold text-gray-900">{rideDetails?.user_details_json?.name}</div>
              <div className="text-xs text-gray-500">{rideDetails?.user_details_json?.mobile}</div>
              {/* <div className="text-xs text-gray-500">Rating {rideDetails?.rating}</div> */}
            </div>

            {/* Location */}
            <div className='w-full'>
              <div className="font-semibold text-gray-800" >{rideDetails?.price_details_json?.estimated_km} Km</div>
              <div className="flex flex-col items-start">
                <div className="flex items-center">
                  <span className={`w-4 h-4 rounded-full border mr-5 bg-green-600 border-green-200`}></span>
                  <span className="text-gray-700 text-sm ">{rideDetails?.source_city_name}</span>
                </div>
                <div className="flex items-center">
                  <span className={`w-4 h-4 rounded-full border mr-5 bg-red-600 border-red-200`}></span>
                  <span className="text-gray-700 text-sm ">{rideDetails?.destination_city_name}</span>
                </div>
              </div>
            </div>

            {/* Fare */}
            <div className='w-full'>
              <div className="font-semibold text-gray-900 text-base ">₹{rideDetails?.price_details_json?.estimated_fare}/-</div>
              <div className="text-sm text-gray-500">{rideDetails?.service_type}</div>
            </div>

            {/* Highlights */}

            <div className='w-full'>
              <div className="flex flex-col gap-2">
                <span className="bg-gray-200 text-gray-800 text-sm px-3 py-2 rounded-md font-medium">{rideDetails?.cab_details_json?.cab_reg || "N/A "}</span>
                <div className="text-sm text-gray-500">{rideDetails?.cab_details_json?.cab_source}</div>
                
              </div>
            </div>
        </div>
      </div>

    <h2 className="flex flex-wrap items-center text-lg sm:text-xl font-semibold p-4 sm:p-6 gap-2 mb-6">
      <span className="bg-yellow-200 rounded px-2 py-1 font-bold text-sm sm:text-base text-yellow-800">
        Find
      </span>
      Your Perfect Cab - All Steps Active
    </h2>

    <p className="text-base font-semibold mb-3">Step 1 – Select Cab Type</p>

    <div className="flex flex-col sm:flex-row gap-4 w-full">
      {/* Own Cab */}
      <button
        onClick={() => setCategory("ownCabs")}
        className={`p-4 flex-1 flex flex-col items-center gap-3 border-2 rounded-xl transition text-center ${category === "ownCabs"
            ? "border-blue-500 bg-blue-50 shadow"
            : "border-gray-200 bg-white hover:border-blue-400"
          }`}
      >
        <div className="flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 w-20 h-20 sm:w-24 sm:h-24 shadow-lg">
          <FaCarSide className="text-white text-3xl sm:text-4xl" />
        </div>
        <span className="text-base sm:text-lg font-bold text-gray-900">Own Cab</span>
        <span className="text-gray-500 text-sm text-center">
          Select from your own fleet of cabs
        </span>
      </button>

      {/* Market Cab */}
      <button
        onClick={() => setCategory("Operator")}
        className={`p-4 flex-1 flex flex-col items-center gap-3 border-2 rounded-xl transition text-center ${category === "Operator"
            ? "border-pink-500 bg-pink-50 shadow"
            : "border-gray-200 bg-white hover:border-pink-400"
          }`}
      >
        <div className="flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 w-20 h-20 sm:w-24 sm:h-24 shadow-lg">
          <CiShop className="text-white text-3xl sm:text-4xl" />
        </div>
        <span className="text-base sm:text-lg font-bold text-gray-900">Market Cab</span>
        <span className="text-gray-500 text-sm text-center">
          <span className="bg-yellow-200 rounded px-1 font-bold text-yellow-800">
            Find
          </span>{" "}
          cabs from the marketplace
        </span>
      </button>
    </div>

    {/* TYPE SELECTION – only after Own Cab */}
           {category === "ownCabs" && (
  <div className="w-full mt-6">
    <p className="text-base font-semibold mb-3">
      Select Availability Type
    </p>

    <div className="flex gap-3">
      <button
        onClick={() => setSelectedType("nextAvailability")}
        className={`px-4 py-2 rounded-full font-medium ${
          selectedType === "nextAvailability"
            ? "bg-blue-600 text-white"
            : "bg-gray-200"
        }`}
      >
        Next Availability
      </button>

      <button
        onClick={() => setSelectedType("all")}
        className={`px-4 py-2 rounded-full font-medium ${
          selectedType === "all"
            ? "bg-blue-600 text-white"
            : "bg-gray-200"
        }`}
      >
        Free Cabs
      </button>
    </div>
  </div>
              )}


    {/* STEP 2 */}
    {/* {selectedType && category  &&( */}
    {category && (category !== "ownCabs" || selectedType) && (

      <div className="w-full mt-6">
        <p className="text-base font-semibold mb-3">Step 2 – Select Distance Range</p>
        <div className="flex flex-wrap gap-3 sm:gap-6">
          {DISTANCES.map((d) => (
            <button
              key={d}
              className={`px-4 py-2 rounded-full font-medium transition ${distance === d
                  ? "bg-green-600 text-white shadow"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"
                }`}
              onClick={() => setDistance(d)}
            >
              {d} Km
            </button>
          ))}
        </div>
      </div>
    )}

    {/* STEP 3 */}
    {category && distance && (
      <div className="w-full mt-6">
        <p className="text-base font-semibold mb-3">Step 3 – Select Cab Category</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(rideDetails && rideDetails?.estimatedFareList?.length > 0? rideDetails?.estimatedFareList: cab_types).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCabType(cat.id)}
              className={`flex flex-col items-center border-2 rounded-xl p-4 sm:px-6 sm:py-8 transition ${cabType === cat.id
                  ? "border-orange-400 bg-orange-50 shadow"
                  : "border-gray-200 bg-white hover:border-orange-300"
                }`}
            >
              <Image
                src={cat.cab_icon || "/images/CarImages.jpg"}
                alt={cat.cab_type || cat.label}
                width={100}
                height={100}
                className="rounded-lg object-contain h-24 w-52 border border-blue-200 "
              />
              <span className="font-semibold text-gray-700 mt-3">{cat.cab_type || cat.label}</span>
            </button>
          ))}
        </div>
      </div>
    )}

    {/* STEP 4 */}
    {showStep4 && (
      <div className="w-full mt-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
          <span className="text-base font-semibold">
            Step 4 - Available Cabs{" "}
            <span className="text-blue-600 font-medium ml-1 capitalize">
              ({cab_types.find(cab=> cab.id === cabType).label} within {distance} Km)
            </span>
          </span>
          <button
            onClick={goToSecondPage}
            className="flex items-center gap-2 bg-white rounded-full shadow px-4 py-2 border border-gray-100 hover:shadow-md hover:bg-gray-50 transition"
            >
              <Image
                src="/icons/googlemap.svg"
                alt="Google Maps"
                height={30}
                width={30}
              />
            <span className="text-gray-700 font-medium text-sm sm:text-base">Google Map</span>
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M9 5l7 7-7 7" strokeLinejoin="round" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-4 mb-8">
          {cabList.map((cab) => (
            <div
              key={cab.id}
              className={`flex flex-col sm:flex-row sm:items-center justify-between border-2 rounded-lg p-4 transition gap-3 ${selectedRideIds.includes(cab.id)
                  ? "border-green-400 bg-green-50 shadow"
                  : "border-gray-200 bg-white"
                }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 w-14 h-14 sm:w-16 sm:h-16 shadow-lg">
                  <FaCarSide className="text-white text-2xl sm:text-3xl" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-3 font-semibold text-gray-900">
                    <span className="capitalize" onClick={()=>{handleCabClick(cab)}}>{cab.registration_no || cab.cab_reg} ({cab.cab_model || "N/A"})</span>
                    <span className="flex items-center gap-1 text-green-700 text-sm sm:text-base">
                      <SlCursor />
                      <span>Distance: {cab?.distance_km? parseFloat(cab.distance_km).toFixed(2): "N/A"} Km</span>
                    </span>
                  </div>
                  <span className="capitalize">
                    {"Status: " +cab.ride_status ?? cab.booked_status}
                  </span>
                  <div className="flex flex-wrap items-center gap-1 text-sm sm:text-base text-gray-500">
                   <CiLocationOn className="text-red-900 text-lg" />
                   <span> Location: </span> 
                     <span>{cab.address}</span>
                  </div>
                  {category === "ownCabs" && (
                    <>
                  <div className="flex flex-wrap items-center gap-1 text-sm sm:text-base text-gray-500">
                   <FaUserClock className="text-red-900 text-lg" />
                       <span>
                          {selectedType === "nextAvailability"
                            ? "Next Available At :"
                            : "Free Since :"}
                        </span>

                         <span className="font-bold">
                             {selectedType === "nextAvailability"
                              ? cab?.json_cab_avability_details?.Next_avilable_time
                              : cab?.trip_end_time_ago  }
                          </span>

                   <span className="flex flex-wrap px-3 items-center gap-1 text-sm sm:text-base text-gray-500">
  <PiCityThin className="text-red-900 text-lg" />
  <span>
    {selectedType === "nextAvailability" ? "Next Availability City:" : "Current City:"}
  </span>
  <span className="font-bold ">
    {selectedType === "nextAvailability"
      ? cab?.json_cab_avability_details?.city_name
      : cab?.json_cab_avability_details?.city_name}
  </span>
                     </span>
                                       </div>

                  </>
                  )}
                  
                </div>
              </div>
              <div className="flex flex-col gap-5">
              <button
                className={`mt-2 sm:mt-0 px-4 py-2 rounded border transition font-semibold text-sm ${selectedRideIds.includes(cab.id)
                    ? "bg-white border-green-500 text-green-600 hover:bg-green-50"
                    : cab.distance_km
                    ? "bg-green-500 border-green-500 text-white hover:bg-green-600"
                    : "bg-gray-600 border-gray-500 text-gray-300 cursor-not-allowed"
                  }`}
                  disabled={!cab.distance_km}
                onClick={() => {
                  if (selectedRideIds.includes(cab.id)) {
                    setSelectedRideIds((prev) => prev.filter((rid) => rid !== cab.id));
                  } else {
                    setSelectedRideIds((prev) => [...prev, cab.id]);
                  }
                }}
              >
                {selectedRideIds.includes(cab.id) ? "Selected" : "Select"}
              </button>
              <button
                onClick={() => handleProbableCab(cab)}
                  className="mt-2 sm:mt-0 px-4 py-2 rounded border transition font-semibold text-sm bg-blue-500 text-white hover:bg-blue-700"
              >
                  Probable
               </button>
               </div>
            </div>

            
          ))}
        </div>

        <button
          className={`bg-green-600 hover:bg-green-700 text-white rounded-lg px-6 py-3 font-semibold w-full sm:w-auto mx-auto block transition shadow ${selectedRideIds.length === 0 || isProcessing || notificationSent
              ? "opacity-60 cursor-not-allowed"
              : ""
            }`}
          disabled={selectedRideIds.length === 0 || isProcessing || notificationSent}
          onClick={() => handleSendNotification()}
        >
          {isProcessing ? "Waiting for response..." : "Send Notification"}
        </button>
      </div>
    )}

    {/* SUCCESS MODAL */}
    {showSuccess && (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-2xl w-full max-w-md text-center relative">
          <div className="mb-6 flex justify-center">
            <div className="bg-green-100 rounded-full p-4 flex items-center justify-center">
              <svg width="48" height="48" fill="none">
                <circle cx="24" cy="24" r="24" fill="#4ade80" />
                <path
                  d="M17 25.5l7 7 14-14"
                  stroke="#fff"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <div className="font-semibold text-xl sm:text-2xl mb-4 text-gray-900">
            Congratulations Ride Accepted
          </div>
          <div className="mb-2 text-gray-700 text-sm sm:text-base">
            Registration:{" "}
            <span className="text-blue-600 font-medium underline cursor-pointer">
              {acceptedRide.registration}
            </span>
            , Cab:{" "}
            <span className="text-blue-600 font-medium underline cursor-pointer">
              {acceptedRide.cab}
            </span>
          </div>
          <div className="mb-5 text-gray-700 text-sm sm:text-base">
            Driver Name:{" "}
            <span className="text-blue-600 font-medium underline cursor-pointer">
              {acceptedRide.driver}
            </span>
            , Mobile no:{" "}
            <span className="text-green-700 font-medium">{acceptedRide.mobile}</span>
          </div>
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold text-base sm:text-lg mt-2 shadow"
            onClick={() => setShowSuccess(false)}
          >
            Continue
          </button>
        </div>
      </div>
    )}
  </div>

  );
}
