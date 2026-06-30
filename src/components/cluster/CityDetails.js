'use client'
import React, { useState, useEffect } from "react";
import { IoIosTrendingUp } from "react-icons/io";
import { FaCarSide } from "react-icons/fa";
import { IoMdTrendingUp } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import { HiSparkles } from "react-icons/hi2";
import { TbCarSuv } from "react-icons/tb";
import { MdOutlineLocalOffer } from "react-icons/md";
import { MdAccessTime } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import ClusterModal from '@/components/cluster/modal/ClusterModal';
import { apiClient } from "@/app/lib/apiClient";
import { useDispatch } from "react-redux";
import Image from "next/image";
import { toast } from "react-toastify";
import { HiArrowSmRight } from "react-icons/hi";

const CityDetails = ({ clusters, globalFareList, ride_type }) => {
    const [intraValue, setIntraValue] = useState(0);
    const [minLocalRange, setMinLocalRange] = useState(0);
    const localRange = [0, 150];
    const [intraCityRange, setIntraCityRange] = useState([0, 500]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState("");
    const [loading, setLoading] = useState(false);
    const [active, setActive] = useState(null); // 'min' | 'max' | null
    const [isIntraCityOn, setIsIntraCityOn] = useState(false);
    const [isInterCity, setIsInterCity] = useState(false);
    const [isLocal, setIsLocal] = useState(false);
    const [isIntraState, setIsIntraState] = useState(false);
    const dispatch = useDispatch();
    const [clusterDetails, setClusterDetails] = useState([]);
    const [editingService, setEditingService] = useState(null); // Track which service is being edited
    const [editedValues, setEditedValues] = useState({}); // Store edited values

    //For both Rental and one-way
    const [isOn, setIsOn] = useState(clusters?.is_cluster === "yes");
    // For Rental
    const [packageList, setPackageList] = useState([]);
    const [active_package_id, setActivePkgName] = useState("");
    const [isRental, setIsRental] = useState(false);
    const [packagePriceList, setPackagePriceList] = useState([]);
    const [selectedPackageCab, setSelectedPackageCab] = useState("");
    const [isEditingCab ,setIsEditingCab] = useState(false);
    const [editingCabData, setEditingCab] = useState();

        const fetchClusterDetails = async () => {
            setLoading(true);
            try {
                const data = await apiClient(
                    "GET",
                    `/city/get-cluster-details-by-city_id/${clusters?.id}`
                );

                if (data?.success) {
                    setClusterDetails(data.data);
                } else {
                    console.error("API Error:", data.message);
                }
            } catch (error) {
                console.error("Error fetching cluster details:", error);
            } finally {
                setLoading(false);
            }
        };

    const vehicleEnum = {
        "mini": 1,
        "sedan": 2,
        "suv": 3
    }


    const [response, setResponse] = useState(null);

    const handleToggleAndUpdate = async () => {
        const newValue = !isOn;   // pehle toggle value nikal lo
        setIsOn(newValue);        // state update karo

        try {
            setLoading(true);
            if(newValue) {
                const response = await apiClient("POST", `/city/add-cluster`, {
                    city_id: clusters?.id,
                    is_cluster: newValue ? "yes" : "no",
                });
                if(response.status) {
                    toast.success(response.message);
                    if(ride_type === "oneway") {
                        fetchClusterDetails();
                    } else {
                        fetchRentalPackageListByCityId(clusters?.id);
                    }
                } else {
                    toast.error(response.message);
                }
            } else {
                const result = await apiClient("PUT", `/city/update-city/${clusters?.id}`, {
                    is_cluster: newValue ? "yes" : "no",   // ✅ condition lag gayi
                });
    
                if(result.status) {
                    setResponse(result);
                    toast.success(result.message);
                } else {
                    toast.error(result.message);
                    setResponse(result);
                }

            }
        } catch (err) {
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    };


    const handleIntraUpdate = async () => {
        const newVal = isIntraCityOn;

        setIsIntraCityOn(!newVal)

        try {
            setLoading(true);
            const result = await apiClient("PUT", `/city/update-city/${clusters?.id}`, {
                is_intracity: !newVal ? "yes" : "no",   // ✅ condition lag gayi
            });

            if(result.status) {
                setResponse(result);
                toast.success(result.message);
            } else {
                toast.error(result.message);
                setResponse(result);
            }
        } catch (err) {
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleRentalToggle = async () => {
        const value = isRental;
        var res;
        setIsRental(!value);
        setLoading(true);
        try {
            if(value) {
                res = await apiClient("PUT", `/city/update-city/${clusters?.id}`, {
                    is_rental: !value ? "yes" : "no",   // ✅ condition lag gayi
                });
            } else {
                res = await apiClient("POST", `/rental_package/add-package`, {
                    city_id: clusters?.id
                });
            }
            if(res.status) {
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error("something went wrong");
        } finally {
            setLoading(false);
        }
    }

    const handleInterCityUpdate = async () => {
        const newVal = isInterCity;

        setIsInterCity(!newVal)

        try {
            setLoading(true);
            const result = await apiClient("PUT", `/city/update-city/${clusters?.id}`, {
                is_intercity: !newVal ? "yes" : "no",   // ✅ condition lag gayi
            });

            if(result.status) {
                setResponse(result);
                toast.success(result.message);
            } else {
                toast.error(result.message);
                setResponse(result);
            }
        } catch (err) {
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    };


    const handleInterStateUpdate = async () => {
        const newVal = isIntraState;

        setIsIntraState(!newVal)

        try {
            setLoading(true);
            const result = await apiClient("PUT", `/city/update-city/${clusters?.id}`, {
                is_intrastate: !newVal ? "yes" : "no",   // ✅ condition lag gayi
            });

            if(result.status) {
                setResponse(result);
                toast.success(result.message);
            } else {
                toast.error(result.message);
                setResponse(result);
            }
        } catch (err) {
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleLocalServiceUpdate = async () => {
        const newVal = isLocal;

        setIsLocal(!newVal)

        try {
            setLoading(true);
            const result = await apiClient("PUT", `/city/update-city/${clusters?.id}`, {
                is_local: !newVal ? "yes" : "no",   // ✅ condition lag gayi
            });

            if(result.status) {
                setResponse(result);
                toast.success(result.message);
            } else {
                toast.error(result.message);
                setResponse(result);
            }
        } catch (err) {
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        if (clusters) {
            setIntraValue(clusters.intra_city_min_km);
            setMinLocalRange(clusters.local_min_km);
            setLocalServiceRange(clusters.local_max_km);
            setIsIntraCityOn(clusters.is_intracity === "yes");
            setIsRental(clusters.is_rental === "yes");
            setIsInterCity(clusters.is_intercity === "yes");
            setIsLocal(clusters.is_local === "yes");
            setIsIntraState(clusters.is_intrastate === "yes");
            setIsOn(clusters?.is_cluster === "yes");
        }
    }, [clusters]);

    const fetchRentalPackageListByCityId = async (city_id) => {
        try {
            setLoading(true);
            const response = await apiClient("GET", `/rental_package/get-rental-package-price-details-by-city_id/${city_id}`);
            if(response.status) {
                toast.success(response.message);
                setPackageList(response.data);
            } else {
                toast.error(response.message);
                // setPackageList(globalFareList);
            }
        } catch (error) {
            // setPackageList(globalFareList);
        } finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
        if(clusters?.id && ride_type === "rental") {
            fetchRentalPackageListByCityId(clusters?.id);
            setActivePkgName("");
            setPackagePriceList([]);
            setEditingCab();
            setSelectedPackageCab("");
        } else if(clusters?.id && ride_type === "oneway") {
            fetchClusterDetails();
        }

    },[ride_type, clusters?.id, globalFareList]);

    const handlePackageSelection = (pkg) => {
        setActivePkgName(pkg.id);
        setSelectedPackageCab("");
        setIsEditingCab(false);
        setEditingCab();
        if(pkg.package_price_json && pkg.package_price_json.length > 0) {
            setPackagePriceList(pkg.package_price_json);
        } else {
            setPackagePriceList([]);
        }
    }

    const handlePackageVehicleSelection = (cab) => {
        setIsEditingCab(false);
        setEditingCab(prev=> undefined);
        setSelectedPackageCab(cab.cab_type_id);
    }

    const handlePackageCabPriceEdit = (cab) => {
        setEditingCab(cab);
        setIsEditingCab(true);
    }

    const handleConfirmCabEdit = (cab) => {
        setIsEditingCab(false);
        const remainingPackagePriceList = packagePriceList.filter(obj=> obj.cab_type_id != cab.cab_type_id);
        const newPackagePriceList = [...remainingPackagePriceList, editingCabData];
        setPackagePriceList(newPackagePriceList);
        setEditingCab();
    }

    const handleSaveRentalCofig = async () => {
        if(!active_package_id || !selectedPackageCab || isEditingCab) {
            return;
        }
        try {
            setLoading(true);
            const selectedPackage = packageList.find((pk)=>pk.id === active_package_id);
            const payload = {
                "city_id": clusters?.id,
                "package_name": selectedPackage.package_name,
                "package_km": selectedPackage.package_km,
                "package_time": selectedPackage.package_time,
                "package_price_json": [...packagePriceList]
            }
            const res = await apiClient("PUT", `/rental_package/updateRentalPriceByCityId/${selectedPackage.id}`, payload);
            if(res.status) {
                toast.success(res.message);
                fetchRentalPackageListByCityId(clusters?.id);
            } else {
                toast.error(res.message);
            }
        } catch (err) {
            toast.error(err.data.message || "something went wrong");
        } finally {
            setLoading(false);
            setEditingCab();
            setIsEditingCab(false);
            setActivePkgName("");
            setPackagePriceList([]);
        }
    }

    // const handleToggle = () => {
    //     const newValue = !isOn;
    //     setIsOn(newValue);
    // };

    const [localServiceRange, setLocalServiceRange] = useState(0);

    const vehicleTypes = [{
            type: "Mini",
            gradient: "bg-[linear-gradient(90deg,_#3B82F6_0%,_#4338CA_100%)]",
            icon: <FaCarSide className="text-white text-xl" />
    }, {
            type: "Sedan",
            gradient: "bg-[linear-gradient(90deg,_#3B82F6_0%,_#4338CA_100%)]",
            icon: <FaCarSide className="text-white text-xl" />
    }, {
            type: "Suv",
            gradient: "bg-[linear-gradient(90deg,_#9333EA_0%,_#9D174D_100%)]",
            icon: <TbCarSuv className="text-white text-xl" />
    }];
    const serviceTypes = [{
        name: "IntraCity",
        key: 'intra_city',
        gradient: "bg-[linear-gradient(90deg,_#22D3EE_0%,_#3B82F6_50%,_#4F46E5_100%)]",
        icon: "/icons/IntraCity_Icon.svg",
        fields: [
            { label: "Base Fare", value: "base", icon: <IoMdTrendingUp /> },
            { label: "Per Km", value: "perKm", icon: <FaCarSide /> },
            { label: "Extra Km", value: "extraKm", icon: <HiSparkles /> },
            { label: "Waiting", value: "waiting", icon: <MdAccessTime /> }
        ]
    }, {
        name: "Local",
        key: "local",
        gradient: "bg-[linear-gradient(90deg,_#3B82F6_0%,_#4F46E5_50%,_#7E22CE_100%)]",
        icon: "/icons/Local_Service_icon.svg",
        fields: [
            { label: "Base Fare", value: "base", icon: <IoMdTrendingUp /> },
            { label: "Per Km", value: "perKm", icon: <FaCarSide /> },
            { label: "Extra Km", value: "extraKm", icon: <HiSparkles /> },
            { label: "Waiting", value: "waiting", icon: <MdAccessTime /> }
        ]
    }, {
        name: "Intercity",
        key: "inter_city",
        gradient: "bg-[linear-gradient(90deg,_#4F46E5_0%,_#7E22CE_50%,_#9D174D_100%)]",
        icon: "/icons/InterCity_Icon.svg",
        fields: [
            { label: "Base Fare", value: "base", icon: <IoMdTrendingUp /> },
            { label: "Per Km", value: "perKm", icon: <FaCarSide /> },
            { label: "Extra Km", value: "extraKm", icon: <HiSparkles /> },
            { label: "Waiting", value: "waiting", icon: <MdAccessTime /> }
        ]
    }, {
        name: "Interstate",
        key: "inter_state",
        gradient: "bg-[linear-gradient(90deg,_#7E22CE_0%,_#9D174D_50%,_#881337_100%)]",
        icon: "/icons/InterState_Icon.svg",
        fields: [
            { label: "Base Fare", value: "base", icon: <IoMdTrendingUp /> },
            { label: "Per Km", value: "perKm", icon: <FaCarSide /> },
            { label: "Extra Km", value: "extraKm", icon: <HiSparkles /> },
            { label: "Waiting", value: "waiting", icon: <MdAccessTime /> }
        ]
    }];

    const [addClusterData, setAddClusterData] = useState({
        city_id: "",
        cab_type_id: "",
        local_min_km: "",
        local_max_km: "",
        local_per_km: "",
        local_extra_per_km: "",
        local_extra_per_hr: "",
        intercity_per_km: "",
        intercity_extra_per_km: "",
        intercity_extra_per_hr: "",
        is_cluster: ""
    });

    const addCluster = async () => {
        const payData = {
            city_id: addClusterData?.city_id,
            cab_type_id: addClusterData?.cab_type_id,
            local_min_km: addClusterData?.local_min_km,
            local_max_km: addClusterData?.local_max_km,
            local_per_km: addClusterData?.local_per_km,
            local_extra_per_km: addClusterData?.local_extra_per_km,
            local_extra_per_hr: addClusterData?.local_extra_per_hr,
            intercity_per_km: addClusterData?.intercity_per_km,
            intercity_extra_per_km: addClusterData?.intercity_extra_per_km,
            intercity_extra_per_hr: addClusterData?.intercity_extra_per_hr,
            is_cluster: addClusterData?.is_cluster
        };
        try {
            const response = await apiClient('POST', '/city/add-cluster', JSON.stringify(payData), true);
        }
        catch (err) {
        }
        finally {
        }
    };

    // useEffect(() => { commented because not being used
    //     const fetchData = async () => {
    //         try {
    //             setLoading(true);
    //             setError(null);
    //             const res = await apiClient('GET', `/city/cluster-details/1`, '', true);
    //             setClusterData(res?.data?.data);
    //         } catch (err) {
    //             setError(err.message);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //     fetchData();
    // }, []);

    const handleShowModalComponent = (modalType) => {
        setModalType(modalType);
        setIsModalOpen(true);
    };


    // Handle edit button click
    const handleEditClick = (vehicleType, serviceName) => {
        const serviceKey = `${vehicleType}-${serviceName}`;
        setEditingService(serviceKey);

        // Initialize edited values with current data
        const vehicleDetails = getVehicleDetails(vehicleType);
        const serviceData = getServiceData(serviceName, vehicleDetails);

        setEditedValues({
            ...editedValues,
            [serviceKey]: {
                base: serviceData.base,
                perKm: serviceData.perKm,
                extraKm: serviceData.extraKm,
                waiting: serviceData.waiting
            }
        });
    };

    // Handle input change
    const handleInputChange = (field, value, vehicleType, serviceName) => {
        const serviceKey = `${vehicleType}-${serviceName}`;
        setEditedValues({
            ...editedValues,
            [serviceKey]: {
                ...editedValues[serviceKey],
                [field]: value
            }
        });
    };

    // Handle save button click
    const handleSaveClick = async (vehicleType, serviceName, serviceKey) => {
        const key = `${vehicleType}-${serviceName}`;
        // Here you would typically make an API call to save the data
        try {
            setLoading(true);
            const dataToSave = {
                city_id: clusters?.id,
                cab_type_id: vehicleEnum[vehicleType.toLowerCase()],
                [`${serviceKey}_base`]: editedValues[key]?.base,
                [`${serviceKey}_per_km`]: editedValues[key]?.perKm,
                [`${serviceKey}_extra_km`]: editedValues[key]?.extraKm,
                [`${serviceKey}_extra_minute`]: editedValues[key]?.waiting
            };
            const response = await apiClient('PUT', `/city/update-city-cluster-price-by-city-id/${clusters?.id}`, dataToSave);
            if(response.status) {
                toast.success(response.message || "Values saved successfully");
                fetchClusterDetails();
            } else {
                toast.error(response.message || "Error saving values");
            }
        } catch (error) {
            toast.error(error.message || "Error saving values");
            console.error("Error saving values:", error);
        } finally {
            setEditingService(null);
            fetchClusterDetails();
            setLoading(false);
        }
    };

    // Handle cancel button click
    const handleCancelClick = () => {
        setEditingService(null);
    };

    // Helper function to get vehicle details based on type
    const getVehicleDetails = (vehicleType) => {
        switch (vehicleType.toLowerCase()) {
            case "mini": {
                if(clusters?.is_cluster?.toLowerCase() === "yes"){
                    return clusterDetails?.find(item => item?.cab_type_id === 1);
                }
                return globalFareList?.find(item => item?.cab_typ_id === 1);
            }
            case "sedan": {
                if(clusters?.is_cluster?.toLowerCase() === "yes"){
                    return clusterDetails?.find(item => item?.cab_type_id === 2);
                }
                return globalFareList?.find(item => item?.cab_typ_id === 2);
            }
            case "suv": {
                if(clusters?.is_cluster?.toLowerCase() === "yes"){
                    return clusterDetails?.find(item => item?.cab_type_id === 3)
                }
                return globalFareList?.find(item => item?.cab_typ_id === 3);
            }
            default: return {};
        }
    };

    // Helper function to get service data based on service name
    const getServiceData = (serviceName, vehicleDetails) => {
        switch (serviceName.toLowerCase()) {
            case "intracity":
                return {
                    base: vehicleDetails?.intra_city_base || '-',
                    perKm: vehicleDetails?.intra_city_per_km || '-',
                    extraKm: vehicleDetails?.intra_city_extra_km || '-',
                    waiting: vehicleDetails?.intra_city_extra_minute || '-'
                };
            case "local":
                return {
                    base: vehicleDetails?.local_base || '-',
                    perKm: vehicleDetails?.local_per_km || '-',
                    extraKm: vehicleDetails?.local_extra_km || '-',
                    waiting: vehicleDetails?.local_extra_minute || '-'
                };
            case "intercity":
                return {
                    base: vehicleDetails?.inter_city_base || '-',
                    perKm: vehicleDetails?.inter_city_per_km || '-',
                    extraKm: vehicleDetails?.inter_city_extra_km || '-',
                    waiting: vehicleDetails?.inter_city_extra_minute || '-'
                };
            case "interstate":
                return {
                    base: vehicleDetails?.inter_state_base || '-',
                    perKm: vehicleDetails?.inter_state_per_km || '-',
                    extraKm: vehicleDetails?.inter_state_extra_km || '-',
                    waiting: vehicleDetails?.inter_state_extra_minute || '-'
                };
            default:
                return {
                    base: '-',
                    perKm: '-',
                    extraKm: '-',
                    waiting: '-'
                };
        }
    };

    const handleSaveClusterConfig = async () => {
        // Save cluster configuration logic here
        try {
            const response = await apiClient("PUT", `/city/update-city/${clusters?.id}`,{
                local_min_km: minLocalRange,
                local_max_km: localServiceRange,
                intra_city_min_km: intraValue
            });
            if (response.success) {
                toast.success("Cluster configuration saved successfully!");
            } else {
                toast.error("Failed to save cluster configuration.");
            }
        } catch (error) {
            toast.error("An error occurred while saving cluster configuration.");
        }
    };
    const pct = (v) => {
        const denom = localRange[1] - localRange[0] || 1;
        return ((v - localRange[0]) / denom) * 100;
    };

    const handleMinChange = (e) => {
        const v = Number(e.target.value);
        // ensure min < max (change +1/-1 logic if you want equality)
        setMinLocalRange(Math.min(v, localServiceRange - 1));
    };

    const handleMaxChange = (e) => {
        const v = Number(e.target.value);
        setLocalServiceRange(Math.max(v, minLocalRange + 1));
    };

    const handleIntraCityChange = (e) => {
        const v = Number(e.target.value);
        setIntraValue(v);
    }

    return (
        !loading ? <div className='flex flex-col gap-1 bg-[linear-gradient(135deg,_#F8FAFC_0%,_#EFF6FF_50%,_#E0E7FF_100%)] rounded-lg p-2 sm:p-4  overflow-visible'>
            {/* City Header Section */}
            <div className='sticky top-20 flex flex-col sm:flex-row bg-[linear-gradient(90deg,_#2563EB_0%,_#4F46E5_50%,_#9333EA_100%)] rounded-lg p-4 gap-3 sm:gap-5 w-full z-20'>
                <div className='bg-white/20 p-3 sm:p-4 rounded-full self-start'>
                    <IoLocationOutline className="text-white text-xl sm:text-2xl" />
                </div>
                <div className="flex-1">
                    <strong className='text-white text-xl sm:text-3xl'>City: {clusters?.city_name}</strong>
                    <h6 className='text-white text-xs sm:text-sm'>Configure cluster settings</h6>
                </div>
                <span className="bg-white/20 border border-white/30 backdrop-blur-sm font-small text-white rounded-full shadow hover:bg-green-300 transition px-2 sm:px-3 py-1 text-xs sm:text-md self-start sm:self-center mt-2 sm:mt-0">
                    Active
                </span>
            </div>

            {/* Manage Discounts Section */}
            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mt-4'>
                <strong className='text-black px-2 sm:px-12 text-sm sm:text-base'>Manage Discounts</strong>
                <div className='flex flex-col sm:flex-row gap-2 sm:gap-4 px-2 sm:px-12 w-full sm:w-auto'>
                    <div className="flex gap-0 justify-center items-center w-full sm:w-auto">
                        <button
                            onClick={() => handleShowModalComponent('offer')}
                            className="flex items-center gap-2 bg-[linear-gradient(90deg,_#2862EB_0%,_#9234EA_100%)] text-white rounded-l-lg p-2 transition-transform duration-300 hover:scale-105 w-full sm:w-auto">
                            <MdOutlineLocalOffer className="text-lg sm:text-xl" />
                            <span className="text-xs sm:text-sm font-medium">Offer Discount</span>
                        </button>
                        <div className="bg-white text-black items-center rounded-r-lg p-2 min-w-[50px] text-center">
                            <strong className="text-xs sm:text-md">10%</strong>
                        </div>
                    </div>
                    <div className="flex gap-0 justify-center items-center w-full sm:w-auto">
                        <button
                            onClick={() => handleShowModalComponent('realtime')}
                            className="flex items-center gap-2 bg-[linear-gradient(90deg,_#EA580C_0%,_#DC2725_100%)] text-white rounded-l-lg p-2 transition-transform duration-300 hover:scale-105 w-full sm:w-auto">
                            <MdAccessTime className="text-lg sm:text-xl" />
                            <span className="text-xs sm:text-sm font-medium">Real-Time Discount</span>
                        </button>
                        <div className="bg-white text-black items-center rounded-r-lg p-2 min-w-[50px] text-center">
                            <strong className="text-xs sm:text-md">10%</strong>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cluster Management Section */}
            {ride_type ==="oneway" && <>
            <div className='flex flex-col'>
                <div className='flex flex-col sm:flex-row items-center bg-[linear-gradient(90deg,_#EFF6FF_0%,_#EEF2FF_100%)] border border-[#DBEAFE] my-4 px-4 py-3 rounded gap-3 sm:gap-0'>
                    <div className='flex flex-col flex-1'>
                        <strong className="text-black text-sm sm:text-md">Cluster Management</strong>
                        <h1 className="text-xs sm:text-sm text-[#4B5563]">Enable Cluster Management for {clusters?.city_name}</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs sm:text-sm text-gray-700 font-medium">
                            {isOn === true ? "ON" : "OFF"}
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isOn}
                                onChange={handleToggleAndUpdate}
                                className="sr-only peer"
                                disabled={loading}
                            />
                            <div className="w-9 h-5 sm:w-11 sm:h-6 bg-gray-300 peer-checked:bg-blue-600 rounded-full transition-colors"></div>
                            <div className="absolute left-0.5 top-0.5 bg-white w-4 h-4 sm:w-5 sm:h-5 rounded-full transition-transform peer-checked:translate-x-4 sm:peer-checked:translate-x-5"></div>
                        </label>
                    </div>
                </div>

                <strong className='text-black p-2 sm:p-4 text-lg sm:text-xl'>Service Options</strong>

                {/* Rental Package Toggles */}
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className={`flex flex-1 items-center justify-between gap-2 p-3 rounded-lg border ${isIntraCityOn ? "border-blue-400" : "border-gray-300"} bg-[linear-gradient(135deg,_#EFF6FF_0%,_#E0E7FF_100%)]`}>
                            <div className="flex items-center gap-2">
                                <Image src="/icons/IntraCity_Icon.svg" alt="IntraCity" width={24} height={24} className={`object-cover rounded-lg transition-all duration-300 ${isIntraCityOn ? "" : "grayscale opacity-60"}`} />
                                <strong className='text-black text-xs sm:text-sm'>IntraCity</strong>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={isIntraCityOn} onChange={handleIntraUpdate} className="sr-only peer" />
                                <div className="w-9 h-5 sm:w-11 sm:h-6 bg-gray-300 peer-checked:bg-blue-600 rounded-full transition-colors"></div>
                                <div className="absolute left-0.5 top-0.5 bg-white w-4 h-4 sm:w-5 sm:h-5 rounded-full transition-transform peer-checked:translate-x-4 sm:peer-checked:translate-x-5"></div>
                            </label>
                        </div>

                        <div className={`flex flex-1 items-center justify-between gap-2 p-3 rounded-lg border ${isLocal ? "border-blue-400" : "border-gray-300"} bg-[linear-gradient(135deg,_#EFF6FF_0%,_#E0E7FF_100%)]`}>
                            <div className="flex items-center gap-2">
                                <Image src="/icons/Local_Service_icon.svg" alt="Local Service" width={24} height={24} className={`object-cover rounded-lg transition-all duration-300 ${isLocal ? "" : "grayscale opacity-60"}`}/>
                                <strong className='text-black text-xs sm:text-sm'>Local Service</strong>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={isLocal} onChange={handleLocalServiceUpdate} className="sr-only peer" />
                                <div className="w-9 h-5 sm:w-11 sm:h-6 bg-gray-300 peer-checked:bg-blue-600 rounded-full transition-colors"></div>
                                <div className="absolute left-0.5 top-0.5 bg-white w-4 h-4 sm:w-5 sm:h-5 rounded-full transition-transform peer-checked:translate-x-4 sm:peer-checked:translate-x-5"></div>
                            </label>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className={`flex flex-1 items-center justify-between gap-2 p-3 rounded-lg border ${isInterCity ? "border-blue-400" : "border-gray-300"} bg-[linear-gradient(135deg,_#EFF6FF_0%,_#E0E7FF_100%)]`}>
                            <div className="flex items-center gap-2">
                                <Image src="/icons/InterCity_Icon.svg" alt="InterCity" width={24} height={24} className={`object-cover rounded-lg transition-all duration-300 ${isInterCity ? "" : "grayscale opacity-60"}`} />
                                <strong className='text-black text-xs sm:text-sm'>InterCity</strong>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={isInterCity} onChange={handleInterCityUpdate} className="sr-only peer" />
                                <div className="w-9 h-5 sm:w-11 sm:h-6 bg-gray-300 peer-checked:bg-blue-600 rounded-full transition-colors"></div>
                                <div className="absolute left-0.5 top-0.5 bg-white w-4 h-4 sm:w-5 sm:h-5 rounded-full transition-transform peer-checked:translate-x-4 sm:peer-checked:translate-x-5"></div>
                            </label>
                        </div>

                        <div className={`flex flex-1 items-center justify-between gap-2 p-3 rounded-lg border ${isIntraState ? "border-blue-400" : "border-gray-300"} bg-[linear-gradient(135deg,_#EFF6FF_0%,_#E0E7FF_100%)]`}>
                            <div className="flex items-center gap-2">
                                <Image src="/icons/InterState_Icon.svg" alt="InterState" width={24} height={24} className={`object-cover rounded-lg transition-all duration-300 ${isIntraState ? "" : "grayscale opacity-60"}`} />
                                <strong className='text-black text-xs sm:text-sm'>InterState</strong>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={isIntraState} onChange={handleInterStateUpdate} className="sr-only peer" />
                                <div className="w-9 h-5 sm:w-11 sm:h-6 bg-gray-300 peer-checked:bg-blue-600 rounded-full transition-colors"></div>
                                <div className="absolute left-0.5 top-0.5 bg-white w-4 h-4 sm:w-5 sm:h-5 rounded-full transition-transform peer-checked:translate-x-4 sm:peer-checked:translate-x-5"></div>
                            </label>
                        </div>
                    </div>
                </div>

                <strong className='text-black p-2 sm:p-4 text-lg sm:text-xl'>Service Range settings</strong>

                {/* Service Range Sliders */}
                <div className='flex flex-col gap-3'>
                    <div className="bg-white border border-gray-300 rounded-lg p-4 w-full">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mb-4">
                            <div className="flex items-center gap-2">
                                <Image src="/icons/IntraCity_Icon.svg" alt="IntraCity" width={20} height={20} className="object-cover rounded-lg" />
                                <strong className="text-black text-sm">Intracity Range (Min)</strong>
                            </div>
                            <div className="bg-gradient-to-r from-cyan-400 to-blue-600 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-md">
                                {intraValue} km
                            </div>
                        </div>

                        <input type="range"
                            min={intraCityRange[0] || 0}
                            max={intraCityRange[1] || 500}
                            value={intraValue || 0}
                            name="intracity-range"
                            onChange={handleIntraCityChange}
                            className="w-full h-2 rounded-full appearance-none cursor-pointer range-slider"
                            style={{
                                background: `linear-gradient(to_right, #3b82f6_${(intraValue / (clusters?.intra_city_max_km || 500)) * 100}%,_#e5e7eb_${(intraValue / (clusters?.intra_city_max_km || 500)) * 100}%)`
                            }}
                        />

                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                            <span>0 km</span>
                            <span className="bg-gray-100 border border-gray-300 text-gray-700 px-2 py-0.5 rounded-md shadow-sm">
                                {intraValue} km
                            </span>
                            <span>{clusters?.intra_city_max_km || 500} km</span>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-300 rounded-lg p-4 w-full">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mb-4">
                            <div className="flex items-center gap-2">
                                <Image
                                    src="/icons/Local_Service_icon.svg"
                                    alt="Local Service Range"
                                    width={20}
                                    height={20}
                                    className="object-cover rounded-lg"
                                />
                                <strong className="text-black text-sm">Local Service Range</strong>
                            </div>
                            <div className="bg-gradient-to-r from-cyan-400 to-blue-600 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-md">
                                {minLocalRange} km – {localServiceRange} km
                            </div>
                        </div>

                        {/* Dual-thumb range */}
                        <div className="relative w-full h-8">
                            {/* local CSS for thumbs + pointer-events trick */}
                            <style>{`
                            /* make the input not catch pointer events except the thumb */
                            .dual-range input[type="range"] {
                                -webkit-appearance: none;
                                appearance: none;
                                background: transparent;
                                pointer-events: none; /* allow only the thumb to receive events */
                            }

                            /* WebKit thumb */
                            .dual-range input[type="range"]::-webkit-slider-thumb {
                                pointer-events: auto; /* enable dragging of the thumb */
                            }

                            /* Firefox thumb */
                            .dual-range input[type="range"]::-moz-range-thumb {
                                pointer-events: auto;
                            }
                            `}</style>

                            {/* Highlighted track (the blue selected range) */}
                            <div className="">
                                <div
                                    className="w-full h-2 rounded-full"
                                    style={{
                                        background: `linear-gradient(to right, #e5e7eb 0%, #e5e7eb ${pct(
                                            minLocalRange
                                        )+1}%, #3b82f6 ${pct(minLocalRange)+1}%, #3b82f6 ${pct(
                                            localServiceRange
                                        )}%, #e5e7eb ${pct(localServiceRange)}%)`,
                                    }}
                                />
                            </div>

                            {/* The two overlaid inputs.
            - pointer-events on inputs are disabled, but thumbs are clickable.
            - active thumb is brought to the top via z-index while dragging. */}
                            <div className="absolute inset-0 flex items-center dual-range">
                                <input
                                    type="range"
                                    min={localRange[0] || 0}
                                    max={localRange[1] || 150}
                                    name="local-min-range"
                                    value={minLocalRange || 0}
                                    onChange={handleMinChange}
                                    onPointerDown={() => setActive("min")}
                                    onPointerUp={() => setActive(null)}
                                    onPointerCancel={() => setActive(null)}
                                    className={`absolute w-full h-8 -top-3 ${active === "min" ? "z-30" : "z-20"}`}
                                />

                                <input
                                    type="range"
                                    min={localRange[0]}
                                    max={localRange[1]}
                                    name="local-max-range"
                                    value={localServiceRange || 0}
                                    onChange={handleMaxChange}
                                    onPointerDown={() => setActive("max")}
                                    onPointerUp={() => setActive(null)}
                                    onPointerCancel={() => setActive(null)}
                                    className={`absolute w-full h-8 -top-3 ${active === "max" ? "z-30" : "z-10"}`}
                                />
                            </div>
                        </div>

                        {/* footer labels */}
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                            <span>{localRange[0]} km</span>
                            <span className="bg-gray-100 border border-gray-300 text-gray-700 px-2 py-0.5 rounded-md shadow-sm">
                                {minLocalRange} km – {localServiceRange} km
                            </span>
                            <span>{localRange[1]} km</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <button onClick={handleSaveClusterConfig} className='flex items-center transition-transform duration-300 hover:scale-105 gap-2 text-white rounded-full w-fit mx-auto my-4 px-4 py-2 bg-[linear-gradient(90deg,_#2563EB_0%,_#4F46E5_50%,_#9333EA_100%)]'>
                <Image src='/icons/clusterlogo.png' alt="ClusterLogo" width={20} height={20} />
                <span className='text-white font-solid text-sm'>Save Cluster Configuration</span>
            </button>
            </>}
            {ride_type === "rental" && <div className="bg-white">
                <div className="flex flex-col">
                    <div className="flex flex-col sm:flex-row gap-3 my-4">
                        <div className={`flex flex-1 items-center justify-between gap-2 px-4 py-3 rounded-lg border border-[#DBEAFE] bg-[background: linear-gradient(90deg,_#EFF6FF_0%,_#EEF2FF_100%)]`}>
                            <div className="flex flex-col">
                                <strong className='text-black text-xs sm:text-sm'>Cluster Management</strong>
                                <h1 className="text-xs sm:text-sm text-[#4B5563]">Enable Cluster Management for {clusters?.city_name}</h1>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`text-xs sm:text-sm ${isOn?"text-[#2563EB]": "text-gray-700"} font-medium`}>
                                    {isOn === true ? "ON" : "OFF"}
                                </span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isOn}
                                        onChange={handleToggleAndUpdate}
                                        className="sr-only peer"
                                        disabled={loading}
                                    />
                                    <div className="w-9 h-5 sm:w-11 sm:h-6 bg-gray-300 peer-checked:bg-blue-600 rounded-full transition-colors"></div>
                                    <div className="absolute left-0.5 top-0.5 bg-white w-4 h-4 sm:w-5 sm:h-5 rounded-full transition-transform peer-checked:translate-x-4 sm:peer-checked:translate-x-5"></div>
                                </label>
                            </div>
                        </div>

                        <div className={`flex flex-1 items-center justify-between gap-2 px-4 py-3 rounded-lg border border-[#DBEAFE] bg-[background: linear-gradient(90deg,#EFF6FF_0%,#EEF2FF_100%)]`}>
                            <div className="flex flex-col">
                                <strong className='text-black text-xs sm:text-sm'>Rental</strong>
                                <h1 className="text-xs sm:text-sm text-[#4B5563]">Enable Rental Management for {clusters?.city_name}</h1>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`text-xs sm:text-sm ${isRental?"text-[#2563EB]": "text-gray-700"} font-medium`}>
                                    {isRental === true ? "ON" : "OFF"}
                                </span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isRental}
                                        onChange={handleRentalToggle}
                                        className="sr-only peer"
                                        disabled={loading}
                                    />
                                    <div className="w-9 h-5 sm:w-11 sm:h-6 bg-gray-300 peer-checked:bg-blue-600 rounded-full transition-colors"></div>
                                    <div className="absolute left-0.5 top-0.5 bg-white w-4 h-4 sm:w-5 sm:h-5 rounded-full transition-transform peer-checked:translate-x-4 sm:peer-checked:translate-x-5"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 items-center px-2 sm:px-4">
                    <div>
                        <Image src={"/icons/rental-car.svg"} alt="rental-car-img" width={24} height={24} className="object-cover rounded-lg transition-all duration-300 " />
                    </div>
                    <strong className='text-black text-lg sm:text-xl'>Choose Your Rental Package</strong>
                </div>
                {packageList?.length? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 bg-white p-3 sm:p-4">
                    {packageList?.length && packageList.map((pkg, index)=> (
                        <div className={`flex flex-col gap-3 justify-center text-[#3A3A3A] p-4 items-center border rounded-lg shadow ${active_package_id === pkg.id? "border-[#3B82F6] gap-2": "border-[#E5E7EB] gap-3"}`} key={index} onClick={()=>handlePackageSelection(pkg)}>
                            <div className={`rounded-full w-[40px] h-[40px] flex justify-between items-center p-2 ${active_package_id === pkg.id? "bg-[linear-gradient(117.87deg,_#4D7AF6_14.23%,_#985DF7_87.05%)]": "bg-[#E5E7EB]"}`}>
                                <Image src={active_package_id===pkg.id?"/icons/white-rental.svg":"/icons/rental-car.svg"} alt="rental-package-car" width={24} height={24} className={`object-cover rounded-lg transition-all duration-300 ${active_package_id === pkg.id ? "": "grayscale opacity-60"}`}/>
                            </div>
                            <div className="text-center w-full">
                                <p className="font-bold text-ellipsis" title={pkg.package_name}> {pkg.package_name}</p>
                                <p className="text-[#1F293799]">{`${pkg.package_km} km/ ${pkg.package_time} hr`}</p>
                            </div>
                            {active_package_id===pkg.id && 
                                <div>
                                    <Image src={"/icons/check2-circle.svg"} alt="" width={24} height={24}/>
                                </div>
                            }
                        </div>
                    ))}
                    <div className={`flex flex-col gap-3 justify-center text-[#3A3A3A] text-base p-4 items-center border rounded-lg shadow ${active_package_id ===  "hourly-pkg"? "border-dashed border-[#A855F7]" : "border-[#E5E7EB]"}`} onClick={() => handlePackageSelection({id: "hourly-pkg"})}>
                        <div className={`rounded-full w-[40px] h-[40px] flex justify-between items-center p-2 ${active_package_id === "hourly-pkg" ? "bg-[linear-gradient(139.73deg,_#B552E5_16.83%,_#E04BAA_83.79%)]" : "bg-[#E5E7EB]"}`}>
                            <Image src={"/icons/plus.svg"} alt="rental-package-car" width={24} height={24} className={`object-cover rounded-lg transition-all duration-300 ${active_package_id === "hourly-pkg" ? "" : "grayscale opacity-60"}`} />
                        </div>
                        <div className="text-center">
                            <p className="font-bold"> {"Hourly Package"}</p>
                            <p className="text-[#1F293799]">{"X km/ X hr"}</p>
                        </div>
                    </div>

                    <div className={`flex flex-col gap-3 justify-center text-[#3A3A3A] text-base p-4 items-center border rounded-lg shadow ${active_package_id ===  "daily-pkg"? "border-dashed border-[#A855F7]" : "border-[#E5E7EB]"}`} onClick={() => handlePackageSelection({id: "daily-pkg"})}>
                        <div className={`rounded-full w-[40px] h-[40px] flex justify-between items-center p-2 ${active_package_id === "daily-pkg" ? "bg-[linear-gradient(139.73deg,_#B552E5_16.83%,_#E04BAA_83.79%)]" : "bg-[#E5E7EB]"}`}>
                            <Image src={"/icons/plus.svg"} alt="rental-package-car" width={24} height={24} className={`object-cover rounded-lg transition-all duration-300 ${active_package_id === "daily-pkg" ? "" : "grayscale opacity-60"}`} />
                        </div>
                        <div className="text-center w-full">
                            <p className="font-bold text-ellipsis w-full" title={"Daily Package"}> {"Daily Package"}</p>
                            <p className="text-[#1F293799]">{"X km/ X hr"}</p>
                        </div>
                    </div>
                </div>:
                <div className="w-full text-center text-gray-500 flex justify-center items-center">
                    {`No Rental Package available for city ${clusters?.city_name}`}
                </div>}
                {packagePriceList && packagePriceList.length> 0?<div className="flex gap-2 items-center px-2 sm:px-4">
                    <div>
                        <Image src={"/icons/rental-car.svg"} alt="rental-car-img" width={24} height={24} className="object-cover rounded-lg transition-all duration-300 " />
                    </div>
                    <strong className='text-black text-lg sm:text-xl'>Select Your Vehicle</strong>
                </div>: <div className="flex gap-2 items-center px-2 sm:px-4">No data available</div>}
                <div className="flex gap-2 lg:flex-row sm:flex-col sm:gap-4 p-4">
                    {packagePriceList.map((cab, index)=>(
                        <div key={cab.cab_type_id} className={`p-4 flex flex-col gap-4 rounded-lg shadow border ${selectedPackageCab == cab.cab_type_id? "border-[#3B82F6] gap-2": "border-[#E5E7EB] gap-3"}`}>
                            <div className="flex justify-between gap-8 sm:flex-col lg:flex-row items-center">
                                <div className="flex justify-between gap-2 sm:flex-col lg:flex-row items-center">
                                    <div>
                                        <Image src={"/icons/rental-mini.svg"} alt="" width={100} height={100}/>
                                    </div>
                                    <p className="capitalize text-[#111827] font-bold">{Object.keys(vehicleEnum).find(k=> vehicleEnum[k]=== cab.cab_type_id)}</p>
                                </div>
                                {selectedPackageCab == cab.cab_type_id ? 
                                    (isEditingCab? <div onClick={()=>handleConfirmCabEdit(cab)}>
                                        <Image src={"/icons/check2-circle.svg"} alt="" width={24} height={24}/>
                                    </div>:
                                    <div onClick={()=>handlePackageCabPriceEdit(cab)}>
                                        <CiEdit className="text-[blue] cursor-pointer text-sm sm:text-base" />
                                    </div>):
                                <div className="w-5">&nbsp;</div>}
                            </div>
                            <div className={`flex flex-col ${isEditingCab && selectedPackageCab == cab.cab_type_id ?"gap-2":"gap-4"} px-4`}>
                                <div className="flex justify-between items-center rounded-lg gap-3 bg-white text-[#1F2937] font-bold">
                                    <div className=" flex gap-2">
                                        <div>
                                            <Image src={"/icons/currency-green.svg"} alt="" width={20} height={20} />
                                        </div>
                                        <span>{"Base Price"}:</span>
                                    </div>
                                    {isEditingCab && selectedPackageCab == cab.cab_type_id ? (
                                        <input
                                            type="number"
                                            value={editingCabData?.Base_price || ""}
                                            onChange={(e) => setEditingCab(prev => ({ ...prev, "Base_price": Number(e.target.value) }))}
                                            className="w-16 border border-gray-300 rounded px-1 py-0.5 text-right bg-white focus:outline-none"
                                        />
                                    ) : (
                                        <p>{editingCabData?.Base_price && editingCabData?.cab_type_id === cab.cab_type_id? editingCabData?.Base_price: cab.Base_price}</p>
                                    )}
                                </div>

                                <div className="flex justify-between items-center rounded-lg gap-3 bg-white text-[#4B5563]">
                                    <div className="">
                                        <span>{"Extra Distance Charge"}:</span>
                                    </div>
                                    {isEditingCab && selectedPackageCab == cab.cab_type_id ?(
                                            <input
                                                type="number"
                                                value={editingCabData?.extra_per_km || ""}
                                                onChange={(e) => setEditingCab(prev => ({ ...prev, "extra_per_km": Number(e.target.value) }))}
                                                className="w-16 border border-gray-300 rounded px-1 py-0.5 text-right bg-white focus:outline-none"
                                            />
                                        ) : (
                                        <p>₹{editingCabData?.extra_per_km  && editingCabData?.cab_type_id === cab.cab_type_id? editingCabData?.extra_per_km: cab.extra_per_km}/km</p>
                                    )}
                                </div>

                                <div className="flex justify-between items-center rounded-lg gap-3 bg-white text-[#4B5563]">
                                    <div className="">
                                        <span>{"Extra Time Charge"}:</span>
                                    </div>
                                    {isEditingCab && selectedPackageCab == cab.cab_type_id ?(
                                            <input
                                                type="number"
                                                value={editingCabData?.extra_time_per_hr || ""}
                                                onChange={(e) => setEditingCab(prev => ({ ...prev, "extra_time_per_hr": Number(e.target.value) }))}
                                                className="w-16 border border-gray-300 rounded px-1 py-0.5 text-right bg-white focus:outline-none"
                                            />
                                        ) : (
                                        <p>₹{editingCabData?.extra_time_per_hr  && editingCabData?.cab_type_id === cab.cab_type_id? editingCabData?.extra_time_per_hr: cab.extra_time_per_hr}/min</p>
                                    )}
                                </div>
                            </div>
                            <div  onClick={()=>selectedPackageCab == cab.cab_type_id || handlePackageVehicleSelection(cab)}  className={`text-center p-2 transition-transform rounded-lg duration-300 hover:scale-105 w-full ${selectedPackageCab == cab.cab_type_id?"bg-[linear-gradient(90deg,_#2563EB_0%,_#9333EA_100%)] text-white": "border border-[#E5E7EB] text-[#020817]"}`}>
                                {selectedPackageCab == cab.cab_type_id? "Selected": "Select Vehicle"}
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={handleSaveRentalCofig} className={`flex items-center transition-transform duration-300 hover:scale-105 gap-2 text-white rounded-lg w-fit mx-auto my-4 px-4 py-2 bg-[linear-gradient(90deg,_#2563EB_0%,_#4F46E5_50%,_#9333EA_100%)]`}>
                    <span className='text-white font-solid text-sm'>Continue Rental Selection</span>
                    <HiArrowSmRight className="text-[white] cursor-pointer text-sm sm:text-base" />
                </button>
            </div>}

            {/* Fare Details Section */}
            <div className='flex flex-col gap-6 my-4'>
                <div className='flex items-center gap-2 bg-[linear-gradient(90deg,_#4F46E51A_0%,_#9333EA1A_50%,_#DB27771A_100%)] rounded-md p-4'>
                    <div className='bg-[linear-gradient(90deg,_#4F46E5_0%,_#9333EA_100%)] rounded-lg flex items-center justify-center p-2'>
                        <IoIosTrendingUp className='text-white text-lg sm:text-[18px] font-bold' />
                    </div>
                    <div className='flex flex-col items-start'>
                        <strong className="text-transparent text-xl sm:text-3xl font-bold bg-clip-text bg-[linear-gradient(90deg,#111827_0%,#3730A3_50%,#6B21A8_100%)]">
                            Fare Details
                        </strong>
                        <span className='text-[#4B5563] text-xs sm:text-sm'>Configure base fares and per km rates for different vehicle types</span>
                    </div>
                </div>

                {/* Vehicle Type Sections - Mini, Sedan, SUV */}
                {vehicleTypes.map((vehicle, index) => (
                    <div key={index} className="flex flex-col rounded-xl shadow-lg overflow-hidden">
                        <div className={`flex flex-col sm:flex-row justify-between items-center ${vehicle.gradient} px-4 sm:px-6 py-4`}>
                            <div className="flex items-center gap-3">
                                <div className="bg-white/20 rounded-lg p-2">
                                    {vehicle.icon}
                                </div>
                                <div className="flex flex-col leading-tight">
                                    <span className="text-white font-bold text-lg sm:text-xl">{vehicle.type}</span>
                                    <span className="text-white text-xs sm:text-sm">Premium vehicle category</span>
                                </div>
                            </div>
                            <div className="bg-white/20 border border-white/30 px-3 sm:px-4 py-1 rounded-full text-white font-medium text-xs sm:text-sm mt-2 sm:mt-0">
                                4 Services
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 bg-white p-3 sm:p-4">
                            {serviceTypes.map((service, serviceIndex) => {
                                const serviceKey = `${vehicle.type}-${service.name}`;
                                const isEditing = editingService === serviceKey;
                                const serviceData = getServiceData(service.name, getVehicleDetails(vehicle.type));
                                const currentValues = editedValues[serviceKey] || serviceData;
                                return (
                                !loading || !isEditing?
                                    <div key={serviceIndex} className="overflow-visible rounded-lg shadow border border-gray-100">
                                        <div className={`flex justify-between items-center p-4 ${service.gradient} rounded-t-lg`}>
                                            <div className="flex items-center gap-2">
                                                <Image src={service.icon} alt={service.name} width={20} height={20} />
                                                <span className="text-white font-semibold text-xs sm:text-sm">{service.name}</span>
                                            </div>
                                            {isEditing ? (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleSaveClick(vehicle.type, service.name, service.key)}
                                                        className="text-white text-sm bg-green-500 rounded p-1"
                                                    >
                                                        ✓
                                                    </button>
                                                    <button
                                                        onClick={handleCancelClick}
                                                        className="text-white text-sm bg-red-500 rounded p-1"
                                                    >
                                                        ✗
                                                    </button>
                                                </div>
                                            ) : isOn ? (
                                                <button
                                                    onClick={() => handleEditClick(vehicle.type, service.name)}
                                                    className='transition-transform duration-300 hover:scale-105'
                                                >
                                                    <CiEdit className="text-white cursor-pointer text-sm sm:text-base" />
                                                </button>
                                            ): null}
                                        </div>

                                        <div className="relative flex flex-col gap-2 bg-gradient-to-b from-gray-50 to-white px-3 py-3 text-xs sm:text-sm text-gray-800">
                                            {service.fields.map((field, fieldIndex) => (
                                                <div key={fieldIndex} className="flex justify-between items-center rounded-lg gap-1 p-2 bg-white">
                                                    <div className="flex items-center gap-1">
                                                        {field.icon}
                                                        <span>{field.label}:</span>
                                                    </div>
                                                    {isEditing ? (
                                                        <input
                                                            type="number"
                                                            value={currentValues[field.value]}
                                                            onChange={(e) => handleInputChange(field.value, e.target.value, vehicle.type, service.name)}
                                                            className="w-16 border border-gray-300 rounded px-1 py-0.5 text-right bg-white focus:outline-none"
                                                        />
                                                    ) : (
                                                        <strong>₹{currentValues[field.value]}</strong>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                :
                                <div key={serviceIndex} className="rounded-lg shadow border border-gray-500">
                                    <div className="top-1 flex flex-col gap-2 p-3">
                                        <div className="h-5 bg-gray-300 top-1 ml-20 w-3/4 rounded animate-pulse mb-2"></div>
                                        <div className="h-4 bg-gray-300 top-1 ml-20 w-3/4 rounded animate-pulse mb-1"></div>
                                        <div className="h-4 bg-gray-300 top-1 ml-20 w-3/4 rounded animate-pulse mb-1"></div>
                                        <div className="h-4 bg-gray-300 top-1 ml-20 w-3/4 rounded animate-pulse"></div>
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Final Save Button */}
            <div className='flex justify-center'>
                <button className='flex items-center transition-transform duration-300 hover:scale-105 gap-2 text-white rounded-full justify-center bg-[linear-gradient(90deg,_#2563EB_0%,_#4F46E5_50%,_#9333EA_100%)] p-2 px-4'>
                    <Image src='/icons/clusterlogo.png' alt="ClusterLogo" width={16} height={16} />
                    <span className='text-white font-solid text-xs sm:text-sm'>Save Cluster Configuration</span>
                    <IoMdTrendingUp className="text-white cursor-pointer text-sm" />
                </button>
            </div>

            <ClusterModal
                type={modalType}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>: <></>
    )
}

export default CityDetails