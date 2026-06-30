import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/app/lib/apiClient";

// ------------------- GET: fetch cab model list -------------------
export const fetchCabModelList = createAsyncThunk(
    "rbCabMain/fetchCabModelList",
    async (_, { rejectWithValue }) => {
        try {
            const res = await apiClient("GET", "/rb_cabs/cabModelList", "", true);
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// ------------------- GET: fetch cab type list -------------------
export const fetchCabTypeList = createAsyncThunk(
    "rbCabMain/fetchCabTypeList",
    async (_, { rejectWithValue }) => {
        try {
            const res = await apiClient("GET", "/rb_cabs/getCabTypeList", "", true);
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchCabFuelList = createAsyncThunk(
    "rbCabMain/fetchCabFuelList",
    async (_, { rejectWithValue }) => {
        try {
            const res = await apiClient("GET", "/rb_cabs/getFuelTypeList", "", true);
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);





const initialState = {
    page: "MyCabs",
    selectedCabId: null,
    cabModels: [],   // cab model list
    cabTypes: [],    // ✅ cab type list ke liye naya state
    loading: false,
    error: null,
};

const rbCabMainSlice = createSlice({
    name: "rbCabMain",
    initialState,
    reducers: {
        setPage: (state, action) => {
            state.page = action.payload;
        },
        setCabId: (state, action) => {
            state.selectedCabId = action.payload;
        },
        reset: (state) => {
            state.page = "MyCabs";
            state.selectedCabId = null;
            state.cabModels = [];
            state.cabTypes = [];   // ✅ reset me bhi clear karo
            cabFuel: [],
                state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // ---- fetchCabModelList ----
            .addCase(fetchCabModelList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCabModelList.fulfilled, (state, action) => {
                state.loading = false;
                state.cabModels = action.payload;
            })
            .addCase(fetchCabModelList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ---- fetchCabTypeList ---- ✅ yeh naya builder
            .addCase(fetchCabTypeList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCabTypeList.fulfilled, (state, action) => {
                state.loading = false;
                state.cabTypes = action.payload;
            })
            .addCase(fetchCabTypeList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            // ---- fetchCabFuelList ---- ✅ yeh naya builder
            .addCase(fetchCabFuelList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCabFuelList.fulfilled, (state, action) => {
                state.loading = false;
                state.cabFuel = action.payload;
            })
            .addCase(fetchCabFuelList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });


    },
});

export const { setPage, setCabId, reset } = rbCabMainSlice.actions;
export default rbCabMainSlice.reducer;
