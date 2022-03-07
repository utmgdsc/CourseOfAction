import { Container, Button, Typography, Box, Grid } from "@mui/material";
import { CourseInterface } from "../store/courses";
import {
  BarChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Bar,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
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
      { name: "Completed", value: currentWeight },
      { name: "Left", value: percentLeft - currentWeight },
    ];
  };
  let data = calculateGradeData();
  const COLORS = ["#00C49F", theme.palette.primary.main];

  return (
    <Container>
      <Typography variant="h3" color={COLORS[1]}>
        Dashboard
      </Typography>
      <br />
      <Typography variant="h6">Current Grade Breakdown</Typography>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={6}>
          <Typography variant="h6">CGPA data here</Typography>
        </Grid>
        <Grid item md={3}>
          <PieChart width={250} height={250}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              // innerRadius={40}
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
        </Grid>
        <Grid item xs={6}>
          <Box component="span" sx={{ p: 2 }}>
            <BarChart
              width={500}
              height={200}
              data={courses}
              // margin={{
              //   top: 5,
              //   right: 30,
              //   left: 20,
              //   bottom: 5,
              // }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={"code"} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={"currMark"} fill={COLORS[0]} />
              <Bar dataKey={"expectedMark"} fill={COLORS[1]} />
            </BarChart>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Container
            style={{
              backgroundColor: "#595959",
              borderRadius: "18px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",

                // justifyContent: "space-between",
                // borderRadius: "10px",
                // position: "absolute",
                // bottom: "0",
                // right: "0",
              }}
            >
              <Typography>Next Deadline</Typography>
              <Button
                variant="contained"
                color="primary"
                size="small"
                // sx={{ }}
                // onClick={handleSubmit}
                // endIcon={<CheckCircleIcon />}
                // disabled={canSubmit()}
              >
                More
              </Button>
            </Box>
            <Typography>CSCI1030 - Deadline</Typography>
            <Typography>CSCI1030 - Deadline</Typography>
            <Typography>CSCI1030 - Deadline</Typography>
          </Container>
        </Grid>
        <Grid>
          <Container
            style={{
              // display: "flex",
              alignItems: "center",
            }}
          >
            <Typography> What to work on ? </Typography>
            <Typography> GOOGLE CALANDER</Typography>
          </Container>
        </Grid>
      </Grid>
      <Container
        style={{
          display: "flex",
          alignItems: "center",
        }}
      ></Container>
    </Container>
  );
}

export default Dashboard;
