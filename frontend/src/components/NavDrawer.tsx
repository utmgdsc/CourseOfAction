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
  useTheme,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/index";
import { useNavigate } from "react-router-dom";
import { setNotification } from "../store/user";
import axios from "axios";
import { apiURL } from "../utils/constant";
import CustomSpinner from "./CustomSpinner";
import { IOSSwitch } from "./IOSSwitch";
interface Props {
  isOpen: boolean;
  window?: () => Window;
  handleDrawerToggle: Function;
}

function NavDrawer({ isOpen, handleDrawerToggle, window }: Props) {
  const courses = useSelector((state: RootState) => state.courses);
  const user = useSelector((state: RootState) => state.user);
  const navigation = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [nLoading, setNLoading] = useState(false);

  const updateNotification = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNLoading(true);
    const data = {
      notification: event.target.checked === true ? 1 : 0,
    };
    axios
      .post(`${apiURL}/update-user-notification`, data)
      .then(() => {
        setNLoading(false);
        dispatch(setNotification(data));
      })
      .catch(() => {
        setNLoading(false);
      });
  };
  const drawerInfo = (
    <Box>
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <Divider />
        <List
          style={{
            height: `calc(100vh - ${theme.spacing(20)})`,
          }}
        >
          {["Dashboard", "Upcoming"].map((text, index) => (
            <ListItem
              button
              onClick={() => {
                navigation("/" + text.toLowerCase());
              }}
              sx={{ borderRadius: 2 }}
              key={index}
            >
              <ListItemText>
                <Typography sx={{ fontSize: "20px" }}>{text}</Typography>
              </ListItemText>
            </ListItem>
          ))}
          {courses.currentCourses.map((e, i) => (
            <ListItem
              button
              sx={{ borderRadius: 2 }}
              onClick={() => {
                navigation("/" + e.code.toLowerCase());
              }}
              key={e.code}
            >
              <ListItemText>
                <Typography sx={{ fontSize: "20px" }}>{e.code}</Typography>
              </ListItemText>
            </ListItem>
          ))}
        </List>
        <Box
          sx={{
            background: "rgba(navBackground.main, 0.8)",
            position: "fixed",
            bottom: 0,
            height: 80,
            width: "275px",
          }}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignContent="flex-end"
          key="addCourse"
        >
          {nLoading ? (
            <CustomSpinner />
          ) : (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ borderTop: 0.5, marginY: 0.5, paddingTop: 0.5 }}
            >
              Notification: OFF
              <IOSSwitch
                checked={user.notification === 1}
                onChange={updateNotification}
                sx={{ marginX: 1 }}
              />{" "}
              ON
            </Box>
          )}
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ color: "white" }}
            onClick={() => {
              navigation("/add");
            }}
            fullWidth
          >
            Add Course
          </Button>
        </Box>
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
