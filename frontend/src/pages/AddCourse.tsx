import {
  Container,
  Typography,
  Box,
  TextField,
  Slider,
  MenuItem,
  Button,
  Grid,
} from "@mui/material";
import React, { useState } from "react";
import FileUploader from "../components/Syllabus";
import { CourseInterface, Assessment } from "../store/courses";
import Assessments from "../components/Assessments";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
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
      <Box mb={4}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 3, md: 6 }}>
          <Grid container item xs={12} md={6} direction="column">
            <Typography variant="h6">Course Code</Typography>
            <TextField id="outlined-basic" variant="outlined" />
            <Typography variant="h6">Offering</Typography>
            <TextField id="outlined-basic" variant="outlined" />
            <Typography variant="h6">Familiarity</Typography>
            <Box mt={1.5}>
              <Slider
                aria-label="Small steps"
                defaultValue={5}
                step={1}
                marks
                min={0}
                max={10}
                valueLabelDisplay="auto"
              />
            </Box>
          </Grid>
          <Grid container item xs={12} md={6} direction="column">
            <Typography variant="h6">Course Name</Typography>
            <TextField id="outlined-basic" variant="outlined" />
            <Typography variant="h6">Credit</Typography>
            <TextField
              id="outlined-basic"
              select
              type="number"
              defaultValue={0.5}
            >
              <MenuItem value={0.5}>0.5</MenuItem>
              <MenuItem value={1}>1</MenuItem>
            </TextField>
            <Typography variant="h6">Expected Grade</Typography>
            <TextField id="outlined-basic" variant="outlined" type="number" />
          </Grid>
        </Grid>
        {/* </Box> */}
        <Assessments tableData={assessments} setTableData={setAssessments} />
        <Box textAlign="center">
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ color: "white" }}
            onClick={() => console.log(1)}
            endIcon={<CheckCircleIcon />}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default AddCourse;
