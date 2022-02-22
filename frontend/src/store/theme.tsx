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
    updateThemeMode(state, { payload }) {
      const { darkMode } = payload;
      console.log(state.darkMode, darkMode);
      state.darkMode = darkMode;
    },
  },
});

export const { toggleTheme, updateThemeMode } = themeSlice.actions;
export default themeSlice.reducer;
