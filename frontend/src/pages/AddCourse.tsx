import { Container, Typography, Box } from "@mui/material";
import React from "react";
import FileUploader from "../components/Syllabus";

function AddCourse() {
  return <Container>
       <Typography variant="h1">Add Course</Typography><br/>
       <Typography variant="h2">Import Automatically</Typography>
       <Box >
           <FileUploader />
        </Box><br/>
       <Typography variant="h2">Import Manually</Typography>

  </Container>;
}

export default AddCourse;