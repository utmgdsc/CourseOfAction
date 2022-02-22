import { createSlice } from "@reduxjs/toolkit";

interface ThemeMode {
  darkMode: Boolean;
}

const initialState: ThemeMode = {
  darkMode: true,
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme(state) {
      state.darkMode = state.darkMode === true ? false : true;
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
