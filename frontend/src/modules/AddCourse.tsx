import {
  Container,
  Typography,
  Box,
  TextField,
  Slider,
  MenuItem,
  Button,
  Stack,
  Grid,
  Alert,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import FileUploader from "../components/Syllabus";
import { addCourse, Assessment, CourseInterface } from "../store/courses";
import Assessments from "../components/Assessments";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axios from "axios";
import { apiURL } from "../utils/constant";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import CustomSpinner from "../components/CustomSpinner";

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
    expectedMark: false,
    offering: false,
    code: false,
    parsing: false,
  });
  const [file, setFile] = useState<null | File>(null);
  const [spinner, setSpinner] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const mark = assessments.reduce(
      (n, { mark, weight }) => n + (mark * weight) / 100,
      0
    );
    if (mark >= 0 && mark < 110) {
      course.currMark = +mark.toFixed(2);
    }
    setCourse({ ...course, assessments: assessments });
  }, [assessments]);

  const handleChange = (event: any) => {
    const { value, name }: { name: string; value: any } = event.target;
    const newState = course;

    switch (name) {
      case "code":
        newState[name] = value;
        setErrors({ ...errors, [name]: validateCode(value) });
        break;
      case "name":
        newState[name] = value;
        break;
      case "credit":
        newState[name] = value;
        break;
      case "expectedMark":
        let v = value;
        if (value > 100) v = 100;
        if (value < 0) v = 0;
        newState[name] = v;
        setErrors({ ...errors, [name]: validateExpectedMark(v) });
        break;
      case "familiarity":
        newState[name] = value;
        break;
      case "offering":
        setErrors({ ...errors, [name]: validateOffering(value) });
        newState[name] = value;
        break;
      default:
        console.log("Name does not exist.");
    }
    setCourse({ ...course, ...newState });
  };

  const handleSubmit = () => {
    axios({
      method: "POST",
      url: `${apiURL}/add-course`,
      data: JSON.stringify(course),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        navigate("/");
        dispatch(addCourse(course));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const validateCode = (value: string) => {
    const regexEx = /^[A-Z]{3}[1-4][0-9]{2}H[135]$/im;
    return !value.toLowerCase().match(regexEx);
  };

  const validateExpectedMark = (value: number) => value.toString() === "";

  const validateOffering = (value: string) => {
    const regexEx = /^[WSYF][2][0-1][0-9]{2}$/im;
    return !value.toLowerCase().match(regexEx);
  };

  const canSubmit = () => {
    if (errors.code || errors.expectedMark || errors.offering) return true;
    if (
      course.name === "" ||
      course.code === "" ||
      course.offering === "" ||
      course.assessments.length === 0
    )
      return true;
    return false;
  };

  const getAssessment = () => {
    if (file) {
      let form = new FormData();
      form.append("file", file, file.name);
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      setFile(null);
      setSpinner(true);
      axios
        .post(`${apiURL}/parse-syllabus`, form, config)
        .then((res) => {
          setSpinner(false);
          setAssessments(res.data.assessments);
        })
        .catch(() => {
          setSpinner(false);
          setErrors({ ...errors, parsing: true });
        });
    }
  };

  return (
    <Container>
      <Typography variant="h1" mb={2}>
        Add Course
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
              error={errors.code}
            />
            <Typography mb={2}>
              Please follow the format of course code where first 3 characters
              are capital letter, followed by 3 numbers, H and 1/3/5. For
              example: CSC108H1, MGT130H5
            </Typography>
            <Typography variant="h6">Course Name</Typography>
            <TextField
              id="outlined-basic"
              variant="outlined"
              name="name"
              value={course.name}
              onChange={handleChange}
              sx={{ marginBottom: 2 }}
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
            <Typography variant="h6">Offering</Typography>
            <TextField
              id="outlined-basic"
              variant="outlined"
              name="offering"
              value={course.offering}
              error={errors.offering}
              onChange={handleChange}
            />
            <Typography mb={2}>
              Please follow the format of course offering where first letter is
              W/S/Y/F indicating each semesters, followed by year in YYYY
              format. For example: W2020, F2022
            </Typography>
            <Typography variant="h6">Credit</Typography>
            <TextField
              id="outlined-basic"
              select
              type="number"
              defaultValue={0.5}
              name="credit"
              value={course.credit}
              onChange={handleChange}
              sx={{ marginBottom: 2 }}
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
              error={errors.expectedMark}
            />
          </Grid>
        </Grid>
        <Typography variant="h2" mx={3} my={2}>
          Import Automatically
        </Typography>
        <Box
          mx={3}
          my={2}
          py={2}
          borderRadius="10px"
          sx={{ border: "2px solid", borderColor: "primary.main" }}
        >
          <Stack spacing={2}>
            {spinner ? (
              <div className="file-uploader">
                <CustomSpinner />
              </div>
            ) : (
              <FileUploader file={file} setFile={setFile} />
            )}
            <Box alignSelf="center">
              <Button
                variant="contained"
                sx={{ color: "white" }}
                disabled={!file}
                onClick={getAssessment}
              >
                Parse Syllabus
              </Button>
            </Box>
          </Stack>
        </Box>

        {errors.parsing ? (
          <Alert
            severity="error"
            onClose={() => setErrors({ ...errors, parsing: false })}
          >
            This kind of syllabus is not supported by our parser. Please enter
            assessments manually!
          </Alert>
        ) : null}

        <Assessments tableData={assessments} setTableData={setAssessments} />
        <Box textAlign="center">
          <Button
            variant="contained"
            color="success"
            size="large"
            sx={{ color: "white" }}
            onClick={handleSubmit}
            endIcon={<CheckCircleIcon />}
            disabled={canSubmit()}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default AddCourse;
