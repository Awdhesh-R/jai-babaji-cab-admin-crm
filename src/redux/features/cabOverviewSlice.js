
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/app/lib/apiClient";

export const fetchCabOverview = createAsyncThunk(
    "cabOverview/fetchCabOverview",
    async (cabId, { rejectWithValue }) => {
        try {
            const res = await apiClient("GET", `/rb_cabs/rbCabsDetails/${cabId}`, null, true);
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const cabOverviewSlice = createSlice({
    name: "cabOverview",
    initialState: {
        data: [],
        overview: null,
        loading: false,
        error: null,
        counts: {},
        selectedCabId: null,
    },
    reducers: {
        setCabId: (state, action) => {
            state.selectedCabId = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCabOverview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCabOverview.fulfilled, (state, action) => {
                state.loading = false;
                state.overview = action.payload;
            })
            .addCase(fetchCabOverview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch cab overview";
            });
    },
});
export const { setPage, setCabId } = cabOverviewSlice.actions;
export default cabOverviewSlice.reducer;
