/**
 * mobile/src/pages/e2-projects/project/E2ProjectHomepage.tsx
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
import Page from "../../../components/Page";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { REST } from "@saveworld/api-js";
import PopupManager from "../../../util/PopupManager";
import { useIonRouter } from "@ionic/react";
import { useUserData } from "../../../hooks/useUserData";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
} from "@chakra-ui/react";
import { E2HomepageSegments } from "../../../util/types/E2HomepageSegment";
import E2ProjectHomepageSegment from "../../../components/E2ProjectHomepageSegment";

export default function E2ProjectHomepage() {
  useRedirectForAnon();

  const [project, setProject] = React.useState<E2Project | null>(null);

  const { userInfo } = useUserData();

  const { id } = useParams<{ id: string }>();
  const router = useIonRouter();

  useEffect(() => {
    reloadProject();
  }, [id]);

  const [segments, setSegments] = useState<E2HomepageSegments>([]);

  useEffect(() => {
    reloadSegments();
  }, [project]);

  const reloadSegments = async () => {
    if (!project) return;

    const res = await REST.EcoProjects.homepage(
      localStorage.getItem("token") as string,
      project._id,
    );

    if (res.status !== 200) {
      await PopupManager.alert({
        title: "Fehler",
        description:
          "Homepage konnte nicht geladen werden: " + res.payload.error,
      });
    } else {
      setSegments(res.payload.segments);
    }
  };

  const reloadProject = async () => {
    const res = await REST.EcoProjects.project(
      localStorage.getItem("token") as string,
      id,
    );

    if (res.status !== 200) {
      router.push("/eco-projects/my", "none", "replace");
    } else {
      setProject(res.payload.project);
    }
  };

  if (!project) {
    return (
      <>
        <Page title={"Laden..."}>Laden...</Page>
      </>
    );
  }

  return (
    <>
      <Page title={project.name}>
        {(project.owner === userInfo._id ||
          project.users.find(
            (u) => u.userId === userInfo._id && u.permissions !== "MEMBER",
          )) && (
          <>
            <Alert status={"info"}>
              <AlertIcon />
              <AlertDescription>
                Du kannst dieses Projekt bearbeiten!
                <Box w={"100%"}>
                  <Button
                    w={"100%"}
                    color={"var(--ion-color-success)"}
                    onClick={() => {
                      router.push(
                        "/e2-projects/" + project._id + "/edit",
                        "none",
                        "replace",
                      );
                    }}
                  >
                    Bearbeiten
                  </Button>
                </Box>
              </AlertDescription>
            </Alert>
          </>
        )}
        {segments
          .sort((a, b) => {
            return a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1;
          })
          .map((segment) => {
            return (
              <>
                <E2ProjectHomepageSegment
                  segment={segment}
                  editable={false}
                  reloadSegments={reloadSegments}
                />
              </>
            );
          })}
      </Page>
    </>
  );
}
