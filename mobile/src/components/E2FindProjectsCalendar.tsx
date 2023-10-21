/**
 * mobile/src/components/E2FindProjectsCalendar.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.10.2023
 *
 */

import * as React from "react";
import Calendar from "./calendar/Calendar";
import { ButtonGroup, IconButton, Text } from "@chakra-ui/react";
import moment from "moment";
import { FaBackward, FaForward } from "react-icons/fa";
import { useEffect } from "react";
import { REST } from "@saveworld/api-js";

export default function E2FindProjectsCalendar() {
  const minMonth = new Date().getUTCMonth();
  const minYear = new Date().getUTCFullYear();

  const [currentMonth, setCurrentMonth] = React.useState<number>(
    new Date().getUTCMonth(),
  );
  const [currentYear, setCurrentYear] = React.useState<number>(
    new Date().getUTCFullYear(),
  );

  const [datesWithEvents, setDatesWithEvents] = React.useState<number[]>([]);

  useEffect(() => {
    REST.EcoProjects.projectsInPeriod(
      localStorage.getItem("token") as string,
      moment()
        .year(currentYear)
        .month(currentMonth)
        .startOf("month")
        .format("YYYY-MM-DD"),
      moment().year(currentYear).month(currentMonth).daysInMonth(),
    ).then((res) => {
      let x = [];

      for (const project of res.payload.results) {
        for (
          let i = moment(project.startDate).day();
          i < project.lastsDays;
          i++
        ) {
          if (
            i ==
            moment().year(currentYear).month(currentMonth).endOf("month").day()
          )
            break;

          x.push(i);
        }
      }

      setDatesWithEvents([]);
    });
  }, [currentMonth, currentYear]);

  return (
    <>
      <Text textAlign={"center"} mb={2}>
        {new Date(currentYear, currentMonth).toLocaleString("default", {
          month: "long",
          year: "numeric",
        })}
      </Text>
      <ButtonGroup mb={4} display={"flex"} justifyContent={"center"}>
        <IconButton
          aria-label={"Zurück"}
          icon={<FaBackward />}
          onClick={() => {
            let newMonth = currentMonth - 1;
            let newYear = currentYear;
            if (newMonth < 1) {
              newMonth = 11;
              newYear--;
            }
            setCurrentMonth(newMonth);
            setCurrentYear(newYear);
          }}
          isDisabled={currentMonth === minMonth && currentYear === minYear}
        />
        <IconButton
          aria-label={"Vorwärts"}
          icon={<FaForward />}
          onClick={() => {
            let newMonth = currentMonth + 1;
            let newYear = currentYear;
            if (newMonth > 11) {
              newMonth = 0;
              newYear++;
            }
            setCurrentMonth(newMonth);
            setCurrentYear(newYear);
          }}
        />
      </ButtonGroup>
      <Calendar
        month={currentMonth}
        year={currentYear}
        onDayClick={(d) => {
          alert(d);
        }}
        datesWithEvents={datesWithEvents}
      />
    </>
  );
}
