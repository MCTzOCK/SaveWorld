/**
 * mobile/src/pages/teachers/Teachers.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 06.03.2024
 *
 */

import * as React from "react";
import Page from "../../components/Page";
import { $$ } from "../../translations/i18n";
import MobileBox from "../../components/MobileBox";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useRedirectForAnon } from "../../hooks/useRedirectForAnon";
import SchoolClassesList from "../../components/SchoolClassesList";

export default function Teachers() {
  useRedirectForAnon();
  return (
    <>
      <Page title={$$("pages.teachers.area")}>
        <MobileBox>
          <Tabs colorScheme={"brand"} size={"md"} isFitted>
            <TabList>
              <Tab>{$$("pages.teachers.my.classes")}</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <SchoolClassesList />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </MobileBox>
      </Page>
    </>
  );
}
