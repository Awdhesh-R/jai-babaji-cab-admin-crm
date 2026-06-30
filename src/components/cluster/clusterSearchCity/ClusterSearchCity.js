import { useState, useEffect } from "react";
import { IoSearchOutline } from "react-icons/io5"; // outline wala sahi lagega
import { apiClient } from "@/app/lib/apiClient";
import Image from "next/image";
import { useDispatch, useSelector } from 'react-redux';
import { createCluster, fetchCityList, searchCityByName } from '@/redux/features/clusterMainSlice';


export default function ClusterSearchCity({ cities }) {
    const dispatch = useDispatch();
    const [query, setQuery] = useState("");
    const [city, setCity] = useState("patna");
    const [data, setData] = useState([]); // ✅ Added

    const { cluster } = useSelector((state) => state.clusterMain);
    const handleCreateCluster = () => {
        const payload = {
            city: "Patna",
        };
        dispatch(createCluster(payload));
    };
    useEffect(() => {
        const handler = setTimeout(() => {
            if (query.length > 1) {
                dispatch(searchCityByName({ cityName: query })).then((res) => {
                    if (res.payload) {
                        setData(res.payload);
                    }
                });
            } else {
                dispatch(fetchCityList());// reset data when query is less than 1 characters
            }
        }, 400); // 400ms debounce

        return () => clearTimeout(handler);
    }, [query]);

    return (
        <div className="flex items-center justify-center gap-2 
                    max-w-2xl px-4 py-2.5 w-full bg-[#f6f9ff]
                    rounded-full bg-white/80 backdrop-blur-md 
                    shadow-[0_4px_20px_rgba(0,0,0,0.05)]">

            {/* Icon */}
            <IoSearchOutline className="text-blue-400" size={20} />

            {/* Input */}
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search City..."
                className="w-full bg-transparent border-none outline-none 
                     text-gray-700 placeholder:text-blue-400"
            />
        </div>

    );
}
