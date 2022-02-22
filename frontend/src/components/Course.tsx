import {
  Container,
  Table,
  Typography,
  Box,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Stack,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  addAssessment,
  CourseInterface,
  updateAssessment,
} from "./../store/courses";
import { deleteAssessment } from "../store/courses";

interface propTypes {
  courseInfo: CourseInterface;
}

function Course({ courseInfo }: propTypes) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [addAsssessmentInfo, setAddAsssessmentInfo] = useState({
    name: "",
    customReminder: "", // Need to be date, error in database
    deadline: "", // Need to be date, error in database
    isCompleted: false, // Need to be boolean, error in database
    mark: 0,
    reminder: "", // Need to be date, error in database
    weight: 0,
  });
  const dispatch = useDispatch();

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
        <Box
          sx={{ display: "flex", justifyContent: "space-between", mb: "10px" }}
          mx={3}
          my={2}
        >
          <Typography variant="h2">Assessments</Typography>
          <Button
            variant="contained"
            color="primary"
            size="medium"
            sx={{ color: "white" }}
            onClick={() => setIsAddOpen(true)}
          >
            Add Assessment
          </Button>
        </Box>
        <Box
          sx={{ backgroundColor: "highlight.main", borderRadius: 2 }}
          p={2}
          mx={3}
          my={2}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 900, fontSize: "18px" }}>
                    Assessment
                  </TableCell>
                  <TableCell sx={{ fontWeight: 900, fontSize: "18px" }}>
                    Weightage
                  </TableCell>
                  <TableCell sx={{ fontWeight: 900, fontSize: "18px" }}>
                    Marks
                  </TableCell>
                  <TableCell sx={{ fontWeight: 900, fontSize: "18px" }}>
                    Deadline
                  </TableCell>
                  <TableCell sx={{ fontWeight: 900, fontSize: "18px" }}>
                    Reminder
                  </TableCell>
                  <TableCell sx={{ fontWeight: 900, fontSize: "18px" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courseInfo.assessments.map((c) => (
                  <TableRow>
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{c.weight}</TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        size="small"
                        value={c.mark}
                        onChange={(e) =>
                          dispatch(
                            updateAssessment({
                              courseCode: courseInfo.code,
                              assessment: {
                                ...c,
                                mark: parseFloat(e.target.value),
                              },
                            })
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>{c.deadline}</TableCell>
                    <TableCell>{c.customReminder}</TableCell>
                    <TableCell>
                      <IconButton aria-label="edit">
                        <Edit />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        onClick={() => setIsDeleteOpen(true)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                    {/* Delete Assessment */}
                    <Dialog
                      open={isDeleteOpen}
                      onClose={() => setIsDeleteOpen(false)}
                    >
                      <DialogTitle>Delete Assessment</DialogTitle>
                      <DialogContent>
                        <DialogContentText color="white">
                          Are you sure you want to delete this assessment ?
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={() => setIsDeleteOpen(false)}>
                          No
                        </Button>
                        <Button
                          onClick={() => {
                            dispatch(
                              deleteAssessment({
                                courseCode: courseInfo.code,
                                assessmentName: c.name,
                              })
                            );
                            setIsDeleteOpen(false);
                          }}
                        >
                          Yes
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      {/* Add Assessment Dialog */}
      <Dialog open={isAddOpen} onClose={() => setIsAddOpen(false)}>
        <DialogTitle>Add Assessment</DialogTitle>
        <DialogContent>
          <DialogContentText color="white">
            Please fill in the following details to create a course.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Assignment name"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => {
              setAddAsssessmentInfo((addAssessment) => ({
                ...addAssessment,
                name: e.target.value,
              }));
            }}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Weightage"
            type="number"
            fullWidth
            variant="standard"
            onChange={(e) => {
              setAddAsssessmentInfo((addAssessment) => ({
                ...addAssessment,
                weight: parseFloat(e.target.value),
              }));
            }}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Deadline date"
            type="date"
            fullWidth
            variant="standard"
            InputLabelProps={{ shrink: true }}
            onChange={(e) => {
              setAddAsssessmentInfo((addAssessment) => ({
                ...addAssessment,
                deadline: e.target.value,
              }));
            }}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Notification date"
            type="date"
            fullWidth
            variant="standard"
            InputLabelProps={{ shrink: true }}
            onChange={(e) => {
              setAddAsssessmentInfo((addAssessment) => ({
                ...addAssessment,
                customReminder: e.target.value,
              }));
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              dispatch(
                addAssessment({
                  courseCode: courseInfo.code,
                  assessment: addAsssessmentInfo,
                })
              );
              setIsAddOpen(false);
            }}
          >
            Add Assessment
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Course;
