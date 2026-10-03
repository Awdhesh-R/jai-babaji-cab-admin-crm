// lib/apiClient.js
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.jaibabajicab.com";
// const BASE_URL = "https://api.jaibabajicab.com/admin"

export const apiClient = async (
  method,
  endpoint,
  payload = {},
  header = null,
  isAdmin = true,
  isOlaAPI = false
) => {
  let token = null;
  let userId = null;

  if (typeof window !== "undefined") {
    token = localStorage.getItem("token") || Cookies.get("adminAuthToken");
    if (token && !isAdmin) {
      try {
        const decoded = await jwtDecode(token);
        userId = decoded.user_id || decoded.id || decoded.actId || null;
        if (method.toUpperCase() === "GET") {
          // Removed console.log for security - endpoint not exposed
          if (userId && endpoint.includes(":userId")) {
            endpoint = endpoint.replace(":userId", userId);
          }
        }
      } catch (err) {
        console.error("Invalid Token:", err.message);
      }
    }
  }

  // Add security headers to make API calls harder to intercept
  const timestamp = Date.now();
  const nonce =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  const config = {
    method,
    url: `${
      isOlaAPI ? "" : BASE_URL.replace(/\/$/, "") + (isAdmin ? "/admin" : "/api/v1")
    }${endpoint}`,
    //url: `${isOlaAPI ? "" : BASE_URL + "/admin"}${endpoint}`,
    headers: {
      "Content-Type": "application/json",
      "X-Request-ID": nonce, // Unique request ID
      ...(!isOlaAPI && { "X-Timestamp": timestamp.toString() }),
      "X-Requested-With": "XMLHttpRequest",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(header && header),
    },
    ...(!isOlaAPI && { withCredentials: true }),
  };

  if (method.toUpperCase() === "GET") {
    config.params = payload;
  } else {
    config.data = payload;
  }

  try {
    const response = await axios(config);
    return response?.data;
  } catch (error) {
    // Removed console.log for security - error details not exposed
    const status = error?.response?.status;
    if (
      typeof window !== "undefined" &&
      !isOlaAPI &&
      (status === 401 || (status === 403 && endpoint !== "/search_service" && endpoint !== "/ride_management/add-admin-booking" && !endpoint.includes("/getUpdatedEstimatedFare")))
    ) {
      localStorage.clear();
      Cookies.remove("adminAuthToken", { path: '/' });
      window.location.href = "/auth/signin";
    }
    return {
      success: false,
      message: error?.response?.data?.message || "Something went wrong",
    };
  }
};
