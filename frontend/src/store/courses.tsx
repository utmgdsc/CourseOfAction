import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StringLiteralLike } from "typescript";

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
  expectedGrade: number;
  familiarity: number;
  offering: string;
  currGrade: number;
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
          name: "assignment",
          customReminder: "2022/01/16", // Need to be date, error in database
          deadline: "2022/01/22", // Need to be date, error in database
          isCompleted: true, // Need to be boolean, error in database
          mark: 88,
          reminder: "2022/01/19", // Need to be date, error in database
          weight: 25,
        },
      ],
      name: "Introduction to Computer Programming",
      credit: 0.5,
      expectedGrade: 90,
      familiarity: 5,
      offering: "W2022",
      currGrade: 80,
      code: "CSC108H5",
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
  },
});

export const { addCourse, deleteAssessment, deleteCourse, addAssessment } =
  coursesSlice.actions;
export default coursesSlice.reducer;
