import React from "react";
import "./App.css";
import Course from "./components/Course";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";

function App() {
  return (
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
  );
}

export default App;
