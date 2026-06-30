"use client";
import React, { useState, useEffect } from "react";
import { TiLocation } from "react-icons/ti";
import { IoIosArrowForward } from "react-icons/io";
import { FaLink } from "react-icons/fa";
import { BsClock } from "react-icons/bs";
import { Loader } from "lucide-react";
import { apiClient } from "@/app/lib/apiClient";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Image from "next/image";

export default function RidePage({ params }) {
    const { urId } = React.use(params);
    const router = useRouter();

    const statusColors = {
        pending: 'bg-[#FFC107] text-white cursor-pointer',
        processing: 'bg-[#FFB74D] text-white cursor-pointer',
        scheduled: 'bg-[#9C27B0] text-white',
        taxiPool: 'bg-[#03A9F4] text-white',
        confirmed: 'bg-[#009688] text-white',
        assigned: 'bg-[#3F51B5] text-white',
        arrived: 'bg-[#673AB7] text-white',
        started: 'bg-[#1B59F8] text-white',
        completed: 'bg-[#16A34A] text-white',
        cancelled: 'bg-[#F44336] text-white',
        cabFound: 'bg-[#8BC34A] text-white',
        needCab: 'bg-[#FF9800] text-white',
        cancellation: 'bg-[#E57373] text-white',
        linkSent: 'bg-[#00BCD4] text-white',
        all: 'bg-[#9E9E9E] text-white',
        notVerified: 'bg-[#FFB300] text-white',
        activeRides: 'bg-[#1E88E5] text-white',
    };
    const [rideId, setRideId] = useState(urId || "");
    const [existingConnectionsList, setExistingConnectionList] = useState([]);
    const [connList, setConnList] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState(false);
    const [rideDetails, setRideDetails] = useState(null);
    const [type, setType] = useState("normal");
    const [selectedRide, setSelectedRide] = useState();
    const [distance, setDistance] = useState(0);
    const [amount, setAmount] = useState(0);

    useEffect(() => {
        if (existingConnectionsList.length > 0) {
            let totalDistance = existingConnectionsList.reduce((sum, ride) => {
                return sum += ride?.price_details_json?.estimated_km + (ride?.gap_km ? parseFloat(ride?.gap_km.split(" ")[0]) : 0)
            }, 0);
            let totalAmount = existingConnectionsList.reduce((sum, ride) => {
                return sum += (ride?.price_details_json?.collected_by_driver || 0);
            }, 0);
            console.log(totalDistance, totalAmount)
            setDistance(totalDistance);
            setAmount(totalAmount);
        }
    }, [existingConnectionsList])
    const fetchConnectedRideList = async (urid) => {
        try {
            const response = await apiClient('GET', `/rideConnectionManagement/connectedRideListByurid/${urid}`, '', true);
            if (response?.success) {
                console.log("connectedRideList", response?.data);
                setExistingConnectionList(response?.data);
            }
        } catch (error) {
            console.error(error);
        }
    };
    const fetchRideDetails = async (searchUrid) => {
        setLoading(true);
        try {
            const response = await apiClient(
                "GET",
                `/ride_management/rideDetails/${searchUrid}`);
            if (response?.success || response?.status) {
                setRideDetails(response?.data);
                searchRideByUrid(response?.data?.urid);
                fetchConnectedRideList(searchUrid);
                setError("");
            } else {
                setLoading(false);
                setConnList([]);
                setError(response?.message || "Failed to fetch rides.");
            }
        } catch (err) {
            console.log("Network/Server error:", err);
            setConnList([]);
            setError("Something went wrong while fetching rides.");
        } finally {
        }
    }

    const searchRideByUrid = async (searchUrid) => {
        setLoading(true);
        if (!searchUrid) {
            setError("Please enter a Ride ID");
            setConnList([]);
            setLoading(false);
            return;
        }

        try {
            const response = await apiClient(
                "GET",
                `/rideConnectionManagement/searchConnectionRide/${searchUrid}/${type}`,
                "",
                true
            );
            if (response?.success) {
                setConnList(response?.data);
                setError("");
            } else {
                setConnList([]);
                setError(response?.message || "Failed to fetch rides.");
            }
        } catch (err) {
            console.log("Network/Server error:", err);
            setConnList([]);
            setError("Something went wrong while fetching rides.");
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (timeinMin) => {
        console.log(timeinMin)
        if(isNaN(timeinMin)) return timeinMin;
        if (!Number.isFinite(timeinMin) || timeinMin < 0) return "00:00:00";
        const totalSeconds = Math.floor(timeinMin * 60);
        const hours = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;

        const pad = (n) => String(n).padStart(2, "0");
        return `${pad(hours)}:${pad(mins)}:${pad(secs)}`;

    }

    const connectRide = async (ride) => {
        setLoading(true);
        let payData = {
            parent_ur_id: urId,
            connection_urid_list: ride?.urid,
            type: "normal",
            gap_km: ride?.gap_km,
            gap_time_minutes: ride?.gap_time_minutes,
        };
        try {
            const response = await apiClient(
                "POST",
                "/rideConnectionManagement/connectRide",
                JSON.stringify(payData),
                true
            );
            if (response?.success) {
                toast.success(response.message);
                setConnectionStatus(true);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        if (rideId) {
            router.push(`/ridesManagement/searchRideConnection/${rideId}`);
        }
    };

    const handleCalculations = (selectedRide) => {
        setSelectedRide(prev=> selectedRide?.urid);
        if(selectedRide.urid && rideDetails?.urid) {
            const details = {...rideDetails};
            const distance = (parseFloat(selectedRide?.price_details_json?.estimated_km) + (selectedRide?.gap_km? parseFloat(selectedRide?.gap_km): 0)) + 
                            (parseFloat(details?.price_details_json?.estimated_km) + (details?.gap_km? parseFloat(details?.gap_km.split(" ")[0]): 0));
            const amount = (parseFloat(selectedRide?.price_details_json?.collected_by_driver) || 0) + (details?.price_details_json?.collected_by_driver || 0);
            details['calculated_distance'] = distance;
            details['caluclated_amount'] = amount;
            details['per_km_price'] = (amount/distance).toFixed(2);
            details['selected_ride_source'] = selectedRide?.booking_destination_coordinates?.coordinates;
            details['selected_ride_destination'] = selectedRide?.booking_source_coordinates?.coordinates;
            setRideDetails(prev => ({...details}));
        }
    }

    const handleDisconnect = async (ride) => {
        let payData = {
            parent_urid: rideDetails?.urid,
            disconnected_urid: ride?.urid,
        };

        try {
            const response = await apiClient("POST", '/rideConnectionManagement/disconnectedRideListByurid', JSON.stringify(payData), true);
            if (response?.success) {
                toast.success(response.message);
                fetchConnectedRideList();
            } else {
                toast.error(response?.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (urId) {
            setRideId(urId);
            if(!rideDetails) {
                fetchRideDetails(urId);
            } else {
                fetchConnectedRideList(urId);
                searchRideByUrid(urId);
            }
        }
    }, [urId, connectionStatus, type]);

    const getMapURL = (ride, mode, multiple) => {
        const src1 = rideDetails?.booking_source_coordinates?.coordinates.sort();
        const dest1 = rideDetails?.booking_destination_coordinates?.coordinates.sort();
        switch(mode) {
            case "newConnection": {
                const src2 = rideDetails?.selected_ride_source?.sort();
                const dest2 = rideDetails?.selected_ride_destination?.sort();
                if (multiple && src1 && dest1 && src2 && dest2) {
                    return `https://www.google.com/maps/dir/${encodeURIComponent(src1)}/${encodeURIComponent(dest1)}/${encodeURIComponent(src2)}/${encodeURIComponent(dest2)}`;
                } else if ((!multiple) && src1 && dest1) {
                    return `https://www.google.com/maps/dir/${encodeURIComponent(src1)}/${encodeURIComponent(dest1)}`;
                } else {
                    return false;
                }
            };
            case "exiting": {
                if (multiple) {
                    let arr = [...existingConnectionsList];
                    let coordinates =  arr.reduce((c, r) => c += `${r.booking_source_coordinates?.coordinates.sort()}/${r.booking_destination_coordinates?.coordinates.sort()}/`, "")
                    return `https://www.google.com/maps/dir/${coordinates}`;
                } else if ((!multiple) && ride) {
                    const src1 = ride?.booking_source_coordinates?.coordinates.sort();
                    const dest1 = ride?.booking_destination_coordinates?.coordinates.sort();
                    return `https://www.google.com/maps/dir/${encodeURIComponent(src1)}/${encodeURIComponent(dest1)}`;
                } else {
                    return false;
                } 
            };
        }
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="sticky top-20 bg-white z-10">
                <div className="flex items-start justify-start gap-2">
                    <div className="flex items-center w-full border-2 border-[#005FE2] rounded-md shadow-sm overflow-hidden bg-gradient-to-r from-[#E8F1FF] to-[#dceeff]">
                        <input
                            type="text"
                            value={rideId}
                            onChange={(e) => setRideId(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            placeholder="Enter Ride ID"
                            className="flex-1 px-4 py-2 text-sm bg-transparent focus:outline-none placeholder-blue-400 text-blue-800"
                        />
                        <button
                            onClick={handleSearch}
                            className="flex items-center gap-1 bg-gradient-to-r from-[#1E3A8A] to-[#1E40AF] text-white px-5 py-1 text-[14px] rounded-full m-1 transition hover:opacity-90"
                        >
                            Search
                            <FaLink className="text-white text-xs" />
                        </button>
                    </div>
                </div>
                <div className="flex w-full items-center px-4">
                    <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={type}
                        row
                        onChange={(e)=>{console.log(e.target.value);setType(e.target.value)}}
                    >
                        <FormControlLabel value="normal" control={<Radio />} label="Forward" />
                        <FormControlLabel value="reverse" control={<Radio />} label="Reverse" />
                    </RadioGroup>

                </div>
                <div className="flex items-start justify-start gap-2">
                    {rideDetails && (
                        <div className="py-2 px-3 bg-white rounded-md shadow w-full">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    {/* Location */}
                                    <div className="flex items-center text-sm font-medium bg-white rounded-md w-full">
                                        <div className="flex items-center gap-1 ">
                                            <TiLocation className="text-green-500 text-[20px]" />
                                            <div className="relative group">
                                                <span className="text-[15px] font-semibold block cursor-pointer text-ellipsis">
                                                    {rideDetails?.source_city_name || rideDetails?.location_details.source}
                                                </span>
                                                <div className="absolute bottom-full left-0 mb-2 w-max hidden rounded-lg bg-gray-900 px-2 py-1 text-white text-xs group-hover:block">
                                                    {rideDetails?.location_details.source}
                                                </div>
                                            </div>
                                        </div>

                                        <IoIosArrowForward className="text-gray-400 text-xl" />

                                        <div className="flex items-center gap-1 rounded-full px-3 py-1">
                                            <TiLocation className="text-red-500 text-[20px]" />
                                            <div className="relative group">
                                                <span className="text-[15px] font-semibold block cursor-pointer text-ellipsis">
                                                    {rideDetails?.destination_city_name || rideDetails?.location_details.destination}
                                                </span>
                                                <div className="absolute bottom-full left-0 mb-2 hidden w-max rounded-lg bg-gray-900 px-2 py-1 text-white text-xs group-hover:block">
                                                    {rideDetails?.location_details.destination}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <span className="w-full flex items-center gap-4 font-bold">
                                        Distance:{" "}
                                        <span className="text-[#005FE2] text-[13px] font-bold">
                                            {rideDetails?.price_details_json?.estimated_km || 0} Km
                                        </span>
                                    </span>
                                    <div className='flex items-center gap-2 w-full'>
                                        <span className="capitalize font-bold text-black text-lg">{rideDetails?.op_cab_detail_json? rideDetails?.op_cab_detail_json?.cab_type  :rideDetails?.booking_type}</span>
                                        {rideDetails?.calculated_distance && rideDetails?.caluclated_amount && <>
                                            <div className='text-black flex gap-2 items-center'><span className='bg-green-500 rounded-full w-2 h-2'></span> <span>₹{rideDetails?.caluclated_amount}</span></div>
                                            <div className='text-black flex gap-2 items-center'><span className='bg-green-500 rounded-full w-2 h-2'></span> <span>{rideDetails?.calculated_distance} Km</span></div>
                                            <div className='text-black flex gap-2 items-center font-bold'><span className='bg-green-500 rounded-full w-2 h-2'></span> <span>₹{Math.ceil(Math.max((rideDetails?.caluclated_amount / rideDetails?.calculated_distance), 0))}/km</span></div>
                                        </>}
                                            <div>
                                                <span
                                                    className="ml-auto"
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        const multiple = rideDetails?.calculated_distance ? true: false;
                                                        const url = getMapURL(multiple? null:rideDetails, "newConnection", multiple);
                                                        if (url) {
                                                            window.open(url, '_blank');
                                                        }
                                                    }}
                                                    style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                                                >
                                                    <Image
                                                        src="/icons/googlemap.svg"
                                                        alt="Google Maps"
                                                        height={30}
                                                        width={30}
                                                    />
                                                </span>
                                            </div>
                                    </div>
                                    <div className="flex items-center gap-4 w-full justify-end">
                                        <div className={"border border-[#b3d2fc] px-3 py-1.5 rounded-md text-[14px] text-[#5481ea] flex gap-1 items-center font-medium capitalize " + statusColors[rideDetails?.status]}>
                                            {rideDetails?.status}
                                        </div>
                                        {/* Price */}
                                        <div className="text-xl font-bold">
                                            ₹{rideDetails?.price_details_json?.collected_by_driver}
                                        </div>

                                    </div>
                                </div>

                                {/* Bottom Details */}
                                <div className="flex items-center justify-between text-xs text-gray-600 px-1 w-full">
                                    <div className="flex items-center gap-1 w-full">
                                        <span className="text-[13px]">ID: </span>
                                        <span className="text-[#005FE2] text-[13px] font-semibold hover:underline cursor-pointer"  onClick={()=>window.open(`/ridesManagement/details?urid=${rideDetails?.urid}`)}>
                                            {rideDetails?.urid}
                                        </span>
                                    </div>


                                    <div className="flex items-center gap-1 font-bold w-full">
                                        <BsClock className="text-black font-bold" />
                                        <span className="text-[13px] text-black font-bold">{rideDetails?.booking_travel_date} {rideDetails?.bookingTime}</span>
                                    </div>
                                    <div className="w-full">
                                        <div className="flex items-center gap-1 font-semibold justify-end">
                                            <span className="text-[13px]">Gap: {rideDetails?.gap_km || 0} Km</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-4 mt-3 shadow-lg shadow-gray-400 rounded-md bg-white pb-4 h-full overflow-y-auto scroll-hide">
                <div className="bg-gray-400 p-4 rounded-t-md flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-white">Connected Rides</span>
                        {existingConnectionsList?.filter(ride => ride.urid !== urId).length} {existingConnectionsList?.filter(ride => ride.urid !== urId)?.length > 1 ? "Rides" : "Ride"} Found
                    </div>
                    <div className="text-gray-200 flex items-center gap-2">
                        <div className='text-white flex gap-2 items-center'><span className='bg-green-500 rounded-full w-2 h-2'></span> <span>₹{amount}</span></div>
                        <div className='text-white flex gap-2 items-center'><span className='bg-green-500 rounded-full w-2 h-2'></span> <span>{distance} Km</span></div>
                        <div className='text-white flex gap-2 items-center'><span className='bg-green-500 rounded-full w-2 h-2'></span> <span>₹{Math.ceil(Math.max((amount / distance), 0))}/km</span></div>
                        <div>
                            <span
                                className="ml-auto"
                                onClick={e => {
                                    e.stopPropagation();
                                    const url = getMapURL(con, "existing", false)
                                    if (url) {
                                        window.open(url, '_blank');
                                    }
                                }}
                                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                            >
                                <Image
                                    src="/icons/googlemap.svg"
                                    alt="Google Maps"
                                    height={30}
                                    width={30}
                                />
                            </span>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-[70px]">
                        <Loader size={48} className="animate-spin" />
                    </div>
                ) : (
                    <>
                        {existingConnectionsList?.length > 0 ? (
                            existingConnectionsList.filter(ride => ride.urid !== urId).map((con, index) => (
                                <div
                                    key={index}
                                    onClick={()=>handleCalculations(con)}
                                    className={`flex flex-col gap-3 rounded-md shadow-sm m-6 p-4 cursor-pointer border transition-all hover:border hover:border-blue-700 ${(selectedRide === con?.urid)? "border-blue-700": ""}`}
                                >
                                    <div className="flex items-center justify-between">
                                        {/* Location */}
                                        <div className="w-full flex items-center text-sm font-medium bg-white rounded-md">
                                            <div className="flex items-center gap-2 ">
                                                <TiLocation className="text-green-500" size={20} />
                                                <div className="relative group">
                                                    <span className="text-[15px] font-semibold block cursor-pointer text-ellipsis">
                                                        {con?.source_city_name || con?.location_details.source}
                                                    </span>
                                                    <div className="absolute bottom-full left-0 mb-2 hidden rounded-lg bg-gray-900 px-2 py-1 text-white w-max text-xs group-hover:block">
                                                        {con?.location_details.source}
                                                    </div>
                                                </div>
                                            </div>

                                            <IoIosArrowForward className="text-gray-400 text-xl" />

                                            <div className="flex items-center gap-1 rounded-full px-3 py-1">
                                                <TiLocation className="text-red-500" size={20} />
                                                <div className="relative group">
                                                    <span className="text-[15px] font-semibold block cursor-pointer text-ellipsis">
                                                        {con?.destination_city_name || con?.location_details.destination}
                                                    </span>
                                                    <div className="absolute bottom-full left-0 mb-2 hidden w-max rounded-lg bg-gray-900 px-2 py-1 text-white text-xs group-hover:block">
                                                        {con?.location_details.destination}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <span className="w-full flex items-center gap-4 font-bold">
                                            Distance:{" "}
                                            <span className="text-[#005FE2] text-[13px] font-bold">
                                                {con?.price_details_json?.estimated_km} Km
                                            </span>
                                        </span>
                                        <div className="flex items-center gap-2 w-full">
                                            <span className="capitalize font-bold text-black text-lg">{con?.op_cab_detail_json? con?.op_cab_detail_json?.cab_type  :con?.booking_type}</span>
                                        </div>
                                        {/* Status */}
                                        <div className="flex items-center gap-4 justify-end w-full">

                                            <div className={"border border-[#b3d2fc] px-3 py-1.5 rounded-md text-[14px] text-[#5481ea] flex gap-1 items-center font-medium capitalize " + statusColors[con?.status]}>
                                                {con?.status}
                                            </div>

                                            {/* Dis-Connect */}
                                            <div className="flex justify-end">
                                                <button className="bg-gradient-to-r from-[#F80000] to-[#920000] text-white text-sm font-semibold px-5 py-1.5 rounded-md shadow-md hover:opacity-90 transition-all" onClick={() => handleDisconnect(con)}>
                                                    Disconnect →
                                                </button>
                                            </div>

                                            {/* Price */}
                                            <div className="text-xl font-bold">
                                                ₹{con?.price_details_json.collected_by_driver}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom Details */}
                                    <div className="flex items-center justify-between text-xs text-gray-600 px-1">
                                        <div className="w-full flex items-center gap-1">
                                            ID:{" "}
                                            <span className="text-[#005FE2] text-[13px] font-semibold hover:underline cursor-pointer"  onClick={()=>window.open(`/ridesManagement/details?urid=${con?.urid}`)}>
                                                {con?.urid}
                                            </span>
                                        </div>


                                        <div className="w-full flex items-center gap-1 font-semibold">
                                            <BsClock className="text-black font-bold" />
                                            <span className="text-[13px] text-black font-bold">{con?.booking_travel_date}</span>
                                        </div>

                                        <div className="w-full flex items-center justify-end gap-1 font-semibold">
                                            <span className="text-[13px]">Gap: {con?.gap_km} Km,</span>
                                            <span className="text-[13px]">Time: {con?.gap_time_minutes? formatTime(con?.gap_time_minutes):0}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            
                                <div className="text-red-700 flex items-center justify-center">
                                    <p className="text-lg">
                                        {error ||
                                            "Connected rides not found for this urid."}
                                    </p>
                                </div>
                        )}
                    </>
                )}
            </div>
            <div className="space-y-4 mt-3 shadow-lg shadow-gray-400 rounded-md bg-white pb-4 h-full overflow-y-auto scroll-hide">
                <div className="bg-gray-400 p-4 rounded-t-md flex items-center justify-between">
                    <span className="text-white">Available Rides</span>
                    <div className="text-gray-200">
                        {connList?.length} {connList.length > 1 ? "Rides" : "Ride"} Found
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-[300px]">
                        <Loader size={48} className="animate-spin" />
                    </div>
                ) : (
                    <>
                        {connList?.length > 0 ? (
                            connList.map((con, index) => (
                                <div
                                    key={index}
                                    onClick={()=>handleCalculations(con)}
                                    className={`flex flex-col gap-3 rounded-md shadow-sm m-6 p-4 cursor-pointer border transition-all hover:border hover:border-blue-700 ${(selectedRide === con?.urid)? "border-blue-700": ""}`}
                                >
                                    <div className="flex items-center justify-between">
                                        {/* Location */}
                                        <div className="w-full flex items-center text-sm font-medium bg-white rounded-md">
                                            <div className="flex items-center gap-2 ">
                                                <TiLocation className="text-green-500" size={20} />
                                                <div className="relative group">
                                                    <span className="text-[15px] font-semibold block cursor-pointer text-ellipsis">
                                                        {con?.source_city_name || con?.location_details.source}
                                                    </span>
                                                    <div className="absolute bottom-full left-0 mb-2 hidden rounded-lg bg-gray-900 px-2 py-1 text-white w-max text-xs group-hover:block">
                                                        {con?.location_details.source}
                                                    </div>
                                                </div>
                                            </div>

                                            <IoIosArrowForward className="text-gray-400 text-xl" />

                                            <div className="flex items-center gap-1 rounded-full px-3 py-1">
                                                <TiLocation className="text-red-500" size={20} />
                                                <div className="relative group">
                                                    <span className="text-[15px] font-semibold block cursor-pointer text-ellipsis">
                                                        {con?.destination_city_name || con?.location_details.destination}
                                                    </span>
                                                    <div className="absolute bottom-full left-0 mb-2 hidden w-max rounded-lg bg-gray-900 px-2 py-1 text-white text-xs group-hover:block">
                                                        {con?.location_details.destination}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <span className="w-full flex items-center gap-4 font-bold">
                                            Distance:{" "}
                                            <span className="text-[#005FE2] text-[13px] font-bold">
                                                {con?.price_details_json?.estimated_km} Km
                                            </span>
                                        </span>
                                        <div className="flex items-center gap-2 w-full">
                                            <span className="capitalize font-bold text-black text-lg">{con?.op_cab_detail_json? con?.op_cab_detail_json?.cab_type  :con?.booking_type}</span>
                                            <div>
                                                <span
                                                    className="ml-auto"
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        const url = getMapURL(con, "newConnection", false)
                                                        if (url) {
                                                            window.open(url, '_blank');
                                                        }
                                                    }}
                                                    style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                                                >
                                                    <Image
                                                        src="/icons/googlemap.svg"
                                                        alt="Google Maps"
                                                        height={30}
                                                        width={30}
                                                    />
                                                </span>
                                            </div>
                                        </div>
                                        {/* Status */}
                                        <div className="flex items-center gap-4 justify-end w-full">

                                            <div className={"border border-[#b3d2fc] px-3 py-1.5 rounded-md text-[14px] text-[#5481ea] flex gap-1 items-center font-medium capitalize " + statusColors[con?.status]}>
                                                {con?.status}
                                            </div>

                                            {/* Connect */}
                                            <button
                                                className="bg-gradient-to-r from-blue-500 to-blue-700 text-white text-sm font-semibold px-5 py-1.5 rounded-md shadow-md hover:opacity-90 transition-all"
                                                onClick={() => connectRide(con)}
                                            >
                                                Connect →
                                            </button>

                                            {/* Price */}
                                            <div className="text-xl font-bold">
                                                ₹{con?.price_details_json.collected_by_driver}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom Details */}
                                    <div className="flex items-center justify-between text-xs text-gray-600 px-1">
                                        <div className="w-full flex items-center gap-1">
                                            ID:{" "}
                                            <span className="text-[#005FE2] text-[13px] font-semibold hover:underline cursor-pointer" onClick={()=>window.open(`/ridesManagement/details?urid=${con?.urid}`)}>
                                                {con?.urid}
                                            </span>
                                        </div>


                                        <div className="w-full flex items-center gap-1 font-semibold">
                                            <BsClock className="text-black font-bold" />
                                            <span className="text-[13px] text-black font-bold">{con?.booking_travel_date}</span>
                                        </div>

                                        <div className="w-full flex items-center justify-end gap-1 font-semibold">
                                            <span className="text-[13px]">Gap: {con?.gap_km} Km,</span>
                                            <span className="text-[13px]">Time: {con?.gap_time_minutes? formatTime(con?.gap_time_minutes):0}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            error && (
                                <div className="text-red-700 min-h-[300px] flex items-center justify-center">
                                    <p className="text-xl">
                                        {error ||
                                            "Rides not found for this urid which can be connected."}
                                    </p>
                                </div>
                            )
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
