import { createSlice } from "@reduxjs/toolkit";

export interface Assessment {
  reminder: string;
  deadline: string;
  mark: number;
  weight: number;
  name: string;
}

export interface CourseInterface {
  code: string;
  expectedMark: number;
  familiarity: number;
  offering: string;
  currMark: number; // calculated
  assessments: Assessment[];
  notification: number;
}

interface Courses {
  currentCourses: CourseInterface[];
}

const initialState: Courses = {
  currentCourses: [],
};

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    addCourse(state, { payload }) {
      state.currentCourses.push(payload);
    },
    setCourses(state, { payload }) {
      return { ...state, currentCourses: Object.values(payload) };
    },
    updateAssessments(state, { payload }) {
      const { code, assessments, currMark } = payload;
      const courseIndex = state.currentCourses.findIndex(
        (course) => course.code === code
      );

      if (courseIndex === -1) {
        // Error handling
        return;
      }
      state.currentCourses[courseIndex].assessments = assessments;
      state.currentCourses[courseIndex].currMark = currMark;
    },
    updateCourse(state, { payload }) {
      const { code, familiarity, expectedMark } = payload;
      const courseIndex = state.currentCourses.findIndex(
        (course) => course.code === code
      );

      if (courseIndex === -1) {
        // Error handling
        return;
      }
      state.currentCourses[courseIndex].expectedMark = expectedMark;
      state.currentCourses[courseIndex].familiarity = familiarity;
    },
    deleteCourse(state, { payload }) {
      const { code } = payload;
      const courseIndex = state.currentCourses.findIndex(
        (course) => course.code === code
      );

      if (courseIndex === -1) {
        // Error handling
        return;
      }
      state.currentCourses.splice(courseIndex, 1);
    },
  },
});

export const {
  addCourse,
  setCourses,
  updateAssessments,
  updateCourse,
  deleteCourse,
} = coursesSlice.actions;
export default coursesSlice.reducer;
