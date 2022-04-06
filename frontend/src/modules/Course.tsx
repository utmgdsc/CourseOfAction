import {
  Container,
  Typography,
  Box,
  Stack,
  Alert,
  TextField,
  Slider,
  Grid,
  Button,
  DialogActions,
  DialogTitle,
  Dialog,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Assessments from "../components/Assessments";
import { CourseInterface } from "../store/courses";
import { useTheme } from "@mui/system";
import InfoIcon from "@mui/icons-material/Info";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Tooltip as MUIToolTip } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { apiURL } from "../utils/constant";
import {
  updateAssessments,
  updateCourse,
  deleteCourse as deleteCourseRedux,
} from "../store/courses";

interface propTypes {
  courseInfo: CourseInterface;
  notification: 0 | 1;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: "#ffff",
          padding: "5px",
          border: "1px solid #cccc",
          color: "black",
        }}
      >
        <label>{`${payload[0].value}% ${payload[0].name} `}</label>
      </div>
    );
  }

  return null;
};

interface InfoInterface {
  title: string;
  desc: React.ReactChild | string;
  color: string;
  tooltip: null | NonNullable<React.ReactNode>;
}

const Info = ({ title, desc, color, tooltip }: InfoInterface) => {
  const stack = (
    <Stack
      alignItems={{ xs: "center", lg: "left" }}
      mt={{ xs: 0, lg: 2 }}
      mb={{ xs: 2, lg: 0 }}
    >
      <Typography variant="h2" color={color}>
        {title}
      </Typography>
      {typeof desc === "object" ? (
        desc
      ) : (
        <Typography variant="h2" fontSize="h1.fontSize" color={color}>
          {desc}
        </Typography>
      )}
    </Stack>
  );
  return tooltip && typeof tooltip === "object" ? (
    <MUIToolTip title={tooltip}>{stack}</MUIToolTip>
  ) : (
    stack
  );
};

