"use client";
import { apiClient } from "@/app/lib/apiClient";
import AllRideTable from "@/components/cards/AllRideTable";
import CustomLoader from "@/components/common/CustomLoader";
import { collectCash } from "@/services/rideManagement";
import { useCallback, useEffect, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { toast } from "react-toastify";

const RideList = () => {
    const observerRef = useRef();
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [driver_id, setSelectedDriverId] = useState();
    const [rideList, setRideList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [driver_source, setDriverSource] = useState("Rodbez")
    const [fleetFilter, setFleetFilter] = useState("");
    const [show, setShow] = useState(false);
    const [nameSearch, setNameSearch] = useState("");
    const [totalRecords, setTotalRecords] = useState(0);
    const [RodbezDrivers, setRodbezDrivers] = useState([]);
    const [marketDrivers, setMarketDrivers] = useState([]);

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

    // Fetch Rodbez drivers
    const fetchRodbezDrivers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await apiClient("GET", "/rb_drivers/getAllDriver", {});
            if (response.status || response.success) {
                setRodbezDrivers(response.data.data || response.data || []);
            }
        } catch (error) {
            console.error("Error fetching Rodbez drivers:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch Market drivers
    const fetchMarketDrivers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await apiClient(
                "GET",
                "/fleet/getAllFeetlOperatorList",
                {}
            );
            if (response.status || response.success) {
                setMarketDrivers(response.data.data || response.data || []);
            }
        } catch (error) {
            console.error("Error fetching Operator drivers:", error);
        } finally {
            setLoading(false);
        }
    }, []);

      // When show popup is true, fetch both drivers
      useEffect(() => {
        if (show) {
          fetchRodbezDrivers();
          fetchMarketDrivers();
        }
      }, [show, fetchRodbezDrivers, fetchMarketDrivers]);
    
      // Map Rodbez drivers to uniform format
      const mappedRodbez = RodbezDrivers.map((d) => ({
        driverId: d.id,
        driverName: d.driverName,
        driverMobile: d.driverMobile || "N/A",
        fleetType: "Rodbez",
      }));
    
      // Map Market drivers to uniform format
      const mappedMarket = marketDrivers.map((d) => ({
        driverId: d.id,
        driverName: d.full_name || d.driverName || "Unknown",
        driverMobile: d.mobile_no || "N/A",
        fleetType: "Operator",
      }));
    
      // Combine based on fleet filter
      const combinedDrivers =
        driver_source === "Rodbez"
          ? mappedRodbez
          : driver_source === "Operator"
          ? mappedMarket
          : [...mappedRodbez, ...mappedMarket];
    
      // Filter combined drivers by search fields
      const displayData = combinedDrivers.filter(
        (d) =>
          d.driverName.toLowerCase().includes(nameSearch.toLowerCase())
          || d.driverMobile.toLowerCase().includes(nameSearch.toLowerCase())
        
      );
    
    const fetchNotCollectedRides = async (pageNo) => {
        try {
            const params = {
                page: pageNo,
                cab_source: fleetFilter ||(driver_id? driver_source: ""),
                driver_id: driver_id,
                limit: 100
            }
            const response = await apiClient("GET", `/ride_management/getBookingListCashNotCollected`, params);
            let tempArr = [];
            if (response.status || response.success) {
                setTotalRecords(response.meta?.totalCount || 0);
                tempArr = response.data;
                
                if (pageNo === 1) {
                    setRideList(tempArr);
                } else {
                    if (tempArr?.length > 0) {
                        setRideList((prev) => [...prev, ...tempArr]);
                    } else {
                        setHasMore(false);
                    }
                }
            }
        } catch (e) {
            console.log(e);
        }
    };
    const toggleBtnClass = (selected, val) =>
        `px-2 py-1 rounded-full text-xs sm:text-sm font-medium border transition ${selected === val
            ? "bg-gradient-to-r from-[#15803D] to-[#81CA18] text-white border-none"
            : "bg-white border border-gray-300 text-gray-700"
        }`;

    useEffect(() => {
        if (!hasMore && page > 1) return;
        setLoading(true);
        if (page === 1) {
            setRideList([]);
        }
        fetchNotCollectedRides(page).finally(() => setLoading(false));
    }, [page, hasMore, fleetFilter]);

    const handleCashCollect = async (rideDetails) => {
        console.log(rideDetails)
        if (!rideDetails?.urid) return;
        try {
            const response = await collectCash(rideDetails.urid, rideDetails?.cab_details_json?.cab_source);
            if (response?.success) {
                toast.success("Cash collected successfully!");
                fetchNotCollectedRides(1).then(() => setLoading(false));
            } else {
                toast.error(response?.message || "Failed to collect cash");
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <div className="w-1 h-3 sm:h-6 rounded-md bg-green-700 mr-2 sm:mr-3"></div>
                    <h2 className=" text-[16px] md:text-2xl font-bold font-nunito bg-gradient-to-r from-[#15803D] to-[#81CA18] bg-clip-text text-transparent">
                        Cash Not Collected Booking List
                    </h2>
                </div>
            </div>
            <div>
                <div className="flex p-4 sm:my-0 justify-between">
                    <div className="w-full flex space-x-2 sm:space-x-3 items-center">
                        <button
                            onClick={() => setFleetFilter("")}
                            className={toggleBtnClass(fleetFilter, "")}
                            aria-label="Filter Personal Fleet Type"
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFleetFilter("Rodbez")}
                            className={toggleBtnClass(fleetFilter, "Rodbez")}
                            aria-label="Filter Personal Fleet Type"
                        >
                            RodBez
                        </button>
                        <button
                            onClick={() => setFleetFilter("Operator")}
                            className={toggleBtnClass(fleetFilter, "Operator")}
                            aria-label="Filter Market Fleet Type"
                        >
                            Operator
                        </button>
                    </div>
                    <div className="flex items-center gap-2 w-full">
                        <button
                            type="button"
                            className={`w-full min-w-max font-nunito px-2 md:px-4 py-1 md:py-2 rounded-lg font-medium shadow flex items-center text-[10px] sm:text-base hover:border-2 transition-colors duration-300 ${(driver_id) ? "bg-blue-500 text-white" : "bg-white text-gray-500"}`}
                            onClick={() => {
                                console.log("Button clicked");
                                setShow(true);
                            }}
                        >
                            {driver_id? combinedDrivers?.find(driver=> driver?.driverId == driver_id).driverName:"Select Drivers"}
                        </button>

                        {driver_id && <button
                            className={`h-full flex items-center justify-center rounded-lg hover:bg-gray-200 bg-white`}
                            onClick={() => {
                                setSelectedDriverId(prev => "");
                                setTimeout(()=>{
                                    fetchNotCollectedRides(1);
                                },100)
                            }}
                            aria-label="Clear Selection"
                        > <span className="text-xl text-red-700">  × </span>
                        </button>}
                        {show && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-2">
                                <div className="bg-white rounded-2xl shadow-lg w-full max-w-[650px] max-h-[80vh] flex flex-col overflow-hidden">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-4 sm:py-5">
                                        <span className="font-bold text-lg sm:text-xl flex-1">
                                            <span className="font-nunito bg-gradient-to-r from-[#15803D] to-[#81CA18] bg-clip-text text-transparent">
                                                Driver List
                                            </span>
                                        </span>

                                        <div className="flex justify-center my-2 sm:my-0">
                                            <div className="inline-flex space-x-2 sm:space-x-3 items-center w-[280px]">
                                                <button
                                                    onClick={() => setDriverSource("Rodbez")}
                                                    className={toggleBtnClass(driver_source, "Rodbez")}
                                                    aria-label="Filter Personal Fleet Type"
                                                >
                                                    RodBez
                                                </button>
                                                <button
                                                    onClick={() => setDriverSource("Operator")}
                                                    className={toggleBtnClass(driver_source, "Operator")}
                                                    aria-label="Filter Market Fleet Type"
                                                >
                                                    Operator
                                                </button>
                                            </div>
                                        </div>

                                        {/* Close Button */}
                                        <div className="w-8 h-8 rounded-lg p-[2px] bg-gradient-to-r from-[#15803D] to-[#81CA18] shadow ml-2">
                                            <button
                                                className="w-full h-full flex items-center justify-center rounded-lg text-green-700 hover:bg-gray-200 text-xl bg-white"
                                                onClick={() => setShow(false)}
                                                aria-label="Close"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    </div>

                                    {/* Search Inputs */}
                                    <div className="flex flex-col sm:flex-row gap-3 px-4">
                                        <div className="relative flex-1">
                                            <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />
                                            <input
                                                type="text"
                                                placeholder="Search by Name"
                                                value={nameSearch}
                                                onChange={(e) => setNameSearch(e.target.value)}
                                                className="w-full border-gray-300 rounded-lg pl-10 pr-3 py-2 shadow-sm outline-none text-base"
                                            />
                                        </div>
                                        {/* <div className="relative flex-1">
                                                                   <FaCarSide className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />
                                                                   <input
                                                                     type="text"
                                                                     placeholder="Search by Cab No."
                                                                     value={cabSearch}
                                                                     onChange={(e) => setCabSearch(e.target.value)}
                                                                     className="w-full border-gray-300 rounded-lg pl-10 pr-3 py-2 shadow-sm outline-none text-base"
                                                                   />
                                                                 </div> */}
                                    </div>

                                    {/* Table */}
                                    <div className="overflow-auto flex-grow px-4 my-3 scroll-hide">
                                        <table className="w-full text-sm border-separate [border-spacing:0] min-w-[500px]">
                                            <thead className="sticky top-0 bg-gradient-to-r from-[#18A83E] to-[#B6F162] z-10">
                                                <tr>
                                                    <th className="text-left text-white px-3 py-2  rounded-tl-xl font-normal">
                                                        Driver Name
                                                    </th>
                                                    <th className="text-left text-white px-3 py-2 font-normal  rounded-tr-xl">
                                                        Mobile Number
                                                    </th>
                                                    {/* <th className="text-left text-white px-3 py-2 font-normal">
                                                  Cab Type
                                                </th> */}
                                                    {/* <th className="text-left text-white px-3 py-2 rounded-tr-xl font-normal">
                                                 Fleet Type
                                                </th> */}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {displayData.length > 0 ? (
                                                    displayData.map((d) => (
                                                        <tr
                                                            key={d.driverId+d.driverMobile+d.driverName}
                                                            onClick={() => {
                                                                // let tempArr = (driver_id && driver_id.length > 0) ? [...driver_id] : [];
                                                                // const index = tempArr.indexOf(d.driverId);
                                                                // if (index > -1) {
                                                                //     tempArr = tempArr.filter((id) => id !== d.driverId);
                                                                // } else {
                                                                //     tempArr.push(d.driverId);
                                                                // }
                                                                setSelectedDriverId(prev => d.driverId);
                                                            }}
                                                            className={`border-b last:border-0 cursor-pointer transition ${driver_id===d.driverId
                                                                    ? "bg-green-200"
                                                                    : "hover:bg-gray-200"
                                                                }`}
                                                        >
                                                            <td className="py-2 px-3">{d.driverName}</td>
                                                            <td className="py-2 px-3">{d.driverMobile}</td>
                                                            {/* <td className="py-2 px-3">{d.fleetType}</td> */}
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td
                                                            colSpan={3}
                                                            className="py-4 text-center text-gray-400"
                                                        >
                                                            No records found
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="footer flex justify-end w-full py-2 px-4 border-t-2">
                                        <button
                                            className="border px-2 py-1 flex items-center justify-center rounded-lg text-green-700 hover:bg-gray-200 text-xl bg-white"
                                            onClick={() => {
                                                fetchNotCollectedRides(1).then(() => setLoading(false)); setShow(false);
                                            }}
                                            aria-label="Close"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
            <div className="px-4">{`${totalRecords} ${ totalRecords<=1? "Ride": "Rides"} Found`}</div>
            <AllRideTable custom={true} moreData={hasMore} handleCashCollect={handleCashCollect} rides={rideList} checklastCardRef={lastCardRef} />
            {loading && rideList?.length > 0 &&  <CustomLoader />}
        </div>
    )
}
export default RideList;