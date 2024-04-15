import { configureStore } from "@reduxjs/toolkit";
import storeReducer from "./itemSlice";
import dbReducer from "./dbSlice";

export const store = configureStore({
  reducer: {
    items: storeReducer,
    db: dbReducer,
  },
});
