"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";
import { FaMapMarkerAlt, FaUser, FaClock, FaRoad, FaCar } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";

import { FiArrowRightCircle } from "react-icons/fi";
import { BsWallet } from "react-icons/bs";
import { FaArrowTrendUp } from "react-icons/fa6";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { apiClient } from "@/app/lib/apiClient";
import { toast } from "react-toastify";

function estimatedTimeDisplay(timeStr) {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":").map(Number);
  if (h === 0) return `${m}min`;
  return `${h}:${m.toString().padStart(2, "0")} min`;
}

// function StatusBadge({ status }) {
//   const color =
//     status === "Completed"
//       ? "bg-green-100 text-green-700"
//       : status === "Upcoming"
//       ? "bg-blue-100 text-blue-700"
//       : "bg-red-100 text-red-700";
//   return (
//     <span className={`px-3 py-1 rounded-full text-xs font-semibold ${color}`}>
//       {status}
//     </span>
//   );
// }

function RideCard({ ride }) {
  const router = useRouter();

  const baseImageUrl =
    process.env.NEXT_IMG_BASE_URL || "https://api.jaibabajicab.com";

  const imageUrl = ride.driver_details_json?.driver_image
    ? `${baseImageUrl}/uploads/driver_docs/${ride.driver_details_json.driver_image}`
    : "/images/cab-captian-avator-default.png";

  const handleViewDetails = () => {
    // Replace '/fleetDetails' with actual path to FleetRideDetails page
    // Tum yaha ride id ya koi param bhi de sakte ho
    router.push(`/ridesManagement/details?urid=${ride?.urid}`);
  };

  const [expandedField, setExpandedField] = useState(null);
  const handleExpand = (field) => {
    setExpandedField(expandedField === field ? null : field);
  };

  const bookingType = ride.booking_type?.toLowerCase();

  let carImage = "/nxtAdmin/public/images/rbDriverBg.png"; // Default image agar koi match na ho

  if (bookingType === "mini") carImage = "/images/mini-car.png";
  else if (bookingType === "sedan") carImage = "/images/sedan-car.png";
  else if (bookingType === "suv") carImage = "/images/suv-car.png";
  return (
    // -------------old code
    // <div className="bg-white rounded-2xl gap-1 shadow border border-gray-100 p-5 flex justify-between items-start mb-6">
    //   {/* Left side: details */}
    //   <div className="flex justify-between items-start gap-10">
    //     {/* Left: Status, Route, Date/Time/Distance */}
    //     <div className="flex flex-col">
    //       <div className="flex items-center gap-10 mb-1">
    //         <StatusBadge status={ride.status} />
    //       </div>
    //       <div className="font-bold text-xl text-gray-800 flex items-center gap-3">
    //         <FaMapMarkerAlt className="text-gray-400" />
    //         <span>{ride.location_details?.source || "N/A"}</span>
    //         <span className="mx-2 font-normal text-gray-400">
    //           <FaArrowRight />
    //         </span>
    //         <span>{ride.location_details?.destination || "N/A"}</span>
    //       </div>

    //       <div className="flex items-center gap-20 text-gray-500 text-sm mt-3">
    //         <span className="flex items-center gap-8">
    //           <span className="flex items-center gap-3">
    //             <FaClock className="text-gray-400" />
    //             {new Date(ride.booking_travel_date).toLocaleDateString()} &bull; {ride.price_details_json?.estimated_time || "N/A"} &bull; {ride.price_details_json?.estimated_km || "N/A"} km
    //           </span>
    //           <span className="mx-1">&bull; {ride.time}</span>
    //           <span className="mx-1">&bull; {ride.distance}</span>
    //         </span>
    //       </div>
    //     </div>

    //     {/* Right: Driver and car details */}
    //     <div className="flex flex-col  gap-1 mt-8 text-base ml-auto">
    //       {/* Driver */}
    //       <div className="flex items-center gap-2 text-xl font-semibold text-gray-700">
    //         <FaUser className="text-gray-400" />
    //         {ride.driver_details_json?.drv_name || "N/A"}
    //         <span className="ml-2  font-medium text-gray-400">
    //           {ride.driver_details_json?.driver_mobile || "N/A"}
    //         </span>
    //       </div>

    //       {/* Car */}
    //       <div className="flex items-center gap-2 font-semibold text-gray-400 text-sm mt-1">
    //         <FaCar className="text-gray-400" />
    //         {ride.cab_details_json?.cab_reg || ride.booking_type || "N/A"}
    //       </div>
    //     </div>
    //   </div>

    //   {/* Right side: fare and details btn */}
    //   <div className="flex flex-col items-end gap-4 min-w-[110px]">
    //     <span className="bg-gradient-to-r from-green-400 to-green-700 text-white font-bold w-[90px] text-center py-2 rounded-lg text-base mb-2">
    //       ₹{ride.price_details_json?.final_fare || "N/A"}
    //     </span>
    //     {/* <button className="bg-white border border-blue-200 rounded-lg px-5 py-1.5 text-base font-semibold text-blue-700 shadow hover:bg-blue-50 transition">
    //      <span> View Details<FiArrowRightCircle /></span>
    //     </button> */}
    //     <button
    //       onClick={handleViewDetails}
    //       className="bg-white border border-blue-200 rounded-lg px-1 py-1 text-base font-semibold text-blue-700 shadow hover:bg-blue-50 transition flex items-center gap-2"
    //     >
    //       <span>View Details</span>
    //       <FiArrowRightCircle />
    //     </button>
    //   </div>
    // </div>
    // -------------old code

    // <div className="bg-white rounded-2xl gap-1 shadow border border-gray-100 p-5 flex justify-between items-start mb-6">
    <div
      className="
    bg-white rounded-xl shadow border border-gray-100 p-3 flex flex-col gap-4 mb-4
    lg:bg-white lg:rounded-2xl lg:gap-1 lg:shadow lg:border lg:border-gray-100 lg:p-5 lg:flex lg:justify-between lg:items-start lg:mb-6
  "
    >
      {/* Left side: details */}
      <div className="lg:flex lg:justify-between lg:items-start lg:gap-10 lg:w-full">
        {/* Left: Status, Route, Date/Time/Distance */}
        <div className="flex flex-col basis-full sm:basis-1/2 lg:flex lg:flex-col lg:basis-2/5">
          <div className="block mb-2 lg:flex lg:items-center lg:gap-10 lg:mb-1 ">
            <StatusBadge status={ride.status} />
          </div>
          {/* <div className="font-bold text-xl text-gray-800 flex items-center gap-3"> */}
          <div
            className="text-xs text-gray-600 cursor-default sm:text-sm sm:text-gray-600
                lg:font-bold lg:text-xl lg:text-gray-800 lg:gap-3 lg:cursor-pointer lg:flex lg:items-center lg:gap-3"
          >
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-red-600" />
              <span
                className="truncate max-w-[120px]"
                title={ride.location_details?.source}
              >
                {ride.location_details?.source || "N/A"}
              </span>
              <span className="mx-2 font-normal text-gray-400">
                <FaArrowRight />
              </span>
            </div>

            <div className="flex items-center gap-2 mt-2 lg:mt-0 lg:ml-4">
              <FaMapMarkerAlt className="text-green-600" />
              <span
                className="truncate max-w-[150px]"
                title={ride.location_details?.destination}
              >
                {ride.location_details?.destination || "N/A"}
              </span>
            </div>
          </div>

          {/* ------------old times  */}
          {/* <div className="flex items-center gap-20 text-gray-500 text-sm mt-3">
        <span className="flex items-center gap-8">
          <span className="flex items-center gap-3" title={new Date(ride.booking_travel_date).toLocaleDateString()}>
            <FaClock className="text-gray-400" />
            {new Date(ride.booking_travel_date).toLocaleDateString()} 
          </span>
          <span className="mx-1">&bull; {ride.price_details_json?.estimated_time}</span>
          <span className="mx-1">&bull; {ride.price_details_json?.estimated_km } km</span>
        </span>
      </div> */}
          {/* ------------old times  */}

          {/* ------------new time times  */}
          {/* <div className="lg:flex lg:items-center lg:gap-20 lg:text-gray-500 lg:text-sm lg:mt-3"> */}
          {/* <div
            className="text-[10px] sm:text-xs md:text-sm text-gray-600 flex flex-col gap-1
                sm:flex sm:flex-row sm:items-center sm:gap-4 sm:text-xs
                lg:flex lg:gap-10 lg:text-gray-500 lg:text-sm lg:mt-3"
          >
            <span className="flex items-center gap-2 mt-2 ">
              <FaClock className="text-gray-400 sm:text-lg" />
              {new Date(ride.booking_travel_date).toLocaleString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </span>

            <span className="mx-1 flex items-center gap-1">
              &bull;
              <span className="text-xs font-medium">
                {estimatedTimeDisplay(ride.price_details_json?.estimated_time)}
              </span>
            </span>

            <span className="mx-1 flex items-center gap-1">
              &bull;
              <span className="text-xs">
                {ride.price_details_json?.estimated_km} km
              </span>
            </span>
          </div> */}
          <div
            className="text-[10px] sm:text-xs md:text-sm text-gray-600 flex flex-col gap-1
             sm:flex sm:flex-row sm:items-center sm:gap-4 sm:text-xs
             lg:flex lg:gap-10 lg:text-gray-500 lg:text-sm lg:mt-3"
          >
            <span className="text-xs lg:text-base font-medium flex items-center gap-2 mt-2 lg:mt-0">
  <FaClock className="text-gray-400 sm:text-lg" />
  {new Date(ride.booking_travel_date).toLocaleString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })}
