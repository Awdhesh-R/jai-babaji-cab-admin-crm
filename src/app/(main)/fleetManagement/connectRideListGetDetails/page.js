
// 'use client';
// import React, { useState } from 'react';
// import { FaCheckCircle } from 'react-icons/fa';
// import { BsArrowRight, BsFillLuggageFill } from 'react-icons/bs';
// import { BsInfoCircle } from 'react-icons/bs';
// import { MdOutlineElderly } from "react-icons/md";

// const ridesData = [
//   {
//     id: '2284',
//     number: 'RB23062937898',
//     name: 'Dilkush Kumar Dilkush KumarDilkush KumarDilkush KumarDilkush KumarDilkush Kumar',
//     date: '30-Jun 09:00 PM',
//     phone: '7480098552',
//     rating: 4.3,
//     location: [
//       { status: 'green', label: 'Patna, BiharDarbhanga, BiharDarbhanga, BiharDarbhanga, BiharDarbhanga, BiharDarbhanga, Bihar' },
//       { status: 'red', label: 'Darbhanga, Bihar Darbhanga, BiharDarbhanga, BiharDarbhanga, BiharDarbhanga, BiharDarbhanga, Bihar' }
//     ],
//     distance: '340KM',
//     time: '3:30 Hr',
//     Gaptime: '5:28 Hr',
//     travelDate: '01-Jul, 02:45 AM',
//     connectivity: true,
//     price: '1000',
//     fare: 'One Way',
//     cab: 'Sedan Cab',
//     career: true,
//     vehicle: 'BR19F1355',
//     luggage: '3+1',
//     adults: 3,
//     children: 2,
//     Operator_Payout: '1000',
//     fee: '100'
//   },
//   {
//     id: '2284',
//     number: 'RB23062937898',
//     name: 'Dilkush Kumar',
//     date: '30-Jun 09:00 PM',
//     phone: '7480098552',
//     rating: 4.3,
//     location: [
//       { status: 'green', label: 'Patna, Bihar' },
//       { status: 'red', label: 'Darbhanga, Bihar' }
//     ],
//     distance: '340KM',
//     time: '3:30 Hr',
//     Gaptime: '5:28 Hr',
//     travelDate: '01-Jul, 02:45 AM',
//     connectivity: false,
//     price: '1000',
//     fare: 'One Way',
//     cab: 'Sedan Cab',
//     career: false,
//     vehicle: 'BR19F1355',
//     luggage: '3+1',
//     adults: 3,
//     children: 2,
//     Operator_Payout: '1000',
//     fee: '100'
//   },
//   {
//     id: '2284',
//     number: 'RB23062937898',
//     name: 'Dilkush Kumar',
//     date: '30-Jun 09:00 PM',
//     phone: '7480098552',
//     rating: 4.3,
//     location: [
//       { status: 'green', label: 'Patna, Bihar' },
//       { status: 'red', label: 'Darbhanga, Bihar' }
//     ],
//     distance: '340KM',
//     time: '3:30 Hr',
//     Gaptime: '5:28 Hr',
//     travelDate: '01-Jul, 02:45 AM',
//     connectivity: false,
//     price: '1000',
//     fare: 'One Way',
//     cab: 'Sedan Cab',
//     career: false,
//     vehicle: 'BR19F1355',
//     luggage: '3+1',
//     adults: 3,
//     children: 2,
//     Operator_Payout: '1000',
//     fee: '100'
//   },
//   {
//     id: '2284',
//     number: 'RB23062937898',
//     name: 'Dilkush Kumar',
//     date: '30-Jun 09:00 PM',
//     phone: '7480098552',
//     rating: 4.3,
//     location: [
//       { status: 'green', label: 'Patna, Bihar' },
//       { status: 'red', label: 'Darbhanga, Bihar' }
//     ],
//     distance: '340KM',
//     time: '3:30 Hr',
//     Gaptime: '5:28 Hr',
//     travelDate: '01-Jul, 02:45 AM',
//     connectivity: true,
//     price: '1000',
//     fare: 'One Way',
//     cab: 'Sedan Cab',
//     career: true,
//     vehicle: 'BR19F1355',
//     luggage: '3+1',
//     adults: 3,
//     children: 2,
//     Operator_Payout: '1000',
//     fee: '100'
//   },

