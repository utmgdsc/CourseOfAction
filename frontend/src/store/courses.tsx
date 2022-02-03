import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentCourses: {
    CRC100: {
      assessments: {
        assessment1: {
          customReminder: "2022/01/16", // Need to be date, error in database
          deadline: "2022/01/22",
          isCompleted: "True",
          mark: 88,
          reminder: "2022/01/19",
          weight: 25,
        },
      },
      courseName: "Course1",
      credit: 0.5,
      expectedGrade: 90,
      familiarity: 5,
      offering: "W2022",
    },
  },
  value: 0,
};

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    addCourses(state, action) {
      state.value++;
    },
  },
});

export default coursesSlice.reducer;
