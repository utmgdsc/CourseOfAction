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
import { fontSize } from "@mui/system";

function NavDrawer() {
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
    >
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <Divider />
        <List>
          {["Dashboard", "CSC108H5", "CSC148H5", "Upcoming"].map(
            (text, index) => (
              <ListItem button sx={{ borderRadius: 2 }} key={text}>
                <ListItemText>
                  <Typography sx={{ fontSize: "20px" }}>{text}</Typography>
                </ListItemText>
              </ListItem>
            )
          )}
        </List>
      </Box>
    </Drawer>
  );
}

export default NavDrawer;
