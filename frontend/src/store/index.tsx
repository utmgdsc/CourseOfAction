import { configureStore } from "@reduxjs/toolkit";
import coursesReducer from "./courses";

const store = configureStore({
  reducer: {
    courses: coursesReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export default store;
