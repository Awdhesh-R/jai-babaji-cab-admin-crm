import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const setCabListInSlice = createAsyncThunk(
    "findCab/setCabListInSlice",
    async (cabList,{ rejectWithValue }) => {
        try {
            console.log(cabList)
            return cabList;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const findCabSlice = createSlice({
    name: "findCab",
    initialState: {
        loading: false,
        cabList: null,
        error: null,
    },
    reducers: {
        resetFindCabState: (state) => {
            state.loading = false;
            state.cabList = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // ---- createCluster ----
        builder
            .addCase(setCabListInSlice.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(setCabListInSlice.fulfilled, (state, action) => {
                state.loading = false;
                console.log(action.payload);
                state.cabList = action.payload;
            })
            .addCase(setCabListInSlice.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetFindCabState } = findCabSlice.actions;
export default findCabSlice.reducer;
