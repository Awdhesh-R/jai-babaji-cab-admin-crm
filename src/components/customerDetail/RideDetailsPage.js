"use client";
import React, { useCallback, useEffect, useState } from "react";
import { LuMapPin } from "react-icons/lu";
import {
  FaCheckCircle,
  FaClock,
  FaCarSide,
  FaUserFriends,
  FaSuitcaseRolling,
  FaWallet,
  FaInfoCircle,
  FaChartLine,
  FaEdit,
} from "react-icons/fa";
import { GoStarFill } from "react-icons/go";
import { CiStar } from "react-icons/ci";
import { MdRefresh } from "react-icons/md";
import Image from "next/image";
import { getCabType } from "@/helpers/utils";
import CabServiceDetails from "../ridesManagement/details/CabServiceDetails";
import TripOverview from "../ridesManagement/details/TripOverview";
import { ACTIVE_RIDE_STATUSES } from "@/helpers/constant";
import AddRemarksSection from "./AddRemarksSection";
import { apiClient } from "@/app/lib/apiClient";
import polyline from "@mapbox/polyline";
import moment from "moment";
import { toast } from "react-toastify";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";
import { collectCash } from "@/services/rideManagement";

const RideDetailsPage = ({
  rideDetails,
  setCheckUpdate,
  setStoreStatus,
  activityData,
}) => {
  const [bookingDetailsUpdatedToDriver, setBookingDetailsUpdatedToDriver] =
    useState(false);
  const [editFareSummary, setEditFareSummary] = useState(false);
  const [value, setValues] = useState();
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  //   const [refundType, setRefundType] = useState('total');
  const [refundType, setRefundType] = useState("nonrefund");
  const [cashAmount, setCashAmount] = useState("");
  const [showUpdatedFare, setShowUpdatedFare] = useState(false);
  const [error, setError] = useState("");

  const handleClose = () => {
    setShowCancelPopup(false);
    setRefundType("total");
    setCashAmount("");
  };

    const handleUpdateFareSummaryButton = () => {
        if (showUpdatedFare) {
            setShowUpdatedFare(prev => false);
            updateRideDetails();
        } else {
            setShowUpdatedFare(prev => true);
            caluclateFare();
        }
    }
    const caluclateFare = () => {
        console.log(value);
        const {estimated_fare, estimated_km, advance_amount, collected_by_driver, discount, estimated_time,
             extra_km, extra_km_charge, extra_per_km, extra_time, extra_time_charge, extra_time_per_hr, extra_time_per_minutes,
            final_fare, waiting_charge, toll_charge, parking_charge} = value;
        const extraTimeInMinutes = getTimeInMinutes(extra_time);
        const extraTimeCharge = extraTimeInMinutes * parseFloat(extra_time_per_minutes);
        console.log("extra time charge", extraTimeInMinutes, extra_time_per_minutes, extraTimeCharge)
        const extraKmCharge = parseFloat(extra_km) * parseFloat(extra_per_km);
        console.log("extra km charge", extra_km, extra_per_km, extraKmCharge);
        const collectedByDriver = parseFloat(estimated_fare || 0) + parseFloat(extraKmCharge || 0) + 
                            parseFloat(extraTimeCharge || 0) + parseFloat(toll_charge || 0) + parseFloat(parking_charge || 0) 
                            - parseFloat(advance_amount || 0) - parseFloat(discount || 0);
        const finalFare = parseFloat(estimated_fare || 0) + parseFloat(extraKmCharge || 0) + 
                            parseFloat(extraTimeCharge || 0) - parseFloat(discount || 0);
        console.log("collected by driver", estimated_fare, extraTimeCharge, extraKmCharge, toll_charge || 0, parking_charge || 0, advance_amount, discount, "calculated", collectedByDriver, "calculated", finalFare);

        setValues(prev=> ({
            ...prev,
            final_fare: finalFare,
            collected_by_driver: collectedByDriver,
            extra_time_charge: extraTimeCharge,
            extra_km_charge: extraKmCharge
        }));
    }

    const handleInputChange = (e, item) => {
        let val = e.target.value;
        if (val === "") {
            setValues((prev) => ({
                ...prev,
                [item.key]: 0,
            }));
            return;
        }
        if (item.key === "extra_time") {
            const pattern = /^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
            if (!pattern?.test(val)) {
                setError(item.key+"#Extra Time should be in hh:mm:ss format");
            } else {
                setError(prev=>"");
            }
            val = val;
        } else {
            if (isNaN(val) || val < 0) val = 0;
            else val = Number(val);
        }
        setValues((prev) => ({
            ...prev,
            [item.key]:
                item.key === "extra_time" ? val : parseFloat(val),
        }));
    }
    const getError = (itemKey) => {
        if(error) {
            const [k, e] = error.split("#");
            if(k === itemKey) {
                return e;
            }
            return "";
        }
        return "";
    }
    const getTimeInMinutes = (str) => {
        const pattern = /^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
        if(pattern.test(str)) {
            const [h, m, s] = str.split(":");
            const hInm = parseFloat(h)*60;
            const sInm = parseFloat(s)/60;
            const min = hInm + sInm + parseFloat(m);
            return min;
        } else {
            return 0;
        }
    }
  const handleProceed = () => {
    console.log(refundType, cashAmount, rideDetails?.urid, rideDetails?.user_id)
    if ( refundType==='partial') {
        if(parseFloat(cashAmount) > parseFloat(rideDetails?.price_details_json?.advance_amount)){ 
            toast.error('Amount cannot be greater than advance amount');
            return;
        }
        handlePartialPayment();
    } else if(refundType === "total") {
        handleTotalPayment();
    } else {
      handleNonRefund();
    }
  };

  const handleNonRefund = async () => {
    try {
      const payload = {
        transaction_id : "",
        refund_amount: 0,
        invoice_amount: rideDetails?.payment_details_json? rideDetails?.payment_details_json?.advance_paid: rideDetails?.price_details_json?.advance_amount,
        urid: rideDetails?.urid,
        wallet: false,
      }
      const response = await apiClient("POST", `/ride_management/refund-amount-to-razor-pay`, payload);
      if (response.status || response.success) {
        toast.success(response.success);
        setCheckUpdate(prev => !prev);
      } else {
        toast.error(response.message);
      }
    } catch (e) {
      console.log(e);
    }
  }

  const handleTotalPayment = async () => {
    //api call for handleTotal Payment
    try {
      const payload = {
        transaction_id: rideDetails?.payment_details_json ? rideDetails?.payment_details_json?.transaction_id : "",
        refund_amount: parseFloat(cashAmount),
        invoice_amount: rideDetails?.payment_details_json ? parseFloat(rideDetails?.payment_details_json?.advance_paid)-parseFloat(cashAmount) : parseFloat(rideDetails?.price_details_json?.advance_amount) - parseFloat(cashAmount),
        urid: rideDetails?.urid,
        wallet: false
      }
      const response = await apiClient("POST", `/ride_management/refund-amount-to-razor-pay`, payload);
      if(response.status || response.success) {
        toast.success(response.message);
        setCheckUpdate(prev=> !prev);
      } else {
        toast.error(response.message);
      }
    } catch (e) {
      console.log(e);
    }
  }

  const handlePartialPayment = async () => {
    try {
        const payload = {
          transaction_id: rideDetails?.payment_details_json ? rideDetails?.payment_details_json?.transaction_id : "",
          refund_amount: parseFloat(cashAmount),
          invoice_amount: rideDetails?.payment_details_json ? parseFloat(rideDetails?.payment_details_json?.advance_paid)-parseFloat(cashAmount) : parseFloat(rideDetails?.price_details_json?.advance_amount) - parseFloat(cashAmount),
          urid: rideDetails?.urid,
          wallet: true,
        }
        const response = await apiClient("POST", `/ride_management/refund-amount-to-razor-pay`, payload);
        if(response.status || response.success) {
            toast.success(response.success);
            setCheckUpdate(prev => !prev);
        } else {
            toast.error(response.message);
        }
    } catch (e) {
        console.log(e);
    }
  } 

  useEffect(() => {
    if (rideDetails?.booking_details_updated_to_driver) {
      setBookingDetailsUpdatedToDriver(true);
    } else {
      setBookingDetailsUpdatedToDriver(false);
    }
  }, [rideDetails?.booking_details_updated_to_driver]);

  useEffect(() => {
    setValues((prev) => ({
      ...rideDetails.price_details_json,
    }));
  }, [rideDetails?.price_details_json]);

  const updateRideDetails = async () => {
    console.log(value);
    const pattern = /^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
    if (!value?.extra_time || !pattern.test(value?.extra_time)) {
      toast.error("Extra Time Missing Or Incorrect Format!");
      return;
    }
    const payload = {
      price_details_json: {
        ...value,
      },
    };
    try {
      const response = await apiClient(
        "PUT",
        `/ride_management/updateRideDetails/${rideDetails?.urid}`,
        payload
      );
      if (response.success || response.status) {
        toast.success(response.message);
        if (
          rideDetails?.status?.toLowerCase() === "completed" &&
          rideDetails?.is_collected
        ) {
          await handleCashCollect();
        } else {
          setCheckUpdate((prev) => !prev);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };
  const handleCashCollect = async () => {
    if (!rideDetails?.urid) return;
    try {
      const response = await collectCash(
        rideDetails.urid,
        cabServiceData?.cabDetails?.cab_source
      );
      if (response?.success) {
        toast.success("Cash collected successfully!");
        setCheckUpdate((prev) => !prev);
      } else {
        toast.error(response?.message || "Failed to collect cash");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleUpdateBookingDetailsToDriver = async (val) => {
    try {
      setBookingDetailsUpdatedToDriver(val);
      const response = await apiClient(
        "PUT",
        `/ride_management/bookig-details-updated-to-driver/${rideDetails?.urid}`,
        {
          status: rideDetails?.status,
          booking_details_updated_to_driver: val,
        }
      );
      if (response.status || response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (e) {
      console.log(e);
    } finally {
    }
  };

  const [cabServiceData, setCabServiceData] = useState({
    cabDetails: {
      cab_id: rideDetails?.cab_details_json?.cab_id ?? "",
      cab_reg: rideDetails?.cab_details_json?.cab_reg ?? "",
      cab_type: getCabType(rideDetails?.cab_details_json?.cab_type) ?? "",
      cab_model: rideDetails?.cab_details_json?.cab_model ?? "",
      cab_source: rideDetails?.cab_details_json?.cab_source ?? "",
    },
    driverDetails: {
      driver_id: rideDetails?.driver_details_json?.driver_id ?? "",
      driver_name: rideDetails?.driver_details_json?.drv_name ?? "",
      driver_image: rideDetails?.driver_details_json?.driver_image ?? "",
      driver_mobile: rideDetails?.driver_details_json?.driver_mobile ?? "",
      driver_whatsapp: rideDetails?.driver_details_json?.drv_wa_number ?? "",
      driver_rating: rideDetails?.driver_details_json?.driver_rating ?? "",
    },
  });
  const [isAddremarksSectionOpen, SetIsOpenAdRemarksSection] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [distance, setDistance] = useState();
  const [time, setTime] = useState();
  const [lastUpdated, setLastUpdated] = useState("9 mins ago");
  const handleRefresh = () => {
    fetchCabById().finally(() => {});
  };

  function getBounds(coords) {
    let minLat = Infinity,
      maxLat = -Infinity;
    let minLng = Infinity,
      maxLng = -Infinity;

    coords.forEach(([lng, lat]) => {
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
    });

    return { minLat, maxLat, minLng, maxLng };
  }
  function getCenter(bounds) {
    return [
      (bounds.minLng + bounds.maxLng) / 2, // center lng
      (bounds.minLat + bounds.maxLat) / 2, // center lat
    ];
  }

  function getZoom(bounds, mapWidth, mapHeight) {
    // rough formula based on latitude/longitude span
    const WORLD_DIM = { height: 300, width: 1000 };
    const ZOOM_MAX = 20;

    function latRad(lat) {
      const sin = Math.sin((lat * Math.PI) / 180);
      const radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
      return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
    }

    function zoom(mapPx, worldPx, fraction) {
      return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
    }

    const latFraction =
      (latRad(bounds.maxLat) - latRad(bounds.minLat)) / Math.PI;
    const lngDiff = bounds.maxLng - bounds.minLng;
    const lngFraction = (lngDiff < 0 ? lngDiff + 360 : lngDiff) / 360;

    const latZoom = zoom(mapHeight, WORLD_DIM.height, latFraction);
    const lngZoom = zoom(mapWidth, WORLD_DIM.width, lngFraction);

    return Math.min(latZoom, lngZoom, ZOOM_MAX);
  }

  const handleMapInit = async (cab = null, coordinates = null) => {
    import("olamaps-web-sdk").then((module) => {
      const { OlaMaps } = module;
      const olaMaps = new OlaMaps({
        apiKey: [
          process.env.OLA_KEY || "OYZHLli2k5i9JrcOqveiL2wG5dxJ0A08blmHWFSa",
        ],
        style:
          "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
      });
      const map = olaMaps.init({
        container: "map",
        center:
          coordinates?.sort().reverse() ||
          rideDetails?.booking_source_coordinates?.coordinates.sort().reverse(),
        zoom: 15,
        mode: "2d",
        width: "100%",
      });
      if (cab) {
        var customMarker = document.createElement("div");
        customMarker.classList.add("customMarkerClass");
        customMarker.style.width = "20% !important";
        customMarker.style.height = "20% !important";
        customMarker.id = cab.id;
        customMarker.innerHTML = `<img src="/images/car_icon.svg" alt="Cab Icon" style="width: 100%; height: 100%;">`;
        customMarker.title = `Cab Number: ${
          cab.cab_reg || cab.registration_no
        }\nStatus: ${cab.cab_status || "N/A"}`;
      }

      let olaResponse = null;
      let polylineStr = "";
      let src =
        coordinates?.sort() ||
        rideDetails?.booking_source_coordinates?.coordinates.sort();
      let dest =
        rideDetails?.booking_destination_coordinates?.coordinates.sort();
      if (
        rideDetails?.status?.toLowerCase() === "arrived" ||
        rideDetails?.status.toLowerCase() === "started"
      ) {
        dest = rideDetails?.booking_destination_coordinates?.coordinates.sort();
      } else if (
        rideDetails?.status?.toLowerCase() !== "completed" &&
        rideDetails?.status?.toLowerCase() !== "cancelled"
      ) {
        dest = rideDetails?.booking_source_coordinates?.coordinates.sort();
      }

      if (coordinates) {
        const car_marker = olaMaps
          .addMarker({ element: customMarker })
          .setLngLat(coordinates.sort().reverse())
          .addTo(map);
      }
      const source_marker = olaMaps
        .addMarker({ color: "black" })
        .setLngLat(
          rideDetails?.booking_source_coordinates?.coordinates.sort().reverse()
        )
        .addTo(map);
      const dest_marker = olaMaps
        .addMarker({ color: "red" })
        .setLngLat(dest.sort().reverse())
        .addTo(map);
      map.on("load", async () => {
        console.log(src, dest);
        if (
          rideDetails?.status.toLowerCase() !== "completed" &&
          rideDetails?.status.toLowerCase() !== "cancelled" &&
          cabServiceData?.cabDetails?.cab_id
        ) {
          const res = await apiClient(
            "GET",
            "https://api.olamaps.io/routing/v1/distanceMatrix/basic",
            {
              origins: [...src].sort().join(),
              destinations: [...dest].sort().join(),
              api_key:
                process.env.OLA_KEY ||
                "OYZHLli2k5i9JrcOqveiL2wG5dxJ0A08blmHWFSa",
            },
            null,
            false,
            true
          );
          if (res?.status?.toLowerCase() === "success") {
            console.log(res);
            const bounds = getBounds([src, dest]);
            const center = getCenter(bounds);
            const zoom = getZoom(bounds, 1000, 250); // pass your map div width/height in px

            map.setCenter({ lat: center[1], lng: center[0] });
            map.setZoom(zoom);

            polylineStr = res.rows[0].elements[0].polyline;
            olaResponse = res.rows[0].elements[0];
            const dist = olaResponse?.distance
              ? parseFloat(olaResponse.distance) / 1000
              : 0;
            const time = olaResponse?.duration
              ? parseFloat(olaResponse.duration) / (60 * 60)
              : 0;
            setDistance(dist);
            setTime(time);
            const coords = polyline.decode(polylineStr); // [[lat, lng], ...]
            console.log(coords);
            const path = coords.map(([lat, lng]) => [lng, lat]);
            map.addSource("route", {
              type: "geojson",
              data: {
                type: "Feature",
                properties: {},
                geometry: {
                  type: "LineString",
                  coordinates: path,
                },
              },
            });
            map.addLayer({
              id: "route",
              type: "line",
              source: "route",
              layout: { "line-join": "round", "line-cap": "round" },
              paint: {
                "line-color": "black",
                "line-width": 3,
              },
            });
          }
        }
      });
    });
  };

  const fetchCabById = useCallback(async () => {
    const cab_id = cabServiceData?.cabDetails?.cab_id;
    const source = cabServiceData?.cabDetails?.cab_source?.toLowerCase();
    try {
      let url = null;
      if (source === "rodbez") {
        url = `/rb_cabs/rbCabsDetails/${cab_id}`;
        const response = await apiClient("GET", url);
        if (response.status || response.success) {
          const cab = response.data;
          const coordinates = response.data.cab_gps_data?.coordinates;
          console.log(coordinates);
          await handleMapInit(cab, coordinates);
        }
      } else {
        url = `/fleet/operater-cab-details/${cab_id}`;
        const res = await apiClient("GET", url);
        if (res.status && res.success) {
          // const cabArr = res.data;
          const cab = res.data; //cabArr.find(cab=> cab.id === cab_id);
          const coordinates = cab.cab_gps_data?.coordinates;
          await handleMapInit(cab, coordinates);
        }
      }
    } catch (e) {
    } finally {
    }
  }, [cabServiceData?.cabDetails, rideDetails]);

  const checkOnTime = () => {
    if (distance && time) {
      if (
        rideDetails?.status?.toLowerCase() !== "arrived" &&
        rideDetails?.status?.toLowerCase() !== "started"
      ) {
        return moment()
          .add(time, "hours")
          .isSameOrBefore(
            moment(
              `${rideDetails?.booking_travel_date} ${rideDetails?.bookingTime}`,
              "DD-MM-YYYY hh:mm A"
            )
          );
      } else if (
        rideDetails?.status?.toLowerCase() === "arrived" ||
        rideDetails?.status?.toLowerCase() === "started"
      ) {
        return moment()
          .add(time, "hours")
          .isSameOrBefore(
            moment(
              `${rideDetails?.booking_travel_date} ${rideDetails?.bookingTime}`,
              "DD-MM-YYYY hh:mm A"
            ).add(
              rideDetails?.distance_time_google_data?.durationValue + 3600,
              "seconds"
            )
          );
      }
    }
    return false;
  };

  useEffect(() => {
    function init() {
      if (cabServiceData?.cabDetails) {
        const cabId = cabServiceData?.cabDetails?.cab_id;
        if (cabId) fetchCabById();
        else handleMapInit();
      }
    }
    init();
  }, [cabServiceData, fetchCabById]);


const ALLOWED_ADMIN_IDS = [1, 3, 36, 19, 20, 23, 6];
const adminId = Number(localStorage.getItem("admin_id") || 0);
const isAllowedAdmin = ALLOWED_ADMIN_IDS.includes(adminId);
// const canEditFareSummary =
// rideDetails?.is_collected !== false || isAllowedAdmin;
const canEditFareSummary =
  !rideDetails?.is_collected || isAllowedAdmin;



  return (
    <div className="">
      <div className="min-h-screen flex flex-col gap-3 items-center">
        {/* Top Header */}
        <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 shadow-md flex items-center justify-center">
          <div className="flex justify-between flex-wrap w-full">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold flex items-center">
                <span className="bg-white/20 p-2 rounded-md">&#x1F4C4;</span>
              </h1>
              <div className="flex flex-col">
                <span className="text-[18px] font-bold">Ride Details</span>
                <span className="text-[12px]">
                  Trip Reference: {rideDetails?.urid}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <Switch
                    color={
                      bookingDetailsUpdatedToDriver ? "success" : "default"
                    }
                    checked={bookingDetailsUpdatedToDriver}
                    onChange={(e) =>
                      handleUpdateBookingDetailsToDriver(e.target.checked)
                    }
                    slotProps={{ input: { "aria-label": "controlled" } }}
                  />
                  <button //button for switching back to user details
                    onClick={() => {
                      setStoreStatus("ride_detail");
                    }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900 dark:to-indigo-900 border border-indigo-200 dark:border-indigo-700 shadow-sm"
                  >
                    <span className="text-[12px] font-bold text-indigo-900 dark:text-white">
                      User Details
                    </span>
                  </button>

                  {/* --------Add New Button Cancel Ride  */}
                  {rideDetails?.status !== "completed" && <button
                    onClick={() => setShowCancelPopup(true)} // 👈 click karne se popup khulega
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-red-700 border border-red-700 shadow-sm ml-2"
                  >
                    <span className="text-[12px] font-bold text-white">
                      Cancel Ride
                    </span>
                  </button>}
                  {/* --------Add New Button Cancel Ride  */}

                  <div>
                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-600 px-3 py-1 rounded-full">
                      <FaCheckCircle className="text-green-500 text-sm font-semibold" />
                      <span className="text-[12px] capitalize">
                        {rideDetails?.status}
                      </span>
                    </span>
                    <p className="text-[12px]">
                      Date: {rideDetails?.booking_travel_date}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trip Overview */}
        <div className="w-full">
          <TripOverview
            rideDetails={rideDetails}
            setCheckUpdate={setCheckUpdate}
          />
        </div>

        {/* Ride Type, Vehicle Class, Passengers and Luggage Details */}
        <div className="w-full bg-gray-100 flex flex-wrap items-center justify-between gap-3 py-4">
          {/* Ride Type */}
          <div className="w-full sm:w-[48%] lg:w-[23.5%] bg-white rounded-md shadow-md p-5 flex justify-between items-center hover:shadow-lg transition">
            <div>
              <p className="text-xs text-blue-600 font-semibold uppercase">
                Ride Type
              </p>
              <p className="text-lg font-semibold text-gray-800 mt-1">
                {rideDetails?.service_type}
              </p>
            </div>
            <div className="bg-blue-600 p-3 rounded-full shadow-lg">
              <FaCarSide className="text-white text-lg" />
            </div>
          </div>

          {/* Vehicle Class */}
          <div className="w-full sm:w-[48%] lg:w-[23.5%] bg-white rounded-md shadow-md p-5 flex justify-between items-center hover:shadow-lg transition">
            <div>
              <p className="text-xs text-blue-600 font-semibold uppercase">
                Vehicle Class
              </p>
              <p className="text-lg font-semibold text-gray-800 mt-1">
                {rideDetails?.booking_type}
              </p>
            </div>
            <div className="bg-blue-600 p-3 rounded-full shadow-lg">
              <FaCarSide className="text-white text-lg" />
            </div>
          </div>

          {/* Passengers */}
          <div className="w-full sm:w-[48%] lg:w-[23.5%] bg-white rounded-md shadow-md p-5 flex justify-between items-center hover:shadow-lg transition">
            <div>
              <p className="text-xs text-blue-600 font-semibold uppercase">
                Passengers
              </p>
              <div className="text-lg font-semibold text-gray-800 mt-1 flex items-center gap-2">
                <span>
                  {rideDetails?.booking_details_json?.adults ||
                    rideDetails?.passenger_details_json?.adults}
                  <span className="text-[12px] font-normal text-gray-500">
                    (adults)
                  </span>
                </span>
                <span>
                  {rideDetails?.booking_details_json?.children ||
                    rideDetails?.passenger_details_json?.children}
                  <span className="text-[12px] font-normal text-gray-500">
                    (children)
                  </span>
                </span>
              </div>
            </div>
            <div className="bg-blue-600 p-3 rounded-full shadow-lg">
              <FaUserFriends className="text-white text-lg" />
            </div>
          </div>

          {/* Luggage */}
          <div className="w-full sm:w-[48%] lg:w-[23.5%] bg-white rounded-md shadow-md p-5 flex justify-between items-center hover:shadow-lg transition">
            <div>
              <p className="text-xs text-blue-600 font-semibold uppercase">
                Luggage
              </p>
              <div className="text-lg font-semibold text-gray-800 mt-1 flex items-center gap-2">
                <span>
                  {rideDetails?.booking_details_json?.luggage_big ||
                    rideDetails?.passenger_details_json?.luggage_big}
                  <span className="text-[12px] font-normal text-gray-500">
                    (Big)
                  </span>
                </span>
                <span>
                  {rideDetails?.booking_details_json?.luggage_small ||
                    rideDetails?.passenger_details_json?.luggage_small}
                  <span className="text-[12px] font-normal text-gray-500">
                    (Small)
                  </span>
                </span>
              </div>
            </div>
            <div className="bg-blue-600 p-3 rounded-full shadow-lg">
              <FaSuitcaseRolling className="text-white text-lg" />
            </div>
          </div>
        </div>

        {/* FARE SUMMARY  */}
        <div className="w-full  pb-4 bg-white rounded-md">
          {/* Header */}
          <div className="rounded-t-md bg-gradient-to-r from-[#3B82F6] to-[#6366F1] text-white p-4 flex items-center gap-3 text-lg font-semibold">
            <div className="bg-white/20 p-2 rounded-md">
              <FaWallet className="text-2xl" />
            </div>
            Fare Summary
          </div>

          {/* Top Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-white">
            <div
              className={`p-4 rounded-lg shadow bg-white flex justify-between items-center`}
            >
              <div>
                <p className="text-xs font-semibold uppercase text-blue-600">
                  Estimated Fare
                </p>
                <p className={`text-xl font-bold text-gray-900`}>
                  ₹ {rideDetails?.price_details_json?.estimated_fare}
                </p>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className={`p-2 rounded-full bg-white bg-opacity-30 shadow-inner`}
              >
                <FaInfoCircle className="text-blue-600" />
              </button>
            </div>

            <div
              className={`p-4 rounded-lg shadow bg-gradient-to-r from-[#6366F1] to-[#4F46E5] flex justify-between items-center`}
            >
              <div>
                <p className="text-xs font-semibold uppercase text-white">
                  Final Amount
                </p>
                <p className={`text-xl font-bold text-white`}>
                  ₹ {rideDetails?.price_details_json?.final_fare}
                </p>
              </div>
              <div
                className={`p-2 rounded-full bg-white bg-opacity-30 shadow-inner`}
              >
                <FaWallet className="text-white" />
              </div>
            </div>

            <div
              className={`p-4 rounded-lg shadow bg-gradient-to-r from-[#FB923C] to-[#F97316] flex justify-between items-center`}
            >
              <div>
                <p className="text-xs font-semibold uppercase text-white">
                  Convenience Fee
                </p>
                <p className={`text-xl font-bold text-white`}>
                  ₹ {rideDetails?.price_details_json?.advance_amount ?? 0}
                </p>
              </div>
              <div
                className={`p-2 rounded-full bg-white bg-opacity-30 shadow-inner`}
              >
                <FaChartLine className="text-white" />
              </div>
            </div>

            <div
              className={`p-4 rounded-lg shadow bg-gradient-to-r from-[#6366F1] to-[#4F46E5] flex justify-between items-center`}
            >
              <div>
                <p className="text-xs font-semibold uppercase text-white">
                  Total Collected By Driver
                </p>
                <p className="text-xl font-bold text-white">
                  ₹{" "}
                  {rideDetails?.price_details_json?.collected_by_driver === 0
                    ? rideDetails?.price_details_json?.final_fare -
                      rideDetails?.price_details_json?.advance_amount
                    : rideDetails?.price_details_json?.collected_by_driver}
                  {/* {rideDetails?.is_collected
                                        ? rideDetails?.price_details_json?.final_fare   // If collected
                                        : rideDetails?.price_details_json?.final_fare} */}
                </p>
              </div>
              <div
                className={`p-2 rounded-full bg-white bg-opacity-30 shadow-inner`}
              >
                <FaCheckCircle className="text-white" />
              </div>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="mt-6">
            <div className="border-l-4 border-blue-600 ml-4">
              <h3 className="text-md font-semibold text-blue-700 mb-4 ml-2">
                Detailed Breakdown
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ml-4 mr-4">
              <div className="p-4 bg-white rounded-md shadow-md border border-gray-200">
                <p className="text-xs font-semibold text-blue-600 uppercase">
                  RodBez Fee
                </p>
                <p className="text-xl font-bold text-gray-900">
                  ₹ {rideDetails?.price_details_json?.rodbez_fee || 0}
                </p>
                <p className="text-sm text-gray-500">Service Charge</p>
              </div>
              <div className="p-4 bg-white rounded-md shadow-md border border-gray-200">
                <p className="text-xs font-semibold text-blue-600 uppercase">
                  Extra Distance (₹{rideDetails?.price_details_json?.extra_per_km} /Km)
                </p>
                <p className="text-xl font-bold text-gray-900">
                  ₹{rideDetails?.price_details_json?.extra_km_charge || 0}{" "}
                  <span className="text-[12px] text-gray-400 font-normal">
                    ({rideDetails?.price_details_json?.extra_km})
                  </span>
                </p>
                <p className="text-sm text-gray-500">Beyond Estimate</p>
              </div>
              <div className="p-4 bg-white rounded-md shadow-md border border-gray-200">
                <p className="text-xs font-semibold text-blue-600 uppercase">
                  Extra Time <span className="capitalize">(₹ {rideDetails?.service_type.toLowerCase() ==="oneway"?`${rideDetails?.price_details_json?.extra_time_per_minutes} /min`:`${rideDetails?.price_details_json?.extra_time_per_hr} /hr`})</span>
                </p>
                <p className="text-xl font-bold text-gray-900">
                  ₹{rideDetails?.price_details_json?.extra_time_charge || 0}{" "}
                  <span className="text-[12px] text-gray-400 font-normal">
                    ({rideDetails?.price_details_json?.extra_time})
                  </span>
                </p>
                <p className="text-sm text-gray-500">Additional waiting</p>
              </div>
              <div className="p-4 bg-white rounded-md shadow-md border border-gray-200">
                <p className="text-xs font-semibold text-blue-600 uppercase">
                  Toll & Other Charges
                </p>
                <p className="text-xl font-bold text-gray-900">
                  ₹ {rideDetails?.price_details_json?.toll_charge || 0}
                </p>
                <p className="text-sm text-gray-500">Government taxes</p>
              </div>
            </div>
          </div>
        </div>

        {/* CAB SERVICE DETAILS  */}
        <CabServiceDetails
          rideDetails={rideDetails}
          cabServiceData={cabServiceData}
          setCabServiceData={setCabServiceData}
          setCheckUpdate={setCheckUpdate}
        />

        {rideDetails && (
          <AddRemarksSection
            rideDetails={rideDetails}
            activityData={activityData}
            SetIsOpenAdRemarksSection={SetIsOpenAdRemarksSection}
            isAddremarksSectionOpen={isAddremarksSectionOpen}
          />
        )}
        {/* CUSTOMER FEEDBACK */}
        <div className="w-full bg-white rounded-xl">
          <div className="rounded-t-xl bg-gradient-to-r from-[#3B82F6] to-[#6366F1] text-white p-4 flex items-center justify-between gap-3 text-lg font-semibold">
            <div className="flex gap-2 items-center">
              <div className="bg-white/20 p-2 rounded-md">
                <CiStar className="text-2xl text-white" />
              </div>
              <p>{" Real Time Cab Location"}</p>
            </div>
            <div className="flex gap-2">
              <div>Distance: {distance?.toFixed(1) || "-"} km</div>
              <div>
                Time:{" "}
                {time
                  ? time < 1
                    ? `${parseInt(time * 60)} min`
                    : `${time?.toFixed(2)} hr`
                  : "-"}
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col gap-6 p-4">
            {/* DRIVER LOCATION */}
            <div className="w-full">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 w-full">
                {/* <div className="flex items-center justify-between">
                                    <h2 className="text-md font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                                        <LuMapPin size={16} className='text-[#2463EB]' />
                                        <span>Driver Location</span>
                                        <span className="text-[#F80000] text-sm">● Live</span>
                                    </h2>
                                </div> */}
                <div className="w-full rounded-md overflow-hidden border">
                  <div className="min-h-96 w-full relative" id="map">
                    <div className="absolute top-2 right-5 z-10 bg-white px-4 py-2 rounded-full flex gap-2 items-center">
                      <div className="flex flex-col text-green-700 font-bold text-lg">
                        {`Arrival: ${moment()
                          .add(time, "hours")
                          .format("hh:mm A")}`}{" "}
                      </div>
                      <div
                        className={`flex flex-col font-semibold text-lg ${
                          checkOnTime() ? "text-green-700 " : "text-red-700 "
                        }`}
                      >
                        {`${checkOnTime() ? "On Time" : "Delayed"}`}{" "}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                  {/* <span>Last updated: {lastUpdated}</span> */}
                  <button
                    onClick={handleRefresh}
                    className="flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    <MdRefresh size={14} />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>
            </div>

            {/* CUSTOMER REVIEW FOR DRIVERS */}
            {/* <div>
                            <div className="bg-gradient-to-r from-[#EFF6FF] to-[#EEF2FF] shadow rounded-xl p-5">
                                <div className="flex items-center justify-between">
                                    <div className='flex items-center gap-2'>
                                        <Image
                                            src={`/${rideDetails?.driver_details_json?.driver_image}` || "/images/kumar.jpg"}
                                            alt="driver image"
                                            height={60}
                                            width={60}
                                            className="rounded-full object-cover border-2 border-blue-500"
                                        />
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-gray-800 text-sm">{rideDetails?.driver_details_json?.drv_name}</span>
                                            <span className="text-[13px] text-gray-700 ml-1">{rideDetails?.driver_rating?.date || "-"}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-[#FBBF24]">
                                        {[...Array(Math.floor(rideDetails?.driver_details_json?.driver_rating || 5))].map((_, i) => (
                                            <GoStarFill key={i} />
                                        ))}
                                        <span className="text-[13px] text-gray-700 ml-1">{rideDetails?.driver_details_json?.driver_rating}</span>
                                    </div>
                                </div>
                                <div className='mt-2'>
                                    <span className='text-[14px] text-gray-700'>Good ride overall. Driver was courteous and drove safely. Would recommended.</span>
                                </div>
                            </div>
                        </div> */}
          </div>
        </div>
      </div>
      {/* Add New Button Cancel Ride Pop-up  */}
      {/* 🔹 Cancel Ride Button — same style as User Details */}
      <button
        onClick={() => setShowCancelPopup(true)} // 👈 click karne se popup khulega
        className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900 dark:to-indigo-900 border border-indigo-200 dark:border-indigo-700 shadow-sm mb-4 ml-2"
      >
        <span className="text-[12px] font-bold text-indigo-900 dark:text-white">
          Cancel Ride
        </span>
      </button>

      {showCancelPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 ">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            {/* Header updated as requested */}
            <h2 className="bg-green-100 text-green-800 font-semibold rounded-md py-2 mb-5 text-xl">
              Cancel Ride
            </h2>

            <div className="flex justify-center gap-5 mb-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="refundType"
                  value="total"
                  checked={refundType === "nonrefund"}
                  onChange={() => setRefundType("nonrefund")}
                  className="form-radio accent-blue-600 mr-2"
                />
                <span className="text-gray-800 dark:text-white font-medium">
                  Non Refund
                </span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="refundType"
                  value="total"
                  checked={refundType === "total"}
                  onChange={() => setRefundType("total")}
                  className="form-radio accent-blue-600 mr-2"
                />
                <span className="text-gray-800 dark:text-white font-medium">
                  Refund
                </span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="refundType"
                  value="partial"
                  checked={refundType === "partial"}
                  onChange={() => setRefundType("partial")}
                  className="form-radio accent-blue-600 mr-2"
                />
                <span className="text-gray-800 dark:text-white font-medium">
                  Add to wallet
                </span>
              </label>
            </div>
            <div className="text-red-500 bg-red-50">
              {refundType == "nonrefund"? "No Refund through Razorpay or Wallet"
              : refundType == "total"? "Refund through Razorpay"
              : "Refund through Wallet" }
            </div>
            {/* Selected refund type ke liye cash amount + text show karo */}
            {/* {refundType === "total" && ( */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Advance Amount:</span>
                  <input
                  disabled
                    type="number"
                    min="0"
                    value={rideDetails?.payment_details_json?.advance_paid?? rideDetails?.price_details_json?.advance_amount}
                    // onChange={(e) => setCashAmount(e.target.value)}
                    placeholder="₹0"
                    className="border rounded px-2 py-1 w-24 text-right"
                  />
                </div>
              </div>
            {/* )} */}

            {refundType !== "nonrefund" && (
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Wallet Amount:</span>
                  <input
                    type="number"
                    min="0"
                    max={rideDetails?.price_details_json?.advance_amount}
                    value={cashAmount}
                    onChange={(e) => setCashAmount(e.target.value)}
                    placeholder="₹0"
                    className="border rounded px-2 py-1 w-24 text-right"
                  />
                </div>
              </div>
            )}

            {/* -----------------------new Radio button  */}

            {/* Amount fields just like the image */}
 

            {/* Proceed Button */}
            <button
              className="w-full bg-yellow-400 py-2 rounded text-gray-700 font-semibold cursor-pointer"
              onClick={handleProceed}
            >
              Proceed
            </button>
          </div>
        </div>
      )}

      {/* Add New Button Cancel Ride Pop-up  */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full max-w-md mx-auto border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Fare Summary
                </h2>
                   {canEditFareSummary && (
            <FaEdit
    size={16}
    className="text-black cursor-pointer"
    onClick={() => setEditFareSummary(true)}
  />
                    )}
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-800 dark:hover:text-white text-sm"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2 text-[14px]">
              {[
                {
                  label: "Estimated Fare",
                  value: value?.estimated_fare,
                  key: "estimated_fare",
                  editable: false,
                },
                {
                  label: "Advance Amount",
                  value: value?.advance_amount,
                  key: "advance_amount",
                  editable: false,
                },
                {
                  label: "Extra distance (KM)",
                  value: value?.extra_km,
                  key: "extra_km",
                  editable: true,
                },
                {
                  label: "Extra KM charges",
                  value: value?.extra_km_charge,
                  key: "extra_km_charge",
                  editable: false,
                },
                {
                  label: "Extra Time (Minutes)",
                  value: value?.extra_time,
                  key: "extra_time",
                  editable: true,
                },
                {
                  label: "Extra Time Chagres",
                  value: value?.extra_time_charge,
                  key: "extra_time_charge",
                  editable: false,
                },
                // {
                //   label: "Other Charges",
                //   value: value?.other_charge || 0,
                //   key: "other_charge",
                //   editable: true,
                // },
                // {
                //   label: "Waiting Charge",
                //   value: value?.waitingCharge || 0,
                //   key: "waitingCharge",
                //   editable: true,
                // },
                {
                  label: "Parking Charge",
                  value: value?.parking_charge || 0,
                  key: "parking_charge",
                  editable: true,
                },
                {
                  label: "Toll Charge",
                  value: value?.toll_charge || 0,
                  key: "toll_charge",
                  editable: true,
                },
                {
                  label: "Discount",
                  value: value?.discount,
                  key: "discount",
                  editable: true,
                },
                {
                  label: "Final Fare",
                  value: value?.final_fare,
                  key: "final_fare",
                  editable: true,
                },
                {
                  label: "Cash Collected by Driver",
                  value: value?.collected_by_driver,
                  key: "collected_by_driver",
                  editable: true,
                },
                // { label: "Wallet", value: rideDetails?.price_details_json?.estKm },
                // { label: "Coupon", value: rideDetails?.payment_details_json?.coupon_apply_details?.coupon_details?.code },
              ]
                .filter(
                  (item) =>
                    item.value !== undefined &&
                    item.value !== null &&
                    item.value !== ""
                )
                .map((item, idx) => (
                  <div
                    key={idx}
                    className="flex w-full justify-between text-gray-600 dark:text-gray-300"
                  >
                    <span className="w-full">{item.label}</span>
                    {(!editFareSummary || !item.editable) && (
                      <span className="font-medium text-gray-800 dark:text-white">
                        {item.value}
                      </span>
                    )}
                    {editFareSummary && item.editable && (
                        <div className="flex flex-col">
                                   <input
                                      type="text"
                                      min={0}
                                      disabled={!canEditFareSummary}
                                      value={item.value}
                                      onChange={(e) => handleInputChange(e, item)}
                                      className="border border-gray-300 rounded p-1 text-right w-full mt-1 text-[8px] sm:text-sm"
                                      onClick={(e) => e.stopPropagation()}
                                    />


                            <span className="text-red-600"> {getError(item.key)}</span>
                        </div>
                    )}
                  </div>
                ))}
              {editFareSummary && (
                <div className="w-full flex items-center justify-end gap-4">
                  <Button
                    onClick={() => {
                      setEditFareSummary(false);
                      setShowUpdatedFare(false);
                      setValues(prev=> ({
                        ...rideDetails?.price_details_json
                      }))
                    }}
                    variant={"contained"}
                    color={"secondary"}
                  >
                    {"Cancel"}
                  </Button>
                  <Button
                    onClick={() => {handleUpdateFareSummaryButton()}}
                    variant={"contained"}
                    color={"primary"}
                  >
                    {showUpdatedFare? rideDetails?.is_collected? "Generate Invoice": "Update Fare": "Calulate Fare"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RideDetailsPage;
