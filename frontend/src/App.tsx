import React from "react";
import "./App.css";
import Course from "./components/Course";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Button from "@mui/material/Button";
import { Box, Typography } from "@mui/material";

function App() {
  return (
    <Box component="main">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <Course />
                <Button variant="contained">
                  <Typography color="white">Hello World </Typography>
                </Button>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </Box>
  );
}

export default App;
