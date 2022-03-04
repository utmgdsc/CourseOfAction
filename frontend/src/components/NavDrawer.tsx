import React, { useState } from "react";
import {
  Toolbar,
  Divider,
  List,
  ListItem,
  ListItemText,
  Drawer,
  Box,
  Typography,
  Button,
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../store/index";
import { useNavigate } from "react-router-dom";
interface Props {
  isOpen: boolean;
  window?: () => Window;
  handleDrawerToggle: Function;
}

function NavDrawer({ isOpen, handleDrawerToggle, window }: Props) {
  const courses = useSelector((state: RootState) => state.courses);
  const navigation = useNavigate();
  const drawerInfo = (
    <Box>
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
          <ListItem sx={{ borderRadius: 2 }} key="addCourse">
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ color: "white" }}
              onClick={() => {
                navigation("/add");
              }}
            >
              Add Course
            </Button>
          </ListItem>
        </List>
      </Box>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box>
      <Drawer
        variant="permanent"
        sx={{
          width: "275px",
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: "275px", boxSizing: "border-box" },
          display: { xs: "none", md: "block" },
        }}
        anchor="right"
      >
        {drawerInfo}
      </Drawer>
      <Drawer
        variant="temporary"
        container={container}
        sx={{
          width: "275px",
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: "275px", boxSizing: "border-box" },
          display: { xs: "block", md: "none" },
        }}
        anchor="right"
        open={isOpen}
        onClose={() => handleDrawerToggle()}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        {drawerInfo}
      </Drawer>
    </Box>
  );
}

export default NavDrawer;
