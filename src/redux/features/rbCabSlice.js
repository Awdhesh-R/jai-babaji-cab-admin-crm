import { createSlice } from "@reduxjs/toolkit";

//Fullformstate
const initialState = {
  formData: {
    registrationNumber: "",
    carType: "",
    cabServiceType: "",
    carModel: "",
    fuelType: "",
    carrier: "",
  },
  uploads: {},
  progressPercentage: 0,
  showPopup: false,
  flagForPopUp: false,
  uploadImageCount: 0,
};


const rbCabSlice = createSlice({
  name: "rbCab",
  initialState,
  reducers: {
    setFormData: (state, action) => {
      if (!state.formData) return; // agar form  init na hua ho to skip
      state.formData = { ...state.formData, ...action.payload };
    },
    setUploads: (state, action) => {
      if (!state.uploads) return;
      state.uploads = { ...state.uploads, ...action.payload };
    },
    setProgress: (state, action) => {
      if (state.progressPercentage === undefined) return;
      state.progressPercentage = action.payload;
    },
    setShowPopup: (state, action) => {
      if (state.showPopup === undefined) return;
      state.showPopup = action.payload;
    },
    setFlagForPopUp: (state, action) => {
      if (state.flagForPopUp === undefined) return;
      state.flagForPopUp = action.payload;
    },
    setUploadImageCount: (state, action) => {
      if (state.uploadImageCount === undefined) return;
      state.uploadImageCount = action.payload;
    },
    resetForm: () => initialState, // 👈 wapas sirf MyCab page pe aa jayega
  },
});

export const {
  initFormState,
  setFormData,
  setUploads,
  setProgress,
  setShowPopup,
  setFlagForPopUp,
  setUploadImageCount,
  resetForm,
} = rbCabSlice.actions;

export default rbCabSlice.reducer;
