import axios from "axios";

// Public API instance (no token)
const publicAPI = axios.create({
//   baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Private API instance (with token if available)
const privateAPI = axios.create({
//   baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token dynamically for private requests
privateAPI.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const callPublicAPI = async ({ method = "GET", endpoint = "", payload = null, params = null }) => {
  try {
    const response = await publicAPI({
      method,
      url: endpoint,
      data: payload,
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Public API Error:", error?.response?.data || error.message);
    throw error?.response?.data || { message: "Something went wrong!" };
  }
};

export const callPrivateAPI = async ({ method = "GET", endpoint = "", payload = null, params = null }) => {
  try {
    const response = await privateAPI({
      method,
      url: endpoint,
      data: payload,
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Private API Error:", error?.response?.data || error.message);
    throw error?.response?.data || { message: "Something went wrong!" };
  }
};
