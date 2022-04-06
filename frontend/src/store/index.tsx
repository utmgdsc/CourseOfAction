import { configureStore } from "@reduxjs/toolkit";
import coursesReducer from "./courses";
import themeReducer from "./theme";
import userReducer from "./user";

const store = configureStore({
  reducer: {
    courses: coursesReducer,
    theme: themeReducer,
    user: userReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export default store;