//   {
//     id: '2284',
//     number: 'RB23062937898',
//     name: 'Dilkush Kumar',
//     date: '30-Jun 09:00 PM',
//     phone: '7480098552',
//     rating: 4.3,
//     location: [
//       { status: 'green', label: 'Patna, Bihar' },
//       { status: 'red', label: 'Darbhanga, Bihar' }
//     ],
//     distance: '340KM',
//     time: '3:30 Hr',
//     Gaptime: '5:28 Hr',
//     travelDate: '01-Jul, 02:45 AM',
//     connectivity: false,
//     price: '1000',
//     fare: 'One Way',
//     cab: 'Sedan Cab',
//     career: false,
//     vehicle: 'BR19F1355',
//     luggage: '3+1',
//     adults: 3,
//     children: 2,
//     Operator_Payout: '1000',
//     fee: '100'
//   },
//   {
//     id: '2284',
//     number: 'RB23062937898',
//     name: 'Dilkush Kumar',
//     date: '30-Jun 09:00 PM',
//     phone: '7480098552',
//     rating: 4.3,
//     location: [
//       { status: 'green', label: 'Patna, Bihar' },
//       { status: 'red', label: 'Darbhanga, Bihar' }
//     ],
//     distance: '340KM',
//     time: '3:30 Hr',
//     Gaptime: '5:28 Hr',
//     travelDate: '01-Jul, 02:45 AM',
//     connectivity: true,
//     price: '1000',
//     fare: 'One Way',
//     cab: 'Sedan Cab',
//     career: true,
//     vehicle: 'BR19F1355',
//     luggage: '3+1',
//     adults: 3,
//     children: 2,
//     Operator_Payout: '1000',
//     fee: '100'
//   },
//   {
//     id: '2284',
//     number: 'RB23062937898',
//     name: 'Dilkush Kumar',
//     date: '30-Jun 09:00 PM',
//     phone: '7480098552',
//     rating: 4.3,
//     location: [
//       { status: 'green', label: 'Patna, Bihar' },
//       { status: 'red', label: 'Darbhanga, Bihar' }
//     ],
//     distance: '340KM',
//     time: '3:30 Hr',
//     Gaptime: '5:28 Hr',
//     travelDate: '01-Jul, 02:45 AM',
//     connectivity:true,
//     price: '1000',
//     fare: 'One Way',
//     cab: 'Sedan Cab',
//     career: true,
//     vehicle: 'BR19F1355',
//     luggage: '3+1',
//     adults: 3,
//     children: 2,
//     Operator_Payout: '1000',
//     fee: '100'
//   }

// ];

// const initialCount = ridesData.length; // show all rides initially

// const RideTable = () => {
//   const [visible, setVisible] = useState(initialCount);

//   return (
//     <div className="grid grid-row-1 scrollbar-hide">
//       <div className="p-10 bg-white min-h-screen flex justify-center items-start overflow-auto scrollbar-hide">
//         <div className="bg-white rounded-xl shadow-lg overflow-auto w-full max-w-8xl">
//           {/* TABLE HEADER */}
//           <div className="grid grid-cols-7 px-6 py-4 bg-gray-50 text-sm font-semibold text-gray-700">
//             <div>Ride ID</div>
//             <div>Name</div>
//             <div>Location</div>
//             <div>Date and Time</div>
//             <div>Fare</div>
//             <div>Highlights</div>
//             <div></div>
//           </div>

//           {/* Rows */}
//           <div className="relative grid grid-rows-2">
//             {ridesData.slice(0, visible).map((ride, idx) => (
//               <div
//                 key={idx}
//                 className="relative grid grid-cols-7 px-6 py-4 text-sm items-start border-b hover:bg-gray-50"
//                 style={{ overflow: 'visible' }}
//               >


