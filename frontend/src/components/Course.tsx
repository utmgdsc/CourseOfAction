import { Container, Typography, Box, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import Assessments from "../components/Assessments";
import { CourseInterface, updateAssessment } from "../store/courses";

interface propTypes {
  courseInfo: CourseInterface;
}

function Course({ courseInfo }: propTypes) {
  // const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [assessments, setAssessments] = useState(courseInfo.assessments);
  const [course, setCourse] = useState(courseInfo);

  useEffect(() => {
    // To update tabledata on assessments change
    updateCourse();
  }, []);

  useEffect(() => {
    // To update tabledata on assessments change
    updateCourse();
  }, [assessments]);

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
          {/* <Stack></Stack> */}
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
