// src/redux/features/signInPageSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/app/lib/apiClient";

const initialState = {
  currentPage: "pageOne",
  loading: false,
  error: null,
  otpResponse: null,
  mobile: "", // store mobile globally
};

const geUserCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(position);
        },
        (error) => {
          console.log(error);
          reject(error);
        }
      );
    } else {
      reject(new Error("Geolocation is not supported by this browser"));
    }
  });
}

// Async thunk using apiClient
export const sendOtp = createAsyncThunk(
  "signInPage/sendOtp",
  async (mobile_no, { rejectWithValue }) => {
    try {

     const position = await geUserCurrentLocation();

     const coords = {
       latitude: position.coords.latitude,
       longitude: position.coords.longitude,
      //  accuracy: position.coords.accuracy,
      //  altitude: position.coords.altitude,
      //  altitudeAccuracy: position.coords.altitudeAccuracy,
      //  heading: position.coords.heading,
      //  speed: position.coords.speed
     };

      const res = await apiClient("POST", "/rbac/send-otp-Ffii0ZUonbPrHJb9Xztn82qP", { mobile_no, ...coords });

      // Handle API response for registered/unregistered numbers
      if (res.statusCode === 200 && res.message === "Please Enter Register Mobile No") {
        return rejectWithValue("Please Enter Register Mobile No.");
      }

      return res; // ✅ successful OTP response
    } catch (err) {
      return rejectWithValue(err.message || "Something went wrong");
    }
  }
);

const signInPageSlice = createSlice({
  name: "signInPage",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
    resetPage: (state) => {
      state.currentPage = "pageOne";
      state.mobile = "";
      state.otpResponse = null;
      state.error = null;
    },
    setMobile: (state, action) => {
      state.mobile = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.otpResponse = action.payload;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // error message from API
      });
  },
});

export const { setPage, resetPage, setMobile } = signInPageSlice.actions;
export default signInPageSlice.reducer;
