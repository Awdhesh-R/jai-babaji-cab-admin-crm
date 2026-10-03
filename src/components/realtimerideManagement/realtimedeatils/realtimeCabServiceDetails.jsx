"use client";
import { apiClient } from "@/app/lib/apiClient";
import CommonModal from "@/components/common/CommonModal";
import StarRating from "@/components/common/StarRating";
import { getCabType } from "@/helpers/utils";
import {
  arrivedCab,
  assignCab,
  collectCash,
  endTrip,
  probableCab,
  startTrip,
} from "@/services/rideManagement";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import debounce from "lodash.debounce";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { LuShield } from "react-icons/lu";
import { toast } from "react-toastify";
// import PublishModal from "./publishModal";
import PublishModal from "./realtimepublishModal";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchCabModelList,
  fetchCabTypeList,
} from "@/redux/features/rbCabMainSlice";
import { Loader } from "lucide-react";

// const searchOperatorCab = (registration_no) => {
//   return apiClient(
//     "GET",
//     `/fleet/search-operator?registration_no=${registration_no}`
//   );
// };

// const updateOrCreateDriver = (payload) => {
//   return apiClient("POST", "/fleet/update-create-driver", payload);
// };

// const createCabDriverOwner = (payload) => {
//   return apiClient("POST", "/fleet/create-operator-cab-driver", payload);
// };

