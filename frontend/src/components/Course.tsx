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
} from "@mui/material";
import React from "react";

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
) {
  return { name, calories, fat, carbs, protein };
}

const course = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

function Course() {
  return (
    <Container>
      <Box my={5}>
        <Typography variant="h1">CSC108H5</Typography>
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
                {course.map((c) => (
                  <TableRow>
                    <TableCell>
                      <TextField value={c.name} />
                    </TableCell>
                    <TableCell>
                      <TextField value={c.carbs} />
                    </TableCell>
                    <TableCell>
                      <TextField value={c.fat} />
                    </TableCell>
                    <TableCell>
                      <TextField value={c.calories} />
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
