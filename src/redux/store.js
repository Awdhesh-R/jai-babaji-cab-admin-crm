import { configureStore } from '@reduxjs/toolkit';
import rbCabReducer from './features/rbCabSlice';
import cabsReducer from './features/cabsSlice'
import cabOverviewReducer from './features/cabOverviewSlice'
import rbCabMainReducer from './features/rbCabMainSlice'
import signInPageReducer from './features/signInPageSlice';
import clusterMainReducer from './features/clusterMainSlice';
import findCabReducer from "./features/findCabSlice";
import headerReducer from './features/headerSlice'

export const store = configureStore({
  reducer: {
    rbCab: rbCabReducer,   // 👈 slice ko register karo
    cabs: cabsReducer,
    cabOverview: cabOverviewReducer,
    rbCabMain: rbCabMainReducer,
    signInPage: signInPageReducer,
    clusterMain: clusterMainReducer,
    findCab: findCabReducer,
    header: headerReducer,
  }
});
