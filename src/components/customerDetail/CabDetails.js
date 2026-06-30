// import { apiClient } from "@/app/lib/apiClient";
// import { useEffect, useState, useCallback, useRef } from "react";
// import { FaCaretDown, FaStar, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
// import { FaLocationDot } from "react-icons/fa6";
// // import { MdLocalTaxi } from "react-icons/md";
// import ImageModal from "../modals/ImageModal";
// import { debounce } from "lodash";
// import Image from "next/image";

// const CabDetailsPage = ({ rideDetails }) => {
//   const [showContent, setShowContent] = useState(false);
//   const [cabModelList, setCabModelList] = useState([]);
//   const [cabNumber, setCabNumber] = useState([]);
//   const [searchData, setSearchData] = useState([]);
//   const [showCabList, setShowCabList] = useState(false);
//   const [changeReason, setChangeReason] = useState('');
//   const [isOpen, setIsOpen] = useState(false);
//   const imageUrl = '/images/Murari.jpg'; // Replace with actual image URL

//   const searchCabs = useCallback(
//     debounce(async (input) => {
//       if (!input.trim()) return;

//       const payData = { searchTerm: input.trim() };

//       try {
//         const response = await apiClient('POST', '/rb_cabs/rbCabsSearch', payData, true);

//         if (!response?.success) throw new Error(response?.message || "Failed to fetch");

//         const results = response.data || [];
//         setSearchData(results);
//         setShowCabList(true);
//       } catch (err) {
//         console.error("Error fetching autocomplete suggestions:", err.message);
//       }
//     }, 200),
//     [] // ✅ no phantom 'input'
//   );

//   useEffect(() => {
//     if (rideDetails?.cab_reg && !cabNumber?.cab_reg) {
//       setCabNumber({ cab_reg: rideDetails?.cab_reg });
//     }
//   }, [rideDetails?.cab_reg, cabNumber?.cab_reg]);


//   const handleInputChange = (e) => {
//     const value = e.target.value;
//     setCabNumber({ cab_reg: value }); // maintain object structure

//     if (!value.trim()) {
//       setShowCabList(false);
//       setSearchData([]);
//     } else {
//       searchCabs(value.toUpperCase());
//     }
//   };

//   //GET CAB MODEL LIST
//   useEffect(() => {
//     const cabModelLists = async () => {
//       try {
//         const response = await apiClient('GET', '/rb_cabs/cabModelList', {}, true);
//         if (response?.success) {
//           setCabModelList(response?.data);
//         } else {
//           console.error("Failed to fetch cab models:", response?.message);
//           setCabModelList([]);
//         }
//       } catch (error) {
//         console.error("Error fetching cab models:", error.message);
//         return [];
//       }
//     }
//     cabModelLists();
//   }, []);

//   // ASSIGN CAB API 
//   const assignCabs = async () => {

//     let payData = {
//       driver_id: cabNumber?.driver_id,
//       drv_name: cabNumber?.driver_name,
//       driver_mobile: "7903118721",
//       drv_wa_number: "7903118721",
//       urid: rideDetails?.urid,
//       cab_reg: cabNumber?.cab_reg,
//       cab_id: cabNumber?.ref_id,
//       cab_type: Number(cabNumber?.cab_type) === 1 ? 'mini' : Number(cabNumber?.cab_type) === 2 ? 'sedan' : 'suv',
//     }

//     let payData2 = {
//       driver_id: cabNumber?.driver_id,
//       drv_name: cabNumber?.driver_name,
//       driver_mobile: "7903118721",
//       drv_wa_number: "7903118721",
//       urid: rideDetails?.urid,
//       cab_reg: cabNumber?.cab_reg,
//       cab_id: cabNumber?.ref_id,
//       reason: changeReason,
//       cab_type: Number(cabNumber?.cab_type) === 1 ? 'mini' : Number(cabNumber?.cab_type) === 2 ? 'sedan' : 'suv',
//     }

//     try {
//       const response = await apiClient('POST', '/rb_cabs/assignedRbCabs', rideDetails?.status.toLowerCase() === 'confirmed' ? JSON.stringify(payData) : JSON.stringify(payData2), true);
//       if (response?.success) {
//         alert("Cab assigned successfully!");
//       } else {
//         console.error("Failed to fetch cab models:", response?.message);
//         setCabModelList([]);
//       }
//     } catch (error) {
//       console.error("Error fetching cab models:", error.message);
//       return [];
//     }
//   }

//   // CAB PROBABLE API 
//   const cabProbability = async () => {

