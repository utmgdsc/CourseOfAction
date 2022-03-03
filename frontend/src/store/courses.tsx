import { createSlice } from "@reduxjs/toolkit";

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
  currentCourses: [
    {
      assessments: [
        {
          name: "Assignment 1",
          customReminder: "01/16/2022", // Need to be date, error in database
          deadline: "01/22/2022", // Need to be date, error in database
          isCompleted: true, // Need to be boolean, error in database
          mark: 88,
          reminder: "01/19/2022", // Need to be date, error in database
          weight: 25,
        },
      ],
      name: "Introduction to Computer Programming",
      credit: 0.5,
      expectedMark: 90,
      familiarity: 5,
      offering: "W2022",
      currMark: 80,
      code: "CSC108H5",
      scoreRequired: 90,
      percentLeft: 0,
    },
  ],
};

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    addCourse(state, action) {},
    deleteCourse(state, action) {},
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
    updateAssessment(state, { payload }) {
      const { courseCode, assessment } = payload;
      const courseIndex = state.currentCourses.findIndex(
        (course) => course.code === courseCode
      );

      if (courseIndex === -1) {
        // Error handling
        return;
      }
      state.currentCourses[courseIndex].assessments = payload;
      // const indexToUpdate = state.currentCourses[
      //   courseIndex
      // ].assessments.findIndex((element) => element.name === assessment.name);
      // state.currentCourses[courseIndex].assessments[indexToUpdate] = assessment;
    },
  },
});

export const {
  addCourse,
  deleteAssessment,
  deleteCourse,
  addAssessment,
  updateAssessment,
} = coursesSlice.actions;
export default coursesSlice.reducer;