</span>


            <span className="mx-1 flex items-center gap-1">
              &bull;
              <span className="text-xs lg:text-base font-medium">
                {estimatedTimeDisplay(ride.price_details_json?.estimated_time)}
              </span>
            </span>

            <span className="mx-1 flex items-center gap-1">
              &bull;
              <span className="text-xs lg:text-base">
                {ride.price_details_json?.estimated_km} km
              </span>
            </span>
          </div>
        </div>

        {/* Right: Driver and car details */}
        <div
          className="flex flex-col gap-1 text-[10px] sm:text-xs text-gray-600 mt-2
             lg:flex lg:flex-col lg:gap-1 lg:mt-8 lg:text-base lg:ml-auto lg:basis-2/5 basis-1/2"
        >
          {/* Small screen: icon + name in one line */}
          <div
            className="flex items-center gap-2 text-sm font-semibold text-gray-700
                  lg:flex lg:items-center lg:gap-2 lg:text-xl lg:font-semibold lg:text-gray-700"
          >
            {/* <FaUser className="text-gray-400 text-sm lg:text-base" /> */}

            {/* <img
  src={ride.driver_details_json?.driver_image}
  alt={ride.driver_details_json?.drv_name || "Driver Image"}
  title={ride.driver_details_json?.drv_name}
  className="text-gray-400 text-sm lg:text-base w-6 h-6 rounded-full object-cover lg:w-8 lg:h-8"
/> */}

            {/* <img
  src={ride.driver_details_json?.driver_image}
  alt={ride.driver_details_json?.drv_name || "Driver Image"}
  title={ride.driver_details_json?.drv_name}
  className="text-gray-400 text-sm lg:text-base w-6 h-6 rounded-full object-cover lg:w-8 lg:h-8"
/> */}

            {/* <Image
  src={`${baseImageUrl}/uploads/driver_docs/${ride.driver_details_json?.driver_image}`}
  width={40}    
  height={40}    
  alt="meter-image"
  className="rounded-full object-cover"
  style={{ width: "40px", height: "40px" }}
/> */}

            <Image
              src={imageUrl}
              width={40}
              height={40}
              alt="meter-image"
              className="rounded-full object-cover"
              style={{ width: "40px", height: "40px" }}
            />
            <span title={ride.driver_details_json?.drv_name}>
              {ride.driver_details_json?.drv_name || "N/A"}
            </span>
          </div>

          {/* Small screen: rest of the info line by line */}
          <div
            className="flex flex-col sm:flex-row sm:items-center sm:gap-2 font-medium text-gray-400 text-xs mt-1
                  lg:flex lg:items-center lg:gap-2 lg:font-semibold lg:text-gray-400 lg:text-sm lg:mt-1"
          >
            <span
              title={ride.driver_details_json?.driver_mobile}
              className="mb-1 sm:mb-0"
            >
              {ride.driver_details_json?.driver_mobile || "N/A"}
            </span>

            {/* <span className="flex items-center gap-1">
      <FaCar className="text-gray-400 text-sm lg:text-base" />
      <span
        title={ride.cab_details_json?.cab_reg}
      >
        {ride.cab_details_json?.cab_reg || ride.booking_type || "N/A"}
      </span>
    </span> */}

            <span className="flex items-center gap-1">
              <img
                src={carImage}
                alt={bookingType || "car"}
                className="w-4 h-4 lg:w-10 lg:h-10 object-contain"
              />
              <span title={ride.cab_details_json?.cab_reg}>
                {ride.cab_details_json?.cab_reg || bookingType || "N/A"}
              </span>
            </span>
          </div>
        </div>

        {/* Right side: fare and details btn */}
        <div
          className="flex flex-col items-end gap-2 min-w-[70px] w-full
                lg:flex lg:flex-col lg:items-end lg:gap-4 lg:min-w-[110px] lg:basis-1/5 lg:w-auto"
        >
          <span
            className="bg-gradient-to-r from-green-400 to-green-700 text-white font-bold w-[70px] text-center py-1 rounded-lg text-sm mb-1
                  lg:w-[90px] lg:text-base lg:py-2 lg:mb-2"
          >
            ₹{ride.price_details_json?.final_fare || "N/A"}
          </span>
          <button
            onClick={handleViewDetails}
            className="bg-white border border-blue-200 rounded-lg px-1 py-1 text-sm font-semibold text-blue-700 shadow hover:bg-blue-50 transition flex items-center gap-2
               lg:text-base"
          >
            <span>View Details</span>
            <FiArrowRightCircle />
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  let color = "bg-red-100 text-red-700"; // default cancelled-like
  if (
    status?.toLowerCase() === "completed" ||
    status?.toLowerCase() === "confirmed"
  ) {
    color = "bg-green-100 text-green-700";
  } else if (
    status?.toLowerCase() === "upcoming" ||
    status?.toLowerCase() === "processing"
  ) {
    color = "bg-blue-100 text-blue-700";
  }
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${color}`}>
      {status}
    </span>
  );
}

// Pagination (simple, static for demo - add logic as needed)
function Pagination() {
  return (
    <div className="flex justify-center mt-4 gap-1">
      <button className="border px-2 py-1 rounded text-gray-500 hover:bg-gray-100">
        &lt;
      </button>
      {[1, 2, 3, 4, 5].map((num) => (
        <button
          key={num}
          className={`border px-3 py-1 rounded ${
            num === 1
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          {num}
        </button>
      ))}
      <button className="border px-2 py-1 rounded text-gray-500 hover:bg-gray-100">
        &gt;
      </button>
    </div>
  );
}

