import { Box, Container, Stack, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { CourseInterface } from "../store/courses";
import { RootState } from "../store/index";
import "./calendar.css";

class CalendarEvent {
  title: string;
  allDay: boolean;
  start: Date;
  end: Date;
  hexColor: string;
  desc?: string;
  resourceId?: string;
  tooltip?: string;

  constructor(
    _title: string,
    _start: Date,
    _endDate: Date,
    _hexCode: string,
    _allDay?: boolean,
    _desc?: string,
    _resourceId?: string
  ) {
    this.title = _title;
    this.allDay = _allDay || false;
    this.start = _start;
    this.hexColor = _hexCode;
    this.end = _endDate;
    this.desc = _desc || "";
    this.resourceId = _resourceId;
  }
}

function Upcoming() {
  const courses: CourseInterface[] = useSelector(
    (store: RootState) => store.courses.currentCourses
  );
  const localizer = momentLocalizer(moment);

  let deadlines: CalendarEvent[] = [];

  const stringToColour = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let colour = "#";
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      colour += ("00" + value.toString(16)).substr(-2);
    }
    return colour;
  };

  function wcHexIsLight(color: string) {
    const hex = color.replace("#", "");
    const cr = parseInt(hex.substr(0, 2), 16);
    const cg = parseInt(hex.substr(2, 2), 16);
    const cb = parseInt(hex.substr(4, 2), 16);
    const brightness = (cr * 299 + cg * 587 + cb * 114) / 1000;
    return brightness > 155;
  }

  const getAssessmentsDeadlines = function (c: CourseInterface) {
    for (let i = 0; i < c.assessments.length; i++) {
      if (
        c.assessments[i].deadline &&
        (c.assessments[i].deadline !== "" || c.assessments[i].deadline !== null)
      )
        deadlines.push({
          title: c.assessments[i].name,
          start: new Date(c.assessments[i].deadline),
          end: new Date(c.assessments[i].deadline),
          allDay: true,
          hexColor: stringToColour(c.code),
        });
    }
  };

  courses.forEach(getAssessmentsDeadlines);

  const eventStyleGetter = (
    event: CalendarEvent,
    start: any,
    end: any,
    isSelected: any
  ) => {
    const color = wcHexIsLight(event.hexColor) ? "black" : "white";
    const style = {
      backgroundColor: event.hexColor,
      color,
    };
    return {
      style,
    };
  };

  const legendColor = courses.map((c) => {
    return { code: c.code, color: stringToColour(c.code) };
  });

  return (
    <Container sx={{ marginBottom: 5 }}>
      <Stack mb={4}>
        {legendColor.length !== 0
          ? legendColor.map((c) => (
              <Box display="flex" alignItems="center">
                <Box
                  width="30px"
                  height="20px"
                  mr={1}
                  sx={{ backgroundColor: c.color }}
                />
                <Typography>{c.code}</Typography>
              </Box>
            ))
          : null}
      </Stack>
      <Calendar
        localizer={localizer}
        events={deadlines}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        eventPropGetter={eventStyleGetter}
      />
    </Container>
  );
}

export default Upcoming;
