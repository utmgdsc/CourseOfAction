import React from "react";
import { AppBar, Typography, Toolbar, Avatar } from "@mui/material";

function Navbar() {
  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <Avatar sx={{ mr: "5px" }} src="/grade.png" />
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
