// "use client"
// import { useCallback, useEffect, useRef, useState } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import { apiClient } from "@/app/lib/apiClient";
// import { FaEye } from "react-icons/fa";

// const statusBadge = {
//   active: "bg-green-100 text-green-800",
//   blocked: "bg-red-100 text-red-800",
// };

// export default function CustomerListTable() {

//   const [searchText, setSearchText] = useState(null);
//   const [customers, setCustomers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const [page, setPage] = useState(1);
//   const observerRef = useRef();

//   const router = useRouter();

//   const user = (id) => {
//     router.push(`/fleetManagement/userDetails/${id}`);
//   };

//   const fetchUserList = useCallback(async (pageNo) => {
//     try {
//       const response = await apiClient("GET", `/user_management/getAllUsersDetails`, {
//         page: pageNo,
//         search: searchText
//       });
//       console.log(response)
//       if(response.status || response.success) {
//         let tempArr = response.data;
//         console.log(tempArr)
//         if (pageNo === 1) {
//             setCustomers(tempArr);
//           } else {
//               if (tempArr?.length > 0) {
//               setCustomers((prev) => [...prev, ...tempArr]);
//               } else {
//                 setHasMore(false);
//               }
//           }
//       }

//     } catch (e) {
//       console.log(e);
//     } finally {
//       setLoading(false);
//     }
//   }, [searchText])

//   useEffect(()=>{
//     if(page >1 && !hasMore) return;
//     // setHasMore(true);
//     setLoading(true);
//     fetchUserList(page).finally(()=> setLoading(false));
//   }, [page, hasMore, fetchUserList]);

//   const lastCardRef = useCallback((node) => {
//     if (!hasMore) return;
//     if (observerRef.current) observerRef.current.disconnect();

//     observerRef.current = new IntersectionObserver(entries => {
//       if (entries[0].isIntersecting) {
//         setPage(prev => prev + 1);
//       }
//     });
//     if (node) observerRef.current.observe(node);
//   }, [hasMore]);

//   useEffect(()=>{
//     fetchUserList(1).finally(()=> setLoading(false));
//   }, [searchText, fetchUserList]);

//   return (
//     <div className="w-full max-w-full mx-auto mt-4">
//       <div className="bg-[#f0f4e5] rounded-t-xl px-4 py-5 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h2 className="font-semibold text-gray-800">Customer List</h2>
//           <p className="text-gray-500 mt-1">Manage and view all customer information</p>
//         </div>
//         <div className="mt-3 sm:mt-0">
//           <input
//             className="w-80 rounded-lg px-4 py-2 text-sm border border-gray-300 focus:border-blue-500 focus:outline-none"
//             type="text"
//             placeholder="Search by ID, RBID, Mobile or Customer…"
//             value={searchText}
//             onChange={(e) => setSearchText(e.target.value)}
//           />

//         </div>
//       </div>

