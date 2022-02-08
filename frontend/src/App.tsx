import React from "react";
import "./App.css";
import Course from "./components/Course";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";
import NavDrawer from "./components/NavDrawer";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Box>
      <Navbar />
      <NavDrawer />
      <Box component="main" ml="275px" mt="75px">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Course />} />
          </Routes>
        </BrowserRouter>
      </Box>
    </Box>
  );
}

export default App;
