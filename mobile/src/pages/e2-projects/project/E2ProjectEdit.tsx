/**
 * mobile/src/pages/e2-projects/project/E2ProjectEdit.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 14.10.2023
 *
 */

import * as React from "react";
import { useRedirectForAnon } from "../../../hooks/useRedirectForAnon";
import { E2Project } from "../../../util/types/E2Project";
import { useUserData } from "../../../hooks/useUserData";
import { useParams } from "react-router";
import { useIonRouter } from "@ionic/react";
import { useEffect } from "react";
import { REST } from "@saveworld/api-js";
import Page from "../../../components/Page";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import E2ProjectEditDetails from "../../../components/E2ProjectEditDetails";
import MobileBox from "../../../components/MobileBox";
import E2ProjectEditHomepage from "../../../components/E2ProjectEditHomepage";
import E2ProjectEditMembers from "../../../components/E2ProjectEditMembers";
import { $$ } from "../../../translations/i18n";

export default function E2ProjectEdit() {
  useRedirectForAnon();

  const [project, setProject] = React.useState<E2Project | null>(null);

  const { userInfo, loggedIn } = useUserData();

  const { id } = useParams<{ id: string }>();
  const router = useIonRouter();

  useEffect(() => {
    reloadProject();
  }, [id]);

  useEffect(() => {
    if (!project || !loggedIn) return;

    if (
      project.owner !== userInfo._id &&
      !["ADMINISTRATOR", "EDITOR"].includes(
        project.users.find((u) => u.userId === userInfo._id)?.permissions ||
          "NONE",
      )
    ) {
      router.push("/e2-projects/" + id, "none", "replace");
    }
  }, [loggedIn, userInfo, project]);

  const reloadProject = async () => {
    const res = await REST.EcoProjects.project(
      localStorage.getItem("token") as string,
      id,
    );

    if (res.status !== 200) {
      router.push("/e2-projects/" + id, "none", "replace");
    } else {
      setProject(res.payload.project);
    }
  };

  if (!project) {
    return (
      <>
        <Page title={$$("general.loading")}>{$$("general.loading")}</Page>
      </>
    );
  }

  return (
    <>
      <Page title={$$("pages.e2projects.edit.title")}>
        <MobileBox>
          <Tabs colorScheme={"brand"} size={"md"} isFitted>
            <TabList maxW={"100%"} overflow={"auto"} overflowY={"hidden"}>
              <Tab>{$$("general.information")}</Tab>
              <Tab>{$$("pages.e2projects.homepage")}</Tab>
              <Tab>{$$("pages.e2projects.members")}</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <E2ProjectEditDetails
                  project={project}
                  setProject={setProject}
                />
              </TabPanel>
              <TabPanel>
                <E2ProjectEditHomepage project={project} />
              </TabPanel>
              <TabPanel>
                <E2ProjectEditMembers
                  project={project}
                  reloadProject={reloadProject}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </MobileBox>
      </Page>
    </>
  );
}
