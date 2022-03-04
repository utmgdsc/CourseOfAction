import { createTheme } from "@mui/material/styles";

const dark_theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1700,
    },
  },
  palette: {
    mode: "dark",
    primary: {
      main: "#00A1DF",
    },
    secondary: {
      main: "#0256C4",
    },
    green: {
      main: "#118A7E",
    },
    orange: {
      main: "#e63900",
    },
    background: {
      paper: "#1B1B22",
    },
    popup: {
      main: "#2E2E33",
    },
    text: {
      primary: "#ffffff",
      secondary: "#00A1DF",
    },
    navBackgorund: {
      main: "#484848",
    },
    highlight: {
      main: "#2E2E33",
    },
  },
  typography: {
    h1: {
      fontSize: 72,
      fontWeight: 900,
    },
    h2: {
      fontSize: 32,
      fontWeight: 600,
    },
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#484848",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: "#484848",
        },
      },
    },
  },
});

const light_theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1700,
    },
  },
  palette: {
    mode: "light",
    primary: {
      main: "#00A1DF",
    },
    secondary: {
      main: "#0256C4",
    },
    green: {
      main: "#118A7E",
    },
    orange: {
      main: "#e63900",
      secondary: "#00A1DF",
    },
    background: {
      paper: "#FFFFF7",
    },
    popup: {
      main: "#D3D3D3",
    },
    text: {
      primary: "#000",
      secondary: "#00A1DF",
    },
    navBackgorund: {
      main: "#D3D3D3",
    },
    highlight: {
      main: "#D3D3D3",
    },
  },
  typography: {
    h1: {
      fontSize: 72,
      fontWeight: 900,
    },
    h2: {
      fontSize: 32,
      fontWeight: 600,
    },
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#D3D3D3",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: "#D3D3D3",
        },
      },
    },
  },
});

export { dark_theme, light_theme };
