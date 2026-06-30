// "use client";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import OperatorOnboarding from "@/components/fleet/AddFleetOperator/page";
// import { Users, UserCheck, Car, Clock, Search, Filter } from "lucide-react";
// import { apiClient } from "@/app/lib/apiClient";

// export default function FleetOperators() {
//   const [showOnboarding, setShowOnboarding] = useState(false);
//   const [operators, setOperators] = useState([]);
//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   // const [operators, setOperators] = useState([
//   //   {
//   //     id: 1,
//   //     name: "Ritik Kumar",
//   //     mobile: "9304866538",
//   //     whatsapp: "9304866538",
//   //     vehicle: "BR01AB1234",
//   //     gender: "Male",
//   //     status: "Active",
//   //   },
//   //   {
//   //     id: 2,
//   //     name: "Aman Singh",
//   //     mobile: "9876543210",
//   //     whatsapp: "9876543210",
//   //     vehicle: "BR02CD5678",
//   //     gender: "Male",
//   //     status: "Pending",
//   //   },
//   //   {
//   //     id: 3,
//   //     name: "Priya Sharma",
//   //     mobile: "9123456780",
//   //     whatsapp: "9123456780",
//   //     vehicle: "BR03EF3456",
//   //     gender: "Female",
//   //     status: "Active",
//   //   },
//   // ]);
//   const router = useRouter();

//   const fetchOperators = async () => {
//     if (loading || !hasMore) return;

//     setLoading(true);

//     try {
//       const res = await apiClient(
//         "GET",
//         `/fleet/admin/operator-cab/my-cabs?operator_id=2831&page=${page}&limit=20&search=`,
//       );

//       const data = res?.data || [];
//       console.log(res, "daatatattatat");

//       if (data.length === 0) {
//         setHasMore(false);
//       } else {
//         // setOperators((prev) => [...prev, ...data]);
//         setPage((prev) => prev + 1);
//       }
//     } catch (err) {
//       console.error(err);
//     }

//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchOperators();
//   }, []);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (
//         window.innerHeight + window.scrollY >=
//         document.body.offsetHeight - 200
//       ) {
//         fetchOperators();
//       }
//     };

//     window.addEventListener("scroll", handleScroll);

//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [page, loading]);

//   return (
//     <div className=" bg-gray-50 min-h-screen">
//       {!showOnboarding && (
//         <>
//           <div className="flex justify-between items-center bg-white py-5 px-6  mb-6">
//             <div>
//               <h1 className="text-xl font-semibold">Fleet Operators</h1>
//               <p className="text-sm text-gray-500">
//                 Manage and monitor all onboarded operators
//               </p>
//             </div>

//             <button
//               onClick={() => setShowOnboarding(true)}
//               className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
//             >
//               + Add Operator
//             </button>
//           </div>

//           <div className="p-6">
//             <div className="grid grid-cols-4 gap-4 mb-6">
//               <div className="bg-white border rounded-xl p-6 flex items-center gap-3">
//                 <div className="bg-blue-100 p-2 rounded-xl">
//                   <Users className="text-blue-700" size={24} />
//                 </div>

//                 <div>
//                   <p className="text-xl font-semibold">0</p>
//                   <p className="text-xs font-medium text-gray-500">
//                     Total Operators
//                   </p>
//                 </div>
//               </div>
//               <div className="bg-white border rounded-xl p-6 flex items-center gap-3">
//                 <div className="bg-green-100 p-2 rounded-xl">
//                   <UserCheck className="text-green-700" size={24} />
//                 </div>

//                 <div>
//                   <p className="text-xl font-semibold">0</p>
//                   <p className="text-xs font-medium text-gray-500">Active</p>
//                 </div>
//               </div>
//               <div className="bg-white border rounded-xl p-6 flex items-center gap-3">
//                 <div className="bg-orange-100 p-2 rounded-xl">
//                   <Car className="text-orange-500" size={24} />
//                 </div>

//                 <div>
//                   <p className="text-xl font-semibold">0</p>
//                   <p className="text-xs font-medium text-gray-500">Vehicles</p>
//                 </div>
//               </div>
//               <div className="bg-white border rounded-xl p-6 flex items-center gap-3">
//                 <div className="bg-yellow-100 p-2 rounded-xl">
//                   <Clock className="text-yellow-500" size={24} />
//                 </div>

