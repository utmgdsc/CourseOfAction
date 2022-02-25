import React, { useEffect } from "react";
import "./App.css";
import Course from "./components/Course";
import AddCourse from "./pages/AddCourse";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";
import Navbar from "./components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store/index";
import { ThemeProvider } from "@mui/material/styles";
import { dark_theme, light_theme } from "./theme";
import { CssBaseline } from "@mui/material";
import { useCookies, CookiesProvider } from "react-cookie";
import { updateThemeMode } from "./store/theme";

function App() {
  const courses = useSelector(
    (store: RootState) => store.courses.currentCourses
  );

  const themeMode = useSelector((store: RootState) => store.theme.darkMode);

  const dispatch = useDispatch();

  const [cookies, setCookies] = useCookies(["darkMode"]);

  useEffect(() => {
    if (!cookies["darkMode"]) {
      console.log(cookies["darkMode"], "HERE");
      setCookies("darkMode", true);
    } else
      dispatch(updateThemeMode({ darkMode: cookies["darkMode"] === "true" }));
  }, []);

  return (
    <ThemeProvider theme={themeMode ? dark_theme : light_theme}>
      <CssBaseline>
        <CookiesProvider>
          <Box>
            <Navbar updateThemeCookie={setCookies} />
            <Box component="main" sx={{ mr: { md: "275px" } }} mt="75px">
              <BrowserRouter>
                <Routes>
                  <Route
                    path="/"
                    element={<Course courseInfo={courses[0]} />}
                  />
                  <Route
                    path="/add"
                    element={<AddCourse />}
                  />
                </Routes>
              </BrowserRouter>
            </Box>
          </Box>
        </CookiesProvider>
      </CssBaseline>
    </ThemeProvider>
  );
}

export default App;
