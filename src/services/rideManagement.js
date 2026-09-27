import { apiClient } from "@/app/lib/apiClient";
import { getCabType } from "@/helpers/utils";

export const probableCab = async (cabData, driverData, rideDetails, changeReason, isProbabled) => {
    const payData = {
        driver_id: driverData?.driver_id ?? "",
        drv_name: driverData?.driver_name ?? "",
        driver_mobile: driverData?.driver_mobile ?? "",
        drv_wa_number: driverData?.driver_whatsapp ?? driverData?.driver_mobile ?? "",
        driver_image: driverData?.driver_image ?? "",
        urid: rideDetails?.urid ?? rideDetails?.id ?? "",
        cab_reg: cabData?.cab_reg ?? "",
        cab_id: cabData?.cab_id ?? "",
        cab_model: cabData?.cab_model ?? "",
        cab_source: cabData?.cab_source ?? "",
        cab_type: getCabType(cabData?.cab_type),
        fleet_rate_per_km: cabData?.cab_source === "Operator"? cabData?.fleet_rate_per_km: "",
        fleet_fixed_rate: cabData?.cab_source === "Operator"? cabData?.fleet_fixed_rate: "",
        ...(isProbabled && { reason: changeReason }),
    };

    const response = await apiClient(
        "POST",
        "/rb_cabs/addCabInProbabal",
        JSON.stringify(payData),
        true
    );

    return response;
};

export const assignCab = async (cabData, driverData, rideDetails, changeReason) => {
    if (!cabData) throw new Error("Please select a cab!");
    if (!driverData) throw new Error("Please select a driver!");

    const payData = {
        driver_id: driverData?.driver_id ?? "",
        drv_name: driverData?.driver_name ?? driverData?.drv_name ?? "",
        driver_mobile: driverData?.driver_mobile ?? driverData?.mobile_no ?? "",
        drv_wa_number: driverData?.driver_whatsapp ?? driverData?.driver_wa_number ?? driverData?.driver_mobile ?? driverData?.mobile_no ?? "",
        driver_image: driverData?.driver_image ?? "",
        urid: rideDetails?.urid ?? rideDetails?.id ?? "",
        cab_reg: cabData?.cab_reg ?? "",
        cab_id: cabData?.cab_id ?? "",
        cab_model: cabData?.cab_model ?? "",
        cab_source: cabData?.cab_source ?? cabData?.source ?? "",
        reason: changeReason ?? "",
        cab_type: getCabType(cabData?.cab_type ?? cabData?.cab_type_id),
    };

    const response = await apiClient(
        "POST",
        "/rb_cabs/assignedRbCabs",
        JSON.stringify(payData),
        true
    );

    return response;
};

export const arrivedCab = async (urid) => {
    console.log("urid", urid)
    const response = await apiClient(
        "POST",
        "/ride_management/trip-arrived",
        JSON.stringify({ urid }),
        true
    );
    return response;
};

export const startTrip = async (urid, start_km) => {
    const payData = { urid, start_km };
    return apiClient("POST", "/ride_management/trip-start", JSON.stringify(payData), true);
};

// End trip
export const endTrip = async (urid, end_km, source) => {
    const payData = { urid, end_km, source };
    return apiClient("POST", "/ride_management/trip-end", JSON.stringify(payData), true);
};

// Collect cash
export const collectCash = async (urid, source) => {
    const payData = { source};
    return apiClient("PUT", `/ride_management/cash-collected-by-driver/${urid}`,JSON.stringify(payData), true);
};