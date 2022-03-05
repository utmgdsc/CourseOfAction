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
import React, { useEffect, useState } from "react";
import FileUploader from "../components/Syllabus";
import { Assessment, CourseInterface } from "../store/courses";
import Assessments from "../components/Assessments";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axios from "axios";
import { apiURL } from "../utils/constant";
import { useNavigate } from "react-router-dom";

function AddCourse() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [course, setCourse] = useState<CourseInterface>({
    assessments: [],
    name: "",
    credit: 0.5,
    expectedMark: 0,
    familiarity: 5,
    offering: "",
    currMark: 0,
    code: "",
    scoreRequired: 0,
    percentLeft: 0,
  });
  const [errors, setErrors] = useState({
    name: false,
    expectedMark: false,
    offering: false,
    code: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    setCourse({ ...course, assessments: assessments });
  }, [assessments]);

  const handleChange = (event: any) => {
    const { value, name }: { name: string; value: any } = event.target;
    const newState = course;

    switch (name) {
      case "code":
        newState[name] = value;
        break;
      case "name":
        newState[name] = value;
        break;
      case "credit":
        newState[name] = value;
        break;
      case "expectedMark":
        newState[name] = value;
        break;
      case "familiarity":
        newState[name] = value;
        break;
      case "offering":
        newState[name] = value;
        break;
      case "currMark":
        newState[name] = value;
        break;
      default:
        console.log("Name does not exist.");
    }
    setCourse({ ...course, ...newState });
  };

  const handleSubmit = () => {
    // Need to add this later
    // const authToken = "";
    const config = {
      headers: { "Content-Type": "multipart/form-data" },
    };
    axios
      .post(`${apiURL}/add_course`, course)
      .then((res) => {
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const validateCode = (value: string) => {
    const regexEx = /^[A-Z]{3}[1-4][0-9]{2}H[135]$/im;
    return !!value.toLowerCase().match(regexEx);
  };

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
            <TextField
              id="outlined-basic"
              variant="outlined"
              name="code"
              value={course.code}
              onChange={handleChange}
            />
            <Typography variant="h6">Offering</Typography>
            <TextField
              id="outlined-basic"
              variant="outlined"
              name="offering"
              value={course.offering}
              onChange={handleChange}
            />
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
                value={course.familiarity}
                name="familiarity"
                onChange={handleChange}
              />
            </Box>
          </Grid>
          <Grid container item xs={12} md={6} direction="column">
            <Typography variant="h6">Course Name</Typography>
            <TextField
              id="outlined-basic"
              variant="outlined"
              name="name"
              value={course.name}
              onChange={handleChange}
            />
            <Typography variant="h6">Credit</Typography>
            <TextField
              id="outlined-basic"
              select
              type="number"
              defaultValue={0.5}
              name="credit"
              value={course.credit}
              onChange={handleChange}
            >
              <MenuItem value={0.5}>0.5</MenuItem>
              <MenuItem value={1}>1</MenuItem>
            </TextField>
            <Typography variant="h6">Expected Grade</Typography>
            <TextField
              id="outlined-basic"
              variant="outlined"
              type="number"
              name="expectedMark"
              value={course.expectedMark}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
        <Assessments tableData={assessments} setTableData={setAssessments} />
        <Box textAlign="center">
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ color: "white" }}
            onClick={handleSubmit}
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
