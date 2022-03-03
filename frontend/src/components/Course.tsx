import { Container, Typography, Box, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Assessments from "../components/Assessments";
import { CourseInterface, updateAssessment } from "../store/courses";

interface propTypes {
  courseInfo: CourseInterface;
}

function Course({ courseInfo }: propTypes) {
  // const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const dispatch = useDispatch();
  const [currAssessment, setCurrAssessment] = useState("");
  const [assessments, setAssessments] = useState(courseInfo.assessments);
  const [course, setCourse] = useState(courseInfo);
  useEffect(() => {
    // To update tabledata on assessments change
    setCourse({ ...course, assessments: assessments });
  }, [assessments]);
  console.log(assessments, courseInfo.assessments);
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
              {courseInfo.currMark}
            </Typography>
          </Stack>
          <Stack>
            <Typography variant="h2" color="primary.main">
              Expected Mark
            </Typography>
            <Typography
              variant="h2"
              fontSize="h1.fontSize"
              color="primary.main"
              align="center"
            >
              {courseInfo.expectedGrade}
            </Typography>
          </Stack>
          <Stack>
            <Typography variant="h2" color="orange.main">
              Current Grade
            </Typography>
            <Typography
              variant="h2"
              fontSize="h1.fontSize"
              color="orange.main"
              align="center"
            >
              {courseInfo.currGrade}
            </Typography>
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