function Course({ courseInfo, notification }: propTypes) {
  const [assessments, setAssessments] = useState(courseInfo.assessments);
  const [course, setCourse] = useState({
    ...courseInfo,
    scoreRequired: 0,
    percentLeft: 0,
  });
  const [saveStatus, setSaveStatus] = useState({
    error: false,
    success: false,
  });
  const [saveCourseInfoStatus, setSaveCourseInfoStatus] = useState({
    error: false,
    success: false,
  });
  const [loading, setLoading] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState({
    open: false,
    error: false,
    loading: false,
  });
  const theme = useTheme();
  const dispatch = useDispatch();
  const updatedCourseInfo =
    course.expectedMark !== courseInfo.expectedMark ||
    course.familiarity !== courseInfo.familiarity;
  const navigate = useNavigate();

  useEffect(() => {
    // To update course state when rendering a new course
    setCourse({ ...courseInfo, scoreRequired: 0, currMark: 0, percentLeft: 0 });
    setAssessments(courseInfo.assessments);
  }, [courseInfo]);

  useEffect(() => {
    // calculate grade data on assignment table change
    let currentWeight: number = 0;
    let percentScored: number = 0;
    assessments.forEach((assessment) => {
      const { mark, weight } = assessment;
      if (mark !== -1 && mark !== null) {
        currentWeight += weight;
        percentScored += (mark / 100) * weight;
      }
    });
    // Overall Percentages
    currentWeight = +currentWeight.toFixed(2);
    percentScored = +percentScored.toFixed(2);
    const percentLeft = +(100 - currentWeight).toFixed(2);
    let scoreRequired: number;
    if (percentLeft > 0)
      scoreRequired = +(
        (course.expectedMark - percentScored) *
        (100 / percentLeft)
      ).toFixed(2);
    else scoreRequired = 0;

    // Update course on assessments change
    setCourse((course) => ({
      ...course,
      scoreRequired: scoreRequired,
      currMark: +percentScored.toFixed(2),
      percentLeft: percentLeft,
    }));
  }, [assessments, course.expectedMark, courseInfo]);

  const data = [
    { name: "Completed", value: +(100 - course.percentLeft).toFixed(2) },
    { name: "Left", value: course.percentLeft },
  ];

  const COLORS = ["#00C49F", theme.palette.primary.main];

  function saveAssessments() {
    const assessments_temp = assessments.map((assessment) => {
      if (assessment.mark === null) return { ...assessment, mark: -1 };
      return assessment;
    });
    const data = {
      assessments: assessments_temp,
      code: course.code,
      currMark: course.currMark,
    };

    setLoading(true);

    axios
      .post(`${apiURL}/update-assessments`, data)
      .then(() => {
        setLoading(false);
        setSaveStatus({ ...saveStatus, success: true });
        dispatch(updateAssessments(data));
        setCourse({ ...course, assessments });
        setTimeout(
          () => setSaveStatus({ ...saveStatus, success: false }),
          5000
        );
      })
      .catch(() => {
        setLoading(false);
        setSaveStatus({ ...saveStatus, error: true });
        setTimeout(() => setSaveStatus({ ...saveStatus, error: false }), 5000);
      });
  }

  const handleChange = (e: any) => {
    const { value, name }: { name: string; value: any } = e.target;
    const newState = course;

    switch (name) {
      case "expectedMark":
        let v = value;
        if (value > 100) v = 100;
        if (value < 0) v = 0;
        newState[name] = v;
        break;
      case "familiarity":
        newState[name] = value;
        break;
      default:
        console.log("Name does not exist.");
    }
    setCourse({ ...course, ...newState });
  };

  const saveCourseInfo = () => {
    const data = {
      expectedMark: course.expectedMark,
      familiarity: course.familiarity,
      code: courseInfo.code,
    };
    axios
      .patch(`${apiURL}/update-course`, data)
      .then(() => {
        setSaveCourseInfoStatus({ ...saveCourseInfoStatus, success: true });
        dispatch(updateCourse(data));
        setCourse({ ...course, ...data });
        setTimeout(
          () =>
            setSaveCourseInfoStatus({
              ...saveCourseInfoStatus,
              success: false,
            }),
          5000
        );
      })
      .catch((e) => {
        console.log(e);
        setSaveCourseInfoStatus({ ...saveCourseInfoStatus, error: true });
        setTimeout(
          () =>
            setSaveCourseInfoStatus({ ...saveCourseInfoStatus, error: false }),
          5000
        );
      });
  };

  const deleteCourse = () => {
    setDeleteInfo({ ...deleteInfo, loading: true });
    const data = { code: courseInfo.code };

    axios
      .post(`${apiURL}/delete-course`, data)
      .then(() => {
        navigate("/dashboard");
        dispatch(deleteCourseRedux(data));
      })
      .catch((e) => {
        setDeleteInfo({ ...deleteInfo, loading: false, error: true });
        setTimeout(
          () => setDeleteInfo({ open: false, loading: false, error: false }),
          5000
        );
        console.log(e);
      });
  };

  return (
    <Container>
      {/* Course does not delete */}
      {deleteInfo.error ? (
        <Alert
          severity="error"
          onClose={() => setDeleteInfo({ ...deleteInfo, error: false })}
        >
          There was an error therefore we could not delete this course please
          try again!
        </Alert>
      ) : null}
      <Dialog
        open={deleteInfo.open}
        onClose={() => {
          setDeleteInfo({ ...deleteInfo, open: false });
        }}
      >
        <DialogTitle>Are you sure you want to delete this course?</DialogTitle>
        <DialogActions>
          <Button
            onClick={() => {
              setDeleteInfo({ ...deleteInfo, open: false });
            }}
          >
            Cancel
          </Button>
          <Button onClick={deleteCourse}>Continue</Button>
        </DialogActions>
      </Dialog>
      <Box my={5}>
        <Box
          display="flex"
          flexWrap="wrap"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h1">{course.code}</Typography>
          <Button
            variant="contained"
            color="primary"
            size="medium"
            sx={{ color: "white" }}
            disabled={deleteInfo.loading}
            onClick={() => {
              setDeleteInfo({ ...deleteInfo, open: true });
            }}
          >
            Delete Course
          </Button>
        </Box>
        {/* Status as we update the course information on the backend */}
        {saveCourseInfoStatus.error ? (
          <Alert
            severity="error"
            onClose={() =>
              setSaveStatus({ ...saveCourseInfoStatus, error: false })
            }
          >
            There was an error therefore we could not update your information
            please try again!
          </Alert>
        ) : null}

        {saveCourseInfoStatus.success ? (
          <Alert
            severity="success"
            onClose={() =>
              setSaveStatus({ ...saveCourseInfoStatus, success: false })
            }
          >
            The course information was updated!
          </Alert>
        ) : null}
        <Box display="flex" justifyContent="flex-end">
          <Button
            variant="outlined"
            color="success"
            size="medium"
            disabled={!updatedCourseInfo}
            onClick={saveCourseInfo}
          >
            Save
          </Button>
        </Box>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 3, md: 6 }}>
          <Grid container item xs={12} md={6} direction="column">
            <Box display="flex" alignItems="center">
              <Typography variant="h6" mr={1}>
                Familiarity
              </Typography>
              <MUIToolTip title="Familiarity is used to determine the number of reminders you'll get. 5 indicates highest familiarity, getting 1 reminder on the reminder day, while 1 indicates lowest familiarity getting 5 reminders with 2-day intervals.">
                <InfoIcon />
              </MUIToolTip>
            </Box>
            <Box mt={1.5}>
              <Slider
                aria-label="Small steps"
                defaultValue={5}
                step={1}
                marks
                min={1}
                max={5}
                valueLabelDisplay="auto"
                value={course.familiarity}
                name="familiarity"
                onChange={handleChange}
              />
            </Box>
          </Grid>
          <Grid container item xs={12} md={6} direction="column">
            <Typography variant="body1">Expected Grade</Typography>
            <TextField
              variant="outlined"
              type="number"
              name="expectedMark"
              value={course.expectedMark}
              onChange={handleChange}
              sx={{ marginLeft: "10px" }}
            />
          </Grid>
        </Grid>

        <Stack
          direction={{ xs: "column", lg: "row" }}
          sx={{
            alignItems: { xs: "", lg: "center" },
            direction: "column",
            backgroundColor: "navBackgorund.secondary",
            borderRadius: 4,
          }}
          position="relative"
          justifyContent="space-between"
          mt="20px"
          mb="10px"
          p={4}
        >
          <Info
            title="Current Percent"
            desc={course.currMark + "%"}
            color="green.main"
            tooltip={
              <React.Fragment>
                This is the percentage you have in the course as of the mark you
                provided
              </React.Fragment>
            }
          />
          <Info
            title="Required Percent"
            desc={+(course.expectedMark - course.currMark).toFixed(2) + "%"}
            color="primary.main"
            tooltip={
              <React.Fragment>
                You need to score{" "}
                {+(course.expectedMark - course.currMark).toFixed(2) + "%"} in
                the remaining {course.percentLeft}% course assessments to get{" "}
                {course.expectedMark}% in this course
              </React.Fragment>
            }
          />
          <Info
            title="Required Avg"
            desc={course.scoreRequired + "%"}
            color="primary.main"
            tooltip={
              <React.Fragment>
                You need to score an averge of {course.scoreRequired + "%"} in
                each assessment from now on to end up with your desired mark in
                this course which is {course.expectedMark}%
              </React.Fragment>
            }
          />
          <Info
            title=""
            color=""
            tooltip={null}
            desc={
              <Box width={150} height={150}>
                <ResponsiveContainer>
                  <PieChart width={150} height={150}>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      dataKey="value"
                    >
                      {data.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        ></Cell>
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            }
          />
        </Stack>

        {course.scoreRequired < 0 ||
        course.expectedMark - course.currMark < 0 ? (
          <Box border={1} borderColor="green.main" borderRadius={4} p={5}>
            <Typography variant="h5" color="green.main">
              Good Job! You achieved your goal.
            </Typography>
            <Typography variant="subtitle1">
              Technically you have achieved the your goal grade you can skip the
              other assignments (if any left), however please check the syllabus
              as you may still have to complete other assignments to pass the
              course!
            </Typography>
          </Box>
        ) : null}

        {course.scoreRequired > 100 ? (
          <Box border={1} borderColor="red" borderRadius={4} p={5}>
            <Typography variant="h5" color="red">
              Not possible! You cannot achieve this grade.
            </Typography>
            <Typography variant="subtitle1">
              To achieve this grade you need to get a grade of{" "}
              {`${course.scoreRequired}`}% in the remaining
              {` ${course.percentLeft}`}% of the course, which is impossible!
              Try changing your goal to something more realistic.
            </Typography>
          </Box>
        ) : null}

        {/* Status as we update the assessments on the backend */}
        {saveStatus.error ? (
          <Alert
            severity="error"
            onClose={() => setSaveStatus({ ...saveStatus, error: false })}
          >
            There was an error therefore we could not update your information
            please try again!
          </Alert>
        ) : null}

        {saveStatus.success ? (
          <Alert
            severity="success"
            onClose={() => setSaveStatus({ ...saveStatus, success: false })}
          >
            The assessment information was updated
          </Alert>
        ) : null}

        <Assessments
          tableData={assessments}
          setTableData={setAssessments}
          save={{
            function: saveAssessments,
            disabled: assessments === courseInfo.assessments || loading,
          }}
          course={course.code}
        />
      </Box>
    </Container>
  );
}

export default Course;