//                 <div>
//                   <p className="text-xl font-semibold">0</p>
//                   <p className="text-xs font-medium text-gray-500">Pending</p>
//                 </div>
//               </div>
//             </div>

//             <div className="flex gap-3 mb-6 bg-white p-4 shadow-sm rounded-xl">
//               <div className="flex items-center bg-gray-50 border rounded-xl px-3 w-full">
//                 <Search size={16} className="text-gray-400" />

//                 <input
//                   placeholder="Search by name, vehicle, or driver..."
//                   className="w-full bg-gray-50 p-2 outline-none text-sm"
//                 />
//               </div>

//               <button className="flex items-center gap-2 border px-4 rounded-xl bg-gray-50 text-sm">
//                 <Filter size={16} />
//                 Filters
//               </button>
//             </div>
//             {operators.length === 0 ? (
//               <div className="bg-white border rounded-xl p-12 flex flex-col items-center text-center">
//                 <div className="bg-gray-100 p-4 rounded-full mb-4">
//                   <Users className="text-gray-400" />
//                 </div>

//                 <h2 className="text-lg font-semibold mb-1">No operators yet</h2>

//                 <p className="text-gray-500 text-sm mb-4">
//                   Start by onboarding your first fleet operator.
//                 </p>

//                 <button
//                   onClick={() => setShowOnboarding(true)}
//                   className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
//                 >
//                   + Add First Operator
//                 </button>
//               </div>
//             ) : (
//               <div className="bg-white border rounded-xl overflow-hidden">
//                 <table className="w-full text-sm">
//                   <thead className="bg-gray-50 text-gray-500">
//                     <tr className="text-left">
//                       <th className="p-4">Operator</th>
//                       <th className="p-4">Contact</th>
//                       <th className="p-4">Vehicle</th>
//                       <th className="p-4">Driver</th>
//                       <th className="p-4">Status</th>
//                       <th className="p-4">Date</th>
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {operators.map((op) => (
//                       <tr key={op.id} className="border-t hover:bg-gray-50">
//                         <td className="p-4">
//                           <div className="flex items-center gap-3">
//                             <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
//                               {op.name.charAt(0)}
//                             </div>

//                             <div>
//                               <p className="font-medium text-gray-800">
//                                 {op.name}
//                               </p>
//                               <p className="text-xs text-gray-500">
//                                 {op.gender}
//                               </p>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="p-4 text-gray-700">{op.mobile}</td>
//                         <td className="p-4">
//                           <div>
//                             <p className="font-medium text-gray-800">
//                               {op.vehicle}
//                             </p>
//                             <p className="text-xs text-gray-500">SUV</p>
//                           </div>
//                         </td>
//                         <td className="p-4 text-gray-700">
//                           {op.driver || op.name}
//                         </td>
//                         <td className="p-4">
//                           <span
//                             className={`px-3 py-1 text-xs rounded-full font-medium
//                 ${
//                   op.status === "Active"
//                     ? "bg-green-100 text-green-700"
//                     : "bg-yellow-100 text-yellow-700"
//                 }
//               `}
//                           >
//                             {op.status}
//                           </span>
//                         </td>
//                         <td className="p-4 text-gray-500">
//                           {op.date || "21 Feb 2026"}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//                 {loading && (
//                   <div className="text-center py-4 text-gray-500">
//                     Loading more operators...
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </>
//       )}
//       {showOnboarding && (
//         // <OperatorOnboarding close={() => setShowOnboarding(false)} />
//         <OperatorOnboarding
//           close={() => setShowOnboarding(false)}
//           onSave={(data) => {
//             setOperators((prev) => [...prev, data]);
//             setShowOnboarding(false);
//           }}
//         />
//       )}
//     </div>
//   );
// }

"use client";
import OperatorOnboarding from "@/components/fleet/AddFleetOperator/page";
import React from "react";

const page = () => {
  return (
    <div>
      <OperatorOnboarding />
    </div>
  );
};

export default page;
