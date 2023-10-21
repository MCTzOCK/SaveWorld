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
import { useEffect } from "react";
import Calendar from "./calendar/Calendar";
import { ButtonGroup, Grid, IconButton, Text } from "@chakra-ui/react";
import moment from "moment";
import { FaBackward, FaForward } from "react-icons/fa";
import { REST } from "@saveworld/api-js";
import PopupManager from "../util/PopupManager";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from "@ionic/react";

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
  const [projects, setProjects] = React.useState<any[]>([]);

  useEffect(() => {
    REST.EcoProjects.projectsInPeriod(
      localStorage.getItem("token") as string,
      moment()
        .year(currentYear)
        .month(currentMonth)
        .startOf("month")
        .format("YYYY-MM-DD"),
      // @ts-ignore
      moment()
        .year(currentYear)
        .month(currentMonth)
        .endOf("month")
        .format("YYYY-MM-DD"),
    ).then((res) => {
      let x = [];

      setProjects(res.payload.result);

      for (const project of res.payload.result) {
        x.push(moment(project.startDate).date());
      }

      console.log(x);
      setDatesWithEvents(x);
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
          PopupManager.alert({
            title:
              "Projekte am " + d + "." + (currentMonth + 1) + "." + currentYear,
            description: (
              <>
                <Grid
                  templateColumns={[
                    "repeat(1, 1fr)",
                    "repeat(2, 1fr)",
                    "repeat(3, 1fr)",
                  ]}
                >
                  {projects
                    .filter((p) => {
                      return moment(p.startDate).date() === d;
                    })
                    .map((p) => {
                      return (
                        <IonCard
                          style={{
                            padding: 0,
                            margin: 0,
                          }}
                          routerLink={"/e2-projects/" + p._id}
                        >
                          <IonCardHeader>
                            <IonCardSubtitle>
                              {moment(p.startDate).format("DD.MM.YYYY")}-
                              {moment(p.startDate)
                                .add(p.lastsDays, "days")
                                .format("DD.MM.YYYY")}
                            </IonCardSubtitle>
                            <IonCardTitle>{p.name}</IonCardTitle>
                          </IonCardHeader>
                          <IonCardContent>
                            {p.geoLocationDisplayName}
                          </IonCardContent>
                        </IonCard>
                      );
                    })}
                </Grid>
              </>
            ),
          });
        }}
        datesWithEvents={datesWithEvents}
        onlyOnEventClick={true}
      />
    </>
  );
}
