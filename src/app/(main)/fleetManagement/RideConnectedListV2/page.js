"use client";
import { useState } from "react";
import { IoCallOutline } from "react-icons/io5";
import { IoLocationOutline } from "react-icons/io5";

// Dummy 20 item data array
const rideData = [
  {
    rideId: "17612851383847",
    date: "24 Oct-25",
    time: "01:00 PM",
    status: "Arrived",
    name: "Jagannath Kumar",
    phone: "9998765432",
    distance: "88 Km",
    from: "Rosera",
    to: "Muzaffarpur",
    gap: "00:00:00",
    fare: "₹2050/-",
    way: "Oneway",
    plate: "BR01PM8000",
    company: "RodBez",
  },
  {
    rideId: "17612814124110",
    date: "24 Oct-25",
    time: "01:45 AM",
    status: "Started",
    name: "Ankit Raj",
    phone: "8365124789",
    distance: "92 Km",
    from: "Rosera",
    to: "Muzaffarpur",
    gap: "00:00:00",
    fare: "₹2100/-",
    way: "Oneway",
    plate: "BR01PM8001",
    company: "RodBez",
  },
  {
    rideId: "17612742777782",
    date: "24 Oct-25",
    time: "11:20 AM",
    status: "Started",
    name: "Rajeev Singh",
    phone: "9771452369",
    distance: "95 Km",
    from: "Rosera",
    to: "Muzaffarpur",
    gap: "00:00:00",
    fare: "₹2150/-",
    way: "Oneway",
    plate: "BR01PM8002",
    company: "RodBez",
  },
  {
    rideId: "17612201294403",
    date: "24 Oct-25",
    time: "04:00 PM",
    status: "Assigned",
    name: "Masood Alam",
    phone: "7903214569",
    distance: "98 Km",
    from: "Rosera",
    to: "Muzaffarpur",
    gap: "00:00:00",
    fare: "₹2180/-",
    way: "Oneway",
    plate: "BR01PM8003",
    company: "RodBez",
  },
  {
    rideId: "17612028751133",
    date: "24 Oct-25",
    time: "06:10 PM",
    status: "Completed",
    name: "Sandeep Kumar",
    phone: "9812345670",
    distance: "100 Km",
    from: "Rosera",
    to: "Muzaffarpur",
    gap: "00:00:00",
    fare: "₹2200/-",
    way: "Oneway",
    plate: "BR01PM8004",
    company: "RodBez",
  },
];

function getStatusClass(status) {
  switch (status) {
    case "Assigned":
      return "bg-blue-400 text-white";
    case "Started":
      return "bg-blue-400 text-white";
    case "Arrived":
      return "bg-purple-400 text-white";
    case "Completed":
      return "bg-green-400 text-white";
    default:
      return "bg-gray-100 text-white";
  }
}

