import { Container, Button, Typography, Box } from "@mui/material";
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
      <Typography variant="h1" color={COLORS[1]}>
        Dashboard
      </Typography>
      <br />
      <Typography variant="h6">Current Grade Breakdown</Typography>
      <Container
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <BarChart
          width={500}
          height={300}
          data={courses}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={"code"} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={"currMark"} fill={COLORS[0]} />
          <Bar dataKey={"expectedMark"} fill={COLORS[1]} />
        </BarChart>
        <PieChart
          width={450}
          height={450}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
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
      </Container>

      <Container
        style={{
          position: "fixed",
          bottom: "100px",
          right: "50px",
          left: "200px",
          backgroundColor: "#595959",
          width: "300px",
          height: "150px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Typography>Next Deadline</Typography>
          <Button
            variant="contained"
            color="primary"
            size="small"
            // sx={{ color: "white" }}
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
      <Container>
        <Typography> What to work on ? </Typography>
        <Typography> GOOGLE CALANDER</Typography>
      </Container>
    </Container>
  );
}

export default Dashboard;
