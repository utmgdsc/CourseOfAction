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
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { CourseInterface } from "./../store/courses";
import { deleteAssessment } from "../store/courses";

interface propTypes {
  courseInfo: CourseInterface;
}

function Course({ courseInfo }: propTypes) {
  const [open, setOpen] = useState(false);
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
              {courseInfo.currGrade}
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
            <Typography variant="h2" color="primary.main">
              Current Mark
            </Typography>
            <Typography
              variant="h2"
              fontSize="h1.fontSize"
              color="primary.main"
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
            onClick={() => setOpen(true)}
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
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courseInfo.assessments.map((c) => (
                  <TableRow>
                    <TableCell>
                      <TextField size="small" value={c.name} />
                    </TableCell>
                    <TableCell>
                      <TextField size="small" value={c.weight} />
                    </TableCell>
                    <TableCell>
                      <TextField size="small" value={c.mark} />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        aria-label="delete"
                        onClick={() =>
                          dispatch(
                            deleteAssessment({
                              courseCode: courseInfo.code,
                              assessmentName: c.name,
                            })
                          )
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Assessment</DialogTitle>
        <DialogContent>
          <DialogContentText color="white">
            Please fill in the following details to create a course.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Assignment Name"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Weightage"
            type="number"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Deadline date"
            type="date"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Notification date"
            type="date"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => setOpen(false)}>Add Course</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Course;
