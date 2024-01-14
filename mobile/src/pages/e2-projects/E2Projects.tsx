/**
 * mobile/src/pages/e2-projects/E2Projects.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 15.10.2023
 *
 */

import * as React from "react";
import { useRedirectForAnon } from "../../hooks/useRedirectForAnon";
import Page from "../../components/Page";
import MobileBox from "../../components/MobileBox";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import E2FindProjectsList from "../../components/E2FindProjectsList";
import Calendar from "../../components/calendar/Calendar";
import E2FindProjectsCalendar from "../../components/E2FindProjectsCalendar";
import E2FindProjectsMap from "../../components/E2FindProjectsMap";
import { $$ } from "../../translations/i18n";

export default function E2Projects() {
  useRedirectForAnon();

  return (
    <>
      <Page title={$$("menu.projects")}>
        <MobileBox>
          <Tabs colorScheme={"brand"} size={"md"} isFitted>
            <TabList>
              <Tab>{$$("pages.e2projects.list")}</Tab>
              <Tab>{$$("pages.e2projects.map")}</Tab>
              <Tab>{$$("pages.e2projects.calendar")}</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <E2FindProjectsList />
              </TabPanel>
              <TabPanel>
                <E2FindProjectsMap />
              </TabPanel>
              <TabPanel>
                <E2FindProjectsCalendar />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </MobileBox>
      </Page>
    </>
  );
}