//     let payData = {
//       driver_id: cabNumber?.driver_id,
//       drv_name: cabNumber?.driver_name,
//       drv_mobile: "7903118721",
//       drv_wa_number: "7903118721",
//       urid: rideDetails?.urid,
//       cab_reg: cabNumber?.cab_reg,
//       cab_id: cabNumber?.ref_id,
//     }

//     try {
//       const response = await apiClient('POST', '/rb_cabs/addCabInProbabal', JSON.stringify(payData), true);
//       if (response?.success) {
//         alert("Cab Probable successful!");
//         localStorage.setItem('probableCab', cabNumber?.cab_reg)
//       } else {
//         console.error("Cab Probable Failed:", response?.message);
//         setCabModelList([]);
//       }
//     } catch (error) {
//       console.error("Error fetching cab models:", error.message);
//       return [];
//     }
//   }

//   return (
//     <div className="rounded-md overflow-hidden shadow-md border dark:border-slate-700 mx-2">
//       <div className="flex md:flex-row items-start md:items-center justify-between gap-4 p-4 text-sm bg-gradient-to-r from-[#F0F5FD] to-[#B9EAFF] dark:from-[#1E1F2D] dark:to-[#323B50]">
//         <div className="flex items-start md:items-center gap-4 flex-wrap flex-1">
//           <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center shadow-sm">
//             <button onClick={() => setIsOpen(true)}>
//               <Image src="/icons/driver.png" alt="Taxi Icon" width={40} height={40} />
//             </button>
//           </div>

//           <div className="flex flex-col space-y-[-2px]">
//             <span className="text-[12px] text-blue-600 uppercase tracking-wide">Cab Details</span>
//             <div className="flex items-center justify-between">
//               <span className="text-[12px] dark:text-white">
//                 <span className="text-black text-[14px] font-semibold">{rideDetails?.op_cab_details_json?.drv_name}</span> | <span className="text-[14px] font-semibold">{rideDetails?.cab_details_json?.reg_no}</span>
//               </span>
//             </div>
//           </div>
//         </div>

//         <div className="flex items-center gap-2">
//           <div className="inline-flex items-center bg-gradient-to-r from-blue-500 to-cyan-400 dark:bg-slate-700 px-3 py-[2px] rounded-md border border-gray-300 dark:border-slate-600 dark:text-gray-200 shadow-sm max-w-full">
//             <FaLocationDot className="mr-2 text-white dark:text-red-300 text-[12px]" />
//             <span className="font-semibold text-[12px] mr-1 text-white">Patna</span>
//             <span className="text-[12px] text-white dark:text-gray-300 truncate">
//               | New Tarachak, Danapur, Patna, Bihar. 150 m from Ma...
//             </span>
//           </div>
//           <button
//             onClick={() => setShowContent(!showContent)}
//             className="text-black dark:text-white cursor-pointer text-xl transition-transform duration-300"
//           >
//             <FaCaretDown className={`text-2xl transform transition-transform duration-300 ${showContent ? 'rotate-180' : ''}`} />
//           </button>
//         </div>
//       </div>

//       {showContent && (
//         <div>
//           <div className="m-4 p-4 flex flex-col md:flex-row gap-6 bg-white dark:bg-slate-800 rounded-xl">
//             <div className="w-full flex flex-col items-center justify-between md:flex-row flex-wrap">
//               <div className="w-full md:w-[30%]">
//                 <div className="relative">
//                   <label className="text-[12px] text-gray-400 dark:text-gray-200 block">Assign Cab</label>
//                   <div className="relative">
//                     <input
//                       type="text"
//                       value={cabNumber?.cab_reg || rideDetails?.cab_details_json?.cab_reg || ''}
//                       onChange={handleInputChange}
//                       placeholder="Search Cab"
//                       className="w-full border border-gray-300 dark:border-slate-600 px-4 py-2 pr-[80px] text-sm rounded-md bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-200"
//                     />
//                     <button
//                       type="button"
//                       onClick={cabProbability}
//                       className={`absolute right-1 top-1/2 -translate-y-1/2 ${rideDetails?.cab_reg ? 'bg-green-600' : 'bg-[#005FE2]'
//                         } text-white text-xs font-semibold px-3 py-[7px] rounded-md`}
//                     >
//                       {rideDetails?.status.toLowerCase() === 'confirmed' ? 'Probable' : 'Update Cab'}
//                     </button>
//                   </div>

