import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  title: 'Fleet Command Center',
  subtitle: 'Real-time fleet management and analytics'
};

export const headerSlice = createSlice({
  name: 'header',
  initialState,
  reducers: {
    setHeader: (state, action) => {
      state.title = action.payload.title || initialState.title;
      state.subtitle = action.payload.subtitle || initialState.subtitle;
    },
    resetHeader: (state) => {
      state.title = initialState.title;
      state.subtitle = initialState.subtitle;
    }
  }
});

export const { setHeader, resetHeader } = headerSlice.actions;
export default headerSlice.reducer;