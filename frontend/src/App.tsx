import React from "react";
import "./App.css";
import Course from "./components/Course";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";
import NavDrawer from "./components/NavDrawer";
import Navbar from "./components/Navbar";
import { useSelector } from "react-redux";
import { RootState } from "./store/index";
import { ThemeProvider } from "@mui/material/styles";
import { dark_theme, light_theme } from "./theme";
import { CssBaseline } from "@mui/material";

function App() {
  const courses = useSelector(
    (store: RootState) => store.courses.currentCourses
  );

  const themeMode = useSelector((store: RootState) => store.theme.darkMode);

  return (
    <ThemeProvider theme={themeMode ? dark_theme : light_theme}>
      <CssBaseline>
        <Box>
          <Navbar />
          <NavDrawer />
          <Box component="main" mr="275px" mt="75px">
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Course courseInfo={courses[0]} />} />
              </Routes>
            </BrowserRouter>
          </Box>
        </Box>
      </CssBaseline>
    </ThemeProvider>
  );
}

export default App;