function ComplaintModal({ open, onClose, complaints }) {
  const [view, setView] = useState("list"); // View can be "list" or "chat"
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const rideList = [];

  // Ride details to show in ride summary for example
  const rideDetails = {
    pickup: "Connaught Place, New Delhi",
    drop: "IGI Airport, Terminal 3",
    fare: 450,
    distance: 18.5,
    duration: 45,
  };

  // Sample messages - in real app fetch based on selectedComplaint
  const messages = [
    {
      text: "Driver was very rude.",
      time: "12 Jul 2025, 3:47 PM",
      fromUser: true,
    },
    {
      text: "Sorry for the inconvenience, we're reviewing this.",
      time: "12 Jul 2025, 4:15 PM",
      fromUser: false,
    },
    { text: "Thanks.", time: "12 Jul 2025, 4:16 PM", fromUser: true },
  ];

  if (!open) return null;

  const closeModal = () => {
    setView("list");
    setSelectedComplaint(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div
        className="bg-white rounded-xl shadow-xl max-w-4xl w-full p-6 flex flex-col"
        style={{ maxHeight: "90vh" }}
      >
        <div className="flex justify-between items-center mb-6">
          <span className="text-xl font-semibold">
            {view === "list"
              ? `Complaints Raised (${complaints.length})`
              : `Chat - ${selectedComplaint?.title || ""}`}
          </span>
          <button
            className="px-2 rounded bg-gray-200 text-gray-700"
            onClick={closeModal}
          >
            Close
          </button>
        </div>

        {view === "list" && (
          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            {complaints.map((c, idx) => (
              <div
                key={idx}
                className="border rounded-lg p-4 flex items-center justify-between bg-gray-50 cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  setSelectedComplaint(c);
                  setView("chat");
                }}
              >
                <div>
                  <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-1 rounded-sm mr-2">
                    {c.id}
                  </span>
                  <span className="font-medium">{c.title}</span>
                  <div className="text-xs text-gray-500 mt-1">{c.date}</div>
                  <div className="text-xs text-gray-400">{c.route}</div>
                </div>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded ${
                    c.status === "Open"
                      ? "bg-red-100 text-red-600"
                      : c.status === "Resolved"
                      ? "bg-green-100 text-green-600"
                      : "bg-orange-100 text-orange-500"
                  }`}
                >
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {view === "chat" && selectedComplaint && (
          <div className="flex" style={{ height: "70vh" }}>
            {/* Chat messages */}
            <div className="flex flex-col flex-1 max-h-full overflow-y-auto border-r pr-6">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`mb-4 flex ${
                    msg.fromUser ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg max-w-xs ${
                      msg.fromUser ? "bg-gray-100" : "bg-blue-600 text-white"
                    }`}
                  >
                    <div>{msg.text}</div>
                    <div className="text-xs mt-1 opacity-60">{msg.time}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Ride summary */}
            <div className="w-64 ml-6 p-4 bg-gray-50 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Ride Summary</h3>
              <div className="mb-3">
                <div className="text-xs font-semibold text-gray-600">
                  PICKUP
                </div>
                <div className="text-sm font-bold mt-1">
                  {rideDetails.pickup}
                </div>
              </div>
              <div className="mb-3">
                <div className="text-xs font-semibold text-gray-600">DROP</div>
                <div className="text-sm font-bold mt-1">{rideDetails.drop}</div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600 text-sm">
                  <div>Fare</div>
                  <div className="font-bold text-gray-900">
                    ₹{rideDetails.fare}
                  </div>
                </div>
                <div className="flex justify-between text-gray-600 text-sm">
                  <div>Distance</div>
                  <div className="font-bold text-gray-900">
                    {rideDetails.distance} km
                  </div>
                </div>
                <div className="flex justify-between text-gray-600 text-sm">
                  <div>Duration</div>
                  <div className="font-bold text-gray-900">
                    {rideDetails.duration} mins
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

//today changes 3/10/2025

export default function DashboardPage() {
  const [tab, setTab] = useState("upcoming");
  const [complaintsOpen, setComplaintsOpen] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const { id } = useParams();
  const observerRef = useRef();
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [userDetails, setUserDetails] = useState();
  const [totalPages, setTotalPages] = useState(1);
  // const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);

  //   const upcomingList = rides.filter(ride => ride.status.toLowerCase() === "upcoming");
  // const completedList = rides.filter(ride => ride.status.toLowerCase() === "completed");
  // const cancelledList = rides.filter(ride => ride.status.toLowerCase() === "cancelled");

  // const counts = {
  //   upcoming: upcomingList.length,
  //   completed: completedList.length,
  //   cancelled: cancelledList.length,
  // };

  const fetchUserDetails = useCallback(async () => {
    try {
      const response = await apiClient(
        "GET",
        `/user_management/getUserdetaby/${id}`
      );
      if (response.status || response.success) {
        setUserDetails(response.data);
      } else {
        toast.error(response.messages);
      }
    } catch (e) {
      console.log(e);
    } finally {
    }
  }, [id]);

  const fetchRides = useCallback(
    async (page = 1) => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await apiClient(
          "GET",
          `/user_management/getUserRidesByStatus/${id}?status=${tab}&page=${page}&limit=10`
        );

        if (res.status === true && res.data) {
          setRides(res.data.rides || []);
          setCurrentPage(res.data.currentPage || 1);
          setTotalPages(res.data.totalPages || 1);
        } else {
          toast.error(res.message || "Failed to fetch rides.");
        }
      } catch (error) {
        console.error("Error fetching rides:", error);
        toast.error("Failed to fetch rides.");
      } finally {
        setLoading(false);
      }
    },
    [id, tab]
  );

  // Fetch rides on tab or page change
  useEffect(() => {
    fetchRides(currentPage);
  }, [fetchRides, currentPage]);

  useEffect(() => {
    if (id) fetchUserDetails();
  }, [id, fetchUserDetails]);

  const router = useRouter();

  // Filter rides per tab

  const [rides, setRides] = useState([]);
  const [user, setUser] = useState();

  // Count calculation based on current rides state
  // const counts = {
  //   upcoming: rides.filter(
  //     ride => ["processing", "confirmed", "upcoming"].includes(ride.status?.toLowerCase())
  //   ).length,
  //   completed: rides.filter(
  //     ride => ["completed", "finished"].includes(ride.status?.toLowerCase())
  //   ).length,
  //   cancelled: rides.filter(
  //     ride => ["cancelled", "rejected"].includes(ride.status?.toLowerCase())
  //   ).length,
  // };

  // const filteredRides = rides.filter(ride => {
  //   if (tab === "upcoming")
  //     return ["processing", "confirmed", "upcoming"].includes(ride.status?.toLowerCase());
  //   if (tab === "completed")
  //     return ["completed", "finished"].includes(ride.status?.toLowerCase());
  //   if (tab === "cancelled")
  //     return ["cancelled", "rejected"].includes(ride.status?.toLowerCase());
  //   return false;
  // })

  const [allRides, setAllRides] = useState({
    upcoming: [],
    completed: [],
    cancelled: [],
  });

  // Har tab ke liye ek hi bar fetch karo
  useEffect(() => {
    async function fetchAllRides() {
      // Change below URLs according to your actual API endpoints/status
      const [up, co, ca] = await Promise.all([
        apiClient(
          "GET",
          `/user_management/getUserRidesByStatus/${id}?status=upcoming`
        ),
        apiClient(
          "GET",
          `/user_management/getUserRidesByStatus/${id}?status=completed`
        ),
        apiClient(
          "GET",
          `/user_management/getUserRidesByStatus/${id}?status=cancelled`
        ),
      ]);
      setAllRides({
        upcoming: up.data?.rides || [],
        completed: co.data?.rides || [],
        cancelled: ca.data?.rides || [],
      });
    }
    if (id) fetchAllRides();
  }, [id]);

  // jab tab change ho to uske hisab se rides update
  useEffect(() => {
    setRides(allRides[tab] || []);
  }, [tab, allRides]);

  const counts = {
    upcoming: allRides.upcoming.length,
    completed: allRides.completed.length,
    cancelled: allRides.cancelled.length,
  };


    useEffect(() => {
  if (!id || !userDetails) return;

  const fullName = `${userDetails.first_name || ""} ${userDetails.last_name || ""}`.trim();

  // store in session
  sessionStorage.setItem(`label-customer-${id}`, fullName);

  // 🔥 instant breadcrumb refresh
  if (window.updateBreadcrumbName) {
    window.updateBreadcrumbName(id, fullName);
  }
}, [id, userDetails]);

  return (
    // <div className="bg-[#f6fcff]  min-h-screen py-6 px-2 md:px-8">
    //   {/* User Overview */}
    //   <div
    //     className="rounded-xl border border-[#d7e7ff] bg-white p-4 shadow-md max-w-full mx-auto mb-6 bg-cover bg-center"
    //     style={{ backgroundImage: "url('/images/walletBackground.png')" }}
    //   >
    //     <h3 className="text-sm text-gray-700 font-semibold mb-4">User Details</h3>
    //     <div className="flex flex-col md:flex-row gap-6">
    //       {/* Profile Card */}

    //       <div className="bg-gradient-to-r from-[#271054] to-[#52238e] rounded-[2.5rem] p-5 flex items-center gap-8 shadow-lg w-full max-w-3xl mx-auto">
    //         {/* Avatar */}
    //         <div className="rounded-full border-4 border-white w-32 h-32 overflow-hidden flex-shrink-0 bg-white">
    //           <Image
    //             width={100}
    //             height={100}
    //             src={userDetails?.profile || "/avatar.jpg"}
    //             alt={userDetails?.first_name || "-"}
    //             className="w-full h-full object-cover"
    //           />
    //         </div>

    //         {/* Name and contact info */}
    //         <div className="flex flex-col justify-center  gap-4 flex-1">
    //           {/* Name */}
    //           <div className="text-white text-4xl  font-bold tracking-wide capitalize">
    //             {`${userDetails?.first_name} ${userDetails?.last_name}`}
    //           </div>
    //           {/* Contact numbers */}
    //           <div className="flex gap-8">
    //             <div className="bg-white rounded-xl px-5 py-3 flex items-center gap-3 shadow-md min-w-[260px]">
    //               <FaPhoneAlt className="text-[#476cff] text-xl" />
    //               <span className="text-gray-700 text-lg font-semibold">
    //                 +91 {userDetails?.mobile_no || "-"}
    //               </span>
    //             </div>
    //             <div className="bg-white rounded-xl px-9 py-4 flex items-center gap-3 shadow-md min-w-[260px]">
    //               <FaWhatsapp className="text-[#30c85c] text-2xl" />
    //               <span className="text-gray-700 text-lg font-semibold">
    //                 +91 {userDetails?.whatsapp || "-"}
    //               </span>
    //             </div>
    //           </div>
    //         </div>
    //       </div>

    //       {/* Earnings Card */}
    //       <div className="flex-1 min-w-[220px] max-w-full rounded-xl p-4 shadow-md flex flex-col justify-between bg-cover bg-center"
    //         style={{ backgroundImage: "url('/images/totalEarning.png')" }}>
    //         <div className="flex flex-col h-full">
    //           {/* <div className="flex items-center gap-2">
    //       <div  /> <FaArrowTrendUp className="bg-[#C5FBD8] text-[#2FAE5E] p-2 rounded-md"/>
    //       <span className="text-sm font-medium text-white">Earned from jaiBabajiCab</span>
    //     </div> */}
    //           <div className="flex items-center gap-2">
    //             <FaArrowTrendUp className="bg-[#C5FBD8] text-[#2FAE5E] p-4 rounded-md text-6xl" />
    //             <span className="text-sm font-medium text-white">Total Collections</span>
    //           </div>

    //           <div className="pt-2 flex items-center gap-6">
    //             <div>
    //               <h3 className="text-2xl font-semibold text-white">₹ {userDetails?.totalCollection || 0}</h3>
    //               <p className="text-sm text-white opacity-80">Total earnings</p>
    //             </div>
    //             <div>
    //               <h3 className="text-2xl font-semibold text-white">{userDetails?.no_of_rides}</h3>
    //               <p className="text-sm text-white opacity-80">No of Rides</p>
    //             </div>
    //           </div>

    //         </div>
    //       </div>

    //       {/* Collections Card */}
    //       <div className="flex-1 min-w-[220px] max-w-full rounded-xl p-4 shadow-md flex flex-col justify-between bg-cover bg-center"
    //         style={{ backgroundImage: "url('/images/walletPoints.png')" }}>
    //         <div className="flex flex-col h-full">
    //           {/* <div className="flex items-center gap-2">
    //       <BsWallet className="bg-[#FFC667] text-white p-5 rounded-md" />
    //       <span className="text-sm font-medium text-black">jaiBabajiCab collections</span>
    //     </div> */}
    //           <div className="flex items-center gap-2">
    //             <BsWallet className="bg-[#FFC667] text-white p-3 rounded-md text-5xl" />
    //             <span className="text-sm font-medium text-black">wallet Points</span>
    //           </div>

    //           <div className="pt-2 space-y-1">
    //             <h3 className="text-2xl font-semibold text-black">₹ {userDetails?.totalCollection || 0}</h3>
    //             <p className="text-sm text-black opacity-80">total Collections</p>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>

    //   {/* Rides List Section */}
    //   <div className="rounded-xl bg-white p-4 shadow-md max-w-full mx-auto">
    //     <div className="flex flex-col md:flex-row md:items-center mb-4 gap-3">
    //       <h3 className="text-lg font-semibold text-gray-800 flex-1">Total Rides Lists</h3>
    //       <div className="flex items-center gap-1 ml-auto">

    //         <button
    //           className="bg-gradient-to-r from-[#f85757] to-[#c81616] flex items-center pl-3 pr-4 py-2 rounded-[1.6rem] text-white text-base font-semibold shadow gap-2"
    //           style={{ minWidth: 200 }}
    //           onClick={() => setComplaintsOpen(true)}
    //         >
    //           <span className="bg-white bg-opacity-20 rounded-lg p-1 flex items-center justify-center">
    //             <MdErrorOutline className="text-xl text-white" />
    //           </span>
    //           <span className="ml-2">Complaints Raised</span>
    //           <span className="ml-2 bg-white text-red-600 font-bold text-base rounded-full px-3 py-1 flex items-center justify-center shadow-inner">
    //             {user?.complaints}
    //           </span>
    //         </button>
    //       </div>
    //     </div>
    //     {/* Tabs */}

    // <div className="bg-white rounded-xl shadow px-2 py-3 flex justify-between items-center mb-5" style={{ minHeight: "68px" }}>
    //   {tabOptions.map((tabOpt) => (
    //     <button
    //       key={tabOpt.value}
    //       onClick={() => setTab(tabOpt.value)}
    //       className={`flex items-center justify-center font-medium transition px-8 py-3 mx-2
    //     ${tab === tabOpt.value
    //           ? "bg-gradient-to-r from-[#2882F6] to-[#1667DD] text-white rounded-[1rem] shadow-lg"
    //           : "bg-transparent text-gray-700"
    //         }
    //   `}
    //       style={{ minWidth: "480px" }}
    //     >
    //       <span className="mr-2">{tabOpt.label}</span>
    //       {tab === tabOpt.value ? (
    //         <span className="bg-white/30 rounded-full px-4 text-white text-xs font-bold ml-1">
    //           {tabOpt.count}
    //         </span>
    //       ) : (
    //         <span className="text-gray-400 text-xs font-semibold ml-1">
    //           {tabOpt.count}
    //         </span>
    //       )}
    //     </button>
    //   ))}
    // </div>

    //     {/* Ride List */}
    //     {filteredRides.length > 0 ? (
    //       filteredRides.map((ride, i) => <RideCard key={ride.id} ref={i === filteredRides.length -1? isLastCardRef: null} ride={ride} />)
    //     ) : (
    //       <div className="text-center text-gray-500 my-10">No rides found.</div>
    //     )}

    //     <ComplaintModal
    //       open={complaintsOpen}
    //       complaints={complaints}
    //       onClose={() => setComplaintsOpen(false)}
    //     />

    //   </div>
    // </div>

    <div className="bg-white min-h-screen ">
      {/* User Overview */}
      <div
        className="rounded-xl border border-[#d7e7ff] bg-white p-4 shadow-md w-full bg-cover "
        style={{ backgroundImage: "url('/images/walletBackground.png')" }}
      >
        <h3 className="text-sm text-gray-700 font-semibold mb-4">
          User Details
        </h3>
        <div className="flex flex-col lg:flex-row gap-6 ">
          <div className="w-full max-w-lg mx-auto rounded-3xl p-2 md:p-6 flex flex-row md:flex-row items-start md:items-center gap-4 md:gap-6 shadow-lg bg-gradient-to-r from-[#271054] to-[#52238e]">
            <div className="rounded-full border-4 border-white w-16 h-16 md:w-24 md:h-24 bg-white overflow-hidden flex-shrink-0 flex items-center justify-center">
              <Image
                width={96}
                height={96}
                src={userDetails?.profile || "/avatar.jpg"}
                alt={userDetails?.first_name || "-"}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 flex flex-col items-start md:items-start gap-4 md:gap-4 w-full">
              {/* Name */}
              <div className="text-white text-lg md:text-2xl  font-bold capitalize md:whitespace-nowrap text-center md:text-left">
                {`${userDetails?.first_name || ""} ${
                  userDetails?.last_name || ""
                }`}
              </div>
              {/* Contact cards */}
              <div className="flex flex-col md:flex-row gap-3 md:gap-3 w-full md:w-auto items-center md:items-center justify-start md:justify-start">
                <div className="bg-white rounded-2xl px-2 py-1 md:px-4 md:py-2 flex items-center gap-2 shadow-md md:h-[35px] w-full md:w-90 min-w-[60px]">
                  <FaPhoneAlt className="text-[#476cff] md:text-lg text-sm" />

                  <span className="whitespace-nowrap text-gray-700 text-[10px] md:text-[12px] font-semibold">
                    +91 {userDetails?.mobile_no || "-----------"}
                  </span>
                </div>
                <div className="bg-white rounded-2xl  px-1 py-1 md:px-4 md:py-2 flex items-center gap-2 shadow-md md:h-[35px] w-full md:w-90 min-w-[60px]">
                  <FaWhatsapp className="text-[#30c85c] md:text-lg text-sm" />

                  <span className="whitespace-nowrap text-gray-700 text-[10px] md:text-[12px] font-semibold">
                    +91 {userDetails?.whatsapp || "------------"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            className="flex-1 min-w-[100px] md:min-w-[180px] max-w-full rounded-xl p-4 shadow-md flex flex-col justify-between bg-cover bg-center md:mb-0"
            style={{ backgroundImage: "url('/images/totalEarning.png')" }}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-2">
                <FaArrowTrendUp className="bg-[#C5FBD8] text-[#2FAE5E] p-2 md:p-3 rounded-md text-3xl md:text-4xl" />
                <span className="text-sm md:text-base font-medium text-white">
                  Total Collections
                </span>
              </div>
              <div className="pt-2 flex flex-row gap-8 items-end">
                <div>
                  <h3 className="text-base md:text-2xl font-semibold text-white">
                    ₹ {userDetails?.totalCollection || 0}
                  </h3>
                  <p className="text-xs md:text-sm text-white opacity-80">
                    Total earnings
                  </p>
                </div>
                <div>
                  <h3 className="text-base md:text-2xl font-semibold text-white">
                    {userDetails?.no_of_rides || 0}
                  </h3>
                  <p className="text-xs md:text-sm text-white opacity-80">
                    No of Rides
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Collections Card */}
          <div
            className="flex-1 min-w-[100px] md:min-w-[180px] max-w-full rounded-xl p-4 shadow-md flex flex-col justify-between bg-cover bg-center"
            style={{ backgroundImage: "url('/images/walletPoints.png')" }}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-2">
                <BsWallet className="bg-[#FFC667] text-white p-2 md:p-3 rounded-md text-3xl md:text-4xl" />
                <span className="text-sm md:text-base font-medium text-black">
                  wallet Points
                </span>
              </div>
              <div className="pt-2 space-y-1">
                <h3 className="text-base md:text-2xl font-semibold text-black">
                  ₹ {userDetails?.totalCollection || 0}
                </h3>
                <p className="text-xs md:text-sm text-black opacity-80">
                  total Collections
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rides List Section */}
      <div className="rounded-xl bg-white p-4 shadow-md w-full  mx-auto">
        <div className="flex flex-col md:flex-row md:items-center mb-4 gap-3">
          <h3 className="text-lg font-semibold text-gray-800 flex-1">
            Total Rides Lists
          </h3>
          <div className="flex items-center gap-1 md:ml-auto">
            <button
              className="bg-gradient-to-r from-[#f85757] to-[#c81616] flex items-center px-3 py-1.5 rounded-xl text-white text-sm md:text-base font-semibold shadow gap-2 min-w-[100px] md:min-w-[180px]"
              onClick={() => setComplaintsOpen(true)}
            >
              <span className="bg-white bg-opacity-20 rounded-lg p-1 flex items-center justify-center">
                <MdErrorOutline className="text-lg md:text-xl text-white" />
              </span>
              <span className="ml-1 md:ml-2">Complaints Raised</span>
              <span className="ml-1 md:ml-2 bg-white text-red-600 font-bold text-xs md:text-base rounded-full px-2 py-0.5 flex items-center justify-center shadow-inner min-w-[20px]">
                {user?.complaints}
              </span>
            </button>
          </div>
        </div>
        {/* Tabs */}
        {/* <div
          className="bg-white rounded-xl shadow px-2 py-2 flex flex-wrap gap-2 md:justify-between items-center mb-5"
          style={{ minHeight: "68px" }}
        >
          {["upcoming", "completed", "cancelled"].map((statusOption) => (
            <button
              key={statusOption}
              onClick={() => setTab(statusOption)}
              className={`flex items-center justify-center font-medium transition px-4 py-2 mx-1 md:mx-1
        ${
          tab === statusOption
            ? "bg-gradient-to-r from-[#2882F6] to-[#1667DD] text-white rounded-[1rem] shadow-lg"
            : "bg-transparent text-gray-700"
        }
        min-w-[100px] sm:min-w-[280px]`}
            >
              <span className="mr-2">
                {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
              </span>
              
            </button>
          ))}
        </div> */}

        {/* <div
    className="bg-white rounded-xl shadow px-2 py-2 flex flex-wrap gap-2 md:justify-between items-center mb-5"
    style={{ minHeight: "68px" }}
  >
    {["upcoming", "completed", "cancelled"].map((statusOption) => (
      <button
        key={statusOption}
        onClick={() => setTab(statusOption)}
        className={`flex items-center justify-center font-medium transition px-4 py-2 mx-1 md:mx-1
          ${
            tab === statusOption
              ? "bg-gradient-to-r from-[#2882F6] to-[#1667DD] text-white rounded-[1rem] shadow-lg"
              : "bg-transparent text-gray-700"
          }
          min-w-[100px] sm:min-w-[280px]`}
      >
        <span className="mr-2">
          {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
        </span>
        <span
          className={`ml-2 bg-blue-200 px-2 py-0.5 rounded-full text-blue-700 font-semibold text-sm`}
        >
          {counts[statusOption.totalItems]}
        </span>
      </button>
    ))}
  </div> */}

        <div
          className="bg-white rounded-xl shadow px-2 py-2 flex flex-wrap gap-2 md:justify-between items-center mb-5"
          style={{ minHeight: "68px" }}
        >
          {["upcoming", "completed", "cancelled"].map((filteredRides) => (
            <button
              key={filteredRides}
              onClick={() => setTab(filteredRides)}
              className={`flex items-center justify-center font-medium transition px-4 py-2 mx-1 md:mx-1
          ${
            tab === filteredRides
              ? "bg-gradient-to-r from-[#2882F6] to-[#1667DD] text-white rounded-[1rem] shadow-lg"
              : "bg-transparent text-gray-700"
          }
          min-w-[100px] sm:min-w-[280px]`}
            >
              <span className="mr-2">
                {filteredRides.charAt(0).toUpperCase() + filteredRides.slice(1)}
              </span>
              <span className="ml-2 bg-blue-200 px-2 py-0.5 rounded-full text-blue-700 font-semibold text-sm">
                {counts[filteredRides]}
              </span>
            </button>
          ))}
        </div>

        {/*
       
        {filteredRides.length > 0 ? (
          filteredRides.map((ride, i) => (
            <RideCard
              key={ride.id}
              ref={i === filteredRides.length - 1 ? isLastCardRef : null}
              ride={ride}
            />
          ))
        ) : (
          <div className="text-center text-gray-500 my-10">No rides found.</div>
        )} */}

        {/* Rides List */}
        {loading ? (
          <p>Loading rides...</p>
        ) : rides.length === 0 ? (
          <p>No rides found.</p>
        ) : (
          rides.map((ride) => <RideCard key={ride.id} ride={ride} />)
        )}

        {/* Pagination Controls */}
        <div className="mt-6 flex justify-center gap-3">
          <button
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-3 py-1">
            {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage >= totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

        <ComplaintModal
          open={complaintsOpen}
          complaints={complaints}
          onClose={() => setComplaintsOpen(false)}
        />
      </div>
    </div>
  );
}
