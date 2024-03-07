/**
 * mobile/src/pages/teachers/TeachersClassViewer.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 07.03.2024
 *
 */

import * as React from "react";
import { useRedirectForAnon } from "../../hooks/useRedirectForAnon";
import Page from "../../components/Page";
import { $$ } from "../../translations/i18n";
import MobileBox from "../../components/MobileBox";
import { useParams } from "react-router";
import { REST } from "@saveworld/api-js/REST";
import PopupManager from "../../util/PopupManager";
import {
  Flex,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useEffect } from "react";
import SchoolClassesList from "../../components/SchoolClassesList";

export default function TeachersClassViewer() {
  useRedirectForAnon();
  const { id } = useParams<{ id: string }>();

  const [c, sc] = React.useState<{
    _id: string;
    createdAt: string;
    createdBy: string;
    name: string;
    students: string[];
  } | null>(null);

  const reloadClass = async () => {
    const res = await REST.School.class(
      localStorage.getItem("token") as string,
      id,
    );

    if (res.status !== 200) {
      await PopupManager.alertAsync({
        title: $$("control.error"),
        description: res.payload.error,
      });
      return;
    }
    sc(res.payload.schoolClass);
  };

  useEffect(() => {
    reloadClass();
  }, []);

  return (
    <Page title={c !== null ? c.name : $$("pages.teachers.my.class")}>
      <MobileBox>
        {c === null ? (
          <>
            <Flex
              w={"100%"}
              h={"100vh"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Spinner size={"xl"} color={"brand.500"} />
            </Flex>
          </>
        ) : (
          <>
            <Tabs colorScheme={"brand"} size={"md"} isFitted>
              <TabList>
                <Tab>{$$("pages.teachers.classes.students")}</Tab>
                <Tab>{$$("pages.teachers.classes.actions")}</Tab>
              </TabList>
              <TabPanels>
                <TabPanel></TabPanel>
                <TabPanel></TabPanel>
              </TabPanels>
            </Tabs>
          </>
        )}
      </MobileBox>
    </Page>
  );
}
