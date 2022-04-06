import { createSlice } from "@reduxjs/toolkit";

interface UserInfo {
  notification: 0 | 1;
}

const initialState: UserInfo = {
  notification: 0,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setNotification(state, { payload }) {
      const { notification } = payload;
      state.notification = notification;
    },
  },
});

export const { setNotification } = userSlice.actions;
export default userSlice.reducer;