//                 {/* Ride ID */}
//                 <div className="flex flex-col gap-1 relative min-w-[110px]">
//                   <div className="font-semibold text-gray-900">{ride.id}</div>
//                   <div className="text-xs text-gray-500">{ride.number}</div>
//                   <div className="text-xs text-gray-500">{ride.date}</div>
//                 </div>

//                 {/* Name */}
//                 <div>
//                   <div className="font-semibold text-gray-900 truncate max-w-[150px]">{ride.name}</div>
//                   <div className="text-xs text-gray-500">{ride.phone}</div>
//                   <div className="text-xs text-gray-500">Rating {ride.rating}</div>
//                 </div>

//                 {/* Location */}
//                 <div>
//                   <div className="font-semibold text-gray-800">{ride.distance}</div>
//                   <div className="flex flex-col items-start mt-1">
//                     {(ride.location ?? []).map((loc, i) => (
//                       <React.Fragment key={i}>
//                         <div className="flex items-center">
//                           <span
//                             className={`w-4 h-4 rounded-full border mr-5 ${
//                               loc.status === 'green' ? 'bg-green-600 border-green-200' : 'bg-red-600 border-red-200'
//                             }`}
//                           ></span>
//                           <span className="text-gray-700 text-sm truncate max-w-[150px]">{loc.label}</span>
//                         </div>
//                         {i !== ride.location.length - 1 && <div className="ml-1.5 h-5 w-px bg-gray-300"></div>}
//                       </React.Fragment>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Date and Time */}

//                 <div>
//   <div className="font-medium text-gray-800">{ride.travelDate}</div>
//   <div className="flex flex-col">
//     <span className="text-gray-700 font-semibold">Connected</span>
//     {ride.connectivity ? (
//       <FaCheckCircle className="text-green-600" size={20} />
//     ) : (
//       <BsInfoCircle className="text-gray-500" size={20} />
//     )}
//   </div>
// </div>

//                 {/* Fare */}
//                 <div>
//                   <div className="font-semibold text-gray-900 text-base">₹{ride.price}/-</div>
//                   <div className="text-sm text-gray-500">{ride.fare}</div>
//                   <div className="text-sm text-gray-500">{ride.cab}</div>
//                 </div>

//                 {/* Highlights */}
//                 <div>
                  

//                   <div className="flex items-center gap-2 font-semibold text-gray-800 mb-1">
//   Career
//   <span
//     className={`text-white text-xs px-3 py-0.5 rounded-full font-medium ${
//       ride.career ? 'bg-green-700' : 'bg-red-600'
//     }`}
//   >
//     {ride.career ? 'Yes' : 'No'}
//   </span>
// </div>

//                   <div className="mb-1">
//                     <span className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-md font-medium">{ride.vehicle}</span>
//                   </div>
//                   <div className="text-sm text-gray-500">

//                     <div className="flex items-center h-6">
//   <BsFillLuggageFill className="mr-2 text-base" />
//   <span className="leading-none">{ride.luggage}</span>
// </div>

//                   </div>
//                   <div className="flex items-center gap-2 text-sm text-gray-500">
//   <MdOutlineElderly className="text-base" />
//   <span>Adult {ride.adults}</span>
//   <span>Child {ride.children}</span>
// </div>
//                 </div>


//                 {/* Get Details Button in every row */}
//                 <div>
//                   <div className="flex justify-end items-center">
//                     <button className="text-blue-600 flex items-center gap-1 hover:underline mr-4">
//                       Get Details <BsArrowRight />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RideTable;
 import ConnectRideListGetDetails from '@/components/fleet/ConnectRideListGetDetails'


import React from 'react';

const page = () => {
  // Your component logic and JSX
  return (
    <div>
      <ConnectRideListGetDetails />
    </div>
  );
};

export default page;

