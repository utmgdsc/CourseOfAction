import { createSlice, current } from "@reduxjs/toolkit";

export interface Assessment {
  customReminder: string;
  deadline: string;
  isCompleted: boolean;
  mark: number;
  reminder: string;
  weight: number;
  name: string;
}

export interface CourseInterface {
  code: string;
  name: string;
  credit: number;
  expectedMark: number;
  familiarity: number;
  offering: string;
  currMark: number; // calculated
  scoreRequired: number;
  percentLeft: number;
  assessments: Assessment[];
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
    addAssessment(state, { payload }) {
      const { courseCode, assessment } = payload;
      const courseIndex = state.currentCourses.findIndex(
        (course) => course.code === courseCode
      );
      if (courseIndex === -1) {
        // Error handling
        return;
      }
      state.currentCourses[courseIndex].assessments.push(assessment);
    },
    deleteAssessment(state, { payload }) {
      const { courseCode, assessmentName } = payload;

      const courseIndex = state.currentCourses.findIndex(
        (course) => course.code === courseCode
      );

      if (courseIndex === -1) {
        // Error handling
        return;
      }
      const indexToDelete = state.currentCourses[
        courseIndex
      ].assessments.findIndex((element) => element.name === assessmentName);
      state.currentCourses[courseIndex].assessments.splice(indexToDelete, 1);
    },
    updateAssessments(state, { payload }) {
      const { courseCode, assessments } = payload;
      const courseIndex = state.currentCourses.findIndex(
        (course) => course.code === courseCode
      );

      if (courseIndex === -1) {
        // Error handling
        return;
      }
      state.currentCourses[courseIndex].assessments = assessments;
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
  },
});

export const {
  addCourse,
  setCourses,
  deleteAssessment,
  addAssessment,
  updateAssessments,
  updateCourse,
} = coursesSlice.actions;
export default coursesSlice.reducer;
