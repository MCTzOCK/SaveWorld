/**
 * mobile/src/pages/eatingplans/EatingPlanOverview.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 29.12.2023
 *
 */

import * as React from "react";
import Page from "../../components/Page";
import { useRedirectForAnon } from "../../hooks/useRedirectForAnon";
import { useIonRouter } from "@ionic/react";
import Calendar from "../../components/calendar/Calendar";
import MobileBox from "../../components/MobileBox";
import { ButtonGroup, IconButton, Text } from "@chakra-ui/react";
import { FaBackward, FaForward } from "react-icons/fa";
import { REST } from "@saveworld/api-js/index";
import { $$ } from "../../translations/i18n";

export default function EatingPlanOverview() {
  useRedirectForAnon();
  const router = useIonRouter();
  const [month, setMonth] = React.useState(new Date().getMonth());
  const [year, setYear] = React.useState(new Date().getFullYear());

  return (
    <>
      <Page title={$$("menu.eatingplans")}>
        <MobileBox>
          <Text textAlign={"center"} mb={2}>
            {new Date(year, month).toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </Text>
          <Calendar
            month={month}
            year={year}
            onDayClick={async (d) => {
              const existsRes = await REST.EatingPlans.eatingPlan(
                localStorage.getItem("token") as string,
                `${year}-${month + 1}-${d}`,
              );

              if (existsRes.status !== 200) {
                const createRes = await REST.EatingPlans.create(
                  localStorage.getItem("token") as string,
                  `${year}-${month + 1}-${d}`,
                );
              }

              router.push("/eatingplans/" + `${year}-${month + 1}-${d}`);
            }}
            datesWithEvents={[]}
          />
          <ButtonGroup mt={4} display={"flex"} justifyContent={"center"}>
            <IconButton
              aria-label={$$("control.back")}
              icon={<FaBackward />}
              onClick={() => {
                let newMonth = month - 1;
                let newYear = year;
                if (newMonth < 1) {
                  newMonth = 11;
                  newYear--;
                }
                setMonth(newMonth);
                setYear(newYear);
              }}
              isDisabled={
                month === new Date().getMonth() &&
                year === new Date().getFullYear()
              }
            />
            <IconButton
              aria-label={$$("control.next")}
              icon={<FaForward />}
              onClick={() => {
                let newMonth = month + 1;
                let newYear = year;
                if (newMonth > 11) {
                  newMonth = 0;
                  newYear++;
                }
                setMonth(newMonth);
                setYear(newYear);
              }}
            />
          </ButtonGroup>
        </MobileBox>
      </Page>
    </>
  );
}