//       <div className="overflow-x-auto bg-white rounded-b-xl shadow">
//         <table className="min-w-full mt-2">
//           <thead className="bg-[#F2FBFE] border-b border-gray-200 ">
//             <tr>
//               <th className="px-5 py-4 text-xs font-medium text-gray-500 text-left">ID</th>
//               <th className="px-5 py-4 text-xs font-medium text-gray-500 text-left">RB ID</th>
//               <th className="px-5 py-4 text-xs font-medium text-gray-500 text-left">Customer</th>
//               <th className="px-5 py-4 text-xs font-medium text-gray-500 text-left">Mobile</th>
//               {/* <th className="px-5 py-4 text-xs font-medium text-gray-500 text-left">City</th> */}
//               <th className="px-5 py-4 text-xs font-medium text-gray-500 text-left">Status</th>
//               <th className="px-5 py-4 text-xs font-medium text-gray-500 text-left">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {customers.length === 0 && (
//               <tr>
//                 <td colSpan="7" className="text-center text-gray-500 py-8">
//                   No customers found.
//                 </td>
//               </tr>
//             )}
//             {customers.map((cust, idx) => {
//               const isLastCard = idx === customers.length -1;
//               return (
//               <tr key={`${cust.id}-${idx}`}
//                 ref={isLastCard ? lastCardRef: null}
//                 className="hover:bg-blue-50 transition"
//               >
//                 <td className="px-5 py-4 align-middle">{cust.id}</td>
//                 <td className="px-5 py-4 align-middle">{cust.ref_user_id}</td>
//                 <td className="px-5 py-4 align-middle">
//                   <div className="flex items-center gap-3">
//                     <Image
//                       src={'/images/cab-captian-avator-default.png'}
//                       width={25}
//                       height={25}
//                       alt={cust.first_name || "-"}
//                       className="w-9 h-9 rounded-full border border-gray-200 object-cover"
//                     />
//                     <span className="font-medium text-gray-800">{cust.first_name || "-"} {cust.last_name || "-"}</span>
//                   </div>
//                 </td>
//                 <td className="px-5 py-4 align-middle">{cust.mobile_no}</td>
//                 {/* <td className="px-5 py-4 align-middle">{cust.city}</td> */}
//                 <td className="px-5 py-4 align-middle">
//                   <span className={`px-3 py-1 rounded text-xs font-semibold capitalize ${statusBadge[cust.status]}`}>
//                     {cust.status}
//                   </span>
//                 </td>
//                 <td className="px-5 py-4 align-middle">
//                   <button className="text-gray-400 hover:text-gray-700"
//                     onClick={()=>user(cust.ref_user_id)}
//                   >
//                     <FaEye/>
//                   </button>
//                 </td>
//               </tr>
//             )})}

//             {!hasMore && customers.length > 0 && (
//               <tr>
//                 <td colSpan="7" className="text-center text-gray-500 py-8">
//                   No more customers available.
//                 </td>
//               </tr>
//             )}
//           </tbody>

//         </table>
//       </div>
//     </div>
//   );
// }

"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { apiClient } from "@/app/lib/apiClient";
import { FaEye } from "react-icons/fa";
import moment from "moment";
import debounce from "lodash.debounce";

const statusBadge = {
  active: "bg-green-100 text-green-800",
  blocked: "bg-red-100 text-red-800",
};

