import React, { useState } from "react";
import {
  AppBar,
  Typography,
  Toolbar,
  Avatar,
  Box,
  IconButton,
} from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../store/theme";
import { RootState } from "../store/index";
import NavDrawer from "./NavDrawer";
import { IOSSwitch } from "./IOSSwitch";

interface propTypes {
  updateThemeCookie: Function;
}

function Navbar({ updateThemeCookie }: propTypes) {
  const dispatch = useDispatch();
  const darkMode = useSelector((store: RootState) => store.theme.darkMode);
  const [isMobileDrawer, setIsMobileDrawer] = useState(false);

  const handleDrawerToggle = () => {
    setIsMobileDrawer(!isMobileDrawer);
  };

  return (
    <Box>
      <NavDrawer
        isOpen={isMobileDrawer}
        handleDrawerToggle={handleDrawerToggle}
      />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Link to="/dashboard" style={{ textDecoration: "none" }}>
            <Box sx={{ display: "flex" }}>
              <Avatar sx={{ mr: "5px" }} src="/coa/app/grade.png" />
              <Typography
                fontWeight="bold"
                fontSize="30px"
                color="primary.main"
                noWrap
                component="div"
                display={["none", "block"]}
              >
                CourseOfAction
              </Typography>
            </Box>
          </Link>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <LightModeIcon fontSize="large" />
              <IOSSwitch
                sx={{ m: 1 }}
                checked={darkMode.valueOf()}
                onChange={() => {
                  updateThemeCookie("darkMode", !darkMode.valueOf());
                  dispatch(toggleTheme());
                }}
              />
              <DarkModeIcon fontSize="large" />
            </Box>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerToggle}
              sx={{ ml: 2, display: { md: "none" } }}
            >
              <MenuIcon fontSize="large" />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Navbar;
