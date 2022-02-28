import {
  Container,
  Typography,
  Box,
  TextField,
  Slider,
  MenuItem,
} from "@mui/material";
import React, { useState } from "react";
import FileUploader from "../components/Syllabus";
import { CourseInterface, Assessment } from "../store/courses";
import Assessments from "../components/Assessments";

function AddCourse() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  return (
    <Container>
      <Typography variant="h1">Add Course</Typography>
      <Typography variant="h2" my={2}>
        Import Automatically
      </Typography>
      <Box>
        <FileUploader />
      </Box>
      <Typography variant="h2" my={2}>
        Input Manually
      </Typography>
      <Box>
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "600px",
          }}
        >
          <Typography variant="h6">Course Code</Typography>
          <TextField id="outlined-basic" variant="outlined" />
          <Typography variant="h6">Course Name</Typography>
          <TextField id="outlined-basic" variant="outlined" />
          <Typography variant="h6">Credit</Typography>
          <TextField id="outlined-basic" select type="number">
            <MenuItem value={0.5}>0.5</MenuItem>
            <MenuItem value={1}>1</MenuItem>
          </TextField>
          <Typography variant="h6">Expected Grade</Typography>
          <TextField id="outlined-basic" variant="outlined" type="number" />
          <Typography variant="h6">Familiarity</Typography>
          <Slider
            aria-label="Small steps"
            defaultValue={5}
            step={1}
            marks
            min={0}
            max={10}
            valueLabelDisplay="auto"
          />
          <Typography variant="h6">Offering</Typography>
          <TextField id="outlined-basic" variant="outlined" />
        </form>
        <Assessments tableData={assessments} setTableData={setAssessments} />
      </Box>
    </Container>
  );
}

export default AddCourse;
