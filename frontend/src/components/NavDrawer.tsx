import React from "react";
import {
  Toolbar,
  Divider,
  List,
  ListItem,
  ListItemText,
  Drawer,
  Box,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../store/index";

function NavDrawer() {
  const courses = useSelector((state: RootState) => state.courses);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: "275px",
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: "275px", boxSizing: "border-box" },
        paper: {
          backgroundColor: "#484848",
        },
      }}
      anchor="right"
    >
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <Divider />
        <List>
          {["Dashboard", "Upcoming"]
            .concat(courses.currentCourses.map((e) => e.code))
            .map((text, index) => (
              <ListItem button sx={{ borderRadius: 2 }} key={index}>
                <ListItemText>
                  <Typography sx={{ fontSize: "20px" }}>{text}</Typography>
                </ListItemText>
              </ListItem>
            ))}
        </List>
      </Box>
    </Drawer>
  );
}

export default NavDrawer;
