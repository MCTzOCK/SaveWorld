/**
 * mobile/src/pages/admin/AdminVideoDashboard.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 03.09.2023
 *
 */

import * as React from "react";
import { useRedirectForAnon } from "../../hooks/useRedirectForAnon";
import { useParams } from "react-router";
import { useEffect } from "react";
import { REST } from "@saveworld/api-js";
import Page from "../../components/Page";
import {
  IonInput,
  IonItem,
  IonList,
  IonText,
  IonTextarea,
  IonToggle,
  useIonRouter,
} from "@ionic/react";
import PopupManager from "../../util/PopupManager";
import { Box, Flex } from "@chakra-ui/react";

export default function AdminVideoDashboard() {
  useRedirectForAnon({
    onlyAdmins: true,
  });

  const [video, setVideo] = React.useState<{
    _id: string;
    title: string;
    description: string;
    streamUrl: string;
    thumbnailUrl: string;
    categories: string[];
    sources: string[];
  } | null>(null);

  const [categories, setCategories] = React.useState<
    {
      _id: string;
      name: string;
      description: string;
      image: string;
    }[]
  >([]);

  const { id } = useParams<{ id: string }>();

  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    [],
  );

  const [sources, setSources] = React.useState<string[]>([]);

  useEffect(() => {
    REST.Content.videoMetadata(id).then((res) => {
      if (res.status === 200) {
        setVideo(res.payload.video);
        setSelectedCategories(res.payload.video.categories);
        setSources(res.payload.video.sources);
      } else {
        PopupManager.alert({
          title: "Fehler",
          description: "Fehler beim Laden des Videos: " + res.payload.error,
        });
      }
    });
    REST.Content.categories().then((res) => {
      if (res.status === 200) {
        setCategories(res.payload as any);
      } else {
        PopupManager.alert({
          title: "Fehler",
          description: "Fehler beim Laden der Kategorien: " + res.payload.error,
        });
      }
    });
  }, []);

  const router = useIonRouter();

  return (
    <>
      <Page title={video?.title || "Laden..."} redGradient>
        {video && (
          <>
            <Flex
              w={"100%"}
              justifyContent={["flex-start", "center"]}
              alignItems={["flex-start", "center"]}
              minH={"100vh"}
            >
              <Box w={["100%", "75%", "50%", "25%"]} minW={"200px"}>
                <IonList inset>
                  <IonItem color={"light"}>
                    <IonInput
                      label={"Titel"}
                      value={video.title}
                      labelPlacement={"fixed"}
                      id={"update-video-title"}
                    />
                  </IonItem>
                  <IonItem color={"light"}>
                    <IonTextarea
                      label={"Beschreibung"}
                      value={video.description}
                      labelPlacement={"fixed"}
                      id={"update-video-desc"}
                    />
                  </IonItem>
                  <IonItem color={"light"}>
                    <IonTextarea
                      placeholder={"Quellen (eine pro Zeile)"}
                      label={"Quellen"}
                      labelPlacement={"fixed"}
                      autoGrow
                      id={"create-vid-sources"}
                      value={sources.join("\n")}
                      onIonChange={(ev) => {
                        setSources(ev.detail.value?.split("\n") || []);
                      }}
                    />
                  </IonItem>
                  {categories.map((c) => {
                    return (
                      <>
                        <IonItem color={"light"}>
                          <IonToggle
                            slot={"end"}
                            checked={selectedCategories.includes(c._id)}
                            onIonChange={(ev) => {
                              if (ev.detail.checked) {
                                setSelectedCategories([
                                  ...selectedCategories,
                                  c._id,
                                ]);
                              } else {
                                setSelectedCategories(
                                  selectedCategories.filter(
                                    (sc) => sc !== c._id,
                                  ),
                                );
                              }
                            }}
                          />
                          {c.name}
                        </IonItem>
                      </>
                    );
                  })}
                  <IonItem
                    color={"light"}
                    detail
                    onClick={async () => {
                      const title = (
                        document.getElementById(
                          "update-video-title",
                        ) as HTMLIonInputElement
                      ).value as string;
                      const desc = (
                        document.getElementById(
                          "update-video-desc",
                        ) as HTMLIonTextareaElement
                      ).value as string;

                      const res = await REST.Admin.updateVideo(
                        localStorage.getItem("token") as string,
                        video!._id,
                        title,
                        desc,
                        selectedCategories,
                        sources,
                      );
                      if (res.status === 200) {
                        PopupManager.alert({
                          title: "Erfolgreich",
                          description:
                            "Das Video wurde erfolgreich aktualisiert!",
                          callback: () => {
                            router.push(router.routeInfo.pathname);
                          },
                        });
                      } else {
                        PopupManager.alert({
                          title: "Fehler",
                          description:
                            "Fehler beim Aktualisieren des Videos: " +
                            res.payload.error,
                        });
                      }
                    }}
                  >
                    <IonText color={"primary"}>Speichern</IonText>
                  </IonItem>
                  <IonItem
                    color={"light"}
                    detail
                    onClick={async () => {
                      if (
                        !(await PopupManager.confirmAsync({
                          title: "Löschen",
                          question: "Möchtest du das Video wirklich löschen?",
                        }))
                      )
                        return;

                      const res = await REST.Admin.deleteVideo(
                        localStorage.getItem("token") as string,
                        video?._id,
                      );

                      if (res.status === 200) {
                        PopupManager.alert({
                          title: "Erfolgreich",
                          description: "Das Video wurde gelöscht!",
                          callback: () => {
                            router.push(router.routeInfo.pathname);
                          },
                        });
                      } else {
                        PopupManager.alert({
                          title: "Fehler",
                          description:
                            "Fehler beim Löschen des Videos: " +
                            res.payload.error,
                        });
                      }
                    }}
                  >
                    <IonText color={"danger"}>Löschen</IonText>
                  </IonItem>
                </IonList>
              </Box>
            </Flex>
          </>
        )}
      </Page>
    </>
  );
}
