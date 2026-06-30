import { apiClient } from "@/app/lib/apiClient";
import AllRideCard from "@/components/cards/AllRideCard";
import AllRideTable from "@/components/cards/AllRideTable";
import CustomLoader from "@/components/common/CustomLoader";
import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaCheck, FaCheckCircle, FaEdit, FaList, FaTh, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

const MarketBookingList = ({isChild = false}) => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [viewType, setViewType] = useState("Card");
    const observerRef = useRef();
    const [dateFilter, setDateFilter] = useState({startDate: null, endDate: null, status: null});
    const statusOptions = [{
        label: "All",
        value: ""
    },{
        label: "Assigned",
        value: "assigned"
    },{
        label: "Arrived",
        value: "arrived"
    },{
        label: "Started",
        value: "started"
    },{
        label: "Confirmed",
        value: "confirmed"
    },{
        label: "Completed",
        value: "completed"
    },{
        label: "Cancelled",
        value: "cancelled"
    }]
    
    const lastCardRef = useCallback((node) => {
        if (!hasMore) return;
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setPage(prev => prev + 1);
            }
        });
        if (node) observerRef.current.observe(node);
    }, [hasMore]);

    const fetchList = useCallback(async (pageNo) => {
        try {
            setLoading(true);
            const params = {
                StartDate: dateFilter?.startDate? moment(dateFilter.startDate).format("YYYY-MM-DD"): null,
                EndDate: dateFilter?.endDate? moment(dateFilter?.endDate).format("YYYY-MM-DD"): null,
                status: dateFilter?.status,
                page: pageNo,
                limit: 20,
            }
            const response = await apiClient("GET", "/fleet/getMarketFleetBookingList", params);
            setLoading(false);
            let ridesArr = [];
            if (Array.isArray(response?.data)) {
                ridesArr = response.data.bookings || [];
            } else if (response?.data?.bookings && Array.isArray(response.data.bookings)) {
                ridesArr = response.data.bookings;
                setTotalCount(response?.data?.totalItems);
            }
            if (pageNo === 1) {
                setList(ridesArr);
            } else {
                if (response.data.bookings?.length > 0) {
                    setList((prev) => [...prev, ...ridesArr]);
                } else {
                    setHasMore(false);
                }
            }
        } catch (e) {
            console.log(e);
        }
    },[dateFilter]);

    useEffect(() => {
        if (!hasMore && page > 1) return;
        setLoading(true);
        if (page === 1) {
            setList([]);
        }
        console.log(dateFilter)
        fetchList(page).finally(() => setLoading(false));
    }, [page, hasMore, fetchList]);

    useEffect(() => {
        fetchList(1).finally(() => setLoading(false));
    }, [dateFilter, dateFilter.status, fetchList])

    return (

        <div className={`bg-white rounded-lg shadow-md ${isChild? "":"p-6 mt-4"}  mx-auto w-full`}>
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <div className="w-1 h-3 sm:h-6 rounded-md bg-green-700 mr-2 sm:mr-3"></div>
                    <h2 className=" text-[16px] md:text-2xl font-bold font-nunito bg-gradient-to-r from-[#15803D] to-[#81CA18] bg-clip-text text-transparent">
                        Market Booking List
                    </h2>
                </div>
                <div className="flex items-center gap-4 justify-between">
                    <div>
                        <label htmlFor="DateRange" className='text-xs'>Date Range</label>
                        <div className='flex gap-4' id='DateRange'>
                            <input
                                type="date"
                                placeholder='Start Date'
                                value={dateFilter.startDate ? dateFilter.startDate : ""}
                                className="py-2 px-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-white"

                                onChange={(e) => setDateFilter({ ...dateFilter, startDate: e.target.value ? moment(e.target.value).format("YYYY-MM-DD") : null })}
                            />
                            <input
                                type="date"
                                placeholder='End Date'
                                className="py-2 px-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-white"
                                value={dateFilter.endDate ? dateFilter.endDate : ""}
                                onChange={(e) => setDateFilter({ ...dateFilter, endDate: e.target.value ? moment(e.target.value).format("YYYY-MM-DD") : null })}
                            />
                        </div>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="Ride_Type" className='text-xs'>Status: </label>
                        <select
                            id='Ride_Type'
                            className="py-2 px-3 bg-white rounded-lg dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-sm text-gray-700 dark:text-white"
                            value={dateFilter.status || ""}
                            onChange={(e) => setDateFilter({ ...dateFilter, status: e.target.value ? e.target.value : "" })}
                        >
                            {statusOptions.map(opt => (
                                <option key={opt.label} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div></div>
                        <div className="flex items-center bg-gray-600 gap-0 rounded-md">
                            <button
                                className={`flex items-center gap-2 px-3 py-1 rounded-l-md border ${viewType === 'Card' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                                onClick={() => setViewType('Card')}
                            >
                                <FaTh />
                            </button>
                            <button
                                className={`flex items-center gap-2 px-3 py-1 rounded-r-md border ${viewType === 'Table' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                                onClick={() => setViewType('Table')}
                            >
                                <FaList />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="max-w-full bg-white md:p-0 p-2  shadow-md rounded-lg">
                { viewType === "Card"? 
                    <AllRideCard rides={list || []}
                    moreData={hasMore}
                    checklastCardRef={lastCardRef}
                    />
                :
                    <AllRideTable rides={list || []} 
                    moreData={hasMore}
                    checklastCardRef={lastCardRef} />
                }
                {loading && list?.length > 0 &&  <CustomLoader />}
            </div>
        </div>
    )
}
export default MarketBookingList;