export default function FleetRideTable() {
  // Store which dropdowns are open
  const [open, setOpen] = useState(Array(20).fill(false));

  function toggleDropdown(idx) {
    setOpen((prev) => prev.map((v, i) => (i === idx ? !v : v)));
  }

//   return (
//     <div className="w-full min-h-screen bg-gray-50 p-0">
//       <div className="max-w-screen-2xl mx-auto">
//         {/* Table Header */}
//         <div className="grid grid-cols-7 gap-2 text-xs text-gray-500 font-semibold px-6 py-2 w-full">
//           <div>RIDE ID</div>
//           <div>NAME</div>
//           <div>LOCATION</div>
//           <div>GAP</div>
//           <div>FARE</div>
//           <div>HIGHLIGHTS</div>
//           <div>ACTIONS</div>
//         </div>

//         {rideData.map((ride, idx) => (
//           <div key={ride.rideId} className="w-full">
//             {/* Main Card */}
//             <div className="grid grid-cols-7 items-center px-6 py-3 bg-white rounded-xl shadow my-2 w-full">
//               {/* RIDE ID */}
//               <div className="flex flex-col ">
//                 <span className="text-xs text-gray-500 font-medium">
//                   {ride.rideId}
//                 </span>
//                 <span className="text-xs text-gray-400">
//                   {ride.date}
//                   <br />
//                   {ride.time}
//                 </span>
//                 {/* <span className="inline-block px-4 py-1 mt-2 rounded-full w-fit text-xs font-semibold bg-[#6C47FF] text-white">
//                   {ride.status}
//                 </span> */}
//                 <span
//                   className={`inline-block px-4 py-1 mt-2 rounded-full w-fit text-xs font-semibold ${getStatusClass(
//                     ride.status
//                   )}`}
//                 >
//                   {ride.status}
//                 </span>
//               </div>
//               {/* NAME */}
//               <div className="flex flex-col">
//                 <span className=" text-sm font-semibold text-gray-800">
//                   {ride.name}
//                 </span>
//                 <span className="flex items-center text-[12px] text-gray-400 gap-1">
//                   <IoCallOutline />
//                   {ride.phone}
//                 </span>
//               </div>
//               {/* LOCATION */}
//               <div className="flex flex-col">
//                 <span className="text-sm font-bold text-gray-800">
//                   {ride.distance}
//                 </span>
//                 <span className="text-sm flex items-center text-gray-500">
//                   <IoLocationOutline /> {ride.from}
//                 </span>
//                 <span className="text-sm flex items-center text-gray-500">
//                   <IoLocationOutline /> {ride.to}
//                 </span>
//               </div>
//               {/* GAP */}
//               <div className="flex flex-col">
//                 <span className="text-xs text-gray-600">Gap: 0</span>
//                 <span className="text-sm font-bold text-gray-700">
//                   {ride.gap}
//                 </span>
//               </div>
//               {/* FARE */}
//               <div className="flex flex-col">
//                 <span className="text-[#4e9df2] font-bold text-base">
//                   {ride.fare}
//                 </span>
//                 <span className="text-xs text-gray-600">{ride.way}</span>
//               </div>
//               {/* HIGHLIGHTS */}
//               <div className="flex flex-col">
//                 <span className="font-semibold text-sm text-gray-800">
//                   {ride.plate}
//                 </span>
//                 <span className="text-xs text-gray-500">{ride.company}</span>
//               </div>
//               {/* ACTIONS */}
            //   <div className="flex flex-row text-[10px] gap-2   ">
            //     <button className="bg-gray-100 text-gray-700 font-semibold py-1 px-2  rounded-lg border border-gray-200">
            //       Get Details →
            //     </button>
            //     <button
            //       className="bg-[#2b8cff] text-white font-semibold  py-1 px-2  rounded-lg"
            //       onClick={() => toggleDropdown(idx)}
            //     >
            //       Show Rides
            //     </button>
            //   </div>
            // </div>
//             {/* Dropdown Completed Card */}
//             {open[idx] && (
//               //   <div className="grid grid-cols-7 items-center px-6 py-3 bg-white rounded-xl shadow my-2 w-full border border-green-600 animate-dropdown">
//             //   <div className="grid grid-cols-7 items-center px-6 py-3 bg-gray-100 rounded-xl shadow my-2 w-full border border-green-400 animate-dropdown ">
//             <div className="grid grid-cols-7 items-center px-3 py-1.5 bg-gray-100 rounded-lg shadow-sm my-1 mx-6 w-[96%] border border-green-400 animate-dropdown">

//                 <div className="flex flex-col">
//                   <span className="text-xs text-gray-500 font-medium">
//                     {ride.rideId}
//                   </span>
//                   <span className="text-xs text-gray-400">
//                     {ride.date}
//                     <br />
//                     {ride.time}
//                   </span>
//                   <span
//                     className={`inline-block px-4 py-1 mt-2 rounded-full w-fit text-xs font-semibold ${getStatusClass(
//                       ride.status
//                     )}`}
//                   >
//                     {ride.status}
//                   </span>
//                 </div>
//                 {/* Name */}
//                 <div className="flex flex-col">
//                   <span className=" text-sm font-semibold text-gray-800">
//                     {ride.name}
//                   </span>
//                   <span className="flex items-center text-[12px] text-gray-400 gap-1">
//                     <IoCallOutline />
//                     {ride.phone}
//                   </span>
//                 </div>

//                 {/* LOCATION */}
//                 <div className="flex flex-col">
//                   <span className="text-sm font-bold text-gray-800">
//                     {ride.distance}
//                   </span>
//                   <span className="text-sm flex items-center text-gray-500">
//                     <IoLocationOutline /> {ride.from}
//                   </span>
//                   <span className="text-sm flex items-center text-gray-500">
//                     <IoLocationOutline /> {ride.to}
//                   </span>
//                 </div>

//                 {/* GAP */}
//                 <div className="flex flex-col">
//                   <span className="text-xs text-gray-600">Gap: 0</span>
//                   <span className="text-sm font-bold text-gray-700">
//                     {ride.gap}
//                   </span>
//                 </div>

//                 {/* FARE */}
//                 <div className="flex flex-col">
//                   <span className="text-[#4e9df2] font-bold text-base">
//                     {ride.fare}
//                   </span>
//                   <span className="text-xs text-gray-600">{ride.way}</span>
//                 </div>
//                 {/* HIGHLIGHTS */}
//                 <div className="flex flex-col">
//                   <span className="font-semibold text-sm text-gray-800">
//                     {ride.plate}
//                   </span>
//                   <span className="text-xs text-gray-500">{ride.company}</span>
//                 </div>
//                 <div />
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );

