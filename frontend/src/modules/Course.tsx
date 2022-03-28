import { Container, Typography, Box, Stack, Alert } from "@mui/material";
import React, { useEffect, useState } from "react";
import Assessments from "../components/Assessments";
import courses, { CourseInterface } from "../store/courses";
import { useTheme } from "@mui/system";
import axios from "axios";
import { useDispatch } from "react-redux";
import { Tooltip as MUIToolTip } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { apiURL } from "../utils/constant";
import { updateAssessments } from "../store/courses";

interface propTypes {
  courseInfo: CourseInterface;
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
    <Stack alignItems={{ xs: "center", lg: "left" }} mb={{ xs: 2, lg: 0 }}>
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

function Course({ courseInfo }: propTypes) {
  const [assessments, setAssessments] = useState(courseInfo.assessments);
  const [course, setCourse] = useState(courseInfo);
  const [saveStatus, setSaveStatus] = useState({
    error: false,
    success: false,
  });
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const dispatch = useDispatch();

  useEffect(() => {
    // To update course state when rendering a new course
    setCourse(courseInfo);
    setAssessments(courseInfo.assessments);
  }, [courseInfo.code]);

  useEffect(() => {
    // To update tabledata on assessments change
    updateCourse();
  }, [assessments]);

  const data = [
    { name: "Completed", value: +(100 - course.percentLeft).toFixed(2) },
    { name: "Left", value: course.percentLeft },
  ];

  const COLORS = ["#00C49F", theme.palette.primary.main];

  const calculateGradeData = (desiredScore: number) => {
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
    let scoreRequired;
    if (percentLeft > 0)
      scoreRequired = +(
        (desiredScore - percentScored) *
        (100 / percentLeft)
      ).toFixed(2);
    else scoreRequired = 0;
    return {
      percentLeft,
      scoreRequired,
      percentScored,
    };
  };

  function saveAssessments() {
    const data = {
      assessments,
      code: courseInfo.code,
    };

    setLoading(true);

    axios
      .post(`${apiURL}/update-assessments`, data)
      .then(() => {
        setLoading(false);
        setSaveStatus({ ...saveStatus, success: true });
        dispatch(
          updateAssessments({ courseCode: courseInfo.code, assessments })
        );
        setCourse({ ...course, assessments });
        setTimeout(
          () => setSaveStatus({ ...saveStatus, success: false }),
          5000
        );
      })
      .catch(() => {
        setLoading(true);
        setSaveStatus({ ...saveStatus, error: true });
        setTimeout(() => setSaveStatus({ ...saveStatus, error: false }), 5000);
      });
  }

  const updateCourse = () => {
    const { percentLeft, scoreRequired, percentScored } = calculateGradeData(
      course.expectedMark
    );
    setCourse({
      ...course,
      scoreRequired,
      currMark: +percentScored.toFixed(2),
      percentLeft: percentLeft,
    });
  };

  return (
    <Container>
      <Box my={5}>
        <Typography variant="h1">{courseInfo.code}</Typography>
        <Stack
          direction={{ xs: "column", lg: "row" }}
          sx={{ direction: "column" }}
          justifyContent="space-between"
          mt="20px"
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
            title="Required Mark"
            desc={course.scoreRequired + "%"}
            color="primary.main"
            tooltip={
              <React.Fragment>
                You need to score {course.scoreRequired + "%"} in each
                assessment from now on to end up with your desired mark in this
                course which is {course.expectedMark}%
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
              other assignments (if any left), however please check if the
              syllabus you may still have to complete other assignments to pass
              the course!
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
              {` ${course.percentLeft}`}% of the course, which is impossible.
              Try changing your goal to something more realistic.
            </Typography>
          </Box>
        ) : null}

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
            disabled: assessments === course.assessments || loading,
          }}
          course={course.name}
        />
      </Box>
    </Container>
  );
}

export default Course;
