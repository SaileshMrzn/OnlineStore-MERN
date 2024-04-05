import { configureStore } from "@reduxjs/toolkit";
import storeReducer from "./itemSlice";

export const store = configureStore({
  reducer: {
    items: storeReducer,
  },
});