const CabServiceDetails = ({
  cabServiceData,
  setCabServiceData,
  rideDetails,
  setCheckUpdate,
}) => {
  const [searchData, setSearchData] = useState([]);
  const [showCabList, setShowCabList] = useState(false);
  const [changeReason, setChangeReason] = useState("");
  const [startTripPopUp, setStartTripPopUp] = useState(false);
  const [endTripPopUp, setEndTripPopUp] = useState(false);
  const [cashCollectPopUp, setCashCollectPopup] = useState(false);
  const [tripKm, setTripKm] = useState(0);
  const [discount, setDiscount] = useState(
    rideDetails?.price_details_json?.discount || 0,
  );
  const [discountUpdated, setUpdatedDiscount] = useState(false);
  const wrapperRef = useRef(null);
  const DriverData = cabServiceData?.driverDetails;
  const [updateModal, setUpdateModal] = useState(false);
  const [savingOneTime, setSavingOneTime] = useState(false);

  const CabData = cabServiceData?.cabDetails;
  const isProbabled = !!rideDetails?.is_probabal;
  const cabImages = {
    mini: process.env.NEXT_PUBLIC_MINI || '/images/2.png',
    sedan: process.env.NEXT_PUBLIC_SEDAN || '/images/3.png',
    suv: process.env.NEXT_PUBLIC_SUV || '/images/1.png',
  };

  const searchOperatorCab = (registration_no) => {
    return apiClient(
      "POST",
      "/one_time_cabs/searchOneTimeCab/",
      { searchTerm: registration_no }
    );
  };

  const updateOrCreateDriver = (payload) => {
    return apiClient("POST", "/fleet/update-create-driver", payload);
  };

  const createCabDriverOwner = (payload) => {
    return apiClient("POST", "/one_time_cabs/addOneTimeCabs/", payload);
  };
  const [oneTimeOpen, setOneTimeOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const dispatch = useDispatch();

  const { cabModels, cabTypes } = useSelector((state) => state.rbCabMain);

  const [oneTimeData, setOneTimeData] = useState({
    cab_id: "",
    dl: "",
    rc: "",
    driver_name: "",
    driver_mobile: "",
    driver_whatsapp: "",
    cab_model: "",
    cab_type: "",
    private_value: "",
    owner_name: "",
    owner_mobile: "",
    status: "active",
  });

  const resetOneTimeForm = () => {
    setOneTimeData({
      cab_id: "",
      dl: "",
      rc: "",
      driver_name: "",
      driver_mobile: "",
      driver_whatsapp: "",
      cab_model: "",
      cab_type: "",
      private_value: "",
      owner_name: "",
      owner_mobile: "",
      status: "active",
    });

    setErrors({});
  };

  const [errors, setErrors] = useState({});

  const validateOneTimeOperator = () => {
    const newErrors = {};

    if (!oneTimeData.rc) newErrors.rc = "RC is required";
    if (!oneTimeData.driver_name)
      newErrors.driver_name = "Driver name is required";
    if (!oneTimeData.driver_mobile)
      newErrors.driver_mobile = "Driver mobile is required";
    if (!oneTimeData.driver_whatsapp)
      newErrors.driver_whatsapp = "Driver WhatsApp is required";
    if (!oneTimeData.cab_model) newErrors.cab_model = "Cab model is required";
    if (!oneTimeData.cab_type) newErrors.cab_type = "Cab type is required";

    // if (!oneTimeData.private_value)
    //   newErrors.private_value = "Select private value";
    // if (!oneTimeData.owner_name)
    //   newErrors.owner_name = "Owner name is required";
    // if (!oneTimeData.owner_mobile)
    //   newErrors.owner_mobile = "Owner mobile is required";

    if (oneTimeData.driver_mobile && oneTimeData.driver_mobile.length !== 10)
      newErrors.driver_mobile = "Must be 10 digits";

    if (oneTimeData.owner_mobile && oneTimeData.owner_mobile.length !== 10)
      newErrors.owner_mobile = "Must be 10 digits";

    if (
      oneTimeData.driver_whatsapp &&
      oneTimeData.driver_whatsapp.length !== 10
    )
      newErrors.driver_whatsapp = "Must be 10 digits";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRevertToConfirm = async () => {
    try {
      const response = await apiClient("POST", `/ride_management/addRemark`, {
        urid: rideDetails?.urid,
        status: "confirmed",
        remark: "Reverted back by Admin",
      });
      if (response.status || response.success) {
        toast.success(response.message);
        setCheckUpdate((prev) => !prev);
      } else {
        toast.error(response.message);
      }
    } catch (e) {
      toast.error(e?.response?.error?.message || "Something went wrong");
    } finally {
      // setShowActionModal(false);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowCabList(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchCabs = async (input) => {
    if (!input.trim() || input.trim().length <= 3) return;
    const payData = { searchTerm: input.trim() };
    try {
      const response = await apiClient(
        "POST",
        "/rb_cabs/rbCabsSearch",
        payData,
        true,
      );
      if (!response?.success)
        throw new Error(response?.message || "Failed to fetch");
      const results = response?.data || [];
      setSearchData(results);
      setShowCabList(true);
    } catch (err) {
      // console.error("Error fetching autocomplete suggestions:", err.message);
    }
  };

  const searchCabs = React.useMemo(() => debounce(fetchCabs, 200), []);

  useEffect(() => {
    return () => {
      searchCabs.cancel();
    };
  }, [searchCabs]);

  const handleInputChange = (e) => {
    const value = e.target.value;

    setCabServiceData((prev) => ({
      ...prev,
      cabDetails: {
        ...prev.cabDetails,
        cab_reg: value,
      },
    }));

    if (!value.trim()) {
      setShowCabList(false);
      setSearchData([]);
    } else {
      searchCabs(value.toUpperCase());
    }
  };

  const handleCabClick = (cab) => {
    if (cab?.source && cab?.source === "Operator") {
      setModalOpen(true);
    }
    setCabServiceData((prev) => ({
      ...prev,
      cabDetails: {
        ...prev.cabDetails,
        cab_id: cab?.id,
        cab_reg: cab?.cab_reg ?? "",
        cab_type: getCabType(cab?.cab_type),
        cab_model: cab?.cab_model ?? "",
        cab_source: cab?.source ?? cab?.cab_source ?? "",
      },
      driverDetails: {
        ...prev.driverDetails,
        driver_id: cab?.driver?.id ?? cab?.driver?.driver_id ?? cab?.driver_id ?? "",
        driver_name: cab?.driver?.full_name ?? cab?.driver?.driver_name ?? cab?.driver_name ?? cab?.drv_name ?? "",
        driver_image: cab?.driver?.profile_pic ?? cab?.driver?.driver_image ?? cab?.driver_image ?? "",
        driver_mobile: cab?.driver?.mobile_no ?? cab?.driver?.driver_mobile ?? cab?.driver_mobile ?? "",
        driver_rating: cab?.driver?.avg_rating ?? cab?.driver_rating ?? 0,
      },
    }));
    setShowCabList(false);
  };

  const handleProbableCab = async () => {
    try {
      const response = await probableCab(
        CabData,
        DriverData,
        rideDetails,
        changeReason,
        isProbabled,
      );

      if (response?.success) {
        toast.success("Cab Probable successful!");
        setCheckUpdate((prev) => !prev);
        setUpdateModal(false);
        setChangeReason(false);
      } else {
        toast.error(response?.message || "Failed to mark cab as probable");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleFindCab = () => {
    window.open(`/rbFleetManagement/FindCabs/${rideDetails?.urid}`, "_blank");
  };

  const handleAssignCab = async () => {
    try {
      const response = await assignCab(
        CabData,
        DriverData,
        rideDetails,
        changeReason,
      );

      if (response?.success) {
        toast.success("Cab assigned successfully!");
        setCheckUpdate((prev) => !prev);
      } else {
        toast.error(response?.message || "Failed to assign cab");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleArrivedCab = async () => {
    try {
      const response = await arrivedCab(rideDetails?.urid);

      if (response?.success) {
        toast.success("Cab Arrived successfully!");
        setCheckUpdate((prev) => !prev);
      } else {
        toast.error(response?.message || "Cab Arrived failed");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleStartTrip = async () => {
    try {
      const response = await startTrip(rideDetails?.urid, tripKm);
      if (response?.success) {
        toast.success("Trip started successfully!");
        setCheckUpdate((prev) => !prev);
        setStartTripPopUp(false);
      } else {
        toast.error(response?.message || "Failed to start trip");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEndTrip = async () => {
    try {
      const response = await endTrip(
        rideDetails?.urid,
        tripKm,
        cabServiceData?.cabDetails?.cab_source,
      );
      if (response?.success) {
        toast.success("Trip ended successfully!");
        setCheckUpdate((prev) => !prev);
        setEndTripPopUp(false);
      } else {
        toast.error(response?.message || "Failed to end trip");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCashCollect = async () => {
    if (!rideDetails?.urid) return;
    try {
      const response = await collectCash(
        rideDetails.urid,
        cabServiceData?.cabDetails?.cab_source,
      );
      if (response?.success) {
        toast.success("Cash collected successfully!");
        setCheckUpdate((prev) => !prev);
        setCashCollectPopup(false);
      } else {
        toast.error(response?.message || "Failed to collect cash");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleUpdateFare = async () => {
    try {
      const payData = {
        price_details_json: {
          ...rideDetails?.price_details_json,
          discount: discount,
          collected_by_driver:
            parseFloat(rideDetails?.price_details_json?.final_fare || 0) -
            parseFloat(rideDetails?.price_details_json?.advance_amount || 0) -
            discount,
          final_fare:
            parseFloat(rideDetails?.price_details_json?.final_fare) -
            ((discount || 0) -
              (parseFloat(rideDetails?.price_details_json?.discount) || 0)),
        },
      };
      const response = await apiClient(
        "PUT",
        `/ride_management/updateRideDetails/${rideDetails?.urid}`,
        JSON.stringify(payData),
      );
      if (response.status || response.success) {
        toast.success(response.success);
        setCheckUpdate((prev) => !prev);
        setCashCollectPopup(true);
      } else {
        toast.error(response.message);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setUpdatedDiscount(false);
    }
  };

  const statusActions = {
    confirmed: handleAssignCab,
    assigned: handleArrivedCab,
    arrived: () =>
      // CabData?.cab_source === "rodYaan"
      //   ? handleStartTrip()
      //   : 
        setStartTripPopUp(true),
    started: () =>
      // CabData?.cab_source === "rodYaan"
      //   ? handleEndTrip()
      //   : 
        setEndTripPopUp(true),
    completed: () => setCashCollectPopup(true),
  };

  const statusLabels = {
    confirmed: "Assign Cab",
    assigned: "Arrived",
    arrived: "Trip Start",
    started: "Trip End",
    completed: "Cash Collected",
  };

  const handleRideClick = () => {
    if (rideDetails?.is_collected) return;

    const action = statusActions[rideDetails?.status];
    if (action) action();
  };

  // const handleSaveOneTimeOperator = async () => {
  //   debouncedRCSearch.cancel();

  //   const isValid = validateOneTimeOperator();
  //   if (!isValid) return;

  //   try {
  const handleSaveOneTimeOperator = async () => {
    debouncedRCSearch.cancel();

    const isValid = validateOneTimeOperator();
    if (!isValid) return;

    setSavingOneTime(true); // 👈 loader ON

    try {
      // 1️⃣ SEARCH CAB
      const apiRes = await searchOperatorCab(oneTimeData.rc);
      const searchRes = apiRes?.data;

      const { cab_exists, driver_exists } = searchRes || {};

      // const searchRes = await searchOperatorCab(oneTimeData.rc);

      // const { cab_exists, driver_exists } = searchRes || {};

      // 2️⃣ CASE: CAB EXISTS (driver ho ya na ho)
      if (cab_exists) {
        // const payload = {
        //   registration_no: oneTimeData.rc,
        //   driver: {
        //     full_name: oneTimeData.driver_name,
        //     mobile_no: oneTimeData.driver_mobile,
        //   },
        // };

        const selectedCabModelName =
          cabModels?.find((c) => c.id === oneTimeData.cab_model)?.make_model ||
          "";

        const selectedCabTypeName =
          cabTypes?.find((c) => c.id === oneTimeData.cab_type)?.cab_type || "";

        const payload = {
          dl: oneTimeData.dl || "NA",
          rc: oneTimeData.rc,
          driver_mobile: oneTimeData.driver_mobile,
          driver_name: oneTimeData.driver_name,
          driver_whatsapp: oneTimeData.driver_whatsapp,
          cab_model: oneTimeData.cab_model,
          private_value: oneTimeData.private_value || "Yes",
          owner_name: oneTimeData.owner_name || "NA",
          owner_mobile: oneTimeData.owner_mobile || "0000000000",
          status: oneTimeData.status || "active"
        };

        const res = await updateOrCreateDriver(payload);

        // if (res?.success || res?.status) {
        //   toast.success("Driver updated / assigned successfully");
        //   setOneTimeOpen(false);
        //   return;
        // }
        if (res?.success || res?.status) {
          toast.success("Driver updated / assigned successfully");
          resetOneTimeForm(); // ✅ ADD
          setOneTimeOpen(false);
          window.location.reload();
          return;
        } else {
          toast.error(res?.message || "Failed to update driver");
          return;
        }
      }

      if (!cab_exists) {
        // const payload = {
        //   cab: {
        //     registration_no: oneTimeData.rc,
        //     cab_type: Number(oneTimeData.cab_type),
        //     cab_model: Number(oneTimeData.cab_model),
        //     fuel_type: 1,
        //   },
        //   driver: {
        //     full_name: oneTimeData.driver_name,
        //     mobile_no: oneTimeData.driver_mobile,
        //   },
        //   owner: {
        //     full_name: oneTimeData.owner_name,
        //     mobile_no: oneTimeData.owner_mobile,
        //   },
        // };

        // const payload = {
        //   cab: {
        //     registration_no: oneTimeData.rc,
        //     cab_type: Number(oneTimeData.cab_type),
        //     cab_model: Number(oneTimeData.cab_model),
        //     fuel_type: 2,
        //   },
        //   driver: {
        //     full_name: oneTimeData.driver_name,
        //     mobile_no: oneTimeData.driver_mobile,
        //   },
        //   owner: {
        //     full_name: oneTimeData.owner_name,
        //     mobile_no: oneTimeData.owner_mobile,
        //   },
        // };

        const selectedCabModelName =
          cabModels?.find((c) => c.id === oneTimeData.cab_model)?.make_model ||
          "";

        const selectedCabTypeName =
          cabTypes?.find((c) => c.id === oneTimeData.cab_type)?.cab_type || "";

        const payload = {
          dl: oneTimeData.dl || "NA",
          rc: oneTimeData.rc,
          driver_mobile: oneTimeData.driver_mobile,
          driver_name: oneTimeData.driver_name,
          driver_whatsapp: oneTimeData.driver_whatsapp,
          cab_model: String(oneTimeData.cab_model),
          private_value: oneTimeData.private_value || "Yes",
          owner_name: oneTimeData.owner_name || "NA",
          owner_mobile: oneTimeData.owner_mobile || "0000000000",
          status: oneTimeData.status || "active"
        };

        const res = await createCabDriverOwner(payload);

        // if (res?.success) {
        //   toast.success("One-time operator created successfully");
        //   setOneTimeOpen(false);
        //   return;
        // }
        if (res?.success) {
          toast.success("One-time operator created successfully");
          resetOneTimeForm();
          setOneTimeOpen(false);
          window.location.reload();
          return;
        } else {
          toast.error(res?.message || "Failed to create operator");
          return;
        }
      }
      // } catch (error) {
      //   toast.error(error?.response?.message || "Something went wrong");
      // }
    } catch (e) {
      toast.error("Something went wrong");
    } finally {
      setSavingOneTime(false); // 👈 loader OFF
    }
  };

  const searchAndAutofillByRC = async (rc) => {
    if (!rc || rc.length < 8) return;

    try {
      const apiRes = await apiClient(
        "GET",
        `/fleet/search-operator?registration_no=${rc}`,
      );

      const res = apiRes?.data;

      if (!res?.cab_exists) return;

      // setOneTimeData((prev) => ({
      //   ...prev,

      //   driver_name: res?.driver_details?.full_name || "",
      //   driver_mobile: res?.driver_details?.mobile_no || "",
      //   driver_whatsapp: res?.driver_details?.mobile_no || "",

      //   cab_model: res?.cab_details?.cab_model || "",
      //   cab_type: res?.cab_details?.cab_type || "",

      //   owner_name: res?.driver_details?.full_name || "",
      //   owner_mobile: res?.driver_details?.mobile_no || "",
      // }));

      setOneTimeData((prev) => ({
        ...prev,
        driver_name: res?.driver_details?.full_name || "",
        driver_mobile: res?.driver_details?.mobile_no || "",
        driver_whatsapp: res?.driver_details?.mobile_no || "",

        cab_model: Number(res?.cab_details?.cab_model) || "",
        cab_type: Number(res?.cab_details?.cab_type) || "",

        owner_name: res?.owner_details?.full_name || "",
        owner_mobile: res?.owner_details?.mobile_no || "",
      }));

      toast.info("Existing cab data auto-filled");
    } catch (e) {
      console.log("RC search failed", e);
    }
  };

  const debouncedRCSearch = React.useMemo(
    () => debounce(searchAndAutofillByRC, 500),
    [],
  );

  useEffect(() => {
    return () => {
      debouncedRCSearch.cancel();
    };
  }, [debouncedRCSearch]);

  useEffect(() => {
    dispatch(fetchCabModelList());
    dispatch(fetchCabTypeList());
  }, [dispatch]);

  const [vehicleInfo, setVehicleInfo] = useState({
    cabTypeName: "",
    cabModelName: "",
  });

  useEffect(() => {
    if (!CabData || !cabModels.length || !cabTypes.length) return;
    // 👆 ye line IMPORTANT hai

    let cabModelName = "";
    if (CabData.cab_model && !isNaN(CabData.cab_model)) {
      cabModelName =
        cabModels.find((c) => c.id === Number(CabData.cab_model))?.make_model || "";
    } else {
      cabModelName = CabData.cab_model || "";
    }

    let cabTypeName = "";
    if (CabData.cab_type && !isNaN(CabData.cab_type)) {
      cabTypeName =
        cabTypes.find((c) => c.id === Number(CabData.cab_type))?.cab_type || "";
    } else {
      cabTypeName = CabData.cab_type || "";
    }

    setVehicleInfo({ cabModelName, cabTypeName });
  }, [CabData, cabModels, cabTypes]);
  

  const safeImage = (img) => {
  if (!img) return "/images/driverplaceholderimg.png";
  if (img.startsWith("http")) return img;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001/";
  const base = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const path = img.startsWith("/") ? img : `/${img}`;
  return `${base}${path}`;
};


  return (
    <>
      <div className="w-full bg-white rounded-xl">
        <div className="rounded-t-xl bg-gradient-to-r from-[#3B82F6] to-[#6366F1] text-white p-4 flex items-center gap-3 text-lg font-semibold">
          <div className="bg-white/20 p-2 rounded-md">
            <LuShield className="text-2xl text-white" />
          </div>
          Cab Service Details
        </div>

        <div className="flex flex-col gap-6 mt-2 p-4">
          <div className="w-full flex items-center gap-6">
            <div
              ref={wrapperRef}
              className=" relative flex-1 flex items-center gap-4"
            >
              {rideDetails?.status.toLowerCase() !== "completed" &&
                rideDetails?.status.toLowerCase() !== "cancelled" && (
                  <div className="relative flex-1">
                    <input
                      type="text"
                      readOnly={rideDetails?.status === "completed"}
                      value={CabData?.cab_reg || ""}
                      onChange={handleInputChange}
                      placeholder={CabData?.cab_reg || "Enter Cab Number"}
                      className="w-full border border-gray-300 dark:border-slate-600 px-4 py-2 pr-[80px] text-sm rounded-md bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        isProbabled
                          ? setUpdateModal(true)
                          : handleProbableCab();
                      }}
                      disabled={rideDetails?.status === "completed"}
                      className={`absolute right-1 top-1/2 -translate-y-1/2 ${
                        rideDetails?.status !== "completed"
                          ? "bg-green-600"
                          : "bg-[#313233] cursor-not-allowed"
                      } text-white text-xs font-semibold px-3 py-[7px] rounded-md`}
                    >
                      {isProbabled ? "Update Cab" : "Probable"}
                    </button>
                  </div>
                )}
              {showCabList && searchData.length > 0 && (
                <ul className="mt-2 max-h-60 overflow-y-auto bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-md shadow-lg z-10">
                  {searchData.map((cab, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 hover:bg-blue-100 dark:hover:bg-slate-700 cursor-pointer"
                      onClick={() => handleCabClick(cab)}
                    >
                      {cab?.cab_reg} {getCabType(cab?.cab_type)} {cab?.source}
                    </li>
                  ))}
                </ul>
              )}
              {rideDetails?.status.toLowerCase() !== "completed" &&
                rideDetails?.status.toLowerCase() !== "cancelled" && (
                  // <div className='relative '>
                  <div className="flex items-center gap-2 flex-row">
                    <button
                      type="button"
                      // onClick={() => setOneTimeOpen(true)}
                      onClick={() => {
                        resetOneTimeForm();
                        setOneTimeOpen(true);
                      }}
                      className="bg-purple-600 text-white text-xs font-semibold p-2.5 gap-5 px-4 rounded-md"
                    >
                      One-Time Operator
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleFindCab();
                      }}
                      disabled={rideDetails?.status === "completed"}
                      className={`bg-gradient-to-r from-blue-600 to-sky-800 text-white text-xs font-semibold p-2.5 shadow-xl hover:scale-[1.01] px-4 rounded-md`}
                    >
                      {"Find Cab"}
                    </button>
                  </div>
                )}
            </div>

            <div className="flex-1 flex items-center gap-4 justify-between">
              <button
                disabled={rideDetails?.is_collected}
                onClick={handleRideClick}
                className={`w-full text-black border border-gray-400 hover:opacity-90 transition-all shadow-md rounded-md px-4 py-2 ${
                  rideDetails?.is_collected
                    ? "opacity-60 cursor-not-allowed"
                    : ""
                }`}
              >
                <div className="flex items-center justify-center gap-2 text-sm font-medium">
                  <span>
                    {rideDetails?.is_collected
                      ? "Completed"
                      : statusLabels[rideDetails?.status] || "Assign Cab"}
                  </span>
                </div>
              </button>
              {(rideDetails?.status === "arrived" ||
                rideDetails?.status === "assigned") && (
                <button
                  onClick={handleRevertToConfirm}
                  className={`w-full text-black border border-gray-400 bg-yellow-600 hover:opacity-90 transition-all shadow-md rounded-md px-4 py-2`}
                >
                  <div className="flex items-center justify-center gap-2 text-sm font-medium">
                    <span>Revert to Confirm</span>
                  </div>
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-2">
            {/* Driver Information */}
            {DriverData && (
              <div className="bg-white w-full md:w-1/2 shadow rounded-xl p-5">
                <div className="border-l-4 border-blue-600 pl-3 mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Driver Information
                  </h3>
                </div>

                <div className="flex items-center gap-4">
                  <div>
                    {/* <Image
                      src={
                        DriverData?.driver_image
                          ? `${DriverData?.driver_image}`
                          : "/images/driverplaceholderimg.png"
                      }
                      alt="driver image"
                      width={60}
                      height={60}
                      className="rounded-full object-cover border-2 border-blue-500"
                    /> */}
                    <Image
  src={safeImage(DriverData?.driver_image)}
  alt="driver image"
  width={60}
  height={60}
  className="rounded-full object-cover border-2 border-blue-500"
  onError={(e) => { e.target.srcset = ""; e.target.src = "/images/driverplaceholderimg.png"; }}
/>

                  </div>

                  <div className="flex flex-col flex-1">
                    <span className="text-[14px] font-semibold text-gray-800 mt-[-2px]">
                      {DriverData?.driver_name}
                    </span>
                    <span className="text-[14px] text-gray-600">
                      {DriverData?.driver_mobile}
                    </span>
                    <div className="mt-1">
                      <StarRating value={DriverData?.driver_rating} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Vehicle Information */}
            {CabData && (
              <div className="bg-white w-full md:w-1/2 shadow rounded-xl p-5">
                <div className="border-l-4 border-blue-600 pl-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Vehicle Information
                  </h3>
                  <span className="text-lg font-semibold text-gray-800">
                    {CabData?.cab_source}
                  </span>
                </div>
                <div className="flex flex-row items-center gap-2">
                  <div className="py-2">
                    <img
                      src={
                        cabImages[CabData?.cab_type?.toLowerCase?.()] ||
                        cabImages.suv || '/images/1.png'
                      }
                      alt="cab icon"
                      width={200}
                      height={100}
                      className="object-contain"
                      onError={(e) => { e.target.onerror = null; e.target.src = '/images/car.png'; }}
                    />
                  </div>
                  <div className="flex  flex-col justify-between px-4 py-2">
                    <span className="text-sm text-gray-800 font-semibold">
                      {CabData?.cab_reg}
                    </span>

                    {/* <span className="text-sm text-gray-800 font-semibold">
                      {CabData?.cab_type}
                    </span>
                    <span className="text-sm text-gray-800 font-semibold">
                      {CabData?.cab_model}
                    </span> */}
                    <span className="text-sm text-gray-800 font-semibold">
                      {vehicleInfo.cabTypeName || "Loading..."}
                    </span>

                    <span className="text-sm text-gray-800 font-semibold">
                      {vehicleInfo.cabModelName || "Loading..."}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/*-------------------Onetime Operator --------------------*/}
      <CommonModal
        open={oneTimeOpen}
        // onClose={() => setOneTimeOpen(false)}
        onClose={() => {
          resetOneTimeForm();
          setOneTimeOpen(false);
        }}
        title="One-Time Operator Details"
        actions={[
          {
            label: "Cancel",
            onClick: () => setOneTimeOpen(false),
            variant: "outlined",
            color: "inherit",
          },
          // {
          //   label: "Save Operator",
          //   onClick: handleSaveOneTimeOperator,
          //   variant: "contained",
          //   color: "primary",
          // },
          {
            label: savingOneTime ? "Saving..." : "Save Operator",
            onClick: handleSaveOneTimeOperator,
            variant: "contained",
            color: "primary",
            disabled: savingOneTime,
          },
        ]}
      >
        {savingOneTime && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <Loader className="animate-spin duration-500 w-12 h-12 text-blue-500" />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {/* RC */}

          <div
            className={savingOneTime ? "opacity-50 pointer-events-none" : ""}
          >
            <div>
              <input
                placeholder="RC Number *"
                value={oneTimeData.rc}
                // onChange={(e) => {
                //   const value = e.target.value
                //     .toUpperCase()
                //     .replace(/[^A-Z0-9]/g, "");

                //   setOneTimeData((prev) => ({ ...prev, rc: value }));

                //   debouncedRCSearch(value);
                // }}
                onChange={(e) => {
                  const value = e.target.value
                    .toUpperCase()
                    .replace(/[^A-Z0-9]/g, "");
                  setOneTimeData((prev) => ({ ...prev, rc: value }));

                  if (value.length >= 8) {
                    debouncedRCSearch(value);
                  }
                }}
                className={`border px-3 py-2 rounded-md w-full ${
                  errors.rc ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>
          </div>

          {/* DL */}
          <input
            placeholder="DL Number (Optional)"
            value={oneTimeData.dl}
            onChange={(e) =>
              setOneTimeData((prev) => ({ ...prev, dl: e.target.value }))
            }
            className="border px-3 py-2 rounded-md w-full"
          />

          {/* Driver Name */}
          <div>
            <input
              placeholder="Driver Name *"
              value={oneTimeData.driver_name}
              onChange={(e) => {
                const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                setOneTimeData((prev) => ({ ...prev, driver_name: value }));
              }}
              className={`border px-3 py-2 rounded-md w-full ${
                errors.driver_name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.driver_name && (
              <p className="text-red-500 text-xs">{errors.driver_name}</p>
            )}
          </div>

          {/* Driver Mobile */}
          <div>
            <input
              placeholder="Driver Mobile *"
              value={oneTimeData.driver_mobile}
              // onChange={(e) =>
              //   setOneTimeData((prev) => ({
              //     ...prev,
              //     driver_mobile: e.target.value,
              //   }))
              // }
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                setOneTimeData((prev) => ({
                  ...prev,
                  driver_mobile: value,
                }));
              }}
              className={`border px-3 py-2 rounded-md w-full ${
                errors.driver_mobile ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.driver_mobile && (
              <p className="text-red-500 text-xs">{errors.driver_mobile}</p>
            )}
          </div>

          {/* WhatsApp */}
          <div>
            <input
              placeholder="Driver WhatsApp *"
              value={oneTimeData.driver_whatsapp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                setOneTimeData((prev) => ({ ...prev, driver_whatsapp: value }));
              }}
              className={`border px-3 py-2 rounded-md w-full ${
                errors.driver_whatsapp ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.driver_whatsapp && (
              <p className="text-red-500 text-xs">{errors.driver_whatsapp}</p>
            )}
          </div>

          <FormControl fullWidth size="small" error={!!errors.cab_model}>
            <InputLabel id="cab-model-label">Select Car Model *</InputLabel>

            <Select
              labelId="cab-model-label"
              label="Select Car Model *"
              value={oneTimeData.cab_model || ""}
              onChange={(e) =>
                setOneTimeData((prev) => ({
                  ...prev,
                  cab_model: e.target.value,
                }))
              }
              MenuProps={{
                container: document.body,
                PaperProps: {
                  style: {
                    maxHeight: 300,
                    zIndex: 9999,
                  },
                },
              }}
            >
              <MenuItem value="">
                <em>Select Car Model *</em>
              </MenuItem>

              {(cabModels || []).map((cab) => (
                // <MenuItem key={cab.id} value={cab.make_model}>
                //   {cab.make_model} ({cab.make_name})
                // </MenuItem>
                <MenuItem key={cab.id} value={cab.id}>
                  {cab.make_model} ({cab.make_name})
                </MenuItem>
              ))}
            </Select>

            {errors.cab_model && (
              <p className="text-red-500 text-xs mt-1">{errors.cab_model}</p>
            )}
          </FormControl>

          {/* Owner Name */}
          <div>
            <input
              placeholder="Owner Name *"
              value={oneTimeData.owner_name}
              onChange={(e) => {
                const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                setOneTimeData((prev) => ({ ...prev, owner_name: value }));
              }}
              className={`border px-3 py-2 rounded-md w-full ${
                errors.owner_name ? "border-red-500" : "border-gray-300"
              }`}
            />
          </div>

          {/* Owner Mobile */}
          <div>
            <input
              placeholder="Owner Mobile *"
              value={oneTimeData.owner_mobile}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                setOneTimeData((prev) => ({ ...prev, owner_mobile: value }));
              }}
              className={`border px-3 py-2 rounded-md w-full ${
                errors.owner_mobile ? "border-red-500" : "border-gray-300"
              }`}
            />
          </div>

          <FormControl fullWidth size="small" error={!!errors.cab_type}>
            <InputLabel id="cab-type-label">Select Car Type *</InputLabel>

            <Select
              labelId="cab-type-label"
              label="Select Car Type *"
              value={oneTimeData.cab_type || ""}
              onChange={(e) =>
                setOneTimeData((prev) => ({
                  ...prev,
                  cab_type: e.target.value,
                }))
              }
              MenuProps={{
                container: document.body,
                PaperProps: {
                  style: {
                    maxHeight: 250,
                    zIndex: 9999,
                  },
                },
              }}
            >
              <MenuItem value="">
                <em>Select Car Type *</em>
              </MenuItem>

              {(cabTypes || []).map((cab) => (
                // <MenuItem key={cab.id} value={cab.cab_type}>
                //   {cab.cab_type}
                // </MenuItem>
                <MenuItem key={cab.id} value={cab.id}>
                  {cab.cab_type}
                </MenuItem>
              ))}
            </Select>

            {errors.cab_type && (
              <p className="text-red-500 text-xs mt-1">{errors.cab_type}</p>
            )}
          </FormControl>

          {/* Private Vehicle */}
          <div className="md:col-span-2">
            <select
              value={oneTimeData.private_value}
              onChange={(e) =>
                setOneTimeData((prev) => ({
                  ...prev,
                  private_value: e.target.value,
                }))
              }
              className={`border px-3 py-2 rounded-md w-full ${
                errors.private_value ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Private Vehicle *</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
            {errors.private_value && (
              <p className="text-red-500 text-xs">{errors.private_value}</p>
            )}
          </div>

          {/* Status */}
          <div className="md:col-span-2">
            <select
              value={oneTimeData.status}
              onChange={(e) =>
                setOneTimeData((prev) => ({ ...prev, status: e.target.value }))
              }
              className="border px-3 py-2 rounded-md w-full"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </CommonModal>

      {/* ---------------------- update to probable modal----------------- */}
      <CommonModal
        open={updateModal}
        onClose={() => setUpdateModal(false)}
        title="Change Cab Reason"
        actions={[
          {
            label: "Cancel",
            onClick: () => setUpdateModal(false),
            variant: "outlined",
            color: "inherit",
          },
          {
            label: "Update Cab",
            onClick: handleProbableCab,
            variant: "contained",
            color: "primary",
          },
        ]}
      >
        <FormControl fullWidth variant="outlined" size="small">
          <InputLabel id="reason-label">Reason</InputLabel>
          <Select
            labelId="reason-label"
            value={changeReason}
            onChange={(e) => setChangeReason(e.target.value)}
            label="Reason"
          >
            <MenuItem value="">
              <em>--Please Select the Reason--</em>
            </MenuItem>
            <MenuItem value="Breakdown">Breakdown</MenuItem>
            <MenuItem value="Delayed">Delayed</MenuItem>
            <MenuItem value="Refused">Refused</MenuItem>
          </Select>
        </FormControl>
      </CommonModal>

      {/* --------------------- start/ end trip modal----------------- */}
      <CommonModal
        open={startTripPopUp || endTripPopUp}
        onClose={() => {
          if (startTripPopUp) setStartTripPopUp(false);
          if (endTripPopUp) setEndTripPopUp(false);
        }}
        title={startTripPopUp ? "Enter Start KM" : "Enter End KM"}
        actions={[
          {
            label: "Cancel",
            onClick: () => {
              if (startTripPopUp) setStartTripPopUp(false);
              if (endTripPopUp) setEndTripPopUp(false);
            },
            variant: "outlined",
            color: "inherit",
          },
          {
            label: startTripPopUp ? "Trip Start" : "End Trip",
            onClick: () => {
              if (tripKm > 0) {
                startTripPopUp
                  ? handleStartTrip(tripKm)
                  : handleEndTrip(tripKm);
              } else {
                alert(
                  `Please enter a valid ${
                    startTripPopUp ? "Start" : "End"
                  } KM greater than 0`,
                );
              }
            },
            variant: "contained",
            color: "primary",
          },
        ]}
      >
        <input
          type="number"
          value={tripKm}
          onChange={(e) => setTripKm(e.target.value)}
          className="w-full border border-gray-300 dark:border-slate-600 px-4 py-2 text-sm rounded-md bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </CommonModal>

      {/* --------------------------- cash collect pop up --------------- */}
      <CommonModal
        open={cashCollectPopUp}
        onClose={() => setCashCollectPopup(false)}
        title="Cash Collection"
        actions={[
          {
            label: "Cancel",
            onClick: () => setCashCollectPopup(false),
            variant: "outlined",
            color: "inherit",
          },
          {
            label: discountUpdated ? "Update Fare" : "Collect Cash",
            onClick: () => {
              discountUpdated ? handleUpdateFare() : handleCashCollect();
            },
            variant: "contained",
            color: "primary",
          },
        ]}
      >
        <div className="flex flex-col gap-3 text-[14px]">
          <div className="flex justify-between border-b pb-2">
            <div className="flex flex-col gap-2">
              <span className="font-bold text-black text-lg">
                Estimated Fare
              </span>
              <span className="font-semibold text-black text-sm">
                {rideDetails?.price_details_json?.estimated_km} Km{" "}
                {rideDetails?.price_details_json?.estimated_time}
              </span>
            </div>
            <div>
              <span className="font-bold text-lg text-black">
                ₹{rideDetails?.price_details_json?.estimated_fare}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2 border-b pb-2">
            <div className="flex justify-between text-gray-600 dark:text-gray-300">
              <span>
                {"Extra KM charge"} (
                {rideDetails?.price_details_json?.extra_km || 0})
              </span>
              <span className="font-medium text-gray-800 dark:text-white">
                ₹{rideDetails?.price_details_json?.extra_km_charge || 0}
              </span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-300">
              <span>
                {"Extra Time Charge"} (
                {rideDetails?.price_details_json.extra_time || 0})
              </span>
              <span className="font-medium text-gray-800 dark:text-white">
                ₹{rideDetails?.price_details_json?.extra_time_charge || 0}
              </span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-300">
              <span>{"Discount"}</span>
              <span className="font-medium text-gray-800 dark:text-white">
                ₹{rideDetails?.price_details_json?.discount || 0}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2 border-b pb-2">
            <div className="flex justify-between text-black dark:text-gray-300">
              <span className="font-bold">{"Total Ride Fare"} </span>
              <span className="font-bold">
                ₹{rideDetails?.price_details_json?.final_fare || 0}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2 border-b pb-2">
            <div className="flex justify-between text-black dark:text-gray-300">
              <span className="font-medium">{"Advance Paid"} </span>
              <span className="font-medium text-gray-800 dark:text-white">
                ₹{rideDetails?.price_details_json?.advance_amount || 0}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2 border-b pb-2">
            <div className="flex justify-between text-black dark:text-gray-300">
              <span className="font-medium">
                {"Final Payout (Remaining Amount)"}{" "}
              </span>
              <span className="font-medium text-gray-800 dark:text-white">
                ₹{rideDetails?.price_details_json?.collected_by_driver || 0}
              </span>
            </div>
          </div>
          {/* {[
                    { label: "Distance (KM)", value: rideDetails?.price_details_json?.estimated_km },
                    { label: "Time (Minutes)", value: rideDetails?.distance_time_google_data?.durationText },
                    { label: "Estimated Fare", value: rideDetails?.price_details_json?.estimated_fare },
                    { label: "Advance Amount", value: rideDetails?.price_details_json?.advance_amount },
                    { label: "Extra distance (KM)", value: rideDetails?.price_details_json?.extra_km },
                    { label: "Extra KM charges", value: rideDetails?.price_details_json?.extra_km_charge },
                    { label: "Extra Time (Minutes)", value: rideDetails?.price_details_json?.extra_km },
                    { label: "Extra Time Chagres", value: rideDetails?.price_details_json?.extra_time_charge },
                    { label: "Discount", value: rideDetails?.price_details_json?.discount },
                    { label: "Cash Collected by Driver", value: rideDetails?.price_details_json?.collected_by_driver },
                    // { label: "Wallet", value: rideDetails?.price_details_json?.estKm },
                    // { label: "Coupon", value: rideDetails?.payment_details_json?.coupon_apply_details?.coupon_details?.code },
                ]
                    .filter(item => item.value !== undefined && item.value !== null && item.value !== "")
                    .map((item, idx) => (
                        <div key={idx} className="flex justify-between text-gray-600 dark:text-gray-300">
                            <span>{item.label}</span>
                            <span className="font-medium text-gray-800 dark:text-white">{item.value}</span>
                        </div>
                    ))} */}
        </div>
        {/* <div className='flex items-center gap-3'>
                <label htmlFor="discount" className='w-full'>Add Discount</label>
                <input
                    id='discount'
                    type="number"
                    value={discount}
                    onChange={(e) => {setUpdatedDiscount(true);setDiscount(e.target.value)}}
                    placeholder="Enter discount amount"
                    className="w-full my-3 border border-gray-300 dark:border-slate-600 px-4 py-2 text-sm rounded-md bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div> */}
      </CommonModal>

      <PublishModal
        isDirectAssigned={true}
        open={modalOpen}
        details={rideDetails}
        onClose={() => setModalOpen(false)}
        onConfirm={(obj) => {
          setCabServiceData((prev) => ({
            ...prev,
            cabDetails: {
              ...prev.cabDetails,
              ...obj,
            },
          }));
          setModalOpen(false);
        }}
      />
    </>
  );
};

export default CabServiceDetails;
