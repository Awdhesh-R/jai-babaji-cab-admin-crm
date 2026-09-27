"use client";
import { apiClient } from "@/app/lib/apiClient";
import { formatTimeFromMinutes } from "@/helpers/utils";
import { Switch } from "@mui/material";
import debounce from "lodash.debounce";
import { User2 } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { AiTwotoneExclamationCircle } from "react-icons/ai";
import { FaCalendarAlt, FaCaretDown, FaClock, FaPhone, FaSearch, FaSuitcaseRolling, FaUserFriends, FaWhatsapp } from "react-icons/fa";
import { GiJourney } from "react-icons/gi";
import { LuUser } from "react-icons/lu";
import { toast } from "react-toastify";

const AddNewBooking = () => {
    const getValidCabImage = (icon, type) => {
        if (icon && typeof icon === 'string' && icon !== "null" && icon !== "undefined" && icon.trim() !== "") {
            return icon;
        }
        const t = type?.toLowerCase();
        if (t === 'mini') return '/images/2.png';
        if (t === 'sedan') return '/images/3.png';
        if (t === 'suv') return '/images/1.png';
        return '/images/car.png';
    };

    const [isActive, setIsActive] = useState(true);
    const [userPhoneNumber, setUserPhoneNumber] = useState('');
    const [userName, setUserName] = useState('');
    const [user_ref_id, setUser_ref_id] = useState('');
    const [sameAsMobileNumber, setSameAsMobileNumber] = useState(false);
    const [whatsAppNumber, setWhatsAppNumber] = useState('');
    const [newUser, setNewUser] = useState(false);
    const [userDetails, setUserDetails] = useState({
        pickupLocation: "",
        dropLocation: "",
        adult: 0,
        children: 0,
        bigLuggage: 0,
        smallLuggage: 0,
        date: moment().format("YYYY-MM-DD"),
        bookingTime: moment().format("HH:mm"),
        user_id: "",
    });
    const [suggestions, setSuggestions] = useState([]);
    const [selectedField, setSelectedField] = useState("");
    const [loading, setLoading] = useState(false);
    const [toLoad, setToLoad] = useState(false);
    const [latLong, setLatLong] = useState({
        lat1: null,
        long1: null,
        lat2: null,
        long2: null,
    });
    const [isJourneyPointsActive, setIsJourneyPointsActive] = useState(true);
    const [serviceSearched, setServiceSearched] = useState(false);
    const [availableServices, setAvailableServices] = useState();
    const [fareDetails, setFareDetails] = useState(null);
    const [selected, setSelected] = useState(null);
    const [selectedCab, setSelectedCab] = useState(null);
    const [creatingBooking, setCreatingBooking] = useState(false);

    const resetUserDetails = () => {
        setUserDetails({
            pickupLocation: "",
            dropLocation: "",
            adult: 0,
            children: 0,
            bigLuggage: 0,
            smallLuggage: 0,
        })
    }
    const resetLatLong = () => {
        setLatLong({
            lat1: null,
            long1: null,
            lat2: null,
            long2: null,
        });
    };
    const resetData = () => {
        setServiceSearched(false);
        setAvailableServices();
        setFareDetails(null);
        setSelected(null);
        setSelectedCab(null);
        setUserName('');
        setUserPhoneNumber('');
        setUser_ref_id('');
        setSameAsMobileNumber(false);
        setWhatsAppNumber('');
        resetUserDetails();
        resetLatLong();
    };
    const debouncedSearch = useMemo(() => debounce(async (input, kInput) => {
        if (!input.trim()) return;
        kInput === "from" ? setLoading(true) : setToLoad(true);
        setSuggestions([]);
        const place = {
            placeName: input.trim(),
            api_key: process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
        };
        try {
            const data = await apiClient('POST', '/place/search-place', place, null, false, false);
            if (!data?.success) throw new Error(data?.message || "Failed to fetch");
            
            // Normalize backend response to match UI expectations (description, geometry.location)
            let rawData = data?.data || [];
            let suggestionsArray = Array.isArray(rawData) ? rawData : [rawData];
            const mappedSuggestions = suggestionsArray.map(item => ({
                description: item?.place || item?.name,
                geometry: { location: { lat: item?.lat, lng: item?.long || item?.lng } }
            })).filter(item => item.description);
            
            setSuggestions(mappedSuggestions);
        } catch (err) {
            console.error("Error fetching autocomplete suggestions:", err.message);
        } finally {
            kInput === "from" ? setLoading(false) : setToLoad(false);
        }
    }, 500), []);

    const searchPlace = useCallback(
        (input, kInput) => debouncedSearch(input, kInput),
        [debouncedSearch]
    );

    const formatDate = (date) => {
        console.log(date)
        return moment(date, "YYYY-MM-DD").format("YYYY-MM-DD")
    };
    const searchService = async () => {
        if (!latLong.lat1 || !latLong.long1 || !latLong.lat2 || !latLong.long2) {
            toast.error("Please provide valid pickup and drop locations.");
            return;
        }
        const locationData = {
            lat1: latLong.lat1,
            lon1: latLong.long1,
            lat2: latLong.lat2,
            lon2: latLong.long2,
        };

        let src_dst = {
            source: userDetails.pickupLocation,
            lat1: locationData.lat1,
            lon1: locationData.lon1,
            destination: userDetails.dropLocation,
            lat2: locationData.lat2,
            lon2: locationData.lon2,
        }

        try {
            const response = await apiClient('POST', '/ride_management/getUpdatedEstimatedFare', locationData, {}, true, false);

            if (response?.success && response.data) {
                setServiceSearched(true);
                setAvailableServices(response.data);
                // Handle both the old search_service and the new getUpdatedEstimatedFare response structures
                const fareList = response.data.oneway?.list || response.data.estimatedPrice?.cabList || response.data.estimatedFareList || [];
                setFareDetails(fareList);
                toast.success(response.message || "Services found successfully!");
            } else {
                toast.error(response.message || "No services found for the given locations.");
            }
        } catch (error) {
            console.error("Search Service Error:", error);
            toast.error("An error occurred while searching for services.");
        }
    };

    const handleSetSelected = (index) => {
        setSelected(index);
        const newCab = fareDetails[index];
        setUserDetails(prev=> ({...prev, adult: newCab.passenger_config_json.adult || 0, children: newCab.passenger_config_json.child || 0, smallLuggage: newCab.passenger_config_json.smallLaggage || 0, bigLuggage: newCab.passenger_config_json.bigLaggage || 0}));
        setSelectedCab(newCab);

    }
    const handleAddBooking = async () => {
        if(!userName) {
            toast.error("Please enter user name");
            return;
        }
        if(!userPhoneNumber) {
            toast.error("Please enter user phone number");
            return;
        }
        if(!userDetails.pickupLocation) {
            toast.error("Please enter pickup location");
            return;
        }
        if(!userDetails.dropLocation) {
            toast.error("Please enter drop location");
            return;
        }
        if(!userDetails?.adult || userDetails?.adult === 0) {
            toast.error("Please enter number of adults");
            return;
        }
        if(!selectedCab) {
            toast.error("Please select a cab type");
            return;
        }
        let currentUserId = user_ref_id;
        if(!currentUserId) {
            currentUserId = await createNewUser();
            if (!currentUserId) return;
        }
        await addBooking(currentUserId);
    }
    const searchUser = async (value) => {
        if(!userPhoneNumber) {
            toast.error("Please enter phone number to search");
            return;
        }
        try {
            const response = await apiClient('GET', '/user_management/search-user/'+ value);
            if(response?.success && response?.data && response.data.length === 1) {
                const user = response.data[0];
                setUserName(user.first_name+" "+user.last_name || '');
                setUser_ref_id(prev=> user.ref_user_id || '');
                setWhatsAppNumber(user.whatsapp || '');
                toast.success("User found successfully");
                setNewUser(false);
            } else if(response?.success && response?.data && response.data.length > 1) {
                toast.info("Multiple users found. Please refine your search.");
            } else {
                toast.info("User not found. Please create a new user.");
                setNewUser(true);
                setUserName('');
                setUser_ref_id(prev=> '');
                setWhatsAppNumber('');
            }
        } catch (error) {
            console.error("Search User Error:", error);
            toast.error("An error occurred while searching for user.");
        }
    }
    const createNewUser = async () => {
        try {
            const userData = {
                first_name: userName.split(' ')[0] || '',
                last_name: userName.split(' ').slice(1).join(' ') || '',
                mobile_no: userPhoneNumber,
                whatsapp: sameAsMobileNumber ? userPhoneNumber : whatsAppNumber,
                address: userDetails.pickupLocation,
                add_latitude: latLong.lat1 || 25.5941,
                add_longitude: latLong.long1 || 85.137566,
            };
            const response = await apiClient('POST', '/user_management/add-user', userData);
            if(response?.success && response?.data) {
                const user = response.data;
                console.log("Created User:", user);
                setUser_ref_id(prev=> user.ref_user_id || '');
                toast.success("User created successfully");
                return user.ref_user_id || null;
            } else {
                toast.error(response.message || "Failed to create user.");
                return null;
            }       
        } catch (error) {
            console.error("Create User Error:", error);
            toast.error("An error occurred while creating user.");
            return null;
        }
    }

    const addBooking = async (userIdToUse) => {
        const finalUserId = typeof userIdToUse === 'string' ? userIdToUse : user_ref_id;
        if(!finalUserId) {
            toast.error("User ID is missing. Cannot add booking.");
            return;
        }
        setCreatingBooking(true);
        const payData = {
            user_id: finalUserId,
            cab_type_id: selectedCab.id,
            basePriceId: selectedCab.id,
            isSourceCityCluster: availableServices.sourceInCluster,
            booking_type: selectedCab.cab_type.toLowerCase(),
            ride_type_id: selectedCab.id,
            city_sid: availableServices.sourceCity,
            via_source: "web",
            city_did: availableServices.destCity,
            source_name: userDetails?.pickupLocation,
            is_cluster: availableServices.is_cluster,
            source_location: {
                type: "Point",
                coordinates: [
                    latLong.lat1,
                    latLong.long1
                ]
            },
            destination_name: userDetails?.dropLocation,
            destination_location: {
                type: "Point",
                coordinates: [
                    latLong.lat2,
                    latLong.long2
                ]
            },
            estimated_fare: selectedCab.estimated_fare,
            // final_amount: data.estimated_fare,
            estimate_kilometer: availableServices?.distanceInKm,
            final_kilometer: availableServices?.distanceInKm,
            booking_for: "self",
            guest_name: userName,
            guest_mobile: userPhoneNumber,
            guest_whatsapp_number: whatsAppNumber,
            extra_time_per_minutes: selectedCab.extra_minutes_charge,
            extra_time_per_hr:  selectedCab?.package_extra_time_per_hr,
            is_local: availableServices.is_local? availableServices.is_local: false,
            bothInCluster: availableServices?.bothInCluster,
            rideStateName: availableServices?.sourceState?.state || null,
            package_id: null,
            wa_country_code: "+91",
            booking_status: "pending",
            rideServiceType: availableServices.serviceType,
            service_type: "Oneway",

            booking_details_json: {
                adults: userDetails.adult || 0,
                children: userDetails.children || 0,
                luggage_small: userDetails.bigLuggage || 0,
                luggage_big: userDetails.smallLuggage || 0
            },
            booking_date: `${formatDate(userDetails?.date)} ${userDetails?.bookingTime}`,
            distanceTimeGoogleData: {
                distanceText: availableServices?.distanceTimeGoogleData?.distanceText || "",
                distanceValue: availableServices?.distanceTimeGoogleData?.distanceValue || 0,
                durationText: availableServices?.distanceTimeGoogleData?.durationText || "",
                durationValue: availableServices?.distanceTimeGoogleData?.durationValue || 0
            }
        }
        try {
            const response = await apiClient("POST", '/ride_management/add-admin-booking', payData, {});
            if (response.success) {
                if (response?.data) {
                    toast.success(response.message || "Booking added successfully");
                    console.log("Booking Response:", response.data);
                    setCreatingBooking(false);
                    resetData();
                    window.open(`/ridesManagement/details?urid=${response.data.urid}`, '_blank');
                } else {
                    toast.error(response?.message || "Failed to add booking");
                }
            } else {
                console.log(response?.status);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="bg-white dark:bg-gray-900 shadow-md border dark:border-slate-700 rounded-md transition-all duration-300 ease-in-out">
                {/* TOP SECTION  */}
                <div
                    className="flex md:flex-row items-start md:items-center justify-between gap-4 rounded-t-md px-4 py-2 bg-gradient-to-r from-[#F0F5FD] to-[#B9EAFF] dark:from-[#1E1F2D] dark:to-[#323B50]">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-400 dark:bg-[#EADFFA] p-2 rounded-lg shadow-lg">
                            <User2 className="" />
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-[14px] font-semibold text-gray-900 dark:text-white">{"User Details"}</h2>
                            <p className="text-[16px] text-gray-600 dark:text-gray-300">{"Please fill in the user details"}</p>
                        </div>
                    </div>

                    <button
                        className="mt-4 md:mt-0 text-black dark:text-gray-300"
                        onClick={() => setIsActive(!isActive)}
                    >
                        <FaCaretDown className={`text-2xl transform transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                {/* Conditionally Rendered Section */}
                {isActive && (
                    <div className="flex flex-col items-center p-4 justify-between text-sm rounded-md py-2 transition-colors">
                        <div className="w-full flex items-center gap-4 p-4 justify-between text-sm rounded-md py-2 transition-colors">
                            <div className="w-full flex items-center justify-between border border-gray-300 dark:border-gray-600 p-2 rounded-md">
                                <div className="flex items-center gap-2 w-full">
                                    <FaPhone className="text-gray-500" />
                                    <input
                                        type="text"
                                        value={userPhoneNumber}
                                        placeholder="Enter Phone Number"
                                        onChange={(e) => setUserPhoneNumber(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                searchUser(userPhoneNumber);
                                            }
                                        }}
                                        className="w-full bg-transparent  focus:outline-none text-gray-900 dark:text-white text-[16px]"
                                    />
                                    <FaSearch className="text-gray-500 cursor-pointer" onClick={() => {searchUser(userPhoneNumber)}} />
                                </div>
                            </div>
                            <div className="w-full flex items-center justify-between border border-gray-300 dark:border-gray-600 p-2 rounded-md">
                                <div className="flex items-center gap-2 w-full">
                                    <LuUser className=" text-[14px] font-semibold" />
                                    <input
                                        type="text"
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                        placeholder="Enter Name"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                searchUser(userName);
                                            }
                                        }}
                                        className="w-full bg-transparent focus:outline-none text-gray-900 dark:text-white text-[16px] "
                                    />
                                    <FaSearch className="text-gray-500 cursor-pointer" onClick={() => {searchUser(userName)}} />
                                </div>
                            </div>
                        </div>
                        <div className="w-full flex items-center gap-4 p-4 justify-between text-sm rounded-md py-2 transition-colors">

                            <div className="w-full flex items-center justify-between border border-gray-300 dark:border-gray-600 p-2 rounded-md">
                                <div className="flex items-center gap-2 w-full">
                                    <FaWhatsapp className="text-green-500 dark:text-green-400 text-[20px]" />
                                    <input
                                        type="text"
                                        value={sameAsMobileNumber ? userPhoneNumber : whatsAppNumber}
                                        disabled={sameAsMobileNumber}
                                        placeholder="Enter Whatsapp Number"
                                        onChange={(e) => setWhatsAppNumber(e.target.value)}
                                        className="w-full bg-transparent  focus:outline-none text-gray-900 dark:text-white text-[16px]"
                                    />
                                </div>
                            </div>
                            <div className="w-full flex items-center justify-start p-2 rounded-md">
                                <div className="flex items-center gap-2 w-full">
                                    <p>Same as Mobile Number</p>
                                    <Switch
                                        color={sameAsMobileNumber ? "success" : "default"}
                                        checked={sameAsMobileNumber}
                                        onChange={(e) => setSameAsMobileNumber(e.target.checked)}
                                        slotProps={{ input: { 'aria-label': 'controlled' } }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>

            <div className="bg-white dark:bg-gray-900 shadow-md border dark:border-slate-700 rounded-md transition-all duration-300 ease-in-out">
                {/* TOP SECTION  */}
                <div
                    className="flex md:flex-row items-start md:items-center justify-between gap-4 rounded-t-md px-4 py-2 bg-gradient-to-r from-[#F0F5FD] to-[#B9EAFF] dark:from-[#1E1F2D] dark:to-[#323B50]">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-400 dark:bg-[#EADFFA] p-2 rounded-lg shadow-lg">
                            <GiJourney className="" size={24} />
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-[14px] font-semibold text-gray-900 dark:text-white">{"Journey Points"}</h2>
                            <p className="text-[16px] text-gray-600 dark:text-gray-300">{"Please fill in the journey details"}</p>
                        </div>
                    </div>

                    <button
                        className="mt-4 md:mt-0 text-black dark:text-gray-300"
                        onClick={() => setIsJourneyPointsActive(!isJourneyPointsActive)}
                    >
                        <FaCaretDown className={`text-2xl transform transition-transform duration-300 ${isJourneyPointsActive ? 'rotate-180' : ''}`} />
                    </button>
                </div>
                {isJourneyPointsActive && (<div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-3">
                        {/* PICKUP LOCATION  */}
                        <div className="relative w-full">
                            <label className="flex items-center gap-2 mb-1">
                                <span className="flex items-center gap-1">
                                    <span className="h-2 w-2 bg-green-600 rounded-full"></span>
                                    <span className="text-[12px] text-gray-400 dark:text-gray-300">
                                        Pickup Location
                                    </span>
                                </span>
                            </label>

                            <input
                                type="text"
                                value={userDetails?.pickupLocation}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setUserDetails((prev) => ({
                                        ...prev,
                                        pickupLocation: value,
                                    }));
                                    searchPlace(value, "from");
                                    setSelectedField("from");
                                }}
                                className="w-full px-4 py-1.5 text-[14px] rounded-[5px] border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white"
                            />

                            {loading && (
                                <div className="absolute mt-1 w-full bg-white dark:bg-gray-700 border rounded shadow z-10 flex items-center justify-center py-1">
                                    {/* <p className="p-2 text-sm text-gray-500 dark:text-gray-300">Loading...</p> */}
                                    <div role="status">
                                        <svg
                                            aria-hidden="true"
                                            className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-green-500"
                                            viewBox="0 0 100 101"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                fill="currentColor"
                                            />
                                            <path
                                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                fill="currentFill"
                                            />
                                        </svg>
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                </div>
                            )}

                            {!loading &&
                                selectedField === "from" &&
                                suggestions?.length > 0 && (
                                    <ul className="absolute mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-lg rounded-lg max-h-48 overflow-auto z-30">
                                        {suggestions?.map((item, index) => (
                                            <li
                                                key={index}
                                                className="p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                                onClick={() => {
                                                    setUserDetails((prev) => ({
                                                        ...prev,
                                                        pickupLocation: `${item?.description}`,
                                                    }));
                                                    setLatLong((prev) => ({
                                                        ...prev,
                                                        lat1: item?.geometry?.location?.lat,
                                                        long1: item?.geometry?.location?.lng,
                                                    }));
                                                    // updateFareDetail();
                                                    setSuggestions([]);
                                                }}
                                            >
                                                <div className="flex flex-col">
                                                    <h2 className="text-base font-semibold text-black dark:text-white">
                                                        {item?.description}
                                                    </h2>
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                                        {item?.address}
                                                    </span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                        </div>

                        {/* DROP LOCATION  */}
                        <div className="relative w-full">
                            <label className="flex items-center gap-2 mb-1">
                                <span className="flex items-center gap-1">
                                    <span className="h-2 w-2 bg-red-600 rounded-full"></span>
                                    <span className="text-[12px] text-gray-400 dark:text-gray-300">
                                        Drop Location
                                    </span>
                                </span>
                            </label>

                            <input
                                type="text"
                                value={userDetails?.dropLocation}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setUserDetails((prev) => ({ ...prev, dropLocation: value }));
                                    searchPlace(value, "to");
                                    setSelectedField("to");
                                }}
                                className="w-full px-4 py-1.5 text-[14px] rounded-[5px] border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white"
                            />

                            {toLoad && (
                                <div className="absolute mt-1 w-full bg-white dark:bg-gray-700 border rounded shadow z-10 flex items-center justify-center py-1">
                                    {/* <p className="p-2 text-sm text-gray-500 dark:text-gray-300">Loading...</p> */}
                                    <div role="status">
                                        <svg
                                            aria-hidden="true"
                                            className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-green-500"
                                            viewBox="0 0 100 101"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                fill="currentColor"
                                            />
                                            <path
                                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                fill="currentFill"
                                            />
                                        </svg>
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                </div>
                            )}

                            {!toLoad && selectedField === "to" && suggestions?.length > 0 && (
                                <ul className="absolute mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-lg rounded-lg max-h-48 overflow-auto z-30">
                                    {suggestions?.map((item, index) => (
                                        <li
                                            key={index}
                                            className="p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                            onClick={() => {
                                                setUserDetails((prev) => ({
                                                    ...prev,
                                                    dropLocation: `${item?.description}`,
                                                }));
                                                setLatLong((prev) => ({
                                                    ...prev,
                                                    lat2: item?.geometry?.location?.lat,
                                                    long2: item?.geometry?.location?.lng,
                                                }));
                                                // updateFareDetail();
                                                setSuggestions([]);
                                            }}
                                        >
                                            <div className="flex flex-col">
                                                <h2 className="text-base font-semibold text-black dark:text-white">
                                                    {item?.description}
                                                </h2>
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    {item?.address}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center justify-between flex-wrap gap-6">
                        <div className="flex items-center justify-between flex-1 gap-2">
                            <div className="flex flex-col">
                                <label className="flex items-center gap-1 dark:text-gray-300">
                                    <FaUserFriends className="text-gray-400 text-[12px]" />
                                    <span className="text-[12px] text-gray-400 dark:text-gray-300">
                                        Adults
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    value={userDetails?.adult}
                                    onChange={(e) =>
                                        setUserDetails((prev) => ({
                                            ...prev,
                                            adult: e.target.value,
                                        }))
                                    }
                                    className="w-full px-4 py-1.5 border border-gray-300 dark:border-gray-700 rounded-[5px] bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white text-[14px]"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="flex items-center gap-1 dark:text-gray-300">
                                    <FaUserFriends className="text-gray-400 text-[12px]" />
                                    <span className="text-[12px] text-gray-400 dark:text-gray-300">
                                        Children
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    value={userDetails?.children}
                                    onChange={(e) =>
                                        setUserDetails((prev) => ({
                                            ...prev,
                                            children: e.target.value,
                                        }))
                                    }
                                    className="w-full px-4 py-1.5 border border-gray-300 dark:border-gray-700 rounded-[5px] bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white text-[14px]"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="flex items-center gap-1 dark:text-gray-300">
                                    <FaSuitcaseRolling className="text-gray-400 text-[12px]" />
                                    <span className="text-[12px] text-gray-400 dark:text-gray-300">
                                        Big Luggage
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    value={userDetails?.bigLuggage}
                                    onChange={(e) =>
                                        setUserDetails((prev) => ({
                                            ...prev,
                                            bigLuggage: e.target.value,
                                        }))
                                    }
                                    className="w-full px-4 py-1.5 border border-gray-300 dark:border-gray-700 rounded-[5px] bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white text-[14px]"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="flex items-center gap-1 dark:text-gray-300">
                                    <FaSuitcaseRolling className="text-gray-400 text-[12px]" />
                                    <span className="text-[12px] text-gray-400 dark:text-gray-300">
                                        Small Luggage
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    value={userDetails?.smallLuggage}
                                    onChange={(e) =>
                                        setUserDetails((prev) => ({
                                            ...prev,
                                            smallLuggage: e.target.value,
                                        }))
                                    }
                                    className="w-full px-4 py-1.5 border border-gray-300 dark:border-gray-700 rounded-[5px] bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white text-[14px]"
                                />
                            </div>
                        </div>

                        {/* DATE AND TIME  */}
                        <div className="flex items-center justify-between flex-1 gap-2">
                            <div className="flex flex-col w-[48%]">
                                <label className="flex items-center gap-1 dark:text-gray-300">
                                    <FaCalendarAlt className="text-gray-400 text-[12px]" />
                                    <span className="text-[12px] text-gray-400 dark:text-gray-300">
                                        Date
                                    </span>
                                </label>
                                <input
                                    type="date"
                                    value={userDetails?.date}
                                    onChange={(e) =>
                                        setUserDetails((prev) => ({
                                            ...prev,
                                            date: e.target.value,
                                        }))
                                    }
                                    className="w-full px-4 py-1.5 border border-gray-300 dark:border-gray-700 rounded-[5px] bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white text-[14px]"
                                />
                            </div>

                            <div className="flex flex-col w-[48%]">
                                <label className="flex items-center gap-1 dark:text-gray-300">
                                    <FaClock className="text-gray-400 text-[12px]" />
                                    <span className="text-[12px] text-gray-400 dark:text-gray-300">
                                        Time
                                    </span>
                                </label>
                                <input
                                    type="time"
                                    value={userDetails?.bookingTime}
                                    onChange={(e) =>
                                        setUserDetails((prev) => ({
                                            ...prev,
                                            bookingTime: e.target.value,
                                        }))
                                    }
                                    className="w-full px-4 py-1.5 border border-gray-300 dark:border-gray-700 rounded-[5px] bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white text-[14px]"
                                />
                            </div>
                        </div>
                    </div>
                </div>)}
            </div>

            <div className="w-full flex items-center justify-between py-2">
                <button
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    onClick={() => searchService()}
                >
                    Search Services
                </button>
            </div>
            {serviceSearched && availableServices && (
                <div className="bg-white dark:bg-gray-900 shadow-md border dark:border-slate-700 rounded-md transition-all duration-300 ease-in-out p-4">
                    <div>
                        <span className="text-[14px] text-gray-600 dark:text-gray-300">
                            {`Distance: ${availableServices?.distanceInKm || 0} km`}
                        </span>
                        <span className="mx-4 text-[14px] text-gray-600 dark:text-gray-300">
                            {`Duration: ${formatTimeFromMinutes(availableServices?.durationInMin) || 0} mins`}
                        </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                        {serviceSearched && fareDetails && fareDetails.length > 0 && fareDetails.map((ride, index) => {
                            const getBorderClass = () => {
                                if (selected === index) return "border-gray-500";
                                return "border-transparent hover:border-gray-300 dark:hover:border-gray-600";
                            };
                            return (
                                <div
                                    key={index}
                                    onClick={() => handleSetSelected(index)}
                                    className={`relative flex flex-col items-start bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm cursor-pointer transition-all duration-200 border-2 ${getBorderClass()}`}
                                >
                                    {/* CAB TYPE BADGE */}
                                    {ride?.cab_type && (
                                        <div
                                            className={`absolute top-0 left-20 -translate-x-1/2 -translate-y-1/2 
                                        ${selected === index
                                                    ? "bg-gradient-to-r from-[#038e29] to-[#02f946]"
                                                    : "bg-gradient-to-r from-blue-500 to-cyan-400"} 
                                            dark:bg-yellow-500 text-white dark:text-black text-[12px] px-4 py-0.5 rounded-full`}
                                        >
                                            {ride?.cab_type}
                                        </div>
                                    )}
                                    {/* CONTENT: CAB IMAGE + PRICE */}
                                    <div className="w-full flex items-center gap-8 mb-3">
                                        {/* IMAGE */}
                                        <div className="ml-[7%] rounded-xl flex items-start">
                                            <img
                                                src={getValidCabImage(ride?.cab_icon, ride?.cab_type)}
                                                alt="Cab"
                                                width={120}
                                                height={120}
                                                className="object-contain rounded-xl"
                                                onError={(e) => { e.target.onerror = null; e.target.src = getValidCabImage(null, ride?.cab_type); }}
                                            />
                                        </div>
                                        {/* PRICE */}
                                        <div className="flex items-start flex-col">
                                            <div className="flex items-start gap-1">
                                                <span className="font-bold text-gray-600 dark:text-gray-100 text-[14px]">
                                                    {ride?.cab_type}
                                                </span>
                                                <button onClick={() => setShowModal(true)}>
                                                    <AiTwotoneExclamationCircle className="text-gray-300 text-[18px]" />
                                                </button>
                                            </div>

                                            <div className="flex flex-col text-[12px]">
                                                <div className="flex items-center gap-4 justify-between">
                                                    <span>Estimated Fare</span>
                                                    <span
                                                        className={`"text-purple-700 dark:text-yellow-400"
                                                        text-[16px] font-bold`}
                                                    >
                                                        ₹{ride?.estimated_price || ride?.estimated_fare}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4 justify-between">
                                                    <span>Advance Amount</span>
                                                    <span className="text-[16px] text-green-600 font-bold">
                                                        ₹{ride?.advanceToBe || ride?.advance_amount || ride?.advance_amt || ride?.advance_to_be || ride?.advance || (ride?.estimated_price || ride?.estimated_fare ? Math.round((ride?.estimated_price || ride?.estimated_fare) * 0.2) : 0)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4 justify-between">
                                                    <span>Extra Per Km</span>
                                                    <span className="text-[16px]">₹{ride?.extra_per_km || 0} /Km</span>
                                                </div>
                                                <div className="flex items-center gap-4 justify-between">
                                                    <span>Extra Per Min</span>
                                                    <span className="text-[16px]">₹{ride?.extra_minutes_charge || 0} /min</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
            {serviceSearched && <div className="w-full flex items-center justify-between py-2">
                <button
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    onClick={() => handleAddBooking()}
                    disabled={selected === null || creatingBooking}
                >
                    Add Booking
                </button>
            </div>}
        </div>
    );
};
export default AddNewBooking;