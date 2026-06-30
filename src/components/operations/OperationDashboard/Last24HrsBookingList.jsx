import { apiClient } from "@/app/lib/apiClient";
import AllRideCard from "@/components/cards/AllRideCard";
import AllRideTable from "@/components/cards/AllRideTable";
import CustomLoader from "@/components/common/CustomLoader";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaTh, FaList} from "react-icons/fa";

const Last24HrsBookingList = ({isChild = false}) => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [querry, setQuerry] = useState("");
    const [searchText, setSearchText] = useState(null);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [viewType, setViewType] = useState("Card");
    const observerRef = useRef();
    const [dateFilter, setDateFilter] = useState({startDate: null, endDate: null, status: "all"});
    const statusOptions = [{
        label: "All",
        value: "all"
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
            }
            const response = await apiClient("GET", `/ride_management/list-of-last-24-hours-booking/${pageNo}`, params);
            setLoading(false);
            let ridesArr = [];
            if (Array.isArray(response?.data)) {
                ridesArr = response.data || [];
            } else if (response?.data && Array.isArray(response.data)) {
                ridesArr = response.data;
                setTotalCount(0);
            }
            if (pageNo === 1) {
                setHasMore(true);
                setList(ridesArr);
                if(ridesArr?.length === 0) {
                    setHasMore(false);
                }
            } else {
                if (response.data?.length > 0) {
                    setHasMore(true);
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
    }, [dateFilter, searchText, dateFilter.status, fetchList])

      const debouncedSearch = useMemo(() => debounce(async (querry) => {
        // if(!querry.trim()) return;
        setSearchText(prev=> querry);
      }, 100), [])
    
      const searchRide = useCallback(
          (querry) => debouncedSearch(querry),
          [debouncedSearch]
      );
      useEffect(()=>{
        searchRide(querry);
      }, [querry, searchRide]);
    

    return (
        <div className={`bg-white rounded-lg shadow-md ${isChild? "":"p-6 mt-4"}  mx-auto w-full`}>
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <div className="w-1 h-3 sm:h-6 rounded-md bg-green-700 mr-2 sm:mr-3"></div>
                    <h2 className=" text-[16px] md:text-2xl font-bold font-nunito bg-gradient-to-r from-[#15803D] to-[#81CA18] bg-clip-text text-transparent">
                        Last 24 Hrs Booking List
                    </h2>
                </div>
                <div className="flex items-center gap-4 justify-between">
                    {/* <div className=''>
                        <label htmlFor="search" className='text-xs'>Search</label>
                        <input type="text" id="search" placeholder='Search' className='bg-white text-black focus:outline-none border border-gray-300 px-4 py-2 rounded-md w-full' value={querry} onChange={(e) => setQuerry(e.target.value)} />
                    </div> */}
                    {/* <div>
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
                    </div> */}
                    {/* <div className='flex flex-col gap-2'>
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
                    </div> */}
                    <div className="flex flex-col gap-4">
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
export default Last24HrsBookingList;