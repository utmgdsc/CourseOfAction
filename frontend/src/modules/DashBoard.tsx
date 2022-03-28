import { Container, Button, Typography, Box, Grid } from "@mui/material";
import { CourseInterface } from "../store/courses";
import {
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "@mui/system";

interface propTypes {
  courses: CourseInterface[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: "#ffff",
          padding: "5px",
          border: "1px solid #cccc",
          color: "black",
        }}
      >
        <label>{`${payload[0].value}% ${payload[0].name} `}</label>
      </div>
    );
  }

  return null;
};

function Dashboard({ courses }: propTypes) {
  const theme = useTheme();
  if (courses.length == 0) {
    return (
      <Container>
        <Typography variant="h1" color="primary.main">
          Dashboard
        </Typography>
        <br></br>
        <Typography variant="h6" color="primary.secondary">
          Click "Add Courses" to update your semester so you can see cool
          visuals regarding your progress.
        </Typography>
      </Container>
    );
  }
  //use this function to find percent left data for the completion chart
  const calculateGradeData = () => {
    let currentWeight: number = 0;
    let percentLeft: number = 100 * courses.length;
    courses.forEach((course) => {
      course.assessments.forEach((assessment) => {
        const { weight } = assessment;
        currentWeight += weight;
      });
    });
    return [
      {
        name: "Completed",
        value: +(currentWeight / courses.length).toFixed(2),
      },
      {
        name: "Left",
        value: +((percentLeft - currentWeight) / courses.length).toFixed(2),
      },
    ];
  };
  let data = calculateGradeData();
  const COLORS = ["#00C49F", theme.palette.primary.main];

  return (
    <Container>
      <Typography variant="h1" color="primary.main">
        Dashboard
      </Typography>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12} lg={6} textAlign={{ xs: "center", lg: "left" }}>
          <Typography variant="h6">CGPA data here</Typography>
        </Grid>
        <Grid item xs={12} lg={6} sx={{ height: "300px" }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={90}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  ></Cell>
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </Grid>
        <Grid item xs={12} lg={6} sx={{ width: "100%", height: "200px" }}>
          <ResponsiveContainer>
            <BarChart height={200} data={courses}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={"code"} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={"currMark"} fill={COLORS[0]} />
              <Bar dataKey={"expectedMark"} fill={COLORS[1]} />
            </BarChart>
          </ResponsiveContainer>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Box
            style={{
              backgroundColor: "#595959",
              borderRadius: "18px",
            }}
            p={3}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
              pb={2}
            >
              <Typography variant="h5">Next Deadline</Typography>
              <Button
                variant="contained"
                color="primary"
                size="small"
                sx={{ ml: 2, color: "white" }}
              >
                More
              </Button>
            </Box>
            <Box>
              <Typography ml={3}>CSCI1030 - Deadline</Typography>
              <Typography ml={3}>CSCI1030 - Deadline</Typography>
              <Typography ml={3}>CSCI1030 - Deadline</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box
            style={{
              alignItems: "center",
            }}
          >
            <Typography> What to work on ? </Typography>
            <Typography> GOOGLE CALANDER</Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;
