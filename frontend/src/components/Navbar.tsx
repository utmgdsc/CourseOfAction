import React from "react";
import { AppBar, Typography, Toolbar } from "@mui/material";

function Navbar() {
  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <Typography
          fontWeight="bold"
          fontSize="30px"
          color="primary.main"
          noWrap
          component="div"
        >
          CourseOfAction
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
