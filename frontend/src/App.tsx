import React, { useEffect } from "react";
import "./App.css";
import Course from "./modules/Course";
import AddCourse from "./modules/AddCourse";
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
import Dashboard from "./modules/DashBoard";
import axios from "axios";
import { apiURL } from "./utils/constant";
import { CourseInterface, setCourses } from "./store/courses";

function App() {
  const courses = useSelector(
    (store: RootState) => store.courses.currentCourses
  );
  const themeMode = useSelector((store: RootState) => store.theme.darkMode);
  const dispatch = useDispatch();

  const [cookies, setCookies] = useCookies(["darkMode"]);

  useEffect(() => {
    axios({
      method: "POST",
      url: `${apiURL}/get_courses`,
    })
      .then((res) => {
        // update redux state
        dispatch(setCourses(res.data));
      })
      .catch((err) => {
        console.log(err);
      });
    if (!cookies["darkMode"]) {
      setCookies("darkMode", true);
    } else
      dispatch(updateThemeMode({ darkMode: cookies["darkMode"] === "true" }));
  }, []);
  return (
    <ThemeProvider theme={themeMode ? dark_theme : light_theme}>
      <CssBaseline>
        <CookiesProvider>
          <Box>
            <BrowserRouter>
              <Navbar updateThemeCookie={setCookies} />
              <Box
                component="main"
                sx={{ mr: { md: "275px", xl: "0" } }}
                mt="75px"
              >
                <Routes>
                  <Route
                    path="/"
                    element={<Course courseInfo={courses[0]} />}
                  />
                  <Route path="/add" element={<AddCourse />} />
                  <Route
                    path="/dashboard"
                    element={<Dashboard courses={courses} />}
                  />
                  {courses.map(
                    (
                      e //add routes for all courses
                    ) => (
                      <Route
                        path={e.code}
                        element={<Course courseInfo={e} />}
                      />
                    )
                  )}
                </Routes>
              </Box>
            </BrowserRouter>
          </Box>
        </CookiesProvider>
      </CssBaseline>
    </ThemeProvider>
  );
}

export default App;