export default function CustomerListTable() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observerRef = useRef();
  const [searchText, setSearchText] = useState('');

  const router = useRouter();

  const user = (id) => {
    router.push(`/fleetManagement/userDetails/${id}`);
  };

  const fetchUserList = useCallback(
    async (pageNo) => {
      try {
        if(searchText) return;
        const response = await apiClient(
          "GET",
          `/user_management/getAllUsersDetails`,
          {
            page: pageNo,
          }
        );
        console.log(response);
        if (response.status || response.success) {
          let tempArr = response.data;
          console.log(tempArr);
          if (pageNo === 1) {
            setCustomers(tempArr);
          } else {
            if (tempArr?.length > 0) {
              setCustomers((prev) => [...prev, ...tempArr]);
            } else {
              setHasMore(false);
            }
          }
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    }, []
  );

  const searchUserList = useMemo(() => debounce(async (text) => {
      try {
        const response = await apiClient(
          "GET",
          `/user_management/search-user/${text}`
        );
        console.log(response);
        if (response.status || response.success) {
          let tempArr = response.data;
          setCustomers(tempArr);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    }, 500), []);

  const search = useCallback(
    (text) => searchUserList(text),
    [searchUserList]
  );

  useEffect(() => {
    if (page > 1 && !hasMore) return;
    // setHasMore(true);
    setLoading(true);
    if(searchText) {
      return;
    }
    fetchUserList(page).finally(() => setLoading(false));
  }, [page, hasMore, fetchUserList]);

  const lastCardRef = useCallback(
    (node) => {
      if (!hasMore) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [hasMore]
  );
  

  return (
    <div className="w-full max-w-full mx-auto mt-4">
      {/* <div className="bg-[#f0f4e5] rounded-t-xl px-4 py-5 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-gray-800">Customer List</h2>
          <p className="text-gray-500 mt-1">Manage and view all customer information</p>
        </div>
        <div className="mt-3 sm:mt-0">
          <input
            className="w-80 rounded-lg px-4 py-2 text-sm border border-gray-300 focus:border-blue-500 focus:outline-none"
            type="text"
            placeholder="Search by ID, RBID, Mobile or Customer…"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

        </div>
      </div> */}

      {/* <div className="bg-[#f0f4e5]  rounded-t-xl px-3 py-4 border-b flex flex-col  sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <div>
          <h2 className="font-semibold text-gray-800 text-base sm:text-lg">
            Customer List{" "}
          </h2>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Manage and view all customer information
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <input
            className="w-full sm:w-80 rounded-lg px-4 py-2 text-sm border border-gray-300 focus:border-blue-500 focus:outline-none"
            type="text"
            placeholder="Search by ID, RBID, Mobile or Customer…"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div> */}
      <div className="relative md:h-[60vh] h-[80vh]">
  <div className="sticky top-0 z-10 bg-[#f0f4e5] rounded-t-xl px-3 py-4 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
    <div>
      <h2 className="font-semibold text-gray-800 text-base sm:text-lg">
        Customer List
      </h2>
      <p className="text-gray-500 mt-1 text-sm sm:text-base">
        Manage and view all customer information
      </p>
    </div>
    <div className="w-full sm:w-auto">
      <input
        className="w-full sm:w-80 rounded-lg px-4 py-2 text-sm border border-gray-300 focus:border-blue-500 focus:outline-none"
        type="text"
        placeholder="Search by ID, RBID, Mobile or Customer…"
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value);
          if(e.target.value) {
            search(e.target.value);
          } else {
            setPage(prev=> 1);
            fetchUserList(1);
          }
        }}
      />
    </div>
  </div>

      {/* <div className="overflow-x-auto bg-white rounded-b-xl shadow">
        <table className="min-w-full mt-2">
          <thead className="bg-[#F2FBFE] border-b border-gray-200 ">
            <tr>
              <th className="px-5 py-4 text-xs font-medium text-gray-500 text-left">
                ID
              </th>
              <th className="px-5 py-4 text-xs font-medium text-gray-500 text-left">
                RB ID
              </th>
              <th className="px-5 py-4 text-xs font-medium text-gray-500 text-left">
                Customer
              </th>
              <th className="px-5 py-4 text-xs font-medium text-gray-500 text-left">
                Mobile
              </th>
              <th className="px-5 py-4 text-xs font-medium text-gray-500 text-left">City</th>
              <th className="px-5 py-4 text-xs font-medium text-gray-500 text-left">
                Status
              </th>
              <th className="px-5 py-4 text-xs font-medium text-gray-500 text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center text-gray-500 py-8">
                  No customers found.
                </td>
              </tr>
            )}
            {customers.map((cust, idx) => {
              const isLastCard = idx === customers.length - 1;
              return (
                <tr
                  key={`${cust.id}-${idx}`}
                  ref={isLastCard ? lastCardRef : null}
                  className="hover:bg-blue-50 transition"
                >
                  <td className="px-5 py-4 align-middle">{cust.id}</td>
                  <td className="px-5 py-4 align-middle">{cust.ref_user_id}</td>
                  <td className="px-5 py-4 align-middle">
                    <div className="flex items-center gap-3">
                      <Image
                        src={"/images/cab-captian-avator-default.png"}
                        width={25}
                        height={25}
                        alt={cust.first_name || "-"}
                        className="w-9 h-9 rounded-full border border-gray-200 object-cover"
                      />
                      <span className="font-medium text-gray-800">
                        {cust.first_name || "-"} {cust.last_name || "-"}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 align-middle">{cust.mobile_no}</td>
                  <td className="px-5 py-4 align-middle">{cust.city}</td>
                  <td className="px-5 py-4 align-middle">
                    <span
                      className={`px-3 py-1 rounded text-xs font-semibold capitalize ${
                        statusBadge[cust.status]
                      }`}
                    >
                      {cust.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 align-middle">
                    <button
                      className="text-gray-400 hover:text-gray-700"
                      onClick={() => user(cust.ref_user_id)}
                    >
                      <FaEye />
                    </button>
                  </td>
                </tr>
              );
            })}

            {!hasMore && customers.length > 0 && (
              <tr>
                <td colSpan="7" className="text-center text-gray-500 py-8">
                  No more customers available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div> */}

      <div className="overflow-x-auto w-full bg-white rounded-b-xl shadow">
        <div className="md:h-[68vh] h-[60vh]  overflow-y-auto scrollbar-hide">
          <table className="min-w-full border-collapse md:table ">
            <thead className="hidden md:table-header-group sticky top-0 z-10 bg-[#F2FBFE] border-b border-gray-200">
              <tr className="text-gray-600 text-left border-b border-gray-300 block md:table-row">
                <th className="px-5 py-4 font-medium text-xs text-gray-500 block md:table-cell">
                  ID
                </th>
                <th  className="px-5 py-4 font-medium text-xs text-gray-500 block md:table-cell">
                  RB ID
                </th>
                <th className="px-5 py-4 font-medium text-xs text-gray-500 block md:table-cell">
                  Customer
                </th>
                <th className="px-5 py-4 font-medium text-xs text-gray-500 block md:table-cell">
                  Mobile
                </th>
                {/* <th className="px-5 py-4 font-medium text-xs text-gray-500 block md:table-cell">City</th> */}
                <th className="px-5 py-4 font-medium text-xs text-gray-500 block md:table-cell">
                  Status
                </th>
                <th className="px-5 py-4 font-medium text-xs text-gray-500 block md:table-cell">
                  Date 
                </th>
              </tr>
            </thead>
            <tbody className="block md:table-row-group">
              {customers.length === 0 ? (
                <tr className="block md:table-row">
                  <td
                    colSpan="7"
                    className="text-center text-gray-500 py-8 block md:table-cell"
                  >
                    No customers found.
                  </td>
                </tr>
              ) : (
                // customers.map((cust, idx) => {
                //   const isLastCard = idx === customers.length - 1;
                //   return (
                //     <tr
                //       key={`${cust.id}-${idx}`}
                //       ref={isLastCard ? lastCardRef : null}
                //       className="hover:bg-blue-50 transition border-b border-gray-200 block md:table-row"
                //     >
                //       <td className="px-5 py-4 align-middle block md:table-cell" data-label="ID">{cust.id}</td>
                //       <td className="px-5 py-4 align-middle block md:table-cell" data-label="RB ID">{cust.ref_user_id}</td>
                //       <td className="px-5 py-4 align-middle block md:table-cell" data-label="Customer">
                //         <div className="flex items-center gap-3">
                //           <Image
                //             src={'/images/cab-captian-avator-default.png'}
                //             width={25}
                //             height={25}
                //             alt={cust.first_name || "-"}
                //             className="w-9 h-9 rounded-full border border-gray-200 object-cover"
                //           />
                //           <span className="font-medium text-gray-800">{cust.first_name || "-"} {cust.last_name || "-"}</span>
                //         </div>
                //       </td>
                //       <td className="px-5 py-4 align-middle block md:table-cell" data-label="Mobile">{cust.mobile_no}</td>
                //       {/* <td className="px-5 py-4 align-middle block md:table-cell" data-label="City">{cust.city}</td> */}
                //       {/* <td className={`px-5 py-4 align-middle block md:table-cell ${statusBadge[cust.status]}`} data-label="Status">
                //         <span className="px-3 py-1 rounded text-xs font-semibold capitalize">{cust.status}</span>
                //       </td> */}
                //         <td className="px-5 py-4 align-middle">
                //             <span
                //               className={`px-3 py-1 rounded text-xs font-semibold capitalize ${
                //                 statusBadge[cust.status]
                //               }`}
                //             >
                //               {cust.status}
                //             </span>
                //           </td>
                //       <td className="px-5 py-4 align-middle block md:table-cell" data-label="Actions">
                //         <button className="text-gray-400 hover:text-gray-700" onClick={() => user(cust.ref_user_id)}>
                //           <FaEye />
                //         </button>
                //       </td>
                //     </tr>
                //   );
                // })

                customers.map((cust, idx) => {
                  const isLastCard = idx === customers.length - 1;
                  return (
                    <tr
                      key={`${cust.id}-${idx}`}
                      ref={isLastCard ? lastCardRef : null}
                      className="hover:bg-blue-50 transition border-b border-gray-200 block md:table-row"
                      onClick={() => user(cust.ref_user_id)}
                    >
                      <td className="block w-full md:w-auto px-4 py-3 align-middle md:table-cell">
                        <div className="flex justify-between md:block">
                          <span className="font-bold text-gray-500 md:hidden">
                            ID:
                          </span>
                          <span>{cust.id}</span>
                        </div>
                      </td>
                      <td className="block w-full md:w-auto px-4 py-3 align-middle md:table-cell">
                        <div className="flex justify-between md:block">
                          <span className="font-bold text-gray-500 md:hidden">
                            RB ID:
                          </span>
                          <span>{cust.ref_user_id}</span>
                        </div>
                      </td>
                      <td className="block w-full md:w-auto px-4 py-3 align-middle md:table-cell">
                        <div className="flex justify-between items-center md:block">
                          <span className="font-bold text-gray-500 md:hidden">
                            Customer:
                          </span>
                          <span className="flex items-center gap-3">
                            <Image
                              src={"/images/cab-captian-avator-default.png"}
                              width={25}
                              height={25}
                              alt={cust.first_name || "-"}
                              className="w-9 h-9 rounded-full border border-gray-200 object-cover"
                            />
                            <span className="font-medium text-gray-800">
                              {cust.first_name || "-"} {cust.last_name || "-"}
                            </span>
                          </span>
                        </div>
                      </td>
                      <td className="block w-full md:w-auto px-4 py-3 align-middle md:table-cell">
                        <div className="flex justify-between md:block">
                          <span className="font-bold text-gray-500 md:hidden">
                            Mobile:
                          </span>
                          <span>{cust.mobile_no}</span>
                        </div>
                      </td>
                      <td className="block w-full md:w-auto px-4 py-3 align-middle md:table-cell">
                        <div className="flex justify-between md:block">
                          <span className="font-bold text-gray-500 md:hidden">
                            Status:
                          </span>
                          <span>
                            <span
                              className={`px-3 py-1 rounded text-xs font-semibold capitalize ${
                                statusBadge[cust.status]
                              }`}
                            >
                              {cust.status}
                            </span>
                          </span>
                        </div>
                      </td>
                      <td className="block w-full md:w-auto px-4 py-3 align-middle md:table-cell">
                        <div className="flex justify-between gap-5 md:block">
                          <span className="font-bold text-gray-500 md:hidden">
                            Date:
                          </span>
                          {cust.createdAt? moment(cust.createdAt).format("DD-MM-YYYY hh:mm A"): "-"}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
              {!hasMore && customers.length > 0 && (
                <tr className="block md:table-row">
                  <td
                    colSpan="7"
                    className="text-center text-gray-500 py-8 block md:table-cell"
                  >
                    No more customers available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </div>
  );
}
