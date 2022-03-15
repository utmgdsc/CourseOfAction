import { Box, CircularProgress } from "@mui/material";
import React from "react";

interface propTypes {
  style: React.CSSProperties | undefined;
}

function CustomSpinner({ style }: propTypes) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100%",
      }}
    >
      <CircularProgress color="primary" style={style} />
    </Box>
  );
}

CustomSpinner.defaultProps = {
  style: undefined,
};

export default CustomSpinner;
