import { Container, Typography, Box, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import Assessments from "../components/Assessments";
import { CourseInterface, updateAssessment } from "../store/courses";
import { useTheme } from "@mui/system";
import { Tooltip as MUIToolTip } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { TooltipProps } from "@mui/material/Tooltip";

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
  const theme = useTheme();

  useEffect(() => {
    // To update tabledata on assessments change
    updateCourse();
  }, []);

  useEffect(() => {
    // To update tabledata on assessments change
    updateCourse();
  }, [assessments]);

  const data = [
    { name: "Completed", value: 100 - course.percentLeft },
    { name: "Left", value: course.percentLeft },
  ];

  const COLORS = ["#00C49F", theme.palette.primary.main];

  const calculateGradeData = (desiredScore: number) => {
    let currentWeight: number = 0;
    let percentScored = 0;
    assessments.forEach((assessment) => {
      const { mark, weight } = assessment;
      currentWeight += weight;
      percentScored += (mark / 100) * weight;
    });
    // Overall Percentages
    const percentLeft = 100 - parseFloat(currentWeight.toFixed(2));
    let scoreRequired;
    if (percentLeft > 0)
      scoreRequired = parseFloat(
        ((desiredScore - percentScored) * (100 / percentLeft)).toFixed(2)
      );
    else scoreRequired = 0;

    return {
      percentLeft,
      scoreRequired,
      percentScored,
    };
  };

  const updateCourse = () => {
    const { percentLeft, scoreRequired, percentScored } = calculateGradeData(
      course.expectedMark
    );
    setCourse({
      ...course,
      scoreRequired,
      currMark: percentScored,
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
          mx={10}
        >
          <Info
            title="Current Percent"
            desc={course.currMark + "%"}
            color="green.main"
            tooltip={
              <React.Fragment>
                <Typography color="inherit">Tooltip with HTML</Typography>
                <em>{"And here's"}</em> <b>{"some"}</b>{" "}
                <u>{"amazing content"}</u>. {"It's very engaging. Right?"}
              </React.Fragment>
            }
          />
          <Info
            title="Required Percent"
            desc={course.scoreRequired + "%"}
            color="primary.main"
            tooltip={null}
          />
          <Info
            title=""
            color=""
            tooltip={null}
            desc={
              <PieChart width={150} height={150}>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  // innerRadius={40}
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
            }
          />
        </Stack>

        {course.scoreRequired < 0 ? (
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

        <Assessments tableData={assessments} setTableData={setAssessments} />
      </Box>
    </Container>
  );
}

export default Course;