return (
  // <div className="w-full min-h-screen bg-gray-50 p-2 sm:p-4">
  //   <div className="max-w-screen-2xl mx-auto">
  //     {/* Table Header */}
  //     <div className="hidden md:grid grid-cols-7 gap-2 text-xs text-gray-500 font-semibold px-3 sm:px-6 py-2 w-full">
  //       <div>RIDE ID</div>
  //       <div>NAME</div>
  //       <div>LOCATION</div>
  //       <div>GAP</div>
  //       <div>FARE</div>
  //       <div>HIGHLIGHTS</div>
  //       <div>ACTIONS</div>
  //     </div>

  //     {rideData.map((ride, idx) => (
  //       <div key={ride.rideId} className="w-full">
  //         {/* Main Card */}
  //         <div className="grid grid-cols-1 md:grid-cols-7 items-start md:items-center px-3 sm:px-6 py-3 bg-white rounded-xl shadow my-2 w-full gap-3 md:gap-0">
  //           {/* RIDE ID */}
  //           <div className="flex flex-col">
  //             <span className="text-xs text-gray-500 font-medium">{ride.rideId}</span>
  //             <span className="text-xs text-gray-400">
  //               {ride.date}
  //               <br />
  //               {ride.time}
  //             </span>
  //             <span
  //               className={`inline-block px-4 py-1 mt-2 rounded-full w-fit text-xs font-semibold ${getStatusClass(
  //                 ride.status
  //               )}`}
  //             >
  //               {ride.status}
  //             </span>
  //           </div>

  //           {/* NAME */}
  //           <div className="flex flex-col">
  //             <span className=" text-sm font-semibold text-gray-800">{ride.name}</span>
  //             <span className="flex items-center text-[12px] text-gray-400 gap-1 leading-tight">
  //               <IoCallOutline />
  //               {ride.phone}
  //             </span>
  //           </div>

  //           {/* LOCATION */}
  //           <div className="flex flex-col">
  //             <span className="text-sm font-bold text-gray-800">{ride.distance}</span>
  //             <span className="text-sm flex items-center text-gray-500">
  //               <IoLocationOutline /> {ride.from}
  //             </span>
  //             <span className="text-sm flex items-center text-gray-500">
  //               <IoLocationOutline /> {ride.to}
  //             </span>
  //           </div>

  //           {/* GAP */}
  //           <div className="flex flex-col">
  //             <span className="text-xs text-gray-600">Gap: 0</span>
  //             <span className="text-sm font-bold text-gray-700">{ride.gap}</span>
  //           </div>

  //           {/* FARE */}
  //           <div className="flex flex-col">
  //             <span className="text-[#4e9df2] font-bold text-base">{ride.fare}</span>
  //             <span className="text-xs text-gray-600">{ride.way}</span>
  //           </div>

  //           {/* HIGHLIGHTS */}
  //           <div className="flex flex-col">
  //             <span className="font-semibold text-sm text-gray-800">{ride.plate}</span>
  //             <span className="text-xs text-gray-500">{ride.company}</span>
  //           </div>

  //           {/* ACTIONS */}
  //           {/* <div className="flex flex-row sm:flex-row gap-2 text-[12px] md:justify-end w-full md:w-auto">
  //             <button className="bg-gray-100 text-gray-700 font-semibold py-2 px-4 sm:px-2 rounded-lg border border-gray-200 w-full md:w-auto text-sm">
  //               Get Details →
  //             </button>
  //             <button
  //               className="bg-[#2b8cff] text-white font-semibold py-2 px-4 sm:px-2 rounded-lg w-full md:w-auto text-sm"
  //               onClick={() => toggleDropdown(idx)}
  //             >
  //               Show Rides
  //             </button>
  //           </div> */}

  //            <div className="flex flex-row text-[10px] gap-2   ">
  //               <button className="bg-gray-100 text-gray-700 font-semibold py-1 px-2  rounded-lg border border-gray-200">
  //                 Get Details →
  //               </button>
  //               <button
  //                 className="bg-[#2b8cff] text-white font-semibold  py-1 px-2  rounded-lg"
  //                 onClick={() => toggleDropdown(idx)}
  //               >
  //                 Show Rides
  //               </button>
  //             </div>
  //         </div>

  //         {/* Dropdown Completed Card */}
  //         {open[idx] && (
  //           <div className="grid grid-cols-1 md:grid-cols-7 items-start md:items-center px-3 sm:px-4 py-1.5 bg-gray-100 rounded-lg shadow-sm my-5 mx-auto md:mx-0 md:w-[80%] border border-green-400 animate-dropdown gap-3 md:gap-0">
  //             {/* RIDE ID */}
  //             <div className="flex flex-col">
  //               <span className="text-xs text-gray-500 font-medium">{ride.rideId}</span>
  //               <span className="text-xs text-gray-400">
  //                 {ride.date}
  //                 <br />
  //                 {ride.time}
  //               </span>
  //               <span
  //                 className={`inline-block px-4 py-1 mt-2 rounded-full w-fit text-xs font-semibold ${getStatusClass(
  //                   ride.status
  //                 )}`}
  //               >
  //                 {ride.status}
  //               </span>
  //             </div>

  //             {/* Name */}
  //             <div className="flex flex-col">
  //               <span className="text-sm font-semibold text-gray-800">{ride.name}</span>
  //               <span className="flex items-center text-[12px] text-gray-400 gap-1">
  //                 <IoCallOutline />
  //                 {ride.phone}
  //               </span>
  //             </div>

  //             {/* LOCATION */}
  //             <div className="flex flex-col">
  //               <span className="text-sm font-bold text-gray-800">{ride.distance}</span>
  //               <span className="text-sm flex items-center text-gray-500">
  //                 <IoLocationOutline /> {ride.from}
  //               </span>
  //               <span className="text-sm flex items-center text-gray-500">
  //                 <IoLocationOutline /> {ride.to}
  //               </span>
  //             </div>

  //             {/* GAP */}
  //             <div className="flex flex-col">
  //               <span className="text-xs text-gray-600">Gap: 0</span>
  //               <span className="text-sm font-bold text-gray-700">{ride.gap}</span>
  //             </div>

  //             {/* FARE */}
  //             <div className="flex flex-col">
  //               <span className="text-[#4e9df2] font-bold text-base">{ride.fare}</span>
  //               <span className="text-xs text-gray-600">{ride.way}</span>
  //             </div>

  //             {/* HIGHLIGHTS */}
  //             <div className="flex flex-col">
  //               <span className="font-semibold text-sm text-gray-800">{ride.plate}</span>
  //               <span className="text-xs text-gray-500">{ride.company}</span>
  //             </div>

  //             {/* Empty space for layout balance */}
  //             <div className="hidden md:block" />
  //           </div>
  //         )}
  //       </div>
  //     ))}
  //   </div>
  // </div>






  <div className="w-full min-h-screen bg-gray-50 p-2 sm:p-4">
  <div className="max-w-screen-2xl mx-auto">
    {/* Table Header - visible only on desktop */}
    <div className="hidden md:grid grid-cols-7 gap-2 text-xs text-gray-500 font-semibold px-3 sm:px-6 py-2 w-full">
      <div>RIDE ID</div>
      <div>NAME</div>
      <div>LOCATION</div>
      <div>GAP</div>
      <div>FARE</div>
      <div>HIGHLIGHTS</div>
      <div>ACTIONS</div>
    </div>

    {rideData.map((ride, idx) => (
      <div key={ride.rideId} className="w-full">
        {/* Main Card */}
        <div className="md:grid md:grid-cols-7 md:items-center px-3 sm:px-6 py-3 bg-white rounded-xl shadow my-2 w-full md:gap-0">
          
          {/* Mobile Layout - Two column (Label | Value) */}
          <div className="md:hidden space-y-2">
            {/* RIDE ID */}
            <div className="grid grid-cols-2 gap-2">
              <span className="text-xs font-semibold text-gray-600">Ride ID:</span>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 font-medium">{ride.rideId}</span>
                <span className="text-xs text-gray-400">{ride.date} {ride.time}</span>
                <span className={`inline-block px-3 py-1 mt-1 rounded-full w-fit text-xs font-semibold ${getStatusClass(ride.status)}`}>
                  {ride.status}
                </span>
              </div>
            </div>

            {/* NAME */}
            <div className="grid grid-cols-2 gap-2">
              <span className="text-xs font-semibold text-gray-600">Name:</span>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-800">{ride.name}</span>
                <span className="flex items-center text-[12px] text-gray-400 gap-1">
                  <IoCallOutline />
                  {ride.phone}
                </span>
              </div>
            </div>

            {/* LOCATION */}
            <div className="grid grid-cols-2 gap-2">
              <span className="text-xs font-semibold text-gray-600">Location:</span>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-800">{ride.distance}</span>
                <span className="text-sm flex items-center text-gray-500">
                  <IoLocationOutline /> {ride.from}
                </span>
                <span className="text-sm flex items-center text-gray-500">
                  <IoLocationOutline /> {ride.to}
                </span>
              </div>
            </div>

            {/* GAP */}
            <div className="grid grid-cols-2 gap-2">
              <span className="text-xs font-semibold text-gray-600">Gap:</span>
              <div className="flex flex-col">
                <span className="text-xs text-gray-600">Gap: 0</span>
                <span className="text-sm font-bold text-gray-700">{ride.gap}</span>
              </div>
            </div>

            {/* FARE */}
            <div className="grid grid-cols-2 gap-2">
              <span className="text-xs font-semibold text-gray-600">Fare:</span>
              <div className="flex flex-col">
                <span className="text-[#4e9df2] font-bold text-base">{ride.fare}</span>
                <span className="text-xs text-gray-600">{ride.way}</span>
              </div>
            </div>

            {/* HIGHLIGHTS */}
            <div className="grid grid-cols-2 gap-2">
              <span className="text-xs font-semibold text-gray-600">Highlights:</span>
              <div className="flex flex-col">
                <span className="font-semibold text-sm text-gray-800">{ride.plate}</span>
                <span className="text-xs text-gray-500">{ride.company}</span>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="grid grid-cols-2 gap-2">
              <span className="text-xs font-semibold text-gray-600">Actions:</span>
              <div className="flex flex-col gap-2">
                <button className="bg-gray-100 text-gray-700 font-semibold py-1 px-2 rounded-lg border border-gray-200 text-xs">
                  Get Details →
                </button>
                <button
                  className="bg-[#2b8cff] text-white font-semibold py-1 px-2 rounded-lg text-xs"
                  onClick={() => toggleDropdown(idx)}
                >
                  Show Rides
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Layout - 7 column grid */}
          <div className="hidden md:contents">
            {/* RIDE ID */}
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 font-medium">{ride.rideId}</span>
              <span className="text-xs text-gray-400">
                {ride.date}
                <br />
                {ride.time}
              </span>
              <span className={`inline-block px-4 py-1 mt-2 rounded-full w-fit text-xs font-semibold ${getStatusClass(ride.status)}`}>
                {ride.status}
              </span>
            </div>

            {/* NAME */}
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-800">{ride.name}</span>
              <span className="flex items-center text-[12px] text-gray-400 gap-1 leading-tight">
                <IoCallOutline />
                {ride.phone}
              </span>
            </div>

            {/* LOCATION */}
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-800">{ride.distance}</span>
              <span className="text-sm flex items-center text-gray-500">
                <IoLocationOutline /> {ride.from}
              </span>
              <span className="text-sm flex items-center text-gray-500">
                <IoLocationOutline /> {ride.to}
              </span>
            </div>

            {/* GAP */}
            <div className="flex flex-col">
              <span className="text-xs text-gray-600">Gap: 0</span>
              <span className="text-sm font-bold text-gray-700">{ride.gap}</span>
            </div>

            {/* FARE */}
            <div className="flex flex-col">
              <span className="text-[#4e9df2] font-bold text-base">{ride.fare}</span>
              <span className="text-xs text-gray-600">{ride.way}</span>
            </div>

            {/* HIGHLIGHTS */}
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-gray-800">{ride.plate}</span>
              <span className="text-xs text-gray-500">{ride.company}</span>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-row text-[10px] gap-2">
              <button className="bg-gray-100 text-gray-700 font-semibold py-1 px-2 rounded-lg border border-gray-200">
                Get Details →
              </button>
              <button
                className="bg-[#2b8cff] text-white font-semibold py-1 px-2 rounded-lg"
                onClick={() => toggleDropdown(idx)}
              >
                Show Rides
              </button>
            </div>
          </div>
        </div>

        {/* Dropdown Completed Card */}
        {open[idx] && (
          <div className="md:grid md:grid-cols-7 md:items-center px-3 sm:px-4 py-1.5 bg-gray-100 rounded-lg shadow-sm my-5 mx-auto md:mx-30 md:w-[80%] border border-green-400 animate-dropdown md:gap-0">
            
            {/* Mobile Layout for Dropdown */}
            <div className="md:hidden space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <span className="text-xs font-semibold text-gray-600">Ride ID:</span>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 font-medium">{ride.rideId}</span>
                  <span className="text-xs text-gray-400">{ride.date} {ride.time}</span>
                  <span className={`inline-block px-3 py-1 mt-1 rounded-full w-fit text-xs font-semibold ${getStatusClass(ride.status)}`}>
                    {ride.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <span className="text-xs font-semibold text-gray-600">Name:</span>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-800">{ride.name}</span>
                  <span className="flex items-center text-[12px] text-gray-400 gap-1">
                    <IoCallOutline />
                    {ride.phone}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <span className="text-xs font-semibold text-gray-600">Location:</span>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-800">{ride.distance}</span>
                  <span className="text-sm flex items-center text-gray-500">
                    <IoLocationOutline /> {ride.from}
                  </span>
                  <span className="text-sm flex items-center text-gray-500">
                    <IoLocationOutline /> {ride.to}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <span className="text-xs font-semibold text-gray-600">Gap:</span>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-600">Gap: 0</span>
                  <span className="text-sm font-bold text-gray-700">{ride.gap}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <span className="text-xs font-semibold text-gray-600">Fare:</span>
                <div className="flex flex-col">
                  <span className="text-[#4e9df2] font-bold text-base">{ride.fare}</span>
                  <span className="text-xs text-gray-600">{ride.way}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <span className="text-xs font-semibold text-gray-600">Highlights:</span>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm text-gray-800">{ride.plate}</span>
                  <span className="text-xs text-gray-500">{ride.company}</span>
                </div>
              </div>
            </div>

            {/* Desktop Layout for Dropdown */}
            <div className="hidden md:contents">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 font-medium">{ride.rideId}</span>
                <span className="text-xs text-gray-400">
                  {ride.date}
                  <br />
                  {ride.time}
                </span>
                <span className={`inline-block px-4 py-1 mt-2 rounded-full w-fit text-xs font-semibold ${getStatusClass(ride.status)}`}>
                  {ride.status}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-800">{ride.name}</span>
                <span className="flex items-center text-[12px] text-gray-400 gap-1">
                  <IoCallOutline />
                  {ride.phone}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-800">{ride.distance}</span>
                <span className="text-sm flex items-center text-gray-500">
                  <IoLocationOutline /> {ride.from}
                </span>
                <span className="text-sm flex items-center text-gray-500">
                  <IoLocationOutline /> {ride.to}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-xs text-gray-600">Gap: 0</span>
                <span className="text-sm font-bold text-gray-700">{ride.gap}</span>
              </div>

              <div className="flex flex-col">
                <span className="text-[#4e9df2] font-bold text-base">{ride.fare}</span>
                <span className="text-xs text-gray-600">{ride.way}</span>
              </div>

              <div className="flex flex-col">
                <span className="font-semibold text-sm text-gray-800">{ride.plate}</span>
                <span className="text-xs text-gray-500">{ride.company}</span>
              </div>

              <div className="hidden md:block" />
            </div>
          </div>
        )}
      </div>
    ))}
  </div>
</div>

);


}
