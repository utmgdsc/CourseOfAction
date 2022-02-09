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
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";

interface propTypes {
  courseInfo: {
    assessments: object;
    courseName: string;
    credit: number;
    expectedGrade: number;
    familiarity: number;
    offering: string;
    currGrade: number;
  };
}

function Course({ courseInfo }: propTypes) {
  return (
    <Container>
      <Box my={5}>
        <Typography variant="h1">CSC108H5</Typography>
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
          sx={{ backgroundColor: "highlight.main", borderRadius: 2 }}
          p={2}
          mx={3}
          my={2}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 900, fontSize: "25px" }}>
                    Assessment
                  </TableCell>
                  <TableCell sx={{ fontWeight: 900, fontSize: "25px" }}>
                    Weightage
                  </TableCell>
                  <TableCell sx={{ fontWeight: 900, fontSize: "25px" }}>
                    Marks
                  </TableCell>
                  <TableCell sx={{ fontWeight: 900, fontSize: "25px" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(courseInfo.assessments).map(([key, c], i) => (
                  <TableRow>
                    {console.log(key, c)}
                    <TableCell>
                      <TextField value={key} />
                    </TableCell>
                    <TableCell>
                      <TextField value={c.weight} />
                    </TableCell>
                    <TableCell>
                      <TextField value={c.mark} />
                    </TableCell>
                    <TableCell>
                      <IconButton aria-label="delete">
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
    </Container>
  );
}

export default Course;
