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

export default function E2Projects() {
  useRedirectForAnon();

  return (
    <>
      <Page title={"Projekte"}>
        <MobileBox>
          <Tabs colorScheme={"saveworld_green"} size={"md"} isFitted>
            <TabList>
              <Tab>Liste</Tab>
              <Tab>Karte</Tab>
              <Tab>Kalender</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <h1>Liste</h1>
              </TabPanel>
              <TabPanel>
                <h1>Karte</h1>
              </TabPanel>
              <TabPanel>
                <h1>Kalender</h1>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </MobileBox>
      </Page>
    </>
  );
}
