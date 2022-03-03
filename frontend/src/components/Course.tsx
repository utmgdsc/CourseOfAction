import { Container, Typography, Box, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import Assessments from "../components/Assessments";
import { CourseInterface, updateAssessment } from "../store/courses";
import { Doughnut } from "react-chartjs-2";
import { useTheme } from "@mui/system";
import { Chart, ArcElement } from "chart.js";
Chart.register(ArcElement);

interface propTypes {
  courseInfo: CourseInterface;
}

function Course({ courseInfo }: propTypes) {
  // const [isDeleteOpen, setIsDeleteOpen] = useState(false);
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

  const data = {
    labels: ["Completed", "Left"],
    datasets: [
      {
        label: "Completed",
        data: [100 - course.percentLeft, course.percentLeft],
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.text.primary,
        ],
        hoverOffset: 2,
      },
    ],
  };

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
    // const percentLost = currentWeight - percentScored
    const scoreRequired = parseFloat(
      ((desiredScore - percentScored) * (100 / percentLeft)).toFixed(2)
    );

    console.log(scoreRequired, desiredScore);

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
        <Stack direction="row" justifyContent="space-between" mt="20px" mx={10}>
          <Stack>
            <Typography variant="h2" color="green.main">
              Current Mark
            </Typography>
            <Typography
              variant="h2"
              fontSize="h1.fontSize"
              color="green.main"
              align="center"
            >
              {course.currMark}
            </Typography>
          </Stack>
          <Stack>
            <Typography variant="h2" color="primary.main">
              Required Score
            </Typography>
            <Typography
              variant="h2"
              fontSize="h1.fontSize"
              color="primary.main"
              align="center"
            >
              {course.scoreRequired}
            </Typography>
          </Stack>
          <Stack alignContent="center">
            <Typography
              textAlign="center"
              variant="h2"
              mb={2}
              color="primary.main"
            >
              {100 - course.percentLeft}% Completed
            </Typography>

            <Doughnut
              data={data}
              options={{
                maintainAspectRatio: true,
                responsive: true,
                layout: {
                  autoPadding: true,
                },
                plugins: {},
              }}
            />
          </Stack>
        </Stack>

        <Assessments tableData={assessments} setTableData={setAssessments} />
      </Box>

      {/* Delete Assessment
      <Dialog open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
        <DialogTitle>Delete Assessment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this assessment?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteOpen(false)}>No</Button>
          <Button
            onClick={() => {
              console.log(currAssessment);
              dispatch(
                deleteAssessment({
                  courseCode: courseInfo.code,
                  assessmentName: currAssessment,
                })
              );
              const indexToDelete = assessments.findIndex(
                (e) => e.name === currAssessment
              );
              assessments.splice(indexToDelete, 1);
              setAssessments(assessments);
              setIsDeleteOpen(false);
            }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog> */}
    </Container>
  );
}

export default Course;
