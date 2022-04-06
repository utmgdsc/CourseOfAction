import {
  Container,
  Typography,
  Box,
  TextField,
  Slider,
  Button,
  Stack,
  Grid,
  Alert,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import FileUploader from "../components/Syllabus";
import { addCourse, Assessment, CourseInterface } from "../store/courses";
import Assessments from "../components/Assessments";
import { Tooltip as MUIToolTip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoIcon from "@mui/icons-material/Info";
import axios from "axios";
import { apiURL } from "../utils/constant";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CustomSpinner from "../components/CustomSpinner";
import { RootState } from "../store/index";

function AddCourse() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [course, setCourse] = useState<CourseInterface>({
    assessments: [],
    expectedMark: 0,
    familiarity: 5,
    currMark: 0,
    offering: "",
    code: "",
    notification: 1,
  });
  const [errors, setErrors] = useState({
    expectedMark: false,
    offering: false,
    code: false,
    parsing: false,
  });
  const [file, setFile] = useState<null | File>(null);
  const [spinner, setSpinner] = useState(false);
  const reduxCourses = useSelector(
    (store: RootState) => store.courses.currentCourses
  );

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
      case "expectedMark":
        let v = value;
        if (value > 100) v = 100;
        if (value < 0) v = 0;
        newState[name] = Number(v);
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
    const data = {
      ...course,
      expectedMark: Number(course.expectedMark),
    };
    axios({
      method: "POST",
      url: `${apiURL}/add-course`,
      data,
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
    const notAnotherCourseName =
      reduxCourses.filter((c) => c.code === value).length === 0;
    return !value.toLowerCase().match(regexEx) || !notAnotherCourseName;
  };

  const validateExpectedMark = (value: number) => value.toString() === "";

  const validateOffering = (value: string) => {
    const regexEx = /^[WSYF][2][0-1][0-9]{2}$/im;
    return !value.toLowerCase().match(regexEx);
  };

  const canSubmit = () => {
    if (errors.code || errors.expectedMark || errors.offering) return true;
    if (
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
            <Box display="flex" alignItems="center">
              <Typography variant="h6" mr={1}>
                Familiarity
              </Typography>
              <MUIToolTip title="Familiarity is used to determine the number of reminders you'll get. 5 indicates highest familiarity, getting 1 reminder on the reminder day, while 1 indicates lowest familiarity getting 5 reminders with 2-day intervals.">
                <InfoIcon />
              </MUIToolTip>
            </Box>
            <Box mt={1.5}>
              <Slider
                aria-label="Small steps"
                defaultValue={5}
                step={1}
                marks
                min={1}
                max={5}
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

        <Assessments
          tableData={assessments}
          setTableData={setAssessments}
          course="New Course"
        />
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
