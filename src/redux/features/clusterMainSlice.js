import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/app/lib/apiClient"; // <-- already used

// ------------------- POST: create cluster -------------------
export const createCluster = createAsyncThunk(
    "clusterMain/createCluster",
    async (payload, { rejectWithValue }) => {
        try {
            const res = await apiClient("POST", "/clusters/create", payload, true);
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// ------------------- GET: fetch city list -------------------
export const fetchCityList = createAsyncThunk(
    "clusterMain/fetchCityList",
    async (_, { rejectWithValue }) => {
        try {
            const res = await apiClient("GET", "/city/getCityList", "", true);
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

//  ------------------- POST: search City by name -------------------
export const searchCityByName = createAsyncThunk(
    "clusterMain/searchCityByName",
    async (body, { rejectWithValue }) => {
        try {
            const res = await apiClient("POST", `/City/searchCity`, body, true);
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// ------------------- GET: fetch clusters by city -------------------
export const fetchClusterByCity = createAsyncThunk(
    "clusterMain/fetchClusterByCity",
    async (cityId, { rejectWithValue }) => {
        try {
            const res = await apiClient(
                "GET",
                `/city/get-city-details/${cityId}`,
                "",
                true
            );
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
// ------------------- GET: fetch global price details -------------------
export const fetchGlobalPriceDetails = createAsyncThunk(
    "clusterMain/fetchGlobalPriceDetails",
    async (_,{ rejectWithValue }) => {
        try {
            const res = await apiClient(
                "GET",
                `/global_cluster_price/clusterGlobalprice`,
                "",
                true
            );
            return res.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const clusterMainSlice = createSlice({
    name: "clusterMain",
    initialState: {
        loading: false,
        cluster: null,     // POST response
        cityList: [],      // GET city list response
        clusters: [],      // clusters by city
        fareList: [],      // global price details
        error: null,
    },
    reducers: {
        resetClusterState: (state) => {
            state.loading = false;
            state.cluster = null;
            state.cityList = [];
            state.clusters = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // ---- createCluster ----
        builder
            .addCase(createCluster.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCluster.fulfilled, (state, action) => {
                state.loading = false;
                state.cluster = action.payload;
            })
            .addCase(createCluster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ---- fetchCityList ----
        builder
            .addCase(fetchCityList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCityList.fulfilled, (state, action) => {
                state.loading = false;
                state.cityList = action.payload;
            })
            .addCase(fetchCityList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ---- fetchClusterByCity ----
        builder
            .addCase(fetchClusterByCity.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchClusterByCity.fulfilled, (state, action) => {
                state.loading = false;
                state.clusters = action.payload;
            })
            .addCase(fetchClusterByCity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
        // ---- searchCityByName ----
        builder
            .addCase(searchCityByName.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchCityByName.fulfilled, (state, action) => {
                state.loading = false;
                // Assuming you want to store search results in cityList
                state.cityList = action.payload;
            })
            .addCase(searchCityByName.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
        // ---- fetchGlobalPriceDetails ----
        builder
            .addCase(fetchGlobalPriceDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGlobalPriceDetails.fulfilled, (state, action) => {
                state.loading = false;
                // Assuming you want to store global price details in fareList
                state.fareList = action.payload;
            })
            .addCase(fetchGlobalPriceDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetClusterState } = clusterMainSlice.actions;
export default clusterMainSlice.reducer;