//                   {showCabList && searchData.length > 0 && (
//                     <ul className="mt-2 max-h-60 overflow-y-auto bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-md shadow-lg z-10">
//                       {searchData.map((cab, index) => (
//                         <li
//                           key={index}
//                           className="px-4 py-2 hover:bg-blue-100 dark:hover:bg-slate-700 cursor-pointer"
//                           onClick={() => {
//                             setCabNumber(cab);
//                             setShowCabList(false);
//                           }}
//                         >
//                           {cab?.cab_reg} - {cab?.driver_name}
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                   {rideDetails?.status?.toLowerCase() !== 'confirmed' && (
//                     <div className="w-full">
//                       <label className="text-[12px] text-gray-400 dark:text-gray-200 block mt-1">Change Reason</label>
//                       <select
//                         value={changeReason}
//                         onChange={(e) => setChangeReason(e.target.value)}
//                         className="w-full border border-gray-300 dark:border-slate-600 px-4 py-2 text-sm rounded-md bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       >
//                         <option value="">--Please Select the Reason--</option>
//                         <option value="Breakdown">Breakdown</option>
//                         <option value="Delayed">Delayed</option>
//                         <option value="Refused">Refused</option>
//                       </select>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="w-full md:w-[32%] bg-gradient-to-br from-[#EFF6FF] to-[#E0E7FF] p-4 rounded-md shadow-md flex items-center gap-4 relative">
//                 <div className="relative shrink-0">
//                   <div className="w-20 h-20 md:w-20 md:h-20 rounded-full  flex items-center justify-center">
//                     <Image
//                       src={rideDetails?.op_cab_details_json?.cab_icon}
//                       alt="Profile"
//                       width={80}
//                       height={80}
//                       className="rounded-full object-contain"
//                     />
//                   </div>
//                 </div>
//                 <div className="flex-1">
//                   <div className="text-[14px] font-semibold text-gray-900">
//                     {rideDetails?.booking_type.toUpperCase()}(<span className="text-[12px] font-normal">{rideDetails?.op_cab_details_json?.cab_type}</span>)
//                     <span className="ml-2">{rideDetails?.cab_reg}</span>
//                   </div>
//                   <div className="flex items-center gap-2 text-sm text-gray-700 mt-1">
//                     <FaMapMarkerAlt className="text-purple-600 text-sm" />
//                     <div className="relative group w-fit max-w-[150px]">
//                       <span className="block truncate text-gray-800 dark:text-gray-200">
//                         Rajmati Complex Bailey Road patna Bihar
//                       </span>

//                       <div className="absolute left-0 top-full mt-1 hidden w-max max-w-xs rounded-md bg-black px-2 py-1 text-xs text-white shadow-lg group-hover:block z-50">
//                         Rajmati Complex Bailey Road patna Bihar
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="absolute bottom-[-18px] left-[38%]">
//                   <button
//                     className="w-full text-[14px] bg-white hover:opacity-90 text-black px-4 py-1.5 rounded-full border border-gray-400 transition-all shadow-md"
//                     onClick={assignCabs}>
//                     Assign Cab
//                   </button>
//                 </div>
//               </div>

//               <div className="w-full md:w-[32%] bg-gradient-to-br from-[#EFF6FF] to-[#E0E7FF] p-4 rounded-md shadow-md flex items-center gap-4">
//                 <div className="relative shrink-0">
//                   <div className="w-16 h-16 md:w-20 md:h-20 p-1 bg-gradient-to-tr from-[#a78bfa] to-[#6366f1] rounded-full overflow-hidden">
//                     <Image
//                       src={rideDetails?.driver_details_json?.drv_icon || "/images/kumar.jpg"}
//                       alt="Profile"
//                       width={80}
//                       height={80}
//                       className="rounded-full object-cover"
//                     />
//                   </div>
//                   <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
//                 </div>
//                 <div className="flex-1">
//                   <h2 className="text-base md:text-lg font-semibold text-gray-900">{rideDetails?.driver_details_json?.drv_name}</h2>
//                   <div className="flex items-center text-sm text-gray-600 gap-1 mb-2">
//                     {[...Array(5)].map((_, i) => (
//                       <FaStar key={i} className={`text-yellow-400 ${i === 4 ? 'text-gray-300' : ''}`} />
//                     ))}
//                     <span className="ml-1 font-medium">4.8</span>
//                     <span className="text-xs text-gray-500">(142 reviews)</span>
//                   </div>
//                   <div className="flex items-center gap-4 text-sm text-gray-700 flex-wrap">
//                     <div className="flex items-center gap-1">
//                       <FaMapMarkerAlt className="text-purple-600 text-sm" />
//                       <span>{rideDetails?.driver_details_json?.location || 'Saharsa'}</span>
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <FaPhoneAlt className="text-pink-600 text-sm" />
//                       <span>+91-{rideDetails?.driver_details_json?.driver_mobile}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//       <ImageModal isOpen={isOpen} onClose={() => setIsOpen(false)} imageUrl={imageUrl} />
//     </div>

//   );
// };

// export default CabDetailsPage;