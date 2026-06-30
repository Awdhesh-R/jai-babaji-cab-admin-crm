import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@/app/lib/apiClient';

// Async thunk to fetch all cabs
export const fetchCabs = createAsyncThunk(
    'cabs/fetchCabs',
    async (_, { rejectWithValue }) => {
        try {
            const res = await apiClient("GET", `/rb_cabs/getAllCabs`, "", true);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

const cabsSlice = createSlice({
    name: 'cabs',
    initialState: {
        data: [],
        loading: false,
        error: null,
        page: "",
        counts: {
            active: 0,
            inactive: 0,
            mini: 0,
            suv: 0,
            sedan: 0,
            inMini: 0,
            inSuv: 0,
            inSedan: 0,
        },
    },
    reducers: {
       
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCabs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCabs.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;

                // Compute counts
                const counts = {
                    active: 0,
                    inactive: 0,
                    mini: 0,
                    suv: 0,
                    sedan: 0,
                    inMini: 0,
                    inSuv: 0,
                    inSedan: 0,
                };

                action.payload.forEach((details) => {
                    const status = details.cab_status?.toLowerCase();
                    const type = details.cab_name?.toLowerCase();
                    if (status === 'active') {
                        counts.active++;
                        if (type === 'mini') counts.mini++;
                        else if (type === 'suv') counts.suv++;
                        else counts.sedan++;
                    }
                    if (status === 'inactive') {
                        counts.inactive++;
                        if (type === 'mini') counts.inMini++;
                        else if (type === 'suv') counts.inSuv++;
                        else counts.inSedan++;
                    }
                });

                state.counts = counts;
            })
            .addCase(fetchCabs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Something went wrong';
            });
    },
});
export const { setPage} = cabsSlice.actions;
export default cabsSlice.reducer;
