import { apiClient } from "@/app/lib/apiClient";
import AllRideCard from "@/components/cards/AllRideCard";
import AllRideTable from "@/components/cards/AllRideTable";
import CustomLoader from "@/components/common/CustomLoader";
import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaList, FaTh } from "react-icons/fa";

const AlljaiBabajiCabRide = ({ type = "confirm_all", isChild = false }) => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [viewType, setViewType] = useState("Card");
    const observerRef = useRef();

    // Date Filter (optional)
    const [dateFilter, setDateFilter] = useState({
        startDate: null,
        endDate: null
    });

    const lastCardRef = useCallback((node) => {
        if (!hasMore) return;
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setPage((prev) => prev + 1);
            }
        });

        if (node) observerRef.current.observe(node);
    }, [hasMore]);

    const fetchList = useCallback(async (pageNo) => {
        try {
            setLoading(true);

            const params = {
                type,               
                page: pageNo,
                limit: 20,
                startDate: dateFilter.startDate || null,
                endDate: dateFilter.endDate || null
            };

            const response = await apiClient("GET", `/fleet/dashboard-rides`, params);

            const dataArr = response?.data || [];

            if (pageNo === 1) {
                setList(dataArr);
            } else {
                if (dataArr.length > 0) {
                    setList((prev) => [...prev, ...dataArr]);
                } else {
                    setHasMore(false);
                }
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }, [type, dateFilter]);

    // Initial + Pagination Fetch
    useEffect(() => {
        setList([]);
        setHasMore(true);
        setPage(1);
        fetchList(1);
    }, [type]);

    useEffect(() => {
        if (page > 1) fetchList(page);
    }, [page]);

    // Date filter change
    useEffect(() => {
        if (dateFilter.startDate && dateFilter.endDate) {
            setPage(1);
            setHasMore(true);
            fetchList(1);
        }
    }, [dateFilter]);

    return (
        <div className={`bg-white rounded-lg shadow-md ${isChild ? "" : "p-6 mt-4"} mx-auto w-full`}>

            {/* Title */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <div className="w-1 h-6 rounded-md bg-green-700 mr-3"></div>
                    <h2 className="text-[16px] md:text-2xl font-bold bg-gradient-to-r from-[#15803D] to-[#81CA18] bg-clip-text text-transparent">
                        jaiBabajiCab Ride List
                    </h2>
                </div>

                {/* View Toggle */}
                <div className="flex items-center bg-gray-600 gap-0 rounded-md">
                    <button
                        className={`px-3 py-1 rounded-l-md border ${viewType === "Card" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
                        onClick={() => setViewType("Card")}
                    >
                        <FaTh />
                    </button>
                    <button
                        className={`px-3 py-1 rounded-r-md border ${viewType === "Table" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
                        onClick={() => setViewType("Table")}
                    >
                        <FaList />
                    </button>
                </div>
            </div>

            {/* Ride List Display */}
            <div className="max-w-full bg-white p-2 shadow-md rounded-lg">
                {viewType === "Card" ? (
                    <AllRideCard
                        rides={list}
                        moreData={hasMore}
                        checklastCardRef={lastCardRef}
                    />
                ) : (
                    <AllRideTable
                        rides={list}
                        moreData={hasMore}
                        checklastCardRef={lastCardRef}
                    />
                )}

                {loading && list.length > 0 && <CustomLoader />}
            </div>
        </div>
    );
};

export default AlljaiBabajiCabRide;