import React, { useState } from "react";
import {
  AppBar,
  Typography,
  Toolbar,
  Avatar,
  Box,
  Switch,
  SwitchProps,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import MenuIcon from "@mui/icons-material/Menu";
import { useDispatch } from "react-redux";
import { toggleTheme } from "../store/theme";
import { useSelector } from "react-redux";
import { RootState } from "../store/index";
import NavDrawer from "./NavDrawer";

const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

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
